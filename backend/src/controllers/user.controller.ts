import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import User from "../models/user.model";
import bcrypt from "bcryptjs";
import { AuthenticatedRequest } from "../types/global";

// 🔹 Register new user
const registerUser = async (req: Request, res: Response): Promise<any> => {
    try {
        const { name, email, password } = req.body;

        const existedUser = await User.findOne({ email });
        if (existedUser) {
            return res.status(400).json({ success: false, message: "User already exists" });
        }

        const salt = await bcrypt.genSalt(6);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🔹 Login
const login = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ success: false, message: "User does not exist" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ success: false, message: "Invalid credentials" });

        const accessToken = jwt.sign(
            { _id: user._id },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: "2h" }
        );

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            sameSite: "none",
        });

        res.status(200).json({
            success: true,
            message: "Login successful",
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// 🔹 Logout
const logout = (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.json({ success: true, message: "Logged out successfully" });
};

// 🔹 Get Current User
const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    try {
        if (!req.user) return res.status(401).json({ success: false, message: "Unauthorized" });

        const user = await User.findById(req.user._id).select("-password");
        res.json({ success: true, user });
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};

export { registerUser, login, logout, getCurrentUser };
