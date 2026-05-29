import { useRef } from "react";
import { Check, Zap } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ScrollReveal } from "../ui/ScrollReveal";
import { motion, useScroll, useTransform } from "framer-motion";

export const GrandSlamOffer = () => {
  const navigate = useNavigate();
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const ySketch = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={sectionRef} id="grand-slam-offer" className="py-24 bg-premium-luxury-gradient-alt bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-black/3 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-black/2 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Hormozi Grand Slam Value Stack Box */}
        <ScrollReveal direction="up" delay={150} className="w-full">
          <div className="max-w-4xl mx-auto bg-white border border-black/8 rounded-3xl p-8 md:p-12 shadow-landeros relative text-left hover-premium-card z-10 overflow-visible !overflow-visible">
            {/* Nested container to clip the radial flare within rounded corners */}
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-black/3 to-transparent rounded-full" />
            </div>
            
            <div className="absolute top-0 left-8 -translate-y-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-white to-neutral-400 text-black text-xs font-bold uppercase tracking-widest shadow-md font-tech-landeros flex items-center gap-1.5 z-40">
              <Zap className="w-3.5 h-3.5 fill-current text-black animate-pulse" />
              GRAND SLAM VALUE OFFER
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4 relative z-10">
              
              <div className="md:col-span-7">
                <h3 className="font-tech-landeros text-xl md:text-2xl font-bold mb-4 text-[#0A0A0A] uppercase tracking-tight">
                  Try It 100% Free (Zero Risk, Massive Value)
                </h3>
                <p className="text-sm font-semibold text-[#3A3A3A] mb-6 leading-relaxed">
                  Take the entire platform for a test drive. Upload real estimates, generate real Excel sheets, and audit real insurance files. No credit card required.
                </p>
                
                <ul className="space-y-4 mb-2">
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="text-sm font-semibold text-[#3A3A3A]">
                      <span className="text-[#0A0A0A] font-bold">3 full estimate uploads</span> (extract schedules, materials, Excel exports) — <span className="line-through text-[#6B6B6B]">$150 Value</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="text-sm font-semibold text-[#3A3A3A]">
                      <span className="text-[#0A0A0A] font-bold">Carrier Auditor Access</span> (audit estimates against major guidelines) — <span className="text-[#0A0A0A] font-bold">FREE INCLUDED</span>
                    </span>
                  </li>
                  <li className="flex items-start gap-3">
                    <Check className="w-4 h-4 text-[#0A0A0A] shrink-0 mt-0.5 stroke-[2.5]" />
                    <span className="text-sm font-semibold text-[#3A3A3A]">
                      <span className="text-[#0A0A0A] font-bold">Risk-Free Clause:</span> No credit card required. No sales pressure. Cancel anytime with a click.
                    </span>
                  </li>
                </ul>
              </div>
   
              <div className="md:col-span-5 bg-[#F0F0F0] border border-black/10 rounded-2xl p-6 text-center flex flex-col justify-between h-full relative">
                <div className="absolute top-2 right-2">
                  <span className="px-2 py-0.5 bg-white text-black text-xs font-bold rounded uppercase tracking-wider font-tech-landeros">
                    BETA SPECIAL
                  </span>
                </div>
                
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6B6B6B] font-tech-landeros block mb-1">
                    LIFETIME PRICE ACCESS
                  </span>
                  <div className="flex items-baseline justify-center gap-1.5">
                    <span className="text-3xl md:text-4xl font-black text-[#0A0A0A] font-display-landeros">$199</span>
                    <span className="text-xs font-bold text-[#3A3A3A] font-tech-landeros">/ month</span>
                  </div>
                  <span className="text-xs text-[#6B6B6B] line-through block mt-1 font-semibold">
                    Standard price: $499/mo
                  </span>
                </div>
   
                <div className="mt-6 border-t border-black/5 pt-4">
                  <button
                    onClick={() => navigate("/signup")}
                    className="w-full btn-landeros-primary py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-bold text-black"
                  >
                    <Zap className="w-3.5 h-3.5 fill-current text-black animate-pulse" />
                    START UPLOADING NOW
                  </button>
                  <span className="text-xs font-bold text-[#0A0A0A] block mt-2 uppercase tracking-widest font-tech-landeros">
                    * ONLY 14 SLOTS REMAINING FOR THE BETA OFFER
                  </span>
                </div>
              </div>
   
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Background Pencil Sketches surrounding the content */}
      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[10%] left-[-150px] w-[350px] h-[350px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_contract_scroll.png"
          alt="Contract Scroll Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[5%] right-[-150px] w-[350px] h-[350px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_toolbox_wrenches.png"
          alt="Toolbox and Wrenches Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[15%] left-[-150px] w-[350px] h-[350px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_drafting_tools.png"
          alt="Drafting Tools Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[5%] right-[-150px] w-[350px] h-[350px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_house_framing.png"
          alt="House Framing Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>
    </section>
  );
};
