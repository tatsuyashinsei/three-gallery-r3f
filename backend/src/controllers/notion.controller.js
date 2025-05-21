// src/controllers/notion.controller.js

import {
  fetchAllPosts,
  fetchPostById,
  fetchPostContentBlocks,
} from "../services/notion.service.js";

export const getAllPosts = async (req, res) => {
  try {
    const posts = await fetchAllPosts();
    res.json(posts);
  } catch (err) {
    console.error("❌ Error in getAllPosts:", err);
    res
      .status(500)
      .json({ error: "Server Error", message: err.message || "Unknown error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const pageId = req.params.id;
    const metadata = await fetchPostById(pageId);
    const contentBlocks = await fetchPostContentBlocks(pageId);

    res.json({
      ...metadata,
      content: contentBlocks,
    });
  } catch (err) {
    console.error("❌ Error in getPostById:", err);
    res
      .status(500)
      .json({ error: "Server Error", message: err.message || "Unknown error" });
  }
};
