"""FastAPI service for the Community Health Risk Radar prototype.

This module keeps the serving layer thin:
- validate incoming patient data with Pydantic
- forward the payload to `calculate_risk()` in `risk_engine.py`
- return the exact JSON response produced by the scoring engine
"""

from __future__ import annotations

import re
from typing import Literal

import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from fastapi import HTTPException, Header, Depends
from typing import Optional
import secrets
import hashlib
import bcrypt

try:
    from . import db
except Exception:  # pragma: no cover - support running as a script
    import db

try:
    from .risk_engine import calculate_risk
except ImportError:  # pragma: no cover - allows direct execution in simple setups
    from risk_engine import calculate_risk


class PatientData(BaseModel):
    age: int = Field(..., ge=0, le=120, description="Patient age in years")
    systolic_bp: int = Field(..., ge=0, le=300, description="Systolic blood pressure")
    diastolic_bp: int = Field(..., ge=0, le=200, description="Diastolic blood pressure")
    bmi: float = Field(..., gt=0, le=100, description="Body mass index")
    family_history: bool = Field(..., description="Family history of chronic disease")
    activity_level: Literal["low", "medium", "high"] = Field(..., description="Physical activity level")
    diet_quality: Literal["poor", "average", "good"] = Field(..., description="Diet quality")


app = FastAPI(
    title="Community Health Risk Radar API",
    description="FastAPI wrapper around the explainable health risk scoring engine.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


_HASH_PREFIX = "sha256$"
_USERNAME_MIN_LENGTH = 3
_USERNAME_MAX_LENGTH = 20
_USERNAME_PATTERN = re.compile(r"^[A-Za-z][A-Za-z0-9_]*$")


def _password_digest(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def _hash_password(password: str) -> str:
    """Hash a password using SHA-256 then bcrypt to avoid bcrypt's 72-byte limit."""
    digest = _password_digest(password).encode("utf-8")
    return f"{_HASH_PREFIX}{bcrypt.hashpw(digest, bcrypt.gensalt()).decode('utf-8')}"


def _validate_username(username: str) -> str:
    cleaned = username.strip()
    if (
        len(cleaned) < _USERNAME_MIN_LENGTH
        or len(cleaned) > _USERNAME_MAX_LENGTH
        or not _USERNAME_PATTERN.fullmatch(cleaned)
    ):
        raise HTTPException(status_code=400, detail='invalid-username')
    return cleaned


def _verify_password(stored_hash: str, password: str, user_id: int | None = None) -> bool:
    """
    Verify a password against stored hash.
    - New hashes are stored as `sha256$<bcrypt hash>`.
    - Legacy bcrypt hashes are still supported for existing users.
    - Legacy SHA256 hex hashes are also supported.
    """
    digest = _password_digest(password)

    try:
        if stored_hash.startswith(_HASH_PREFIX):
            return bcrypt.checkpw(
                digest.encode("utf-8"),
                stored_hash[len(_HASH_PREFIX):].encode("utf-8"),
            )

        # bcrypt/passlib style starts with $2b$ or $2a$ etc.
        if stored_hash.startswith('$'):
            return bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8"))
    except Exception:
        pass

    # Fallback: legacy SHA-256 hex
    try:
        if len(stored_hash) == 64 and all(c in '0123456789abcdef' for c in stored_hash.lower()):
            return digest == stored_hash
    except Exception:
        pass

    return False


def _require_user(token: Optional[str] = Header(None)):
    if not token:
        raise HTTPException(status_code=401, detail='Missing auth token')
    sess = db.get_session(token)
    if not sess or sess['expires_at'] < int(__import__('time').time()):
        raise HTTPException(status_code=401, detail='Invalid or expired token')
    user = db.get_user_by_id(sess['user_id'])
    if not user:
        raise HTTPException(status_code=401, detail='Unknown user')
    return user


@app.on_event('startup')
def _init_db_on_startup():
    db.init_db()


class AuthPayload(BaseModel):
    username: str
    password: str
    name: Optional[str] = None


@app.post('/auth/register')
def register(p: AuthPayload):
    try:
        username = _validate_username(p.username)
        existing = db.get_user_by_username(username)
        if existing:
            raise HTTPException(status_code=400, detail='username-taken')
        uid = db.create_user(username, _hash_password(p.password), p.name)
        token = secrets.token_urlsafe(32)
        db.create_session(token, uid)
        return { 'token': token, 'username': username, 'name': p.name }
    except HTTPException:
        raise
    except ValueError as exc:
        if str(exc) == 'username-taken':
            raise HTTPException(status_code=400, detail='username-taken')
        raise HTTPException(status_code=400, detail='invalid-username')
    except Exception:
        raise HTTPException(status_code=500, detail='register-error')


@app.post('/auth/login')
def login(p: AuthPayload):
    try:
        username = _validate_username(p.username)
        user = db.get_user_by_username(username)
        if not user or not _verify_password(user['password_hash'], p.password, user['id']):
            raise HTTPException(status_code=401, detail='invalid-credentials')
        token = secrets.token_urlsafe(32)
        db.create_session(token, user['id'])
        return { 'token': token, 'username': user['username'], 'name': user.get('name') }
    except HTTPException:
        raise
    except ValueError:
        raise HTTPException(status_code=400, detail='invalid-username')
    except Exception:
        raise HTTPException(status_code=500, detail='login-error')


@app.post('/auth/logout')
def logout(token: Optional[str] = Header(None)):
    if token:
        db.delete_session(token)
    return { 'ok': True }


@app.get('/auth/me')
def get_my_profile(user=Depends(_require_user)):
    # user is a dict from db.get_user_by_id
    return { 'username': user['username'], 'name': user.get('name'), 'id': user['id'] }


class UpdateProfilePayload(BaseModel):
    name: Optional[str]


@app.patch('/auth/me')
def update_my_profile(payload: UpdateProfilePayload, user=Depends(_require_user)):
    if payload.name is not None:
        db.update_user_name(user['id'], payload.name)
    updated = db.get_user_by_id(user['id'])
    return { 'username': updated['username'], 'name': updated.get('name'), 'id': updated['id'] }


class ChangePasswordPayload(BaseModel):
    current_password: str
    new_password: str


@app.post('/auth/change-password')
def change_password(payload: ChangePasswordPayload, user=Depends(_require_user)):
    # verify current password
    stored = db.get_user_by_id(user['id'])
    if not stored:
        raise HTTPException(status_code=401, detail='unknown-user')
    if not _verify_password(stored['password_hash'], payload.current_password, user['id']):
        raise HTTPException(status_code=401, detail='invalid-current-password')
    if len(payload.new_password) < 6:
        raise HTTPException(status_code=400, detail='new-password-too-short')
    db.update_user_password(user['id'], _hash_password(payload.new_password))
    return { 'ok': True }



@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "Community Health Risk Radar API"}


@app.post("/assess")
def assess_risk(patient_data: PatientData) -> dict:
    return calculate_risk(patient_data.model_dump())


def main() -> None:
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=False)


if __name__ == "__main__":
    main()
