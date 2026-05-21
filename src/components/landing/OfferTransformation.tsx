import { Check, X, ShieldAlert, Zap, HeartHandshake, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const OfferTransformation = () => {
  const navigate = useNavigate();

  return (
    <section id="transformation-offer" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background Soft Gradients */}
      <div className="absolute top-10 left-1/4 w-[400px] h-[400px] bg-gradient-to-tr from-[#6D28D9]/3 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[400px] h-[400px] bg-gradient-to-bl from-[#4F46E5]/3 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header: The Core Emotional Transformation */}
        <div className="max-w-5xl mx-auto text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <Zap className="w-3.5 h-3.5 text-[#6D28D9] fill-[#6D28D9]/15" />
            <span>THE OPERATIONAL RECOVERY MODEL</span>
          </div>
          
          <h2 className="text-3xl md:text-5xl font-black leading-[1.1] tracking-tight text-[#311081] mb-8 font-display-landeros max-w-4xl mx-auto">
            “From chaos, paperwork, delays, and expensive office overhead <span className="text-[#6D28D9] font-light">&rarr;</span> to one calm operator controlling the entire reconstruction business from a single intelligent platform.”
          </h2>
          
          <p className="text-base md:text-lg font-semibold text-[#3C354D] max-w-2xl mx-auto leading-relaxed">
            Restoration business owners are forced to hire armies of office staff just to copy-paste Xactimate data, draft contracts, audit insurer rules, and request lender payouts. We replace that administrative friction with automated software.
          </p>
        </div>

        {/* The Side-by-Side Reality Comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-6xl mx-auto items-stretch mb-20">
          
          {/* Column Left: The Old Way (Chaos) */}
          <div className="lg:col-span-5 bg-white border border-red-500/10 p-8 md:p-10 shadow-landeros hover:shadow-[0_20px_50px_rgba(239,68,68,0.08)] rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-red-500/30">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/[0.02] to-transparent rounded-full pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-500/10 text-red-700 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros">
                <X className="w-3.5 h-3.5 stroke-[3]" />
                THE OLD CHAOTIC WAY (LABOR INTENSIVE)
              </div>
              
              <ul className="space-y-6 text-left">
                <li className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-600">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#311081]/90">Slow Manual Data Entry</h4>
                    <p className="text-sm text-[#3C354D] font-semibold mt-0.5">Estimators waste 12+ hours per estimate copying material selections, building schedules, and typing spreadsheets.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-600">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#311081]/90">Delayed Bank Funding</h4>
                    <p className="text-sm text-[#3C354D] font-semibold mt-0.5">Lenders take 30 to 45 days to approve draw requests because of unorganized draw milestones and lack of proof.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5 text-red-600">
                    <X className="w-3 h-3 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#311081]/90">Expensive Office Overhead</h4>
                    <p className="text-sm text-[#3C354D] font-semibold mt-0.5">Hiring coordinators and admin workers eating up thousands in margins to handle paperwork and basic coordination.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="border-t border-red-500/5 pt-6 mt-10">
              <span className="text-[10px] font-bold text-red-600/60 uppercase tracking-widest font-tech-landeros">
                * SLOWS GROWTH & THROTTLES NET CASH FLOW
              </span>
            </div>
          </div>

          {/* Column Middle: Transition Arrow Icon on Desktop */}
          <div className="hidden lg:flex lg:col-span-2 items-center justify-center">
            <div className="w-14 h-14 bg-white border border-[#311081]/15 rounded-full flex items-center justify-center shadow-md shadow-[#311081]/5 text-[#6D28D9]">
              <ArrowRight className="w-6 h-6 stroke-[2.5]" />
            </div>
          </div>

          {/* Column Right: The New Way (Calm Operator) */}
          <div className="lg:col-span-5 bg-white border border-green-500/10 p-8 md:p-10 shadow-landeros hover:shadow-[0_20px_50px_rgba(34,197,94,0.1)] rounded-3xl flex flex-col justify-between relative overflow-hidden transition-all duration-300 hover:border-green-500/40">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-500/[0.02] to-transparent rounded-full pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-green-50 border border-green-500/10 text-green-700 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                THE CALM OPERATOR WAY (BIGLOGICAI)
              </div>
              
              <ul className="space-y-6 text-left">
                <li className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#311081]">Instant Estimate Processing</h4>
                    <p className="text-sm text-[#3C354D] font-semibold mt-0.5">Simply drop any PDF estimate. Our AI parses and extracts everything into flawless, structured schedules in 45 seconds.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#311081]">Draw Payouts in 48 Hours</h4>
                    <p className="text-sm text-[#3C354D] font-semibold mt-0.5">Format bank-ready milestones automatically, clearing draws and speeding up working capital in days.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center shrink-0 mt-0.5 text-green-600">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                  <div>
                    <h4 className="font-tech-landeros text-sm font-bold text-[#311081]">Single Operator Automation</h4>
                    <p className="text-sm text-[#3C354D] font-semibold mt-0.5">Automate compliance, contracts, estimates, and tasks, letting one manager run the entire reconstruction pipeline.</p>
                  </div>
                </li>
              </ul>
            </div>
            
            <div className="border-t border-green-500/5 pt-6 mt-10">
              <span className="text-[10px] font-bold text-green-600 uppercase tracking-widest font-tech-landeros">
                &bull; UNLOCKS SCALABILITY & ACCELERATES PROFITS
              </span>
            </div>
          </div>

        </div>

        {/* Hormozi Grand Slam Value Stack Box */}
        <div className="max-w-4xl mx-auto bg-white border border-[#311081]/8 rounded-3xl p-8 md:p-12 shadow-landeros relative text-left hover-premium-card z-10 overflow-visible !overflow-visible">
          {/* Nested container to clip the radial flare within rounded corners */}
          <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#6D28D9]/5 to-transparent rounded-full" />
          </div>
          
          <div className="absolute top-0 left-8 -translate-y-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#311081] to-[#6D28D9] text-white text-xs font-bold uppercase tracking-widest shadow-md font-tech-landeros flex items-center gap-1.5 z-40">
            <Zap className="w-3 h-3 fill-current text-yellow-400" />
            GRAND SLAM VALUE OFFER
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4 relative z-10">
            
            <div className="md:col-span-7">
              <h3 className="font-tech-landeros text-xl md:text-2xl font-bold mb-4 text-[#311081]">
                Try It 100% Free (Zero Risk, Massive Value)
              </h3>
              <p className="text-sm font-semibold text-[#3C354D] mb-6 leading-relaxed">
                Take the entire platform for a test drive. Upload real estimates, generate real Excel sheets, and audit real insurance files. No credit card required.
              </p>
              
              <ul className="space-y-4 mb-2">
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5 stroke-[2.5]" />
                  <span className="text-sm font-semibold text-[#3C354D]">
                    <span className="text-[#311081] font-bold">3 full estimate uploads</span> (extract schedules, materials, Excel exports) — <span className="line-through text-[#3C354D]/60">$150 Value</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5 stroke-[2.5]" />
                  <span className="text-sm font-semibold text-[#3C354D]">
                    <span className="text-[#311081] font-bold">Carrier Auditor Access</span> (audit estimates against major guidelines) — <span className="text-[#6D28D9] font-bold">FREE INCLUDED</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-[#6D28D9] shrink-0 mt-0.5 stroke-[2.5]" />
                  <span className="text-sm font-semibold text-[#3C354D]">
                    <span className="text-[#311081] font-bold">Risk-Free Clause:</span> No credit card required. No sales pressure. Cancel anytime with a click.
                  </span>
                </li>
              </ul>
            </div>

            <div className="md:col-span-5 bg-[#F6F1FC] border border-[#311081]/10 rounded-2xl p-6 text-center flex flex-col justify-between h-full relative">
              <div className="absolute top-2 right-2">
                <span className="px-2 py-0.5 bg-[#311081] text-white text-xs font-bold rounded uppercase tracking-wider font-tech-landeros">
                  BETA SPECIAL
                </span>
              </div>
              
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#3C354D] font-tech-landeros block mb-1">
                  LIFETIME PRICE ACCESS
                </span>
                <div className="flex items-baseline justify-center gap-1.5">
                  <span className="text-3xl md:text-4xl font-black text-[#311081] font-display-landeros">$199</span>
                  <span className="text-xs font-bold text-[#3C354D] font-tech-landeros">/ month</span>
                </div>
                <span className="text-xs text-[#3C354D]/70 line-through block mt-1 font-semibold">
                  Standard price: $499/mo
                </span>
              </div>

              <div className="mt-6 border-t border-[#311081]/5 pt-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="w-full btn-landeros-primary py-3 text-xs uppercase tracking-wider flex items-center justify-center gap-2 font-bold"
                >
                  <Zap className="w-3.5 h-3.5 fill-current text-white" />
                  START UPLOADING NOW
                </button>
                <span className="text-xs font-bold text-[#6D28D9] block mt-2 uppercase tracking-widest font-tech-landeros">
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
