import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { LayoutDashboard, FileText, Target, Map, Zap } from "lucide-react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black text-white">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/10 bg-white/5 flex flex-col">
        <div className="p-6 flex items-center gap-2 border-b border-white/10">
          <Zap className="w-6 h-6 text-purple-500" />
          <span className="font-bold text-xl tracking-tight">SkillLens</span>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { name: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
            { name: "Resume Score", icon: FileText, href: "/dashboard/resume" },
            { name: "JD Matcher", icon: Target, href: "/dashboard/matcher" },
            { name: "AI Roadmap", icon: Map, href: "/dashboard/roadmap" },
          ].map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-white/10 flex items-center gap-3">
          <UserButton afterSignOutUrl="/" />
          <span className="text-sm font-medium text-white/80">Account</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
