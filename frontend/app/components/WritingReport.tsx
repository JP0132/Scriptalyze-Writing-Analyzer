import React, { useState } from "react";
import Summary from "./Summary";
import type { Feedback } from "~/types";
import Writing from "./Writing";
import Details from "./Details";

const WritingReport = ({ data }: { data: Feedback }) => {
  const [feedback, setFeedback] = useState<Feedback | null>(data);
  return (
    <div>
      <h2 className="text-4xl text-black! font-bold">Writing Review</h2>
      {feedback ? (
        <div className="flex flex-col gap-8 animate-in fade-in duration-1000">
          <Summary feedback={feedback} />
          <Writing
            score={feedback.writing.score || 0}
            suggestions={feedback.writing.tips || []}
          />
          <Details feedback={feedback} />
        </div>
      ) : (
        <img src="/images/resume-scan-2.gif" className="w-full" />
      )}
    </div>
  );
};

export default WritingReport;
