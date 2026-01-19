const express = require("express");
const router = express.Router();
const uploadMiddleware = require("../middleware/uploadMiddleware");
const analysisController = require("../controllers/analysisControllers");
//const ollamaController = require("../controllers/ollamaControllers");
const ollamaAnalysisController = require("../controllers/ollamaAnalysisControllers");

// POST /api/ollama/documentAnalysis

// POST /api/analyse
router.post(
  "/analyse",
  uploadMiddleware.upload.single("document"),
  analysisController.analyze
);

// POST /api/ollama/analyse
// router.post(
//   "/ollama/analyse",
//   upload.single("document"),
//   ollamaController.analyse
// );

// POST /api/ollama/deepseek
// router.post(
//   "/ollama/deepseek",
//   upload.single("document"),
//   ollamaController.analyse
// );

// POST /api/textAnalyse
router.post(
  "/textAnalyse",
  uploadMiddleware.upload.none(),
  analysisController.textAnalyse
);

// POST /api/ollama/analyse
router.post(
  "/ollama/analyse",
  uploadMiddleware.uploadNew.single("document"),
  ollamaAnalysisController.analyseWriting
);

// POST /api/ollama/textAnalyse
router.post(
  "/ollama/textAnalyse",
  uploadMiddleware.upload.none(),
  ollamaAnalysisController.analyseWriting
);

module.exports = router;
