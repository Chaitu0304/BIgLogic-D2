import { BarChart2, ShieldX, ShieldCheck, HelpCircle } from "lucide-react";

export const WhyBigLogic = () => {
  const tableRows = [
    {
      metric: "Processing Speed",
      manual: "4 - 12 hours of copy-pasting",
      manualBad: true,
      biglogic: "45 seconds automated",
      biglogicGood: true
    },
    {
      metric: "Lender Draw Payouts",
      manual: "30 - 45 days waiting for approval",
      manualBad: true,
      biglogic: "Draws cleared in 48 hours",
      biglogicGood: true
    },
    {
      metric: "Extraction Accuracy",
      manual: "8.2% human entry error rate",
      manualBad: true,
      biglogic: "99.8% audit-grade accuracy",
      biglogicGood: true
    },
    {
      metric: "Insurance Disputes",
      manual: "1 out of 4 files get pushed back",
      manualBad: true,
      biglogic: "Pre-audited compliance",
      biglogicGood: true
    },
    {
      metric: "Cost Per Estimate",
      manual: "Estimated $300 in office labor",
      manualBad: true,
      biglogic: "$1.50 average or FREE",
      biglogicGood: true
    }
  ];

  return (
    <section id="why-us" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-[#6D28D9]/3 to-transparent rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <BarChart2 className="w-4 h-4 text-[#6D28D9]" />
            <span>SIDE-BY-SIDE TABULAR COMPARISON</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
            The Restoration Math. <br />
            Manual vs. BigLogicAI.
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#645D75] max-w-2xl leading-relaxed">
            Stop guessing if automation is worth it. Here is the cold, hard mathematical breakdown of doing things the old way versus cashing draws immediately.
          </p>
        </div>

        {/* Tabular LanderOS Layout */}
        <div className="w-full max-w-6xl mx-auto border border-[#311081]/10 bg-white rounded-3xl shadow-landeros-lg hover:shadow-[0_25px_60px_rgba(109,40,217,0.15)] hover:border-[#6D28D9]/35 transition-all duration-300 overflow-hidden">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#311081] text-white font-tech-landeros uppercase text-[11px] tracking-wider items-center text-left">
            <div className="md:col-span-4 p-6 font-bold">PERFORMANCE METRIC</div>
            <div className="md:col-span-4 p-6 border-t md:border-t-0 md:border-l border-white/10 bg-white/5 flex items-center gap-2 font-bold text-slate-300">
              <ShieldX className="w-4 h-4 shrink-0 text-red-400" />
              THE SLOW MANUAL WAY
            </div>
            <div className="md:col-span-4 p-6 border-t md:border-t-0 md:border-l border-white/10 bg-white/10 flex items-center gap-2 font-bold text-white">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              THE BIGLOGICAI WAY
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-[#311081]/5">
            {tableRows.map((row, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-12 items-center text-left hover:bg-[#F6F1FC]/20 transition-colors duration-250">
                
                {/* Metric Title */}
                <div className="md:col-span-4 p-6 font-tech-landeros text-base font-bold text-[#311081] bg-[#F6F1FC]/10 h-full flex items-center border-b md:border-b-0 border-[#311081]/5">
                  {row.metric}
                </div>
                
                {/* Manual Way details */}
                <div className="md:col-span-4 p-6 md:border-l border-[#311081]/5 h-full flex items-center text-[#645D75] bg-red-500/[0.01] border-b md:border-b-0 border-[#311081]/5">
                  <span className="flex items-center gap-2.5 font-medium text-sm text-[#8B3B3B]">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {row.manual}
                  </span>
                </div>
                
                {/* BigLogicAI details */}
                <div className="md:col-span-4 p-6 md:border-l border-[#311081]/5 h-full flex items-center text-[#311081] bg-[#6D28D9]/[0.02]">
                  <span className="flex items-center gap-2.5 font-semibold text-sm text-[#4F46E5]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    {row.biglogic}
                  </span>
                </div>

              </div>
            ))}
          </div>

        </div>

        {/* Math explanation callout */}
        <div className="mt-8 max-w-6xl mx-auto flex items-center gap-3 text-xs font-medium text-[#645D75] text-left">
          <HelpCircle className="w-4 h-4 text-[#6D28D9] shrink-0" />
          <p>
            Numbers gathered from a standard operational review of 420 active restoration and reconstruction projects across commercial water, fire, and residential rebuild contracts in the United States.
          </p>
        </div>

      </div>
    </section>
  );
};

