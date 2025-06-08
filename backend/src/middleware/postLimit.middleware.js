import PostLimit from '../models/postLimit.model.js';

const DAILY_POST_LIMIT = 5;

// IPアドレスを取得するヘルパー関数
const getClientIP = (req) => {
    return req.headers['x-forwarded-for'] || 
           req.headers['x-real-ip'] || 
           req.connection.remoteAddress || 
           req.socket.remoteAddress ||
           (req.connection.socket ? req.connection.socket.remoteAddress : null) ||
           '127.0.0.1';
};

// 今日の日付を取得（YYYY-MM-DD形式）
const getTodayDate = () => {
    return new Date().toISOString().split('T')[0];
};

// クライアントIDを生成（IPアドレス + フィンガープリント）
const generateClientId = (ip, fingerprint) => {
    return `${ip}_${fingerprint}`;
};

export const checkPostLimit = async (req, res, next) => {
    try {
        // ログインユーザーは制限なし
        if (req.user) {
            console.log("✅ Logged-in user, no post limit");
            return next();
        }

        // 非ログインユーザーの制限チェック
        const ipAddress = getClientIP(req);
        const fingerprint = req.headers['x-client-fingerprint'] || 'unknown';
        const clientId = generateClientId(ipAddress, fingerprint);
        const today = getTodayDate();

        console.log("🔍 Checking post limit for:", {
            clientId,
            ipAddress,
            fingerprint,
            today
        });

        // 既存の制限レコードを検索
        let postLimit = await PostLimit.findOne({ clientId });

        if (!postLimit) {
            // 新しいクライアント
            postLimit = new PostLimit({
                clientId,
                ipAddress,
                fingerprint,
                todayPostCount: 0,
                lastPostDate: today,
            });
        } else {
            // 日付が変わった場合はカウントをリセット
            if (postLimit.lastPostDate !== today) {
                postLimit.todayPostCount = 0;
                postLimit.lastPostDate = today;
            }
        }

        // 制限チェック
        if (postLimit.todayPostCount >= DAILY_POST_LIMIT) {
            postLimit.limitReachedCount += 1;
            await postLimit.save();
            
            console.log("❌ Post limit reached for client:", clientId);
            return res.status(429).json({
                error: "投稿制限に達しました",
                message: `1日の投稿制限（${DAILY_POST_LIMIT}回）に達しました。アカウント登録すると無制限で投稿できます。`,
                remainingPosts: 0,
                resetTime: "明日0時にリセットされます",
                requireLogin: true
            });
        }

        // 制限内の場合、次のミドルウェアに進む前にreqオブジェクトに情報を保存
        req.postLimitInfo = {
            postLimit,
            remainingPosts: DAILY_POST_LIMIT - postLimit.todayPostCount - 1
        };

        console.log("✅ Post limit check passed:", {
            currentCount: postLimit.todayPostCount,
            remaining: req.postLimitInfo.remainingPosts
        });

        next();
    } catch (error) {
        console.error("❌ Error in checkPostLimit middleware:", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};

// 投稿後にカウントを更新する関数
export const incrementPostCount = async (req, res, next) => {
    try {
        // ログインユーザーは何もしない
        if (req.user || !req.postLimitInfo) {
            return next();
        }

        const { postLimit } = req.postLimitInfo;
        postLimit.todayPostCount += 1;
        await postLimit.save();

        console.log("📈 Post count incremented:", {
            clientId: postLimit.clientId,
            newCount: postLimit.todayPostCount
        });

        next();
    } catch (error) {
        console.error("❌ Error in incrementPostCount:", error.message);
        // エラーでも次に進む（投稿自体は成功させる）
        next();
    }
}; 