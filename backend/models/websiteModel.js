import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    role: {
        type: String,
        enum: ["user", "ai"],
        required: true
    },
    content: {
        type: String,
        required: true
    }
}, { timestamps: true })

const websiteSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    title: {
        type: String,
        default: "Untitled Website"
    },
    latestCode: {
        type: String,
        requried: true
    },
    conversation: [messageSchema],
    deployed: { type: Boolean, default: false },
    deployUrl: { type: String },
    slug:{type:String, unique:true, sparse:true}
}, { timestamps: true })

export const Website = mongoose.model("Website", websiteSchema)