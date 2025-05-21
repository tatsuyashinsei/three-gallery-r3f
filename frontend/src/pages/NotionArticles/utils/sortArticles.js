// sortArticles.js

/**
 * 記事を指定された基準でソートする関数
 *
 * @param {Array} articles - ソート対象の記事リスト
 * @param {string} sortBy - ソート基準（"date"｜"updatedAt"｜"title" など）
 * @param {string} order - 昇順: "asc"、降順: "desc"
 *
 * @returns {Array} - ソート済みの記事リスト
 */
const sortArticles = (articles, sortBy = "date", order = "desc") => {
  return [...articles].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];

    // 日付フィールドは Date に変換
    if (sortBy === "date" || sortBy === "updatedAt") {
      aVal = new Date(aVal);
      bVal = new Date(bVal);
    }

    if (aVal < bVal) return order === "asc" ? -1 : 1;
    if (aVal > bVal) return order === "asc" ? 1 : -1;
    return 0;
  });
};

export default sortArticles;
