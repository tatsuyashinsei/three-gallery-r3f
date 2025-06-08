import Thread from "../models/thread.model.js";
import Post from "../models/post.model.js";

// スレッド一覧を取得
export const getThreads = async (req, res) => {
    try {
        const threads = await Thread.find()
            .populate("author", "fullName profilePic")
            .sort({ lastActivity: -1 })
            .limit(50); // 最新50スレッドまで

        res.status(200).json(threads);
    } catch (error) {
        console.error("Error in getThreads: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 特定のスレッドを取得
export const getThread = async (req, res) => {
    try {
        const { id } = req.params;
        const thread = await Thread.findById(id)
            .populate("author", "fullName profilePic");

        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        res.status(200).json(thread);
    } catch (error) {
        console.error("Error in getThread: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// スレッド内の投稿を取得
export const getPosts = async (req, res) => {
    try {
        const { id } = req.params;
        const posts = await Post.find({ thread: id })
            .populate("author", "fullName profilePic")
            .sort({ createdAt: 1 }); // 古い順

        res.status(200).json(posts);
    } catch (error) {
        console.error("Error in getPosts: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 新しいスレッドを作成
export const createThread = async (req, res) => {
    try {
        const { title, content } = req.body;
        const authorId = req.user?._id; // オプショナル

        if (!title || !content) {
            return res.status(400).json({ error: "Title and content are required" });
        }

        if (title.length > 100) {
            return res.status(400).json({ error: "Title must be 100 characters or less" });
        }

        if (content.length > 1000) {
            return res.status(400).json({ error: "Content must be 1000 characters or less" });
        }

        const newThread = new Thread({
            title,
            content,
            author: authorId || null, // 非ログインユーザーの場合はnull
            lastActivity: new Date(),
        });

        await newThread.save();
        
        // authorIdがある場合のみpopulate
        if (authorId) {
            await newThread.populate("author", "fullName profilePic");
        }

        // 残り投稿回数を追加で返す（非ログインユーザーの場合）
        const response = { ...newThread.toObject() };
        if (!req.user && req.postLimitInfo) {
            response.remainingPosts = req.postLimitInfo.remainingPosts;
        }

        res.status(201).json(response);
    } catch (error) {
        console.error("Error in createThread: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// スレッドに投稿
export const createPost = async (req, res) => {
    try {
        const { id: threadId } = req.params;
        const { content } = req.body;
        const authorId = req.user?._id; // オプショナル

        if (!content) {
            return res.status(400).json({ error: "Content is required" });
        }

        if (content.length > 1000) {
            return res.status(400).json({ error: "Content must be 1000 characters or less" });
        }

        // スレッドが存在するか確認
        const thread = await Thread.findById(threadId);
        if (!thread) {
            return res.status(404).json({ error: "Thread not found" });
        }

        const newPost = new Post({
            content,
            author: authorId || null, // 非ログインユーザーの場合はnull
            thread: threadId,
        });

        await newPost.save();
        
        // authorIdがある場合のみpopulate
        if (authorId) {
            await newPost.populate("author", "fullName profilePic");
        }

        // スレッドの投稿数とlastActivityを更新
        await Thread.findByIdAndUpdate(threadId, {
            $inc: { postCount: 1 },
            lastActivity: new Date(),
        });

        // 残り投稿回数を追加で返す（非ログインユーザーの場合）
        const response = { ...newPost.toObject() };
        if (!req.user && req.postLimitInfo) {
            response.remainingPosts = req.postLimitInfo.remainingPosts;
        }

        res.status(201).json(response);
    } catch (error) {
        console.error("Error in createPost: ", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}; 