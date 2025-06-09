// src/index.js

import dotenv from "dotenv";
dotenv.config({ path: "./.env" });
//------------------------------------
import notionRoutes from "./routes/notion.route.js";
//------------------------------------

import express from "express";
import fs from 'fs';
//------------------------------------
// 開発環境でのみデバッグログを表示
if (process.env.NODE_ENV !== "production") {
  console.log(
    "[NOTION_SECRET (bytes)]",
    [...process.env.NOTION_SECRET].map((c) => c.charCodeAt(0))
  );
}

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
// 開発環境でのみデバッグログを表示
if (process.env.NODE_ENV !== "production") {
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
}
//------------------------------------

const PORT = process.env.PORT ?? 5001;
const __dirname = path.resolve();

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.use(cookieParser());

// 開発環境でのみデバッグミドルウェアを追加
if (process.env.NODE_ENV !== "production") {
  app.use((req, res, next) => {
      console.log(`🌐 Request: ${req.method} ${req.url}`);
      console.log(`🌐 Origin: ${req.headers.origin}`);
      console.log(`🌐 Headers:`, req.headers);
      next();
  });
}

app.use(
    cors({
        origin: function(origin, callback) {
            if (process.env.NODE_ENV !== "production") {
              console.log(`🔍 CORS Check - Origin: ${origin}`);
            }
            
            // Allow requests with no origin (like mobile apps or curl requests)
            if(!origin) {
                if (process.env.NODE_ENV !== "production") {
                  console.log("✅ No origin - allowing request");
                }
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
                "http://192.168.3.10:5001",
                // 本番環境のドメインを追加（必要に応じて）
                process.env.FRONTEND_URL
            ].filter(Boolean);
            
            if(allowedOrigins.indexOf(origin) !== -1){
                if (process.env.NODE_ENV !== "production") {
                  console.log(`✅ Origin allowed: ${origin}`);
                }
                return callback(null, true);
            } else {
                if (process.env.NODE_ENV !== "production") {
                  console.log(`❌ Origin rejected: ${origin}`);
                  console.log(`❌ Allowed origins:`, allowedOrigins);
                }
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
    if (process.env.NODE_ENV !== "production") {
      console.log(`🚀 Preflight request for: ${req.url}`);
    }
    res.status(200).end();
});

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/board", boardRoutes);
//------------------------------------
app.use("/api/notion", notionRoutes);
//------------------------------------

// 本番環境での静的ファイル配信（APIルートの後に配置）
if (process.env.NODE_ENV === "production") {
  // 可能性のあるパスを確認
  const possiblePaths = [
    path.join(process.cwd(), "frontend/dist"),
    path.join(__dirname, "../frontend/dist"),
    path.join(__dirname, "../../frontend/dist"),
  ];
  
  console.log("🔍 Checking static paths:");
  const validStaticPath = possiblePaths.find(testPath => {
    const exists = fs.existsSync(testPath);
    console.log(`${testPath} - ${exists ? '✅ EXISTS' : '❌ NOT FOUND'}`);
    return exists;
  });
  
  if (validStaticPath) {
    const indexPath = path.join(validStaticPath, "index.html");
    console.log("✅ Using static path:", validStaticPath);
    
    if (fs.existsSync(indexPath)) {
      console.log("✅ Index.html found!");
      
      // 静的ファイル配信（認証不要）
      app.use(express.static(validStaticPath));
      
      // SPA fallback（認証不要）
      app.get("*", (req, res) => {
        // APIルートは除外
        if (req.path.startsWith('/api/')) {
          return res.status(404).json({ message: 'API endpoint not found' });
        }
        
        console.log(`📄 Serving SPA for: ${req.path}`);
        res.sendFile(indexPath);
      });
    } else {
      console.log("❌ Index.html not found");
    }
  } else {
    console.log("❌ No valid static path found");
  }
}
    
server.listen(PORT, () => {
    console.log("server is running on PORT " + PORT);
    connectDB().then(() => console.log("Database is connected"));
});

// 開発環境でのみ環境変数をログ出力
if (process.env.NODE_ENV !== "production") {
  console.log("環境変数 PORT:", process.env.PORT);
  console.log("環境変数 MONGODB_URI:", process.env.MONGODB_URI ? "設定済み" : "未設定");
  console.log("✅ CLOUDINARY_CLOUD_NAME:", process.env.CLOUDINARY_CLOUD_NAME ? "設定済み" : "未設定");
  console.log("✅ CLOUDINARY_API_KEY:", process.env.CLOUDINARY_API_KEY ? "設定済み" : "未設定");
  console.log("✅ CLOUDINARY_API_SECRET:", process.env.CLOUDINARY_API_SECRET ? "設定済み" : "未設定");
}
