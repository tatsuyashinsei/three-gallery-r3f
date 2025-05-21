// src/lib/api.js

import { axiosInstance } from "./axios";

export const fetchArticles = async () => {
  try {
    const fullURL = axiosInstance.defaults.baseURL + "/notion/posts";
    console.log("🔍 呼び出しURL:", fullURL);

    const res = await axiosInstance.get("/notion/posts");
    console.log("📦 fetchArticles 成功:", res.data);
    return res.data;
  } catch (err) {
    console.error("❌ fetchArticles に失敗しました:", err);
    return [];
  }
};


