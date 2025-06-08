import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("🔐 Auth middleware - Token present:", !!token);

        if (!token) {
            console.log("❌ Auth failed: No token provided");
            return res.status(401).json({ message: "Unauthorized - No Token Provided" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔐 Token decoded successfully, userId:", decoded.userId);

        if (!decoded) {
            console.log("❌ Auth failed: Invalid token");
            return res.status(401).json({ message: "Unauthorized - Invalid Token" });
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log("❌ Auth failed: User not found for ID:", decoded.userId);
            return res.status(404).json({ message: "User not found" });
        }

        console.log("✅ Auth successful for user:", user.fullName);
        req.user = user;

        next();
    } catch (error) {
        console.error("❌ Error in protectRoute middleware:", error.message);
        res.status(500).json({ message: "Internal server error" });
    }
};

// オプショナルな認証（ログインしていなくてもOK）
export const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies.jwt;
        console.log("🔐 Optional auth middleware - Token present:", !!token);

        if (!token) {
            console.log("ℹ️ No token provided, proceeding as guest");
            req.user = null;
            return next();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("🔐 Token decoded successfully, userId:", decoded.userId);

        if (!decoded) {
            console.log("ℹ️ Invalid token, proceeding as guest");
            req.user = null;
            return next();
        }

        const user = await User.findById(decoded.userId).select("-password");

        if (!user) {
            console.log("ℹ️ User not found, proceeding as guest");
            req.user = null;
            return next();
        }

        console.log("✅ Optional auth successful for user:", user.fullName);
        req.user = user;

        next();
    } catch (error) {
        console.error("ℹ️ Error in optional auth, proceeding as guest:", error.message);
        req.user = null;
        next();
    }
};