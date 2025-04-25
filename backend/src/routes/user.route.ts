import { Router } from "express";
import { registerUser, login, logout } from "../controllers/user.controller"; // Updated controller methods

const router = Router();

// User registration route
router.post('/register', registerUser);  // '/createuser' se '/register' kiya

// User login route
router.post('/login', login);

//User logout route
router.post('/logout', logout);

export default router;
