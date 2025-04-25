# 📝 Task Manager App (MERN Stack)

A full-stack task management web application built with the MERN stack (MongoDB, Express.js, ReactJS/Next.js, Node.js). This project provides user authentication, task CRUD operations, and a responsive UI. Ideal for learning and showcasing full-stack dev skills.

## 📁 Project Structure

```
.
├── frontend/       # React or Next.js application
└── backend/        # Node.js + Express.js server
```

## 🚀 Tech Stack

- **Frontend**: ReactJS / Next.js, Tailwind CSS or Bootstrap  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB or PostgreSQL  
- **Authentication**: JWT (Cookies or LocalStorage)  
- **Others**: Axios, dotenv, bcrypt, Mongoose

## 🛠 Features

### ✅ Core Features:
- User registration & login
- Secure JWT authentication (cookies used)
- Task CRUD (Create, Read, Update, Delete)
- Task filters (To Do / In Progress / Done)
- Due dates for tasks
- Responsive UI (mobile-first)

### 🎁 Bonus:
- Task sorting by status or due date
- Search tasks by title
- Loading & error handling UI
- Deployment on Vercel (frontend) + Render (backend)

## 🔧 Installation & Setup

### Clone the repo:
```bash
git clone https://github.com/your-username/task-manager.git
cd task-manager
```

### 🔙 Backend Setup (`/backend`)
```bash
cd backend
npm install
```

#### Create a `.env` file:
```env
PORT=3000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
NODE_ENV=development
```

Run the server:
```bash
npm run dev
```

### 🔜 Frontend Setup (`/frontend`)
```bash
cd frontend
npm install
```

#### Create a `.env` file:
```env
VITE_BACKEND_URL=http://localhost:3000
```

Start the frontend:
```bash
npm run dev
```

## 📡 API Documentation

### Auth Routes:
- `POST /api/auth/register` → Register new user  
- `POST /api/auth/login` → Login + set JWT cookie  

### Task Routes (Protected):
- `GET /api/tasks` → Get all tasks of user  
- `POST /api/tasks` → Create a new task  
- `PUT /api/tasks/:id` → Update a task  
- `DELETE /api/tasks/:id` → Delete a task  

#### 🧪 Sample Request:
```json
POST /api/auth/login
{
  "email": "test1@gmail.com",
  "password": "12345678"
}
```

#### 🧾 Sample Response:
```json
{
  "success": true,
  "user": {
    "name": "test1",
    "email": "test1@gmail.com"
  }
}
```

## 🧠 My Approach

- **Folder separation** for clean architecture.
- Used `JWT + HttpOnly cookies` for secure auth.
- Deployed MongoDB Atlas with Render & Vercel.
- **Faced issues** with cookies not working due to `SameSite` and `Secure` flags — fixed by configuring CORS and `cookie-parser`.
- Did not implement tests or `express-validator` yet (planned for v2).

## 🌐 Live Demo

🔗 [Live App](https://task-manager-ashy-five-22.vercel.app/)  
📦 Backend hosted on Render  
🎨 Frontend hosted on Vercel

## ✅ Evaluation Criteria (Self-Check)

- ✅ Clean, modular code with comments
- ✅ Functional JWT auth + CRUD
- ✅ Fully responsive design
- ✅ JWT + bcrypt security
- ✅ Graceful error handling
- ✅ Well-written README (you’re reading it 😉)
- ❌ Testing (planned)
- ❌ Express-validator (not used yet)

## 📬 Contact

Made with 💻 by sushilkumar (https://github.com/sushilkumar666). Feel free to fork, star, and raise issues.
