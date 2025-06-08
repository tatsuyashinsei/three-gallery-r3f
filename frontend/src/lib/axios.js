// src/lib/axios.js

import axios from "axios";
import { generateFingerprint } from "./fingerprint.js";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5001/api",
  withCredentials: true,
});

// リクエストインターセプター：フィンガープリントをヘッダーに追加
axiosInstance.interceptors.request.use((config) => {
  const fingerprint = generateFingerprint();
  config.headers['x-client-fingerprint'] = fingerprint;
  return config;
});
