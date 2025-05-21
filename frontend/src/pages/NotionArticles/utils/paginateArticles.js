// src/pages/NotionArticles/utils/paginateArticles.js

const paginateArticles = (articles, currentPage = 1, articlesPerPage = 6) => {
  const startIndex = (currentPage - 1) * articlesPerPage;
  const endIndex = startIndex + articlesPerPage;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  const totalPages = Math.ceil(articles.length / articlesPerPage);

  return {
    currentPage,
    totalPages,
    articlesPerPage,
    totalArticles: articles.length,
    paginatedArticles,
  };
};

export default paginateArticles;
