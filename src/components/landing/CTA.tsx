import { useState, useEffect } from "react";
import { Zap, Clock, ShieldCheck, ArrowRight, FileText, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const CTA = () => {
  const navigate = useNavigate();
  
  // Urgency Stateful Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 2, minutes: 14, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        } else if (prev.hours > 0) {
          return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        } else {
          clearInterval(timer);
          return prev; // Countdown ended
        }
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Huge diffused background glow behind the CTA container */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-[#6D28D9]/8 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Main Grand Slam Container Card */}
        <div className="bg-[#311081] text-white rounded-[32px] p-8 md:p-14 shadow-landeros-lg relative overflow-hidden border border-white/5">
          
          {/* Glass glows inside the card */}
          <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-tr from-[#4F46E5]/30 to-[#6D28D9]/20 rounded-full blur-[80px] pointer-events-none" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-[#6D28D9]/20 to-transparent rounded-full blur-[80px] pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 relative z-10 items-stretch">
            
            {/* Left Column - Urgency & Direct Stack (7 cols) */}
            <div className="lg:col-span-7 flex flex-col justify-between text-left">
              <div>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-xs font-bold text-white tracking-wide mb-6">
                  <Clock className="w-4 h-4 text-purple-300" />
                  <span>LIMITED BETA COHORT ONLY</span>
                </div>
                
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-[1.05] tracking-tight font-display-landeros text-white !text-white">
                  Lock In Your Grand <br />
                  Slam Offer Before <br />
                  The Beta Fills.
                </h2>
                
                <p className="text-lg md:text-xl font-semibold text-[#F3EBFC] mb-8 max-w-xl leading-relaxed">
                  We are restricting our active cohort to exactly 100 firms to guarantee server speeds and direct support response. <span className="text-purple-200 font-bold">87 spots are already claimed.</span>
                </p>
                
                {/* Urgency Live Ticker */}
                <div className="bg-white/5 backdrop-blur-md border border-white/10 p-5 rounded-2xl max-w-lg mb-10 flex items-center justify-between shadow-2xl">
                  <div>
                    <h4 className="text-[10px] font-bold uppercase tracking-wider text-purple-200 font-tech-landeros">COHORT ENROLLMENT CLOSES IN:</h4>
                    <div className="text-3xl font-bold text-white mt-1 flex items-baseline gap-1 font-tech-landeros">
                      <span>{timeLeft.hours.toString().padStart(2, '0')}</span>
                      <span className="text-sm font-semibold text-purple-200">h</span>
                      <span className="text-purple-300">:</span>
                      <span>{timeLeft.minutes.toString().padStart(2, '0')}</span>
                      <span className="text-sm font-semibold text-purple-200">m</span>
                      <span className="text-purple-300">:</span>
                      <span className="text-purple-200">{timeLeft.seconds.toString().padStart(2, '0')}</span>
                      <span className="text-sm font-semibold text-purple-200">s</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-4 py-1.5 rounded-full bg-emerald-500 text-white text-[10px] font-bold uppercase tracking-widest font-tech-landeros animate-pulse">
                      13 SEATS LEFT
                    </span>
                  </div>
                </div>

              </div>

              {/* The Bold Guarantee Card (Hormozi Principle #5) */}
              <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 md:p-8 rounded-[24px] relative max-w-2xl shadow-xl">
                <div className="absolute -top-3.5 left-6 px-3 py-1 rounded-full bg-white text-[#311081] text-[9px] font-bold uppercase tracking-widest font-tech-landeros shadow-sm">
                  THE 10-HOUR DOUBLE GUARANTEE
                </div>
                
                <h3 className="font-tech-landeros text-xl font-bold mb-3 text-white">Double Your Money Back.</h3>
                              <p className="font-semibold text-xs leading-relaxed text-[#F3EBFC] mb-6">
                  If BigLogicAI does not save your estimating team at least 10 hours in your first 30 days of use, we will not only refund your subscription 100% instantly &mdash; <span className="text-emerald-300 font-bold">we will write you a check for $500 for wasting your time.</span> We take 100% of the risk.
                </p>

                {/* Hand-signed signature effect */}
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="flex items-center gap-1.5 text-[9px] font-bold tracking-wider font-tech-landeros text-purple-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    LEGAL BINDING REVERSAL
                  </span>
                  <div className="text-right">
                    <div className="font-serif italic text-xl font-bold text-purple-200 tracking-wider select-none font-sans">
                      Chaitanya G.
                    </div>
                    <div className="text-[8px] font-bold uppercase text-purple-200 mt-0.5 tracking-wider font-tech-landeros">Founder, BigLogicAI</div>
                  </div>
                </div>

              </div>

            </div>

            {/* Right Column - LanderOS Value Stack Invoice (5 cols) */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md border border-white/10 rounded-[28px] shadow-2xl p-6 md:p-8 flex flex-col justify-between text-left hover-premium-card z-10 overflow-visible !overflow-visible">
              <div>
                <div className="border-b-2 border-dashed border-white/20 pb-4 mb-6 text-center">
                  <h3 className="font-tech-landeros text-xl font-bold text-white">Value Stack Receipt</h3>
                  <span className="text-[9px] font-bold uppercase tracking-widest text-purple-200 font-tech-landeros">INVOICE_PROPOSAL_COHORT_2026</span>
                </div>

                {/* Stack items */}
                <div className="space-y-4 font-semibold text-xs text-[#F3EBFC]">
                  
                  {/* Item 1 */}
                  <div className="flex justify-between items-start gap-4">
                    <span className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>AI Draw Schedule Agent (10h saved)</span>
                    </span>
                    <span className="font-mono text-purple-200 shrink-0">$1,200/mo</span>
                  </div>

                  {/* Item 2 */}
                  <div className="flex justify-between items-start gap-4">
                    <span className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Deep Material Spec Extractor</span>
                    </span>
                    <span className="font-mono text-purple-200 shrink-0">$800/mo</span>
                  </div>

                  {/* Item 3 */}
                  <div className="flex justify-between items-start gap-4">
                    <span className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Carrier Guideline Auditor</span>
                    </span>
                    <span className="font-mono text-purple-200 shrink-0">$1,500/mo</span>
                  </div>

                  {/* Item 4 */}
                  <div className="flex justify-between items-start gap-4">
                    <span className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5 stroke-[2.5]" />
                      <span>Excel compiler & Firm Brain</span>
                    </span>
                    <span className="font-mono text-purple-200 shrink-0">$500/mo</span>
                  </div>

                </div>

                {/* Total calculation */}
                <div className="border-t-2 border-dashed border-white/20 pt-6 mt-8 space-y-3">
                  <div className="flex justify-between items-baseline font-bold text-[10px] text-purple-200 tracking-wider font-tech-landeros">
                    <span>TOTAL ESTIMATED VALUE:</span>
                    <span className="line-through text-purple-200 font-mono font-bold">$4,000/mo</span>
                  </div>
                  
                  <div className="flex justify-between items-baseline font-bold font-tech-landeros text-2xl text-white">
                    <span>YOUR PRICE:</span>
                    <span className="text-emerald-300">$199/mo</span>
                  </div>
                  
                  <div className="text-[10px] font-bold uppercase text-emerald-300 tracking-wider text-center mt-4 bg-emerald-500/10 border border-emerald-500/20 py-2 rounded-full font-tech-landeros">
                    * First 3 Estimates 100% Free &bull; No Card
                  </div>
                </div>

                {/* CSS Barcode segment */}
                <div className="flex items-center justify-center gap-[2px] h-10 mt-6 opacity-60">
                  {[1, 2, 4, 1, 2, 3, 1, 4, 2, 1, 3, 2, 1, 4, 1, 2, 3, 1, 2, 4, 1, 3, 2, 1, 4, 2, 1].map((width, idx) => (
                    <div
                      key={idx}
                      className="bg-white h-full"
                      style={{ width: `${width}px` }}
                    />
                  ))}
                </div>
                <div className="text-[8px] font-mono text-center text-purple-200 tracking-[0.25em] mt-1.5">
                  * BL-BETA-2026 *
                </div>

              </div>

              {/* CTAs */}
              <div className="mt-8 space-y-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full h-14 rounded-full bg-white text-[#311081] font-bold text-sm tracking-wide flex items-center justify-center gap-2 shadow-lg shadow-[#311081]/20 hover:bg-slate-50 transition-all duration-300 active:scale-[0.98]"
                >
                  CLAIM YOUR 3 FREE ESTIMATES <ArrowRight className="w-4 h-4 shrink-0 stroke-[2.5]" />
                </button>
                <div className="text-[10px] text-center font-bold uppercase tracking-wider text-purple-200 flex items-center justify-center gap-1.5 font-tech-landeros">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  End-To-End AES-256 secure workspace
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

