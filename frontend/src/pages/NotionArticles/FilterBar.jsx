import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const FilterBar = ({
  genres = [],
  tags = [],
  selectedGenre,
  selectedTag,
  onGenreChange,
  onTagChange,
}) => {
  const navigate = useNavigate();
  const [openMenu, setOpenMenu] = useState(null); // 開閉制御用（モバイル向け）

  const handleSelect = (setter, value) => {
    setter(value);
    setOpenMenu(null);
  };

  return (
    <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
      {/* ← 戻るボタン */}
      <button
        onClick={() => navigate(-1)}
        className="btn btn-sm border border-white text-white hover:bg-white hover:text-gray-800"
      >
        ← 戻る
      </button>

      {/* フィルタードロップダウン */}
      <div className="flex flex-wrap gap-4 items-center justify-end">
        {/* ジャンル */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn m-1">
            ジャンル: {selectedGenre || "すべて"}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={() => onGenreChange("")}>すべて</a>
            </li>
            {genres.map((g) => {
              const genre = typeof g === "string" ? g : g.name;
              return (
                <li key={genre}>
                  <a onClick={() => onGenreChange(genre)}>{genre}</a>
                </li>
              );
            })}
          </ul>
        </div>

        {/* タグ */}
        <div className="dropdown dropdown-end">
          <label tabIndex={0} className="btn m-1">
            タグ: {selectedTag || "すべて"}
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <a onClick={() => onTagChange("")}>すべて</a>
            </li>
            {tags.map((t) => {
              const tag = typeof t === "string" ? t : t.name;
              return (
                <li key={tag}>
                  <a onClick={() => onTagChange(tag)}>{tag}</a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;
