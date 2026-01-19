const fs = require("fs");

// Convert file to format Gemini accepts
const fileToGenerativePart = (path, mimeType) => {
  return {
    inlineData: {
      data: fs.readFileSync(path).toString("base64"),
      mimeType,
    },
  };
};

// Safe delete function
// const deleteFile = (path) => {
//   try {
//     if (fs.existsSync(path)) {
//       fs.unlinkSync(path);
//     }
//   } catch (err) {
//     console.error("Error deleting file:", err);
//   }
// };

module.exports = { fileToGenerativePart };
