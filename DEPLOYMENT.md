# ContractHub Deployment Guide

This guide covers deploying ContractHub to production environments.

## 🚀 Deployment Architecture

### Recommended Stack
- **Frontend**: Netlify or Vercel
- **Backend**: Render, Heroku, or Fly.io  
- **Database**: Supabase (PostgreSQL + pgvector)

## 📋 Pre-Deployment Checklist

### Environment Variables
```bash
# Backend (.env)
DATABASE_URL=postgresql://user:pass@host:5432/dbname
JWT_SECRET=your-256-bit-secret-key
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Frontend (.env)
VITE_API_BASE=https://your-backend-url.com
```

### Database Setup
```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Verify tables are created by running the backend once
-- Tables: users, documents, chunks
```

## 🎯 Frontend Deployment (Netlify)

### 1. Build Configuration
```bash
# Build command
npm run build

# Publish directory  
dist

# Environment variables
VITE_API_BASE=https://your-backend-api.com
```

### 2. Netlify Configuration (`netlify.toml`)
```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[build.environment]
  NODE_VERSION = "18"
```

### 3. Deploy Steps
1. Connect GitHub repository to Netlify
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Add environment variable: `VITE_API_BASE`
5. Deploy

## 🚀 Backend Deployment (Render)

### 1. Dockerfile
```dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### 2. Render Configuration
- **Runtime**: Docker
- **Build Command**: `docker build -f Dockerfile .`
- **Start Command**: Auto-detected from Dockerfile
- **Environment Variables**: Add all required vars

### 3. Health Check Endpoint
The backend includes `/health` endpoint for monitoring:
```python
@app.get("/health")
def health_check():
    return {"status": "ok"}
```

## 🗄️ Database Deployment (Supabase)

### 1. Create Project
1. Sign up at [supabase.com](https://supabase.com)
2. Create new project
3. Note the connection string

### 2. Enable pgvector
```sql
-- Run in Supabase SQL editor
CREATE EXTENSION IF NOT EXISTS vector;
```

### 3. Initialize Schema
Run the backend once with the Supabase DATABASE_URL to create tables automatically.

## 🔧 Alternative Deployments

### Backend on Heroku
```bash
# Create Procfile
echo "web: uvicorn app.main:app --host 0.0.0.0 --port \$PORT" > Procfile

# Deploy
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

### Frontend on Vercel
```json
// vercel.json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

### Database on Railway
1. Create PostgreSQL service
2. Add pgvector via SQL console:
   ```sql
   CREATE EXTENSION vector;
   ```

## 🛡️ Security Considerations

### JWT Secret
Generate a secure secret:
```bash
# Use a secure random generator
openssl rand -hex 32
```

### CORS Configuration
Update backend CORS for production:
```python
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://your-frontend-domain.netlify.app",
        "https://your-custom-domain.com"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE"],
    allow_headers=["*"],
)
```

### Database Security
- Use connection pooling
- Enable SSL connections
- Restrict database access by IP
- Regular backups enabled

## 📊 Monitoring & Observability

### Health Checks
- Frontend: Ensure app loads and routes work
- Backend: `/health` endpoint returns 200
- Database: Connection successful

### Logging
Backend includes structured logging:
```python
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
```

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Set up uptime monitoring

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Netlify
        uses: netlify/actions/build@master
        with:
          publish-dir: dist
          production-deploy: true
        env:
          NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
          NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}

  deploy-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Deploy to Render
        # Add Render deployment steps
```

## 🧪 Testing Deployment

### Smoke Tests
1. **Authentication**: Sign up and login work
2. **Upload**: File upload processes successfully  
3. **Search**: Natural language queries return results
4. **Dashboard**: Contracts display correctly
5. **Details**: Contract detail pages load

### Load Testing
Consider using tools like:
- Artillery.js for API load testing
- Lighthouse for frontend performance
- k6 for comprehensive testing

## 📈 Scaling Considerations

### Database Scaling
- Connection pooling (pgbouncer)
- Read replicas for queries
- Horizontal sharding by user_id

### Backend Scaling
- Multiple instances behind load balancer
- Redis for session storage
- CDN for static assets

### Frontend Scaling
- CDN deployment (Cloudflare)
- Image optimization
- Bundle size optimization

## 🚨 Troubleshooting

### Common Issues

#### CORS Errors
- Check frontend URL in backend CORS config
- Verify HTTPS vs HTTP protocols match

#### Database Connection Issues
- Verify DATABASE_URL format
- Check firewall rules and IP restrictions
- Ensure pgvector extension is installed

#### Build Failures
- Check Node.js version compatibility
- Verify all environment variables are set
- Review build logs for missing dependencies

### Debug Commands
```bash
# Check backend health
curl https://your-backend.com/health

# Test database connection
psql $DATABASE_URL -c "SELECT version();"

# Verify frontend builds locally
npm run build && npm run preview
```

## 📝 Production Configuration

### Sample Production .env
```bash
# Backend
DATABASE_URL=postgresql://username:password@host:5432/database
JWT_SECRET=your-production-secret-key-256-bits
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
ENVIRONMENT=production

# Frontend  
VITE_API_BASE=https://contracthub-api.render.com
VITE_ENVIRONMENT=production
```

This deployment guide ensures a smooth production deployment of ContractHub with proper security, monitoring, and scalability considerations.