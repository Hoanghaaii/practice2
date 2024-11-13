import jwt from 'jsonwebtoken';

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    console.log("Received token:", token);
    try {
        if (!token) {
            return res.status(401).json({ success: false, message: "Token not provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!decoded) {
            return res.status(403).json({ success: false, message: "Token not valid" });
        }

        req.userId = decoded.userId;
        next();
    } catch (error) {
        console.error("Error verifying token:", error.message);
        return res.status(500).json({ success: false, message: "Server error" });
    }
};
