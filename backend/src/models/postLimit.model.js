import mongoose from "mongoose";

const postLimitSchema = new mongoose.Schema(
    {
        // IPアドレスとブラウザフィンガープリントの組み合わせで端末識別
        clientId: {
            type: String,
            required: true,
            unique: true,
        },
        ipAddress: {
            type: String,
            required: true,
        },
        fingerprint: {
            type: String,
            required: true,
        },
        // 今日の投稿数
        todayPostCount: {
            type: Number,
            default: 0,
        },
        // 最後の投稿日（日付が変わったらリセット用）
        lastPostDate: {
            type: String, // YYYY-MM-DD形式
            required: true,
        },
        // 制限に達した回数（悪質ユーザー検知用）
        limitReachedCount: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

// 複合インデックス
postLimitSchema.index({ ipAddress: 1, fingerprint: 1 });

const PostLimit = mongoose.model("PostLimit", postLimitSchema);

export default PostLimit; 