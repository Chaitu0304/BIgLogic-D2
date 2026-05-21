import { useState } from "react";
import { Calculator, ArrowRight, TrendingUp, HelpCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const RoiCalculator = () => {
  const navigate = useNavigate();
  const [estimateCount, setEstimateCount] = useState(25);
  const [projectValue, setProjectValue] = useState(65000);

  // Math Formulas
  const hoursSavedPerEstimate = 4.5;
  const estimatorHourlyRate = 75;
  
  const monthlyHoursSaved = Math.round(estimateCount * hoursSavedPerEstimate);
  const monthlyLaborSaved = monthlyHoursSaved * estimatorHourlyRate;
  const yearlyLaborSaved = monthlyLaborSaved * 12;

  // Unlocked Working Capital (faster draw cycles - 41 days accelerated)
  const cashFlowAccelerated = estimateCount * projectValue;

  return (
    <section id="roi-calculator" className="py-24 bg-[#FCFBFE] bg-grid-landeros border-b border-[#311081]/5 font-sans-landeros text-[#1C1629] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-[#311081]/5 to-transparent rounded-full blur-[80px] pointer-events-none" />

      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F6F1FC] border border-[#311081]/10 text-xs font-bold text-[#311081] tracking-wide mb-6">
            <Calculator className="w-4 h-4 text-[#6D28D9]" />
            <span>THE RESTORATION ROI MATH</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#311081]">
            Don't Trust Our Claims. <br />
            Calculate Your Exact ROI.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#3C354D] max-w-2xl leading-relaxed">
            Slide the bars below to match your restoration business's monthly estimate volume and average job size. We show you the exact hours and capital unlocked.
          </p>
        </div>

        {/* Calculator layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-stretch">
          
          {/* Sliders panel (6 cols) */}
          <div className="lg:col-span-6 bg-white border border-[#311081]/8 p-8 rounded-3xl flex flex-col justify-between hover-premium-card group z-10">
            <div className="space-y-10">
              
              {/* Slider 1 */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-bold">
                  <label className="text-sm font-tech-landeros font-bold uppercase tracking-wider text-[#311081]">Estimates Processed / Month</label>
                  <span className="text-2xl font-display-landeros font-extrabold text-[#311081] px-4 py-1.5 bg-[#F6F1FC] border border-[#311081]/10 rounded-2xl">
                    {estimateCount}
                  </span>
                </div>
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="5"
                    max="150"
                    step="5"
                    value={estimateCount}
                    onChange={(e) => setEstimateCount(Number(e.target.value))}
                    className="slider-premium cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-extrabold uppercase text-[#3C354D] font-tech-landeros">
                  <span>5 estimates</span>
                  <span>75 estimates</span>
                  <span>150 estimates</span>
                </div>
              </div>

              {/* Slider 2 */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-bold">
                  <label className="text-sm font-tech-landeros font-bold uppercase tracking-wider text-[#311081]">Average Job/Estimate Size</label>
                  <span className="text-2xl font-display-landeros font-extrabold text-[#311081] px-4 py-1.5 bg-[#F6F1FC] border border-[#311081]/10 rounded-2xl">
                    ${projectValue.toLocaleString()}
                  </span>
                </div>
                <div className="relative pt-2">
                  <input
                    type="range"
                    min="5000"
                    max="300000"
                    step="5000"
                    value={projectValue}
                    onChange={(e) => setProjectValue(Number(e.target.value))}
                    className="slider-premium cursor-pointer"
                  />
                </div>
                <div className="flex justify-between text-[10px] font-extrabold uppercase text-[#3C354D] font-tech-landeros">
                  <span>$5,000</span>
                  <span>$150,000</span>
                  <span>$300,000</span>
                </div>
              </div>

            </div>

            {/* Explanatory Footnote */}
            <div className="mt-10 border-t border-[#311081]/5 pt-6 flex items-start gap-3 text-xs font-semibold text-[#3C354D] text-left">
              <HelpCircle className="w-5 h-5 text-[#6D28D9] shrink-0 mt-0.5" />
              <p>
                ROI math based on a standard contractor baseline of 4.5 administrative hours saved per estimate file (Excel conversion, material selection logging, draw schedule mapping) billed at a conservative estimator wage of $75/hour.
              </p>
            </div>

          </div>

          {/* Results panel (6 cols) */}
          <div className="lg:col-span-6 bg-[#311081] text-white p-8 md:p-10 border border-[#6D28D9]/20 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden hover-premium-card group z-10">
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-bl from-[#6D28D9]/15 to-transparent rounded-full" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 border border-white/10 font-bold uppercase tracking-wider text-[9px] mb-8 font-tech-landeros text-[#F3EBFC]">
                <TrendingUp className="w-3.5 h-3.5 text-[#F3EBFC]" />
                CALCULATOR_RESULTS_ENG_v2.0
              </div>

              {/* Metric 1 */}
              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#F3EBFC] font-semibold mb-1.5 font-tech-landeros">MONTHLY LABOR TIME RECOVERED:</div>
                <div className="text-4xl md:text-5xl font-extrabold font-display-landeros text-white flex items-baseline gap-2">
                  {monthlyHoursSaved} <span className="text-sm text-[#F3EBFC] font-bold tracking-wider font-tech-landeros uppercase">Hours / mo</span>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="mb-8">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#F3EBFC] font-semibold mb-1.5 font-tech-landeros">DIRECT ESTIMATING CASH SAVED:</div>
                <div className="text-4xl md:text-5xl font-extrabold font-display-landeros text-white">
                  ${monthlyLaborSaved.toLocaleString()} <span className="text-sm text-[#F3EBFC] font-bold tracking-wider font-tech-landeros uppercase">/ mo</span>
                </div>
                <div className="text-xs font-bold text-white mt-2 font-sans-landeros">
                  (${yearlyLaborSaved.toLocaleString()} directly saved per year in labor overhead)
                </div>
              </div>

              {/* Metric 3 */}
              <div className="mb-6">
                <div className="text-[10px] font-bold uppercase tracking-widest text-[#F3EBFC] font-semibold mb-1.5 font-tech-landeros">CASH FLOW ACCELERATED 41 DAYS FASTER:</div>
                <div className="text-4xl md:text-5xl font-extrabold font-display-landeros text-white">
                  ${cashFlowAccelerated.toLocaleString()}
                </div>
                <p className="text-xs font-semibold text-[#F3EBFC] mt-2 max-w-md leading-relaxed font-sans-landeros">
                  Total outstanding project draws unlocked from lender inspection cycles and paid into your bank 41 days faster.
                </p>
              </div>

            </div>

            {/* Result CTA Button */}
            <div className="border-t border-white/10 pt-6 mt-8 relative z-10">
              <button
                onClick={() => navigate("/signup")}
                className="w-full py-4 text-center font-bold uppercase text-xs tracking-widest text-[#311081] bg-white rounded-full hover:bg-[#F6F1FC] transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                CLAIM YOUR 3 FREE ESTIMATES NOW <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};
