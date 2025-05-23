import express from "express";
import {
  register,
  verifyUser,
  login,
  getMe
} from "../controllers/userController.js";
import { isAuth } from "../middleware/auth.js";
import { getDashboard } from '../controllers/dashboardController.js';

const router = express.Router();

router.post("/register", register);
router.post("/verify", verifyUser);
router.post("/login", login);
router.get("/me", isAuth, getMe);
router.get('/dashboard', isAuth, getDashboard);

export default router;
