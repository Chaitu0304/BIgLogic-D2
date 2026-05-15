import { useState, useEffect, useRef, useCallback } from 'react';

interface UseVoiceModeProps {
  onQueryReady: (query: string) => Promise<void>;
  silenceTimeoutMs?: number;
}

export const useVoiceMode = ({ onQueryReady, silenceTimeoutMs = 5000 }: UseVoiceModeProps) => {
  const [isActive, setIsActive] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMicActive, setIsMicActive] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const silenceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef('');

  // Stable Refs for all dynamic values to avoid effect churn
  const onQueryReadyRef = useRef(onQueryReady);
  const silenceTimeoutMsRef = useRef(silenceTimeoutMs);
  const isActiveRef = useRef(false);
  const isThinkingRef = useRef(false);
  const isSpeakingRef = useRef(false);

  // Sync refs
  useEffect(() => { onQueryReadyRef.current = onQueryReady; }, [onQueryReady]);
  useEffect(() => { silenceTimeoutMsRef.current = silenceTimeoutMs; }, [silenceTimeoutMs]);
  useEffect(() => { isActiveRef.current = isActive; }, [isActive]);
  useEffect(() => { isThinkingRef.current = isThinking; }, [isThinking]);
  useEffect(() => { isSpeakingRef.current = isSpeaking; }, [isSpeaking]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && isActiveRef.current) {
        try {
            console.log("Requesting STT activation...");
            recognitionRef.current.start();
        } catch (e) {
            // Already started
        }
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) {}
    }
  }, []);

  const stopSpeaking = useCallback(() => {
    if (window.speechSynthesis) {
      console.log("STOPPING SPEECH IMMEDIATELY");
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      isSpeakingRef.current = false;
    }
  }, []);

  const cleanText = (text: string) => {
    return text
      .replace(/#{1,6}\s?/g, '') // Remove headers
      .replace(/\*\*/g, '')      // Remove bold
      .replace(/\*/g, '')       // Remove italic
      .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove links but keep text
      .replace(/`{1,3}[^`]*`{1,3}/g, '') // Remove code blocks
      .replace(/[-*+]\s/g, '')   // Remove list bullets
      .replace(/\n/g, ' ')      // Replace newlines with spaces
      .replace(/\\/g, '')       // Remove backslashes
      .trim();
  };

  const speak = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    
    const cleanedText = cleanText(text);
    console.log("Speaking cleaned text:", cleanedText);
    
    stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(cleanedText);
    
    // Apply Indian style voice if detected
    if (selectedVoice) {
        console.log("Using Indian voice:", selectedVoice.name);
        utterance.voice = selectedVoice;
    }
    
    // Natural pacing (0.9 is better for Indian accented browser voices)
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    utterance.volume = 1.0;

    utterance.onstart = () => {
        console.log("AI starting to speak...");
        setIsSpeaking(true);
    };
    utterance.onend = () => {
      console.log("AI finished speaking");
      setIsSpeaking(false);
      if (isActiveRef.current) startListening();
    };
    utterance.onerror = (e) => {
        console.error("SpeechSynthesis error:", e);
        setIsSpeaking(false);
    };
    window.speechSynthesis.speak(utterance);
  }, [stopSpeaking, startListening, selectedVoice]);

  const handleQuery = useCallback(async (text: string) => {
    if (!text.trim()) return;
    setIsThinking(true);
    setTranscript(''); 
    transcriptRef.current = '';
    
    try {
      await onQueryReadyRef.current(text);
    } catch (error) {
      speak("Sorry, I encountered an error.");
    } finally {
      setIsThinking(false);
      // Restart listening immediately after thinking, regardless of whether AI speaks
      if (isActiveRef.current) {
        startListening();
      }
    }
  }, [speak, startListening]);

  const resetSilenceTimer = useCallback(() => {
    if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
    
    if (isActiveRef.current && !isThinkingRef.current && !isSpeakingRef.current) {
        silenceTimerRef.current = setTimeout(() => {
            const currentTranscript = transcriptRef.current;
            if (currentTranscript.trim()) {
                stopListening();
                handleQuery(currentTranscript);
            }
        }, silenceTimeoutMsRef.current);
    }
  }, [handleQuery, stopListening]);

  // Handle Voice Selection (Indian Style)
  useEffect(() => {
    if (!window.speechSynthesis) return;

    // CLEAR ANY RESIDUE SPEECH ON MOUNT (Fix for persistence on refresh)
    window.speechSynthesis.cancel();

    const loadVoices = () => {
      const voices = window.speechSynthesis.getVoices();
      // Search for Indian English voices
      // Common names: "Google English (India)", "Microsoft Heera", "en-IN"
      const indianVoice = voices.find(v => 
        v.lang.includes('en-IN') || 
        v.name.toLowerCase().includes('india') ||
        v.name.toLowerCase().includes('heera')
      );
      
      if (indianVoice) {
        console.log("Detected Indian voice:", indianVoice.name);
        setSelectedVoice(indianVoice);
      } else {
        // Fallback to any natural sounding English voice
        const englishVoice = voices.find(v => v.lang.startsWith('en'));
        if (englishVoice) setSelectedVoice(englishVoice);
      }
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, []);

  // Initial setup of recognition
  useEffect(() => {
    // @ts-ignore
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) return;

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
        console.log("STT IS LIVE & LISTENING");
        setIsMicActive(true);
        setIsListening(true);
    };
    
    recognition.onsoundstart = () => {
        console.log("Sound detected");
        if (isSpeakingRef.current || window.speechSynthesis.speaking) {
            console.log("SOUND INTERRUPTION -> Stopping AI");
            stopSpeaking();
        }
    };

    recognition.onspeechstart = () => {
        console.log("Speech detected");
        if (isSpeakingRef.current || window.speechSynthesis.speaking) {
            console.log("SPEECH INTERRUPTION -> Stopping AI");
            stopSpeaking();
        }
    };

    recognition.onend = () => {
        console.log("STT Stream Ended");
        setIsMicActive(false);
        setIsListening(false);
        if (isActiveRef.current) {
            console.log("STT Stream Ended unexpectedly, restarting...");
            setTimeout(startListening, 100);
        }
    };

    recognition.onresult = (event: any) => {
      // If we are currently processing a query, ignore new results 
      // but interruption has already been handled by onsoundstart
      if (isThinkingRef.current) return;

      let currentTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        currentTranscript += event.results[i][0].transcript;
      }

      const trimmedTranscript = currentTranscript.trim();
      if (trimmedTranscript) {
        console.log("Transcript detected:", trimmedTranscript);
        
        // INTERRUPTION LOGIC: If synth is speaking, stop it IMMEDIATELY
        if (window.speechSynthesis.speaking || isSpeakingRef.current) {
            console.log("INTERRUPTION DETECTED! Stopping AI speech.");
            stopSpeaking();
        }

        transcriptRef.current = trimmedTranscript;
        setTranscript(trimmedTranscript);
        resetSilenceTimer();
      }
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'not-allowed') setIsActive(false);
      console.error("STT Error:", event.error);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try { recognitionRef.current.abort(); } catch (e) {}
      }
      if (silenceTimerRef.current) clearTimeout(silenceTimerRef.current);
      
      // STOP AI FROM SPEAKING ON UNMOUNT
      if (window.speechSynthesis) {
        console.log("CLEANUP: Stopping AI speech synthesis");
        window.speechSynthesis.cancel();
      }
    };
  }, [startListening, stopSpeaking, resetSilenceTimer]); // These are stable UCBs

  const toggleVoiceMode = () => {
    if (isActive) {
      setIsActive(false);
      stopListening();
      stopSpeaking();
      setTranscript('');
      transcriptRef.current = '';
    } else {
      setTranscript('');
      transcriptRef.current = '';
      setIsActive(true);
      // startListening will be called by the effect logic or manually here
      setTimeout(startListening, 100);
    }
  };

  return {
    isActive, isListening, isThinking, isSpeaking, isMicActive, transcript, toggleVoiceMode, speak, stopSpeaking,
    manualSubmit: () => {
        const currentTranscript = transcriptRef.current;
        if (currentTranscript.trim()) {
            stopListening();
            handleQuery(currentTranscript);
        }
    }
  };
};
