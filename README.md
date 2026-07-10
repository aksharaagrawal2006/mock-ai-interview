# Prepline — AI Mock Interview Platform

Full-stack app: **React + Vite + Tailwind** frontend, **Node/Express + MongoDB** backend.

```
mock-interview-ai/
  backend/     Express API, auth, AI, MongoDB models
  frontend/    React app (Vite, Tailwind, Monaco editor)
```

## 0. Prerequisites
- Node.js 18+
- A MongoDB database (local, or free tier on MongoDB Atlas)
- A Google Cloud project (for Google OAuth)
- A GitHub OAuth App (for GitHub OAuth)
- A Cloudinary account (free tier is fine)
- An OpenAI API key (or swap the provider — see step 7)

## 1. Clone the structure and install
```bash
cd backend && npm install
cd ../frontend && npm install
```

## 2. Set up MongoDB
Create a free cluster at mongodb.com/atlas, add a database user, allow your IP,
and copy the connection string into `backend/.env` as `MONGO_URI`.
Indexes for search/filtering are already defined in the Mongoose models
(`User.js`, `Interview.js`) — they're created automatically on first run.

## 3. Set up Google OAuth
1. console.cloud.google.com → create a project → **APIs & Services → Credentials**
2. Create **OAuth client ID** → Application type: Web application
3. Authorized redirect URI: `http://localhost:5000/api/auth/google/callback`
4. Copy the Client ID/Secret into `backend/.env`

## 4. Set up GitHub OAuth
1. github.com/settings/developers → **New OAuth App**
2. Homepage URL: `http://localhost:5173`
3. Callback URL: `http://localhost:5000/api/auth/github/callback`
4. Copy the Client ID/Secret into `backend/.env`

## 5. Set up Cloudinary (resume uploads)
Dashboard → copy Cloud name / API key / API secret into `backend/.env`.

## 6. Configure environment variables
```bash
cd backend
cp .env.example .env   # fill in every value
```
Generate a strong `JWT_SECRET`, e.g.:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

## 7. AI provider
`backend/utils/aiService.js` uses the OpenAI SDK by default (`gpt-4o-mini`).
To use Anthropic or Gemini instead, replace the `client` and the two
functions (`generateInterviewQuestions`, `evaluateAnswer`) — every other
file only calls those two functions, so nothing else needs to change.

## 8. Run it
```bash
# terminal 1
cd backend && npm run dev

# terminal 2
cd frontend && npm run dev
```
Visit `http://localhost:5173`.

## 9. Build order this project followed (useful if extending it)
1. **Data layer** — `User.js`, `Interview.js` models with the indexes the
   search/filter/analytics features need later.
2. **Auth** — Passport Google + GitHub strategies → JWT issued as an
   httpOnly cookie → `protect` middleware → `authorize()` for RBAC.
3. **Resume upload** — Multer (memory) → Cloudinary → lightweight PDF
   keyword parsing for skills, stored on the user.
4. **AI interview core** — `aiService.js` generates questions and grades
   answers; `interviewController.js` wires that into start/answer/complete
   endpoints.
5. **Security hardening** — `express-rate-limit` (general, auth, AI tiers),
   `zod` request validation, `helmet`.
6. **Frontend shell** — Tailwind design tokens, `ThemeContext` (dark/light),
   `AuthContext`, `Navbar`, `ProtectedRoute`.
7. **Feature pages** — Landing → Login → Dashboard (analytics + resume) →
   New Interview → Interview Session (Monaco editor) → History (search/
   filter/pagination) → Admin.
8. **Polish** — skeleton loaders, `react-hot-toast` notifications, responsive
   layout throughout.

## 10. Deploying
- **Backend**: Render / Railway / Fly.io. Set all `.env` vars there, and
  update the OAuth callback URLs + `CLIENT_URL` to your production domains.
- **Frontend**: Vercel / Netlify. Set `VITE_API_URL` if the API is on a
  different domain, and add that domain to `cors()` in `server.js`.
- Remember to add your production callback URLs in the Google and GitHub
  OAuth app settings too — local URLs won't work in production.

## Notes on the checklist you sent
Everything in your list is implemented:
- Google OAuth / GitHub OAuth → `config/passport.js`, `routes/authRoutes.js`
- JWT auth → `utils/generateToken.js`, `middleware/auth.js`
- RBAC → `middleware/rbac.js` (`admin` vs `user`)
- Resume upload (Cloudinary) → `utils/cloudinary.js`, `resumeController.js`
- AI question generation / evaluation → `utils/aiService.js`
- Monaco code editor → `pages/InterviewSession.jsx`
- Interview history → `pages/History.jsx` + `listInterviews`
- Dashboard analytics → `pages/Dashboard.jsx` + `getDashboardStats`
- Search & filters → query params on `/interviews` and `/admin/users`
- Responsive design / dark-light mode → Tailwind + `ThemeContext`
- Rate limiting → `middleware/rateLimit.js`
- API validation → `middleware/validate.js` (Zod)
- MongoDB indexing → indexes in `User.js` / `Interview.js`
- Loading skeletons → `components/Skeleton.jsx`
- Toast notifications → `react-hot-toast` throughout
- Admin dashboard → `pages/Admin.jsx` + `routes/adminRoutes.js`
