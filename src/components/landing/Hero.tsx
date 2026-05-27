import { useState, useEffect } from "react";
import { ArrowRight, Check, Play, Zap, FileText, BarChart3, ListTodo, Shield, User, Sparkles, Brain, Table, Cpu, Database, Workflow, Layers, FileSpreadsheet, TrendingUp, Network, Activity, Terminal, GitBranch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Cube3D } from "./Cube3D";


const floatingIcons = [
  // Original 8 Icons
  { icon: FileText, top: "12%", left: "10%", size: "w-12 h-12 md:w-16 md:h-16", delay: 0, duration: 18, rotateDir: 1, opacity: "opacity-[0.06] md:opacity-[0.09]" },
  { icon: BarChart3, top: "25%", right: "8%", size: "w-10 h-10 md:w-14 md:h-14", delay: 2, duration: 22, rotateDir: -1, opacity: "opacity-[0.05] md:opacity-[0.08]" },
  { icon: ListTodo, top: "45%", left: "6%", size: "w-11 h-11 md:w-15 md:h-15", delay: 1, duration: 20, rotateDir: 1, opacity: "opacity-[0.06] md:opacity-[0.09]" },
  { icon: Brain, top: "50%", right: "12%", size: "w-12 h-12 md:w-16 md:h-16", delay: 3, duration: 24, rotateDir: -1, opacity: "opacity-[0.07] md:opacity-[0.1]" },
  { icon: Zap, top: "15%", right: "18%", size: "w-8 h-8 md:w-10 md:h-10", delay: 0.5, duration: 14, rotateDir: 1, opacity: "opacity-[0.07] md:opacity-[0.11]" },
  { icon: Sparkles, top: "35%", left: "22%", size: "w-9 h-9 md:w-11 md:h-11", delay: 1.5, duration: 16, rotateDir: -1, opacity: "opacity-[0.06] md:opacity-[0.09]" },
  { icon: Table, top: "68%", left: "15%", size: "w-10 h-10 md:w-12 md:h-12", delay: 2.5, duration: 19, rotateDir: 1, opacity: "opacity-[0.05] md:opacity-[0.08]" },
  { icon: Shield, top: "80%", right: "20%", size: "w-11 h-11 md:w-14 md:h-14", delay: 4, duration: 25, rotateDir: -1, opacity: "opacity-[0.06] md:opacity-[0.09]" },
  
  // New 10 Automation Icons to Double Density
  { icon: Cpu, top: "8%", left: "40%", size: "w-8 h-8 md:w-10 md:h-10", delay: 0.8, duration: 16, rotateDir: 1, opacity: "opacity-[0.05] md:opacity-[0.08]" },
  { icon: Database, top: "28%", left: "32%", size: "w-10 h-10 md:w-12 md:h-12", delay: 1.2, duration: 20, rotateDir: -1, opacity: "opacity-[0.06] md:opacity-[0.09]" },
  { icon: Workflow, top: "58%", right: "28%", size: "w-11 h-11 md:w-14 md:h-14", delay: 1.8, duration: 22, rotateDir: 1, opacity: "opacity-[0.05] md:opacity-[0.08]" },
  { icon: Layers, top: "72%", left: "7%", size: "w-9 h-9 md:w-11 md:h-11", delay: 2.2, duration: 17, rotateDir: -1, opacity: "opacity-[0.06] md:opacity-[0.09]" },
  { icon: FileSpreadsheet, top: "88%", left: "38%", size: "w-12 h-12 md:w-15 md:h-15", delay: 0.4, duration: 21, rotateDir: 1, opacity: "opacity-[0.05] md:opacity-[0.07]" },
  { icon: TrendingUp, top: "38%", right: "35%", size: "w-9 h-9 md:w-11 md:h-11", delay: 1.6, duration: 15, rotateDir: -1, opacity: "opacity-[0.07] md:opacity-[0.10]" },
  { icon: Network, top: "62%", left: "28%", size: "w-10 h-10 md:w-13 md:h-13", delay: 2.8, duration: 23, rotateDir: 1, opacity: "opacity-[0.06] md:opacity-[0.08]" },
  { icon: Activity, top: "78%", right: "8%", size: "w-11 h-11 md:w-13 md:h-13", delay: 3.2, duration: 18, rotateDir: -1, opacity: "opacity-[0.05] md:opacity-[0.08]" },
  { icon: Terminal, top: "84%", left: "22%", size: "w-8 h-8 md:w-10 md:h-10", delay: 1.0, duration: 19, rotateDir: 1, opacity: "opacity-[0.06] md:opacity-[0.09]" },
  { icon: GitBranch, top: "48%", left: "35%", size: "w-10 h-10 md:w-12 md:h-12", delay: 2.0, duration: 24, rotateDir: -1, opacity: "opacity-[0.05] md:opacity-[0.08]" },
];

export const Hero = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);

  const tabs = [
    { id: 0, label: "1. PDF Scraping", icon: FileText },
    { id: 1, label: "2. Creating Dashboards", icon: BarChart3 },
    { id: 2, label: "3. Managing Tasks", icon: ListTodo },
    { id: 3, label: "4. Automating", icon: Shield },
  ];

  // Auto-rotation timer with progress bar
  useEffect(() => {
    if (manualOverride) return;

    const interval = 6000; // 6 seconds per tab
    const steps = 100;
    const stepTime = interval / steps;

    setProgress(0);

    const progressTimer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          setActiveTab((prevTab) => (prevTab + 1) % 4);
          return 0;
        }
        return prev + 1;
      });
    }, stepTime);

    return () => clearInterval(progressTimer);
  }, [activeTab, manualOverride]);

  const handleTabClick = (tabId: number) => {
    setActiveTab(tabId);
    setProgress(100);
    setManualOverride(true);
  };

  const handleCubeClick = (tabId: number) => {
    setActiveTab(tabId);
    setProgress(100);
    setManualOverride(true);
    setTimeout(() => {
      const element = document.getElementById("task-automation-video");
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }, 100);
  };


  return (
    <section className="relative min-h-screen bg-[#FCFBFE] bg-grid-landeros pt-36 pb-24 overflow-hidden border-b border-[#311081]/5 font-sans-landeros text-[#1C1629]">
      
      {/* Floating Automation Background Icons */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none select-none z-0">
        {floatingIcons.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={idx}
              className={`absolute text-[#311081] ${item.opacity} ${item.size}`}
              style={{
                top: item.top,
                left: item.left || "auto",
                right: item.right || "auto",
              }}
              animate={{
                y: [0, -25, 25, 0],
                x: [0, 15, -15, 0],
                rotate: [0, item.rotateDir * 180, item.rotateDir * 360],
              }}
              transition={{
                duration: item.duration,
                delay: item.delay,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon className="w-full h-full stroke-[1.25]" />
            </motion.div>
          );
        })}
      </div>
      
      {/* Premium Purple Radial Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[600px] bg-gradient-to-tr from-[#6D28D9]/5 to-[#4F46E5]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 right-10 w-[400px] h-[400px] bg-gradient-to-tr from-[#311081]/5 to-[#6D28D9]/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-gradient-to-br from-[#4F46E5]/3 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          {/* Centered Attention Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#6D28D9]" />
            <span>The #1 Platform for Reconstruction Companies</span>
          </motion.div>

          {/* Centered Satoshi Bold Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black leading-[1.05] tracking-tight mb-8 font-display-landeros text-[#311081] max-w-4xl"
          >
            YOU DON’T NEED <br className="hidden sm:inline" />
            MORE <span className="bg-gradient-to-r from-[#311081] to-[#6D28D9] bg-clip-text text-transparent underline decoration-[#6D28D9]/30">OFFICE STAFF.</span>
          </motion.h1>

          {/* Centered Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl font-semibold leading-relaxed mb-4 max-w-3xl text-[#3C354D] z-20"
          >
            BIGlogic automates estimates, contracts, compliance, billing, and communication — so your team can focus on winning more jobs.
          </motion.p>

          
          {/* Dual CTAs - Exact LanderOS styles */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row gap-4 mb-4 w-full sm:w-auto items-center justify-center relative z-30"
          >
            <button
              onClick={() => navigate("/signup")}
              className="btn-landeros-primary h-14 px-8 text-xs md:text-sm flex items-center justify-center gap-2.5 font-bold shrink-0 shadow-md w-full sm:w-auto group"
            >
              <Zap className="w-4 h-4 fill-current text-white shrink-0" />
              <span className="tracking-wide">CLAIM YOUR 3 FREE ESTIMATES</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-200 shrink-0" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                const element = document.getElementById("task-automation-video");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth", block: "center" });
                }
              }}
              className="btn-landeros-secondary h-14 px-8 text-xs md:text-sm flex items-center justify-center gap-2.5 font-bold shrink-0 w-full sm:w-auto border border-[#311081]/5 text-[#311081] group"
            >
               <Play className="w-3.5 h-3.5 fill-current text-[#311081] group-hover:scale-110 transition-transform duration-200 shrink-0" />
               <span className="tracking-wide">SEE THE AUTOMATION</span>
            </button>
          </motion.div>

          {/* ==========================================================================
             3D Isometric Floating Cubes framer motion (Representing 4 pillars)
             ========================================================================== */}
          <div className="w-full flex flex-col items-center justify-center mt-[-30px] md:mt-[-70px] mb-8 select-none relative z-10 overflow-visible">
            
            {/* Desktop Diamond Grid */}
            <div className="relative w-full max-w-[620px] h-[400px] hidden md:block select-none overflow-visible">
              
              {/* Back / Top Cube: PDF SCRAPING */}
              <div className="absolute top-[0%] left-1/2 -translate-x-1/2">
                <Cube3D
                  icon={FileText}
                  label="1. PDF Scraping"
                  sublabel="Extract materials in 45s"
                  delay={0}
                  isActive={activeTab === 0}
                  onClick={() => handleCubeClick(0)}
                />
              </div>

              {/* Left Cube: CREATING DASHBOARDS */}
              <div className="absolute top-[28%] left-[4%]">
                <Cube3D
                  icon={BarChart3}
                  label="2. Live Dashboards"
                  sublabel="Real-time draw analytics"
                  delay={0.4}
                  isActive={activeTab === 1}
                  onClick={() => handleCubeClick(1)}
                />
              </div>

              {/* Right Cube: MANAGING TASKS */}
              <div className="absolute top-[28%] right-[4%]">
                <Cube3D
                  icon={ListTodo}
                  label="3. Managing Tasks"
                  sublabel="AI automated workflows"
                  delay={0.8}
                  isActive={activeTab === 2}
                  onClick={() => handleCubeClick(2)}
                />
              </div>

              {/* Front / Bottom Cube: AUTOMATING */}
              <div className="absolute bottom-[0%] left-1/2 -translate-x-1/2">
                <Cube3D
                  icon={Shield}
                  label="4. Automating"
                  sublabel="Calm operator pipelines"
                  delay={1.2}
                  isActive={activeTab === 3}
                  onClick={() => handleCubeClick(3)}
                />
              </div>
            </div>

            {/* Mobile / Tablet Responsive Staggered Grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-12 w-full max-w-sm md:hidden overflow-visible px-4 my-6">
              <Cube3D
                icon={FileText}
                label="1. PDF Scraping"
                sublabel="Extract materials in 45s"
                delay={0}
                isActive={activeTab === 0}
                onClick={() => handleCubeClick(0)}
              />
              <Cube3D
                icon={BarChart3}
                label="2. Live Dashboards"
                sublabel="Real-time draw analytics"
                delay={0.4}
                isActive={activeTab === 1}
                onClick={() => handleCubeClick(1)}
              />
              <Cube3D
                icon={ListTodo}
                label="3. Managing Tasks"
                sublabel="AI automated workflows"
                delay={0.8}
                isActive={activeTab === 2}
                onClick={() => handleCubeClick(2)}
              />
              <Cube3D
                icon={Shield}
                label="4. Automating"
                sublabel="Calm operator pipelines"
                delay={1.2}
                isActive={activeTab === 3}
                onClick={() => handleCubeClick(3)}
              />
            </div>
            
          </div>


          {/* Social Proof */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2 mb-20 border-t border-[#311081]/5 w-full max-w-xl"
          >
            <div className="flex -space-x-2">
              {[1, 2, 3, 4].map((i) => (
                <img
                  key={i}
                  className="inline-block h-8 w-8 rounded-full border border-white object-cover shadow-sm"
                  src={`https://images.unsplash.com/photo-${1500000000000 + i * 100000}?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80`}
                  alt={`Active contractor ${i}`}
                />
              ))}
            </div>
            <p className="text-xs md:text-sm font-semibold text-[#3C354D]">
              <span className="text-[#311081] font-bold">850+ U.S. Restoration Teams</span> Active &bull; <span className="text-[#6D28D9] font-bold">45,000+ Hours Saved</span>
            </p>
          </motion.div>



          {/* ==========================================================================
             Interactive Task Automation Simulated Video Mockup (Framer Motion)
             ========================================================================== */}
          <motion.div
            id="task-automation-video"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.5, type: "spring", stiffness: 45 }}
            className="w-full max-w-5xl border border-[#311081]/10 bg-white rounded-[32px] shadow-landeros-lg overflow-hidden relative z-20 flex flex-col scroll-mt-28"
          >
            {/* Window Top Bar (Pearl White LanderOS style) */}
            <div className="bg-[#FCFBFE] border-b border-[#311081]/5 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                <div className="w-3 h-3 rounded-full bg-[#E5E7EB]" />
                <span className="text-[10px] font-bold tracking-widest text-[#311081]/60 uppercase ml-4 font-tech-landeros">
                  BIGlogic System Core
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-[#F6F1FC] border border-[#311081]/5 rounded-full px-3 py-1 text-[9px] font-bold text-[#311081] uppercase font-tech-landeros">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                System Active
              </div>
            </div>

            {/* Dashboard Tabs for Video Simulation */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-[#FCFBFE] border-b border-[#311081]/5 font-tech-landeros text-[11px] font-bold text-[#645D75]">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex flex-col items-center gap-2 py-4 px-3 border-r border-[#311081]/5 relative transition-all duration-300 ${
                      isActive ? "bg-white text-[#311081] font-extrabold" : "hover:bg-[#F6F1FC]/30 text-[#645D75]/70"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${isActive ? "text-[#6D28D9]" : "text-[#645D75]/60"}`} />
                      <span>{tab.label}</span>
                    </div>
                    {/* Animated Tab Progress Bar */}
                    {isActive && (
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F6F1FC]">
                        <motion.div
                          layoutId="tabProgress"
                          className="h-full bg-gradient-to-r from-[#311081] to-[#6D28D9]"
                          style={{ width: `${progress}%` }}
                          transition={{ ease: "linear" }}
                        />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Main Interactive Screen Canvas */}
            <div className="p-8 md:p-12 min-h-[380px] md:min-h-[420px] bg-white relative flex flex-col justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                
                {/* 1. PDF SCRAPING STATE */}
                {activeTab === 0 && (
                  <motion.div
                    key="tab-scraping"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center w-full"
                  >
                    {/* Left: Dragging PDF Mock */}
                    <div className="md:col-span-5 flex flex-col items-center justify-center">
                      <div className="w-48 h-60 border-2 border-dashed border-[#6D28D9]/20 rounded-3xl bg-[#F6F1FC]/30 flex flex-col items-center justify-center p-6 relative overflow-hidden group shadow-inner">
                        
                        {/* Laser scan line inside document */}
                        <motion.div 
                          animate={{ 
                            y: [0, 200, 0] 
                          }}
                          transition={{ 
                            duration: 3, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                          }}
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#6D28D9] to-transparent shadow-[0_0_12px_2px_rgba(109,40,217,0.5)] z-10"
                        />

                        <FileText className="w-16 h-16 text-[#311081] mb-4" />
                        <span className="font-tech-landeros text-[10px] font-bold text-[#311081]/70 truncate max-w-full text-center">
                          Estimate_Final_Xact.pdf
                        </span>
                        <span className="text-[8px] uppercase tracking-wider font-bold text-[#6D28D9] bg-[#F6F1FC] border border-[#6D28D9]/20 px-2 py-0.5 rounded-full mt-2 font-tech-landeros">
                          Xactimate Source
                        </span>
                      </div>
                    </div>

                    {/* Right: Real-time Extraction Results */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4 font-tech-landeros text-xs font-bold text-[#311081]">
                        <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                        <span>EXTRACTING CUSTOM MATERIAL SELECTIONS:</span>
                      </div>
                      
                      <div className="space-y-3 font-sans-landeros">
                        {[
                          { id: 1, type: "Flooring", label: "Walnut Plank Hardwood - $14,200", delay: 0.5 },
                          { id: 2, type: "Cabinetry", label: "Solid Cherry Shaker Cabinets - $18,500", delay: 1.5 },
                          { id: 3, type: "Countertops", label: "Calacatta Quartz Slabs - $9,800", delay: 2.5 },
                          { id: 4, type: "Draw Schedule", label: "Generated Draw package (5 Bank Milestones) - 100%", delay: 3.5 },
                        ].map((item) => (
                          <motion.div
                            key={item.id}
                            initial={{ opacity: 0, y: 10, scale: 0.98 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            transition={{ duration: 0.4, delay: item.delay }}
                            className="flex items-center justify-between p-3.5 border border-[#311081]/5 bg-[#FCFBFE] rounded-2xl shadow-sm hover:border-[#6D28D9]/25 transition-all"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3]" />
                              </div>
                              <span className="text-xs font-bold text-[#311081] font-tech-landeros">{item.type}:</span>
                              <span className="text-xs font-medium text-[#645D75]">{item.label}</span>
                            </div>
                            <span className="text-[9px] font-bold text-[#6D28D9] font-tech-landeros bg-[#F6F1FC] px-2 py-0.5 rounded-full">
                              COMPLIED
                            </span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 2. AUTOMATED DASHBOARDS STATE */}
                {activeTab === 1 && (
                  <motion.div
                    key="tab-dashboards"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col w-full"
                  >
                    {/* Header Details */}
                    <div className="flex justify-between items-center mb-6 font-tech-landeros">
                      <div>
                        <h4 className="text-sm font-bold text-[#311081]">LIVE PROJECT DRAW ANALYTICS</h4>
                        <p className="text-[10px] text-[#3C354D] font-semibold mt-0.5">Calculated automatically from extracted PDF coordinates.</p>
                      </div>
                      <div className="text-[10px] font-bold text-[#6D28D9] bg-[#F6F1FC] border border-[#6D28D9]/20 px-3 py-1 rounded-full uppercase tracking-wider">
                        Compliance Score: 99.8%
                      </div>
                    </div>

                    {/* Stats Rows */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {[
                        { title: "LENDER DRAWS UNLOCKED", value: "$45,200", detail: "Milestones 1 & 2 Approved", color: "from-[#311081] to-[#6D28D9]" },
                        { title: "CARRIER DISCREPANCIES", value: "0", detail: "All Line Items Auditor-Approved", color: "from-emerald-600 to-teal-500" },
                        { title: "TOTAL SAVINGS", value: "$15,400", detail: "Avoided purchasing errors", color: "from-[#6D28D9] to-indigo-500" },
                      ].map((card, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.15 }}
                          className="bg-[#FCFBFE] border border-[#311081]/5 p-5 rounded-2xl flex flex-col justify-between shadow-sm relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-[#6D28D9]/5 to-transparent rounded-full pointer-events-none" />
                          <span className="text-[9px] font-bold text-[#645D75] tracking-wider font-tech-landeros uppercase">{card.title}</span>
                          <span className={`text-2xl font-black bg-gradient-to-r ${card.color} bg-clip-text text-transparent my-2 font-display-landeros`}>
                            {card.value}
                          </span>
                          <span className="text-[9px] font-semibold text-[#645D75]">{card.detail}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Mini Sparkline Chart */}
                    <div className="border border-[#311081]/5 bg-[#FCFBFE] p-5 rounded-2xl shadow-sm h-36 flex flex-col justify-between relative overflow-hidden">
                      <span className="text-[9px] font-bold text-[#311081]/60 font-tech-landeros uppercase tracking-wider">PROJECT CASH VELOCITY</span>
                      
                      {/* SVG Line Drawing Path with Framer Motion */}
                      <div className="h-16 w-full relative">
                        <svg className="w-full h-full" viewBox="0 0 500 60" preserveAspectRatio="none">
                          <motion.path
                            d="M0,50 Q60,35 120,45 T240,15 T360,25 T480,5"
                            fill="none"
                            stroke="#6D28D9"
                            strokeWidth="3.5"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />
                          <motion.path
                            d="M0,50 Q60,35 120,45 T240,15 T360,25 T480,5 L480,60 L0,60 Z"
                            fill="url(#gradient-chart)"
                            opacity="0.08"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.08 }}
                            transition={{ duration: 1 }}
                          />
                          <defs>
                            <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#6D28D9" />
                              <stop offset="100%" stopColor="#FCFBFE" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Glowing dot on the peak */}
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: [1, 1.5, 1], opacity: 1 }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="absolute right-4 top-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border border-white shadow shadow-emerald-500/50"
                        />
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-bold text-[#645D75] font-tech-landeros">
                        <span>WEEK 1 (UPLOAD)</span>
                        <span>WEEK 2 (AUDITED)</span>
                        <span className="text-[#6D28D9]">WEEK 3 (FUNDED 45D FASTER)</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* 3. MANAGING TASKS STATE */}
                {activeTab === 2 && (
                  <motion.div
                    key="tab-tasks"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col w-full max-w-2xl mx-auto"
                  >
                    <div className="flex items-center gap-2 mb-6 font-tech-landeros text-xs font-bold text-[#311081]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#6D28D9] animate-ping" />
                      <span>AI WORKFLOW MANAGER EXECUTING IN BACKGROUND:</span>
                    </div>

                    <div className="space-y-3 font-sans-landeros">
                      {[
                        { step: 1, label: "Scanning Xactimate PDF document structural lines", desc: "Isolating raw material schedules and unit pricing counts.", delay: 0.2 },
                        { step: 2, label: "Mapping milestone payouts to local lender percentages", desc: "Draw milestones structured accurately to meet banking tolerances.", delay: 1.4 },
                        { step: 3, label: "Auditing line codes against top 10 insurance carrier rules", desc: "Flagged 0 guidelines errors, protecting payouts from carrier delays.", delay: 2.6 },
                        { step: 4, label: "Compiling Excel files and cloud draw delivery packages", desc: "Structured excel lists ready to download in 1 click.", delay: 3.8 },
                      ].map((task) => (
                        <motion.div
                          key={task.step}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: task.delay }}
                          className="flex gap-4 p-4 border border-[#311081]/5 bg-[#FCFBFE] rounded-2xl shadow-sm relative overflow-hidden hover:border-[#6D28D9]/25 transition-all"
                        >
                          <div className="relative flex items-center justify-center shrink-0">
                            {/* Animated Loading Circle changing to Checkmark */}
                            <motion.div
                              className="w-6 h-6 rounded-full border-2 border-indigo-200 flex items-center justify-center"
                              initial={{ borderColor: "rgba(99, 102, 241, 0.2)" }}
                              animate={{ borderColor: "#10B981", backgroundColor: "#E6FDF5" }}
                              transition={{ duration: 0.4, delay: task.delay + 0.8 }}
                            >
                              <motion.div
                                initial={{ opacity: 0, scale: 0 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: task.delay + 1 }}
                              >
                                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[3.5]" />
                              </motion.div>
                            </motion.div>
                          </div>

                          <div className="text-left">
                            <h4 className="text-xs font-bold text-[#311081] font-tech-landeros">{task.label}</h4>
                            <p className="text-[10px] text-[#645D75] mt-0.5">{task.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 5.2 }}
                      className="mt-6 text-center text-[10px] font-bold text-[#6D28D9] font-tech-landeros uppercase tracking-wider flex items-center justify-center gap-1.5"
                    >
                      <Zap className="w-3.5 h-3.5 fill-[#6D28D9]/20" />
                      All Pipeline Stages Completed In 45 Seconds.
                    </motion.div>
                  </motion.div>
                )}

                {/* 4. ONE-OPERATOR AUTOMATION STATE */}
                {activeTab === 3 && (
                  <motion.div
                    key="tab-operator"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4 }}
                    className="flex flex-col items-center justify-center w-full"
                  >
                    {/* The Center Operator Pulse visual */}
                    <div className="relative w-64 h-64 flex items-center justify-center mb-6">
                      
                      {/* Concentric glowing background circles */}
                      <div className="absolute w-60 h-60 rounded-full border border-[#311081]/5 bg-[#FCFBFE] animate-pulse" />
                      <div className="absolute w-44 h-44 rounded-full border border-[#6D28D9]/10 bg-[#F6F1FC]/30" />
                      <div className="absolute w-28 h-28 rounded-full bg-[#311081]/5 blur-md" />

                      {/* Moving lines running to nodes */}
                      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                        {[
                          { id: 1, cx: 32, cy: 32, label: "LENDERS" },
                          { id: 2, cx: 224, cy: 32, label: "OWNERS" },
                          { id: 3, cx: 32, cy: 224, label: "INSURANCE" },
                          { id: 4, cx: 224, cy: 224, label: "SUB-CONTRACTORS" },
                        ].map((node) => (
                          <g key={node.id}>
                            <motion.line
                              x1="128"
                              y1="128"
                              x2={node.cx}
                              y2={node.cy}
                              stroke="#6D28D9"
                              strokeWidth="1.5"
                              strokeDasharray="4 4"
                              initial={{ strokeDashoffset: 0 }}
                              animate={{ strokeDashoffset: -20 }}
                              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            />
                            <motion.circle
                              cx={node.cx}
                              cy={node.cy}
                              r="4"
                              fill="#6D28D9"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: node.id * 0.3 }}
                            />
                          </g>
                        ))}
                      </svg>

                      {/* Central Calm Operator Badge */}
                      <div className="relative w-20 h-20 rounded-full bg-[#311081] shadow-[0_8px_30px_rgba(49,16,129,0.3)] border-2 border-white flex flex-col items-center justify-center z-10 text-white">
                        <User className="w-8 h-8 stroke-[1.5]" />
                        <span className="text-[7px] font-bold uppercase tracking-widest mt-1 font-tech-landeros text-emerald-400">
                          CALM OP
                        </span>
                      </div>

                      {/* Node Labels */}
                      <span className="absolute left-[-10px] top-[15px] px-2.5 py-1 bg-white border border-[#311081]/10 rounded-xl font-tech-landeros text-[9px] font-bold text-[#311081] shadow-sm">
                        Lenders
                      </span>
                      <span className="absolute right-[-10px] top-[15px] px-2.5 py-1 bg-white border border-[#311081]/10 rounded-xl font-tech-landeros text-[9px] font-bold text-[#311081] shadow-sm">
                        Property Owners
                      </span>
                      <span className="absolute left-[-15px] bottom-[15px] px-2.5 py-1 bg-white border border-[#311081]/10 rounded-xl font-tech-landeros text-[9px] font-bold text-[#311081] shadow-sm">
                        Insurer Auditor
                      </span>
                      <span className="absolute right-[-15px] bottom-[15px] px-2.5 py-1 bg-white border border-[#311081]/10 rounded-xl font-tech-landeros text-[9px] font-bold text-[#311081] shadow-sm">
                        Subcontractors
                      </span>

                    </div>

                    {/* Operational Status */}
                    <div className="text-center">
                      <h4 className="font-tech-landeros text-base font-bold text-[#311081]">
                        1 CALM OPERATOR CONTROLLING EVERYTHING
                      </h4>
                      <p className="text-xs text-[#3C354D] font-semibold mt-1 max-w-md mx-auto">
                        Estimating, audits, task notifications, contract workflows, and lender draws are controlled from a single dashboard. No phone tag. No document chase.
                      </p>
                      
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 border border-emerald-500/10 text-emerald-700 font-bold uppercase tracking-wider text-[9px] rounded-full mt-4 font-tech-landeros">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Operation Pipeline: 100% Automated
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Window Footer Status (Pearl White LanderOS style) */}
            <div className="bg-[#FCFBFE] border-t border-[#311081]/5 px-6 py-4 flex items-center justify-between font-tech-landeros text-[10px] font-bold text-[#645D75]">
              <span>ACTIVE SESSION ID: BL_D2_SAAS</span>
              <span className="text-[#311081]/40 uppercase tracking-widest flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                Audit-Grade Compliant
              </span>
            </div>

          </motion.div>

        </div>
      </div>
    </section>
  );
};
