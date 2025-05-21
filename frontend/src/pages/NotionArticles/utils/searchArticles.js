// src/pages/NotionArticles/utils/searchArticles.js

const searchArticles = (articles, keyword) => {
  if (!keyword) return articles;

  const lowerKeyword = keyword.toLowerCase();

  return articles.filter((article) => {
    const titleMatch = article.title?.toLowerCase().includes(lowerKeyword);
    const genreMatch = article.genre?.toLowerCase().includes(lowerKeyword);
    const tagsMatch = article.tags?.some((tag) =>
      tag.name?.toLowerCase().includes(lowerKeyword)
    );

    return titleMatch || genreMatch || tagsMatch;
  });
};

export default searchArticles;
