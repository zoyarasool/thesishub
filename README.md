# ThesisHub

🔗 **Live Demo:** [thesishub-mu.vercel.app](https://thesishub-mu.vercel.app)

A full-stack MERN application that connects students with faculty supervisors for thesis and research collaboration. Built to streamline supervisor discovery, project proposals, milestone tracking, document sharing, and meeting scheduling.

## Features

- **Role-based authentication** (Student / Supervisor) with JWT
- **Multi-step thesis submission** — proposal details, supervisor selection, and review in one guided flow
- **Supervisor discovery** — search and filter by department and research interests
- **Request management** — approve/reject supervision requests with meeting scheduling
- **Milestone tracking** — supervisors set project milestones, students update progress
- **Document sharing** — students upload thesis documents (PDF/Word) for supervisor review
- **Meeting history** — scheduled meetings with agendas and notes
- **Notifications** — real-time updates on request status changes
- **Profile management** — edit profile, change password, delete account
- **Dark/Light mode** with persistent theme preference
- **Responsive, modern UI** built with Tailwind CSS

## Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS, Axios, React Hot Toast, Lucide Icons

**Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT Authentication, bcrypt, Multer

## Project Structure
thesishub/
├── client/ # React frontend
└── server/ # Express + MongoDB backend

## Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account (or local MongoDB)

### Backend Setup
```bash
cd server
npm install
# Create a .env file with MONGO_URI, JWT_SECRET, JWT_REFRESH_SECRET, CLIENT_URL, PORT
npm run dev
```

### Frontend Setup
```bash
cd client
npm install
npm run dev
```

## Author

Built by Zoya Rasool as a portfolio project.