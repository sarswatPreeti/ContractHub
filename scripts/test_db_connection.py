#!/usr/bin/env python3
"""
Test database connection for ContractHub
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

try:
    from app.database import engine
    from app.config import settings
    import sqlalchemy

    print(f"Database URL: {settings.database_url}")
    
    # Test connection
    with engine.connect() as conn:
        result = conn.execute(sqlalchemy.text("SELECT version()"))
        version = result.fetchone()[0]
        print(f"✅ Database connected successfully!")
        print(f"PostgreSQL version: {version}")
        
        # Test vector extension
        result = conn.execute(sqlalchemy.text("SELECT EXISTS(SELECT 1 FROM pg_extension WHERE extname = 'vector')"))
        has_vector = result.fetchone()[0]
        print(f"✅ Vector extension installed: {has_vector}")
        
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    print(f"Error type: {type(e).__name__}")
    import traceback
    traceback.print_exc()