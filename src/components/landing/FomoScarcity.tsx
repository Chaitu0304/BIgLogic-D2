import { motion } from "framer-motion";
import { TrendingDown, AlertTriangle, Clock, ArrowRight, ShieldAlert, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FomoScarcity = () => {
  const navigate = useNavigate();

  const costs = [
    {
      period: "1 WEEK STALL",
      wasted: "$3,375",
      choked: "$45,000",
      impact: "Estimator overhead wasted on copy-paste manual spreadsheet tasks.",
      badColor: "text-red-500 bg-red-500/10 border-red-500/20"
    },
    {
      period: "1 MONTH STALL",
      wasted: "$13,500",
      choked: "$180,000",
      impact: "Cash flow choking delays while banking reviewers audit draws manually.",
      badColor: "text-red-600 bg-red-500/15 border-red-500/25"
    },
    {
      period: "6 MONTHS STALL",
      wasted: "$81,000",
      choked: "$1,080,000",
      impact: "Severe scale limits. Armies of administrative coordinators eating margins.",
      badColor: "text-red-700 bg-red-500/20 border-red-500/30"
    }
  ];

  const activities = [
    { text: "Contractor in Florida claimed a $42,500 draw milestone", time: "4 mins ago" },
    { text: "Estimator in Ohio processed 84-page estimate in 38 seconds", time: "12 mins ago" },
    { text: "Firm in Texas unlocked $89,000 capital, avoiding carrier delay", time: "27 mins ago" },
    { text: "Reconstruction team in California saved 18 hours of manual data entry", time: "41 mins ago" }
  ];

  return (
    <section id="scarcity-fomo" className="py-24 bg-premium-luxury-gradient bg-grid-premium border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background Studio Light vignette */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-tr from-black/2 to-transparent rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6 shadow-sm">
            <ShieldAlert className="w-4 h-4 text-[#0A0A0A]" />
            <span>THE COST OF INACTION</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            The Cost of Stalling. <br />
            What Inaction Drains From Your Firm.
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#6B6B6B] max-w-2xl leading-relaxed">
            Every week your team spends manually copying Xactimate data into spreadsheets is cash leaking from your margins and capital choked in banker review. Stop waiting.
          </p>
        </div>

        {/* Core FOMO Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl mx-auto items-stretch">
          
          {/* Left Column: Cost of Inaction Ledger (7 Cols) */}
          <div className="lg:col-span-7 bg-white border border-black/8 rounded-[32px] p-8 shadow-landeros hover:border-black/15 transition-all duration-300 flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 border border-red-500/10 text-red-500 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros">
                <TrendingDown className="w-3.5 h-3.5 stroke-[3]" />
                STALLING PROGRESSION TABLE:
              </div>

              <div className="divide-y divide-black/5">
                {costs.map((item, i) => (
                  <div key={i} className="py-6 first:pt-0 last:pb-0 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
                    <div className="text-left max-w-md">
                      <span className="text-[10px] font-bold tracking-wider font-tech-landeros text-black/40 block mb-1">{item.period}</span>
                      <h4 className="font-tech-landeros text-base font-bold text-[#0A0A0A] mb-1">{item.impact}</h4>
                    </div>
                    
                    <div className="flex gap-4 items-center shrink-0">
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#6B6B6B] block">ADMIN WASTES</span>
                        <span className="text-lg font-black text-red-500 font-display-landeros">{item.wasted}</span>
                      </div>
                      <div className="w-[1px] h-8 bg-black/10" />
                      <div className="text-right">
                        <span className="text-xs font-bold text-[#6B6B6B] block">CAPITAL CHOKED</span>
                        <span className="text-lg font-black text-[#0A0A0A] font-display-landeros">{item.choked}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-black/5 pt-6 mt-8 text-left">
              <p className="text-[10px] font-bold text-[#6B6B6B] leading-relaxed uppercase tracking-wider font-tech-landeros">
                * Calculations based on standard baseline of 4.5 hours saved per claim file, 10 claim uploads/week, billed at $75/hr estimator wage + 45-day lender approval delays.
              </p>
            </div>
          </div>

          {/* Right Column: Scarcity Live Board (5 Cols) */}
          <div className="lg:col-span-5 bg-black/5 border border-black/8 rounded-[32px] p-8 shadow-landeros hover:border-black/15 transition-all duration-300 flex flex-col justify-between text-left">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-black/8 text-[#0A0A0A] font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros shadow-sm">
                <Clock className="w-3.5 h-3.5" />
                AVAILABILITY TICKER
              </div>

              {/* Scarcity Seat Progress Bar */}
              <div className="bg-white border border-black/8 rounded-2xl p-6 shadow-sm mb-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#6B6B6B] font-tech-landeros">BETA COHORT ENROLLMENT</span>
                  <span className="text-xs font-bold text-emerald-600 font-tech-landeros animate-pulse uppercase flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                    13 Seats Left
                  </span>
                </div>
                
                {/* Horizontal Progress bar */}
                <div className="w-full h-3 bg-[#F5F5F3] border border-black/5 rounded-full overflow-hidden mb-2">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-[#0A0A0A] rounded-full" style={{ width: "87%" }} />
                </div>
                
                <span className="text-[10px] font-bold text-[#6B6B6B] font-tech-landeros">87 OF 100 COHORT SEATS CLAIMED &bull; 87% CAPACITY reached</span>
              </div>

              {/* Live activity ticker */}
              <div className="space-y-3">
                <span className="text-[9px] font-bold uppercase tracking-wider text-[#6B6B6B] font-tech-landeros block mb-1">LIVE PIPELINE EVENTS:</span>
                {activities.map((act, i) => (
                  <div key={i} className="flex justify-between items-center gap-4 bg-white/70 border border-black/5 p-3 rounded-xl text-xs font-semibold shadow-inner">
                    <span className="text-[#3A3A3A] truncate">{act.text}</span>
                    <span className="text-[9px] font-bold text-[#6B6B6B] shrink-0 font-tech-landeros uppercase">{act.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 border-t border-black/5 pt-6">
              <button
                onClick={() => navigate("/signup")}
                className="w-full btn-landeros-primary py-4 text-xs tracking-widest flex items-center justify-center gap-2 font-bold text-black"
              >
                <Sparkles className="w-4 h-4 text-black fill-current" />
                SECURE YOUR BETA SLOT FOR FREE <ArrowRight className="w-4 h-4 text-black" />
              </button>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
};
