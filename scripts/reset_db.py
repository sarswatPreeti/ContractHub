#!/usr/bin/env python3
"""
Database schema reset script for ContractHub
"""
import sys
import os

# Add the backend directory to the Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.database import engine, Base
from app import models
import sqlalchemy

def reset_database():
    """Drop and recreate all database tables"""
    try:
        # Drop all tables
        Base.metadata.drop_all(bind=engine)
        print('✅ Dropped all tables')

        # Create vector extension and recreate tables
        with engine.connect() as conn:
            conn.execute(sqlalchemy.text('CREATE EXTENSION IF NOT EXISTS vector'))
            conn.commit()
            print('✅ Created vector extension')

        Base.metadata.create_all(bind=engine)
        print('✅ Created all tables with updated schema')
        print('🎉 Database reset completed successfully!')
        
    except Exception as e:
        print(f'❌ Error resetting database: {e}')
        return False
    
    return True

if __name__ == "__main__":
    reset_database()