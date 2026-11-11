# Open LMS

A modern, open-source Learning Management System built with FastAPI and React.

## 🚀 Quick Start

The fastest way to get started is using Docker Compose:

```bash
# 1. Clone the repository
git clone <repository-url>
cd open-lms

# 2. Configure environment
cp .env.example .env
cp backend/.env.example backend/.env

# 3. Launch the full stack
docker compose up --build

# 4. Access the application
# - Frontend: http://localhost
# - API Docs: http://localhost/docs (development only)
# - API Health: http://localhost/api/health
```

## 📋 Prerequisites

- Docker 20.10+ and Docker Compose 2.0+
- Or for local development: Python 3.12+ and Node.js 20+

## 🏗️ Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Nginx     │────▶│   Frontend  │     │   Backend   │
│  (Proxy)    │     │   (React)   │     │  (FastAPI)  │
└─────────────┘     └─────────────┘     └──────┬──────┘
       │                                         │
       │       ┌─────────────┐            ┌─────┴─────┐
       └──────▶│  PostgreSQL │            │   Redis   │
               │   (Data)    │            │  (Cache)  │
               └─────────────┘            └───────────┘
```

## 🔧 Development Setup

### Without Docker (Hot Reload)

**Backend:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt -r requirements-dev.txt
uvicorn app.main:app --reload
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

### With Docker (Hot Reload)

```bash
# Use the override file for development
docker compose -f docker-compose.yml -f docker-compose.override.yml up
```

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 🌐 API Documentation

When running in development mode:
- Swagger UI: http://localhost/docs
- ReDoc: http://localhost/redoc
- OpenAPI JSON: http://localhost/openapi.json

## 🔐 Default Credentials

After seeding, the following admin account is available:
- **Email:** admin@openlms.dev
- **Password:** Admin@SecurePass1

## 📦 Production Deployment

1. Generate SSL certificates and place in `nginx/ssl/`
2. Update `.env` with production values
3. Set your domain in `nginx/nginx.conf`
4. Deploy:
   ```bash
   docker compose -f docker-compose.yml up -d
   ```

## 📚 Documentation

- [Architecture (HLD)](.agent/docs/HLD.md)
- [API Specification (LLD)](.agent/docs/LLD.md)
- [Business Requirements (BRD)](.agent/docs/BRD_FULL.md)

## 📝 License

MIT License - see LICENSE file for details.
