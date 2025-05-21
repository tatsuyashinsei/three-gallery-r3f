// src/pages/NotionArticles/utils/formatDate.js

const formatDate = (date) => {
  if (!date) return "日付不明";

  try {
    return new Date(date).toLocaleDateString("ja-JP", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch (error) {
    console.error("❌ 日付の変換に失敗:", date, error);
    return "日付エラー";
  }
};

export default formatDate;
