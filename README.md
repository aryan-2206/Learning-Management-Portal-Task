# Round 2 Submission – Full Stack Intern

## Candidate Details

- **Name:** Aryan Doshi
- **Position Applied:** Full Stack Intern
- **Organization:** Amaanatvam Foundation
- **Round:** Round 2 – Task-Based Evaluation
- **Task:** Learning Management System
---

# LearnSphere – Learning Management System

LearnSphere is a premium, production-ready Learning Management System (LMS) built with the MERN stack. Designed with a modern SaaS aesthetic, it features smooth micro-interactions, dark/light mode, and a responsive layout tailored for a top-tier learning experience.

## Features

**For Students:**
- 🎓 Browse and search for premium courses
- 🚀 Track learning progress with an intuitive dashboard
- 📺 Watch lessons in a Netflix-style course player
- 👤 Manage personal profile and avatar
- 🌙 Built-in Dark Mode and Light Mode

**For Administrators:**
- 📈 View platform statistics and analytics
- 🛠️ Create, edit, and manage courses and lessons
- 👥 Monitor student enrollments

## Technology Stack

- **Frontend:** React (Vite), Tailwind CSS v4, Framer Motion, Zustand, React Router DOM, React Hook Form, Zod, Lucide React Icons.
- **Backend:** Node.js, Express.js, MongoDB Atlas, Mongoose, JWT, bcryptjs.

## Folder Structure

```
Learning_Management_Portal/
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── layouts/        # Page layouts (Main Layout, etc.)
│   │   ├── pages/          # Application pages (Auth, Student, Admin)
│   │   ├── services/       # API configuration (Axios)
│   │   ├── store/          # Zustand global state (Auth, Theme)
│   │   └── index.css       # Tailwind configuration and custom theme variables
│   └── ...
├── server/                 # Backend Node.js API
│   ├── config/             # Database connection setup
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Authentication and Error handling
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # Express routes
│   ├── scripts/            # Database seed scripts
│   └── server.js           # Main entry point
└── README.md
```

## Installation Guide

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas Account (or local MongoDB)

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd Learning_Management_Portal
```

### 2. Setup Backend Environment Variables
Create a `.env` file in the `server` directory and add the following:
```env
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRE=30d
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Setup Frontend Environment Variables
Create a `.env` file in the `client` directory and add the following:
```env
VITE_API_URL=http://localhost:5000/api
```

### 4. Install Dependencies
**Backend:**
```bash
cd server
npm install
```

**Frontend:**
```bash
cd ../client
npm install
```

### 5. Seed Database (Optional)
To populate the database with an Admin account and dummy courses/lessons:
```bash
cd server
node scripts/seed.js
```
*Note: Make sure your MongoDB URI is correctly set before running the seed script.*

### 6. Run the Application
Start the backend server:
```bash
cd server
npm run dev
```

Start the frontend development server:
```bash
cd client
npm run dev
```

The application will be running at `http://localhost:5173`.

## API Documentation

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user & get token
- `GET /api/auth/me` - Get current user profile
- `GET /api/courses` - Get all courses (supports search & pagination)
- `GET /api/courses/:id` - Get single course details
- `POST /api/courses` - Create new course (Admin)
- `POST /api/enroll` - Enroll in a course
- `GET /api/enroll/my-courses` - Get enrolled courses for student
- `POST /api/progress` - Mark a lesson as complete

## Live Demo

| Service | URL |
|---|---|
| 🌐 **Frontend** (Vercel) | https://learning-management-portal-task.vercel.app |
| ⚙️ **Backend API** (Render) | https://learning-management-portal-task.onrender.com |

## Deployment Instructions

### Frontend (Vercel)

1. Push the repository to GitHub.
2. Go to [Vercel](https://vercel.com) → **Add New Project** → Import repository.
3. Set the **Root Directory** to `client`.
4. Under **Environment Variables**, add:

   | Variable | Value |
   |---|---|
   | `VITE_API_URL` | `https://<your-render-app>.onrender.com/api` |

5. Click **Deploy**.
6. Add a `vercel.json` inside the `client/` folder for SPA client-side routing support:
   ```json
   {
     "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
   }
   ```
   *(Already included in this repo.)*

> ⚠️ **Important:** Vite embeds `VITE_*` env vars at **build time**. After adding or changing `VITE_API_URL` on Vercel, you must **trigger a redeploy** for the change to take effect.

---

### Backend (Render)

1. Go to [Render](https://render.com) → **New Web Service**.
2. Connect your GitHub repository.
3. Set the **Root Directory** to `server`.
4. Set **Build Command** to `npm install` and **Start Command** to `npm start`.
5. Under **Environment Variables**, add **all** of the following:

   | Variable | Value |
   |---|---|
   | `PORT` | `5000` |
   | `MONGODB_URI` | Your MongoDB Atlas connection string |
   | `JWT_SECRET` | A strong secret string |
   | `JWT_EXPIRE` | `30d` |
   | `NODE_ENV` | `production` |
   | `FRONTEND_URL` | `https://<your-vercel-app>.vercel.app` |

6. Click **Create Web Service**.

> ⚠️ **Important:** Render runs behind a reverse proxy. The server is already configured with `app.set('trust proxy', 1)` — this is required for `secure: true` cookies to work correctly over HTTPS.

> ⚠️ **Note on Cross-Origin Cookies:** Since the frontend (Vercel) and backend (Render) are on different domains, auth cookies are set with `sameSite: 'none'` and `secure: true` in production. This is already handled in the codebase.

---

## Future Improvements

- File uploads for Avatars and Video hosting integration (AWS S3 or Mux).
- Advanced course analytics for instructors.
- Quizzes and Certification upon course completion.
- Payment gateway integration (Stripe) for premium courses.

## License
MIT License.
