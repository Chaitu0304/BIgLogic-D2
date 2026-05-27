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
    <section id="roi-calculator" className="py-24 bg-premium-luxury-gradient bg-grid-landeros border-b border-black/5 font-sans-landeros text-[#0A0A0A] relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/3 left-10 w-[300px] h-[300px] bg-gradient-to-tr from-black/3 to-transparent rounded-full blur-[80px] pointer-events-none" />
 
      <div className="container mx-auto px-4 max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="max-w-4xl text-left mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#F8F8F8] border border-black/10 text-xs font-bold text-[#0A0A0A] tracking-wide mb-6">
            <Calculator className="w-4 h-4 text-[#6B6B6B]" />
            <span>THE RESTORATION ROI MATH</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-black mb-6 leading-[1.08] tracking-tight font-display-landeros text-[#0A0A0A]">
            Don't Trust Our Claims. <br />
            Calculate Your Exact ROI.
          </h2>
          <p className="text-lg md:text-xl font-semibold text-[#6B6B6B] max-w-2xl leading-relaxed">
            Slide the bars below to match your restoration business's monthly estimate volume and average job size. We show you the exact hours and capital unlocked.
          </p>
        </div>
 
        {/* Calculator layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 max-w-7xl mx-auto items-stretch">
          
          {/* Sliders panel (6 cols) */}
          <div className="lg:col-span-6 bg-[#F8F8F8] border border-black/5 p-8 rounded-3xl flex flex-col justify-between hover-premium-card group z-10">
            <div className="space-y-10">
              
              {/* Slider 1 */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-bold">
                  <label className="text-sm font-tech-landeros font-bold uppercase tracking-wider text-[#0A0A0A]">Estimates Processed / Month</label>
                  <span className="text-2xl font-display-landeros font-extrabold text-[#0A0A0A] px-4 py-1.5 bg-[#F0F0F0] border border-black/10 rounded-2xl">
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
                <div className="flex justify-between text-xs font-extrabold uppercase text-[#6B6B6B] font-tech-landeros">
                  <span>5 estimates</span>
                  <span>75 estimates</span>
                  <span>150 estimates</span>
                </div>
              </div>
 
              {/* Slider 2 */}
              <div className="flex flex-col gap-4">
                <div className="flex justify-between items-center font-bold">
                  <label className="text-sm font-tech-landeros font-bold uppercase tracking-wider text-[#0A0A0A]">Average Job/Estimate Size</label>
                  <span className="text-2xl font-display-landeros font-extrabold text-[#0A0A0A] px-4 py-1.5 bg-[#F0F0F0] border border-black/10 rounded-2xl">
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
                <div className="flex justify-between text-xs font-extrabold uppercase text-[#6B6B6B] font-tech-landeros">
                  <span>$5,000</span>
                  <span>$150,000</span>
                  <span>$300,000</span>
                </div>
              </div>
 
            </div>
 
            {/* Explanatory Footnote */}
            <div className="mt-10 border-t border-black/5 pt-6 flex items-start gap-3 text-sm font-semibold text-[#6B6B6B] text-left">
              <HelpCircle className="w-5 h-5 text-[#6B6B6B] shrink-0 mt-0.5" />
              <p>
                ROI math based on a standard contractor baseline of 4.5 administrative hours saved per estimate file (Excel conversion, material selection logging, draw schedule mapping) billed at a conservative estimator wage of $75/hour.
              </p>
            </div>
 
          </div>
 
          {/* Results panel (6 cols) */}
          <div className="lg:col-span-6 bg-[#F0F0F0] text-[#0A0A0A] p-8 md:p-10 border border-black/10 rounded-3xl flex flex-col justify-between text-left relative overflow-hidden hover-premium-card group z-10 shadow-[0_4px_20px_rgba(0,0,0,0.06)]">
            <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none z-0">
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-black/5 via-black/3 to-transparent rounded-full blur-xl opacity-80 group-hover:scale-110 transition-transform duration-700" />
            </div>
            
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 border border-black/5 font-bold uppercase tracking-wider text-xs mb-8 font-tech-landeros text-[#0A0A0A] shadow-sm">
                <TrendingUp className="w-3.5 h-3.5 text-[#0A0A0A]" />
                CALCULATOR_RESULTS_ENG_v2.0
              </div>
 
              {/* Metric 1 */}
              <div className="mb-8">
                <div className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] font-semibold mb-1.5 font-tech-landeros">MONTHLY LABOR TIME RECOVERED:</div>
                <div className="text-4xl md:text-5xl font-extrabold font-display-landeros text-[#0A0A0A] flex items-baseline gap-2">
                  {monthlyHoursSaved} <span className="text-sm text-[#6B6B6B] font-bold tracking-wider font-tech-landeros uppercase">Hours / mo</span>
                </div>
              </div>
 
              {/* Metric 2 */}
              <div className="mb-8">
                <div className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] font-semibold mb-1.5 font-tech-landeros">DIRECT ESTIMATING CASH SAVED:</div>
                <div className="text-4xl md:text-5xl font-extrabold font-display-landeros text-[#0A0A0A]">
                  ${monthlyLaborSaved.toLocaleString()} <span className="text-sm text-[#6B6B6B] font-bold tracking-wider font-tech-landeros uppercase">/ mo</span>
                </div>
                <div className="text-sm font-bold text-[#6B6B6B] mt-2 font-sans-landeros">
                  (${yearlyLaborSaved.toLocaleString()} directly saved per year in labor overhead)
                </div>
              </div>
 
              {/* Metric 3 */}
              <div className="mb-6">
                <div className="text-xs font-bold uppercase tracking-widest text-[#6B6B6B] font-semibold mb-1.5 font-tech-landeros">CASH FLOW ACCELERATED 41 DAYS FASTER:</div>
                <div className="text-4xl md:text-5xl font-extrabold font-display-landeros text-[#0A0A0A]">
                  ${cashFlowAccelerated.toLocaleString()}
                </div>
                <p className="text-sm font-semibold text-[#6B6B6B] mt-2 max-w-md leading-relaxed font-sans-landeros">
                  Total outstanding project draws unlocked from lender inspection cycles and paid into your bank 41 days faster.
                </p>
              </div>
 
            </div>
 
            {/* Result CTA Button */}
            <div className="border-t border-black/10 pt-6 mt-8 relative z-10">
              <button
                onClick={() => navigate("/signup")}
                className="w-full py-4 text-center font-bold uppercase text-xs tracking-widest text-white bg-[#0A0A0A] rounded-full hover:bg-[#1A1A1A] transition-colors flex items-center justify-center gap-1.5 shadow-md"
              >
                CLAIM YOUR 3 FREE ESTIMATES NOW <ArrowRight className="w-4 h-4 text-white animate-pulse" />
              </button>
            </div>
 
          </div>
 
        </div>
 
      </div>
    </section>
  );
};
