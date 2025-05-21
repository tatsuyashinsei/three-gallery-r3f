// normalizeTags.js

const normalizeTags = (tagsArray) => {
  if (!Array.isArray(tagsArray)) return [];

  return tagsArray.map((tag) => {
    if (typeof tag === "string") {
      return { name: tag };
    }

    if (tag && typeof tag === "object" && tag.name) {
      return { name: tag.name };
    }

    return { name: String(tag) };
  });
};

export default normalizeTags;
