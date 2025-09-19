#!/usr/bin/env python3
"""
Test backend app imports and basic functionality
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    print("Testing imports...")
    from app.main import app
    print("✅ Main app imported successfully")
    
    from app.database import get_db, init_db
    print("✅ Database functions imported successfully")
    
    from app import models
    print("✅ Models imported successfully")
    
    from app.routers import auth, documents, query
    print("✅ Routers imported successfully")
    
    from app.config import settings
    print("✅ Config imported successfully")
    print(f"Database URL: {settings.database_url}")
    print(f"JWT Secret configured: {'Yes' if settings.jwt_secret else 'No'}")
    
    # Test database connection
    init_db()
    print("✅ Database initialized successfully")
    
except Exception as e:
    print(f"❌ Import/initialization failed: {e}")
    import traceback
    traceback.print_exc()