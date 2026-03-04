<div align="center">

<img src="https://github.com/Ayukgiress/UPTRACK/blob/dev/Screenshot%20from%202026-03-02%2012-57-48.png?raw=true" width="800"/>

# TaskyDev

**A modern task management platform built for developers and teams.**

[![Live Demo](https://img.shields.io/badge/🌍%20Live%20Demo-taskydev.vercel.app-6E57F7?style=for-the-badge)](https://taskydev.vercel.app/)
[![GitHub](https://img.shields.io/badge/📂%20Source%20Code-UPTRACK-181717?style=for-the-badge&logo=github)](https://github.com/Ayukgiress/UPTRACK)
![Status](https://img.shields.io/badge/Status-Live%20%2F%20Production-22c55e?style=for-the-badge)

</div>

---

## 📖 About

TaskyDev is a full-stack task management application designed to help developers and teams organize, track, and complete tasks efficiently. It combines task management, team collaboration, and real-time chat in one clean interface.

---

## ✨ Features

- ✅ **Task Management** — Create, edit, delete, and organize tasks with ease
- 🔐 **User Authentication** — Secure signup and login with protected routes
- 👥 **Team Collaboration** — Invite team members and work together on projects
- 💬 **Real-time Chat** — Communicate with your team without leaving the app

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React · TypeScript · TailwindCSS · Vite |
| Backend | Node.js · Express |
| Database | MongoDB |
| Deployment | Vercel |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- MongoDB database

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/Ayukgiress/UPTRACK.git
cd UPTRACK
```

**2. Install dependencies:**
```bash
# Frontend
npm install



**3. Set up environment variables:**

Create a `.env` file in the `server/` folder:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

Create a `.env` file in the `client/` folder:
```env
VITE_API_URL=http://localhost:5000
```

**4. Run the app:**
```bash
# Backend
cd server
npm run dev

# Frontend (in a new terminal)
cd client
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
UPTRACK/
├── client/               # React frontend
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page components
│   │   ├── hooks/        # Custom hooks
│   │   └── utils/        # Helper functions
├── server/               # Node.js backend
│   ├── routes/           # API routes
│   ├── models/           # MongoDB models
│   ├── controllers/      # Route controllers
│   └── middleware/       # Auth & other middleware
```

---

## 🌍 Live Demo

👉 [https://taskydev.vercel.app](https://taskydev.vercel.app)

---

## 👨‍💻 Author

**Ayuk Giress**

[![GitHub](https://img.shields.io/badge/GitHub-Ayukgiress-181717?style=flat-square&logo=github)](https://github.com/Ayukgiress)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-ayuk--giress-0A66C2?style=flat-square&logo=linkedin)](https://www.linkedin.com/in/ayuk-giress)
[![Twitter](https://img.shields.io/badge/Twitter-@AyukGiress-000000?style=flat-square&logo=x)](https://twitter.com/AyukGiress)

---

<div align="center">

Made  by Ayuk Giress

</div>
