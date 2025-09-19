# Backend Setup Instructions

## Quick Start (Without Database)
Your backend is now running successfully! You can access it at:
- **Health Check**: http://127.0.0.1:8000/health
- **API Documentation**: http://127.0.0.1:8000/docs
- **OpenAPI Schema**: http://127.0.0.1:8000/openapi.json

## Current Status
✅ All dependencies installed  
✅ FastAPI server running  
✅ Environment variables configured  
⚠️ Database connection will fail (PostgreSQL not set up)  

## For Full Functionality (With Database)

### Option 1: Docker PostgreSQL (Recommended)
```bash
# Install Docker Desktop first, then run:
docker run --name contracthub-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d ankane/pgvector:latest
```

### Option 2: Local PostgreSQL Installation
1. Install PostgreSQL with pgvector extension
2. Create a database named `contracthub`
3. Update the DATABASE_URL in `.env` file

### Option 3: Cloud Database (Supabase)
1. Create a free Supabase account
2. Create a new project
3. Enable the pgvector extension
4. Update the DATABASE_URL in `.env` with your Supabase connection string

## Environment Variables
The `.env` file has been created with default values:
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/contracthub
JWT_SECRET=your-secret-key-change-this-in-production
```

## Testing the API
Even without a database, you can:
- View API documentation at http://127.0.0.1:8000/docs
- Test endpoints that don't require database (they will show appropriate error messages)
- Use the health check endpoint

## Starting the Server
```bash
# From the project root directory:
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```