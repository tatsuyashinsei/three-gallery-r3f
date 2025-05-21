// src/pages/NotionArticles/components/NotionBlockRenderer.jsx

import React from "react";

const NotionBlockRenderer = ({ block }) => {
  const { type, id } = block;

  if (!type || !block[type]) return null;

  const textArray = block[type].rich_text || [];
  const renderText = (textArr) =>
    textArr.map((t, i) => (
      <span key={i} className={t.annotations?.bold ? "font-bold" : ""}>
        {t.plain_text}
      </span>
    ));

  switch (type) {
    case "paragraph":
      return (
        <p key={id} className="mb-4 text-gray-800 dark:text-gray-200">
          {renderText(textArray)}
        </p>
      );

    case "heading_1":
      return (
        <h1
          key={id}
          className="text-2xl font-bold mt-6 mb-2 text-gray-900 dark:text-white"
        >
          {renderText(textArray)}
        </h1>
      );

    case "heading_2":
      return (
        <h2
          key={id}
          className="text-xl font-semibold mt-4 mb-2 text-gray-800 dark:text-white"
        >
          {renderText(textArray)}
        </h2>
      );

    case "heading_3":
      return (
        <h3
          key={id}
          className="text-lg font-semibold mt-3 mb-1 text-gray-700 dark:text-white"
        >
          {renderText(textArray)}
        </h3>
      );

    case "bulleted_list_item":
      return (
        <li key={id} className="list-disc list-inside">
          {renderText(textArray)}
        </li>
      );

    case "numbered_list_item":
      return (
        <li key={id} className="list-decimal list-inside">
          {renderText(textArray)}
        </li>
      );

    case "image":
      const imageUrl = block.image?.external?.url || block.image?.file?.url;
      return (
        <img
          key={id}
          src={imageUrl}
          alt="Notion画像"
          className="my-4 max-w-full rounded shadow"
        />
      );

    default:
      return (
        <pre key={id} className="bg-gray-200 text-sm p-2 rounded text-gray-700">
          ❓ 未対応ブロック: {type}
        </pre>
      );
  }
};

export default NotionBlockRenderer;
