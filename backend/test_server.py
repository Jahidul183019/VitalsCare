import sys
from unittest.mock import MagicMock

# Mock xgboost and sklearn
sys.modules['xgboost'] = MagicMock()
sys.modules['sklearn'] = MagicMock()
sys.modules['sklearn.preprocessing'] = MagicMock()

import uvicorn
from app import app
from fastapi.testclient import TestClient

client = TestClient(app)
payload = {"age":55,"systolic_bp":150,"diastolic_bp":95,"bmi":28.5,"family_history":True,"activity_level":"low","diet_quality":"poor","salt_intake":"high","stress_level":"high","smoking":True,"dietary_diversity":3,"income_level":"low","children_under5":3,"lang":"en"}
response = client.post("/assess", json=payload)
print("STATUS CODE:", response.status_code)
print("RESPONSE:", response.json())
