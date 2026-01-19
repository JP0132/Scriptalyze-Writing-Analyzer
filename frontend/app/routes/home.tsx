import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import {
  Upload,
  FileText,
  Type,
  Sparkles,
  ChevronDown,
  SendHorizontal,
  Loader2,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import type { AIModel } from "~/types";
import { analyseText, analyzeDocument } from "~/api";

const models: AIModel[] = [
  {
    id: "gemini",
    name: "Gemini",
    description: "2.0 Flash Model",
    isVision: "vision",
    icon: "gemini-color.svg",
    enable: true,
  },
  {
    id: "deepseek-r1:8b",
    name: "deepseek-r1:8b",
    description: "Self-hosted through Ollama",
    isVision: "non-vision",
    icon: "deepseek-color.svg",
    enable: true,
  },
  {
    id: "gemma3:12b",
    name: "gemma3:12b",
    description: "From Google's Gemini Family",
    icon: "gemma-color.svg",
    enable: true,
    isVision: "vision",
  },
  {
    id: "qwen3:8b",
    name: "qwen3:8b",
    description: "Latest LLM in Qwen series",
    icon: "gemma-color.svg",
    enable: true,
    isVision: "vision",
  },
  {
    id: "qwen3-vl:8b",
    name: "qwen3-vl:8b",
    description: "Latest vision LLM in Qwen series",
    icon: "gemma-color.svg",
    enable: true,
    isVision: "vision",
  },
  {
    id: "ministral-3:8b",
    name: "ministral-3:8b",
    description: "From the ministral 3 family",
    icon: "mistral-color.svg",
    enable: true,
    isVision: "vision",
  },
  {
    id: "ollama",
    name: "Ollama Deepseek-r1:8b",
    description: "Open-source LLM",
    icon: FileText,
    enable: true,
    isVision: "non-vision",
  },
  {
    id: "gpt-4",
    name: "GPT-4 Turbo",
    description: "Latest OpenAI model",
    icon: "openai.svg",
    enable: false,
    isVision: "vision",
  },
];

export default function Home() {
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedType, setSelectedType] = useState<"text" | "documents">(
    "documents"
  );
  const [textInput, setTextInput] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");
  const [model, setModel] = useState<AIModel>(models[1]);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleModelChange = (modelName: AIModel) => {
    setModel(modelName);
    setIsDropdownOpen(false);
  };

  const handleFileAnalysis = async (file: File) => {
    setLoading(true);
    try {
      const result = await analyzeDocument(file, model, instructions);
      navigate("/result", {
        state: {
          result,
          fileName: file.name,
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Document analysis error:", error);

      showNotification(
        "Analysis failed. Please check your file and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTextAnalysis = async (
    textInput: string,
    customInstructions: string
  ) => {
    if (!textInput.trim()) {
      showNotification("Please enter text to analyze", "warning");
      return;
    }
    setLoading(true);
    try {
      const result = await analyseText(textInput, customInstructions, model);
      navigate("/result", {
        state: {
          result,
          fileName: "Text Input",
          timestamp: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Document analysis error:", error);

      showNotification(
        "Analysis failed. Please check your file and try again.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[url('bg2.svg')] bg-cover flex flex-col items-center justify-center p-4 md:p-8">
      {/* Header */}
      <header className="navbar">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#4F6DE4] rounded-lg flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-bold text-gray-900">SCRIPTALYZE</span>
        </div>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-4xl">
        <div className="text-center mb-10">
          <h1 className="inline-block text-4xl whitespace-pre-line md:text-5xl font-bold mb-4 bg-clip-text ">
            Smart feedback <br /> for your writing
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Transform your writing skills with AI insights. Analyse text, CVs
            and research papers with AI.
          </p>
        </div>

        {/* Model Selector */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select AI Model
          </label>
          <div className="flex flex-wrap gap-3">
            {models.map((modelItem) => (
              <button
                key={modelItem.id}
                onClick={() => handleModelChange(modelItem)}
                disabled={!modelItem.enable}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl border transition-all ${
                  model?.id === modelItem.id
                    ? "border-blue-500 bg-blue-50 text-blue-700 shadow-sm cursor-pointer"
                    : modelItem.enable
                      ? "border-gray-200 bg-white text-gray-700 hover:border-gray-300 cursor-pointer"
                      : "border-gray-200 bg-gray-300 text-gray-700 cursor-not-allowed"
                }`}
              >
                {typeof modelItem.icon == "string" ? (
                  <img src={modelItem.icon} width={40} height={40} />
                ) : (
                  <modelItem.icon className="w-5 h-5" />
                )}

                <div className="text-left">
                  <div className="text-[18px]">{modelItem.name}</div>
                  <div className="text-[12px] text-gray-500">
                    {modelItem.description}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Analysis Type Toggle */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="border-b border-gray-100">
            <div className="flex">
              <button
                onClick={() => setSelectedType("documents")}
                className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${
                  selectedType === "documents"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Upload className="w-5 h-5" />
                <span className="font-medium">Document Upload</span>
              </button>
              <button
                onClick={() => setSelectedType("text")}
                className={`flex-1 py-4 flex items-center justify-center gap-2 transition-colors ${
                  selectedType === "text"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Type className="w-5 h-5" />
                <span className="font-medium">Text Input</span>
              </button>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-8">
            {selectedType === "documents" ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Instructions (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g. Focus on technical skills"
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                  />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    Upload Your Document
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Supports PDF, DOCX, TXT files up to 50MB
                  </p>
                </div>

                <FileUpload onFileSelect={setSelectedFile} />

                {/* {loading && (
                  <div className="flex items-center justify-center gap-3 text-blue-600">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span className="font-medium">
                      Analyzing document with{" "}
                      {models.find((m) => m.id === model)?.name}...
                    </span>
                  </div>
                )} */}

                <div className="flex justify-end">
                  <button
                    onClick={() => handleFileAnalysis(selectedFile!)}
                    disabled={loading || selectedFile == null}
                    className="flex items-center gap-2 px-6 py-3 cursor-pointer bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="w-5 h-5" />
                        Analyze Text
                      </>
                    )}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Instructions (Optional)
                  </label>
                  <textarea
                    value={instructions}
                    onChange={(e) => setInstructions(e.target.value)}
                    placeholder="e.g., 'Focus on technical skills and quantify achievements'"
                    className="w-full h-32 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Text to Analyze
                  </label>
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="Paste your text here for analysis..."
                    className="w-full h-48 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={6}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">
                      {textInput.length} characters
                    </span>
                    <span className="text-sm text-gray-500">
                      {textInput.trim().split(/\s+/).length} words
                    </span>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={() => handleTextAnalysis(textInput, instructions)}
                    disabled={loading || !textInput.trim()}
                    className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <SendHorizontal className="w-5 h-5" />
                        Analyze Text
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Trust Indicators */}
      </main>

      {/* Footer */}
      <footer className="mt-12 text-center">
        <p className="text-sm text-gray-500">
          © 2024 AnalyzerAI. All rights reserved. |
          <a href="#" className="ml-2 hover:text-blue-600">
            Privacy Policy
          </a>{" "}
          |
          <a href="#" className="ml-2 hover:text-blue-600">
            Terms of Service
          </a>
        </p>
      </footer>
    </div>
  );
}

const showNotification = (
  message: string,
  type: "success" | "error" | "warning"
) => {
  console.log(`${type.toUpperCase()}: ${message}`);
};

// Enhanced FileUpload Component
function FileUpload({
  onFileSelect,
}: {
  onFileSelect: (file: File | null) => void;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    setError(null);

    // Check file size
    const maxSize = 20 * 1024 * 1024; // Convert MB to bytes
    if (file.size > maxSize) {
      setError(`File size exceeds ${20}MB limit`);
      return false;
    }

    // Check file type
    //const acceptedTypes = accept.split(',').map(type => type.trim());
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();

    // if (!acceptedTypes.includes(fileExtension)) {
    //   setError(`File type not supported. Accepted types: ${accept}`);
    //   return false;
    // }

    return true;
  };

  const handleFileSelection = (file: File) => {
    setSelectedFile(file);
    setError(null);
    onFileSelect(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      if (files.length > 1) {
        setError("Please upload only one file");
        return;
      }
      handleFileSelection(files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFileSelection(e.target.files[0]);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setError(null);
    onFileSelect(null);

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleContainerClick = () => {
    if (!selectedFile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${selectedFile ? "opacity-0 h-0 overflow-hidden" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleContainerClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleChange}
          accept={"pdf, docx, txt"}
          multiple={false}
          disabled={selectedFile != null}
        />
        <div className="space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
            <Upload className="w-8 h-8 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">
              Drag & drop your files here
            </h4>
            <p className="text-gray-600 text-sm mb-3">
              or click to browse files
            </p>
            <p className="text-xs text-gray-500">PDFs, DOCX, TXT (Max 20MB)</p>
          </div>
        </div>
      </div>

      {/* Selected File Display */}
      {selectedFile && (
        <div className="border border-gray-200 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Upload className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">
                  {selectedFile.name}
                </p>
                <p className="text-sm text-gray-500">
                  {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                </p>
              </div>
            </div>
            <button
              onClick={handleClear}
              className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors"
              aria-label="Remove file"
            >
              <X className="w-4 h-4 text-gray-500" />
            </button>
          </div>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="text-red-600 text-sm bg-red-50 border border-red-100 rounded-lg p-3">
          {error}
        </div>
      )}

      {/* Instructions when file is selected */}
      {selectedFile && (
        <p className="text-sm text-gray-500 text-center">
          File uploaded successfully. Click the X button to remove and upload a
          different file.
        </p>
      )}
    </div>
  );
}
