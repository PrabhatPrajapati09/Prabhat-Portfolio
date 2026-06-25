import { Router } from "express";
import { getPortfolioDetails, updatePortfolioDetails } from "../controllers/portfolioController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getPortfolioDetails);
router.put("/update", authMiddleware, updatePortfolioDetails);  

export default router;