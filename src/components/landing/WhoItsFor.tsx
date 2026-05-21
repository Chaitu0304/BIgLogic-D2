import { Check, X, Users2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const WhoItsFor = () => {
  const navigate = useNavigate();

  const fits = [
    {
      title: "Active Restoration Contractors",
      desc: "Contractors managing residential or commercial claims who are sick of wasting 15+ hours a week manually copy-pasting estimate details."
    },
    {
      title: "Firms Struggling With Lender Draws",
      desc: "Owners whose working capital is constantly choked because banks take weeks to review disorganized draw schedules and line items."
    },
    {
      title: "Growth-Minded Estimators",
      desc: "Estimating teams who want to process 5x more files per week, avoid human purchasing errors, and guarantee carrier-compliant outputs."
    }
  ];

  const nonFits = [
    {
      title: "Contractors Who Enjoy Manual Admin",
      desc: "Firms that prefer keeping estimators chained to spreadsheets typing line items rather than scheduling projects and completing jobs."
    },
    {
      title: "Firms With Infinite Cash Reserves",
      desc: "If your bank account has millions in excess liquidity and you don't care if a lender takes 60 days to pay out your draws, you don't need us."
    },
    {
      title: "Magic Bullet Seekers",
      desc: "Our AI is highly optimized, but it requires estimate files as inputs. It streamlines estimates and cash flows, but it won't do physical construction."
    }
  ];

  return (
    <section id="who-its-for" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-[#6D28D9]/3 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <Users2 className="w-4 h-4 text-[#6D28D9]" />
            <span>QUALIFICATION FILTER</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
            Is BigLogicAI Actually <br />
            Right For Your Business?
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#3C354D] max-w-2xl leading-relaxed">
            Let's be completely transparent. We built this tool for high-performance reconstruction teams. Read below to see if your operation fits our model.
          </p>
        </div>

        {/* Stark Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">
          
          {/* WHO WE HELP */}
          <div className="bg-white border border-[#311081]/8 p-8 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden hover-premium-card z-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-500/5 to-transparent rounded-full pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-50 border border-green-500/10 text-green-700 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                WHO THIS IS FOR:
              </div>
              
              <div className="space-y-8">
                {fits.map((fit, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center shrink-0 mt-1 text-white">
                       <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-lg font-bold text-[#311081] mb-1">{fit.title}</h4>
                      <p className="font-semibold text-sm text-[#3C354D] leading-relaxed">{fit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#311081]/5 pt-6 mt-12">
              <button
                onClick={() => navigate("/signup")}
                className="w-full py-4 text-center font-bold uppercase text-xs tracking-widest btn-landeros-primary"
              >
                THIS IS ME &mdash; LET'S START FREE
              </button>
            </div>

          </div>

          {/* WHO WE DO NOT HELP */}
          <div className="bg-[#F6F1FC]/20 border border-[#311081]/5 p-8 rounded-3xl flex flex-col justify-between text-left relative hover-premium-card z-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/5 to-transparent rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#311081]/5 text-[#311081]/60 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros">
                <X className="w-3.5 h-3.5 stroke-[3]" />
                WHO WE CANNOT HELP:
              </div>
              
              <div className="space-y-8">
                {nonFits.map((fit, i) => (
                  <div key={i} className="flex gap-4 items-start opacity-70">
                    <div className="w-6 h-6 rounded-full bg-[#311081]/10 flex items-center justify-center shrink-0 mt-1 text-[#311081]/60">
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-lg font-bold text-[#311081]/70 mb-1">{fit.title}</h4>
                      <p className="font-semibold text-sm text-[#3C354D]/90 leading-relaxed">{fit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-[#311081]/5 pt-6 mt-12 relative z-10">
              <div className="w-full py-4 text-center font-bold uppercase text-xs tracking-widest text-[#311081]/40 border border-[#311081]/10 rounded-full bg-[#FCFBFE] select-none">
                NOT A FIT FOR OUR SYSTEM
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
