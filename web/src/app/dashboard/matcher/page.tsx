"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Target, Search, ArrowRight } from "lucide-react";

export default function JDMatcherPage() {
  const [jdText, setJdText] = useState("");
  
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
          <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-transform hover:scale-105 active:scale-95">
            <Search className="w-4 h-4" /> Analyze Match
          </button>
        </div>
      </div>

      {/* Placeholder for results */}
      <div className="mt-8 text-center p-12 border border-dashed border-white/20 rounded-2xl text-white/40">
        Results will appear here after analysis.
      </div>
    </div>
  );
}
