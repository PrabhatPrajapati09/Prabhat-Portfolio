import { Router } from "express";
import { getProjects, addProject, updateProject, deleteProject } from "../controllers/projectsController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = Router();

router.get("/", getProjects);
router.post("/add", authMiddleware, addProject);
router.put("/update/:id", authMiddleware, updateProject);
router.delete("/delete/:id", authMiddleware, deleteProject);

export default router;
