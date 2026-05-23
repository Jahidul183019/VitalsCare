"""(Moved) Migration helper — kept under backend for convenience.

Note: you asked to use Postgres directly and not run a migration. This file was moved
from `scripts/` for reference and can be removed if you don't plan to use it.

It contains the same logic as the original script and only runs when explicitly executed.
"""
import os
import sqlite3
from pathlib import Path
import sys
import time

DATABASE_URL = os.environ.get('DATABASE_URL')
if not DATABASE_URL:
    print('Please set DATABASE_URL to your target Postgres database (Supabase connection string).')
    sys.exit(2)

try:
    import psycopg2
    import psycopg2.extras
except Exception as e:
    print('psycopg2 is required to run this migration. Install with: pip install psycopg2-binary')
    raise

SQLITE_PATH = Path(__file__).resolve().parent / 'data.sqlite3'
if not SQLITE_PATH.exists():
    print('SQLite DB not found at', SQLITE_PATH)
    sys.exit(1)

def read_sqlite_data():
    conn = sqlite3.connect(SQLITE_PATH)
    conn.row_factory = sqlite3.Row
    cur = conn.cursor()
    cur.execute('SELECT * FROM users')
    users = [dict(r) for r in cur.fetchall()]
    cur.execute('SELECT * FROM sessions')
    sessions = [dict(r) for r in cur.fetchall()]
    conn.close()
    return users, sessions

def ensure_pg_schema(pg):
    cur = pg.cursor()
    cur.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            name TEXT
        )
    ''')
    cur.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            expires_at BIGINT NOT NULL,
            FOREIGN KEY(user_id) REFERENCES users(id)
        )
    ''')
    pg.commit()

def migrate():
    users, sessions = read_sqlite_data()
    print(f'Found {len(users)} users and {len(sessions)} sessions in SQLite')
    pg = psycopg2.connect(DATABASE_URL)
    ensure_pg_schema(pg)
    cur = pg.cursor()

    for u in users:
        cur.execute('SELECT id FROM users WHERE username = %s', (u['username'],))
        if cur.fetchone():
            print('Skipping existing user', u['username'])
            continue
        cur.execute('INSERT INTO users (username, password_hash, name) VALUES (%s,%s,%s) RETURNING id', (u['username'], u['password_hash'], u.get('name')))
        new_id = cur.fetchone()[0]
        print('Inserted user', u['username'], 'as id', new_id)

    pg.commit()

    for s in sessions:
        src_user = next((x for x in users if x['id'] == s['user_id']), None)
        if not src_user:
            print('Skipping session with unknown user id', s['user_id'])
            continue
        cur.execute('SELECT id FROM users WHERE username = %s', (src_user['username'],))
        row = cur.fetchone()
        if not row:
            print('No target user for session, skipping', src_user['username'])
            continue
        target_user_id = row[0]
        cur.execute('INSERT INTO sessions (token, user_id, expires_at) VALUES (%s,%s,%s) ON CONFLICT (token) DO UPDATE SET user_id = EXCLUDED.user_id, expires_at = EXCLUDED.expires_at', (s['token'], target_user_id, s['expires_at']))

    pg.commit()
    pg.close()
    print('Migration complete')

if __name__ == '__main__':
    migrate()
