#!/usr/bin/env python3
"""
Test file upload functionality
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
    
    # First signup/login to get token
    print("Creating test user...")
    signup_data = {"username": "uploader", "password": "testpass123"}
    response = client.post("/auth/signup", json=signup_data)
    print(f"Signup status: {response.status_code}")
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        print("\nTesting file upload...")
        
        # Create a simple test file
        test_content = """
        MASTER SERVICE AGREEMENT
        
        This Agreement is entered into between Acme Corp and TechSolutions Inc.
        
        TERM: This agreement shall remain in effect for 24 months.
        
        PAYMENT: Net 30 days from invoice date.
        
        TERMINATION: Either party may terminate with 90 days notice.
        
        LIABILITY: Total liability shall not exceed $100,000.
        """
        
        files = {"file": ("test_contract.txt", test_content, "text/plain")}
        
        response = client.post("/documents/upload", headers=headers, files=files)
        print(f"Upload status: {response.status_code}")
        print(f"Upload response: {response.text}")
        
        if response.status_code == 200:
            print("✅ File uploaded successfully!")
            
            print("\nChecking documents list...")
            response = client.get("/documents/list", headers=headers)
            print(f"Documents list status: {response.status_code}")
            print(f"Documents found: {len(response.json())}")
            
            for doc in response.json():
                print(f"- {doc['filename']} ({doc['status']}) - {doc.get('contract_type', 'N/A')}")
        else:
            print("❌ Upload failed!")
    else:
        print("❌ Signup failed!")

except Exception as e:
    print(f"❌ Test failed: {e}")
    import traceback
    traceback.print_exc()