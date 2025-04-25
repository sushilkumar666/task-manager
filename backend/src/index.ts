import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import dotenv from 'dotenv'
import userRoutes from './routes/user.route'
import todoRoutes from './routes/task.route'
import cookieParser from 'cookie-parser';

const app = express();
app.use(cors({
    origin: ['https://task-manager-ashy-five-22.vercel.app', 'http://localhost:5173'], // allowed origins
    credentials: true, // Allow credentials (cookies, authorization headers)
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // Allow specific methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allow specific headers
}));

// If preflight request not handled automatically, manually handle OPTIONS request:
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.json())


dotenv.config();

connectDB();

app.use("/api/auth", userRoutes);
app.use("/api", todoRoutes)

app.get('/', (req, res) => {
    res.json({
        success: true,
        message: "api test successs"
    })
})


app.listen(3000, () => console.log("server is listening on port 3000"))