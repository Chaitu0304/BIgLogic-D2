import { 
  CalendarRange, 
  Search, 
  ShieldAlert, 
  FileSpreadsheet,
  ShieldCheck,
  Zap,
  TrendingUp
} from "lucide-react";

export const Services = () => {
  const agents = [
    {
      num: "01",
      icon: CalendarRange,
      title: "AI Draw Schedule Agent",
      description: "Automatically builds milestone-based draw schedules from Xactimate estimates. Generates lender-ready draw packages that align with standard banking percentages. Accelerates draw approval times from 45 days down to less than 4 days.",
      value: "$1,200/mo of estimator time saved",
      accent: "#311081"
    },
    {
      num: "02",
      icon: Search,
      title: "Deep Material Extractor",
      description: "Scans hundreds of estimate pages instantly. Isolates and compiles homeowner-selection items (cabinets, trim, granite types, flooring styles) hidden in complex line items, preventing PM purchasing errors and ensuring perfect execution.",
      value: "$800/mo in avoided purchasing errors",
      accent: "#311081"
    },
    {
      num: "03",
      icon: ShieldAlert,
      title: "Carrier Guideline Auditor",
      description: "Stops insurer pushback before it starts. Automatically audits your PDF or ESX files against guidelines for the top 10 major U.S. insurance carriers, flagging compliance issues and ensuring 99.8% audit-grade payouts.",
      value: "$1,500/mo in avoided carrier dispute costs",
      accent: "#311081"
    },
    {
      num: "04",
      icon: FileSpreadsheet,
      title: "Excel & Document Compiler",
      description: "Instantly compiles unstructured estimate lines into clean, branded Excel sheets and PDF schedules. Chat with your entire database of company projects using Company Brain to retrieve historic cost averages in seconds.",
      value: "$500/mo in administrative savings",
      accent: "#311081"
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background soft glows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[350px] h-[350px] bg-gradient-to-tr from-[#6D28D9]/5 to-transparent rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-10 right-0 w-[300px] h-[300px] bg-gradient-to-bl from-[#4F46E5]/5 to-transparent rounded-full blur-[90px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Section Header */}
        <div className="max-w-4xl mb-20 text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <TrendingUp className="w-4 h-4 text-[#6D28D9]" />
            <span>HOW WE GENERATE A $4,000/MONTH VALUE FOR CONTRACTORS</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
            Four Dedicated AI Agents. <br />
            Working 24/7/365 Inside Your Business.
          </h2>
          
          <p className="text-lg md:text-xl font-semibold text-[#3C354D] max-w-3xl leading-relaxed">
            Stop paying skilled estimators to do manual copy-paste administrative work. Stop waiting weeks for bank draw inspections. Deploy specific, trained agents in seconds with zero setup.
          </p>
        </div>

        {/* Premium Agents Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-7xl mx-auto">
          {agents.map((agent, index) => {
            const Icon = agent.icon;
            return (
              <div 
                key={index} 
                className="bg-white border border-[#311081]/8 p-8 rounded-3xl flex flex-col justify-between relative group overflow-hidden hover-premium-card z-10"
              >
                {/* Backdrop Glow */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-[#6D28D9]/5 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                {/* Massive Number Stamp */}
                <div className="absolute top-4 right-6 font-display-landeros text-6xl md:text-8xl font-extrabold text-[#311081]/5 select-none transition-colors group-hover:text-[#6D28D9]/10">
                  {agent.num}
                </div>

                <div>
                  {/* Icon Block */}
                  <div className="w-14 h-14 bg-[#F6F1FC] border border-[#311081]/5 rounded-2xl flex items-center justify-center mb-6 text-[#311081] group-hover:bg-[#311081] group-hover:text-white transition-all duration-300 shadow-sm">
                    <Icon className="w-6 h-6 stroke-[2]" />
                  </div>

                  {/* Title */}
                  <h3 className="font-tech-landeros text-xl md:text-2xl font-bold mb-4 text-[#311081] group-hover:text-[#6D28D9] transition-colors">
                    {agent.title}
                  </h3>

                  {/* Description */}
                  <p className="font-semibold text-sm leading-relaxed text-[#3C354D] mb-8 max-w-md">
                    {agent.description}
                  </p>
                </div>

                {/* Value Stack Tag */}
                <div className="border-t border-[#311081]/5 pt-4 mt-auto">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#F6F1FC] border border-[#311081]/10 font-bold uppercase tracking-wider text-[10px] text-[#311081] group-hover:border-[#6D28D9]/30 transition-all duration-300">
                    <Zap className="w-3.5 h-3.5 fill-[#311081]/20 text-[#311081]" />
                    {agent.value}
                  </div>
                </div>

              </div>
            );
          })}
        </div>

        {/* Bottom Verification Banner */}
        <div className="mt-20 bg-white border border-[#311081]/8 p-8 shadow-landeros rounded-3xl max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-[#6D28D9]/3 to-transparent pointer-events-none" />
          
          <div className="flex items-center gap-4 text-left relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-[#F6F1FC] border border-[#6D28D9]/10 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6 text-[#6D28D9]" />
            </div>
            <div>
              <h4 className="font-tech-landeros font-bold text-xs tracking-wider text-[#311081] uppercase">Audit-Grade Validation Engine</h4>
              <p className="text-xs font-bold text-[#3C354D] mt-0.5">Every draw schedule is formatted according to major U.S. bank & lender standards.</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold font-tech-landeros text-[#311081]/80 relative z-10">
            <span className="px-3 py-1 rounded-full bg-[#FCFBFE] border border-[#311081]/5 shadow-sm">&bull; SOC 2 TYPE II SECURE</span>
            <span className="px-3 py-1 rounded-full bg-[#FCFBFE] border border-[#311081]/5 shadow-sm">&bull; HIPAA GRADE ENCRYPTION</span>
            <span className="px-3 py-1 rounded-full bg-[#FCFBFE] border border-[#311081]/5 shadow-sm">&bull; CARRIER UPDATE DAILY</span>
          </div>
        </div>

      </div>
    </section>
  );
};
