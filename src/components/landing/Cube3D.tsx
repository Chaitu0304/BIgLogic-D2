import React from "react";
import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface Cube3DProps {
  icon: LucideIcon;
  label: string;
  sublabel: string;
  delay: number;
  isActive: boolean;
  onClick: () => void;
  colorTheme?: string;
  index?: number;
}

export const Cube3D: React.FC<Cube3DProps> = ({
  icon: Icon,
  label,
  sublabel,
  delay,
  isActive,
  onClick,
  index,
}) => {
  // Map delay to index to determine color theme if not explicitly provided
  const blockIndex = index !== undefined ? index : Math.round(delay / 0.4);

  // Define unique premium monochrome and active glow settings for each cube
  const colorThemes = [
    {
      // PDF Scraping - Silver Chrome
      glow: "bg-black/8 shadow-[0_0_60px_rgba(0,0,0,0.1)]",
      activeText: "text-[#0A0A0A]",
      filter: "grayscale(1) contrast(1.25) brightness(1.15)",
      idleFilter: "grayscale(1) contrast(0.95) brightness(0.8)",
    },
    {
      // Live Dashboards - Liquid Silver
      glow: "bg-neutral-300/15 shadow-[0_0_60px_rgba(0,0,0,0.1)]",
      activeText: "text-[#3A3A3A]",
      filter: "grayscale(1) contrast(1.3) brightness(1.1)",
      idleFilter: "grayscale(1) contrast(0.9) brightness(0.75)",
    },
    {
      // Managing Tasks - Metallic Graphite
      glow: "bg-black/5 shadow-[0_0_60px_rgba(0,0,0,0.1)]",
      activeText: "text-[#3A3A3A]",
      filter: "grayscale(1) contrast(1.2) brightness(0.95)",
      idleFilter: "grayscale(1) contrast(0.85) brightness(0.7)",
    },
    {
      // Automating - Frost Glass
      glow: "bg-black/8 shadow-[0_0_60px_rgba(0,0,0,0.1)]",
      activeText: "text-[#0A0A0A]",
      filter: "grayscale(1) contrast(1.35) brightness(1.2)",
      idleFilter: "grayscale(1) contrast(1.0) brightness(0.85)",
    },
  ];

  const currentTheme = colorThemes[blockIndex % colorThemes.length];

  // Fluid staggered floating translation
  const floatTransition = {
    duration: 4,
    repeat: Infinity,
    ease: "easeInOut",
    delay: delay,
  };

  // exact claymorphic styles extracted from LanderOS
  const styles = {
    // Body Cylinder (extruded sides)
    body: {
      background:
        "linear-gradient(90deg, rgb(192, 176, 156) 0%, rgb(192, 176, 156) 40%, rgb(225, 208, 187) 50%, rgb(223, 210, 187) 60%, rgb(223, 210, 187) 100%)",
      width: "216px",
      position: "absolute" as const,
      bottom: "20px",
      left: 0,
      overflow: "visible" as const,
      zIndex: 2,
    },
    // Bottom Cap container
    bottomContainer: {
      zIndex: 1,
      height: "262px",
      position: "absolute" as const,
      bottom: "-130px",
      left: 0,
      right: 0,
      overflow: "hidden" as const,
    },
    // Tilt wrapper
    wrap: {
      height: "166px",
      transformStyle: "preserve-3d" as const,
      position: "absolute" as const,
      top: "calc(50% - 83px)",
      left: "-31px",
      right: "-31px",
      overflow: "visible" as const,
      transform: "rotateX(30deg) rotateY(-45deg)",
    },
    // Bottom Cap actual flat face
    bottomPlate: {
      width: "165px",
      height: "165px",
      position: "absolute" as const,
      top: "calc(50% - 82.5px)",
      left: "calc(50% - 82.5px)",
      overflow: "hidden" as const,
      borderRadius: "20px",
      transform: "rotateX(90deg)",
      background:
        "linear-gradient(45deg, rgb(192, 176, 156) 0%, rgb(192, 176, 156) 40%, rgb(225, 208, 187) 50%, rgb(223, 210, 187) 60%, rgb(223, 210, 187) 100%)",
      boxShadow:
        "inset 2px 2px 2px -1px rgb(102, 90, 69), -5px -5px 4px -4px rgba(130, 119, 101, 0.6)",
    },
    // Rim 1 Cap container
    rimContainer: {
      zIndex: 3,
      height: "262px",
      position: "absolute" as const,
      top: "-125px",
      left: 0,
      right: 0,
      overflow: "hidden" as const,
    },
    // Rim 1 actual flat face
    rimPlate: {
      width: "165px",
      height: "165px",
      position: "absolute" as const,
      top: "calc(50% - 82.5px)",
      left: "calc(50% - 82.5px)",
      overflow: "hidden" as const,
      borderRadius: "20px",
      transform: "rotateX(90deg)",
      background:
        "linear-gradient(45deg, rgb(200, 183, 164) 0%, rgb(200, 183, 164) 41%, rgb(252, 245, 235) 53%, rgb(252, 245, 235) 100%)",
    },
    // Rim 2 Cap container (with crescent mask)
    rim2Container: {
      zIndex: 2,
      height: "262px",
      position: "absolute" as const,
      top: "-123px",
      left: 0,
      right: 0,
      overflow: "hidden" as const,
      maskImage: "linear-gradient(326deg, rgba(0,0,0,0) 33%, rgba(0,0,0,1) 44%)",
      WebkitMaskImage:
        "linear-gradient(326deg, rgba(0,0,0,0) 33%, rgba(0,0,0,1) 44%)",
    },
    // Rim 2 actual flat face
    rim2Plate: {
      width: "165px",
      height: "165px",
      position: "absolute" as const,
      top: "calc(50% - 82.5px)",
      left: "calc(50% - 82.5px)",
      overflow: "hidden" as const,
      borderRadius: "20px",
      transform: "rotateX(90deg)",
      background:
        "linear-gradient(45deg, rgb(200, 183, 164) 0%, rgb(200, 183, 164) 41%, rgb(200, 183, 164) 53%, rgb(200, 183, 164) 100%)",
    },
    // Top Cap container
    topContainer: {
      zIndex: 5,
      height: "262px",
      position: "absolute" as const,
      top: "-131px",
      left: 0,
      right: 0,
      overflow: "hidden" as const,
    },
    // Top Cap actual flat face (Cream deck)
    topPlate: {
      width: "165px",
      height: "165px",
      position: "absolute" as const,
      top: "calc(50% - 82.5px)",
      left: "calc(50% - 82.5px)",
      overflow: "hidden" as const,
      borderRadius: "20px",
      transform: "rotateX(90deg)",
      backgroundColor: "rgb(246, 236, 221)",
      boxShadow: "inset 2px 2px 2px 3px rgb(250, 244, 235)",
    },
    // Blur overlay
    blur: {
      zIndex: 5,
      height: "64px",
      position: "absolute" as const,
      top: 0,
      left: 0,
      right: 0,
      overflow: "hidden" as const,
      backdropFilter: "blur(2px)",
      WebkitBackdropFilter: "blur(2px)",
      backgroundColor: "rgba(246, 236, 221, 0.01)",
    },
    // Icons layer container (floating flat above the deck)
    iconsContainer: {
      height: "92px",
      transformStyle: "preserve-3d" as const,
      zIndex: 10,
      width: "92px",
      position: "absolute" as const,
      top: "calc(0% - 46px)",
      left: "calc(50% - 46px)",
      overflow: "visible" as const,
      transform: "rotateX(60deg)",
    },
    // Floor drop shadow container
    shadowContainer: {
      transformStyle: "preserve-3d" as const,
      zIndex: 1,
      position: "absolute" as const,
      inset: "-10px 0 -31px",
      overflow: "visible" as const,
    },
    // Ground shadow plate
    downShadow: {
      zIndex: 1,
      width: "182px",
      height: "165px",
      position: "absolute" as const,
      top: "calc(50% - 82.5px)",
      right: "26px",
      overflow: "hidden" as const,
      backgroundColor: "rgb(209, 202, 189)",
      filter: "blur(8px)",
      borderRadius: "20px",
      transform: "rotateX(90deg)",
    },
  };

  return (
    <div
      className="relative flex items-center justify-center w-[150px] md:w-[220px] h-[150px] md:h-[220px] cursor-pointer group"
      onClick={onClick}
    >
      {/* 3D Scene Wrapper with color shift filter & responsive scaling */}
      <div
        className="relative w-[216px] h-[214px] scale-[0.62] md:scale-100 origin-bottom transition-transform duration-300 group-hover:scale-[0.66] md:group-hover:scale-105 select-none"
        style={{
          filter: isActive ? currentTheme.filter : currentTheme.idleFilter,
          WebkitFilter: isActive ? currentTheme.filter : currentTheme.idleFilter,
        }}
      >
        {/* Floor drop shadow (pulsing in sync with height growth) */}
        <div style={styles.shadowContainer}>
          <motion.div
            style={styles.wrap}
            animate={{
              scale: isActive ? [1.05, 1.1, 1.05] : [1, 1.05, 1],
              opacity: isActive ? [0.55, 0.45, 0.55] : [0.38, 0.28, 0.38],
            }}
            transition={floatTransition}
          >
            <div style={styles.downShadow} />
          </motion.div>
        </div>

        {/* The solid, physical 3D block Body (bases fixed, height growing/shrinking) */}
        <motion.div
          style={styles.body}
          animate={{
            y: 0,
            // Height pulses organically to simulate growing/shrinking wave
            height: isActive ? [190, 225, 190] : [130, 165, 130],
          }}
          transition={floatTransition}
        >
          {/* A. Bottom Face */}
          <div style={styles.bottomContainer}>
            <div style={styles.wrap}>
              <div style={styles.bottomPlate} />
            </div>
          </div>

          {/* B. Bevel Rim 1 */}
          <div style={styles.rimContainer}>
            <div style={styles.wrap}>
              <div style={styles.rimPlate} />
            </div>
          </div>

          {/* C. Bevel Rim 2 (with crescent corner mask) */}
          <div style={styles.rim2Container}>
            <div style={styles.wrap}>
              <div style={styles.rim2Plate} />
            </div>
          </div>

          {/* D. Top Cream Deck */}
          <div style={styles.topContainer}>
            <div style={styles.wrap}>
              <div style={styles.topPlate} />
            </div>
          </div>

          {/* E. Backdrop Blur overlay */}
          <div style={styles.blur} />

          {/* F. Elevated Flat Icon Layer */}
          <div style={styles.iconsContainer}>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon
                className="w-10 h-10 stroke-[2] select-none text-[#0A0A0A] transition-opacity duration-300"
                style={{
                  opacity: isActive ? 1 : 0.65,
                }}
              />
            </div>
          </div>
        </motion.div>
      </div>

      {/* Premium Glow Aura (Placed behind the entire block scene) */}
      <div
        className={`absolute inset-0 rounded-full blur-[40px] -z-10 transition-all duration-500 pointer-events-none scale-75 md:scale-100 ${
          isActive
            ? `opacity-100 ${currentTheme.glow}`
            : "opacity-0 scale-90 group-hover:opacity-40"
        }`}
      />
    </div>
  );
};


