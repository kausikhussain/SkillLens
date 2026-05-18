"use client"

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, FileText, Target, Zap, Briefcase } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 overflow-hidden relative">
      {/* Dynamic Background Mesh */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/30 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-purple-500" />
          <span className="text-xl font-bold tracking-tight">SkillLens</span>
        </div>
        <div className="flex items-center gap-6 text-sm font-medium hidden md:flex">
          <Link href="#features" className="text-white/70 hover:text-white transition-colors">Features</Link>
          <Link href="#how-it-works" className="text-white/70 hover:text-white transition-colors">How it works</Link>
          <Link href="/sign-in" className="text-white/70 hover:text-white transition-colors">Sign In</Link>
          <Link href="/dashboard" className="bg-white text-black px-4 py-2 rounded-full hover:bg-white/90 transition-transform hover:scale-105">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex flex-col items-center justify-center min-h-[80vh] px-4 text-center max-w-5xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-sm text-purple-300 mb-8 backdrop-blur-md"
        >
          <span className="flex h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
          Introducing SkillLens AI 2.0
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60"
        >
          Your AI Career <br className="hidden md:block" /> Intelligence Forge.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-lg md:text-xl text-white/60 max-w-2xl mb-10 leading-relaxed"
        >
          Stop guessing why your resume isn't passing the ATS. Upload your resume, get a deep-dive AI analysis, find skill gaps, and generate personalized roadmaps to become interview-ready.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4"
        >
          <Link href="/dashboard" className="group relative flex items-center justify-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium text-lg overflow-hidden transition-all hover:scale-105 active:scale-95">
            <span className="relative z-10 flex items-center gap-2">
              Start Free Analysis <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-purple-200 to-white opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </Link>
        </motion.div>

        {/* Feature Cards Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-32 w-full"
        >
          {[
            { icon: FileText, title: "Deep Resume Parsing", desc: "Extract Core & Supporting skills with precision." },
            { icon: Target, title: "ATS Score Engine", desc: "Compare against real JDs and uncover missing keywords." },
            { icon: Briefcase, title: "Personalized Roadmaps", desc: "AI generates week-by-week plans to close your skill gaps." }
          ].map((feature, idx) => (
            <div key={idx} className="flex flex-col items-center p-6 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="p-3 bg-purple-500/20 rounded-xl mb-4">
                <feature.icon className="w-6 h-6 text-purple-400" />
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-white/50 text-sm">{feature.desc}</p>
            </div>
          ))}
        </motion.div>
      </main>
    </div>
  );
}
