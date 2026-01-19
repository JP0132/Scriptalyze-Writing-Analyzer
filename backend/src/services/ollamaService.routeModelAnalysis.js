const ollamaService = require("../services/ollamaService");

async function routeModelAnalysis(
  model,
  instructions,
  isVision,
  textInput,
  filePath,
  mimeType
) {
  console.log(`${filePath} file path in routeModelAnalysis`);
  // Detect if this is a text-only input
  if (!filePath) {
    return ollamaService.analyseText(textInput, instructions, model);
  }

  // Check if model is vision-enabled
  //const isVision = model.includes("vision") || model.includes("vl");

  if (isVision == "vision") {
    return ollamaService.analyseVisionDocument(
      filePath,
      mimeType,
      model,
      instructions
    );
  }

  // Fallback, treat as non-vision text document
  return ollamaService.analyseNonVisionDocument(
    filePath,
    mimeType,
    model,
    instructions
  );
}

module.exports = { routeModelAnalysis };
