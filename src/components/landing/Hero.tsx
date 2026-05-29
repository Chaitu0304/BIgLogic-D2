import { useState, useEffect } from "react";
import { ArrowRight, Check, Play, Zap, FileText, BarChart3, ListTodo, Shield, User, Sparkles, Brain, Table, Cpu, Database, Workflow, Layers, FileSpreadsheet, TrendingUp, Network, Activity, Terminal, GitBranch, ShieldCheck } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { Cube3D } from "./Cube3D";


export const Hero = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [progress, setProgress] = useState(0);
  const [manualOverride, setManualOverride] = useState(false);

  const { scrollY } = useScroll();

  // Responsive flyaway scroll coordinates (exploding boundary cards)
  const yCardTopLeft = useTransform(scrollY, [0, 400], [0, -160]);
  const xCardTopLeft = useTransform(scrollY, [0, 400], [0, -200]);
  const rotCardTopLeft = useTransform(scrollY, [0, 400], [-8, -25]);
  const opCardTopLeft = useTransform(scrollY, [0, 260], [1, 0]);

  const yCardTopRight = useTransform(scrollY, [0, 400], [0, -160]);
  const xCardTopRight = useTransform(scrollY, [0, 400], [0, 200]);
  const rotCardTopRight = useTransform(scrollY, [0, 400], [8, 25]);
  const opCardTopRight = useTransform(scrollY, [0, 260], [1, 0]);

  const xCardMidLeft = useTransform(scrollY, [0, 400], [0, -240]);
  const rotCardMidLeft = useTransform(scrollY, [0, 400], [-5, -15]);
  const opCardMidLeft = useTransform(scrollY, [0, 260], [1, 0]);

  const xCardMidRight = useTransform(scrollY, [0, 400], [0, 240]);
  const rotCardMidRight = useTransform(scrollY, [0, 400], [5, 15]);
  const opCardMidRight = useTransform(scrollY, [0, 260], [1, 0]);

  const yCardBotLeft = useTransform(scrollY, [0, 400], [0, 160]);
  const xCardBotLeft = useTransform(scrollY, [0, 400], [0, -200]);
  const rotCardBotLeft = useTransform(scrollY, [0, 400], [-10, -30]);
  const opCardBotLeft = useTransform(scrollY, [0, 260], [1, 0]);

  const yCardBotRight = useTransform(scrollY, [0, 400], [0, 160]);
  const xCardBotRight = useTransform(scrollY, [0, 400], [0, 200]);
  const rotCardBotRight = useTransform(scrollY, [0, 400], [10, 30]);
  const opCardBotRight = useTransform(scrollY, [0, 260], [1, 0]);

  const scaleBg = useTransform(scrollY, [0, 450], [1, 1.15]);
  const opacityBg = useTransform(scrollY, [0, 300], [1, 0]);
  const ySketch = useTransform(scrollY, [0, 1000], [0, -150]);

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
    <section className="relative min-h-screen bg-[#F5F5F3] pt-36 pb-24 overflow-hidden border-b border-black/5 font-sans-landeros text-[#2A2A2A]">
      
      {/* 1. TACTILE WORKBENCH BACKDROP: Single compiled photorealistic background image */}
      <motion.div
        style={{
          scale: scaleBg,
          opacity: opacityBg,
        }}
        className="absolute top-0 left-0 right-0 h-[92vh] md:h-[100vh] lg:h-[106vh] xl:h-[112vh] z-0 pointer-events-none select-none overflow-hidden bg-[#F5F5F3]"
      >
        {/* Solid background and primary silver/pearl base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-[#F5F5F3] to-[#E2E2E0] z-0" />

        {/* LAYER 1: Studio Key Light (Top-Left soft white highlight) */}
        <div className="absolute top-[-20%] left-[-20%] w-[130%] h-[100%] bg-[radial-gradient(circle_at_15%_15%,_rgba(255,255,255,0.98)_0%,_transparent_65%)] pointer-events-none z-0" />

        {/* LAYER 2: Bright high-key center core vignette (Headline readable area) */}
        <div className="absolute top-[20%] left-[20%] right-[20%] bottom-[20%] bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.98)_0%,_rgba(255,255,255,0.5)_40%,_transparent_80%)] pointer-events-none z-0" />

        {/* LAYER 3: Ambient Vignette (Faint edge diffusion to keep edges slightly darker) */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_35%,_rgba(10,10,10,0.015)_70%,_rgba(10,10,10,0.05)_100%)] pointer-events-none z-0" />

        {/* LAYER 4: Top-Left soft occlusion shadow (Invoice & Push Pins) */}
        <div className="absolute top-[5%] left-[2%] w-[450px] h-[450px] bg-[radial-gradient(circle,_rgba(10,10,10,0.055)_0%,_transparent_75%)] blur-[120px] pointer-events-none z-0" />

        {/* LAYER 5: Top-Right soft occlusion shadow (Pink cursor & tokens) */}
        <div className="absolute top-[2%] right-[2%] w-[500px] h-[500px] bg-[radial-gradient(circle,_rgba(10,10,10,0.065)_0%,_transparent_75%)] blur-[140px] pointer-events-none z-0" />

        {/* LAYER 6: Mid-Left soft occlusion shadow (Mechanical tape measure & ruler) */}
        <div className="absolute top-[40%] left-[-5%] w-[400px] h-[400px] bg-[radial-gradient(circle,_rgba(10,10,10,0.05)_0%,_transparent_75%)] blur-[110px] pointer-events-none z-0" />

        {/* LAYER 7: Mid-Right soft occlusion shadow (Blueprint scroll & billing chat) */}
        <div className="absolute top-[35%] right-[-5%] w-[450px] h-[450px] bg-[radial-gradient(circle,_rgba(10,10,10,0.06)_0%,_transparent_75%)] blur-[130px] pointer-events-none z-0" />

        {/* LAYER 8: Bottom-Left soft occlusion shadow (Sticky notes & bulldog clips) */}
        <div className="absolute bottom-[-5%] left-[5%] w-[480px] h-[480px] bg-[radial-gradient(circle,_rgba(10,10,10,0.065)_0%,_transparent_70%)] blur-[150px] pointer-events-none z-0" />

        {/* LAYER 9: Bottom-Right soft occlusion shadow (Invoice & QuickBooks AP box) */}
        <div className="absolute bottom-[-8%] right-[5%] w-[520px] h-[520px] bg-[radial-gradient(circle,_rgba(10,10,10,0.07)_0%,_transparent_70%)] blur-[160px] pointer-events-none z-0" />

        {/* Compiled photo-realistic drafting workbench elements (multiply blended to show shadows underneath) */}
        <img
          src="/workbench_bg.png"
          alt="Drafting Workbench"
          className="w-full h-full object-cover object-top scale-[1.07] mix-blend-multiply z-10 relative"
        />

        {/* Central foggy depth layers overlay to guarantee ultra-high contrast for the main text block */}
        <div 
          className="absolute inset-0 z-20 pointer-events-none"
          style={{
            background: "radial-gradient(circle at center, rgba(255,255,255,0.92) 0%, rgba(255,255,255,0.3) 45%, rgba(255,255,255,0) 80%)"
          }}
        />

        {/* Smooth bottom linear fade to blend into the premium page body */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-b from-transparent to-[#F5F5F3] z-30" />
      </motion.div>

      {/* Retained Pencil Sketches beside the dashboard at z-10 behind the dashboard container */}
      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[20%] left-[-80px] lg:left-[-120px] w-[380px] h-[380px] lg:w-[600px] lg:h-[600px] pointer-events-none z-10 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_calculator_ruler.png"
          alt="Calculator and Ruler Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[17%] right-[-80px] lg:right-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-10 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_tape_measure.png"
          alt="Tape Measure Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>


      
      <div className="container relative z-10 mx-auto px-4 max-w-7xl">
        <div className="flex flex-col items-center text-center max-w-5xl mx-auto">
          
          {/* Centered Attention Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-8 shadow-sm"
          >
            <Sparkles className="w-4 h-4 text-[#0A0A0A]" />
            <span>99.8% AUDIT ACCURACY &bull; ATTN: U.S. RESTORATION CONTRACTORS</span>
          </motion.div>

          {/* Centered Satoshi Bold Headline */}
          <motion.h1 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-[4.2rem] font-black leading-[1.05] tracking-tight mb-8 font-display-landeros text-[#0A0A0A] max-w-4xl"
          >
            YOU DON’T NEED <br className="hidden sm:inline" />
            MORE <span className="underline decoration-black/30">OFFICE STAFF.</span>
          </motion.h1>

          {/* Centered Subheading */}
          <motion.p 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
            className="text-lg md:text-xl font-semibold leading-relaxed mb-4 max-w-3xl text-[#2A2A2A] z-20"
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
              className="btn-landeros-secondary h-14 px-8 text-xs md:text-sm flex items-center justify-center gap-2.5 font-bold shrink-0 w-full sm:w-auto border border-black/10 bg-white text-[#0A0A0A] group"
            >
               <Play className="w-3.5 h-3.5 fill-current text-[#0A0A0A] group-hover:scale-110 transition-transform duration-200 shrink-0" />
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
            className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 pt-2 mb-20 border-t border-black/5 w-full max-w-xl"
          >
            <div className="flex -space-x-2">
              {[
                "photo-1534528741775-53994a69daeb",
                "photo-1507003211169-0a1dd7228f2d",
                "photo-1494790108377-be9c29b29330",
                "photo-1500648767791-00dcc994a43e"
              ].map((id, i) => (
                <img
                  key={i}
                  className="inline-block h-8 w-8 rounded-full border border-white object-cover shadow-sm"
                  src={`https://images.unsplash.com/${id}?auto=format&fit=facearea&facepad=2&w=100&h=100&q=80`}
                  alt={`Active contractor ${i + 1}`}
                />
              ))}
            </div>
            <p className="text-xs md:text-sm font-semibold text-[#6B6B6B]">
              <span className="text-[#0A0A0A] font-bold">850+ U.S. Restoration Teams</span> Active &bull; <span className="text-[#0A0A0A] font-bold">45,000+ Hours Saved</span>
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
            className="w-full max-w-5xl border border-black/10 bg-white rounded-[32px] shadow-landeros-lg overflow-hidden relative z-20 flex flex-col scroll-mt-28"
          >
            {/* Window Top Bar (Glossy macOS style) */}
            <div className="bg-[#F8F8F8] border-b border-black/5 px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-full bg-[#FF5F56] border border-[#E0443E]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                <div className="w-3 h-3 rounded-full bg-[#FFBD2E] border border-[#DEA123]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                <div className="w-3 h-3 rounded-full bg-[#27C93F] border border-[#1AAB2F]/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]" />
                <span className="text-[10px] font-bold tracking-widest text-[#0A0A0A] uppercase ml-4 font-tech-landeros flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping inline-block" />
                  BIGlogic System Core v2.4 (Active)
                </span>
              </div>
              <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-500/15 rounded-full px-3 py-1.5 text-[9px] font-bold text-emerald-700 uppercase font-tech-landeros shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                Audited & Secured
              </div>
            </div>

            {/* Dashboard Tabs for Video Simulation (Tactile Spaced Buttons) */}
            <div className="grid grid-cols-2 md:grid-cols-4 bg-[#F5F5F3] border-b border-black/5 font-tech-landeros text-[11px] font-bold text-[#6B6B6B] p-2 gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl border transition-all duration-300 relative ${
                      isActive 
                        ? "bg-white text-[#0A0A0A] border-black/8 shadow-landeros font-extrabold scale-[1.01]" 
                        : "bg-[#F8F8F8]/40 border-transparent hover:bg-white/60 text-[#6B6B6B]/80 hover:text-[#0A0A0A]"
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 transition-transform duration-300 ${isActive ? "text-[#0A0A0A] scale-110" : "text-[#6B6B6B]/60"}`} />
                    <span className="truncate">{tab.label}</span>
                    {/* Animated Tab Progress Bar */}
                    {isActive && (
                      <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-black/[0.03] rounded-full overflow-hidden">
                        <motion.div
                          layoutId="tabProgress"
                          className="h-full bg-gradient-to-r from-emerald-500 to-[#0A0A0A]"
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
            <div className="p-8 md:p-12 min-h-[380px] md:min-h-[420px] bg-gradient-to-b from-white to-[#F5F5F3] relative flex flex-col justify-center overflow-hidden border-t border-black/5 bg-grid-premium">
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
                      <div className="w-48 h-60 border border-black/10 rounded-3xl bg-white flex flex-col items-center justify-center p-6 relative overflow-hidden group shadow-landeros">
                        
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
                          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_20px_4px_rgba(16,185,129,0.3)] z-10"
                        />

                        {/* Faux Document Header */}
                        <div className="absolute top-0 left-0 right-0 h-8 bg-[#F8F8F8] border-b border-black/5 px-4 flex items-center justify-between">
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400" />
                          <span className="text-[7px] font-bold text-[#6B6B6B] font-tech-landeros">ESTIMATE_PDF</span>
                        </div>

                        <FileText className="w-14 h-14 text-[#0A0A0A] mb-3 mt-4" />
                        <span className="font-tech-landeros text-[9px] font-bold text-black/70 truncate max-w-full text-center">
                          Estimate_Final_Xact.pdf
                        </span>
                        <span className="text-[8px] uppercase tracking-wider font-bold text-[#0A0A0A] bg-black/5 border border-black/10 px-2 py-0.5 rounded-full mt-2 font-tech-landeros">
                          Xactimate Source
                        </span>
                      </div>
                    </div>

                    {/* Right: Real-time Extraction Results */}
                    <div className="md:col-span-7 flex flex-col justify-center">
                      <div className="flex items-center gap-2 mb-4 font-tech-landeros text-xs font-bold text-[#0A0A0A]">
                        <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
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
                            className="flex items-center justify-between p-3.5 border border-black/8 bg-white/90 rounded-2xl shadow-sm hover:border-black/15 hover:shadow-landeros transition-all duration-300"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-5 h-5 rounded-full bg-emerald-50 border border-emerald-500/20 flex items-center justify-center shrink-0 text-white">
                                <Check className="w-3 h-3 text-emerald-600 stroke-[3.5]" />
                              </div>
                              <span className="text-xs font-bold text-[#0A0A0A] font-tech-landeros">{item.type}:</span>
                              <span className="text-xs font-semibold text-[#3A3A3A]">{item.label}</span>
                            </div>
                            <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-500/10 px-2 py-0.5 rounded-full font-tech-landeros">
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
                        <h4 className="text-sm font-bold text-[#0A0A0A] tracking-tight">LIVE PROJECT DRAW ANALYTICS</h4>
                        <p className="text-[10px] text-[#6B6B6B] font-semibold mt-0.5">Calculated automatically from extracted PDF coordinates.</p>
                      </div>
                      <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-500/20 px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                        Compliance Score: 99.8%
                      </div>
                    </div>

                    {/* Stats Rows */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                      {[
                        { title: "LENDER DRAWS UNLOCKED", value: "$45,200", detail: "Milestones 1 & 2 Approved", color: "from-[#0A0A0A] to-[#2A2A2A]" },
                        { title: "CARRIER DISCREPANCIES", value: "0", detail: "All Line Items Auditor-Approved", color: "from-emerald-600 to-teal-500" },
                        { title: "TOTAL SAVINGS", value: "$15,400", detail: "Avoided purchasing errors", color: "from-[#0A0A0A] to-[#6B6B6B]" },
                      ].map((card, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: i * 0.15 }}
                          className="bg-white border border-black/8 p-5 rounded-2xl flex flex-col justify-between shadow-sm hover:border-black/15 transition-all duration-300 relative overflow-hidden"
                        >
                          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-black/5 to-transparent rounded-full pointer-events-none" />
                          <span className="text-[9px] font-bold text-[#6B6B6B] tracking-wider font-tech-landeros uppercase">{card.title}</span>
                          <span className={`text-2xl font-black bg-gradient-to-r ${card.color} bg-clip-text text-transparent my-2 font-display-landeros`}>
                            {card.value}
                          </span>
                          <span className="text-[9px] font-bold text-[#3A3A3A] font-tech-landeros">{card.detail}</span>
                        </motion.div>
                      ))}
                    </div>

                    {/* Mini Sparkline Chart */}
                    <div className="border border-black/8 bg-white p-5 rounded-2xl shadow-sm h-36 flex flex-col justify-between relative overflow-hidden">
                      <span className="text-[9px] font-bold text-[#6B6B6B] font-tech-landeros uppercase tracking-wider">PROJECT CASH VELOCITY</span>
                      
                      {/* SVG Line Drawing Path with Framer Motion */}
                      <div className="h-16 w-full relative">
                        <svg className="w-full h-full" viewBox="0 0 500 60" preserveAspectRatio="none">
                          <motion.path
                            d="M0,50 Q60,35 120,45 T240,15 T360,25 T480,5"
                            fill="none"
                            stroke="#0A0A0A"
                            strokeWidth="3"
                            strokeLinecap="round"
                            initial={{ pathLength: 0 }}
                            animate={{ pathLength: 1 }}
                            transition={{ duration: 1.5, ease: "easeInOut" }}
                          />
                          <motion.path
                            d="M0,50 Q60,35 120,45 T240,15 T360,25 T480,5 L480,60 L0,60 Z"
                            fill="url(#gradient-chart)"
                            opacity="0.06"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.06 }}
                            transition={{ duration: 1 }}
                          />
                          <defs>
                            <linearGradient id="gradient-chart" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#10B981" />
                              <stop offset="100%" stopColor="#FFFFFF" />
                            </linearGradient>
                          </defs>
                        </svg>
                        
                        {/* Glowing dot on the peak with concentric rings */}
                        <div className="absolute right-4 top-0 w-3 h-3 flex items-center justify-center">
                          <motion.div
                            animate={{ scale: [1, 2.2, 1], opacity: [0.6, 0, 0.6] }}
                            transition={{ repeat: Infinity, duration: 1.8 }}
                            className="absolute w-6 h-6 bg-emerald-400 rounded-full"
                          />
                          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white shadow shadow-emerald-500/50 relative z-10" />
                        </div>
                      </div>

                      <div className="flex justify-between items-center text-[9px] font-bold text-[#6B6B6B] font-tech-landeros">
                        <span>WEEK 1 (UPLOAD)</span>
                        <span>WEEK 2 (AUDITED)</span>
                        <span className="text-emerald-600">WEEK 3 (FUNDED)</span>
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
                    <div className="flex items-center gap-2 mb-6 font-tech-landeros text-xs font-bold text-[#0A0A0A]">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0A0A0A] animate-ping" />
                      <span>AI WORKFLOW MANAGER EXECUTING IN BACKGROUND:</span>
                    </div>

                    <div className="space-y-3 font-sans-landeros">
                      {[
                        { step: 1, label: "Scanning Xactimate PDF structural lines", desc: "Isolating material schedules and unit pricing counts.", delay: 0.2 },
                        { step: 2, label: "Mapping milestone payouts", desc: "Draw milestones structured to meet banking tolerances.", delay: 1.4 },
                        { step: 3, label: "Auditing line codes", desc: "Flagged 0 errors, protecting payouts from carrier delays.", delay: 2.6 },
                        { step: 4, label: "Compiling delivery packages", desc: "Structured excel lists ready to download in 1 click.", delay: 3.8 },
                      ].map((task) => (
                        <motion.div
                          key={task.step}
                          initial={{ opacity: 0, y: 15 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.5, delay: task.delay }}
                          className="flex gap-4 p-4 border border-black/8 bg-white rounded-2xl shadow-sm hover:border-black/15 hover:shadow-landeros transition-all duration-300"
                        >
                          <div className="relative flex items-center justify-center shrink-0">
                            {/* Animated Loading Circle changing to Checkmark */}
                            <motion.div
                              className="w-6 h-6 rounded-full border-2 border-emerald-200 flex items-center justify-center"
                              initial={{ borderColor: "rgba(16, 185, 129, 0.2)" }}
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
                            <h5 className="font-tech-landeros text-sm font-bold text-[#0A0A0A] mb-0.5">{task.label}</h5>
                            <p className="text-xs text-[#6B6B6B] font-semibold">{task.desc}</p>
                          </div>
                        </motion.div>
                      ))}
                    </div>
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
                      <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.05, 0.3] }}
                        transition={{ repeat: Infinity, duration: 4 }}
                        className="absolute w-60 h-60 rounded-full border-2 border-emerald-500/10 bg-emerald-500/[0.01]" 
                      />
                      <div className="absolute w-44 h-44 rounded-full border border-black/10 bg-black/[0.01]" />
                      <div className="absolute w-28 h-28 rounded-full bg-emerald-500/5 blur-md" />

                      {/* Moving lines running to nodes */}
                      <svg className="absolute inset-0 w-full h-full overflow-visible pointer-events-none">
                        {[
                          { id: 1, cx: 32, cy: 32 },
                          { id: 2, cx: 224, cy: 32 },
                          { id: 3, cx: 32, cy: 224 },
                          { id: 4, cx: 224, cy: 224 },
                        ].map((node) => (
                          <g key={node.id}>
                            <motion.line
                              x1="128"
                              y1="128"
                              x2={node.cx}
                              y2={node.cy}
                              stroke="#10B981"
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
                              fill="#10B981"
                              animate={{ scale: [1, 1.5, 1] }}
                              transition={{ repeat: Infinity, duration: 1.5, delay: node.id * 0.3 }}
                            />
                          </g>
                        ))}
                      </svg>

                      {/* Central Calm Operator Badge */}
                      <div className="relative w-20 h-20 rounded-full bg-[#0A0A0A] shadow-[0_8px_30px_rgba(16,185,129,0.25)] border-2 border-emerald-500 flex flex-col items-center justify-center z-10 text-white animate-pulse">
                        <User className="w-8 h-8 stroke-[1.5] text-emerald-400" />
                        <span className="text-[7px] font-bold uppercase tracking-widest mt-1 font-tech-landeros text-emerald-400">
                          CALM OP
                        </span>
                      </div>

                      {/* Node Labels (Premium Glass Capsules) */}
                      <span className="absolute left-[-20px] top-[15px] px-3.5 py-1.5 bg-white/95 border border-black/8 rounded-full font-tech-landeros text-[9px] font-bold text-[#0A0A0A] shadow-sm hover:border-black/15 transition-all">
                        Lenders
                      </span>
                      <span className="absolute right-[-20px] top-[15px] px-3.5 py-1.5 bg-white/95 border border-black/8 rounded-full font-tech-landeros text-[9px] font-bold text-[#0A0A0A] shadow-sm hover:border-black/15 transition-all">
                        Property Owners
                      </span>
                      <span className="absolute left-[-25px] bottom-[15px] px-3.5 py-1.5 bg-white/95 border border-black/8 rounded-full font-tech-landeros text-[9px] font-bold text-[#0A0A0A] shadow-sm hover:border-black/15 transition-all">
                        Insurer Auditor
                      </span>
                      <span className="absolute right-[-25px] bottom-[15px] px-3.5 py-1.5 bg-white/95 border border-black/8 rounded-full font-tech-landeros text-[9px] font-bold text-[#0A0A0A] shadow-sm hover:border-black/15 transition-all">
                        Subcontractors
                      </span>

                    </div>

                    {/* Operational Status */}
                    <div className="text-center">
                      <h4 className="font-tech-landeros text-base font-bold text-[#0A0A0A] tracking-tight">
                        1 CALM OPERATOR CONTROLLING EVERYTHING
                      </h4>
                      <p className="text-xs text-[#6B6B6B] font-semibold mt-1 max-w-md mx-auto">
                        Estimating, audits, task notifications, contract workflows, and lender draws are controlled from a single dashboard. No phone tag. No document chase.
                      </p>
                      
                      <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 border border-emerald-500/10 text-emerald-700 font-bold uppercase tracking-wider text-[9px] rounded-full mt-4 font-tech-landeros shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Operation Pipeline: 100% Automated
                      </div>
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

            {/* Window Footer Status (Pearl White LanderOS style) */}
            <div className="bg-[#F8F8F8] border-t border-black/5 px-6 py-4 flex items-center justify-between font-tech-landeros text-[10px] font-bold text-[#6B6B6B]">
              <span>ACTIVE SESSION ID: BL_D2_SAAS</span>
              <span className="text-black/40 uppercase tracking-widest flex items-center gap-1.5">
                <Check className="w-3.5 h-3.5 text-emerald-500 stroke-[3]" />
                Audit-Grade Compliant
              </span>
            </div>

          </motion.div>

        </div>
      </div>

      {/* Ecosystem Integrations Ribbon (Premium Luxury Silver & Charcoal Blueprint) */}
      <div className="border-y-2 border-double border-black/10 bg-gradient-to-b from-[#FFFFFF] to-[#F8F8F9] py-16 mt-24 relative z-10 w-full overflow-hidden bg-grid-landeros">
        
        {/* Dynamic Stylesheet for Blueprint patterns & Animations */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            display: flex;
            width: max-content;
            animation: marquee 38s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
          .blueprint-grid-pattern {
            background-size: 12px 12px;
            background-image: 
              linear-gradient(to right, rgba(255, 255, 255, 0.04) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(255, 255, 255, 0.04) 1px, transparent 1px);
          }
          .draft-grid-pattern {
            background-size: 20px 20px;
            background-image: 
              linear-gradient(to right, rgba(0, 0, 0, 0.015) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 0, 0, 0.015) 1px, transparent 1px);
          }
          .group:hover .group-hover-white-override {
            color: #ffffff !important;
          }
          .group:hover svg {
            color: #ffffff !important;
            stroke: #ffffff !important;
          }
        `}} />

        {/* Top Architectural Ruler Line & Repeating Ticks */}
        <div className="absolute top-0 left-0 right-0 h-3 border-b border-black/5 overflow-hidden select-none pointer-events-none opacity-30">
          <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:8px_100%]" />
        </div>
        
        {/* Top Ruler Coordinates */}
        <div className="absolute top-3 left-0 right-0 h-4 flex items-center justify-between px-8 select-none pointer-events-none opacity-45 font-mono text-[6px] text-black/50 uppercase tracking-widest">
          <span>[COORD: 0.00mm]</span>
          <span className="hidden md:inline">----------------- SECURE SYNC CHANNEL (PLANE 01) -----------------</span>
          <span>[COORD: 100.00mm]</span>
          <span className="hidden md:inline">----------------- 2-WAY CONNECTOR ENGINE -----------------</span>
          <span>[COORD: 200.00mm]</span>
        </div>

        {/* Technical Corner Brackets / Crosshairs for Drafting Blueprint Sheet */}
        <div className="absolute top-6 left-6 w-3 h-3 border-t border-l border-black/20 pointer-events-none select-none" />
        <div className="absolute top-6 right-6 w-3 h-3 border-t border-r border-black/20 pointer-events-none select-none" />
        <div className="absolute bottom-6 left-6 w-3 h-3 border-b border-l border-black/20 pointer-events-none select-none" />
        <div className="absolute bottom-6 right-6 w-3 h-3 border-b border-r border-black/20 pointer-events-none select-none" />

        {/* Visual Drawing Drafting Tape at Corners (Frosted glass luxury details) */}
        <div className="absolute top-4 left-4 w-12 h-3.5 bg-white/40 backdrop-blur-sm border border-black/5 -rotate-12 shadow-sm rounded-sm opacity-55 pointer-events-none" />
        <div className="absolute top-4 right-4 w-12 h-3.5 bg-white/40 backdrop-blur-sm border border-black/5 rotate-12 shadow-sm rounded-sm opacity-55 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-12 h-3.5 bg-white/40 backdrop-blur-sm border border-black/5 rotate-12 shadow-sm rounded-sm opacity-55 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-12 h-3.5 bg-white/40 backdrop-blur-sm border border-black/5 -rotate-12 shadow-sm rounded-sm opacity-55 pointer-events-none" />

        {/* Blueprint Title Block (Architectural Style Stamp at Bottom Right) */}
        <div className="hidden lg:flex absolute right-8 bottom-6 border border-black/10 bg-white/90 backdrop-blur-sm p-3 rounded-lg flex-col gap-1.5 z-20 font-mono text-[7px] text-black/55 select-none shadow-[0_4px_12px_rgba(0,0,0,0.02)] uppercase tracking-wide">
          <div className="border-b border-black/10 pb-1 font-bold text-black/80 flex items-center justify-between gap-6">
            <span className="tracking-widest">SYSTEM CONNECTIONS</span>
            <span className="text-black font-black">v2.8-CORE</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>DRAWING SCHEMATIC:</span>
            <span className="font-bold text-black/80">BL-D2-INT-88</span>
          </div>
          <div className="flex justify-between gap-6">
            <span>PIPELINE ENGINE:</span>
            <span className="font-bold text-black">REAL-TIME SYNC</span>
          </div>
          <div className="flex justify-between gap-6 border-t border-black/10 pt-1.5 font-tech-landeros text-[8px] font-black text-black">
            <span>APPROVED STAMP:</span>
            <span>LANDEROS QA PASSED</span>
          </div>
        </div>

        {/* Central Blueprint Details Text block */}
        <div className="max-w-3xl mx-auto px-4 text-center mb-10 relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border-2 border-double border-black/10 text-black font-tech-landeros text-[9px] font-black uppercase tracking-wider rounded-md mb-4 shadow-[0_2px_4px_rgba(0,0,0,0.02)]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Ecosystem Integrations
          </div>
          <h3 className="font-display-landeros text-2xl md:text-3xl font-black text-black leading-tight tracking-tight uppercase">
            NATIVE CONNECTIONS &amp; WORKFLOW INTEGRATIONS
          </h3>
          <p className="font-tech-landeros text-[9px] font-bold text-[#6B6B6B] tracking-widest uppercase mt-2.5">
            Syncing Estimate Data, Insurer Files, and Draws Across Your Business Stack
          </p>
        </div>

        {/* Sliding Marquee Track */}
        <div className="relative w-full overflow-hidden py-4 select-none pointer-events-auto z-10">
          {/* Gradient Overlays for Soft Fade on Edges */}
          <div className="absolute top-0 bottom-0 left-0 w-36 bg-gradient-to-r from-white via-white/70 to-transparent z-20 pointer-events-none" />
          <div className="absolute top-0 bottom-0 right-0 w-36 bg-gradient-to-l from-white via-white/70 to-transparent z-20 pointer-events-none" />

          <div className="animate-marquee gap-6 flex items-center">
            {/* Duplicated set for seamless loop scrolling */}
            {Array(2).fill(null).map((_, groupIdx) => {
              const integrationsList = [
                {
                  name: "QuickBooks",
                  sub: "DIRECT LEDGER SYNC",
                  tech: "NATIVE REST API v4",
                  iconType: "text",
                  textVal: "qb",
                  accent: "#0A0A0A",
                },
                {
                  name: "Xactimate",
                  sub: "ESX ESTIMATE PARSER",
                  tech: "PROPRIETARY COMPILER",
                  icon: Layers,
                  iconType: "lucide",
                  accent: "#0A0A0A",
                },
                {
                  name: "PROCORE",
                  sub: "CONSTRUCTION HUB",
                  tech: "2-WAY PARTNER CONNECT",
                  icon: Workflow,
                  iconType: "lucide",
                  accent: "#0A0A0A",
                },
                {
                  name: "DocuSign",
                  sub: "SECURE DRAW SIGNING",
                  tech: "ENVELOPE WEBHOOK v2.1",
                  icon: FileText,
                  iconType: "lucide",
                  accent: "#0A0A0A",
                },
                {
                  name: "stripe",
                  sub: "PAYOUT GATEWAY",
                  tech: "PCI COMPLIANT SDK",
                  icon: Zap,
                  iconType: "lucide",
                  accent: "#0A0A0A",
                },
                {
                  name: "LanderOS",
                  sub: "COORDINATING CORE",
                  tech: "GEMINI MULTI-AGENT",
                  icon: Brain,
                  iconType: "lucide",
                  accent: "#0A0A0A",
                }
              ];

              return (
                <div key={groupIdx} className="flex items-center gap-6 shrink-0">
                  {integrationsList.map((item, index) => {
                    const Icon = item.icon;
                    return (
                      <div 
                        key={index}
                        className="bg-white border-2 border-double border-black/10 hover:border-transparent px-5 py-3 rounded-2xl flex items-center gap-3.5 transition-all duration-500 hover:shadow-[0_12px_28px_rgba(0,0,0,0.08)] hover:-translate-y-1 cursor-pointer shadow-sm relative overflow-hidden group w-[250px] md:w-[270px]"
                      >
                        {/* Draft Grid underlay */}
                        <div className="absolute inset-0 draft-grid-pattern opacity-[0.03] pointer-events-none" />

                        {/* Blueprint Metamorphosis (Hover State Background - Premium Charcoal Blackout) */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-all duration-500 bg-gradient-to-br from-[#0F0F0F] via-[#1A1A1A] to-[#262626] border border-black pointer-events-none z-0" />
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-10 blueprint-grid-pattern pointer-events-none z-0 transition-opacity duration-500" />
                        
                        {/* Tiny dimension marking */}
                        <span className="font-mono text-[5px] text-black/40 group-hover:text-white/40 absolute top-1 right-2.5 transition-colors duration-300">
                          [ {item.tech} ]
                        </span>

                        {/* Technical compass circle decoration at back */}
                        <div className="absolute -right-6 -bottom-6 w-14 h-14 rounded-full border border-black/5 group-hover:border-white/10 transition-colors duration-500 pointer-events-none flex items-center justify-center">
                          <div className="w-8 h-8 rounded-full border border-dashed border-black/5 group-hover:border-white/5" />
                        </div>

                        {/* Icon Frame */}
                        <div className="relative z-10 w-9 h-9 rounded-xl border border-black/10 bg-[#F8F8F8] flex items-center justify-center shadow-sm transition-all duration-500 group-hover:bg-white/10 group-hover:border-white/30 group-hover:shadow-[0_0_12px_rgba(255,255,255,0.15)] group-hover:scale-105">
                          {/* Tiny corner crosshairs */}
                          <span className="absolute -top-0.5 -left-0.5 text-[5px] text-black/30 group-hover:text-white/50 select-none font-sans">+</span>
                          <span className="absolute -top-0.5 -right-0.5 text-[5px] text-black/30 group-hover:text-white/50 select-none font-sans">+</span>
                          <span className="absolute -bottom-0.5 -left-0.5 text-[5px] text-black/30 group-hover:text-white/50 select-none font-sans">+</span>
                          <span className="absolute -bottom-0.5 -right-0.5 text-[5px] text-black/30 group-hover:text-white/50 select-none font-sans">+</span>

                          {item.iconType === "text" ? (
                            <span 
                              className="font-display-landeros text-xs font-black tracking-tighter transition-all duration-300 group-hover-white-override"
                              style={{ color: item.accent }}
                            >
                              {item.textVal}
                            </span>
                          ) : (
                            Icon && <Icon 
                              className="w-4.5 h-4.5 transition-all duration-300 stroke-[2.2]" 
                              style={{ color: item.accent }}
                            />
                          )}
                        </div>

                        {/* Text block */}
                        <div className="flex flex-col relative z-10 select-none">
                          <span className="font-tech-landeros text-[7px] font-black tracking-widest text-[#8E8E8E] group-hover:text-[#D9D9D9] transition-colors duration-300 uppercase">
                            {item.sub}
                          </span>
                          <span className="font-display-landeros text-xs font-black text-black group-hover:text-white transition-colors duration-300 tracking-tight flex items-center gap-1.5 mt-0.5 uppercase">
                            {item.name}
                            <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse inline-block" />
                          </span>
                        </div>

                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom Architectural Ruler Line & Repeating Ticks */}
        <div className="absolute bottom-0 left-0 right-0 h-3 border-t border-black/5 overflow-hidden select-none pointer-events-none opacity-30">
          <div className="w-full h-full bg-[linear-gradient(to_right,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:8px_100%]" />
        </div>
      </div>
    </section>
  );
};
