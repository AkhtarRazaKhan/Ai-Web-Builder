import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const googleAuth = async (req, res) => {
    try {
        console.log("========== GOOGLE AUTH ==========");

        console.log(
            "BODY RECEIVED:",
            req.body
        );

        const {
            name,
            email,
            avatar,
        } = req.body;

        // Validate email
        if (!email) {
            console.log(
                "❌ Email missing from request"
            );

            return res.status(400).json({
                success: false,
                message:
                    "Google email is required.",
            });
        }

        // Check SECRET_KEY
        if (!process.env.SECRET_KEY) {
            console.error(
                "❌ SECRET_KEY is missing"
            );

            return res.status(500).json({
                success: false,
                message:
                    "SECRET_KEY is not configured on server.",
            });
        }

        console.log(
            "Searching user:",
            email
        );

        let user = await User.findOne({
            email,
        });

        if (!user) {
            console.log(
                "User not found. Creating..."
            );

            user = await User.create({
                name:
                    name || "Google User",

                email,

                avatar:
                    avatar || "",
            });

            console.log(
                "User created:",
                user._id
            );
        } else {
            console.log(
                "Existing user:",
                user._id
            );
        }

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        console.log(
            "JWT generated successfully"
        );

        // Set cookie
        res.cookie(
            "token",
            token,
            {
                httpOnly: true,
                secure: true,
                sameSite: "none",
                maxAge:
                    7 *
                    24 *
                    60 *
                    60 *
                    1000,
            }
        );

        console.log(
            "Cookie set successfully"
        );

        return res.status(200).json(user);

    } catch (error) {
        console.error(
            "🔥 GOOGLE AUTH ERROR:",
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
