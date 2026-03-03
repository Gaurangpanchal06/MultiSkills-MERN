# MultiSkills — Complete Project Guide

Your complete reference for understanding, maintaining, and extending this project.
Written for you as the developer — covers everything from architecture to adding new features.

---

## Table of Contents

1. [What This App Does](#1-what-this-app-does)
2. [Tech Stack — What and Why](#2-tech-stack--what-and-why)
3. [Project Structure](#3-project-structure)
4. [How the App Flows](#4-how-the-app-flows)
5. [Frontend — Every File Explained](#5-frontend--every-file-explained)
6. [Backend — Every File Explained](#6-backend--every-file-explained)
7. [Database — Models and Schema](#7-database--models-and-schema)
8. [API Reference — All Endpoints](#8-api-reference--all-endpoints)
9. [Authentication — How JWT Works](#9-authentication--how-jwt-works)
10. [UI System — Fonts, Colors, Icons](#10-ui-system--fonts-colors-icons)
11. [How to Change the Design](#11-how-to-change-the-design)
12. [How to Add New Features](#12-how-to-add-new-features)
13. [Deployment Guide](#13-deployment-guide)
14. [Environment Variables](#14-environment-variables)
15. [Things to Remember for Future Projects](#15-things-to-remember-for-future-projects)

---

## 1. What This App Does

MultiSkills helps users categorize their skills into three buckets:

- **◈ Money** — Skills with income potential (programming, design, marketing)
- **◎ Soul** — Skills for inner peace and wellbeing (meditation, painting, yoga)
- **◇ Curiosity** — Skills driven by pure learning and exploration

**User journey:**
1. Land on welcome page → click Begin
2. Register or login (email/password or Google)
3. Type a skill → AI classifies it into Money / Soul / Curiosity
4. User confirms or changes the category
5. Skill is saved to their personal list
6. User can browse skills by category and delete them

---

## 2. Tech Stack — What and Why

### Frontend
| Technology | Version | Purpose | Why used |
|---|---|---|---|
| React | 18 | UI library | Industry standard, component-based |
| Vite | 5 | Build tool | Faster than Create React App |
| Plain CSS | — | Styling | Full control, no framework needed |
| Google Fonts | — | Typography | Cormorant Garamond + DM Mono |

No UI framework (no Tailwind, no MUI) — the design is 100% custom CSS variables.

### Backend
| Technology | Version | Purpose | Why used |
|---|---|---|---|
| Node.js | 18+ | Runtime | JavaScript on the server |
| Express | 4 | Web framework | Most used Node.js framework |
| Mongoose | 8 | MongoDB ODM | Schemas and validation for MongoDB |
| JWT (jsonwebtoken) | 9 | Authentication | Stateless, industry standard |
| bcryptjs | 2 | Password hashing | Secure password storage |
| Passport.js | 0.7 | Google OAuth | Simplest OAuth implementation |
| passport-google-oauth20 | 2 | Google strategy | Google sign-in support |
| cors | 2 | Cross-origin requests | Allows frontend to call backend |
| dotenv | 16 | Environment variables | Keeps secrets out of code |
| express-session | 1 | Session handling | Required for Passport OAuth flow |

### Database
| Technology | Purpose |
|---|---|
| MongoDB Atlas | Cloud NoSQL database |
| Mongoose | Defines schemas and handles queries |

### External APIs
| Service | Purpose |
|---|---|
| Anthropic Claude API | AI skill classification |
| Google OAuth 2.0 | Sign in with Google |

### Hosting
| Service | What it hosts |
|---|---|
| Vercel | Frontend (React app) |
| Railway | Backend (Express API) |
| MongoDB Atlas | Database (always cloud) |

---

## 3. Project Structure

```
MultiSkills/                          ← Monorepo root
│
├── frontend/                         ← React + Vite app
│   ├── src/
│   │   ├── main.jsx                  ← Entry point, mounts React
│   │   ├── App.jsx                   ← Root component, handles routing
│   │   ├── components/               ← Reusable UI pieces
│   │   │   ├── Navbar.jsx            ← Top bar with account button
│   │   │   ├── AccountDrawer.jsx     ← Slide-out profile panel
│   │   │   ├── SkillInput.jsx        ← Text input + Analyze button
│   │   │   ├── SuggestionCard.jsx    ← AI result card with actions
│   │   │   ├── CategoryBucket.jsx    ← Money/Soul/Curiosity bucket
│   │   │   └── OverrideModal.jsx     ← Modal to change category
│   │   ├── context/
│   │   │   └── AuthContext.jsx       ← Global auth state + functions
│   │   ├── hooks/
│   │   │   └── useSkills.js          ← Skills CRUD logic
│   │   ├── lib/
│   │   │   ├── api.js                ← All API calls to backend
│   │   │   └── classifySkill.js      ← Anthropic API call
│   │   ├── pages/
│   │   │   ├── WelcomePage.jsx       ← Landing screen
│   │   │   ├── AuthPage.jsx          ← Login/signup form
│   │   │   ├── HomePage.jsx          ← Main dashboard
│   │   │   └── CategoryPage.jsx      ← Skill list + detail view
│   │   └── styles/
│   │       └── globals.css           ← ALL styles, design system
│   ├── index.html                    ← HTML shell
│   ├── vite.config.js                ← Vite configuration
│   ├── vercel.json                   ← Tells Vercel to serve index.html
│   └── package.json                  ← Frontend dependencies
│
├── backend/                          ← Node.js + Express API
│   ├── index.js                      ← Server entry, middleware setup
│   ├── config/
│   │   ├── db.js                     ← MongoDB connection
│   │   └── passport.js               ← Google OAuth strategy
│   ├── middleware/
│   │   └── auth.js                   ← JWT verification middleware
│   ├── models/
│   │   ├── User.js                   ← User schema (email, password, google)
│   │   └── Skill.js                  ← Skill schema (name, category, reason)
│   ├── routes/
│   │   ├── auth.js                   ← /api/auth/* endpoints
│   │   └── skills.js                 ← /api/skills/* endpoints
│   └── package.json                  ← Backend dependencies
│
├── .gitignore                        ← Ignores node_modules and .env
├── package.json                      ← Root scripts (run frontend/backend)
└── README.md                         ← Project overview
```

---

## 4. How the App Flows

### Complete User Journey

```
1. User opens https://multi-skills-mern.vercel.app
         ↓
2. WelcomePage shows ("What skills are shaping your life?")
         ↓
3. User clicks "Begin"
         ↓
4. AuthPage shows (Login / Sign Up tabs)
         ↓
   Option A: Email signup
   → Frontend POSTs to /api/auth/signup on Railway
   → Railway creates user in MongoDB, returns JWT token
   → Frontend stores token in localStorage
   → User is logged in

   Option B: Google OAuth
   → Frontend redirects browser to Railway /api/auth/google
   → Railway redirects to Google consent screen
   → User approves → Google redirects to Railway callback
   → Railway creates/finds user, generates JWT
   → Railway redirects to frontend /auth/callback?token=xxx
   → Frontend reads token from URL, stores in localStorage
   → User is logged in
         ↓
5. HomePage shows — user sees their skill buckets
         ↓
6. User types a skill → clicks Analyze
   → classifySkill.js calls Anthropic API directly from browser
   → Claude returns { category: "Money", reason: "..." }
   → SuggestionCard shows the result
         ↓
7. User clicks Confirm (or Change category)
   → Frontend POSTs to /api/skills on Railway
   → Railway saves skill to MongoDB
   → Skill appears in the correct bucket
         ↓
8. User clicks a category bucket → sees skill list
   User clicks a skill → sees skill detail
   User can delete skill from detail page
```

### Authentication Flow (JWT)

```
Signup/Login
     ↓
Backend returns { token, user }
     ↓
Frontend: localStorage.setItem('ms_token', token)
     ↓
Every API request adds header: Authorization: Bearer <token>
     ↓
Backend middleware verifies token → attaches user to req.user
     ↓
Route handler uses req.user to fetch/save user's data only
```

---

## 5. Frontend — Every File Explained

### `main.jsx` — Entry Point
```jsx
// Mounts the entire React app into <div id="root"> in index.html
// Wraps everything in AuthProvider so all components can access auth state
createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
```
**Remember:** Every context provider must wrap the components that need it here.

---

### `App.jsx` — Router
The app uses **state-based routing** — no React Router. A `screen` state variable controls which page renders.

```
screen = 'welcome'   → WelcomePage
screen = 'auth'      → AuthPage  (also shows if not authenticated)
screen = 'home'      → HomePage
screen = 'category'  → CategoryPage
screen = 'detail'    → SkillDetailPage
```

**Props passed down:**
- `WelcomePage` receives `onStart` → changes screen to 'auth' or 'home'
- `HomePage` receives `onViewCategory` → changes screen to 'category'
- `CategoryPage` receives `category`, `onBack`, `onSelectSkill`
- `SkillDetailPage` receives `skill`, `onBack`, `onDelete`

**Key logic:**
```js
// wasAuthenticated tracks if user signed out THIS session
// Prevents redirecting to auth on fresh page loads
const [wasAuthenticated, setWasAuthenticated] = useState(false);
```

---

### `context/AuthContext.jsx` — Global Auth State

This is the most important frontend file. It provides auth state to the entire app.

**What it stores:**
```js
user          // The logged-in user object { id, fullName, email, avatarUrl }
loading       // true while checking if user is logged in on mount
error         // error message to show in forms
isAuthenticated  // true if user exists
displayName   // user's name or email prefix
avatarUrl     // profile picture URL (Google users only)
```

**Functions it provides:**
```js
signUp(email, password, fullName)  // Register with email
signIn(email, password)            // Login with email
signInWithGoogle()                 // Redirects to Google
signOut()                          // Clears token, sets user to null
```

**How token is restored on page refresh:**
```js
useEffect(() => {
  const token = localStorage.getItem('ms_token');
  if (!token) { setLoading(false); return; }
  // Calls /api/auth/me with token to get user data
  authAPI.me().then(({ user }) => setUser(user))
}, []);
```

**How Google OAuth token is picked up:**
```js
useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  const token = params.get('token');
  if (token) {
    localStorage.setItem('ms_token', token);
    window.history.replaceState({}, '', '/'); // Clean URL
    authAPI.me().then(({ user }) => setUser(user));
  }
}, []);
```

---

### `hooks/useSkills.js` — Skills Data

Custom hook that manages the user's skills list. Any component that needs skills imports this.

```js
const { skills, loading, addSkill, deleteSkill, byCategory } = useSkills();
```

- `skills` — full array of user's skills from MongoDB
- `loading` — true while fetching
- `addSkill(data)` — POST to /api/skills, adds to local state
- `deleteSkill(id)` — DELETE to /api/skills/:id, removes from local state
- `byCategory(cat)` — filters skills array by Money/Soul/Curiosity

**Important:** Uses optimistic updates — updates local state immediately without waiting for server confirmation on delete.

---

### `lib/api.js` — API Client

Central place for all backend calls. Never call `fetch()` directly in components — always go through here.

```js
// How it works:
// 1. Reads JWT token from localStorage
// 2. Adds Authorization: Bearer <token> header automatically
// 3. Calls fetch on the Railway backend URL
// 4. Throws error if response is not ok

const BASE_URL = import.meta.env.VITE_API_URL;
// Development: http://localhost:5000
// Production:  https://multiskills-mern-production.up.railway.app
```

**Available methods:**
```js
authAPI.signup(fullName, email, password)
authAPI.signin(email, password)
authAPI.me()
authAPI.googleSignIn()  // redirects browser

skillsAPI.getAll()
skillsAPI.add(skillData)
skillsAPI.delete(id)
```

---

### `lib/classifySkill.js` — AI Classification

Calls the Anthropic API directly from the browser (frontend) to classify skills.

**Flow:**
1. Calls `https://api.anthropic.com/v1/messages`
2. Sends skill name to Claude with a detailed system prompt
3. Claude returns `{ category: "Money", reason: "..." }`
4. If API fails → falls back to keyword matching

**Fallback heuristic:**
- Checks skill name against `MONEY_KEYWORDS` array (java, python, react, etc.)
- Checks against `SOUL_KEYWORDS` array (meditation, yoga, painting, etc.)
- Defaults to Curiosity if no match

**Note:** The Anthropic API key is exposed in frontend code — this is fine for a portfolio project but in a real production app you'd move this call to the backend.

---

### `pages/WelcomePage.jsx`
Landing screen. Receives one prop: `onStart` (called when user clicks Begin).
No auth logic, no state. Pure display component.

---

### `pages/AuthPage.jsx`
Login and signup form with two tabs. Uses `useAuth()` for `signIn`, `signUp`, `signInWithGoogle`, and `error`.

---

### `pages/HomePage.jsx`
Main dashboard after login. Shows:
- Greeting with user's name
- SkillInput at the top
- SuggestionCard (when AI returns a result)
- Three CategoryBuckets at the bottom

```js
// Flow:
// SkillInput → calls classifySkill → calls onResult
// onResult → sets pending state
// SuggestionCard shows pending → user confirms
// handleConfirm → calls addSkill → clears pending
```

---

### `pages/CategoryPage.jsx`
Two exports from one file:

**CategoryPage** — shows the list of skills in a category
- Gets skills via `useSkills()` → `byCategory(category)`
- Each skill is clickable → calls `onSelectSkill(skill)`

**SkillDetailPage** — shows one skill's full detail
- Shows skillName, finalCategory, aiReason, createdAt
- Delete button calls `onDelete(skill._id)`

---

### `components/Navbar.jsx`
Fixed top bar. Shows brand name + account icon button.
Account icon opens `AccountDrawer`. Uses custom SVG icon (no icon library).

---

### `components/AccountDrawer.jsx`
Slide-out panel from the right side. Shows:
- User avatar or initial
- Full name and email
- Skill count per category
- Sign out button

Uses CSS `transform: translateX()` for the slide animation.

---

### `components/SkillInput.jsx`
Text input + Analyze button. Calls `classifySkill()` and passes result up via `onResult` prop.
Pressing Enter also triggers analysis.

---

### `components/SuggestionCard.jsx`
Shows AI result. Three actions:
- **Confirm** → saves with AI's category
- **Change** → opens OverrideModal
- **Dismiss** → clears the suggestion without saving

---

### `components/CategoryBucket.jsx`
One of the three category tiles on the homepage (Money, Soul, Curiosity).
Shows category name, icon, and skill count. Clickable → navigates to category list.

---

### `components/OverrideModal.jsx`
Fullscreen modal that appears when user clicks "Change" on the suggestion.
Shows all three categories as options for the user to manually pick.

---

### `styles/globals.css` — The Entire Design System

This one file controls everything visual. No other CSS files exist.

**Structure:**
```css
:root { /* CSS variables — all colors, fonts, spacing */ }
body  { /* Base font, background, text color */ }
      /* Utility classes: .page, .page-inner, .btn, .label, etc. */
      /* Animations: fadeUp */
```

---

## 6. Backend — Every File Explained

### `index.js` — Server Entry Point

Sets up the entire Express server:

```
1. require('dotenv').config()     ← loads .env file
2. connectDB()                    ← connects to MongoDB
3. app.use(cors(...))             ← allows frontend to call backend
4. app.use(express.json())        ← parses JSON request bodies
5. app.use(session(...))          ← sessions for Passport OAuth
6. app.use(passport.initialize()) ← initializes Google OAuth
7. app.use('/api/auth', ...)      ← mounts auth routes
8. app.use('/api/skills', ...)    ← mounts skills routes
9. app.listen(PORT)               ← starts the server
```

---

### `config/db.js` — Database Connection

```js
mongoose.connect(process.env.MONGODB_URI)
```
Simple. Connects Mongoose to MongoDB Atlas using the connection string from `.env`.
Called once at server startup. If it fails, the process exits.

---

### `config/passport.js` — Google OAuth Strategy

Tells Passport how to handle Google sign-in:

```
1. User clicks "Sign in with Google"
2. Browser goes to /api/auth/google
3. Passport redirects to Google consent screen
4. User approves → Google sends profile to our callback URL
5. Passport strategy runs:
   - Checks if user with this googleId exists → return them
   - Checks if email exists (manual account) → link Google to it
   - Otherwise → create new user
6. User object passed to route handler
7. JWT generated → user redirected to frontend
```

---

### `middleware/auth.js` — JWT Verification

Protects routes that require login:

```js
// How it works:
// 1. Reads Authorization header: "Bearer eyJhbGci..."
// 2. Extracts the token
// 3. Verifies signature using JWT_SECRET
// 4. Decodes user ID from token
// 5. Fetches user from MongoDB
// 6. Attaches to req.user
// 7. Calls next() → route handler runs

// If token is missing/invalid/expired → returns 401 Unauthorized
```

Used like this in routes:
```js
router.get('/me', protect, (req, res) => {
  // req.user is available here because protect ran first
});
```

---

### `models/User.js` — User Schema

```js
{
  fullName:  String,           // display name
  email:     String (unique),  // login identifier
  password:  String (hidden),  // bcrypt hashed, never returned in queries
  googleId:  String (sparse),  // null for email users
  avatarUrl: String,           // Google profile picture
  createdAt: Date,             // auto-added by timestamps: true
  updatedAt: Date,             // auto-added by timestamps: true
}
```

**Key behaviors:**
- `password` has `select: false` — never returned unless explicitly requested
- `pre('save')` hook automatically hashes password before saving
- `comparePassword()` method checks password at login

---

### `models/Skill.js` — Skill Schema

```js
{
  userId:              ObjectId (ref: User),  // who owns this skill
  skillName:           String,                // e.g. "Python"
  aiSuggestedCategory: String (enum),         // what AI suggested
  finalCategory:       String (enum),         // what user confirmed
  aiReason:            String,                // AI's explanation
  createdAt:           Date,                  // auto-added
  updatedAt:           Date,                  // auto-added
}
```

`finalCategory` and `aiSuggestedCategory` are both enums:
```js
enum: ['Money', 'Soul', 'Curiosity']
```
MongoDB will reject any other value.

---

### `routes/auth.js` — Auth Endpoints

| Method | Path | What it does |
|---|---|---|
| POST | /api/auth/signup | Creates user, returns JWT + user |
| POST | /api/auth/signin | Verifies password, returns JWT + user |
| GET | /api/auth/google | Starts Google OAuth |
| GET | /api/auth/google/callback | Google redirects here, creates JWT, redirects to frontend |
| GET | /api/auth/me | Returns current user (requires JWT) |

**generateToken helper:**
```js
function generateToken(userId) {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
}
```

---

### `routes/skills.js` — Skills Endpoints

All routes use the `protect` middleware — unauthenticated requests get 401.

| Method | Path | What it does |
|---|---|---|
| GET | /api/skills | Returns all skills for req.user |
| POST | /api/skills | Creates a skill for req.user |
| DELETE | /api/skills/:id | Deletes skill (only if it belongs to req.user) |

**Security note on delete:**
```js
// Always filter by BOTH id AND userId
// Prevents user A from deleting user B's skills
const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
```

---

## 7. Database — Models and Schema

### MongoDB vs SQL

MongoDB stores documents (like JSON objects) instead of rows in tables.

```
SQL (Supabase/PostgreSQL):          MongoDB Atlas:
┌─────────────────────┐             {
│ id | name | email   │               _id: ObjectId,
│ 1  | John | j@g.com │               name: "John",
└─────────────────────┘               email: "j@g.com"
                                    }
```

### Collections in this app

**users** collection:
```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e1",
  "fullName": "Gaurang Panchal",
  "email": "gaurang@gmail.com",
  "password": "$2a$10$...(hashed)",
  "googleId": null,
  "avatarUrl": "",
  "createdAt": "2025-01-15T10:30:00.000Z"
}
```

**skills** collection:
```json
{
  "_id": "64a1b2c3d4e5f6a7b8c9d0e2",
  "userId": "64a1b2c3d4e5f6a7b8c9d0e1",
  "skillName": "Python",
  "aiSuggestedCategory": "Money",
  "finalCategory": "Money",
  "aiReason": "Python is highly valued in data science and backend development.",
  "createdAt": "2025-01-15T11:00:00.000Z"
}
```

### Relationships
Skills belong to Users via `userId` — this is a reference (like a foreign key in SQL).
There is no automatic join — you query skills where `userId` matches the logged-in user's `_id`.

---

## 8. API Reference — All Endpoints

### Base URL
```
Development:  http://localhost:5000
Production:   https://multiskills-mern-production.up.railway.app
```

### Auth Endpoints

**POST /api/auth/signup**
```json
// Request body:
{ "fullName": "John Doe", "email": "john@gmail.com", "password": "secret123" }

// Response 201:
{ "token": "eyJhbG...", "user": { "id": "...", "fullName": "John Doe", "email": "..." } }

// Error 400:
{ "error": "An account with this email already exists." }
```

**POST /api/auth/signin**
```json
// Request body:
{ "email": "john@gmail.com", "password": "secret123" }

// Response 200:
{ "token": "eyJhbG...", "user": { "id": "...", "fullName": "John Doe", "email": "..." } }

// Error 401:
{ "error": "Invalid email or password." }
```

**GET /api/auth/me** *(requires Authorization header)*
```json
// Response 200:
{ "user": { "id": "...", "fullName": "John Doe", "email": "...", "avatarUrl": "" } }
```

**GET /api/health**
```json
// Response 200:
{ "status": "ok", "message": "MultiSkills API is running", "env": "production" }
```

### Skills Endpoints *(all require Authorization: Bearer token)*

**GET /api/skills**
```json
// Response 200:
{ "skills": [ { "_id": "...", "skillName": "Python", "finalCategory": "Money", ... } ] }
```

**POST /api/skills**
```json
// Request body:
{
  "skillName": "Python",
  "aiSuggestedCategory": "Money",
  "finalCategory": "Money",
  "aiReason": "Python is highly valued in data science."
}

// Response 201:
{ "skill": { "_id": "...", "skillName": "Python", ... } }
```

**DELETE /api/skills/:id**
```json
// Response 200:
{ "message": "Skill deleted." }

// Error 404:
{ "error": "Skill not found." }
```

---

## 9. Authentication — How JWT Works

JWT (JSON Web Token) is the industry standard for stateless auth.

### Structure
A JWT has 3 parts separated by dots:
```
eyJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY0YTEifQ.abc123signature
     HEADER                  PAYLOAD           SIGNATURE
```

- **Header** — algorithm used (HS256)
- **Payload** — data stored: `{ id: "userId", iat: timestamp, exp: timestamp }`
- **Signature** — proves the token wasn't tampered with

### Flow in this app
```
1. User signs in → backend creates JWT with user's ID
2. JWT stored in localStorage as 'ms_token'
3. Every API call: Authorization: Bearer <token>
4. Backend middleware decodes token → gets user ID
5. Fetches user from DB → attaches to req.user
6. Token expires after 7 days → user must login again
```

### Security notes
- Never store sensitive data in JWT payload — it's base64 encoded, not encrypted
- JWT_SECRET must be long and random — used to sign and verify tokens
- In this app, tokens expire in 7 days (JWT_EXPIRES_IN=7d)

---

## 10. UI System — Fonts, Colors, Icons

Everything is in `frontend/src/styles/globals.css`.

### Fonts
```css
/* Two fonts are loaded from Google Fonts */
@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond&family=DM+Mono&display=swap');

--font-display: 'Cormorant Garamond', Georgia, serif;
/* Used for: headings, body text, inputs — elegant serif font */

--font-mono: 'DM Mono', 'Courier New', monospace;
/* Used for: labels, buttons, nav — technical monospace font */
```

### Color Palette
```css
/* Backgrounds */
--bg:          #0E0E0F;   /* main background — near black */
--bg-elevated: #1a1a1c;   /* cards, drawer — slightly lighter */
--bg-hover:    #222226;   /* hover state */

/* Text — 4 levels of brightness */
--text:        #F0EDE6;   /* primary text — bright warm white */
--text-mid:    #B0AAA2;   /* secondary text — medium gray */
--text-muted:  #787068;   /* labels, hints — darker gray */
--text-dim:    #4a4540;   /* decorative only — barely visible */

/* Category colors */
--money:       #D4B87A;   /* gold */
--soul:        #8ECAB4;   /* sage green */
--curiosity:   #B8ACDA;   /* violet */

/* Each category also has -bg and -border variants */
--money-bg:     rgba(212, 184, 122, 0.09);  /* very subtle tint */
--money-border: rgba(212, 184, 122, 0.28);  /* border color */
```

### Icons
This app uses **Unicode symbols** as icons — no icon library needed:
```
◈  Money (filled diamond)
◎  Soul (circle with dot)
◇  Curiosity (empty diamond)
×  Close button
›  Arrow right
←  Back arrow
```

To use a different icon: just change the character in the JSX.

### Utility Classes
```css
.btn          /* base button style */
.btn-primary  /* filled button */
.btn-ghost    /* outlined button */
.btn-danger   /* red outlined button */
.input-line   /* borderless bottom-border input */
.label        /* uppercase mono small caps */
.divider      /* 1px horizontal line */
.page         /* full screen page container */
.page-inner   /* centered content, max 540px wide */
.fade-up      /* fade + slide up animation */
.fade-up-delay-1/2/3/4  /* staggered animation delays */
.modal-backdrop  /* fullscreen dark overlay */
.modal-box       /* centered modal box */
```

---

## 11. How to Change the Design

### Change the background color
```css
/* In globals.css */
--bg: #0E0E0F;   /* Change this to any color */
/* e.g. white theme: */
--bg: #FFFFFF;
--text: #1a1a1a;
--bg-elevated: #F5F5F5;
```

### Change the fonts
```css
/* Step 1: Replace the Google Fonts import URL */
@import url('https://fonts.googleapis.com/css2?family=YOUR_FONT&display=swap');

/* Step 2: Update the variable */
--font-display: 'YOUR_FONT', serif;

/* Good alternatives to Cormorant Garamond: */
/* Playfair Display, Libre Baskerville, Lora, EB Garamond */
```

### Change font sizes
```css
body { font-size: 18px; }        /* Base size — everything scales from this */
.input-line { font-size: 19px; } /* Input text */
.btn { font-size: 11px; }        /* Button text */
.label { font-size: 11px; }      /* Label text */
```

### Change category colors
```css
/* Change Money from gold to blue */
--money:        #7AB8D4;
--money-bg:     rgba(122, 184, 212, 0.09);
--money-border: rgba(122, 184, 212, 0.28);
```

### Change border radius (add rounded corners)
```css
--radius: 0px;   /* Currently sharp/flat — change to 8px for rounded */

/* Then use it in components: */
border-radius: var(--radius);
```

### Change the category icons
In any component, find `◈`, `◎`, `◇` and replace:
```jsx
/* Example: use emoji instead */
{ icon: '💰', label: 'Money' }
{ icon: '🌱', label: 'Soul' }
{ icon: '🔭', label: 'Curiosity' }
```

### Add a light/dark mode toggle
```css
/* Add to globals.css */
[data-theme="light"] {
  --bg: #FAFAF8;
  --bg-elevated: #F0EDE6;
  --text: #1a1a1a;
  --text-mid: #4a4540;
}
```
```jsx
// Toggle with:
document.documentElement.setAttribute('data-theme', 'light');
```

---

## 12. How to Add New Features

### Forgot Password

**Step 1 — Install nodemailer on backend:**
```bash
cd backend
npm install nodemailer
```

**Step 2 — Add to User model:**
```js
// In models/User.js
resetPasswordToken:   String,
resetPasswordExpires: Date,
```

**Step 3 — Add routes to backend/routes/auth.js:**
```js
// POST /api/auth/forgot-password
// 1. Find user by email
// 2. Generate random token: crypto.randomBytes(20).toString('hex')
// 3. Save token + expiry (1 hour) to user
// 4. Send email with reset link: https://your-app.vercel.app/reset-password?token=xxx
router.post('/forgot-password', async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(404).json({ error: 'Email not found.' });

  const token = require('crypto').randomBytes(20).toString('hex');
  user.resetPasswordToken = token;
  user.resetPasswordExpires = Date.now() + 3600000; // 1 hour
  await user.save();

  // Send email with nodemailer here
  res.json({ message: 'Reset email sent.' });
});

// POST /api/auth/reset-password
// 1. Find user by token (check not expired)
// 2. Set new password (pre-save hook will hash it)
// 3. Clear the token fields
router.post('/reset-password', async (req, res) => {
  const user = await User.findOne({
    resetPasswordToken: req.body.token,
    resetPasswordExpires: { $gt: Date.now() },
  });
  if (!user) return res.status(400).json({ error: 'Token expired or invalid.' });

  user.password = req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ message: 'Password reset successful.' });
});
```

**Step 4 — Add to frontend api.js:**
```js
forgotPassword: (email) =>
  request('/api/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  }),

resetPassword: (token, password) =>
  request('/api/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  }),
```

**Step 5 — Add UI in AuthPage.jsx:**
Add a "Forgot password?" link that shows an email input form.

---

### Edit Skill Category

**Backend — add PUT route to routes/skills.js:**
```js
router.put('/:id', async (req, res) => {
  const skill = await Skill.findOne({ _id: req.params.id, userId: req.user._id });
  if (!skill) return res.status(404).json({ error: 'Skill not found.' });

  skill.finalCategory = req.body.finalCategory;
  await skill.save();
  res.json({ skill });
});
```

**Frontend — add to api.js:**
```js
update: (id, data) =>
  request(`/api/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),
```

**Frontend — add to useSkills.js:**
```js
async function updateSkill(id, finalCategory) {
  const { skill } = await skillsAPI.update(id, { finalCategory });
  setSkills(prev => prev.map(s => s._id === id ? skill : s));
}
```

---

### Search / Filter Skills

**Frontend only — no backend changes needed:**
```js
// In CategoryPage.jsx
const [search, setSearch] = useState('');
const filtered = skills.filter(s =>
  s.skillName.toLowerCase().includes(search.toLowerCase())
);

// Add input above the skills list:
<input
  className="input-line"
  placeholder="Search skills..."
  value={search}
  onChange={e => setSearch(e.target.value)}
/>
```

---

### User Profile Edit (change name)

**Backend — add PUT route to routes/auth.js:**
```js
router.put('/profile', protect, async (req, res) => {
  const user = await User.findByIdAndUpdate(
    req.user._id,
    { fullName: req.body.fullName },
    { new: true }
  );
  res.json({ user });
});
```

**Frontend — add form in AccountDrawer.jsx** with an edit name input.

---

## 13. Deployment Guide

### When you make changes

**Frontend change:**
```bash
git add .
git commit -m "describe what you changed"
git push
# Vercel auto-deploys in ~30 seconds
```

**Backend change:**
```bash
git add .
git commit -m "describe what you changed"
git push
# Railway auto-deploys in ~60 seconds
```

Both are connected to the same GitHub repo — one push updates both.

### Environment setup for new machine
```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/MultiSkills-MERN.git
cd MultiSkills-MERN

# Backend setup
cd backend
npm install
cp .env.example .env
# Fill in .env with real values
npm run dev

# Frontend setup (new terminal)
cd frontend
npm install
cp .env.example .env
# Set VITE_API_URL=http://localhost:5000
npm run dev
```

### Services and their dashboards
| Service | Dashboard | What to check |
|---|---|---|
| Vercel | vercel.com | Deployments, env vars, domains |
| Railway | railway.app | Deploy logs, env vars, usage |
| MongoDB Atlas | cloud.mongodb.com | Collections, users, network access |
| Google Cloud | console.cloud.google.com | OAuth credentials, redirect URIs |

---

## 14. Environment Variables

### Backend (`backend/.env`)
| Variable | Example | Required | Purpose |
|---|---|---|---|
| PORT | 5000 | Yes | Server port |
| NODE_ENV | development | Yes | Enables dev/prod behavior |
| MONGODB_URI | mongodb+srv://... | Yes | Database connection |
| JWT_SECRET | long_random_string | Yes | Signs JWT tokens |
| JWT_EXPIRES_IN | 7d | Yes | Token lifetime |
| CLIENT_URL | https://your.vercel.app | Yes | CORS allowed origin |
| GOOGLE_CLIENT_ID | xxx.apps.googleusercontent.com | Yes | Google OAuth |
| GOOGLE_CLIENT_SECRET | GOCSPX-xxx | Yes | Google OAuth |
| GOOGLE_CALLBACK_URL | https://railway.../callback | Yes | Google redirect |
| SESSION_SECRET | long_random_string | Yes | Express sessions |

### Frontend (`frontend/.env`)
| Variable | Example | Required | Purpose |
|---|---|---|---|
| VITE_API_URL | http://localhost:5000 | Yes | Backend URL |

**Important rules:**
- Never commit `.env` files to GitHub
- Frontend variables must start with `VITE_` to be accessible in React
- `process.env.X` in backend, `import.meta.env.VITE_X` in frontend

---

## 15. Things to Remember for Future Projects

### Architecture principles
- **Separate frontend and backend** — different repos or monorepo folders, different deployments
- **Never expose secrets in frontend code** — API keys in backend only (except this app uses Anthropic in frontend for simplicity)
- **Use environment variables** for everything that changes between dev and production
- **Monorepo** = one GitHub repo, multiple folders — good for solo/small team projects
- **Index on frequently queried fields** — `userId` in Skill model has `index: true` for fast queries

### Authentication rules
- Always hash passwords with bcrypt — never store plain text
- JWT secret must be long (32+ chars) and random
- Use `select: false` on password field in Mongoose schema
- Always check `userId` when fetching/deleting user data (security)
- `refreshToken` flow: for apps that need tokens to last longer than 7 days

### API design rules
- Use proper HTTP methods: GET (read), POST (create), PUT (update), DELETE (delete)
- Return consistent response shapes: `{ data }` on success, `{ error }` on failure
- Use proper HTTP status codes: 200 (ok), 201 (created), 400 (bad request), 401 (unauthorized), 404 (not found), 500 (server error)
- Always validate input on the backend — never trust frontend data
- Protect routes with middleware, not inside the route handler

### React patterns used in this project
- **Context + useContext** — global state (auth) shared across all components
- **Custom hooks** — useSkills encapsulates all data fetching logic
- **Lifting state up** — App.jsx manages screen/routing state
- **Props drilling** — passing callbacks down (onStart, onBack, onViewCategory)
- **Controlled inputs** — all form inputs use value + onChange
- **useEffect for side effects** — fetching data, reading URL params

### MongoDB / Mongoose rules
- Always use `findOne({ _id: id, userId: req.user._id })` when fetching user-owned data
- `timestamps: true` in schema options gives you `createdAt` and `updatedAt` for free
- `select: false` hides sensitive fields by default
- Pre-save hooks run automatically — great for hashing passwords
- Enum validation on categories prevents invalid data

### CORS — what it is and when it matters
CORS (Cross-Origin Resource Sharing) blocks browser requests when frontend and backend are on different domains. Always configure it on the backend:
```js
app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.options('*', cors()); // Handle preflight requests
```

### CSS variables — always use them
```css
/* Good — easy to change globally */
color: var(--text);

/* Bad — hard-coded, have to find/replace everywhere */
color: #F0EDE6;
```

### Git workflow for every change
```bash
git status          # see what changed
git add .           # stage all changes
git commit -m "..."  # descriptive message
git push             # deploy automatically
```

### Things that will break and why
| Symptom | Likely cause |
|---|---|
| Blank white page | Top-level throw in JS, or "type":"module" in package.json |
| CORS error | CLIENT_URL wrong in Railway, or missing app.options('*', cors()) |
| 401 Unauthorized | Token expired or missing Authorization header |
| Skills not showing names | Field name mismatch (snake_case vs camelCase) |
| Google OAuth 404 | vercel.json missing, or redirect URI not in Google Console |
| "Failed to fetch" | Backend sleeping (Railway free tier) or wrong VITE_API_URL |

---

*Built with React, Node.js, Express, MongoDB, JWT, and Anthropic Claude API.*
*Deployed on Vercel (frontend) and Railway (backend).*
