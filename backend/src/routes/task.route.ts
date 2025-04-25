import { Router } from "express";
import { updateTask, addTask, deleteTask, getUserTasks } from "../controllers/task.controller";
import verifyJWT from "../middlewares/auth.middleware";

const router = Router();

// Get all tasks for a user
router.get("/tasks", verifyJWT, getUserTasks);

// Create a new task
router.post("/tasks", verifyJWT, addTask);

// Update a task by ID
router.patch("/tasks/:id", verifyJWT, updateTask);


// Delete a task by ID
router.delete("/tasks/:id", verifyJWT, deleteTask);

export default router;
