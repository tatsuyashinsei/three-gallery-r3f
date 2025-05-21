import React from "react";
import formatDate from "./utils/formatDate";
import { Link } from "react-router-dom";

const ArticleCard = ({ article }) => {
  const { id, title, genre, tags = [], date, imageUrl } = article;

  const fallbackImage =
    "https://res.cloudinary.com/dxcotqkhe/image/upload/v1747727713/Junbichu_m0yflm.png";

  const isValidImageUrl =
    typeof imageUrl === "string" &&
    imageUrl.trim() !== "" &&
    imageUrl.trim().toLowerCase() !== "null";

  const thumbnail = isValidImageUrl ? imageUrl.trim() : fallbackImage;

  return (
    <Link
      to={`/columns/${id}`}
      className="block hover:opacity-90 transition-all duration-200"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-900 shadow-md rounded-lg overflow-hidden border">
        <img
          src={thumbnail}
          alt="記事サムネイル"
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null; // 無限ループ防止
            e.target.src = fallbackImage;
          }}
        />
        <div className="p-4 space-y-2">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {title || "無題"}
          </h2>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {formatDate(date)}
          </div>
          <div className="flex flex-wrap gap-1 text-sm">
            {genre && (
              <span className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 px-2 py-0.5 rounded">
                {genre}
              </span>
            )}
            {tags.map((tag, index) => (
              <span
                key={tag?.name || index}
                className="bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 px-2 py-0.5 rounded"
              >
                {tag?.name || "タグ"}
              </span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ArticleCard;
