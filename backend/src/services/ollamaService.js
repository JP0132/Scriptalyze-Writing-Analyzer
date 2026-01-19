const ollama = require("../config/ollama");
const fs = require("fs");
const { PDFParse } = require("pdf-parse");
const { AIResponseFormat } = require("../utils/apiResponsesFormats");
const { fileToGenerativePart } = require("../utils/fileUtils");
const path = require("path");
const pdf = require("pdf-poppler");
const { handlePDFs } = require("../utils/handlePDFs");

async function convertPDFToImages(pdfPath) {
  let opts = {
    format: "png",
    out_dir: "./uploads/images",
    out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
    page: null,
    scale: 1500,
  };

  pdf
    .convert(pdfPath, opts)
    .then((res) => {
      //console.log(res);
      console.log("Successfully converted");
    })
    .catch((error) => {
      console.error(error);
    });
}

// Analyse do
const analyseNonVisionDocument = async (
  filePath,
  mimeType,
  model,
  instructions
) => {
  // 1. Extract Text from PDF
  // DeepSeek can't read files, so we convert PDF to text first

  console.log(`in nonvision ${model} analyse document`);
  const dataBuffer = fs.readFileSync(filePath);

  const uint8 = new Uint8Array(dataBuffer);
  let result;

  // if (typeof pdfParse !== "function") {
  //   console.error("PDF-PARSE DEBUG:", pdfParse);
  //   throw new Error("pdf-parse library did not load correctly.");
  // }

  try {
    const parser = await new PDFParse(uint8);
    result = await parser.getText();
    //console.log(result);
    await parser.destroy();
  } catch (error) {
    throw Error("Failed to extract text from PDF" + error);
  }

  // 2. Truncate text if it's too huge (DeepSeek 8b context limit varies)
  // 8b models can handle decent size, but let's be safe (~15k chars)

  const extractedText = result.pages.map((p) => p.text).join("\n\n");

  console.log(extractedText);

  // 3. Prepare Prompt
  // const prompt = `
  //   You are an expert document reviewer. Analyze the following document.

  //   Document TO ANALYZE:
  //   "${extractedText}"

  //   Your task is to provide a structured review.
  //   You must respond in ONLY valid JSON format. Do not use Markdown code blocks.

  //   Use this kind of JSON schema:
  //   {
  //     "summary": "Brief summary of the document",
  //     "strengths": list of strengths,
  //     "weaknesses": list of weakness,
  //     "improvements": ["Actionable tip 1", "Actionable tip 2"],
  //     "score": score out of 100
  //   }
  // `;

  const prompt = `You are an expert in writing analysis.
      Please analyse and rate the following text and suggest how to improve it.
      The text to analyse: ${extractedText}
      The rating can be low if the writing is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their writing skills.
      If available, use the custom instructions given by the user to give more detailed feedback.
      If provided, take the custom instructions into consideration, which should provide areas to focus on or context on what the text is.
      The custom instructions are: ${instructions}
      Provide the feedback using the following format:
      ${AIResponseFormat}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;

  // 4. Call Ollama
  const response = await ollama.chat({
    model: model,
    messages: [{ role: "user", content: prompt }],
    format: "json", // Forces Ollama to try to output JSON
    stream: false,
  });

  let content = response.message.content;

  // 5. CLEANUP: Remove <think> tags (Specific to DeepSeek R1)
  // DeepSeek R1 often outputs: <think>...reasoning...</think> { json }
  content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Remove markdown code blocks if present (e.g. ```json ... ```)
  content = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Raw Output from Ollama:", content);
    throw new Error("Failed to parse AI response as JSON");
  }
};

const analyseVisionDocument = async (
  filePath,
  mimeType,
  model,
  instructions
) => {
  // 1. Extract Text from PDF
  console.log(`in vision ${model} ${filePath} analyse document`);

  const filePart = fileToGenerativePart(filePath, mimeType);

  const prompt = `You are an expert in writing analysis.
      Please analyse and rate the following document attached and suggest how to improve it.
      The rating can be low if the writing is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their writing skills.
      If available, use the custom instructions given by the user to give more detailed feedback.
      If provided, take the custom instructions into consideration, which should provide areas to focus on or context on what the document is.
      The custom instructions are: ${instructions}
      Provide the feedback using the following format:
      ${AIResponseFormat}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;

  const testFile = fs.readFileSync(filePath).toString("base64");

  const imageBuffer = await fs.promises.readFile("./src/services/test.png");
  const convertedImage = await handlePDFs(filePath, "./uploads/images");

  // 4. Call Ollama
  const response = await ollama.chat({
    model: model,
    messages: [
      {
        role: "user",
        content: prompt,
        images: convertedImage,
      },
    ],
    format: "json", // Forces Ollama to try to output JSON
    stream: false,
  });

  let content = response.message.content;

  // 5. CLEANUP: Remove <think> tags (Specific to DeepSeek R1)
  // DeepSeek R1 often outputs: <think>...reasoning...</think> { json }
  content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Remove markdown code blocks if present (e.g. ```json ... ```)
  content = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Raw Output from Ollama:", content);
    throw new Error("Failed to parse AI response as JSON");
  }
};

const analyseText = async (textInput, customInstructions, model) => {
  // 1. Extract Text from PDF
  // DeepSeek can't read files, so we convert PDF to text first

  console.log(`in text only input ${model} analyse document`);

  let result;

  // if (typeof pdfParse !== "function") {
  //   console.error("PDF-PARSE DEBUG:", pdfParse);
  //   throw new Error("pdf-parse library did not load correctly.");
  // }

  // 3. Prepare Prompt
  const prompt = `You are an expert in writing analysis.
      Please analyse and rate the following text and suggest how to improve it.
      The text to analyse: ${textInput}
      The rating can be low if the writing is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their writing skills.
      If available, use the custom instructions given by the user to give more detailed feedback.
      If provided, take the custom instructions into consideration.
      The custom instructions are: ${customInstructions}
      Provide the feedback using the following format:
      ${AIResponseFormat}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;

  // 4. Call Ollama
  const response = await ollama.chat({
    model: model,
    messages: [{ role: "user", content: prompt }],
    format: "json", // Forces Ollama to try to output JSON
    stream: false,
  });

  let content = response.message.content;

  // 5. CLEANUP: Remove <think> tags (Specific to DeepSeek R1)
  // DeepSeek R1 often outputs: <think>...reasoning...</think> { json }
  content = content.replace(/<think>[\s\S]*?<\/think>/g, "").trim();

  // Remove markdown code blocks if present (e.g. ```json ... ```)
  content = content
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  try {
    return JSON.parse(content);
  } catch (e) {
    console.error("Raw Output from Ollama:", content);
    throw new Error("Failed to parse AI response as JSON");
  }
};

module.exports = {
  analyseNonVisionDocument,
  analyseText,
  analyseVisionDocument,
};
