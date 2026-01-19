import type { AIModel, AnalysisResponse, ApiResponse } from "./types";

const API_URL = "http://localhost:5000/api";

export const analyzeDocument = async (
  file: File,
  modelType: AIModel,
  instructions: string
): Promise<AnalysisResponse> => {
  const formData = new FormData();
  formData.append("document", file);
  formData.append("model", modelType.id);
  formData.append("instructions", instructions);
  formData.append("isVision", modelType.isVision);

  const apiRoute = modelType.id == "gemini" ? "/analyse" : "/ollama/analyse";

  const response = await fetch(API_URL + apiRoute, {
    method: "POST",
    body: formData,
  });

  const json: ApiResponse<AnalysisResponse> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || "Failed to analyze document");
  }

  return json.data;
};

export const analyseText = async (
  textInput: string,
  customInstructions: string,
  modelType: AIModel
) => {
  console.log(textInput, customInstructions, modelType);
  const formData = new FormData();
  formData.append("textInput", textInput);
  formData.append("model", modelType.id);
  formData.append("customInstructions", customInstructions);
  formData.append("isVision", modelType.isVision);

  const apiRoute =
    modelType.id == "gemini" ? "/textAnalyse" : "/ollama/textAnalyse";

  const response = await fetch(API_URL + apiRoute, {
    method: "POST",
    body: formData,
  });

  const json: ApiResponse<AnalysisResponse> = await response.json();

  if (!response.ok || !json.success) {
    throw new Error(json.error || "Failed to analyze document");
  }

  return json.data;
};
