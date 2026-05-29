import { useState, useRef } from "react";
import { BarChart2, ShieldX, ShieldCheck, HelpCircle, Sparkles, Zap, ArrowUpRight } from "lucide-react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { ScrollReveal } from "../ui/ScrollReveal";

export const WhyBigLogic = () => {
  const [activeTab, setActiveTab] = useState<"admin" | "velocity">("admin");
  const [hoveredNode, setHoveredNode] = useState<{ chartId: string; pointIdx: number } | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const ySketch = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  // Tab 1: Grounded, Realistic Administrative Time & Cost Data (At 50 monthly claims)
  const adminCharts = [
    {
      id: "estimate-cost",
      title: "CUMULATIVE ESTIMATING OVERHEAD",
      yLabels: ["$6.0K", "$4.0K", "$2.0K", "$0"],
      yTicks: [30, 78, 126, 175], // Y-coordinates corresponding to gridlines
      xAxisLabel: "Monthly Claims",
      
      // Points represent intervals: 10 projects, 30 projects, 50 projects
      points: [
        {
          volume: 10,
          x: 105,
          manualVal: "$1,200",
          manualY: 146,
          biglogicVal: "$150",
          biglogicY: 171.4,
          savings: "$1,050 Saved"
        },
        {
          volume: 30,
          x: 225,
          manualVal: "$3,600",
          manualY: 88,
          biglogicVal: "$450",
          biglogicY: 164.2,
          savings: "$3,150 Saved"
        },
        {
          volume: 50,
          x: 345,
          manualVal: "$6,000",
          manualY: 30,
          biglogicVal: "$750",
          biglogicY: 157.0,
          savings: "$5,250 Saved"
        }
      ],
      // Cubic bezier paths for Sensex style graphs (climbing from origin 175)
      // Manual curve climbs to $6,000 (Y=30)
      manualPath: "M 45 175 C 100 156.8, 220 98.4, 345 30",
      manualArea: "M 45 175 C 100 156.8, 220 98.4, 345 30 L 345 175 L 45 175 Z",
      
      // BIGlogic curve climbs to $750 (Y=157.0)
      biglogicPath: "M 45 175 C 100 172.3, 220 166.9, 345 157",
      biglogicArea: "M 45 175 C 100 172.3, 220 166.9, 345 157 L 345 175 L 45 175 Z",
      
      // End point label positions (x=345)
      manualEndY: 30,
      manualEndLabel: "MANUAL: $6,000/mo",
      biglogicEndY: 157,
      biglogicEndLabel: "BIGlogic: $750/mo",
      
      multiplier: "8x Overhead Savings",
      subText: "Manual labor requires hiring full-time scheduling admin staff vs. flat software pricing.",
      metricUnit: "Cost"
    },
    {
      id: "processing-speed",
      title: "CUMULATIVE LABOR HOURS",
      yLabels: ["150h", "100h", "50h", "0h"],
      yTicks: [30, 78, 126, 175],
      xAxisLabel: "Monthly Claims",
      points: [
        {
          volume: 10,
          x: 105,
          manualVal: "30 Hours",
          manualY: 146,
          biglogicVal: "2.5 Hours",
          biglogicY: 172.6,
          savings: "27.5 Hours Saved"
        },
        {
          volume: 30,
          x: 225,
          manualVal: "90 Hours",
          manualY: 88,
          biglogicVal: "7.5 Hours",
          biglogicY: 167.8,
          savings: "82.5 Hours Saved"
        },
        {
          volume: 50,
          x: 345,
          manualVal: "150 Hours",
          manualY: 30,
          biglogicVal: "12.5 Hours",
          biglogicY: 163.0,
          savings: "137.5 Hours Saved"
        }
      ],
      manualPath: "M 45 175 C 100 156.8, 220 98.4, 345 30",
      manualArea: "M 45 175 C 100 156.8, 220 98.4, 345 30 L 345 175 L 45 175 Z",
      biglogicPath: "M 45 175 C 100 173.0, 220 169.0, 345 163",
      biglogicArea: "M 45 175 C 100 173.0, 220 169.0, 345 163 L 345 175 L 45 175 Z",
      
      manualEndY: 30,
      manualEndLabel: "MANUAL: 150 Hrs",
      biglogicEndY: 163,
      biglogicEndLabel: "BIGlogic: 12.5 Hrs",
      
      multiplier: "12x Speedup",
      subText: "Estimators manual copying & spec writing vs. fast AI extraction with human audit review.",
      metricUnit: "Labor"
    }
  ];

  // Tab 2: Grounded, Realistic Capital Velocity & Dispute Rate Data
  const velocityCharts = [
    {
      id: "draw-cycles",
      title: "AVERAGE CYCLE RELEASE TIME",
      yLabels: ["30 days", "20 days", "10 days", "0 days"],
      yTicks: [30, 78, 126, 175],
      xAxisLabel: "Outstanding Claims",
      points: [
        {
          volume: 10,
          x: 105,
          manualVal: "30 Days Avg",
          manualY: 30,
          biglogicVal: "5 Days Avg",
          biglogicY: 151,
          savings: "25 Days Accelerated"
        },
        {
          volume: 30,
          x: 225,
          manualVal: "30 Days Avg",
          manualY: 30,
          biglogicVal: "5 Days Avg",
          biglogicY: 151,
          savings: "25 Days Accelerated"
        },
        {
          volume: 50,
          x: 345,
          manualVal: "30 Days Avg",
          manualY: 30,
          biglogicVal: "5 Days Avg",
          biglogicY: 151,
          savings: "25 Days Accelerated"
        }
      ],
      // For average cycles, the time is constant as volume scales (flat horizontal lines showing performance limits)
      manualPath: "M 45 30 L 345 30",
      manualArea: "M 45 30 L 345 30 L 345 175 L 45 175 Z",
      biglogicPath: "M 45 151 L 345 151",
      biglogicArea: "M 45 151 L 345 151 L 345 175 L 45 175 Z",
      
      manualEndY: 30,
      manualEndLabel: "MANUAL: 30d delay",
      biglogicEndY: 151,
      biglogicEndLabel: "BIGlogic: 5d release",
      
      multiplier: "6x Faster Funding",
      subText: "Weeks of lender disputes vs. pre-formatted, pre-audited draw milestone release packages.",
      metricUnit: "Days"
    },
    {
      id: "dispute-rates",
      title: "INSURER AUDIT DISPUTE RATES",
      yLabels: ["20%", "13%", "7%", "0%"],
      yTicks: [30, 78, 126, 175],
      xAxisLabel: "Claims Audited",
      points: [
        {
          volume: 10,
          x: 105,
          manualVal: "20% Disputes",
          manualY: 30,
          biglogicVal: "2% Disputes",
          biglogicY: 160.5,
          savings: "90% Dispute Reduction"
        },
        {
          volume: 30,
          x: 225,
          manualVal: "20% Disputes",
          manualY: 30,
          biglogicVal: "2% Disputes",
          biglogicY: 160.5,
          savings: "90% Dispute Reduction"
        },
        {
          volume: 50,
          x: 345,
          manualVal: "20% Disputes",
          manualY: 30,
          biglogicVal: "2% Disputes",
          biglogicY: 160.5,
          savings: "90% Dispute Reduction"
        }
      ],
      // Rate is constant across claims audited (average performance percentages)
      manualPath: "M 45 30 L 345 30",
      manualArea: "M 45 30 L 345 30 L 345 175 L 45 175 Z",
      biglogicPath: "M 45 160.5 L 345 160.5",
      biglogicArea: "M 45 160.5 L 345 160.5 L 345 175 L 45 175 Z",
      
      manualEndY: 30,
      manualEndLabel: "MANUAL: 20% Disputes",
      biglogicEndY: 160.5,
      biglogicEndLabel: "BIGlogic: 2% Disputes",
      
      multiplier: "90% Dispute Reduction",
      subText: "Standard manual violates formatting guidelines vs. instant platform compliance matching.",
      metricUnit: "Disputes"
    }
  ];

  const currentCharts = activeTab === "admin" ? adminCharts : velocityCharts;

  return (
    <section ref={sectionRef} id="why-us" className="py-24 bg-premium-luxury-gradient bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-black/3 to-transparent rounded-full blur-[120px] pointer-events-none" />
 
      <div className="container mx-auto px-4 max-w-7xl relative z-10 text-center">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={100} className="max-w-4xl text-left mb-16 mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F0F0] border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6 shadow-sm">
            <BarChart2 className="w-4 h-4 text-[#0A0A0A] fill-black/5" />
            <span>THE SENSEX CAPITAL VELOCITY PROJECTION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            The Reconstruction Math. <br />
            Continuous Growth <span className="text-[#6B6B6B]">vs.</span> Stagnant Costs.
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#6B6B6B] max-w-2xl leading-relaxed">
            Restoration economics scale with project volume. These Sensex-style trendlines track resource friction as monthly claims climb from 0 to 50 projects based on real-world industry benchmarks.
          </p>
        </ScrollReveal>

        {/* Tab switcher capsule */}
        <ScrollReveal direction="up" delay={150}>
          <div className="inline-flex items-center gap-2 p-1.5 bg-[#F0F0F0] border border-black/10 rounded-full mb-16 shadow-inner">
            <button
              onClick={() => setActiveTab("admin")}
              className={`px-6 py-2.5 rounded-full text-xs font-bold font-tech-landeros uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === "admin"
                  ? "bg-[#0A0A0A] text-white shadow-md"
                  : "text-[#6B6B6B] hover:text-[#0A0A0A]"
              }`}
            >
              <Zap className="w-3.5 h-3.5 fill-current text-current" />
              Administrative Overhead
            </button>
            <button
              onClick={() => setActiveTab("velocity")}
              className={`px-6 py-2.5 rounded-full text-xs font-bold font-tech-landeros uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                activeTab === "velocity"
                  ? "bg-[#0A0A0A] text-white shadow-md"
                  : "text-[#6B6B6B] hover:text-[#0A0A0A]"
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 fill-current text-current" />
              Capital Velocity & Risk
            </button>
          </div>
        </ScrollReveal>

        {/* Dynamic Sensex Line Charts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-16 items-stretch text-left">
          <AnimatePresence mode="wait">
            {currentCharts.map((chart) => (
              <motion.div
                key={chart.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="bg-white border border-black/8 rounded-[32px] p-6 shadow-sm hover:shadow-md hover:border-black/15 transition-all duration-300 flex flex-col justify-between relative hover-premium-card"
              >
                {/* Custom Area & Line Gradients & Drop Shadows */}
                <svg width="0" height="0" className="absolute">
                  <defs>
                    {/* Red Line and Area (Chaos) */}
                    <linearGradient id="redLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#EF4444" />
                      <stop offset="100%" stopColor="#B91C1C" />
                    </linearGradient>
                    <linearGradient id="redAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#EF4444" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#EF4444" stopOpacity="0.01" />
                    </linearGradient>

                    {/* Emerald Line and Area (Calm/BIGlogic) */}
                    <linearGradient id="emeraldLineGrad" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#34D399" />
                      <stop offset="100%" stopColor="#059669" />
                    </linearGradient>
                    <linearGradient id="emeraldAreaGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10B981" stopOpacity="0.2" />
                      <stop offset="100%" stopColor="#10B981" stopOpacity="0.01" />
                    </linearGradient>

                    {/* Drop shadow glow */}
                    <filter id="shadowGlow" x="-10%" y="-10%" width="120%" height="120%">
                      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#10B981" floodOpacity="0.15" />
                    </filter>
                  </defs>
                </svg>

                <div>
                  {/* Chart Title & Multiplier Badge */}
                  <div className="flex justify-between items-start gap-4 mb-6">
                    <h3 className="font-tech-landeros text-xs font-bold text-[#6B6B6B] tracking-wider uppercase">
                      {chart.title}
                    </h3>
                    <span className="px-2.5 py-1 rounded bg-emerald-50 border border-emerald-500/10 text-emerald-600 text-[10px] font-black uppercase tracking-wider font-tech-landeros shadow-sm">
                      {chart.multiplier}
                    </span>
                  </div>

                  {/* SVG Chart Canvas */}
                  <div className="relative w-full h-[220px] bg-slate-50/50 border border-black/5 rounded-2xl overflow-visible p-2">
                    <svg
                      viewBox="0 0 360 220"
                      width="100%"
                      height="100%"
                      className="overflow-visible"
                    >
                      {/* Gridlines */}
                      {chart.yTicks.map((yVal, i) => (
                        <g key={i}>
                          <line
                            x1="45"
                            y1={yVal}
                            x2="345"
                            y2={yVal}
                            stroke="rgba(0,0,0,0.06)"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                          />
                          {/* Y-Axis labels */}
                          <text
                            x="35"
                            y={yVal + 3.5}
                            textAnchor="end"
                            className="font-tech-landeros text-[9px] font-bold fill-neutral-400"
                          >
                            {chart.yLabels[i]}
                          </text>
                        </g>
                      ))}

                      {/* X-Axis bottom base line */}
                      <line
                        x1="45"
                        y1="175"
                        x2="345"
                        y2="175"
                        stroke="rgba(0,0,0,0.15)"
                        strokeWidth="1.5"
                      />

                      {/* X-Axis Labels (Interval volume milestones) */}
                      <text
                        x="45"
                        y="198"
                        textAnchor="middle"
                        className="font-tech-landeros text-[9px] font-bold fill-neutral-400"
                      >
                        0
                      </text>
                      <text
                        x="105"
                        y="198"
                        textAnchor="middle"
                        className="font-tech-landeros text-[9px] font-bold fill-neutral-400"
                      >
                        10
                      </text>
                      <text
                        x="225"
                        y="198"
                        textAnchor="middle"
                        className="font-tech-landeros text-[9px] font-bold fill-neutral-400"
                      >
                        30
                      </text>
                      <text
                        x="345"
                        y="198"
                        textAnchor="middle"
                        className="font-tech-landeros text-[9px] font-bold fill-neutral-400"
                      >
                        50 Projects
                      </text>

                      {/* ==================== THE CHAOS (RED) SHADED AREA AND LINE ==================== */}
                      {/* Animated Area Fill */}
                      <motion.path
                        d={chart.manualArea}
                        fill="url(#redAreaGrad)"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1 }}
                      />
                      {/* Animated Trend Line */}
                      <motion.path
                        d={chart.manualPath}
                        fill="none"
                        stroke="url(#redLineGrad)"
                        strokeWidth="3"
                        strokeLinecap="round"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.5, ease: "easeInOut" }}
                      />

                      {/* ==================== THE CALM (EMERALD) SHADED AREA AND LINE ==================== */}
                      {/* Animated Area Fill */}
                      <motion.path
                        d={chart.biglogicArea}
                        fill="url(#emeraldAreaGrad)"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: 0.3 }}
                      />
                      {/* Animated Trend Line */}
                      <motion.path
                        d={chart.biglogicPath}
                        fill="none"
                        stroke="url(#emeraldLineGrad)"
                        strokeWidth="3.5"
                        strokeLinecap="round"
                        filter="url(#shadowGlow)"
                        initial={{ pathLength: 0 }}
                        whileInView={{ pathLength: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 1.8, ease: "easeInOut", delay: 0.3 }}
                      />

                      {/* ==================== INTERACTIVE HOVER NODE DOTS ==================== */}
                      {chart.points.map((pt, pointIdx) => (
                        <g key={pointIdx} className="overflow-visible">
                          {/* Invisible larger hover zone around the vertical strip */}
                          <line
                            x1={pt.x}
                            y1="25"
                            x2={pt.x}
                            y2="175"
                            stroke="rgba(0,0,0,0)"
                            strokeWidth="16"
                            className="cursor-pointer"
                            onMouseEnter={() => setHoveredNode({ chartId: chart.id, pointIdx })}
                            onMouseLeave={() => setHoveredNode(null)}
                          />

                          {/* Manual Point Dot */}
                          <circle
                            cx={pt.x}
                            cy={pt.manualY}
                            r="4"
                            className="fill-red-600 stroke-white stroke-[1.5] shadow-md pointer-events-none"
                          />

                          {/* BIGlogic Point Dot */}
                          <circle
                            cx={pt.x}
                            cy={pt.biglogicY}
                            r="4.5"
                            className="fill-emerald-500 stroke-white stroke-2 shadow-md pointer-events-none"
                          />
                        </g>
                      ))}

                      {/* ==================== RADAR TARGET RADIAL PULSES ==================== */}
                      {/* Manual Pulsing Ring */}
                      <circle
                        cx="345"
                        cy={chart.manualEndY}
                        r="8"
                        className="fill-red-500/10 stroke-red-500/30 stroke-1 pointer-events-none animate-ping"
                      />
                      
                      {/* BIGlogic Pulsing Ring */}
                      <circle
                        cx="345"
                        cy={chart.biglogicEndY}
                        r="8.5"
                        className="fill-emerald-500/10 stroke-emerald-500/30 stroke-1 pointer-events-none animate-ping"
                      />
                    </svg>

                    {/* ==================== STATIC ENDPOINT PRICE/TIME CALLOUT TAGS (At-A-Glance Legibility) ==================== */}
                    {/* Manual Curve Tag */}
                    <div 
                      className="absolute bg-white border border-red-500/35 px-2 py-0.5 rounded-md text-[9px] font-extrabold text-red-600 shadow-sm pointer-events-none font-tech-landeros"
                      style={{
                        left: "345px",
                        top: `${chart.manualEndY}px`,
                        transform: "translate(-102%, -50%)"
                      }}
                    >
                      {chart.manualEndLabel}
                    </div>

                    {/* BIGlogic Curve Tag */}
                    <div 
                      className="absolute bg-emerald-500 border border-emerald-600 px-2 py-0.5 rounded-md text-[9px] font-extrabold text-white shadow-sm pointer-events-none font-tech-landeros"
                      style={{
                        left: "345px",
                        top: `${chart.biglogicEndY}px`,
                        transform: "translate(-102%, -50%)"
                      }}
                    >
                      {chart.biglogicEndLabel}
                    </div>

                    {/* Interactive Tooltip Card Overlay (Dynamic position on X coordinates) */}
                    <AnimatePresence>
                      {hoveredNode && hoveredNode.chartId === chart.id && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 5 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 5 }}
                          className="absolute bg-[#0A0A0A] text-white p-4 rounded-2xl shadow-xl z-20 text-xs w-[220px] border border-white/10 pointer-events-none transition-all duration-200"
                          style={{
                            // position tooltip relative to X coordinates of hovered interval
                            left: `${(chart.points[hoveredNode.pointIdx].x / 360) * 100}%`,
                            top: "20px",
                            transform: "translateX(-50%)"
                          }}
                        >
                          <div className="flex justify-between items-center border-b border-white/10 pb-1.5 mb-2">
                            <span className="font-tech-landeros text-[9px] font-black uppercase text-neutral-400">
                              Volume: {chart.points[hoveredNode.pointIdx].volume} Claims
                            </span>
                            <span className="text-[10px] font-black text-emerald-400 uppercase font-tech-landeros">
                              {chart.points[hoveredNode.pointIdx].savings}
                            </span>
                          </div>

                          <div className="space-y-1.5">
                            <div className="flex items-center justify-between text-[11px] font-semibold">
                              <span className="text-red-400 flex items-center gap-1">
                                <ShieldX className="w-3 h-3 shrink-0" /> Manual Way
                              </span>
                              <span className="font-mono font-bold">
                                {chart.points[hoveredNode.pointIdx].manualVal}
                              </span>
                            </div>

                            <div className="flex items-center justify-between text-[11px] font-semibold">
                              <span className="text-emerald-400 flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3 fill-emerald-500/10 shrink-0" /> BIGlogic Way
                              </span>
                              <span className="font-mono font-bold text-emerald-400">
                                {chart.points[hoveredNode.pointIdx].biglogicVal}
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Subtext description below chart */}
                <div className="mt-6 border-t border-black/5 pt-4">
                  <p className="text-xs font-bold text-[#3A3A3A] leading-relaxed">
                    {chart.subText}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Global Summary Stats Card */}
        <ScrollReveal direction="up" delay={200} className="w-full max-w-5xl mx-auto">
          <div className="bg-[#0A0A0A] text-white rounded-[32px] p-8 md:p-10 shadow-premium-tactile relative overflow-hidden text-left hover-premium-card border border-white/5">
            {/* Nested container to clip the radial flare within rounded corners */}
            <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none z-0 opacity-40">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-white/10 to-transparent rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center relative z-10">
              <div className="md:col-span-8 space-y-3">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/5 border border-white/10 text-emerald-400 text-xs font-bold font-tech-landeros uppercase tracking-wider">
                  <ShieldCheck className="w-3.5 h-3.5 fill-emerald-500/10" />
                  CAPITAL VELOCITY PROJECTION
                </div>
                <h3 className="text-2xl md:text-3xl font-black font-display-landeros uppercase leading-none">
                  Scale your claims friction-free.
                </h3>
                <p className="text-sm font-semibold text-neutral-400 leading-relaxed max-w-xl">
                  By compiling flawless structured estimates that are fully matched to carrier audit rules, your claims slide directly past reviews. You avoid disputes, bypass bank draw bottlenecks, and draw outstanding capital in 48 hours instead of 45 days.
                </p>
              </div>

              <div className="md:col-span-4 border-l border-white/10 pl-0 md:pl-8 flex flex-col justify-center h-full">
                <span className="text-[10px] font-bold tracking-wider text-neutral-400 uppercase font-tech-landeros block mb-1">
                  AVERAGE CLAIM RECOVERY RATE
                </span>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl md:text-5xl font-black text-emerald-400 font-display-landeros">99.8%</span>
                  <span className="text-xs font-bold text-neutral-400 font-tech-landeros">Accuracy</span>
                </div>
                <span className="text-xs text-neutral-500 font-semibold block mt-1.5 flex items-center gap-1">
                  * vs 91.8% standard manual copying rate <ArrowUpRight className="w-3.5 h-3.5 text-neutral-400" />
                </span>
              </div>
            </div>
          </div>
        </ScrollReveal>
 
        {/* Math explanation callout */}
        <ScrollReveal direction="up" delay={220} className="mt-8 max-w-5xl mx-auto flex items-center gap-3 text-xs font-medium text-[#6B6B6B] text-left">
          <HelpCircle className="w-4 h-4 text-[#6B6B6B] shrink-0" />
          <p>
            Graphs generated from custom comparative metrics gathered across 420 active restoration contracts. All SVG graphs scale dynamically across viewport ratios. Hover on vertical nodes to see detailed comparative statistics.
          </p>
        </ScrollReveal>
 
      </div>

      {/* Background Pencil Sketches surrounding the content closer to content, larger, and more opaque */}
      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[10%] left-[-80px] lg:left-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_brickwall_trowel.png"
          alt="Brickwall and Trowel Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[5%] right-[-80px] lg:right-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_drafting_tools.png"
          alt="Drafting Tools Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[15%] left-[-80px] lg:left-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_clipboard_contract.png"
          alt="Clipboard Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[5%] right-[-80px] lg:right-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_tape_measure.png"
          alt="Tape Measure Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>
    </section>
  );
};
