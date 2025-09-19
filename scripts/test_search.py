#!/usr/bin/env python3
"""
Test query/search functionality after fixing vector operator issue
"""
import sys
import os
import uuid

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from fastapi.testclient import TestClient
    from app.main import app
    
    client = TestClient(app)
    
    # First signup/login to get token
    print("Creating test user...")
    signup_data = {"username": f"searcher{uuid.uuid4().hex[:8]}", "password": "testpass123"}
    response = client.post("/auth/signup", json=signup_data)
    print(f"Signup status: {response.status_code}")
    
    if response.status_code == 200:
        token = response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        print("\nUploading test contract...")
        
        # Create a contract with specific clauses for testing
        test_content = """
        MASTER SERVICE AGREEMENT
        
        This Agreement is entered into between Acme Corp and TechSolutions Inc.
        
        TERM: This agreement shall remain in effect for 24 months from execution date.
        
        PAYMENT: All invoices shall be paid within 30 days of receipt. Late payments incur 1.5% monthly penalty.
        
        TERMINATION: Either party may terminate this agreement with 90 days written notice.
        
        LIABILITY: Total liability shall not exceed $100,000 under any circumstances.
        
        CONFIDENTIALITY: All proprietary information must remain confidential during and after contract term.
        """
        
        files = {"file": ("search_test_contract.txt", test_content, "text/plain")}
        
        response = client.post("/documents/upload", headers=headers, files=files)
        print(f"Upload status: {response.status_code}")
        
        if response.status_code == 200:
            print("✅ Contract uploaded successfully!")
            
            print("\nTesting search functionality...")
            
            # Test different search queries
            test_queries = [
                "termination clause",
                "payment terms", 
                "liability limitations",
                "confidentiality requirements"
            ]
            
            for query in test_queries:
                print(f"\n--- Searching for: '{query}' ---")
                search_data = {"query": query, "top_k": 3}
                response = client.post("/query/search", headers=headers, json=search_data)
                print(f"Search status: {response.status_code}")
                
                if response.status_code == 200:
                    result = response.json()
                    print(f"✅ Answer: {result['answer'][:100]}...")
                    print(f"✅ Found {len(result['chunks'])} relevant chunks")
                    for i, chunk in enumerate(result['chunks'][:2]):
                        print(f"  Chunk {i+1}: {chunk['text_chunk'][:80]}... (relevance: {chunk['relevance']:.3f})")
                else:
                    print(f"❌ Search failed: {response.text}")
        else:
            print("❌ Upload failed!")
            print(f"Error: {response.text}")
    else:
        print("❌ Signup failed!")
        print(f"Error: {response.text}")

except Exception as e:
    print(f"❌ Test failed: {e}")
    import traceback
    traceback.print_exc()