import Admin from "../models/Admin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const AdminLogin = async (req, res) => {
    try {
        const { email, secretKey } = req.body;

        if (!secretKey || !email) {
            return res.status(400).json({ message: "All fields are required" });
        }

        if (secretKey !== process.env.SECRET_KEY) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const sanitizedEmail = email.trim().toLowerCase();
        const admin = await Admin.findOne({ email: sanitizedEmail });
        
        if (!admin) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        if (!process.env.JWT_SECRET) {
            throw new Error("JWT_SECRET is not defined in environment variables");
        }

        const token = jwt.sign(
            { id: admin._id },
            process.env.JWT_SECRET,
            { expiresIn: "5d" }
        );

        return res.status(200).json({ 
            token, 
            message: "Login successful, Admin Mode Activated!!" 
        });

    } catch (error) {
        console.error("Admin Login Error:", error);
        return res.status(500).json({ message: "Server error" });
    }
}

export const verifyToken = async (req, res) => {
    return res.status(200).json({ valid: true, message: "Token is valid" });
}