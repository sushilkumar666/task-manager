import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import User from "../models/user.model";
import { IUser } from "../models/user.model";

interface AuthenticatedRequest extends Request {
    user?: IUser;
}

interface DecodedToken extends JwtPayload {
    _id: string;
}

export const verifyJWT = (
    async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<any> => {
        try {
            // Look for the token in cookies or Authorization header
            const token =
                req.cookies?.accessToken ||
                req.header("Authorization")?.replace("Bearer ", "");

            // If token not found, return an error response
            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Unauthorized request: No token provided",
                });
            }

            // Verify and decode the token
            const decoded = jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET as string
            ) as DecodedToken;

            // If token is invalid or cannot be decoded
            if (!decoded) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid or expired token",
                });
            }

            // Find the user based on the decoded token
            const user = await User.findById(decoded._id).select("-password");

            // If user does not exist, return an error
            if (!user) {
                return res.status(401).json({
                    success: false,
                    message: "User not found or invalid token",
                });
            }

            // Attach the user object to the request
            req.user = user;

            // Proceed to the next middleware/route handler
            next();
        } catch (error: any) {
            // Return error response if something goes wrong
            return res.status(401).json({
                success: false,
                message: error?.message || "Error while verifying token",
            });
        }
    }
);

export default verifyJWT;
