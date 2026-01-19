import { useLocation, useNavigate, Navigate } from "react-router";
import AnalysisReport from "../components/AnalysisReport";
import type { AnalysisResponse, Feedback } from "~/types";
import WritingReport from "~/components/WritingReport";

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // React Router v7 state handling
  const result = location.state?.result as Feedback | undefined;

  // If someone tries to go to /result directly without uploading, kick them back
  if (!result) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="mb-6 px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-100 transition"
        >
          ← Analyze Another Document
        </button>

        <WritingReport data={result} />
      </div>
    </div>
  );
};

export default Result;
