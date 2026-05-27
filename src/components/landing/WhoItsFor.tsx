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
    <section id="who-its-for" className="py-24 bg-premium-luxury-gradient-alt bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-10 left-10 w-[350px] h-[350px] bg-gradient-to-tr from-black/3 to-transparent rounded-full blur-[100px] pointer-events-none" />
 
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F0F0F0] border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6">
            <Users2 className="w-4 h-4 text-[#6B6B6B]" />
            <span>QUALIFICATION FILTER</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            Is BigLogicAI Actually <br />
            Right For Your Business?
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#3A3A3A] max-w-2xl leading-relaxed">
            Let's be completely transparent. We built this tool for high-performance reconstruction teams. Read below to see if your operation fits our model.
          </p>
        </div>
 
        {/* Stark Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto items-stretch">
          
          {/* WHO WE HELP */}
          <div className="bg-[#F8F8F8] border border-black/5 p-8 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden hover-premium-card z-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-green-500/[0.02] to-transparent rounded-full pointer-events-none" />
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-green-950/30 border border-green-500/20 text-green-400 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
                WHO THIS IS FOR:
              </div>
              
              <div className="space-y-8">
                {fits.map((fit, i) => (
                  <div key={i} className="flex gap-4 items-start">
                    <div className="w-6 h-6 rounded-full bg-green-600 flex items-center justify-center shrink-0 mt-1 text-white">
                       <Check className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-lg font-bold text-[#0A0A0A] mb-1">{fit.title}</h4>
                      <p className="font-semibold text-sm text-[#6B6B6B] leading-relaxed">{fit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="border-t border-black/5 pt-6 mt-12">
              <button
                onClick={() => navigate("/signup")}
                className="w-full py-4 text-center font-bold uppercase text-xs tracking-widest btn-landeros-primary text-black"
              >
                THIS IS ME &mdash; LET'S START FREE
              </button>
            </div>
 
          </div>
 
          {/* WHO WE DO NOT HELP */}
          <div className="bg-[#F0F0F0] border border-black/8 p-8 rounded-3xl flex flex-col justify-between text-left relative hover-premium-card z-10">
            <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-red-500/[0.02] to-transparent rounded-full pointer-events-none" />
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/5 border border-black/10 text-[#6B6B6B] font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros">
                <X className="w-3.5 h-3.5 stroke-[3]" />
                WHO WE CANNOT HELP:
              </div>
              
              <div className="space-y-8">
                {nonFits.map((fit, i) => (
                  <div key={i} className="flex gap-4 items-start opacity-70">
                    <div className="w-6 h-6 rounded-full bg-black/8 flex items-center justify-center shrink-0 mt-1 text-[#6B6B6B]">
                      <X className="w-3.5 h-3.5 stroke-[3]" />
                    </div>
                    <div>
                      <h4 className="font-tech-landeros text-lg font-bold text-[#6B6B6B] mb-1">{fit.title}</h4>
                      <p className="font-semibold text-sm text-[#6B6B6B]/70 leading-relaxed">{fit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
 
            <div className="border-t border-black/8 pt-6 mt-12 relative z-10">
              <div className="w-full py-4 text-center font-bold uppercase text-xs tracking-widest text-[#6B6B6B] border border-black/8 rounded-full bg-black/5 select-none">
                NOT A FIT FOR OUR SYSTEM
              </div>
            </div>
 
          </div>
 
        </div>
 
      </div>
    </section>
  );
};
