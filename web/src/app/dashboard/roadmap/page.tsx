"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Map, Clock, CheckCircle, ArrowLeft, Loader2, Wand2 } from "lucide-react";
import { useResumeContext } from "@/components/resume-context";
import Link from "next/link";
import axios from "axios";

type RoadmapWeek = {
  week: number;
  focus: string;
  tasks: string[];
};

type Roadmap = {
  weeks: RoadmapWeek[];
};

export default function RoadmapPage() {
  const { resumeData } = useResumeContext();
  const [roadmap, setRoadmap] = useState<Roadmap | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [targetRole, setTargetRole] = useState("Software Engineer");

  if (!resumeData) {
    return (
      <div className="p-8 max-w-5xl mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="p-6 bg-white/5 border border-white/10 rounded-2xl max-w-md w-full">
          <Map className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">No Resume Found</h2>
          <p className="text-white/60 mb-6">Please upload a resume on the dashboard to generate a roadmap.</p>
          <Link href="/dashboard" className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-transform hover:scale-105 active:scale-95">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const handleGenerateRoadmap = async () => {
    setIsGenerating(true);
    try {
      const skills = resumeData.skills.map((s) => s.name);
      const res = await axios.post("http://localhost:8000/api/generate-roadmap", {
        current_skills: skills,
        target_role: targetRole,
      });
      setRoadmap(res.data);
    } catch (error) {
      console.error("Error generating roadmap:", error);
      alert("Failed to generate roadmap.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Map className="text-purple-500" /> AI Learning Roadmap
      </h1>
      <p className="text-white/60 mb-10">A personalized week-by-week plan to bridge your skill gaps.</p>

      {!roadmap ? (
        <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-2xl mx-auto">
          <h3 className="text-xl font-medium mb-4">Ready to level up?</h3>
          <p className="text-white/60 mb-6">
            We will analyze your detected skills and generate a customized 4-week learning path to help you reach your goals.
          </p>
          <div className="mb-6 max-w-sm mx-auto">
            <label className="block text-sm text-white/60 mb-2 text-left">Target Role</label>
            <input 
              type="text" 
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white placeholder:text-white/30 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              placeholder="e.g. Frontend Developer"
            />
          </div>
          <button 
            onClick={handleGenerateRoadmap}
            disabled={isGenerating}
            className="inline-flex items-center gap-2 bg-white text-black px-6 py-3 rounded-full font-medium hover:bg-white/90 transition-transform hover:scale-105 active:scale-95 disabled:opacity-50 disabled:pointer-events-none"
          >
            {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Wand2 className="w-5 h-5" />}
            {isGenerating ? "Generating Plan..." : "Generate Roadmap"}
          </button>
        </div>
      ) : (
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-white/10">
          {roadmap.weeks.map((week, idx) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              key={idx} 
              className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active"
            >
              <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-black bg-purple-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                {week.week}
              </div>
              
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] bg-white/5 border border-white/10 p-6 rounded-2xl shadow-xl hover:bg-white/10 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-xl text-purple-400">Week {week.week}</h3>
                  <span className="text-xs font-medium text-white/50 px-2 py-1 bg-white/5 rounded-full flex items-center gap-1"><Clock className="w-3 h-3"/> {week.focus}</span>
                </div>
                <ul className="space-y-3 mt-4">
                  {week.tasks.map((task, tIdx) => (
                    <li key={tIdx} className="flex items-start gap-2 text-white/80 text-sm">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {task}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
