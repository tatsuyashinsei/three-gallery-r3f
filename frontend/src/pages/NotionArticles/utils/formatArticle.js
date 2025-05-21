// src/pages/NotionArticles/utils/formatArticle.js

import normalizeTags from "./normalizeTags";

const formatArticle = (raw) => {
  const titleProp = raw.title || raw.名前 || raw.properties?.名前;

  const title =
    titleProp?.title?.[0]?.plain_text ||
    titleProp?.title?.[0]?.text?.content ||
    "無題";

  return {
    id: raw.id,
    title,
    genre:
      raw.genre || raw.properties?.セレクト?.rich_text?.[0]?.plain_text || "",
    tags: normalizeTags(
      raw.tags || raw.properties?.マルチセレクト?.multi_select || []
    ),
    date: raw.date || raw.properties?.作成日時?.created_time || null,
    imageUrl:
      raw.imageUrl ||
      raw.properties?.["UI画像"]?.files?.[0]?.file?.url ||
      "/default-thumbnail.jpg",
    isPrivate: raw.isPrivate ?? raw.properties?.非公開?.checkbox ?? false,
  };
};

export default formatArticle;
