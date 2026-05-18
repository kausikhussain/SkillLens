"use client";

import { motion } from "framer-motion";
import { Map, Clock, CheckCircle } from "lucide-react";

export default function RoadmapPage() {
  const mockRoadmap = {
    weeks: [
      { week: 1, focus: "Fundamentals & Core Concepts", tasks: ["Complete Python crash course", "Build a simple CLI tool"] },
      { week: 2, focus: "Advanced Topics", tasks: ["Learn about generators and decorators", "Solve 5 LeetCode medium problems"] },
      { week: 3, focus: "Frameworks", tasks: ["Build a REST API with FastAPI", "Integrate a SQLite database"] },
      { week: 4, focus: "Project & Deployment", tasks: ["Deploy the API to Render", "Update resume with this project"] }
    ]
  };

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
        <Map className="text-purple-500" /> AI Learning Roadmap
      </h1>
      <p className="text-white/60 mb-10">A personalized week-by-week plan to bridge your skill gaps.</p>

      <div className="space-y-6 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-purple-500 before:to-white/10">
        {mockRoadmap.weeks.map((week, idx) => (
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
    </div>
  );
}
