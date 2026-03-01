# MultiSkills API

REST API for MultiSkills — Node.js + Express + MongoDB + JWT Auth

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file (copy from `.env.example`):
```bash
cp .env.example .env
```

3. Fill in your values in `.env`

4. Run in development:
```bash
npm run dev
```

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/signup | Register with email + password |
| POST | /api/auth/signin | Login with email + password |
| GET  | /api/auth/google | Start Google OAuth flow |
| GET  | /api/auth/google/callback | Google OAuth callback |
| GET  | /api/auth/me | Get current user (requires token) |

### Skills (all require Authorization header)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET    | /api/skills | Get all skills for user |
| POST   | /api/skills | Add a new skill |
| DELETE | /api/skills/:id | Delete a skill |

### Health
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/health | Check server status |

## Auth Header
All protected routes need:
```
Authorization: Bearer <your_jwt_token>
```
