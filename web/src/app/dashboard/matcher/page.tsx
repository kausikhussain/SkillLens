"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Search, ArrowLeft, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useResumeContext } from "@/components/resume-context";
import Link from "next/link";
import axios from "axios";

type MatchResult = {
  match_score: number;
  matching_skills: string[];
  missing_keywords: string[];
};

export default function JDMatcherPage() {
  const { resumeData } = useResumeContext();
  const [jdText, setJdText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [matchResult, setMatchResult] = useState<MatchResult | null>(null);
  
  if (!resumeData) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-md w-full">
          <Target className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Resume Found</h2>
          <p className="text-white/60 mb-6">Please upload a resume on the dashboard to analyze job matches.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-transform hover:scale-105 active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleAnalyzeMatch = async () => {
    if (!jdText.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const res = await axios.post("http://localhost:8000/api/match-jd", {
        resume_text: resumeData.text,
        jd_text: jdText,
      });
      setMatchResult(res.data);
    } catch (error) {
      console.error("Error matching JD:", error);
      alert("Failed to analyze job match.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Target className="text-purple-500" /> Job Description Matcher
      </h1>
      <p className="text-white/60 mb-8">Paste a job description below to see how well your resume aligns.</p>

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
        <label className="block text-sm font-medium mb-2 text-white/80">Job Description</label>
        <textarea 
          value={jdText}
          onChange={(e) => setJdText(e.target.value)}
          placeholder="Paste the requirements and responsibilities here..."
          className="w-full h-48 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none mb-4"
        />
        
        <div className="flex justify-end">
          <button 
            onClick={handleAnalyzeMatch}
            disabled={isAnalyzing || !jdText.trim()}
            className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isAnalyzing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
            {isAnalyzing ? "Analyzing..." : "Analyze Match"}
          </button>
        </div>
      </div>

      {matchResult ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          <div className="col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center text-center">
             <div className="relative w-32 h-32 flex items-center justify-center rounded-full border-8 border-green-500/20 mb-4">
               <span className="text-4xl font-bold text-green-400">{matchResult.match_score}%</span>
               <svg className="absolute inset-0 w-full h-full rotate-[-90deg]">
                 <circle cx="60" cy="60" r="56" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" strokeDasharray="350" strokeDashoffset={350 - (350 * matchResult.match_score) / 100} strokeLinecap="round" />
               </svg>
             </div>
             <h2 className="text-xl font-semibold">Match Score</h2>
             <p className="text-white/60 text-sm mt-2">How well your resume fits this specific role.</p>
          </div>
          
          <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><CheckCircle className="text-green-500 w-5 h-5" /> Matching Skills</h3>
            <div className="flex flex-wrap gap-2 mb-8">
              {matchResult.matching_skills.length > 0 ? matchResult.matching_skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm font-medium border border-green-500/30">
                  {skill}
                </span>
              )) : <span className="text-white/40 italic">No matching skills found.</span>}
            </div>

            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2"><XCircle className="text-red-500 w-5 h-5" /> Missing Keywords</h3>
            <div className="flex flex-wrap gap-2">
              {matchResult.missing_keywords.length > 0 ? matchResult.missing_keywords.map((skill, i) => (
                <span key={i} className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium border border-red-500/30">
                  {skill}
                </span>
              )) : <span className="text-white/40 italic">You have all the required keywords!</span>}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="mt-8 text-center p-12 border border-dashed border-white/20 rounded-2xl text-white/40">
          Results will appear here after analysis.
        </div>
      )}
    </div>
  );
}
