const ollamaService = require("../services/ollamaService");
//const { deleteFile } = require("../utils/fileUtils");

// const analyse = async (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ error: "No file uploaded" });
//   }

//   try {
//     console.log("Starting analysis with Ollama...");

//     const { model } = req.body;
//     const { instructions } = req.body;

//     const analysisResult = await ollamaService.analyseDocument(
//       req.file.path,
//       req.file.mimetype,
//       model,
//       instructions
//     );

//     console.log("We are done with DeepSeek R1...");

//     res.json({
//       success: true,
//       data: analysisResult,
//     });
//   } catch (error) {
//     console.error("Analysis Error:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Analysis failed. Ensure Ollama is running.",
//     });
//   } finally {
//     //deleteFile(req.file.path);
//   }
// };

// const ollamaTextAnalyse = async (req, res) => {
//   try {
//     console.log("Starting analysis with Ollama...");

//     const { textInput, customInstructions, model } = req.body;

//     const analysisResult = await ollamaService.analyseText(
//       textInput,
//       customInstructions,
//       model
//     );

//     console.log("We are done with DeepSeek R1...");
//     console.log(analysisResult);

//     res.json({
//       success: true,
//       data: analysisResult,
//     });
//   } catch (error) {
//     console.error("Analysis Error:", error.message);
//     res.status(500).json({
//       success: false,
//       error: "Analysis failed. Ensure Ollama is running.",
//     });
//   } finally {
//     //deleteFile(req.file.path);
//   }
// };

const nonVisionModelDocumentAnalysis = async (req, res) => {
  try {
    const { model } = req.body;
    const { instructions } = req.body;

    console.log("Starting analysis with " + model + "document analysis...");

    const analysisResult = await ollamaService.analyseNonVisionDocument(
      req.file.path,
      req.file.mimetype,
      model,
      instructions
    );

    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Analysis failed. Ensure the model " + model + "is running.",
    });
  } finally {
    //deleteFile(req.file.path);
  }
};

const visionModelAnalysis = async (req, res) => {
  try {
    const { model } = req.body;
    const { instructions } = req.body;

    console.log("Starting analysis with " + model + "document analysis...");

    const analysisResult = await ollamaService.analyseVisionDocument(
      req.file.path,
      req.file.mimetype,
      model,
      instructions
    );

    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Analysis failed. Ensure the model " + model + "is running.",
    });
  } finally {
    //deleteFile(req.file.path);
  }
};

const textAnalysis = async (req, res) => {
  try {
    const { model } = req.body;
    const { instructions } = req.body;

    console.log("Starting analysis with " + model + "document analysis...");

    const analysisResult = await ollamaService.analyseText(
      req.file.path,
      req.file.mimetype,
      model,
      instructions
    );

    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Analysis Error:", error.message);
    res.status(500).json({
      success: false,
      error: "Analysis failed. Ensure the model " + model + "is running.",
    });
  } finally {
    //deleteFile(req.file.path);
  }
};

//module.exports = { analyse, ollamaTextAnalyse };
