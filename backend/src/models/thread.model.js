import mongoose from "mongoose";

const threadSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            maxlength: 100,
        },
        content: {
            type: String,
            required: true,
            maxlength: 1000,
        },
        author: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: false,
            default: null,
        },
        postCount: {
            type: Number,
            default: 0,
        },
        lastActivity: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const Thread = mongoose.model("Thread", threadSchema);

export default Thread; 