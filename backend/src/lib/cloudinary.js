import { v2 as cloudinary } from 'cloudinary';

import { config } from "dotenv";

config();

// Cloudinary設定の詳細ログ
console.log("🌤️ Cloudinary Configuration:");
console.log("- Cloud Name:", process.env.CLOUDINARY_CLOUD_NAME ? "✅ Set" : "❌ Missing");
console.log("- API Key:", process.env.CLOUDINARY_API_KEY ? "✅ Set" : "❌ Missing");
console.log("- API Secret:", process.env.CLOUDINARY_API_SECRET ? "✅ Set" : "❌ Missing");

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// 設定テスト
try {
    const config_info = cloudinary.config();
    console.log("🌤️ Cloudinary config loaded successfully");
    console.log("- Cloud Name configured:", !!config_info.cloud_name);
    console.log("- API Key configured:", !!config_info.api_key);
} catch (error) {
    console.error("❌ Cloudinary configuration error:", error);
}

export default cloudinary;