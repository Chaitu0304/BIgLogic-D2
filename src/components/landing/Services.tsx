import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { 
  CalendarRange, 
  Search, 
  ShieldAlert, 
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  TrendingUp,
  Mic
} from "lucide-react";
import { ScrollReveal, ScrollRevealChild } from "../ui/ScrollReveal";

export const Services = () => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isDesktop, setIsDesktop] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  // Monitor screen size to disable hover transitions on mobile/tablet (native touch scrolls remain safe)
  useEffect(() => {
    const checkScreen = () => {
      setIsDesktop(window.innerWidth >= 768);
    };
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const ySketch = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  const agents = [
    {
      num: "01",
      icon: CalendarRange,
      title: "AI Draw Schedule Agent",
      description: "Automatically builds milestone-based draw schedules from Xactimate estimates. Generates lender-ready draw packages that align with standard banking percentages. Accelerates draw approval times from 45 days down to less than 4 days.",
      value: "$1,200/mo of estimator time saved",
      accent: "#311081",
      image: "/sketch_ai_draw_scheduler.png",
      robotLeaning: "/sketch_agent_01_leaning.png",
      robotUpright: "/sketch_agent_01_upright.png"
    },
    {
      num: "02",
      icon: Search,
      title: "Deep Material Extractor",
      description: "Scans hundreds of estimate pages instantly. Isolates and compiles homeowner-selection items (cabinets, trim, granite types, flooring styles) hidden in complex line items, preventing PM purchasing errors and ensuring perfect execution.",
      value: "$800/mo in avoided purchasing errors",
      accent: "#311081",
      image: "/sketch_material_extractor.png",
      robotLeaning: "/sketch_agent_02_leaning.png",
      robotUpright: "/sketch_agent_02_upright.png"
    },
    {
      num: "03",
      icon: ShieldAlert,
      title: "Carrier Guideline Auditor",
      description: "Stops insurer pushback before it starts. Automatically audits your PDF or ESX files against guidelines for the top 10 major U.S. insurance carriers, flagging compliance issues and ensuring 99.8% audit-grade payouts.",
      value: "$1,500/mo in avoided carrier dispute costs",
      accent: "#311081",
      image: "/sketch_carrier_auditor.png",
      robotLeaning: "/sketch_agent_03_leaning.png",
      robotUpright: "/sketch_agent_03_upright.png"
    },
    {
      num: "04",
      icon: FileSpreadsheet,
      title: "Excel & Document Compiler",
      description: "Instantly compiles unstructured estimate lines into clean, branded Excel sheets and PDF schedules. Chat with your entire database of company projects using Company Brain to retrieve historic cost averages in seconds.",
      value: "$500/mo in administrative savings",
      accent: "#311081",
      image: "/sketch_excel_compiler.png",
      robotLeaning: "/sketch_agent_04_leaning.png",
      robotUpright: "/sketch_agent_04_upright.png"
    },
    {
      num: "05",
      icon: Mic,
      title: "AI Field Assistant",
      description: "Dictate on-site conditions directly into your phone. The AI assistant transcribes your speech, extracts actionable notes, maps them to standard reconstruction codes, and drafts estimate line items automatically.",
      value: "$500/mo in mobile administration savings",
      accent: "#311081",
      image: "/sketch_field_assistant.png",
      robotLeaning: "/sketch_agent_05_leaning.png",
      robotUpright: "/sketch_agent_05_upright.png"
    }
  ];


  return (
    <section ref={sectionRef} id="services" className="py-24 bg-premium-luxury-gradient bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background soft glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-black/3 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-black/3 to-transparent rounded-full blur-[90px] pointer-events-none" />
 
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <ScrollReveal direction="up" delay={100} className="max-w-4xl mb-28 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F8F8] border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6">
            <TrendingUp className="w-4 h-4 text-[#6B6B6B]" />
            <span>HOW WE GENERATE A $4,000/MONTH VALUE FOR CONTRACTORS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            Five Dedicated AI Agents. <br />
            Working 24/7/365 Inside Your Business.
          </h2>
          
          <p className="text-lg md:text-xl font-semibold text-[#6B6B6B] max-w-3xl leading-relaxed">
            Stop paying skilled estimators to do manual copy-paste administrative work. Stop waiting weeks for bank draw inspections. Deploy specific, trained agents in seconds with zero setup.
          </p>
        </ScrollReveal>
 
        {/* Premium Agents Grid (Narrower max-w-5xl decreases horizontal card width) */}
        <ScrollReveal stagger={true} className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            const isHovered = isDesktop && hoveredCard === index;
            const isLeftCard = index === 0 || index === 3;
            return (
              <ScrollRevealChild key={index} className={`h-full flex relative overflow-visible ${index === 2 ? "md:col-span-2 max-w-[calc(50%-16px)] mx-auto w-full" : ""}`}>
                <motion.div 
                  onMouseEnter={() => setHoveredCard(index)}
                  onMouseLeave={() => setHoveredCard(null)}
                  className="relative z-10 w-full h-[240px] select-none cursor-pointer group rounded-[32px] transition-shadow duration-500 overflow-visible"
                  animate={isHovered ? {
                    rotateY: isLeftCard ? 4 : -4,
                    rotateX: 2,
                    scale: 1.015,
                  } : {
                    rotateY: 0,
                    rotateX: 0,
                    scale: 1,
                  }}
                  style={{
                    transformPerspective: 1200,
                    transformStyle: "preserve-3d"
                  }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Inner Card Container (Gray gradient fading from right to left, black/gray color palette) */}
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-l from-[#EDEDED] via-[#F5F5F5] to-[#FBFBFC] border rounded-[32px] overflow-hidden z-10"
                    animate={isHovered ? {
                      boxShadow: "0 20px 40px -12px rgba(0, 0, 0, 0.12), 0 10px 20px -18px rgba(0, 0, 0, 0.15)",
                      borderColor: "rgba(0, 0, 0, 0.12)"
                    } : {
                      boxShadow: "0 10px 30px -10px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
                      borderColor: "rgba(0, 0, 0, 0.05)"
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  >
                    {/* Backdrop Glow */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-black/3 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                    {/* Fading auxiliary content container */}
                    <motion.div
                      animate={{ opacity: isHovered ? 0 : 1 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                      className="w-full h-full absolute inset-0 pointer-events-none z-10"
                    >
                      {/* Massive Number Stamp shining between the grey shade */}
                      <div className="absolute top-2 right-6 font-display-landeros text-5xl font-extrabold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.95)] transition-all duration-300">
                        {agent.num}
                      </div>

                      {/* Description (positioned neatly under the Title & Icon row with 28px left padding) */}
                      <p className="absolute top-[92px] left-7 pr-8 text-[11px] md:text-[12px] font-semibold leading-relaxed text-[#6B6B6B] max-w-[360px]">
                        {agent.description}
                      </p>

                      {/* Value Capsule Tag (placed inside fading container, reverting back to original black/gray palette) */}
                      <div className="absolute bottom-5 left-7">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 border border-black/10 font-bold tracking-wide text-xs text-[#0A0A0A] transition-all duration-300 group-hover:border-black/20">
                          <Zap className="w-3.5 h-3.5 text-[#0A0A0A] fill-black/10" />
                          {agent.value}
                        </div>
                      </div>
                    </motion.div>

                    {/* Icon Capsule Block (original black/gray palette, horizontally aligned next to title) */}
                    <motion.div 
                      className="absolute w-10 h-10 border rounded-xl flex items-center justify-center z-30 shadow-sm transition-all duration-300"
                      animate={isHovered ? {
                        top: 24,
                        left: 28,
                        backgroundColor: "rgba(0,0,0,0.03)",
                        borderColor: "rgba(0,0,0,0.12)",
                        color: "#0A0A0A"
                      } : {
                        top: 24,
                        left: 28,
                        backgroundColor: "rgba(0,0,0,0.04)",
                        borderColor: "rgba(0,0,0,0.08)",
                        color: "#0A0A0A"
                      }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Icon className="w-4.5 h-4.5 stroke-[2]" />
                    </motion.div>

                    {/* Title (repositioned directly next to the Icon with 28px padding offsets) */}
                    <motion.h3
                      className="font-tech-landeros text-base md:text-[17px] font-bold absolute z-30 tracking-tight leading-snug"
                      animate={isHovered ? {
                        left: 80,
                        top: 28,
                        width: "calc(40% - 92px)",
                        color: "#0A0A0A"
                      } : {
                        left: 80,
                        top: 28,
                        width: "calc(100% - 108px)",
                        color: "#0A0A0A"
                      }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {agent.title}
                    </motion.h3>

                    {/* Rolling Premium Canvas Cover Panel (Double Border Blueprint Reveal covering right 60%) */}
                    <motion.div
                      className="absolute top-0 bottom-0 bg-[#FAF9F5] border-l-2 border-double border-[#311081]/15 z-20 overflow-hidden flex items-center justify-center shadow-[-12px_0_30px_rgba(49,16,129,0.08)]"
                      initial={{ left: "100%", width: "0%" }}
                      animate={isHovered ? {
                        left: "40%", // leaves left 40% vertical spine uncovered
                        width: "60%"
                      } : {
                        left: "100%",
                        width: "0%"
                      }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Drafting Ruler Line (scales vertically from scaleY: 0 to scaleY: 1) */}
                      <motion.div
                        className="absolute left-3 top-4 bottom-4 w-[1px] bg-[#311081]/30 origin-top pointer-events-none"
                        initial={{ scaleY: 0 }}
                        animate={isHovered ? { scaleY: 1 } : { scaleY: 0 }}
                        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
                      />

                      {/* Blueprint Content Frame */}
                      <div className="w-full h-full relative overflow-hidden flex items-center justify-center p-3">
                        {/* Parallax Blueprint Image */}
                        <motion.div
                          className="w-full h-full relative overflow-hidden flex items-center justify-center"
                          initial={{ rotate: -3, scale: 1.18, opacity: 0 }}
                          animate={isHovered ? {
                            rotate: 0,
                            scale: 1.02,
                            opacity: 1
                          } : {
                            rotate: -3,
                            scale: 1.18,
                            opacity: 0
                          }}
                          transition={{ 
                            duration: 0.6, 
                            ease: [0.16, 1, 0.3, 1],
                            delay: 0.05
                          }}
                        >
                          <img
                            src={agent.image}
                            alt={agent.title}
                            className="w-full h-full object-contain opacity-95 drop-shadow-[2px_6px_12px_rgba(0,0,0,0.12)]"
                            style={{ clipPath: "inset(4%)" }}
                          />
                        </motion.div>
                      </div>
                    </motion.div>
                  </motion.div>

                  {/* Floating Leaning Robot Character Sketch standing outside the card */}
                  {isDesktop && (
                    <motion.div
                      className="absolute z-20 pointer-events-none select-none overflow-visible"
                      style={{
                        width: "220px",
                        height: "340px",
                        transformStyle: "preserve-3d",
                        transform: "translateZ(40px)"
                      }}
                      initial={isLeftCard ? { 
                        left: "-150px", 
                        bottom: "-70px", 
                        scale: 0.95, 
                        y: 0,
                        opacity: 1,
                        filter: "drop-shadow(4px 8px 16px rgba(0,0,0,0.12))"
                      } : {
                        right: "-150px",
                        bottom: "-70px",
                        scale: 0.95,
                        y: 0,
                        opacity: 1,
                        filter: "drop-shadow(4px 8px 16px rgba(0,0,0,0.12))"
                      }}
                      animate={isHovered ? (
                        isLeftCard ? {
                          left: "-150px",
                          bottom: "-70px",
                          scale: 1.05,
                          y: -6,
                          opacity: 1,
                          filter: "drop-shadow(4px 8px 16px rgba(0,0,0,0.12))"
                        } : {
                          right: "-150px",
                          bottom: "-70px",
                          scale: 1.05,
                          y: -6,
                          opacity: 1,
                          filter: "drop-shadow(4px 8px 16px rgba(0,0,0,0.12))"
                        }
                      ) : (
                        isLeftCard ? {
                          left: "-150px",
                          bottom: "-70px",
                          scale: 0.95,
                          y: 0,
                          opacity: 1,
                          filter: "drop-shadow(4px 8px 16px rgba(0,0,0,0.12))"
                        } : {
                          right: "-150px",
                          bottom: "-70px",
                          scale: 0.95,
                          y: 0,
                          opacity: 1,
                          filter: "drop-shadow(4px 8px 16px rgba(0,0,0,0.12))"
                        }
                      )}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    >
                      {/* Leaning state image (normal times) */}
                      <motion.img
                        src={agent.robotLeaning}
                        alt={`${agent.title} Leaning`}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        animate={{ 
                          opacity: isHovered ? 0 : 0.95,
                          scale: isHovered ? 0.92 : 1,
                        }}
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                      />
                      
                      {/* Standing still state image (hovered times) */}
                      <motion.img
                        src={agent.robotUpright}
                        alt={`${agent.title} Standing Upright`}
                        className="absolute inset-0 w-full h-full object-contain pointer-events-none"
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ 
                          opacity: isHovered ? 0.95 : 0,
                          scale: isHovered ? 1 : 0.92,
                        }}
                        transition={{ duration: 0.45, ease: "easeInOut" }}
                      />
                    </motion.div>
                  )}
                </motion.div>
              </ScrollRevealChild>
            );
          })}
        </ScrollReveal>
 
        {/* Bottom Verification Banner */}
        <ScrollReveal direction="up" delay={200} className="mt-20 bg-[#F8F8F8] border border-black/5 p-8 shadow-landeros rounded-3xl max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-black/3 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-4 text-left relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#0A0A0A]" />
            </div>
            <div>
              <h4 className="font-tech-landeros font-bold text-sm tracking-wider text-[#0A0A0A] uppercase">Audit-Grade Validation Engine</h4>
              <p className="text-sm font-bold text-[#6B6B6B] mt-0.5">Every draw schedule is formatted according to major U.S. bank &amp; lender standards.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold font-tech-landeros text-[#6B6B6B] relative z-10">
            <span className="px-3 py-1 rounded-full bg-black/5 border border-black/5 shadow-sm">&bull; SOC 2 TYPE II SECURE</span>
            <span className="px-3 py-1 rounded-full bg-black/5 border border-black/5 shadow-sm">&bull; HIPAA GRADE ENCRYPTION</span>
            <span className="px-3 py-1 rounded-full bg-black/5 border border-black/5 shadow-sm">&bull; CARRIER UPDATE DAILY</span>
          </div>
        </ScrollReveal>
 
      </div>

      {/* Background Pencil Sketches surrounding the content closer to content, larger, and more opaque */}
      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[10%] left-[-80px] lg:left-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_scaffolding_structure.png"
          alt="Scaffolding Structure Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      

      {/* Premium Angled Open Laptop Sketch kept at the top right corner */}
      <motion.div
        style={{ 
          y: ySketch,
          WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          maskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)"
        }}
        className="absolute top-[-3%] right-[-60px] lg:right-[-80px] w-[400px] h-[400px] lg:w-[650px] lg:h-[650px] pointer-events-none z-0 mix-blend-multiply opacity-[0.18] overflow-hidden"
      >
        <img
          src="/sketch_laptop_angled.png"
          alt="Angled Laptop Sketch"
          className="w-full h-full object-contain scale-[1.05] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.1)]"
          style={{ clipPath: "inset(5%)" }} />
      </motion.div>

    </section>
  );
};
