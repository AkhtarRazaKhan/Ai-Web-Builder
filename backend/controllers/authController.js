import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const googleAuth = async (req, res) => {
    try {
        console.log("========== GOOGLE AUTH ==========");
        console.log("Request body:", req.body);

        const { name, email, avatar } = req.body || {};

        // Validate email
        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Email is required.",
            });
        }

        // Check JWT secret
        if (!process.env.SECRET_KEY) {
            return res.status(500).json({
                success: false,
                message: "SECRET_KEY is missing.",
            });
        }

        // Find existing user
        let user = await User.findOne({ email });

        // Create user if doesn't exist
        if (!user) {
            user = await User.create({
                name: name || "Google User",
                email,
                avatar: avatar || "",
            });

            console.log(
                "New user created:",
                user._id
            );
        } else {
            // Update profile
            user.name = name || user.name;
            user.avatar = avatar || user.avatar;

            await user.save();

            console.log(
                "Existing user:",
                user._id
            );
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        // Set cookie
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
            path: "/",
        });

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error(
            "GOOGLE AUTH ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Google authentication failed.",
        });
    }
};


// ========================================
// LOGOUT
// ========================================

export const logoutUser = async (req, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            path: "/",
        });

        return res.status(200).json({
            success: true,
            message: "User Logout Successfully",
        });

    } catch (error) {
        console.error(
            "LOGOUT ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Logout failed.",
        });
    }
};
