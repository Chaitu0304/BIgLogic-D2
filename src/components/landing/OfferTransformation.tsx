import { Check, X, ShieldAlert, Zap, HeartHandshake, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OfferTransformation = () => {
  const navigate = useNavigate();

  return (
    <section id="transformation-offer" className="py-24 bg-premium-luxury-gradient-alt bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-black/3 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-black/2 to-transparent rounded-full blur-[100px] pointer-events-none" />
 
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header: The Core Emotional Transformation */}
        <div className="max-w-5xl mx-auto text-center mb-16">
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
        </div>
 
        {/* The Side-by-Side Reality Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch mb-20">
          
          {/* Column Left: The Old Way (Chaos) */}
          <div className="lg:col-span-5 bg-red-500/[0.01] border border-red-500/10 p-8 md:p-10 shadow-landeros hover:shadow-[0_20px_60px_rgba(239,68,68,0.06)] rounded-[32px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-red-500/25">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/[0.01] to-transparent rounded-full pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50/80 border border-red-500/15 text-red-500 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros">
                <X className="w-3.5 h-3.5 stroke-[3]" />
                THE OLD CHAOTIC WAY (LABOR INTENSIVE)
              </div>
              
              <ul className="space-y-6 text-left">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0 mt-0.5 text-red-500">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A]">Slow Manual Data Entry</h4>
                    <p className="text-xs text-[#6B6B6B] font-semibold mt-0.5">Estimators waste 12+ hours per estimate copying material selections, building schedules, and typing spreadsheets.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0 mt-0.5 text-red-500">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A]">Delayed Bank Funding</h4>
                    <p className="text-xs text-[#6B6B6B] font-semibold mt-0.5">Lenders take 30 to 45 days to approve draw requests because of unorganized draw milestones and lack of proof.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-red-500/10 border border-red-500/15 flex items-center justify-center shrink-0 mt-0.5 text-red-500">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A]">Expensive Office Overhead</h4>
                    <p className="text-xs text-[#6B6B6B] font-semibold mt-0.5">Hiring coordinators and admin workers eating up thousands in margins to handle paperwork and basic coordination.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="border-t border-red-500/5 pt-6 mt-10">
              <span className="text-[10px] font-bold text-red-500/60 uppercase tracking-widest font-tech-landeros">
                * SLOWS GROWTH & THROTTLES NET CASH FLOW
              </span>
            </div>
          </div>
 
          {/* Column Middle: Transition Arrow Icon on Desktop */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center relative">
            {/* Pulsing glow ring in the background */}
            <div className="absolute w-24 h-24 rounded-full border border-black/5 animate-pulse bg-black/[0.01]" />
            <div className="w-16 h-16 bg-white border border-black/8 rounded-full flex items-center justify-center shadow-landeros hover:border-black/20 hover:scale-105 transition-all duration-300 relative z-10 text-[#0A0A0A]">
              <ArrowRight className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>
 
          {/* Column Right: The New Way (Calm Operator) */}
          <div className="lg:col-span-5 bg-emerald-500/[0.01] border border-emerald-500/10 p-8 md:p-10 shadow-landeros hover:shadow-[0_20px_60px_rgba(34,197,94,0.06)] rounded-[32px] flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-emerald-500/25">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-500/[0.01] to-transparent rounded-full pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-500/15 text-emerald-600 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros shadow-sm">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                THE CALM OPERATOR WAY (BIGLOGICAI)
              </div>
              
              <ul className="space-y-6 text-left">
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A]">Instant Estimate Processing</h4>
                    <p className="text-xs text-[#6B6B6B] font-semibold mt-0.5">Simply drop any PDF estimate. Our AI parses and extracts everything into flawless, structured schedules in 45 seconds.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A]">Draw Payouts in 48 Hours</h4>
                    <p className="text-xs text-[#6B6B6B] font-semibold mt-0.5">Format bank-ready milestones automatically, clearing draws and speeding up working capital in days.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center shrink-0 mt-0.5 text-emerald-600 font-bold">
                    <Check className="w-3.5 h-3.5 stroke-[3.5]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#0A0A0A]">Single Operator Automation</h4>
                    <p className="text-xs text-[#6B6B6B] font-semibold mt-0.5">Automate compliance, contracts, estimates, and tasks, letting one manager run the entire reconstruction pipeline.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="border-t border-emerald-500/5 pt-6 mt-10">
              <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest font-tech-landeros">
                &bull; UNLOCKS SCALABILITY & ACCELERATES PROFITS
              </span>
            </div>
          </div>
 
        </div>
 
        {/* Hormozi Grand Slam Value Stack Box */}
        <div className="max-w-4xl mx-auto bg-white border border-black/8 rounded-3xl p-8 md:p-12 shadow-landeros relative text-left hover-premium-card z-10 overflow-visible !overflow-visible">
          {/* Nested container to clip the radial flare within rounded corners */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-black/3 to-transparent rounded-full" />
          </div>
          
          <div className="absolute top-0 left-8 -translate-y-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-white to-neutral-400 text-black text-xs font-bold uppercase tracking-widest shadow-md font-tech-landeros flex items-center gap-1.5 z-40">
            <Zap className="w-3 h-3 fill-current text-black" />
            GRAND SLAM VALUE OFFER
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4 relative z-10">
            
            <div className="md:col-span-7">
              <h3 className="font-tech-landeros text-xl md:text-2xl font-bold mb-4 text-[#0A0A0A]">
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
                  <Check className="w-4 h-4 text-white shrink-0 mt-0.5 stroke-[2.5]" />
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
                  <Zap className="w-3.5 h-3.5 fill-current text-black" />
                  START UPLOADING NOW
                </button>
                <span className="text-xs font-bold text-[#0A0A0A] block mt-2 uppercase tracking-widest font-tech-landeros">
                  * ONLY 14 SLOTS REMAINING FOR THE BETA OFFER
                </span>
              </div>
            </div>
 
          </div>
        </div>
 
      </div>
    </section>
  );
};
