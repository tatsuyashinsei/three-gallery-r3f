// src/services/notion.service.js
import dotenv from "dotenv";
dotenv.config();
import { Client } from "@notionhq/client";

const notion = new Client({
  auth: process.env.NOTION_SECRET,
  notionVersion: "2022-06-28",
});

/**
 * 📘 記事一覧の取得（タイトル・タグなど）
 */
export const fetchAllPosts = async () => {
  const databaseId = process.env.NOTION_DATABASE_ID;

  const response = await notion.databases.query({
    database_id: databaseId,
    sorts: [
      {
        property: "作成日時",
        direction: "descending",
      },
    ],
  });

  return response.results.map((page) => {
    const titleProp = page.properties["名前"];
    const title = titleProp?.title?.[0]?.plain_text || "無題";

    return {
      id: page.id,
      title,
      tags: page.properties["マルチセレクト"]?.multi_select || [],
      genre: page.properties["セレクト"]?.select?.name || null,
      date: page.properties["作成日時"]?.created_time || page.created_time,
      count: page.properties["カウント"]?.number || 0,
    };
  });
};

/**
 * 📘 特定ページの本文ブロック一覧
 */
export const fetchPostContentBlocks = async (pageId) => {
  const response = await notion.blocks.children.list({
    block_id: pageId,
    page_size: 100,
  });

  return response.results;
};

/**
 * 📘 特定ページのメタデータ取得（タイトル、タグなど）
 */
export const fetchPostById = async (pageId) => {
  const response = await notion.pages.retrieve({ page_id: pageId });

  const titleProp = response.properties["名前"];
  const title = titleProp?.title?.[0]?.plain_text || "無題";

  return {
    id: response.id,
    title,
    tags: response.properties["マルチセレクト"]?.multi_select || [],
    genre: response.properties["セレクト"]?.select?.name || null,
    date:
      response.properties["作成日時"]?.created_time || response.created_time,
    count: response.properties["カウント"]?.number || 0,
  };
};
