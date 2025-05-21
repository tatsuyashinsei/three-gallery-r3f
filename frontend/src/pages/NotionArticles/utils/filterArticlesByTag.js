// filterArticlesByTag.js

const filterArticlesByTag = (articles, selectedTag) => {
  if (!selectedTag) return articles;

  return articles.filter((article) =>
    article.tags?.some((tag) => tag.name === selectedTag)
  );
};

export default filterArticlesByTag;
