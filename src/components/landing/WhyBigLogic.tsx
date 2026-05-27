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
    <section id="why-us" className="py-24 bg-premium-luxury-gradient bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/4 right-0 w-[450px] h-[450px] bg-gradient-to-bl from-black/3 to-transparent rounded-full blur-[120px] pointer-events-none" />
 
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F0F0] border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6">
            <BarChart2 className="w-4 h-4 text-neutral-400" />
            <span>SIDE-BY-SIDE TABULAR COMPARISON</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            The Restoration Math. <br />
            Manual vs. BigLogicAI.
          </h2>
          <p className="text-lg md:text-xl font-medium text-[#6B6B6B] max-w-2xl leading-relaxed">
            Stop guessing if automation is worth it. Here is the cold, hard mathematical breakdown of doing things the old way versus cashing draws immediately.
          </p>
        </div>
 
        {/* Tabular LanderOS Layout */}
        <div className="w-full max-w-6xl mx-auto border border-black/8 bg-white shadow-[0_4px_20px_rgba(0,0,0,0.06)] hover:border-black/15 transition-all duration-300 overflow-hidden">
          
          {/* Header Row */}
          <div className="grid grid-cols-1 md:grid-cols-12 bg-[#F0F0F0] text-[#0A0A0A] font-tech-landeros uppercase text-[11px] tracking-wider items-center text-left">
            <div className="md:col-span-4 p-6 font-bold text-[#0A0A0A]">PERFORMANCE METRIC</div>
            <div className="md:col-span-4 p-6 border-t md:border-t-0 md:border-l border-black/10 bg-black/5 flex items-center gap-2 font-bold text-[#0A0A0A]">
              <ShieldX className="w-4 h-4 shrink-0 text-red-400" />
              THE SLOW MANUAL WAY
            </div>
            <div className="md:col-span-4 p-6 border-t md:border-t-0 md:border-l border-black/10 bg-black/[0.08] flex items-center gap-2 font-bold text-[#0A0A0A]">
              <ShieldCheck className="w-4 h-4 shrink-0 text-emerald-400" />
              THE BIGLOGICAI WAY
            </div>
          </div>
 
          {/* Table Body */}
          <div className="divide-y divide-black/5">
            {tableRows.map((row, index) => (
              <div key={index} className={`grid grid-cols-1 md:grid-cols-12 items-center text-left transition-colors duration-250 ${index % 2 === 0 ? 'bg-white' : 'bg-[#F8F8F8]'} hover:bg-black/[0.02]`}>
                
                {/* Metric Title */}
                <div className="md:col-span-4 p-6 font-tech-landeros text-base font-bold text-[#0A0A0A] h-full flex items-center border-b md:border-b-0 border-black/5">
                  {row.metric}
                </div>
                
                {/* Manual Way details */}
                <div className="md:col-span-4 p-6 md:border-l border-black/5 h-full flex items-center border-b md:border-b-0 border-black/5">
                  <span className="flex items-center gap-2.5 font-medium text-sm text-red-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 shrink-0" />
                    {row.manual}
                  </span>
                </div>
                
                {/* BigLogicAI details */}
                <div className="md:col-span-4 p-6 md:border-l border-black/5 h-full flex items-center">
                  <span className="flex items-center gap-2.5 font-semibold text-sm text-[#0A0A0A]">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                    {row.biglogic}
                  </span>
                </div>
 
              </div>
            ))}
          </div>
 
        </div>
 
        {/* Math explanation callout */}
        <div className="mt-8 max-w-6xl mx-auto flex items-center gap-3 text-xs font-medium text-[#6B6B6B] text-left">
          <HelpCircle className="w-4 h-4 text-[#6B6B6B] shrink-0" />
          <p>
            Numbers gathered from a standard operational review of 420 active restoration and reconstruction projects across commercial water, fire, and residential rebuild contracts in the United States.
          </p>
        </div>
 
      </div>
    </section>
  );
};
