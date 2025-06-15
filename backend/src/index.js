// src/index.js

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import fs from 'fs';
import path from "path";
import cookieParser from "cookie-parser";
import cors from "cors";

import notionRoutes from "./routes/notion.route.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import boardRoutes from "./routes/board.route.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";

// デバッグログ（開発環境のみ）
if (process.env.NODE_ENV !== "production") {
  console.log("✅ NOTION_SECRET length:", process.env.NOTION_SECRET?.length);
  console.log("✅ NOTION_PAGE_ID:", process.env.NOTION_PAGE_ID);
}

const PORT = process.env.PORT ?? 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(cookieParser());

// CORS設定
app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      process.env.FRONTEND_URL  // 本番RenderのURLは必ずここで設定
    ].filter(Boolean);

    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.log(`❌ CORS blocked: ${origin}`);
      return callback(new Error("Not allowed by CORS"), false);
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
}));

// プリフライト対応
app.options('*', (req, res) => res.sendStatus(200));

// 静的ファイルの配信 (本番のみ)
if (process.env.NODE_ENV === "production") {
  const staticPath = path.join(process.cwd(), "frontend/dist");
  if (fs.existsSync(staticPath)) {
    app.use(express.static(staticPath));
    console.log("✅ Serving static files from:", staticPath);

    app.get("*", (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ message: 'API endpoint not found' });
      }
      res.sendFile(path.join(staticPath, "index.html"));
    });
  } else {
    console.log("❌ Static path not found:", staticPath);
  }
}

// 各種APIルート
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/board", boardRoutes);
app.use("/api/notion", notionRoutes);

// サーバ起動
server.listen(PORT, () => {
  console.log("server is running on PORT " + PORT);
  connectDB().then(() => console.log("Database is connected"));
});
