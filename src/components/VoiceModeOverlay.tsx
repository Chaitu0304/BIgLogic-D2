import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Brain, Volume2, X, Command, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VoiceModeOverlayProps {
  isActive: boolean;
  isListening: boolean;
  isThinking: boolean;
  isSpeaking: boolean;
  isMicActive: boolean;
  transcript: string;
  onClose: () => void;
  onManualSubmit?: () => void;
}

const VoiceModeOverlay: React.FC<VoiceModeOverlayProps> = ({
  isActive,
  isListening,
  isThinking,
  isSpeaking,
  isMicActive,
  transcript,
  onClose,
  onManualSubmit,
}) => {
  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-black/90 backdrop-blur-xl"
        >
          <div className="absolute top-8 right-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-12 w-12 rounded-full text-white transition-all"
            >
              <X className="w-6 h-6" />
            </Button>
          </div>

          <div className="max-w-2xl w-full px-6 flex flex-col items-center gap-12">
            {/* Visualizer Area */}
            <div className="relative flex items-center justify-center w-80 h-80">
              <AnimatePresence mode="wait">
                {isThinking ? (
                  <motion.div
                    key="thinking"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative flex items-center justify-center"
                  >
                    {[...Array(3)].map((_, i) => (
                      <motion.div
                        key={i}
                        animate={{
                          scale: [1, 1.2, 1],
                          rotate: [0, 180, 360],
                          borderRadius: ["30% 70% 70% 30% / 30% 30% 70% 70%", "70% 30% 30% 70% / 70% 70% 30% 30%", "30% 70% 70% 30% / 30% 30% 70% 70%"]
                        }}
                        transition={{
                          duration: 4 + i,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                        className={`absolute w-48 h-48 border-2 ${i === 0 ? 'border-indigo-500/40' : i === 1 ? 'border-purple-500/40' : 'border-blue-500/40'} blur-md`}
                      />
                    ))}
                    <div className="relative z-10 bg-black/40 p-6 rounded-full backdrop-blur-md border border-white/10">
                      <Brain className="w-16 h-16 text-indigo-400 animate-pulse" />
                    </div>
                  </motion.div>
                ) : isSpeaking ? (
                   <motion.div
                    key="speaking"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative flex items-center justify-center"
                  >
                    {/* Glowing Audio Orbs */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.4, 1],
                            opacity: [0.3, 0.6, 0.3]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"
                    />
                    <div className="flex gap-2 items-center justify-center h-24 relative z-10">
                        {[...Array(8)].map((_, i) => (
                        <motion.div
                            key={i}
                            animate={{
                            height: [20, 80, 20],
                            opacity: [0.5, 1, 0.5]
                            }}
                            transition={{
                            duration: 0.6,
                            repeat: Infinity,
                            delay: i * 0.08,
                            ease: "easeInOut"
                            }}
                            className="w-2.5 bg-gradient-to-t from-indigo-600 via-purple-500 to-indigo-400 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]"
                        />
                        ))}
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="listening"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    className="relative flex items-center justify-center"
                  >
                    {/* ChatGPT Style Glowing Spheres */}
                    <motion.div
                      animate={{
                        scale: isListening ? [1, 1.3, 1] : 1,
                        rotate: 360,
                      }}
                      transition={{
                        scale: { duration: 2, repeat: Infinity },
                        rotate: { duration: 20, repeat: Infinity, ease: "linear" }
                      }}
                      className="absolute w-72 h-72 border-2 border-indigo-500/20 rounded-[40%] blur-xl"
                    />
                    <motion.div
                      animate={{
                        scale: isListening ? [1.2, 1, 1.2] : 1,
                        rotate: -360,
                      }}
                      transition={{
                        scale: { duration: 2.5, repeat: Infinity },
                        rotate: { duration: 15, repeat: Infinity, ease: "linear" }
                      }}
                      className="absolute w-72 h-72 border-2 border-purple-500/20 rounded-[30%] blur-xl"
                    />
                    <motion.div
                      animate={{
                        scale: isListening ? [1, 1.2, 1.1, 1] : 1,
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                      }}
                      className="relative w-40 h-40 rounded-full bg-gradient-to-br from-indigo-600 to-purple-700 flex items-center justify-center shadow-[0_0_80px_rgba(79,70,229,0.5)] border border-white/20"
                    >
                      {isListening ? (
                        <Mic className="w-16 h-16 text-white drop-shadow-lg" />
                      ) : (
                        <MicOff className="w-16 h-16 text-white/50" />
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Status & Transcript */}
            <div className="text-center space-y-4 w-full">
              <div className="flex items-center justify-center gap-2">
                <div className={`w-2 h-2 rounded-full ${isMicActive ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-500'} transition-colors`} />
                <h2 className="text-2xl font-medium text-white/90">
                    {isThinking ? "Thinking..." : isSpeaking ? "Speaking..." : isListening ? "Listening..." : "Waiting..."}
                </h2>
              </div>
              <div className="min-h-[60px] flex flex-col items-center gap-4">
                <p className="text-xl text-indigo-300 font-light italic">
                  {transcript || (isListening ? "Say something..." : "")}
                </p>
                {transcript && isListening && !isThinking && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <Button 
                            onClick={onManualSubmit}
                            className="bg-indigo-600 hover:bg-indigo-500 text-white rounded-full px-8 py-6 text-lg shadow-[0_0_20px_rgba(79,70,229,0.4)] flex items-center gap-2"
                        >
                            <Send className="w-5 h-5" />
                            Send Now
                        </Button>
                    </motion.div>
                )}
              </div>
            </div>

            {/* Instructions */}
            <div className="flex items-center gap-6 text-white/40 text-sm">
              <div className="flex items-center gap-2">
                <div className="p-1 rounded bg-white/10">
                  <Command className="w-3 h-3" />
                </div>
                <span>Interrupt at any time</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Auto-submit when silent</span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default VoiceModeOverlay;
