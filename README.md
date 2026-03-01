# MultiSkills

> Understand yourself through your abilities.

A full-stack web application for categorizing your skills into Money, Soul, and Curiosity — built with the MERN stack.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React + Vite |
| Backend | Node.js + Express |
| Database | MongoDB Atlas |
| Auth | JWT + Google OAuth |
| AI | Anthropic Claude API |
| Frontend Hosting | Vercel |
| Backend Hosting | Railway |

---

## Project Structure

```
MultiSkills/
├── frontend/          React + Vite app
│   ├── src/
│   │   ├── components/
│   │   ├── context/   AuthContext (JWT auth)
│   │   ├── hooks/     useSkills (REST API calls)
│   │   ├── lib/       api.js (API client)
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
│
├── backend/           Node.js + Express REST API
│   ├── config/        DB + Passport (Google OAuth)
│   ├── middleware/    JWT auth middleware
│   ├── models/        User + Skill (Mongoose schemas)
│   ├── routes/        /api/auth + /api/skills
│   ├── index.js       Express server entry
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## Local Development

### 1. Backend
```bash
cd backend
npm install
cp .env.example .env
# Fill in .env values
npm run dev
# Running on http://localhost:5000
```

### 2. Frontend
```bash
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
# Running on http://localhost:3000
```

---

## Environment Variables

### Backend (`backend/.env`)
```
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback
SESSION_SECRET=your_session_secret
```

### Frontend (`frontend/.env`)
```
VITE_API_URL=http://localhost:5000
```

---

## API Endpoints

### Auth
```
POST   /api/auth/signup           Register with email + password
POST   /api/auth/signin           Login with email + password
GET    /api/auth/google           Start Google OAuth
GET    /api/auth/google/callback  Google OAuth callback
GET    /api/auth/me               Get current user
```

### Skills (requires Authorization header)
```
GET    /api/skills                Get all skills for user
POST   /api/skills                Add a skill
DELETE /api/skills/:id            Delete a skill
```

### Health
```
GET    /api/health                Server status check
```

---

## Deployment

| Service | Purpose | Deploy from |
|---|---|---|
| Vercel | Frontend | `/frontend` folder |
| Railway | Backend | `/backend` folder |
| MongoDB Atlas | Database | Cloud (no deploy needed) |
