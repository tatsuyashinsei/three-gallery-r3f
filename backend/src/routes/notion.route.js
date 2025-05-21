// src/routes/notion.route.js

import dotenv from "dotenv";
dotenv.config();
console.log('✅ NOTION_SECRET 読み取り確認:', process.env.NOTION_SECRET) // ← ここ // :::

import express from "express";
import { Client } from "@notionhq/client";

import { getAllPosts, getPostById } from "../controllers/notion.controller.js"; // :::

const router = express.Router();

// Notion クライアント初期化
const notion = new Client({
  auth: process.env.NOTION_SECRET,
  notionVersion: "2022-06-28",
});

console.log("🔍 Notion クライアントの auth:", !!notion.auth);

// ✅ 単一ページ取得エンドポイント
router.get("/page", async (req, res) => {
  try {
    const response = await notion.pages.retrieve({
      page_id: process.env.NOTION_PAGE_ID,
    });
    res.json(response);
  } catch (err) {
    console.error("❌ Notion API Error (/page):", err.body || err);
    res.status(500).json({
      error: "Notion API error",
      message: err?.body?.message || err.message,
      code: err?.body?.code || "unknown_error",
    });
  }
});

// ✅ データベース一覧取得エンドポイント（記事一覧）
router.get("/posts", async (req, res) => {
  try {
    const response = await notion.databases.query({
      database_id: process.env.NOTION_DATABASE_ID,
    });
    res.json(response);
  } catch (err) {
    console.error("❌ Notion API Error (/posts):", err.body || err);
    res.status(500).json({
      error: "Notion DB error",
      message: err?.body?.message || err.message,
      code: err?.body?.code || "unknown_error",
    });
  }
});

router.get('/post/:id', getPostById)  // ← 追加 // :::

export default router;




// import dotenv from "dotenv"
// dotenv.config() // ← ここを追加！

// import express from "express";
// import { Client } from "@notionhq/client";

// const router = express.Router();

// // Postmanと同じ構成でバージョン指定
// const notion = new Client({
//     auth: process.env.NOTION_SECRET, // ←環境変数
//   //------------------------------------
// //   auth: "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", // ←直接
//   //------------------------------------
//   notionVersion: "2022-06-28",
// });

// console.log("🔍 Notion クライアントの auth:", notion.auth);


// router.get("/page", async (req, res) => {
//   try {
//     const response = await notion.pages.retrieve({
//       page_id: process.env.NOTION_PAGE_ID,
//     });

//     res.json(response);
//   } catch (err) {
//     console.error("❌ Notion API Error:", err.body || err);
//     res.status(500).json({
//       error: "Notion API error",
//       message: err?.body?.message || err.message,
//       code: err?.body?.code || "unknown_error",
//     });
//   }
// });

// export default router;

