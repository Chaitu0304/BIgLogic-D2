import { Star, ShieldCheck, Quote } from "lucide-react";

export const Testimonials = () => {
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
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-[#6D28D9]/3 to-[#4F46E5]/3 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <span>CLIENT EVIDENCE BOARD</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
            Bold Claims. <br />
            Backed By Specific Proof.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#3C354D] max-w-2xl leading-relaxed">
            We don't deal in vague promises. Here is the exact data and direct feedback from active restoration owners operating commercial and residential operations.
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {proof.map((item, index) => (
            <div 
              key={index} 
              className="bg-white border border-[#311081]/8 p-8 shadow-landeros hover-premium-card rounded-3xl flex flex-col justify-between relative overflow-visible !overflow-visible transition-all duration-300 group"
            >
              {/* Giant Watermark Quote Decoration */}
              <div className="absolute top-6 right-8 text-[#311081]/5 z-0 transition-colors group-hover:text-[#6D28D9]/10 pointer-events-none">
                <Quote className="w-16 h-16 fill-current rotate-180" />
              </div>

              <div className="relative z-10">
                {/* Stars */}
                <div className="flex items-center gap-1 mb-6 text-yellow-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>

                {/* Big Metric Callout */}
                <h3 className="font-tech-landeros text-base md:text-lg font-bold mb-6 text-[#311081] leading-snug border-b border-[#311081]/5 pb-4">
                  "{item.metric}"
                </h3>

                {/* Testimonial Quote */}
                <p className="font-bold text-sm leading-relaxed text-[#1C1629] mb-8">
                  "{item.quote}"
                </p>
              </div>

              {/* Author Info */}
              <div className="flex items-center justify-between border-t border-[#311081]/5 pt-5 mt-auto bg-[#F6F1FC]/20 -mx-8 -mb-8 p-6 rounded-b-[22px] relative z-10">
                <div className="text-left">
                  <h4 className="font-bold text-sm text-[#311081] font-tech-landeros">{item.author}</h4>
                  <p className="text-xs font-bold text-[#3C354D] mt-0.5">{item.role}</p>
                  <p className="text-xs font-bold text-[#6D28D9] uppercase font-tech-landeros mt-1">{item.location}</p>
                </div>
                {item.verified && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white border border-[#311081]/10 text-xs font-bold uppercase tracking-wider text-[#311081] shrink-0 shadow-sm">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    <span>VERIFIED</span>
                  </span>
                )}
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
