// src/pages/NotionArticles/utils/renderNotionBlocks.js

// const renderNotionBlocks = (blocks) => {
//   return blocks.map((block, index) => {
//     if (block.type === "paragraph") {
//       const text = block.paragraph.rich_text
//         .map((rt) => rt.plain_text)
//         .join("");
//       return (
//         <p key={index} className="mb-4">
//           {text}
//         </p>
//       );
//     }

//     if (block.type === "heading_1") {
//       const text = block.heading_1.rich_text
//         .map((rt) => rt.plain_text)
//         .join("");
//       return (
//         <h1 key={index} className="text-2xl font-bold mb-2">
//           {text}
//         </h1>
//       );
//     }

//     if (block.type === "heading_2") {
//       const text = block.heading_2.rich_text
//         .map((rt) => rt.plain_text)
//         .join("");
//       return (
//         <h2 key={index} className="text-xl font-semibold mb-2">
//           {text}
//         </h2>
//       );
//     }

//     return null;
//   });
// };

// export default renderNotionBlocks;


// src/pages/NotionArticles/utils/renderNotionBlocks.jsx
import React from "react"

const renderNotionBlocks = (blocks) => {
  if (!Array.isArray(blocks)) return null

  return blocks.map((block, index) => {
    const { type, id } = block
    const key = id || index
    const text =
      block[type]?.rich_text?.map((rt) => rt.plain_text).join("") || ""

    switch (type) {
      case "paragraph":
        return <p key={key} className="mb-4">{text}</p>

      case "heading_1":
        return <h1 key={key} className="text-2xl font-bold mb-2">{text}</h1>

      case "heading_2":
        return <h2 key={key} className="text-xl font-semibold mb-2">{text}</h2>

      case "heading_3":
        return <h3 key={key} className="text-lg font-medium mb-2">{text}</h3>

      case "bulleted_list_item":
        return <li key={key} className="list-disc ml-6">{text}</li>

      case "numbered_list_item":
        return <li key={key} className="list-decimal ml-6">{text}</li>

      case "quote":
        return (
          <blockquote
            key={key}
            className="border-l-4 border-gray-400 pl-4 italic text-gray-600 dark:text-gray-300"
          >
            {text}
          </blockquote>
        )

      case "code":
        return (
          <pre
            key={key}
            className="bg-gray-800 text-white p-3 rounded text-sm overflow-x-auto"
          >
            <code>{text}</code>
          </pre>
        )

      case "divider":
        return <hr key={key} className="my-6 border-t border-gray-300 dark:border-gray-600" />

      default:
        return null
    }
  })
}

export default renderNotionBlocks
