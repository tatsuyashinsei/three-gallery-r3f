// src/pages/NotionArticles/utils/filterArticles.js

/**
 * 公開状態やタグ、ジャンルに基づいて記事をフィルタリングする関数
 *
 * @param {Array} articles - 全記事データ
 * @param {Object} filters - フィルター条件
 *   - genre: string|null
 *   - tag: string|null
 *   - showPrivate: boolean
 */
const filterArticles = (articles, filters = {}) => {
  const { genre = null, tag = null, showPrivate = false } = filters;

  return articles.filter((article) => {
    if (!showPrivate && article.isPrivate) return false;

    if (genre && article.genre !== genre) return false;

    if (tag && !article.tags.some((t) => t.name === tag)) return false;

    return true;
  });
};

export default filterArticles;
