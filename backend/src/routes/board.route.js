import express from "express";
import { protectRoute, optionalAuth } from "../middleware/auth.middleware.js";
import { checkPostLimit, incrementPostCount } from "../middleware/postLimit.middleware.js";
import { 
    getThreads, 
    getThread, 
    getPosts, 
    createThread, 
    createPost 
} from "../controllers/board.controller.js";

const router = express.Router();

// スレッド関連（読み取りは非ログインでもOK）
router.get("/threads", optionalAuth, getThreads);
router.get("/threads/:id", optionalAuth, getThread);
router.post("/threads", optionalAuth, checkPostLimit, createThread, incrementPostCount);

// 投稿関連（読み取りは非ログインでもOK）
router.get("/threads/:id/posts", optionalAuth, getPosts);
router.post("/threads/:id/posts", optionalAuth, checkPostLimit, createPost, incrementPostCount);

export default router; 