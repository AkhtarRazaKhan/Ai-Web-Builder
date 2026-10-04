import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI;

        if (!mongoURI) {
            throw new Error(
                "MONGO_URI environment variable is missing"
            );
        }

        console.log("Connecting to MongoDB...");

        await mongoose.connect(mongoURI, {
            serverSelectionTimeoutMS: 10000,
        });

        console.log("MongoDB connected successfully");

    } catch (error) {
        console.error(
            "MongoDB connection error:",
            error.message
        );

        throw error;
    }
};

export default connectDB;
