import { useRef } from "react";
import { ShieldCheck, Lock, FolderLock, Scale, ShieldAlert, Check } from "lucide-react";
import { ScrollReveal, ScrollRevealChild } from "../ui/ScrollReveal";
import { motion, useScroll, useTransform } from "framer-motion";

export const TrustSecurity = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const ySketch = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  return (
    <section ref={sectionRef} id="security" className="py-24 bg-premium-luxury-gradient-alt bg-grid-premium border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/4 w-[350px] h-[350px] bg-gradient-to-tr from-black/3 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={100} className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6">
            <ShieldAlert className="w-4 h-4 text-[#0A0A0A]" />
            <span>ENTERPRISE LIABILITY SAFEGUARDS</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            Bank-Grade Security. <br />
            Built For Enterprise Restoration.
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#6B6B6B] max-w-2xl leading-relaxed">
            Estimates represent sensitive project capital and customer information. We maintain ironclad systems to ensure complete compliance and security.
          </p>
        </ScrollReveal>

        {/* Security Asymmetric Bento Grid */}
        <ScrollReveal stagger={true} className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
          
          {/* Card 1: SOC 2 Type II (Large - 2 cols, 2 rows) */}
          <ScrollRevealChild className="md:col-span-2 md:row-span-2 h-full flex">
            <div className="bg-white border border-black/8 p-8 md:p-10 shadow-premium-tactile rounded-3xl flex flex-col justify-between hover:border-black/20 hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-500 group w-full h-full relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-emerald-500/[0.02] to-transparent rounded-full pointer-events-none" />
              
              <div>
                {/* SVG Animated Shield Icon */}
                <div className="w-20 h-20 rounded-3xl bg-emerald-50 border border-emerald-500/10 flex items-center justify-center mb-8 shadow-sm">
                  <svg className="w-12 h-12 text-emerald-600 fill-emerald-600/5" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path 
                      className="animate-shield-draw" 
                      d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>

                <h3 className="font-tech-landeros text-2xl font-bold text-[#0A0A0A] mb-4">
                  SOC 2 Type II Certified &amp; Compliant
                </h3>
                
                <p className="font-semibold text-base leading-relaxed text-[#6B6B6B] max-w-xl">
                  Our internal operations, data access logging, and credential management systems are continuously verified and audited by accredited third-party security agencies. We maintain rigid standards to guarantee your reconstruction files remain completely safe and protected.
                </p>
              </div>

              <div className="border-t border-black/5 pt-6 mt-12 flex justify-between items-center">
                <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-50 border border-emerald-500/15 text-xs font-black tracking-wider text-emerald-600 font-tech-landeros">
                  SOC2 TYPE II ENFORCED
                </span>
                <span className="text-xs font-bold text-neutral-400 font-tech-landeros uppercase tracking-wider">
                  ANNUAL AUDIT SCHEDULE
                </span>
              </div>
            </div>
          </ScrollRevealChild>

          {/* Card 2: AES-256 Encryption (Standard - 1 col, 1 row) */}
          <ScrollRevealChild className="md:col-span-1 h-full flex">
            <div className="bg-white border border-black/8 p-6 shadow-premium-tactile rounded-3xl flex flex-col justify-between hover:border-black/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 group w-full h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/8 flex items-center justify-center mb-6 text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Lock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="font-tech-landeros text-lg font-bold text-[#0A0A0A] mb-3">
                  AES-256 Encryption
                </h3>
                <p className="font-semibold text-xs leading-relaxed text-[#6B6B6B]">
                  All estimates, client records, and output files are encrypted in transit via SSL and at rest using bank-grade AES-256 protocols.
                </p>
              </div>
              <div className="border-t border-black/5 pt-4 mt-8">
                <span className="inline-block px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] font-bold tracking-wider text-[#0A0A0A] font-tech-landeros">
                  MILITARY GRADE
                </span>
              </div>
            </div>
          </ScrollRevealChild>

          {/* Card 3: Isolated Workspaces (Standard - 1 col, 1 row) */}
          <ScrollRevealChild className="md:col-span-1 h-full flex">
            <div className="bg-white border border-black/8 p-6 shadow-premium-tactile rounded-3xl flex flex-col justify-between hover:border-black/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 group w-full h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/8 flex items-center justify-center mb-6 text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors duration-300 shadow-sm">
                  <FolderLock className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="font-tech-landeros text-lg font-bold text-[#0A0A0A] mb-3">
                  100% Data Privacy
                </h3>
                <p className="font-semibold text-xs leading-relaxed text-[#6B6B6B]">
                  Estimates are processed in temporary, sandboxed memory spaces. Your proprietary cost lists are never shared or used to train models.
                </p>
              </div>
              <div className="border-t border-black/5 pt-4 mt-8">
                <span className="inline-block px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] font-bold tracking-wider text-[#0A0A0A] font-tech-landeros">
                  SANDBOXED ISOLATION
                </span>
              </div>
            </div>
          </ScrollRevealChild>

          {/* Card 4: Carrier Compliant (Standard - 1 col, 1 row) */}
          <ScrollRevealChild className="md:col-span-1 h-full flex">
            <div className="bg-white border border-black/8 p-6 shadow-premium-tactile rounded-3xl flex flex-col justify-between hover:border-black/20 hover:shadow-[0_4px_20px_rgba(0,0,0,0.06)] transition-all duration-300 group w-full h-full">
              <div>
                <div className="w-12 h-12 rounded-2xl bg-black/5 border border-black/8 flex items-center justify-center mb-6 text-[#0A0A0A] group-hover:bg-[#0A0A0A] group-hover:text-white transition-colors duration-300 shadow-sm">
                  <Scale className="w-5 h-5 stroke-[2.2]" />
                </div>
                <h3 className="font-tech-landeros text-lg font-bold text-[#0A0A0A] mb-3">
                  Carrier Guideline Audits
                </h3>
                <p className="font-semibold text-xs leading-relaxed text-[#6B6B6B]">
                  Audit calculations align exactly with top U.S. insurance guidelines, ensuring your files comply with industry liability requirements.
                </p>
              </div>
              <div className="border-t border-black/5 pt-4 mt-8">
                <span className="inline-block px-3 py-1 rounded-full bg-black/5 border border-black/10 text-[10px] font-bold tracking-wider text-[#0A0A0A] font-tech-landeros">
                  INSURER AUDITED
                </span>
              </div>
            </div>
          </ScrollRevealChild>

          {/* Card 5: Trust Summary (Dark Card - 2 cols, 1 row) */}
          <ScrollRevealChild className="md:col-span-2 h-full flex">
            <div className="bg-[#0A0A0A] border-none p-8 shadow-landeros rounded-3xl flex flex-col justify-between group w-full h-full relative overflow-hidden text-white">
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-900 to-transparent opacity-50 pointer-events-none" />
              
              <div className="relative z-10 text-left">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/5 font-bold uppercase tracking-wider text-[10px] mb-6 font-tech-landeros text-neutral-300">
                  TRUST_SECURITY_SUMMARY_ENG
                </span>
                
                <h3 className="font-tech-landeros text-xl font-bold mb-6 text-white leading-snug">
                  Four Structural Layers of Operational Safeguards
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex gap-2 items-start text-left">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-neutral-300">99.99% Production Uptime SLA guarantee</span>
                  </div>
                  <div className="flex gap-2 items-start text-left">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-neutral-300">Sandboxed, transient file storage models</span>
                  </div>
                  <div className="flex gap-2 items-start text-left">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-neutral-300">Continuous vulnerability audits &amp; checks</span>
                  </div>
                  <div className="flex gap-2 items-start text-left">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span className="text-xs font-semibold text-neutral-300">Strict GDPR &amp; HIPAA-grade encryption layers</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-4 mt-8 text-left relative z-10 flex justify-between items-center text-[10px] font-bold text-neutral-400 font-tech-landeros uppercase tracking-wider">
                <span>BigLogic Enterprise Security Matrix</span>
                <span>SECURE &bull; VERIFIED</span>
              </div>
            </div>
          </ScrollRevealChild>

        </ScrollReveal>

      </div>

      {/* Background Pencil Sketches surrounding the content closer to content, larger, and more opaque */}
      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[10%] left-[-80px] lg:left-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_excavator_crane.png"
          alt="Excavator and Crane Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[5%] right-[-80px] lg:right-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_contract_scroll.png"
          alt="Contract Scroll Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[15%] left-[-80px] lg:left-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_hardhat_hammer.png"
          alt="Hardhat and Hammer Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute bottom-[5%] right-[-80px] lg:right-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_clipboard_contract.png"
          alt="Clipboard Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>
    </section>
  );
};


