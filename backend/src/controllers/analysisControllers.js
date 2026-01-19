const analysisService = require("../services/analysisService");
//const { deleteFile } = require("../utils/fileUtils");

const analyze = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Call the service logic
    console.log(" ABOUT TO CALL THE SERVICE LOGIC");
    const analysisResult = await analysisService.analyzeDocument(
      req.file.path,
      req.file.mimetype
    );

    // Send success response
    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze document. Please try again.",
    });
  } finally {
    // ALWAYS clean up the uploaded file, even if it errors
    //deleteFile(req.file.path);
  }
};

//const { deleteFile } = require("../utils/fileUtils");

const textAnalyse = async (req, res) => {
  const { textInput, customInstructions } = req.body;

  try {
    // Call the service logic
    console.log(" ABOUT TO CALL THE SERVICE LOGIC");
    const analysisResult = await analysisService.textAnalysis(
      textInput,
      customInstructions
    );

    // Send success response
    res.json({
      success: true,
      data: analysisResult,
    });
  } catch (error) {
    console.error("Analysis Error:", error);
    res.status(500).json({
      success: false,
      error: "Failed to analyze document. Please try again.",
    });
  } finally {
    // ALWAYS clean up the uploaded file, even if it errors
    //deleteFile(req.file.path);
  }
};

module.exports = { analyze, textAnalyse };
