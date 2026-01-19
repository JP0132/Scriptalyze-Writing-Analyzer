import React, { useRef, useState, type ChangeEvent } from "react";

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, isLoading }) => {
  const [file, setFile] = useState<File | null>(null);
  const [fileSelected, setFileSelected] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [inputKey, setInputKey] = useState(Date.now());

  function clearInput() {
    setInputKey(Date.now()); // forces remount
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      //onFileSelect(e.target.files[0]);
      setFileSelected(true);
      setFile(e.target.files[0]);
    }
  };

  const handleClearInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
      setFileSelected(false);
      setFile(null);
      clearInput();
    }
  };

  return (
    <div className="upload-container">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-10 text-center hover:bg-gray-50 transition">
        <input
          type="file"
          id="file-upload"
          ref={fileInputRef}
          multiple={false}
          onChange={handleChange}
          accept=".pdf,.docx,.txt"
          disabled={fileSelected}
        />
        <button
          className="bg-red-400 text-white p-2 rounded-2xl cursor-pointer"
          onClick={() => {
            handleClearInput();
          }}
        >
          CLEAR
        </button>

        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center gap-2"
        >
          <span className="text-4xl">📄</span>
          <span className="text-lg font-medium text-gray-700">
            {isLoading ? "Analysing..." : "Click to Upload Document"}
          </span>
          <span className="text-sm text-gray-500">PDF, DOCX up to 10MB</span>
        </label>
        <button
          disabled={!fileSelected}
          onClick={() => {
            onFileSelect(file!);
          }}
          className="text-xl disabled:text-gray-50 disabled:bg-gray-500 p-2 rounded-2xl mt-1 cursor-pointer disabled:cursor-default"
        >
          SUBMIT
        </button>
      </div>
    </div>
  );
};

export default FileUpload;
