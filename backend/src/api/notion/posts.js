// // src/api/notion/posts.js
// //------------------------------------++++
// import dotenv from "dotenv";
// dotenv.config();
// //------------------------------------++++

// import express from "express";
// import { Client } from "@notionhq/client";

// const router = express.Router();

// // Notion クライアント初期化
// const notion = new Client({ auth: process.env.NOTION_API_KEY });

// // 対象のデータベースID（.env に保存しておく）
// const databaseId = process.env.NOTION_DATABASE_ID;

// // 記事一覧取得エンドポイント
// router.get("/", async (req, res) => {
//   try {
//     const response = await notion.databases.query({
//       database_id: databaseId,
//       filter: {
//         or: [
//           {
//             property: "非公開",
//             checkbox: {
//               equals: false,
//             },
//           },
//           {
//             property: "非公開",
//             checkbox: {
//               is_empty: true, // チェックボックス未設定の場合も含める
//             },
//           },
//         ],
//       },
//       sorts: [
//         {
//           property: "最終更新日時",
//           direction: "descending",
//         },
//       ],
//     });

//     const articles = response.results.map((page) => {
//       const props = page.properties;

//       return {
//         id: page.id,
//         title: props["題名"]?.title?.[0]?.plain_text || "無題",
//         genre: props["ジャンル"]?.select?.name || "",
//         tags: props["タグ"]?.multi_select?.map((tag) => tag.name) || [],
//         date: props["作成日時"]?.date?.start || null,
//         updatedAt: props["最終更新日時"]?.last_edited_time || null,
//         count: props["カウント"]?.number || 0,
//         imageUrl: props["UI画像"]?.files?.[0]?.file?.url || null,
//         isPrivate: props["非公開"]?.checkbox || false,
//       };
//     });

//     res.status(200).json(articles);
//   } catch (error) {
//     console.error("❌ Notion API error:", error.message);
//     res.status(500).json({ error: "サーバーエラー" });
//   }
// });

// export default router;
