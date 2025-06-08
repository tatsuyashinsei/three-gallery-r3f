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

import path from "path";

import { connectDB } from "./lib/db.js";

import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import boardRoutes from "./routes/board.route.js";
import { app, server } from "./lib/socket.js";

//------------------------------------
// import notionPostsRouter from "./api/notion/posts.js";
// app.use("/api/notion/posts", notionPostsRouter); // 重複につきコメントアウト
// // ------------------------------------

dotenv.config();

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
const __dirname = path.resolve();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());

// CORS設定の前にデバッグミドルウェアを追加
app.use((req, res, next) => {
    console.log(`🌐 Request: ${req.method} ${req.url}`);
    console.log(`🌐 Origin: ${req.headers.origin}`);
    console.log(`🌐 Headers:`, req.headers);
    next();
});

app.use(
    cors({
        origin: function(origin, callback) {
            console.log(`🔍 CORS Check - Origin: ${origin}`);
            
            // Allow requests with no origin (like mobile apps or curl requests)
            if(!origin) {
                console.log("✅ No origin - allowing request");
                return callback(null, true);
            }
            
            const allowedOrigins = [
                "http://localhost:5173",
                "http://localhost:5174",
                "http://localhost:5175",
                "http://localhost:5001",
                "http://127.0.0.1:5173",
                "http://127.0.0.1:5174",
                "http://127.0.0.1:5175",
                "http://127.0.0.1:5001",
                "http://192.168.3.10:5173",
                "http://192.168.3.10:5174",
                "http://192.168.3.10:5175",
                "http://192.168.3.10:5001"
            ];
            
            if(allowedOrigins.indexOf(origin) !== -1){
                console.log(`✅ Origin allowed: ${origin}`);
                return callback(null, true);
            } else {
                console.log(`❌ Origin rejected: ${origin}`);
                console.log(`❌ Allowed origins:`, allowedOrigins);
                return callback(new Error('Not allowed by CORS'), false);
            }
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
        allowedHeaders: [
            'Content-Type', 
            'Authorization', 
            'X-Requested-With',
            'Accept',
            'Origin',
            'x-client-fingerprint'
        ],
        exposedHeaders: ['Set-Cookie'],
        optionsSuccessStatus: 200
    })
);

// プリフライトリクエストの明示的な処理
app.options('*', (req, res) => {
    console.log(`🚀 Preflight request for: ${req.url}`);
    res.status(200).end();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/board", boardRoutes);
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
