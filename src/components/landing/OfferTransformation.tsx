import { useState, useRef } from "react";
import { Check, X, ShieldAlert, Zap, HeartHandshake, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollReveal } from "../ui/ScrollReveal";
import { motion, useScroll, useTransform } from "framer-motion";

export const OfferTransformation = () => {
  const navigate = useNavigate();
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const ySketch = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percent = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percent);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (e.buttons === 1) {
      handleMove(e.clientX);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) {
      handleMove(e.touches[0].clientX);
    }
  };

  return (
    <section ref={sectionRef} id="transformation-offer" className="py-24 bg-premium-luxury-gradient-alt bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-black/3 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-black/2 to-transparent rounded-full blur-[100px] pointer-events-none" />
 
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header: The Core Emotional Transformation */}
        <ScrollReveal direction="up" delay={100} className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6 shadow-sm">
            <Zap className="w-3.5 h-3.5 text-[#0A0A0A] fill-black/5" />
            <span>THE OPERATIONAL RECOVERY MODEL</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tight text-[#0A0A0A] mb-8 font-display-landeros max-w-4xl mx-auto">
            “From chaos, paperwork, delays, and expensive office overhead <span className="text-neutral-400 font-light">&rarr;</span> to one calm operator controlling the entire reconstruction business from a single intelligent platform.”
          </h2>
          
          <p className="text-base md:text-lg font-semibold text-[#3A3A3A] max-w-2xl mx-auto leading-relaxed">
            Restoration business owners are forced to hire armies of office staff just to copy-paste Xactimate data, draft contracts, audit insurer rules, and request lender payouts. We replace that administrative friction with automated software.
          </p>
        </ScrollReveal>
 
        {/* Interactive Before/After Reveal Slider */}
        <ScrollReveal direction="up" delay={150} className="mb-20">
          <div 
            ref={containerRef}
            onMouseMove={handleMouseMove}
            onMouseDown={(e) => handleMove(e.clientX)}
            onTouchMove={handleTouchMove}
            onTouchStart={(e) => {
              if (e.touches[0]) handleMove(e.touches[0].clientX);
            }}
            className="relative h-[480px] w-full max-w-5xl mx-auto rounded-[32px] border border-black/10 overflow-hidden shadow-landeros bg-white select-none cursor-ew-resize"
          >
            {/* Underlay: OLD CHAOTIC WAY (Chaos) */}
            <div 
              className="absolute inset-0 flex flex-col justify-center p-8 md:p-12 text-left overflow-hidden select-none"
              style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
            >
              {/* Background Image: Chaos */}
              <img 
                src="/slider_chaos_bg.png" 
                alt="Chaos Workspace" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              />
              {/* Occlusion Vignette */}
              <div className="absolute inset-0 bg-gradient-to-r from-red-950/50 via-red-950/20 to-transparent pointer-events-none" />

              <div className="max-w-md space-y-6 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50/80 border border-red-500/15 text-red-500 font-bold uppercase tracking-wider text-xs font-tech-landeros">
                  <X className="w-3.5 h-3.5 stroke-[3]" />
                  THE OLD CHAOTIC WAY (LABOR INTENSIVE)
                </div>
                
                {/* Scattered Chaotic boxes */}
                <div className="space-y-4 relative">
                  <div className="transform -rotate-2 -translate-x-2 bg-white/90 backdrop-blur border border-red-200 p-4 rounded-2xl shadow-sm flex items-start gap-4 max-w-sm">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-500 font-bold">
                      <X className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-sm font-bold text-red-700">12+ Hours Manual Estimating</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Estimators copying selections and typing schedules.</p>
                    </div>
                  </div>

                  <div className="transform rotate-1 translate-x-4 bg-white/90 backdrop-blur border border-red-200 p-4 rounded-2xl shadow-sm flex items-start gap-4 max-w-sm">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-500 font-bold">
                      <X className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-sm font-bold text-red-700">45-Day Delayed Bank Funding</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Disorganized files cause weeks of lender dispute.</p>
                    </div>
                  </div>

                  <div className="transform -rotate-1 -translate-x-1 bg-white/90 backdrop-blur border border-red-200 p-4 rounded-2xl shadow-sm flex items-start gap-4 max-w-sm">
                    <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-500 font-bold">
                      <X className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-sm font-bold text-red-700">$300/estimate overhead</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Armies of office staff copy-pasting spreadsheet data.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Overlay: CALM OPERATOR WAY (Calm) */}
            <div 
              className="absolute inset-0 flex flex-col justify-center items-end p-8 md:p-12 text-right pointer-events-none overflow-hidden select-none"
              style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}
            >
              {/* Background Image: Calm */}
              <img 
                src="/slider_calm_bg.png" 
                alt="Calm Workspace" 
                className="absolute inset-0 w-full h-full object-cover pointer-events-none select-none"
              />
              {/* Occlusion Vignette */}
              <div className="absolute inset-0 bg-gradient-to-l from-emerald-950/40 via-emerald-950/15 to-transparent pointer-events-none" />

              <div className="max-w-md space-y-6 relative z-10">
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-500/15 text-emerald-600 font-bold uppercase tracking-wider text-xs font-tech-landeros shadow-sm">
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  THE CALM OPERATOR WAY (BIGLOGICAI)
                </div>
                
                {/* Aligned calm boxes */}
                <div className="space-y-4">
                  <div className="bg-white/95 backdrop-blur border border-emerald-100 p-4 rounded-2xl shadow-sm flex items-start gap-4 max-w-sm text-left">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-sm font-bold text-emerald-700">45 Sec AI Estimate Extraction</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Flawless structured schedules generated instantly.</p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur border border-emerald-100 p-4 rounded-2xl shadow-sm flex items-start gap-4 max-w-sm text-left">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-sm font-bold text-emerald-700">48-Hour Bank Draw Approvals</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">Bank-ready format speeds up draws automatically.</p>
                    </div>
                  </div>

                  <div className="bg-white/95 backdrop-blur border border-emerald-100 p-4 rounded-2xl shadow-sm flex items-start gap-4 max-w-sm text-left">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600">
                      <Check className="w-4 h-4 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-sm font-bold text-emerald-700">Single Operator Automation</h4>
                      <p className="text-xs text-neutral-500 mt-0.5">One operator manages the entire admin pipeline.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Draggable Vertical Divider */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-black/30 hover:bg-[#0A0A0A]/50 transition-colors pointer-events-none"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Draggable Handle */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-[#0A0A0A] border-2 border-white text-white flex items-center justify-center shadow-lg pointer-events-auto">
                <span className="text-sm font-black select-none">&larr;&rarr;</span>
              </div>
            </div>
          </div>
        </ScrollReveal>
 
      </div>


      {/* Background Pencil Sketches surrounding the content closer to the outer corners, larger, and more opaque */}
      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[2%] left-[-120px] lg:left-[-160px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_clipboard_contract.png"
          alt="Clipboard Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[1%] right-[-50px] lg:right-[-90px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_construction_truck.png"
          alt="Construction Truck Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[4%] left-[-120px] lg:left-[-160px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_toolbox_wrenches.png"
          alt="Toolbox Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[2%] right-[-120px] lg:right-[-160px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_blueprint_layout.png"
          alt="Blueprint Layout Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>
    </section>
  );
};
