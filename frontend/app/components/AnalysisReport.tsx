import React from "react";
import type { AnalysisResponse } from "~/types";

interface Props {
  data: AnalysisResponse;
}

const AnalysisReport: React.FC<Props> = ({ data }) => {
  // Helper to choose color based on score
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 50) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header / Score */}
      <div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-100">
        <h2 className="text-2xl font-bold mb-2">Analysis Score</h2>
        <div className={`text-6xl font-black ${getScoreColor(data.score)}`}>
          {data.score}
          <span className="text-2xl text-gray-400">/100</span>
        </div>
        <p className="mt-4 text-gray-600 max-w-2xl mx-auto">{data.summary}</p>
      </div>

      {/* Grid Layout */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="bg-green-50 p-6 rounded-xl border border-green-100">
          <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
            ✅ Strengths
          </h3>
          <ul className="space-y-2">
            {data.strengths.map((item, i) => (
              <li key={i} className="flex gap-2 text-green-900">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="bg-red-50 p-6 rounded-xl border border-red-100">
          <h3 className="text-xl font-bold text-red-800 mb-4 flex items-center gap-2">
            ❌ Weaknesses
          </h3>
          <ul className="space-y-2">
            {data.weaknesses.map((item, i) => (
              <li key={i} className="flex gap-2 text-red-900">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Improvements */}
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h3 className="text-xl font-bold text-blue-800 mb-4 flex items-center gap-2">
            💡 Improvements
          </h3>
          <ul className="space-y-2">
            {data.improvements.map((item, i) => (
              <li key={i} className="flex gap-2 text-blue-900">
                <span>•</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AnalysisReport;
