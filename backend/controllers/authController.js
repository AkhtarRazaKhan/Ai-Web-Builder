import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const googleAuth = async (req, res) => {
    try {
        const { name, email, avatar } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Google email is required",
            });
        }

        let user = await User.findOne({ email });

        if (!user) {
            user = await User.create({
                name: name || "Google User",
                email,
                avatar: avatar || "",
            });
        }

        const token = jwt.sign(
            {
                id: user._id,
            },
            process.env.SECRET_KEY,
            {
                expiresIn: "7d",
            }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json(user);

    } catch (error) {
        console.error("Google Auth Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

export const logoutUser = async (_, res) => {
    try {
        res.clearCookie("token", {
            httpOnly: true,
            secure: true,
            sameSite: "none",
        });

        return res.status(200).json({
            success: true,
            message: "User Logout Successfully",
        });

    } catch (error) {
        console.error("Logout Error:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
