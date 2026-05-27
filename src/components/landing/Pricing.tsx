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
    <section id="pricing" className="py-24 md:py-32 bg-premium-luxury-gradient relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
        
        {/* Section badge tag */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 border border-black/10 font-tech-landeros text-xs font-black uppercase tracking-widest text-[#0A0A0A] mb-6">
          <Zap className="w-3.5 h-3.5 fill-[#0A0A0A]/20" /> PRICING PLANS
        </div>

        {/* Section Heading */}
        <h2 className="font-display-landeros text-4xl md:text-6xl font-black text-[#0A0A0A] uppercase tracking-tighter leading-none mb-6">
          FAIR & ETHICAL <span className="text-[#6B6B6B]">INVESTMENT.</span>
        </h2>
        
        {/* Section Subheading */}
        <p className="font-bold text-sm text-[#6B6B6B] uppercase tracking-widest max-w-xl mx-auto mb-12">
          Pick your tier. Zero setup fees. 100% money-back guarantee.
        </p>

        {/* Billing Toggle capsule */}
        <div className="inline-flex items-center gap-2 p-1.5 bg-[#F0F0F0] border border-black/10 rounded-full mb-16 shadow-inner">
          <button
            onClick={() => setIsAnnual(false)}
            className={`px-5 py-2 rounded-full text-xs font-bold font-tech-landeros uppercase tracking-wider transition-all duration-300 ${
              !isAnnual
                ? "bg-white text-[#0A0A0A] shadow-md border border-black/5"
                : "text-[#6B6B6B] hover:text-[#0A0A0A]"
            }`}
          >
            Monthly
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`px-5 py-2 rounded-full text-xs font-bold font-tech-landeros uppercase tracking-wider transition-all duration-300 flex items-center gap-2 ${
              isAnnual
                ? "bg-white text-[#0A0A0A] shadow-md border border-black/5"
                : "text-[#6B6B6B] hover:text-[#0A0A0A]"
            }`}
          >
            <span>Annually</span>
            <span className="bg-[#0A0A0A] text-white text-[9px] font-black font-tech-landeros px-2 py-0.5 rounded-full shrink-0 tracking-wider">
              SAVE 20%
            </span>
          </button>
        </div>

        {/* Plans Container Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20 text-left items-stretch">
          {plans.map((plan, index) => {
            const currentPrice = isAnnual ? plan.annualPrice : plan.monthlyPrice;
            return (
              <div
                key={index}
                className={`relative flex flex-col justify-between rounded-[32px] p-8 md:p-10 border transition-all duration-500 hover-premium-card group z-10 overflow-hidden ${
                  plan.popular
                    ? "bg-[#0A0A0A] text-white border-transparent scale-100 lg:scale-[1.02] shadow-[0_20px_50px_rgba(0,0,0,0.3)] z-20"
                    : "bg-[#F8F8F8] text-[#0A0A0A] border-black/8 hover:border-black/15 shadow-[0_4px_30px_rgba(0,0,0,0.02)]"
                }`}
              >
                {/* Popular Glow Ring */}
                {plan.popular && (
                  <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-white/10 to-transparent rounded-full pointer-events-none" />
                )}

                {/* Popular Ribbon Label */}
                {plan.popular && (
                  <div className="absolute top-6 right-6">
                    <span className="bg-white text-[#0A0A0A] text-xs font-black font-tech-landeros uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-md flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 fill-current text-[#0A0A0A]" /> MOST POPULAR
                    </span>
                  </div>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className={`font-tech-landeros text-2xl font-black mb-2 uppercase tracking-tight ${
                    plan.popular ? "text-white" : "text-[#0A0A0A]"
                  }`}>
                    {plan.name}
                  </h3>
                  
                  {/* Tagline */}
                  <p className={`text-sm font-bold mb-6 ${
                    plan.popular ? "text-white/80" : "text-[#6B6B6B]"
                  }`}>
                    {plan.tagline}
                  </p>

                  {/* Monthly Pricing digits */}
                  <div className={`flex items-baseline gap-2 mb-6 border-b pb-6 ${
                    plan.popular ? "border-white/10" : "border-black/5"
                  }`}>
                    <span className={`text-5xl md:text-6xl font-black font-display-landeros ${
                      plan.popular ? "text-white" : "text-[#0A0A0A]"
                    }`}>
                      ${currentPrice}
                    </span>
                    <span className={`text-sm font-bold tracking-wider uppercase font-tech-landeros ${
                      plan.popular ? "text-white/70" : "text-[#6B6B6B]"
                    }`}>
                      / month
                    </span>
                    {isAnnual && (
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded-full tracking-wider font-tech-landeros shrink-0 ml-2 border ${
                        plan.popular
                          ? "text-white bg-white/10 border-white/20"
                          : "text-[#0A0A0A] bg-black/5 border-black/10"
                      }`}>
                        BILLED ANNUALLY
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p className={`font-semibold text-sm leading-relaxed mb-8 ${
                    plan.popular ? "text-white/90" : "text-[#3A3A3A]"
                  }`}>
                    {plan.description}
                  </p>

                  {/* Features checklist */}
                  <ul className="space-y-4 mb-10 text-left">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-300 shadow-sm border ${
                          plan.popular
                            ? "bg-white/10 border-white/20 text-white"
                            : "bg-black/5 border-black/10 text-[#0A0A0A]"
                        }`}>
                          <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                        </div>
                        <span className={`text-sm font-semibold leading-relaxed font-sans-landeros ${
                          plan.popular ? "text-white/90" : "text-[#2A2A2A]"
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Staked value indicator tag */}
                <div className={`border-t pt-6 mt-auto ${
                  plan.popular ? "border-white/10" : "border-black/5"
                }`}>
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl font-bold uppercase tracking-wider text-xs mb-6 border ${
                    plan.popular
                      ? "bg-white/10 border-white/20 text-white"
                      : "bg-black/5 border-black/10 text-[#0A0A0A]"
                  }`}>
                    <Zap className={`w-3.5 h-3.5 ${
                      plan.popular ? "fill-white/20 text-white" : "fill-black/20 text-[#0A0A0A]"
                    }`} />
                    {plan.valueStack}
                  </div>
                  
                  <button
                    onClick={() => navigate("/signup")}
                    className={`w-full h-14 text-xs font-extrabold uppercase tracking-widest flex items-center justify-center gap-2 group/btn relative overflow-hidden transition-all duration-300 border ${
                      plan.popular
                        ? "bg-white text-[#0A0A0A] hover:bg-white/90 border-transparent"
                        : "bg-[#0A0A0A] text-white hover:bg-[#2A2A2A] border-transparent"
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
        <div className="max-w-4xl mx-auto bg-[#F8F8F8] border border-black/8 rounded-[32px] p-8 md:p-12 shadow-sm relative text-left hover-premium-card z-10 overflow-visible">
          {/* Nested container to clip the radial flare within rounded corners */}
          <div className="absolute inset-0 rounded-[32px] overflow-hidden pointer-events-none z-0">
            <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-black/5 to-transparent rounded-full" />
          </div>
          
          <div className="absolute top-0 left-8 -translate-y-1/2 px-5 py-1.5 rounded-full bg-gradient-to-r from-[#0A0A0A] to-[#2A2A2A] text-white text-xs font-bold uppercase tracking-widest shadow-md font-tech-landeros flex items-center gap-1.5 z-40">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            THE BIGLOGIC 100% RISK-REVERSAL CONTRACT
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center mt-4 relative z-10">
            
            <div className="md:col-span-8">
              <h3 className="font-tech-landeros text-2xl font-black text-[#0A0A0A] mb-4 uppercase tracking-tight leading-none">
                "Save 20+ Hours & Accelerated Draws. Or You Pay $0."
              </h3>
              <p className="font-bold text-sm text-[#2A2A2A] leading-relaxed max-w-2xl">
                We believe in mathematical guarantees, not sales talk. If BIGlogic does not save your estimating team at least 20 hours of manual administration and accelerate your outstanding bank draw schedule payouts by at least 15 days in your first 30 days of active operations, we will refund every single penny you paid. No awkward phone calls. No fine print. We'll let you keep all your generated excel models and compliance files for free.
              </p>
            </div>
            
            <div className="md:col-span-4 flex flex-col items-center justify-center border-l border-black/10 pl-0 md:pl-8 text-center md:text-left h-full">
              <div className="w-20 h-20 bg-white border border-black/10 rounded-3xl flex items-center justify-center mb-4 text-[#0A0A0A] shadow-inner">
                <ShieldCheck className="w-10 h-10 text-[#0A0A0A]" />
              </div>
              <span className="font-tech-landeros text-xs font-extrabold text-[#0A0A0A] uppercase tracking-wider block">
                100% Guaranteed
              </span>
              <span className="text-xs font-bold text-[#6B6B6B] uppercase tracking-wider mt-1 block">
                Alex Hormozi Approved
              </span>
            </div>

          </div>
        </div>

        {/* Bottom trust indicator badges */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-6 text-xs font-bold font-tech-landeros text-[#6B6B6B]">
          <span>&bull; CANCEL ANYTIME</span>
          <span>&bull; SECURE SOC-2 TYPE II ENCRYPTION</span>
          <span>&bull; NO SETUP FEES</span>
          <span>&bull; UNLIMITED PM USER SEATS</span>
        </div>

      </div>
    </section>
  );
};
