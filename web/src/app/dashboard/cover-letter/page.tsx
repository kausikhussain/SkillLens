"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { PenTool, Send, ArrowLeft, Loader2, Copy, CheckCircle2 } from "lucide-react";
import { useResumeContext } from "@/components/resume-context";
import Link from "next/link";
import axios from "axios";

export default function CoverLetterPage() {
  const { resumeData } = useResumeContext();
  const [jdText, setJdText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  if (!resumeData) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-md w-full">
          <PenTool className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Resume Found</h2>
          <p className="text-white/60 mb-6">Please upload a resume on the dashboard to generate a cover letter.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-transform hover:scale-105 active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleGenerate = async () => {
    if (!jdText.trim()) return;
    
    setIsGenerating(true);
    setCoverLetter(null);
    try {
      const res = await axios.post("http://localhost:8000/api/generate-cover-letter", {
        resume_text: resumeData.text,
        jd_text: jdText,
      });
      setCoverLetter(res.data.cover_letter);
    } catch (error) {
      console.error("Error generating cover letter:", error);
      alert("Failed to generate cover letter.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <PenTool className="text-purple-500" /> AI Cover Letter Generator
      </h1>
      <p className="text-white/60 mb-8">Paste a job description below to craft a tailored, professional cover letter based on your resume.</p>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col h-[600px]">
          <label className="block text-sm font-medium mb-2 text-white/80">Target Job Description</label>
          <textarea 
            value={jdText}
            onChange={(e) => setJdText(e.target.value)}
            placeholder="Paste the requirements and responsibilities here..."
            className="w-full flex-1 bg-black/50 border border-white/10 rounded-xl p-4 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all resize-none mb-4"
          />
          
          <div className="flex justify-end mt-auto">
            <button 
              onClick={handleGenerate}
              disabled={isGenerating || !jdText.trim()}
              className="w-full flex items-center justify-center gap-2 bg-white text-black px-6 py-4 rounded-xl font-medium hover:bg-white/90 transition-transform active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
            >
              {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
              {isGenerating ? "Forging Your Letter..." : "Generate Cover Letter"}
            </button>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl flex flex-col h-[600px] overflow-hidden relative">
          <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/20">
            <span className="text-sm font-medium text-white/80">Generated Output</span>
            {coverLetter && (
              <button onClick={handleCopy} className="text-white/60 hover:text-white transition-colors flex items-center gap-1 text-sm">
                {copied ? <CheckCircle2 className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied" : "Copy"}
              </button>
            )}
          </div>
          <div className="flex-1 p-6 overflow-y-auto whitespace-pre-wrap text-white/90 text-sm leading-relaxed">
             {coverLetter ? (
               <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                 {coverLetter}
               </motion.div>
             ) : (
               <div className="h-full flex items-center justify-center text-white/30 italic text-center">
                 Your personalized cover letter will appear here.
               </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}
