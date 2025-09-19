#!/usr/bin/env python3
"""
Test backend API endpoints directly
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
    
    print("Testing health endpoint...")
    response = client.get("/health")
    print(f"Health endpoint status: {response.status_code}")
    print(f"Health endpoint response: {response.json()}")
    
    print("\nTesting signup endpoint...")
    signup_data = {
        "username": "testuser",
        "password": "testpass123"
    }
    response = client.post("/auth/signup", json=signup_data)
    print(f"Signup status: {response.status_code}")
    print(f"Signup response: {response.text}")
    
    if response.status_code == 200:
        print("✅ Signup successful!")
        
        print("\nTesting login endpoint...")
        response = client.post("/auth/login", json=signup_data)
        print(f"Login status: {response.status_code}")
        print(f"Login response: {response.text}")
    else:
        print("❌ Signup failed!")
        
except Exception as e:
    print(f"❌ Test failed: {e}")
    import traceback
    traceback.print_exc()