"use client";

import { motion } from "framer-motion";
import { CheckCircle, AlertTriangle, FileText } from "lucide-react";

export default function ResumeScorePage() {
  const mockData = {
    score: 82,
    skills: [
      { name: "Python", category: "Technical" },
      { name: "Next.js", category: "Technical" },
      { name: "Communication", category: "Soft" },
    ],
    improvements: [
      "Quantify your achievements (e.g., 'Improved performance by 20%')",
      "Add more action verbs to the beginning of bullet points",
    ]
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 flex items-center gap-2">
        <FileText className="text-purple-500" /> Resume Analysis
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
          <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-purple-500/20 mb-4">
            <span className="text-4xl font-bold text-purple-400">{mockData.score}</span>
            <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
              <circle cx="60" cy="60" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-purple-500 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" strokeDasharray="350" strokeDashoffset={350 - (350 * mockData.score) / 100} strokeLinecap="round" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold">ATS Score</h2>
          <p className="text-white/60 text-sm mt-2">Your resume is looking strong, but there is room for improvement.</p>
        </div>

        <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5" /> Detected Skills</h3>
          <div className="flex flex-wrap gap-2 mb-8">
            {mockData.skills.map((skill, i) => (
              <span key={i} className="px-3 py-1 bg-white/10 rounded-full text-sm font-medium border border-white/5">
                {skill.name} <span className="text-white/40 text-xs ml-1">({skill.category})</span>
              </span>
            ))}
          </div>

          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><AlertTriangle className="text-yellow-500 w-5 h-5" /> Recommended Improvements</h3>
          <ul className="space-y-3">
            {mockData.improvements.map((imp, i) => (
              <li key={i} className="flex items-start gap-3 text-white/70 bg-white/5 p-3 rounded-lg border border-white/5">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 mt-2 flex-shrink-0" />
                {imp}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
