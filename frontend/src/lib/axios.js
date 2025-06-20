// src/lib/axios.js

import axios from "axios";
import { generateFingerprint } from "./fingerprint.js";

export const axiosInstance = axios.create({
  baseURL: import.meta.env.MODE === "development" ? "http://localhost:5001/api" : "/api",
  withCredentials: true,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// リクエストインターセプター：フィンガープリントとAuthorizationヘッダーを追加
axiosInstance.interceptors.request.use(
  (config) => {
    // 開発環境でのみデバッグログを表示
    if (import.meta.env.MODE === "development") {
      console.log(`🚀 Making request to: ${config.baseURL}${config.url}`);
      console.log(`🚀 Request method: ${config.method}`);
      console.log(`🚀 Request headers:`, config.headers);
    }
    
    const fingerprint = generateFingerprint();
    config.headers['x-client-fingerprint'] = fingerprint;
    
    // localStorageからトークンを取得してAuthorizationヘッダーに追加
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      if (import.meta.env.MODE === "development") {
        console.log(`🔑 Token added to request`);
      }
    }
    
    return config;
  },
  (error) => {
    if (import.meta.env.MODE === "development") {
      console.error('❌ Request interceptor error:', error);
    }
    return Promise.reject(error);
  }
);

// レスポンスインターセプター：エラーハンドリングを改善
axiosInstance.interceptors.response.use(
  (response) => {
    if (import.meta.env.MODE === "development") {
      console.log(`✅ Response received:`, response.status, response.statusText);
    }
    return response;
  },
  (error) => {
    if (import.meta.env.MODE === "development") {
      console.error('❌ Response error:', error);
      if (error.response) {
        console.error('❌ Error response data:', error.response.data);
        console.error('❌ Error response status:', error.response.status);
        console.error('❌ Error response headers:', error.response.headers);
      } else if (error.request) {
        console.error('❌ No response received:', error.request);
      } else {
        console.error('❌ Error setting up request:', error.message);
      }
    }
    return Promise.reject(error);
  }
);
