// src/index.js

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
//------------------------------------
import notionRoutes from "./routes/notion.route.js";
//------------------------------------

import express from "express";
//------------------------------------
console.log(
  "[NOTION_SECRET (bytes)]",
  [...process.env.NOTION_SECRET].map((c) => c.charCodeAt(0))
);

//------------------------------------
import cookieParser from "cookie-parser";
import cors from "cors";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import { app, server } from "./lib/socket.js";

//------------------------------------
// import notionPostsRouter from "./api/notion/posts.js";
// app.use("/api/notion/posts", notionPostsRouter); // 重複につきコメントアウト
// // ------------------------------------

// dotenv.config();

//------------------------------------
console.log("✅ NOTION_SECRET length:", process.env.NOTION_SECRET?.length);
console.log(
  "✅ NOTION_SECRET value:",
  JSON.stringify(process.env.NOTION_SECRET)
);


console.log(
  "✅ NOTION_SECRET:",
  process.env.NOTION_SECRET?.slice(0, 12) + "..."
);
console.log("✅ NOTION_PAGE_ID:", process.env.NOTION_PAGE_ID);
//------------------------------------

const PORT = process.env.PORT;

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true,
    })
)

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
//------------------------------------
app.use("/api/notion", notionRoutes);
//------------------------------------

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}
    
server.listen(PORT, () => {
    console.log("server is running on PORT" + PORT);
    connectDB().then(() => console.log("Database is connected"));
});

console.log("環境変数 PORT:", process.env.PORT);
console.log("環境変数 MONGODB_URI:", process.env.MONGODB_URI);
console.log("✅ CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME);
console.log("✅ CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY);
console.log("✅ CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET?.slice(0, 8) + "...");
