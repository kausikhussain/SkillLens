"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Skill = {
  name: string;
  category: "Technical" | "Soft";
};

export type ResumeData = {
  text: string;
  skills: Skill[];
  ats_score: number;
  improvements: string[];
};

type ResumeContextType = {
  resumeData: ResumeData | null;
  setResumeData: (data: ResumeData | null) => void;
};

const ResumeContext = createContext<ResumeContextType | undefined>(undefined);

export function ResumeProvider({ children }: { children: ReactNode }) {
  const [resumeData, setResumeData] = useState<ResumeData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem("skillLens_resumeData");
    if (savedData) {
      try {
        setResumeData(JSON.parse(savedData));
      } catch (e) {
        console.error("Failed to parse resume data from localStorage", e);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage whenever it changes
  useEffect(() => {
    if (isLoaded) {
      if (resumeData) {
        localStorage.setItem("skillLens_resumeData", JSON.stringify(resumeData));
      } else {
        localStorage.removeItem("skillLens_resumeData");
      }
    }
  }, [resumeData, isLoaded]);

  return (
    <ResumeContext.Provider value={{ resumeData, setResumeData }}>
      {children}
    </ResumeContext.Provider>
  );
}

export function useResumeContext() {
  const context = useContext(ResumeContext);
  if (context === undefined) {
    throw new Error("useResumeContext must be used within a ResumeProvider");
  }
  return context;
}
