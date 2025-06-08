import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios.js";

export const useBoardStore = create((set, get) => ({
  threads: [],
  currentThread: null,
  posts: [],
  isLoading: false,

  // スレッド一覧を取得
  getThreads: async () => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get("/board/threads");
      set({ threads: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "スレッド一覧の取得に失敗しました");
    } finally {
      set({ isLoading: false });
    }
  },

  // 特定のスレッドを取得
  getThread: async (threadId) => {
    set({ isLoading: true });
    try {
      const res = await axiosInstance.get(`/board/threads/${threadId}`);
      set({ currentThread: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "スレッドの取得に失敗しました");
    } finally {
      set({ isLoading: false });
    }
  },

  // スレッド内の投稿を取得
  getPosts: async (threadId) => {
    try {
      const res = await axiosInstance.get(`/board/threads/${threadId}/posts`);
      set({ posts: res.data });
    } catch (error) {
      toast.error(error?.response?.data?.message || "投稿の取得に失敗しました");
    }
  },

  // 新しいスレッドを作成
  createThread: async (threadData) => {
    try {
      const res = await axiosInstance.post("/board/threads", threadData);
      const { threads } = get();
      set({ threads: [res.data, ...threads] });
      
      // 投稿制限の情報を表示
      if (res.data.remainingPosts !== undefined) {
        toast.success(`スレッドを作成しました（残り${res.data.remainingPosts}回投稿可能）`);
      } else {
        toast.success("スレッドを作成しました");
      }
      
      return res.data;
    } catch (error) {
      if (error?.response?.status === 429) {
        // 投稿制限エラーの場合
        const errorData = error.response.data;
        toast.error(errorData.message);
        throw { ...error, requireLogin: errorData.requireLogin };
      } else {
        toast.error(error?.response?.data?.message || "スレッドの作成に失敗しました");
        throw error;
      }
    }
  },

  // スレッドに投稿する
  createPost: async (threadId, postData) => {
    try {
      const res = await axiosInstance.post(`/board/threads/${threadId}/posts`, postData);
      const { posts } = get();
      set({ posts: [...posts, res.data] });
      
      // 投稿制限の情報を表示
      if (res.data.remainingPosts !== undefined) {
        toast.success(`投稿しました（残り${res.data.remainingPosts}回投稿可能）`);
      } else {
        toast.success("投稿しました");
      }
      
      return res.data;
    } catch (error) {
      if (error?.response?.status === 429) {
        // 投稿制限エラーの場合
        const errorData = error.response.data;
        toast.error(errorData.message);
        throw { ...error, requireLogin: errorData.requireLogin };
      } else {
        toast.error(error?.response?.data?.message || "投稿に失敗しました");
        throw error;
      }
    }
  },

  // ストアをリセット
  resetBoard: () => {
    set({
      threads: [],
      currentThread: null,
      posts: [],
      isLoading: false,
    });
  },
})); 