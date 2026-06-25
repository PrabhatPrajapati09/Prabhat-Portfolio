import { Router } from "express";
import { AdminLogin, verifyToken } from "../controllers/authController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.post("/admin/login", AdminLogin);
router.get("/admin/verify", authMiddleware, verifyToken);

export default router;