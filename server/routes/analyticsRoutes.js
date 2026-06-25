import { Router } from "express";
import { getAnalytics,getPublicAnalytics , updateStats } from "../controllers/analyticsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/",authMiddleware , getAnalytics);
router.get("/public", getPublicAnalytics);
router.put("/update", updateStats);

export default router;