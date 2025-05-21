import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { fetchArticles } from "../../lib/api";
import formatArticle from "./utils/formatArticle";
import filterArticles from "./utils/filterArticles";
import FilterBar from "./FilterBar";

const ITEMS_PER_PAGE = 12;

const ArticlesPage = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [genreFilter, setGenreFilter] = useState("");
  const [tagFilter, setTagFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchArticles()
      .then((data) => {
        const visibleArticles = data.results.map(formatArticle);
        setArticles(visibleArticles);
        setError(null);
      })
      .catch((err) => {
        console.error("❌ APIエラー:", err);
        setError(err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const filteredArticles = filterArticles(articles, {
    genre: genreFilter,
    tag: tagFilter,
    showPrivate: false,
  });

  const totalPages = Math.ceil(filteredArticles.length / ITEMS_PER_PAGE);
  const paginatedArticles = filteredArticles.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const genreList = [...new Set(articles.map((a) => a.genre).filter(Boolean))];
  const tagList = [...new Set(articles.flatMap((a) => a.tags).filter(Boolean))];

  const handlePageChange = (page) => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    setCurrentPage(page);
  };

  if (loading) {
    console.log("📱 ローディング中：スマホでも来てる？");
    return (
      <div className="flex items-center justify-center h-screen bg-black text-white">
        <div className="flex flex-col items-center gap-4">
          <span className="loading loading-spinner loading-lg"></span>
          <p className="text-xl">📱 読み込み中... スマホもOK？</p>
        </div>
      </div>
    );
  }


  if (error)
    return (
      <p className="text-center text-red-500">
        記事の取得に失敗しました。時間を置いて再試行してください。
      </p>
    );

  return (
    <div className="min-h-screen px-4 py-8 bg-gray-100 dark:bg-gray-950">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
          記事一覧
        </h1>

        <FilterBar
          genres={genreList}
          tags={tagList}
          onGenreChange={(val) => {
            setGenreFilter(val);
            setCurrentPage(1); // フィルタ変更時に1ページ目へ
          }}
          onTagChange={(val) => {
            setTagFilter(val);
            setCurrentPage(1);
          }}
          selectedGenre={genreFilter}
          selectedTag={tagFilter}
        />

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-4">
          {paginatedArticles.map((article) => (
            <ArticleCard key={article.id} article={article} />
          ))}
        </div>

        {/* ページネーション */}
        {totalPages >= 1 && (
          <div className="mt-8 flex justify-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                className={`btn btn-sm px-4 ${
                  currentPage === i + 1
                    ? "bg-primary text-white hover:bg-primary-focus"
                    : "bg-base-200 text-gray-800 hover:bg-base-300"
                }`}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ArticlesPage;
