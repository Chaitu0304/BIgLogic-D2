import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

export const Faq = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleItem = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Are these AI-generated draw schedules carrier-compliant?",
      answer: "Yes, 100%. Our intelligence engine is trained directly on the active frameworks of the top 10 U.S. insurance carriers and standardized Xactimate line item categories. This ensures your draw milestone payouts flow smoothly without triggering compliance alerts or manual review audits."
    },
    {
      question: "What if a lender requires custom draw schedule milestones?",
      answer: "No problem. While our AI Draw Schedule Agent automatically generates optimized milestoning based on banker standards, you can easily adjust milestones, percentage splits, retention ratios, and groupings inside your active dashboard in seconds to fit any custom bank demand."
    },
    {
      question: "Is my customer and estimate data safe and secure?",
      answer: "Absolutely. We are built on SOC 2 Type II compliance architectures with end-to-end AES-256 encryption. Your estimates and project files are processed in isolated workspaces and are never aggregated or used to train public AI models. Your IP stays entirely yours."
    },
    {
      question: "How long does a massive 200-page commercial estimate take to process?",
      answer: "Standard residential estimates take under 30 seconds. Extremely large commercial losses containing thousands of line items may take up to 90 seconds. Still, this is 95% faster than having an estimator manually scan lines and type them into Excel."
    },
    {
      question: "Do I need a credit card to claim my 3 free estimate uploads?",
      answer: "No. We believe in showing the math first. You do not need to enter a credit card, sign any contracts, or jump on high-pressure sales calls to process your first 3 estimates. Just signup, upload your PDF, and get your structured files instantly."
    }
  ];

  return (
    <section id="faq" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-tr from-[#6D28D9]/3 to-transparent rounded-full blur-[100px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-start max-w-7xl mx-auto">
          
          {/* Left Column (5 cols) */}
          <div className="lg:col-span-5 text-left lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
              <HelpCircle className="w-4 h-4 text-[#6D28D9]" />
              <span>OBJECTION REBUTTALS</span>
            </div>
            
            <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
              Frequently <br />
              Asked <br />
              <span className="text-[#6D28D9]">Questions.</span>
            </h2>
            
            <p className="text-lg font-medium text-[#645D75] leading-relaxed max-w-sm">
              Everything you need to know to replace administrative copy-paste overhead with automated bank draws.
            </p>
          </div>

          {/* Right Column - Accordion (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            {faqData.map((item, index) => {
              const isOpen = openIndex === index;
              return (
                <div 
                  key={index}
                  className={`bg-white border rounded-3xl overflow-hidden shadow-landeros hover:shadow-[0_20px_45px_rgba(109,40,217,0.12)] transition-all duration-300 ${
                    isOpen ? 'border-[#6D28D9]/35 shadow-landeros-lg bg-[#FCFBFE]/40 shadow-[0_20px_45px_rgba(109,40,217,0.15)]' : 'border-[#311081]/8 hover:border-[#6D28D9]/25 hover:bg-[#FCFBFE]/10'
                  }`}
                >
                  {/* Accordion Trigger Header */}
                  <div
                    onClick={() => toggleItem(index)}
                    className="p-6 flex justify-between items-center gap-4 cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-4 text-left">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 font-bold transition-all duration-300 text-xs font-tech-landeros ${
                        isOpen ? 'bg-[#311081] text-white' : 'bg-[#F6F1FC] text-[#311081]'
                      }`}>
                        {index + 1}
                      </div>
                      <h3 className="font-tech-landeros text-base md:text-lg font-bold text-[#311081] leading-snug">
                        {item.question}
                      </h3>
                    </div>
                    
                    <div className={`transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-[#6D28D9]' : 'text-[#311081]/40'}`}>
                      <ChevronDown className="w-5 h-5 stroke-[2.2]" />
                    </div>
                  </div>

                  {/* Accordion Answer Content */}
                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                      >
                        <div className="px-6 pb-6 pl-16 pr-8 text-left">
                          <p className="font-medium text-sm leading-relaxed text-[#645D75] border-t border-[#311081]/5 pt-4">
                            {item.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </div>
              );
            })}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Faq;

