import { motion } from "framer-motion";
import { ArrowUpRight, MessageSquare, AlertCircle, FileText, CheckCircle2 } from "lucide-react";

export const SaaSHeroMockup = () => {
  return (
    <div className="relative w-screen h-screen bg-[#F5F5F3] overflow-hidden font-sans select-none antialiased">
      
      {/* 1. BACKGROUND: Soft soft white/light grey background with diagonal folds and center fog vignette */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#F5F5F3] via-[#EDEDEB] to-[#E3E3E1] z-0 pointer-events-none" />
      
      {/* Subtle Center Fog Blur / Vignette */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-90"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.7) 0%, rgba(245,245,243,0.3) 60%, rgba(227,227,225,0.85) 100%)",
        }}
      />
      
      {/* Diagonal realistic paper-desk soft shadow folds */}
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.55)_0%,_transparent_55%)] pointer-events-none z-0" />
      <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(ellipse_at_bottom_right,_rgba(0,0,0,0.02)_0%,_transparent_60%)] pointer-events-none z-0" />

      {/* ==========================================================================
         CENTER AREA: 100% EMPTY, NO TYPOGRAPHY, NO CARDS, MASSIVE NEGATIVE SPACE
         ========================================================================== */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
        <div className="w-[45%] h-[35%] border border-dashed border-neutral-300/10 rounded-3xl flex items-center justify-center">
          <span className="text-[10px] uppercase tracking-[0.25em] font-extrabold text-neutral-400/20">
            [ Future Headline Placement — 100% Empty ]
          </span>
        </div>
      </div>

      {/* ==========================================================================
         TOP LEFT CORNER: Cropped Payment Card + Push pins
         ========================================================================== */}
      <motion.div
        initial={{ y: -40, opacity: 0, rotate: 6 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="absolute top-[-30px] left-[5%] z-20 flex flex-col items-start"
      >
        {/* Partially cropped floating invoice/payment card */}
        <div className="w-72 bg-white/95 rounded-2xl border border-neutral-200/50 p-5 shadow-[0_20px_45px_rgba(100,116,139,0.12)] shadow-[0_35px_70px_rgba(148,163,184,0.22)] backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-3">
            <span className="text-[8px] font-bold text-neutral-400 uppercase tracking-widest">Wire Transfer / Invoice</span>
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
          </div>
          <div className="space-y-1.5 font-mono text-[9px] text-neutral-600">
            <div className="flex justify-between">
              <span className="text-neutral-400">Country:</span>
              <span>Netherlands</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">IBAN:</span>
              <span>NL91ABNA0417164390</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-400">SWIFT/BIC:</span>
              <span>ABNANL2A</span>
            </div>
          </div>
        </div>

        {/* Beneath it: Tiny colorful push pins */}
        <div className="flex gap-4 mt-6 ml-10 scale-95 select-none pointer-events-none">
          <img 
            src="/blueprint_pins.png" 
            alt="Push Pins" 
            className="w-32 h-auto filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.14)] mix-blend-multiply" 
          />
        </div>
      </motion.div>


      {/* ==========================================================================
         LEFT SIDE CENTER: Large Monochrome Invoice Sheet Vertically Aligned
         ========================================================================== */}
      <motion.div
        initial={{ x: -60, opacity: 0, rotate: -3 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.1 }}
        className="absolute top-[28%] left-[-40px] z-20 select-none"
      >
        <div className="w-80 bg-white/95 rounded-2xl border border-neutral-200/50 p-6 shadow-[0_25px_50px_rgba(100,116,139,0.10)] shadow-[0_45px_90px_rgba(148,163,184,0.18)] backdrop-blur-md font-mono text-[10px] text-neutral-600">
          <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
            <span className="font-bold text-neutral-400 uppercase tracking-widest text-[9px]">Receipt Voucher</span>
            <span className="text-neutral-400">#002492</span>
          </div>
          <div className="space-y-3 mb-6">
            <div className="flex justify-between border-b border-dashed border-neutral-100 pb-2">
              <span className="text-neutral-400">Developer Draw:</span>
              <span>$12,800.00</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-neutral-100 pb-2">
              <span className="text-neutral-400">Compliance Audit:</span>
              <span className="text-emerald-600 font-bold">Approved</span>
            </div>
            <div className="flex justify-between border-b border-dashed border-neutral-100 pb-2">
              <span className="text-neutral-400">Polygon POS Draw:</span>
              <span>NL91-0417</span>
            </div>
          </div>
          <div className="flex items-center justify-between text-neutral-400 text-[8px] uppercase tracking-wider">
            <span>Issue Date: 2026-05-27</span>
            <span>BIGlogicAI Core</span>
          </div>
        </div>
      </motion.div>


      {/* ==========================================================================
         BOTTOM LEFT: Yellow Sticky Note + Bulldog Clip + Floating icons
         ========================================================================== */}
      <motion.div
        initial={{ y: 50, opacity: 0, rotate: -12 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.3, ease: "easeOut", delay: 0.2 }}
        className="absolute bottom-[-15px] left-[2%] z-20 flex flex-col items-start"
      >
        <div className="relative">
          {/* Bulldog Clip clamping the note */}
          <div className="absolute top-[-14px] left-[22%] z-30 scale-90 origin-center mix-blend-multiply">
            <img 
              src="/bulldog_clip.png" 
              alt="Bulldog Clip" 
              className="w-16 h-auto filter drop-shadow-[0_12px_25px_rgba(0,0,0,0.18)]" 
            />
          </div>

          {/* Floating Sticky Note */}
          <div className="w-56 h-56 bg-white/95 rounded-2xl border border-neutral-200/50 p-6 shadow-[0_20px_45px_rgba(100,116,139,0.12)] shadow-[0_35px_70px_rgba(148,163,184,0.22)] backdrop-blur-md flex flex-col justify-between">
            <div className="scale-95 origin-center mix-blend-multiply w-full h-full">
              <img 
                src="/sticky_note.png" 
                alt="Yellow Task Sticky Note" 
                className="w-full h-auto filter drop-shadow-[0_10px_20px_rgba(0,0,0,0.06)]"
              />
            </div>
          </div>
        </div>

        {/* Nearby tiny floating crypto/reconstruction icons */}
        <div className="absolute top-[-40px] right-[-50px] z-30 flex gap-2 scale-90 select-none pointer-events-none">
          <motion.img
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            src="/hardhat.png"
            className="w-12 h-auto filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] mix-blend-multiply"
            style={{ clipPath: "inset(5%)" }}
          />
          <motion.img
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            src="/spirit_level.png"
            className="w-14 h-auto filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.12)] mix-blend-multiply"
            style={{ clipPath: "inset(5%)" }}
          />
        </div>
      </motion.div>


      {/* ==========================================================================
         BOTTOM CENTER: Small Floating Circular Tokens / staggered depth
         ========================================================================== */}
      <div className="absolute bottom-[4%] left-[45%] -translate-x-1/2 z-20 flex gap-10 items-end scale-90">
        
        {/* Token 1: Background, blurred depth of field */}
        <motion.div
          animate={{ y: [0, -4, 0] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
          className="w-10 h-10 rounded-full bg-slate-300 border border-slate-400/20 shadow-[0_12px_25px_rgba(100,116,139,0.30)] flex items-center justify-center blur-[1.5px] scale-95 opacity-80"
        >
          <span className="text-[10px] font-bold text-slate-600">USDC</span>
        </motion.div>

        {/* Token 2: Foreground, extremely sharp */}
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
          className="w-12 h-12 rounded-full bg-slate-200 border border-slate-300/40 shadow-[0_18px_35px_rgba(100,116,139,0.40)] flex items-center justify-center font-bold text-[11px] text-slate-800"
        >
          <span className="tracking-tight">USDT</span>
        </motion.div>

      </div>


      {/* ==========================================================================
         TOP RIGHT: Floating Notification Card + 3 Floating Coins
         ========================================================================== */}
      <motion.div
        initial={{ y: -40, opacity: 0, rotate: -8 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, ease: "easeOut", delay: 0.1 }}
        className="absolute top-[-10px] right-[4%] z-20 flex flex-col items-end"
      >
        {/* Floating Notification Snippet */}
        <div className="w-80 bg-white/95 rounded-2xl border border-neutral-200/50 p-4 shadow-[0_20px_45px_rgba(100,116,139,0.12)] shadow-[0_35px_70px_rgba(148,163,184,0.22)] backdrop-blur-md flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-800 border border-neutral-200/50">
            <AlertCircle className="w-4 h-4" />
          </div>
          <div className="flex-1 text-left">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold text-[#0A0A0A]">Yurie Kitajima</span>
              <span className="text-[8px] font-medium text-neutral-400">now</span>
            </div>
            <p className="text-[9px] font-medium text-neutral-500 mt-0.5">What is this draw schedule payment for?</p>
          </div>
        </div>

        {/* Beneath place 3 floating circular coins/icons arranged diagonally downward */}
        <div className="flex flex-col gap-6 mt-8 mr-16 select-none pointer-events-none">
          <motion.div
            animate={{ x: [0, -4, 0], y: [0, 4, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-11 h-11 rounded-full bg-slate-200 border border-slate-300/40 shadow-[0_15px_30px_rgba(100,116,139,0.30)] flex items-center justify-center font-black text-[11px] text-slate-800 ml-16"
          >
            <span>$</span>
          </motion.div>
          
          <motion.div
            animate={{ x: [0, 4, 0], y: [0, -4, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.3 }}
            className="w-11 h-11 rounded-full bg-slate-100 border border-slate-200/40 shadow-[0_15px_30px_rgba(100,116,139,0.30)] flex items-center justify-center font-black text-[11px] text-slate-800 ml-8"
          >
            <span>Ξ</span>
          </motion.div>

          <motion.div
            animate={{ x: [0, -3, 0], y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.6 }}
            className="w-11 h-11 rounded-full bg-slate-300 border border-slate-400/40 shadow-[0_15px_30px_rgba(100,116,139,0.30)] flex items-center justify-center font-black text-[11px] text-slate-800"
          >
            <span>₮</span>
          </motion.div>
        </div>
      </motion.div>


      {/* ==========================================================================
         RIGHT CENTER: Small Chat/Payment Card
         ========================================================================== */}
      <motion.div
        initial={{ x: 60, opacity: 0, rotate: 4 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        className="absolute top-[32%] right-[-25px] z-20 select-none"
      >
        <div className="w-72 bg-white/95 rounded-2xl border border-neutral-200/50 p-4 shadow-[0_20px_45px_rgba(100,116,139,0.12)] shadow-[0_35px_70px_rgba(148,163,184,0.22)] backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-neutral-100 border border-neutral-200/50 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5 text-neutral-800" />
            </div>
            <div className="flex-1 text-left">
              <div className="flex justify-between items-center">
                <span className="text-[9px] font-bold text-[#0A0A0A]">Toby Davies</span>
                <span className="text-[7px] text-neutral-400">4:52 PM</span>
              </div>
              <p className="text-[9px] text-neutral-500 mt-0.5">Is NL91ABNA the correct address for the vendor draw?</p>
            </div>
          </div>
        </div>
      </motion.div>


      {/* ==========================================================================
         BOTTOM RIGHT: Floating Document / Editor Window + Depth Stacking
         ========================================================================== */}
      <motion.div
        initial={{ y: 50, opacity: 0, rotate: 7 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.3, ease: "easeOut", delay: 0.3 }}
        className="absolute bottom-[-20px] right-[4%] z-20 flex flex-col items-end"
      >
        <div className="relative">
          {/* Background layered card */}
          <div className="absolute top-[-10px] left-[5%] w-[90%] h-[110%] bg-neutral-200/40 rounded-2xl border border-neutral-300/30 -z-10 shadow-[0_10px_25px_rgba(0,0,0,0.04)] rotate-[-3deg]" />

          {/* Floating Document Editor Card */}
          <div className="w-80 bg-white/95 rounded-2xl border border-neutral-200/50 p-5 shadow-[0_20px_45px_rgba(100,116,139,0.12)] shadow-[0_35px_70px_rgba(148,163,184,0.22)] backdrop-blur-md font-sans text-[10px]">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3 mb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-3.5 h-3.5 text-neutral-500" />
                <span className="font-bold text-[#0A0A0A]">QuickBooks Draw Sync</span>
              </div>
              <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold border border-emerald-500/10 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <div className="space-y-2 mb-2 font-mono text-[9px] text-neutral-500">
              <div className="flex justify-between">
                <span>Total QuickBooks AP:</span>
                <span className="text-[#0A0A0A] font-bold">$45,200.00</span>
              </div>
              <div className="flex justify-between border-b border-neutral-100 pb-1.5">
                <span>Vendor Compliance:</span>
                <span className="text-emerald-600 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" /> Checked
                </span>
              </div>
            </div>
            <p className="text-[8px] text-neutral-400 text-left">Auto-sync draw package values into QuickBooks accounting hub.</p>
          </div>
        </div>
      </motion.div>

    </div>
  );
};
