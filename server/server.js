import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';
import authRoutes from './routes/authRoutes.js';
import analyticsRoutes from './routes/analyticsRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';
import projectsRoutes from './routes/projectsRoutes.js';
import portfolioRoutes from  './routes/portfolioRoutes.js';

dotenv.config()

const app = express();

const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
    origin: frontendUrl,
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));
app.use(express.json());

connectDB();

app.use("/api/portfolio", portfolioRoutes);
app.use("/api", authRoutes);
app.use("/api/stats", analyticsRoutes);
app.use("/api/skills", skillsRoutes);
app.use("/api/projects", projectsRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server running on port ${PORT}`));