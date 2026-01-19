const ollamaService = require("../services/ollamaService.routeModelAnalysis");

const analyseWriting = async (req, res) => {
  try {
    //console.log(req.file.path);
    const { model, instructions, isVision } = req.body;
    const filePath = req.file ? req.file.path : null;
    const mimeType = req.file ? req.file.mimetype : null;
    const textInput = req.body.textInput || null;

    console.log(`Starting analysis with ${model}...`);
    console.log("File path in controller:", filePath);

    const analysisResult = await ollamaService.routeModelAnalysis(
      model,
      instructions,
      isVision,
      textInput,
      filePath,
      mimeType
    );

    return res.json({ success: true, data: analysisResult });
  } catch (error) {
    console.error("Analysis Error:", error.message);
    return res.status(500).json({
      success: false,
      error: `Analysis failed. Check if model ${req.body?.model} is running.`,
    });
  }
};

module.exports = { analyseWriting };
