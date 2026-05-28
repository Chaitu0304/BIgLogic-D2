import { useRef } from "react";
import { Star, ShieldCheck, Quote } from "lucide-react";
import { ScrollReveal } from "../ui/ScrollReveal";
import { motion, useScroll, useTransform } from "framer-motion";

export const Testimonials = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"]
  });
  const ySketch = useTransform(scrollYProgress, [0, 1], [-80, 80]);

  const proof = [
    {
      metric: "Draw cycles cut from 38 days to 4 days.",
      quote: "We had over $1.2M in outstanding lender draws choked in bank inspection cycles. BigLogic's AI Draw Scheduler parsed our Xactimate files and mapped them perfectly to bank milestones. We had the cash in our bank in 4 days. Absolutely life-changing for cash flow.",
      author: "Greg S.",
      role: "CEO, Apex Restoration",
      location: "Dallas, Texas",
      verified: true
    },
    {
      metric: "Saved 18 hours of PM review per project.",
      quote: "Deep material extraction used to take our Project Managers hours of manual reading. BigLogic isolates homeowner cabinetry, flooring, and paint specs instantly. We've eliminated all purchasing errors and completely freed up our team to focus on site execution.",
      author: "Mark T.",
      role: "COO, Titan Reconstruction",
      location: "Orlando, Florida",
      verified: true
    },
    {
      metric: "99.8% compliance rate. Zero carrier pushbacks.",
      quote: "We were skeptical about using AI for carrier-facing documents. But BigLogic's auditor engine is trained exactly on the top 10 insurance guidelines. We have processed 120+ estimates in 6 months without a single compliance rejection.",
      author: "Sarah D.",
      role: "Principal Adjuster, Elite Claims",
      location: "Sacramento, California",
      verified: true
    },
    {
      metric: "Overhead reduced by 72% within 30 days.",
      quote: "We were drowning in paperwork and had to hire third-party coordinators just to keep up with the spreadsheet mapping. BigLogic automated our entire backend in a single day. Our overhead is down 72%, and our PMs are back in the field.",
      author: "Dan K.",
      role: "Managing Director, Ironclad Builders",
      location: "Charlotte, North Carolina",
      verified: true
    },
    {
      metric: "Avoided $45k in material purchasing mistakes.",
      quote: "In reconstruction, estimate specs are buried in hundreds of PDF pages. We used to miss homeowner window or flooring choices all the time. BigLogic's Deep material extractor pulls everything instantly. We haven't had a single purchasing mistake since.",
      author: "Robert L.",
      role: "Founder, Guardian Restoration",
      location: "Denver, Colorado",
      verified: true
    },
    {
      metric: "One operator now manages 45 active rebuilds.",
      quote: "Before BigLogic, we needed three full-time coordinators to manage bank draws and insurance folders for our files. Now, our single office manager runs the entire Reconstruction Pipeline with ease. It's a complete game-changer for scaling.",
      author: "Jessica M.",
      role: "Director of Operations, Rebuild Pros",
      location: "Phoenix, Arizona",
      verified: true
    }
  ];

  return (
    <section ref={sectionRef} id="testimonials" className="py-24 bg-premium-luxury-gradient bg-grid-premium border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-black/3 to-black/2 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <ScrollReveal direction="up" delay={100} className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-black/5 border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6">
            <span>CLIENT EVIDENCE BOARD</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            Bold Claims. <br />
            Backed By Specific Proof.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#6B6B6B] max-w-2xl leading-relaxed">
            We don't deal in vague promises. Here is the exact data and direct feedback from active restoration owners operating commercial and residential operations.
          </p>
        </ScrollReveal>

        {/* Testimonials Infinite Marquee */}
        <ScrollReveal direction="up" delay={150} className="w-full">
          <div className="overflow-hidden relative marquee-fade-mask w-full py-4 select-none hover-pause">
            <div className="flex w-max">
              {/* Strip 1 */}
              <div className="flex gap-6 animate-marquee shrink-0 pr-6">
                {proof.map((item, index) => (
                  <div 
                    key={index} 
                    className="bg-white border border-[#E5E5E5] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-3xl flex flex-col justify-between relative overflow-visible w-[380px] h-[380px] shrink-0 group hover:border-[#0A0A0A]/20 transition-all duration-300"
                  >
                    {/* Giant Watermark Quote Decoration */}
                    <div className="absolute top-6 right-8 text-black/3 z-0 transition-colors group-hover:text-black/5 pointer-events-none">
                      <Quote className="w-16 h-16 fill-current rotate-180" />
                    </div>

                    <div className="relative z-10 text-left">
                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-6 text-[#0A0A0A]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      {/* Big Metric Callout */}
                      <h3 className="font-tech-landeros text-sm md:text-base font-bold mb-4 text-[#0A0A0A] leading-snug border-b border-black/8 pb-3">
                        "{item.metric}"
                      </h3>

                      {/* Testimonial Quote */}
                      <p className="font-semibold text-xs leading-relaxed text-[#3A3A3A] line-clamp-6">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-between border-t border-black/5 pt-4 mt-auto bg-black/2 -mx-8 -mb-8 p-6 rounded-b-[22px] relative z-10">
                      <div className="text-left">
                        <h4 className="font-bold text-xs text-[#0A0A0A] font-tech-landeros">{item.author}</h4>
                        <p className="text-[10px] font-bold text-[#6B6B6B] mt-0.5">{item.role}</p>
                        <p className="text-[9px] font-bold text-[#6B6B6B] uppercase font-tech-landeros mt-0.5">{item.location}</p>
                      </div>
                      {item.verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F8F8F8] border border-black/10 text-[9px] font-bold uppercase tracking-wider text-[#0A0A0A] shrink-0 shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>VERIFIED</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Strip 2 (Duplicated) */}
              <div className="flex gap-6 animate-marquee shrink-0 pr-6" aria-hidden="true">
                {proof.map((item, index) => (
                  <div 
                    key={`dup-${index}`} 
                    className="bg-white border border-[#E5E5E5] p-8 shadow-[0_4px_20px_rgba(0,0,0,0.06)] rounded-3xl flex flex-col justify-between relative overflow-visible w-[380px] h-[380px] shrink-0 group hover:border-[#0A0A0A]/20 transition-all duration-300"
                  >
                    {/* Giant Watermark Quote Decoration */}
                    <div className="absolute top-6 right-8 text-black/3 z-0 transition-colors group-hover:text-black/5 pointer-events-none">
                      <Quote className="w-16 h-16 fill-current rotate-180" />
                    </div>

                    <div className="relative z-10 text-left">
                      {/* Stars */}
                      <div className="flex items-center gap-1 mb-6 text-[#0A0A0A]">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-current" />
                        ))}
                      </div>

                      {/* Big Metric Callout */}
                      <h3 className="font-tech-landeros text-sm md:text-base font-bold mb-4 text-[#0A0A0A] leading-snug border-b border-black/8 pb-3">
                        "{item.metric}"
                      </h3>

                      {/* Testimonial Quote */}
                      <p className="font-semibold text-xs leading-relaxed text-[#3A3A3A] line-clamp-6">
                        "{item.quote}"
                      </p>
                    </div>

                    {/* Author Info */}
                    <div className="flex items-center justify-between border-t border-black/5 pt-4 mt-auto bg-black/2 -mx-8 -mb-8 p-6 rounded-b-[22px] relative z-10">
                      <div className="text-left">
                        <h4 className="font-bold text-xs text-[#0A0A0A] font-tech-landeros">{item.author}</h4>
                        <p className="text-[10px] font-bold text-[#6B6B6B] mt-0.5">{item.role}</p>
                        <p className="text-[9px] font-bold text-[#6B6B6B] uppercase font-tech-landeros mt-0.5">{item.location}</p>
                      </div>
                      {item.verified && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#F8F8F8] border border-black/10 text-[9px] font-bold uppercase tracking-wider text-[#0A0A0A] shrink-0 shadow-sm">
                          <ShieldCheck className="w-3 h-3 text-emerald-400" />
                          <span>VERIFIED</span>
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

      </div>

      {/* Background Pencil Sketches surrounding the content closer to content, larger, and more opaque */}
      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[10%] left-[-80px] lg:left-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_blueprint_layout.png"
          alt="Blueprint Layout Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>

      <motion.div
        style={{ y: ySketch }}
        className="absolute top-[5%] right-[-80px] lg:right-[-120px] w-[350px] h-[350px] lg:w-[500px] lg:h-[500px] pointer-events-none z-0 mix-blend-multiply opacity-[0.15] overflow-hidden"
      >
        <img
          src="/sketch_hourglass_clock.png"
          alt="Hourglass Clock Sketch"
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
          src="/sketch_contract_scroll.png"
          alt="Contract Scroll Sketch"
          className="w-full h-full object-contain scale-[1.08] drop-shadow-[2px_6px_12px_rgba(0,0,0,0.15)]"
         style={{ clipPath: "inset(5%)" }} />
      </motion.div>
    </section>
  );
};

