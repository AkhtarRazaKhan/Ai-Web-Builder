import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";

import authRoute from "./routes/authRoute.js";
import websiteRoute from "./routes/websiteRoute.js";
import paymentRoute from "./routes/paymentRoute.js";

import cookieParser from "cookie-parser";
import cors from "cors";

const app = express();

const PORT = process.env.PORT || 3000;

// CORS
app.use(
    cors({
        origin:
            "https://ai-web-builder-1-gwfj.onrender.com",
        credentials: true,
    })
);

// Middleware
app.use(express.json());

app.use(
    express.urlencoded({
        extended: true,
    })
);

app.use(cookieParser());

// Test
app.get("/", (req, res) => {
    res.status(200).json({
        success: true,
        message:
            "AI Web Builder API is running",
    });
});

// Routes
app.use(
    "/api/auth",
    authRoute
);

app.use(
    "/api/website",
    websiteRoute
);

app.use(
    "/api/payment",
    paymentRoute
);

// Error handler
app.use(
    (error, req, res, next) => {
        console.error(
            "SERVER ERROR:",
            error
        );

        return res.status(500).json({
            success: false,
            message:
                error.message ||
                "Internal Server Error",
        });
    }
);

// Start server
const startServer = async () => {
    try {
        await connectDB();

        app.listen(
            PORT,
            () => {
                console.log(
                    `Server is listening at port: ${PORT}`
                );
            }
        );

    } catch (error) {
        console.error(
            "Database connection failed:",
            error
        );

        process.exit(1);
    }
};

startServer();
