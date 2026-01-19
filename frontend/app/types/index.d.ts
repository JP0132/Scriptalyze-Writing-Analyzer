import type { icons } from "lucide-react";

interface Job {
  title: string;
  description: string;
  location: string;
  requiredSkills: string[];
}

interface AIModel {
  id: string;
  name: string;
  description: string;
  icon: string | icons;
  isVision: string;
  enable: boolean;
}

interface Resume {
  id: string;
  companyName?: string;
  jobTitle?: string;
  imagePath: string;
  resumePath: string;
  feedback: Feedback;
}

interface Feedback {
  overallScore: number;
  writing: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
    }[];
  };
  toneAndStyle: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  content: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  structure: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
  skills: {
    score: number;
    tips: {
      type: "good" | "improve";
      tip: string;
      explanation: string;
    }[];
  };
}

export interface AnalysisResponse {
  summary: string;
  strengths: string[];
  weaknesses: string[];
  improvements: string[];
  score: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
}

export interface Route {}
export namespace Route {
  export type LinkDescriptor = {
    rel: string;
    href: string;
    crossOrigin?: string | "anonymous";
    media?: string;
    as?: string;
  };

  export type LinksFunction = () => LinkDescriptor[];

  export type ErrorBoundaryProps = {
    error: unknown;
  };
}
