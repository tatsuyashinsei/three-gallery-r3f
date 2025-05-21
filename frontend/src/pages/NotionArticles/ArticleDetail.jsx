// ArticleDetail.jsx（下記はひな形）
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

import renderNotionBlocks from "./utils/renderNotionBlocks.jsx"; // 追加

const ArticleDetail = () => {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axiosInstance
      .get(`/notion/post/${id}`)
      .then((res) => {
        setArticle(res.data);
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>読み込み中...</p>;
  if (!article) return <p>記事が見つかりません</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">{article.title}</h1>

      {/* 🔽 JSONでの確認表示（開発用） */}
      {/* <pre className="bg-gray-100 p-4 rounded text-sm whitespace-pre-wrap">
        {JSON.stringify(article.content, null, 2)}
      </pre> */}

      {/* 🔽 本文ブロックのレンダリング */}
      <div className="prose dark:prose-invert">
        {renderNotionBlocks(article.content)}
      </div>
    </div>
  );
};

export default ArticleDetail;
