import { Request, Response } from "express";
import Task from "../models/task.model"; // "todo" ko "task" se replace kiya
import { AuthenticatedRequest } from "../types/global";

const getUserTasks = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        if (!req.user) {
            return;
        }
        const userTasks = await Task.find({ userId: req.user._id });

        if (!userTasks) {
            throw new Error("Error while fetching Tasks");
        }
        res.json({
            success: true,
            message: "tasks fetched successfully",
            data: userTasks
        });
    } catch (error: any) {
        res.json({
            success: false,
            message: error.message
        });
    }
};

const addTask = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const userId = req.user?._id;
        const { title, description, status, dueDate } = req.body;

        if (!title || !dueDate) {
            return res.status(400).json({
                success: false,
                message: "Title, status, and dueDate are required fields"
            });
        }

        const newTask = await Task.create({
            title,
            description,
            status,         // enum: "To Do", "In Progress", "Completed"
            dueDate,        // type: Date
            userId
        });

        res.status(201).json({
            success: true,
            data: newTask
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};

const updateTask = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const { title, description, status, dueDate } = req.body;

        const updatedFields: any = {};
        if (title) updatedFields.title = title;
        if (description) updatedFields.description = description;
        if (status) updatedFields.status = status;
        if (dueDate) updatedFields.dueDate = dueDate;

        const updatedTask = await Task.findByIdAndUpdate(
            id,
            { $set: updatedFields },
            { new: true }
        );

        if (!updatedTask) {
            return res.status(404).json({
                success: false,
                message: "Task not found"
            });
        }

        res.json({
            success: true,
            data: updatedTask
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong"
        });
    }
};


const deleteTask = async (req: AuthenticatedRequest, res: Response): Promise<any> => {
    try {
        const { id } = req.params;
        const deletedTask = await Task.findByIdAndDelete(id);

        if (!deletedTask) throw new Error("Error while deleting");

        res.json({
            success: true,
            message: "task deleted successfully"
        });
    } catch (error: any) {
        res.json({
            success: false,
            message: error.message
        });
    }
};



export { updateTask, addTask, deleteTask, getUserTasks };
