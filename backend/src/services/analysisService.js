const genAI = require("../config/gemini");
const { SchemaType } = require("@google/generative-ai");
const { fileToGenerativePart } = require("../utils/fileUtils");

const analysisSchema = {
  description: "Analysis of the document",
  type: SchemaType.OBJECT,
  properties: {
    summary: { type: SchemaType.STRING, description: "Brief summary" },
    strengths: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    weaknesses: { type: SchemaType.ARRAY, items: { type: SchemaType.STRING } },
    improvements: {
      type: SchemaType.ARRAY,
      items: { type: SchemaType.STRING },
    },
    score: { type: SchemaType.NUMBER, description: "Score out of 100" },
  },
  required: ["summary", "strengths", "weaknesses", "improvements", "score"],
};

// export const AIResponseFormat = `
//       interface Feedback {
//       overallScore: number; //max 100
//       writing: {
//         score: number; //rate based on writing skill
//         tips: {
//           type: "good" | "improve";
//           tip: string; //give 3-4 tips
//         }[];
//       };
//       toneAndStyle: {
//         score: number; //max 100
//         tips: {
//           type: "good" | "improve";
//           tip: string; //make it a short "title" for the actual explanation
//           explanation: string; //explain in detail here
//         }[]; //give 3-4 tips
//       };
//       content: {
//         score: number; //max 100
//         tips: {
//           type: "good" | "improve";
//           tip: string; //make it a short "title" for the actual explanation
//           explanation: string; //explain in detail here
//         }[]; //give 3-4 tips
//       };
//       structure: {
//         score: number; //max 100
//         tips: {
//           type: "good" | "improve";
//           tip: string; //make it a short "title" for the actual explanation
//           explanation: string; //explain in detail here
//         }[]; //give 3-4 tips
//       };
//       skills: {
//         score: number; //max 100
//         tips: {
//           type: "good" | "improve";
//           tip: string; //make it a short "title" for the actual explanation
//           explanation: string; //explain in detail here
//         }[]; //give 3-4 tips
//       };
//     }`;

const analyzeDocument = async (filePath, mimeType) => {
  // 1. Get the model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  // 2. Prepare the prompt
  const prompt = `
    Analyze this document (resume, paper, or case study).
    Provide a professional critique focusing on structure, clarity, content, and impact.
    Return the result in strictly structured JSON.
  `;

  // 3. Process file
  const filePart = fileToGenerativePart(filePath, mimeType);

  // 4. Generate content
  const result = await model.generateContent([prompt, filePart]);
  const response = await result.response;

  // 5. Parse and return JSON
  return JSON.parse(response.text());
};

const textAnalysis = async (textInput, customInstructions) => {
  // 1. Get the model
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: analysisSchema,
    },
  });

  // 2. Prepare the prompt
  const prompt = `
    Analyse this text (resume, paper, or case study).
    Provide a professional critique focusing on structure, clarity, content, and impact.
    Return the result in strictly structured JSON.
  `;

  const prompt2 = `You are an expert in writing analysis.
      Please analyse and rate this wrting and suggest how to improve it.
      The rating can be low if the writing is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their writing skills.
      If available, use the custom instructions given by the user to give more detailed feedback.
      If provided, take the custom instructions into consideration.
      The custom instructions are: ${customInstructions}
      Provide the feedback using the following format:
      ${analysisSchema}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;

  // 3. Process file
  // const filePart = fileToGenerativePart(filePath, mimeType);

  // 4. Generate content
  const result = await model.generateContent([prompt2, textInput]);
  const response = await result.response;

  // 5. Parse and return JSON
  return JSON.parse(response.text());
};

module.exports = { analyzeDocument, textAnalysis };
