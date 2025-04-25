// models/Task.ts
import mongoose, { Schema, Document, Types } from "mongoose";

export interface ITask extends Document {
    title: { type: string, required: true },
    description: { type: string, required: true };
    status: "To Do" | "InProgress" | "Done";
    dueDate: Date;
    userId: Types.ObjectId;
}

const TaskSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    status: {
        type: String,
        enum: ["Todo", "InProgress", "Completed"],
        default: "Todo"
    },
    dueDate: { type: Date, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
}, { timestamps: true });

const Task = mongoose.model<ITask>("Task", TaskSchema);
export default Task;
