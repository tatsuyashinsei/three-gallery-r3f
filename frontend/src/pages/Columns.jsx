// src/pages/Columns.jsx

import React from "react";
import ArticlesPage from "./NotionArticles/index.jsx"; // ← 明示的にパス指定

const ColumnsPage = () => {
  return <ArticlesPage />;
};

// Columns.jsx を一時的にこう書き換える
// const ColumnsPage = () => {
//   return <div style={{ padding: '2rem', fontSize: '1.5rem' }}>コラムページが表示されました！</div>
// }


export default ColumnsPage;
