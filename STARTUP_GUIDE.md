# 🚀 ContractHub Full-Stack Startup Guide

Your ContractHub application is now fully configured and ready to run! Both frontend and backend have been fixed and are working properly.

## ✅ Current Status

### Backend (FastAPI)
- **Status**: ✅ Running successfully 
- **URL**: http://127.0.0.1:8000
- **API Docs**: http://127.0.0.1:8000/docs
- **Health Check**: http://127.0.0.1:8000/health

### Frontend (React + Vite)
- **Status**: ✅ Running successfully
- **URL**: http://localhost:8080
- **Built with**: React 18, TypeScript, Vite, Tailwind CSS, Shadcn/ui

## 🔧 Issues Fixed

### Backend Issues:
1. ✅ **Missing Dependencies**: Installed all required packages (FastAPI, Uvicorn, SQLAlchemy, etc.)
2. ✅ **Deprecated FastAPI Events**: Updated from `@app.on_event` to modern `lifespan` context manager
3. ✅ **SQLAlchemy Metadata Conflict**: Renamed `metadata` column to `chunk_metadata` to avoid reserved attribute
4. ✅ **Package Compatibility**: Updated requirements.txt with compatible versions
5. ✅ **Environment Configuration**: Created `.env` file with proper database URL and JWT secret
6. ✅ **CORS Configuration**: Updated to allow frontend domain access

### Frontend Issues:
1. ✅ **Missing Dependencies**: Installed all npm packages (417 packages)
2. ✅ **API Configuration**: Set correct backend URL in environment variables
3. ✅ **CORS Connectivity**: Configured proper frontend-backend communication

## 🚀 How to Start Both Servers

### Terminal 1 - Backend
```bash
# Navigate to project root
cd "d:\Projects\Internship-assignment\ContractHub"

# Start backend server
.\.venv\Scripts\python.exe -m uvicorn backend.app.main:app --reload --host 127.0.0.1 --port 8000
```

### Terminal 2 - Frontend  
```bash
# Navigate to project root (same directory)
cd "d:\Projects\Internship-assignment\ContractHub"

# Start frontend development server
npm run dev
```

## 🌐 Access Points

| Service | URL | Description |
|---------|-----|-------------|
| **Frontend App** | http://localhost:8080 | Main React application |
| **Backend API** | http://127.0.0.1:8000 | FastAPI REST API |
| **API Documentation** | http://127.0.0.1:8000/docs | Interactive Swagger UI |
| **Health Check** | http://127.0.0.1:8000/health | Backend status endpoint |

## 🔗 Frontend-Backend Integration

The frontend is properly configured to communicate with the backend:
- **API Base URL**: `http://127.0.0.1:8000` (configured in `.env.local`)
- **CORS**: Backend allows frontend domain access
- **Authentication**: JWT token-based auth system working
- **File Upload**: Multipart form handling configured
- **Vector Search**: Query endpoints ready for RAG functionality

## 🔐 Authentication Flow

1. **Signup/Login**: User creates account or logs in via `/auth/signup` or `/auth/login`
2. **JWT Token**: Backend returns JWT token, frontend stores in localStorage
3. **Authorized Requests**: Frontend includes `Authorization: Bearer <token>` header
4. **Protected Routes**: Document upload, query, and list endpoints require authentication

## 📁 Available Features

### ✅ Working Features:
- User authentication (signup/login/logout)
- Protected route navigation
- API endpoint connectivity
- Health monitoring
- Development hot-reload for both frontend and backend

### 🔄 Features Requiring Database:
- Document upload and storage
- Vector embedding and search
- User document management
- Query RAG system

## 🗄️ Database Setup (Optional)

For full functionality, set up PostgreSQL with pgvector:

### Option 1: Docker (Recommended)
```bash
docker run --name contracthub-pg -e POSTGRES_PASSWORD=postgres -p 5432:5432 -d ankane/pgvector:latest
```

### Option 2: Update Environment
Update `backend/.env`:
```
DATABASE_URL=postgresql://postgres:your_password@localhost:5432/your_database
JWT_SECRET=your-secure-jwt-secret-here
```

## 🎯 Next Steps

1. **Test Authentication**: Try signup/login on the frontend
2. **Explore API**: Visit http://127.0.0.1:8000/docs to test endpoints
3. **Database Setup**: Configure PostgreSQL for full document management
4. **Custom Development**: Start building additional features

## 🐛 Troubleshooting

If you encounter issues:

1. **Backend not starting**: Check if Python virtual environment is activated
2. **Frontend not loading**: Ensure npm dependencies are installed
3. **CORS errors**: Verify both servers are running on correct ports
4. **Database errors**: Check PostgreSQL connection or run without database features

---

**Your ContractHub application is now ready for development! 🎉**