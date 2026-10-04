import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const googleAuth = async (req, res) => {
    try {
        console.log("========== GOOGLE AUTH ==========");
        console.log("REQ BODY:", req.body);
        console.log("CONTENT TYPE:", req.headers["content-type"]);

        const { name, email, avatar } = req.body || {};

        console.log("NAME:", name);
        console.log("EMAIL:", email);
        console.log("AVATAR:", avatar);

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "EMAIL_MISSING",
                receivedBody: req.body,
            });
        }

        if (!process.env.SECRET_KEY) {
            return res.status(500).json({
                success: false,
                message: "SECRET_KEY_MISSING",
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
            { id: user._id },
            process.env.SECRET_KEY,
            { expiresIn: "7d" }
        );

        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "none",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            user,
        });

    } catch (error) {
        console.error("GOOGLE AUTH ERROR:", error);

        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};
