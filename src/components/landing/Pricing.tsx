import { useState } from "react";
import { Check, HelpCircle, Zap, ShieldCheck, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Pricing = () => {
  const navigate = useNavigate();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter Estimator",
      tagline: "Perfect for solo contractors starting out.",
      monthlyPrice: 99,
      annualPrice: 79,
      description: "Automate administrative copy-pasting for smaller residential operations.",
      features: [
        "Up to 10 estimate parses / month",
        "PDF & ESX drag-and-drop parsing",
        "Deep material extraction agent",
        "Standard Excel & CSV spreadsheet compile",
        "Secure document hosting & storage",
        "Standard Email Support (24h turnaround)"
      ],
      cta: "CLAIM 3 FREE ESTIMATES NOW",
      popular: false,
      valueStack: "$2,000 / mo average value stacked"
    },
    {
      name: "Pro Operator",
      tagline: "Unlocks the full calm operator framework.",
      monthlyPrice: 199,
      annualPrice: 159,
      description: "Deploy the complete autonomous suite to run your entire reconstruction pipeline.",
      features: [
        "UNLIMITED estimate parses / month",
        "AI Draw Schedule Agent (formatted to bank rules)",
        "Carrier Compliance Guidelines Auditor (top 10 insurers)",
        "Company Brain Database (chat with historical data)",
        "Custom Draw Schedule Milestone Customizer",
        "Unlimited User Seats for Project Managers",
        "Priority 24/7 Slack & Phone Support"
      ],
      cta: "GO PRO OPERATOR NOW",
      popular: true,
      valueStack: "$4,500 / mo average value stacked"
    }
  ];

  return (
    <section id="pricing" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background Soft Glows */}
      <div className="absolute top-1/4 left-10 w-[450px] h-[450px] bg-gradient-to-tr from-[#6D28D9]/5 to-transparent rounded-full blur-[110px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-bl from-[#4F46E5]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="max-w-4xl text-left mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <Zap className="w-4 h-4 text-[#6D28D9]" />
            <span>BULLETPROOF NO-RISK PRICING</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
            Irresistible Offer. <br />
            Stacked Value. Zero Risk.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#3C354D] max-w-2xl leading-relaxed">
            Stop losing thousands in labor and cash flow interest delays. Choose the plan that fits your volume and experience immediate mathematical ROI.
          </p>
        </div>

        {/* Toggle billing switch */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#F6F1FC] p-1.5 rounded-full border border-[#311081]/10 inline-flex items-center gap-1 shadow-inner relative z-20">
            <button
              onClick={() => setIsAnnual(false)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold font-tech-landeros uppercase tracking-wider transition-all duration-300 ${
                !isAnnual
                  ? "bg-[#311081] text-white shadow-md"
                  : "text-[#311081]/60 hover:text-[#311081]"
              }`}
            >
              Monthly Billing
            </button>
            <button
              onClick={() => setIsAnnual(true)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold font-tech-landeros uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
                isAnnual
                  ? "bg-[#311081] text-white shadow-md"
                  : "text-[#311081]/60 hover:text-[#311081]"
              }`}
            >
              Annual Billing
              <span className="bg-[#6D28D9] text-white text-[9px] font-extrabold px-2 py-0.5 rounded-full tracking-normal uppercase shrink-0">
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto items-stretch mb-16 relative z-10">
          
          {plans.map((plan, idx) => {
            const currentPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={idx}
                className={`bg-white rounded-[32px] p-8 md:p-10 border relative flex flex-col justify-between overflow-hidden hover-premium-card group ${
                  plan.popular
                    ? "border-[#6D28D9]/40 scale-100 lg:scale-[1.02] z-10"
                    : "border-[#311081]/8"
                }`}
              >
                {/* Popular Glow Ring */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#6D28D9]/10 to-transparent rounded-full pointer-events-none" />
                )}

                {/* Popular Ribbon Label */}
                {plan.popular && (
                  <div className="absolute top-6 right-6">
                    <span className="bg-[#6D28D9] text-white text-[9px] font-black font-tech-landeros uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-sm flex items-center gap-1">
                      <Zap className="w-3 h-3 fill-current" /> MOST POPULAR
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="font-tech-landeros text-2xl font-black text-[#311081] mb-2 uppercase tracking-tight">
                    {plan.name}
                  </h3>
                  
                  {/* Tagline */}
                  <p className="text-xs font-bold text-[#3C354D] mb-6">
                    {plan.tagline}
                  </p>

                  {/* Monthly Pricing digits */}
                  <div className="flex items-baseline gap-2 mb-6 border-b border-[#311081]/5 pb-6">
                    <span className="text-5xl md:text-6xl font-black font-display-landeros text-[#311081]">
                      ${currentPrice}
                    </span>
                    <span className="text-sm font-bold text-[#3C354D] tracking-wider uppercase font-tech-landeros">
                      / month
                    </span>
                    {isAnnual && (
                      <span className="text-[10px] font-bold text-[#6D28D9] bg-[#F6F1FC] border border-[#6D28D9]/25 px-2 py-0.5 rounded-full tracking-wide font-tech-landeros shrink-0 ml-2">
                        BILLED ANNUALLY
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className="font-semibold text-xs text-[#3C354D] leading-relaxed mb-8">
                    {plan.description}
                  </p>

                  {/* Features checklist */}
                  <ul className="space-y-4 mb-10 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#F6F1FC] border border-[#311081]/5 flex items-center justify-center shrink-0 mt-0.5 text-[#311081] group-hover:bg-[#311081] group-hover:text-white transition-all duration-300 shadow-sm">
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className="text-xs font-semibold text-[#1C1629]/90 leading-relaxed font-sans-landeros">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Staked value indicator tag */}
                <div className="border-t border-[#311081]/5 pt-6 mt-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6F1FC] border border-[#311081]/10 font-bold uppercase tracking-wider text-[10px] text-[#311081] mb-6 group-hover:border-[#6D28D9]/30 transition-all duration-300">
                    <Zap className="w-3.5 h-3.5 fill-[#311081]/20 text-[#311081]" />
                    {plan.valueStack}
                  </div>
                  
                  <button
                    onClick={() => navigate("/signup")}
                    className={`w-full h-14 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 group/btn relative overflow-hidden transition-all duration-300 ${
                      plan.popular
                        ? "btn-landeros-primary"
                        : "btn-landeros-secondary"
                    }`}
                  >
                    <span>{plan.cta}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1.5 transition-transform duration-200" />
                  </button>
                </div>

              </div>
            );
          })}

        </div>

        {/* ==========================================================================
           Hormozi Grand Slam Risk Reversal Money-Back Guarantee
           ========================================================================== */}
        <div className="max-w-4xl mx-auto bg-white border border-[#311081]/8 rounded-[32px] p-8 md:p-12 shadow-landeros relative text-left hover-premium-card z-10 overflow-visible !overflow-visible">
          {/* Nested container to clip the radial flare within rounded corners */}
          <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#6D28D9]/5 to-transparent rounded-full" />
          </div>
          
          <div className="absolute top-0 left-8 -translate-y-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#311081] to-[#6D28D9] text-white text-[9px] font-bold uppercase tracking-widest shadow-md font-tech-landeros flex items-center gap-1.5 z-40">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            THE BIGLOGIC 100% RISK-REVERSAL CONTRACT
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4 relative z-10">
            
            <div className="md:col-span-8">
              <h3 className="font-tech-landeros text-2xl font-black text-[#311081] mb-4 uppercase tracking-tight leading-none">
                "Save 20+ Hours & Accelerated Draws. Or You Pay $0."
              </h3>
              <p className="font-bold text-xs text-[#1C1629] leading-relaxed max-w-2xl">
                We believe in mathematical guarantees, not sales talk. If BIGlogic does not save your estimating team at least 20 hours of manual administration and accelerate your outstanding bank draw schedule payouts by at least 15 days in your first 30 days of active operations, we will refund every single penny you paid. No awkward phone calls. No fine print. We'll let you keep all your generated excel models and compliance files for free.
              </p>
            </div>
            
            <div className="md:col-span-4 flex flex-col items-center justify-center border-l md:border-l border-[#311081]/5 pl-0 md:pl-8 text-center md:text-left h-full">
              <div className="w-20 h-20 bg-[#F6F1FC] border border-[#6D28D9]/10 rounded-3xl flex items-center justify-center mb-4 text-[#311081] shadow-inner">
                <ShieldCheck className="w-10 h-10 text-[#6D28D9]" />
              </div>
              <span className="font-tech-landeros text-[10px] font-extrabold text-[#311081] uppercase tracking-wider block">
                100% Guaranteed
              </span>
              <span className="text-[9px] font-bold text-[#6D28D9] uppercase tracking-wider mt-1 block">
                Alex Hormozi Approved
              </span>
            </div>

          </div>
        </div>

        {/* Bottom trust indicator badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-[10px] font-bold font-tech-landeros text-[#311081]/60">
          <span>&bull; CANCEL ANYTIME</span>
          <span>&bull; SECURE SOC-2 TYPE II ENCRYPTION</span>
          <span>&bull; NO SETUP FEES</span>
          <span>&bull; UNLIMITED PM USER SEATS</span>
        </div>

      </div>
    </section>
  );
};
