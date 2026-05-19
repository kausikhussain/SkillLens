"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

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
