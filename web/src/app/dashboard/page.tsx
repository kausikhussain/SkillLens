"use client";

import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, CheckCircle, Loader2 } from "lucide-react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useResumeContext } from "@/components/resume-context";

export default function DashboardPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();
  const { setResumeData } = useResumeContext();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const selectedFile = acceptedFiles[0];
      setFile(selectedFile);
      setIsAnalyzing(true);
      
      try {
        const formData = new FormData();
        formData.append("file", selectedFile);
        
        // 1. Upload and extract text
        const uploadRes = await axios.post("http://localhost:8000/api/upload-resume", formData);
        const fullText = uploadRes.data.full_text;
        
        // 2. Analyze the extracted text
        const analyzeRes = await axios.post("http://localhost:8000/api/analyze-resume", {
          text: fullText
        });
        
        // 3. Save to context
        setResumeData({
          text: fullText,
          skills: analyzeRes.data.skills,
          ats_score: analyzeRes.data.ats_score,
          improvements: analyzeRes.data.improvements
        });
        
        // 4. Redirect to Resume Score page
        router.push("/dashboard/resume");
      } catch (error) {
        console.error("Error analyzing resume:", error);
        alert("Failed to analyze resume. Make sure the backend is running.");
      } finally {
        setIsAnalyzing(false);
      }
    },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Welcome to your Forge</h1>
      <p className="text-white/60 mb-10">Upload your latest resume to generate AI insights, ATS scores, and roadmaps.</p>

      {/* Upload Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-colors ${
            isDragActive ? "border-purple-500 bg-purple-500/10" : "border-white/20 bg-white/5 hover:bg-white/10"
          } ${isAnalyzing ? "opacity-50 pointer-events-none" : ""}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center gap-4">
            <div className="p-4 bg-white/5 rounded-full">
              {isAnalyzing ? (
                <Loader2 className="w-8 h-8 text-purple-400 animate-spin" />
              ) : (
                <UploadCloud className="w-8 h-8 text-purple-400" />
              )}
            </div>
            {isAnalyzing ? (
              <div className="text-purple-400 font-medium animate-pulse">
                Analyzing your resume with AI...
              </div>
            ) : file ? (
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-medium">{file.name} ready for analysis</span>
              </div>
            ) : (
              <div>
                <p className="text-lg font-medium">Drag & drop your resume PDF</p>
                <p className="text-sm text-white/50 mt-1">or click to browse files</p>
              </div>
            )}
          </div>
        </div>
      </motion.div>

      {/* Analytics Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="col-span-1 md:col-span-2 bg-white/5 border border-white/10 rounded-2xl p-6 h-64 flex flex-col justify-center items-center">
          <p className="text-white/40">Upload a resume to see your Skill Graph</p>
        </div>
        <div className="col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 h-64 flex flex-col justify-center items-center">
          <p className="text-white/40">ATS Score Preview</p>
        </div>
      </div>
    </div>
  );
}
