import jwt from "jsonwebtoken";

export const authMiddleware = (req, res , next) => {
    try {
        if(!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Authorization token is mandatory!!" });
        }
        
        const token = req.headers.authorization.split(" ")[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "Prabhat_Portfolio_PhoenixAsh0099_JWT_SECRET_KEY");
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized" });
    }
}