import { useRef } from "react";
import { Upload, Cpu, DollarSign, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollReveal, ScrollRevealChild } from "../ui/ScrollReveal";
import { motion, useScroll, useTransform } from "framer-motion";

export const HowItWorks = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const ySketch = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  const steps = [
    {
      num: "01",
      icon: Upload,
      title: "Upload The Estimate",
      description: "Drag and drop any standard PDF estimate or ESX file directly into the secure portal. Zero manual mapping or pre-formatting is required.",
      badge: "Supports PDF & ESX",
    },
    {
      num: "02",
      icon: Cpu,
      title: "Agents Go To Work",
      description: "Our Gemini-powered agents parse the estimate, extract hidden material items, verify carrier compliance, and build the lender-draw schedules.",
      badge: "Average time: 45 seconds",
    },
    {
      num: "03",
      icon: DollarSign,
      title: "Submit & Get Paid",
      description: "Download ready-to-use, professional Excel spreadsheets, draw schedules, and carrier-ready compliance audit files to accelerate funding.",
      badge: "Draws cleared in 48 hours",
    }
  ];

  return (
    <section ref={sectionRef} id="how-it-works" className="py-24 bg-premium-luxury-gradient-alt bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Accent Glow */}
      <div className="absolute top-10 right-0 w-[400px] h-[400px] bg-gradient-to-bl from-black/3 to-transparent rounded-full blur-[100px] pointer-events-none" />
 
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={100} className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F0F0] border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6">
            <span>ZERO COMPLEXITY</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            From PDF Upload To <br />
            Approved Lender Draws. In 3 Steps.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#6B6B6B] max-w-2xl leading-relaxed">
            No long training programs. No complicated configurations. Just drop your file, watch the agents extract the details, and cash out draws immediately.
          </p>
        </ScrollReveal>
 
        {/* Timeline Grid */}
        <ScrollReveal stagger={true} className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto relative">
          {/* Connector lines on desktop */}
          <div className="hidden lg:block absolute top-1/2 left-[15%] right-[15%] h-0.5 border-t border-dashed border-black/10 z-0 -translate-y-12" />
 
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <ScrollRevealChild key={index} className="h-full flex relative z-10">
                <div 
                  className="bg-white border border-black/5 p-8 rounded-3xl flex flex-col justify-between hover-premium-card z-10 group w-full"
                >
                  <div>
                    {/* Step Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="w-14 h-14 rounded-2xl bg-[#F0F0F0] border border-black/5 flex items-center justify-center text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white transition-all duration-300 shadow-sm">
                        <Icon className="w-6 h-6 stroke-[2]" />
                      </div>
                      <span className="font-display-landeros text-3xl font-black text-black/20 group-hover:text-[#0A0A0A] transition-colors">{step.num}</span>
                    </div>
   
                    {/* Title */}
                    <h3 className="font-tech-landeros text-xl font-bold mb-4 text-[#0A0A0A]">
                      {step.title}
                    </h3>
   
                    {/* Description */}
                    <p className="font-semibold text-sm leading-relaxed text-[#6B6B6B] mb-6">
                      {step.description}
                    </p>
                  </div>
   
                  {/* Badge Tag */}
                  <div className="mt-4 pt-4 border-t border-black/5">
                    <span className="inline-block px-3 py-1 bg-black/5 border border-black/10 rounded-full text-xs font-bold uppercase tracking-wider text-[#0A0A0A]">
                      {step.badge}
                    </span>
                  </div>
   
                </div>
              </ScrollRevealChild>
            );
          })}
        </ScrollReveal>
 
        {/* Dynamic CTA box at bottom */}
        <ScrollReveal direction="up" delay={200} className="mt-16 text-center">
          <button
            onClick={() => navigate("/signup")}
            className="btn-landeros-primary h-14 px-8 text-sm inline-flex items-center gap-2 text-black"
          >
            CLAIM YOUR 3 FREE UPLOADS <ArrowRight className="w-4 h-4 text-black" />
          </button>
        </ScrollReveal>
 
      </div>

      {/* Background Pencil Sketches surrounding the content closer to content, larger, and more opaque */}
      <motion.div
        style={{ 
          y: ySketch,
          WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          maskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)"
        }}
        className="absolute top-[10%] left-[-80px] lg:left-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.14] overflow-hidden"
      >
        <img
          src="/sketch_pdf_upload_cloud.png"
          alt="PDF Upload Cloud Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.1)]"
          style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ 
          y: ySketch,
          WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          maskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)"
        }}
        className="absolute top-[5%] right-[-80px] lg:right-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.14] overflow-hidden"
      >
        <img
          src="/sketch_ai_processor_gears.png"
          alt="AI Processor Gears Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.1)]"
          style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ 
          y: ySketch,
          WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          maskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)"
        }}
        className="absolute bottom-[15%] left-[-80px] lg:left-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.14] overflow-hidden"
      >
        <img
          src="/sketch_draw_payout_chart.png"
          alt="Draw Payout Chart Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.1)]"
          style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ 
          y: ySketch,
          WebkitMaskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
          maskImage: "radial-gradient(circle, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)"
        }}
        className="absolute bottom-[5%] right-[-80px] lg:right-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.14] overflow-hidden"
      >
        <img
          src="/sketch_cleared_draws_calendar.png"
          alt="Cleared Draws Calendar Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.1)]"
          style={{ clipPath: "inset(5%)" }} />
      </motion.div>
    </section>
  );
};

