import { Router } from "express";
import { getSkills, addSkill, updateSkill, deleteSkill } from "../controllers/skillsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getSkills);
router.post("/add", authMiddleware, addSkill);
router.put("/update/:id", authMiddleware, updateSkill);
router.delete("/delete/:id", authMiddleware, deleteSkill);

export default router;