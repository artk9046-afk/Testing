import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plane, ChevronsRight } from 'lucide-react';

interface IntroProps {
  onComplete: () => void;
}

const IntroAnimation: React.FC<IntroProps> = ({ onComplete }) => {
  const [phase, setPhase] = useState<'init' | 'sound_pre' | 'fly' | 'impact'>('init');
  
  // Audio Context Ref
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Cleanup Audio Context on unmount
  useEffect(() => {
    return () => {
      if (audioCtxRef.current && audioCtxRef.current.state !== 'closed') {
        audioCtxRef.current.close();
      }
    };
  }, []);

  // --- Sound Generation (Procedural) ---
  const initAudio = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
  };

  const playJetSequence = () => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    const t = ctx.currentTime;

    // --- ENGINE SOUND (Jet Whoosh) ---
    const bufferSize = ctx.sampleRate * 2.5; 
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = 'lowpass';
    // Start low, go high (flyby), go low
    filter.frequency.setValueAtTime(200, t); 
    filter.frequency.exponentialRampToValueAtTime(4000, t + 1.2); // Peak when plane is center
    filter.frequency.exponentialRampToValueAtTime(100, t + 2.5);

    const gain = ctx.createGain();
    // Fade in slowly (hearing it approach)
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.4, t + 1.0); 
    gain.gain.exponentialRampToValueAtTime(0.01, t + 2.5);

    const panner = ctx.createStereoPanner();
    panner.pan.setValueAtTime(-1, t); // Left
    panner.pan.linearRampToValueAtTime(1, t + 2.0); // Right

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(panner);
    panner.connect(ctx.destination);
    noise.start(t);
  };

  const playDropAndImpact = (delay: number) => {
    if (!audioCtxRef.current) return;
    const ctx = audioCtxRef.current;
    
    setTimeout(() => {
        const t = ctx.currentTime;
        
        // Falling whistle (Sci-fi)
        const osc = ctx.createOscillator();
        osc.frequency.setValueAtTime(1200, t);
        osc.frequency.exponentialRampToValueAtTime(100, t + 0.6);
        
        const oscGain = ctx.createGain();
        oscGain.gain.setValueAtTime(0.1, t);
        oscGain.gain.linearRampToValueAtTime(0, t + 0.6);
        
        osc.connect(oscGain);
        oscGain.connect(ctx.destination);
        osc.start(t);

        // Impact Boom
        setTimeout(() => {
            const t2 = ctx.currentTime;
            const impactOsc = ctx.createOscillator();
            impactOsc.frequency.setValueAtTime(100, t2);
            impactOsc.frequency.exponentialRampToValueAtTime(0.01, t2 + 0.5);
            
            const impactGain = ctx.createGain();
            impactGain.gain.setValueAtTime(0.8, t2);
            impactGain.gain.exponentialRampToValueAtTime(0.01, t2 + 1);

            impactOsc.connect(impactGain);
            impactGain.connect(ctx.destination);
            impactOsc.start(t2);
        }, 500); // Impact happens 500ms after drop start
    }, delay * 1000);
  };

  const startSequence = () => {
    initAudio();
    setPhase('sound_pre');
    
    // 1. Start Sound FIRST (Hear it coming)
    playJetSequence();

    // 2. Visual Plane appears shortly after sound starts (0.6s delay)
    setTimeout(() => {
        setPhase('fly');
        
        // 3. Drop sound syncs with the drop animation
        playDropAndImpact(0.5); 
    }, 600);

    // 4. Impact visual phase
    setTimeout(() => {
      setPhase('impact');
    }, 1700); // 600 initial + 1100 fly time

    // 5. Complete
    setTimeout(() => {
      onComplete();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950 overflow-hidden perspective-[1000px]">
      
      {/* Dynamic Grid Background */}
      <div className="absolute inset-0">
         <div className="absolute inset-0 bg-[linear-gradient(to_right,#0057B810_1px,transparent_1px),linear-gradient(to_bottom,#0057B810_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]"></div>
      </div>

      {phase === 'init' && (
         <motion.button
            whileHover={{ scale: 1.05, textShadow: "0 0 8px rgb(0,87,184)" }}
            whileTap={{ scale: 0.95 }}
            onClick={startSequence}
            className="z-50 flex flex-col items-center gap-4 group"
         >
            <div className="w-24 h-24 rounded-full border-2 border-ua-blue/50 flex items-center justify-center relative overflow-hidden bg-slate-900/50 backdrop-blur-sm shadow-[0_0_30px_rgba(0,87,184,0.3)]">
               <div className="absolute inset-0 bg-ua-blue/20 animate-pulse"></div>
               <ChevronsRight size={40} className="text-ua-yellow relative z-10 ml-1 group-hover:translate-x-1 transition-transform" />
            </div>
            <span className="font-mono text-sm text-ua-blue tracking-widest uppercase animate-pulse">START ENGINE</span>
         </motion.button>
      )}

      <AnimatePresence>
        {/* Phase 2: The Jet - Straighter, Faster */}
        {phase === 'fly' && (
          <>
            <motion.div
              initial={{ x: '-110vw', y: '0vh', scale: 0.8, rotate: 0 }}
              animate={{ 
                x: '110vw', 
                y: '-10vh', // Slight rise
                rotate: 0 
              }}
              transition={{ duration: 1.2, ease: "linear" }}
              className="absolute z-20 text-white drop-shadow-[0_0_25px_rgba(0,87,184,0.8)] will-change-transform" 
            >
              {/* Afterburner Trail */}
              <div className="absolute top-1/2 right-full h-1 bg-gradient-to-l from-ua-yellow via-orange-500 to-transparent w-[400px] -translate-y-1/2 blur-sm opacity-80"></div>
              
              {/* The Jet */}
              <div className="relative transform rotate-90">
                <Plane size={100} strokeWidth={1.5} className="fill-slate-900 text-ua-blue" />
              </div>
            </motion.div>

            {/* The 3D Capsule Drop */}
            <motion.div
              initial={{ x: '0', y: '0', scale: 0.1, opacity: 0, rotateX: 0 }}
              animate={{ 
                x: ['-20vw', '0vw'],  // Follows plane briefly then centers
                y: ['0vh', '10vh'],
                scale: [0.1, 4], // Zooms towards camera
                opacity: [0, 1],
                rotate: 360,
                rotateX: 45 // 3D tumble
              }}
              transition={{ 
                  duration: 0.8, 
                  delay: 0.4, // Drops when plane is near center
                  ease: "circIn" 
              }}
              className="absolute z-30 will-change-transform"
            >
               <div className="w-16 h-24 bg-gradient-to-b from-ua-blue/80 to-ua-blue/20 border border-ua-yellow rounded-xl shadow-[0_0_50px_rgba(255,215,0,0.6)] backdrop-blur-md flex items-center justify-center">
                  <div className="w-2 h-12 bg-ua-yellow rounded-full animate-pulse"></div>
               </div>
            </motion.div>
          </>
        )}

        {/* Phase 3: Impact Flash */}
        {phase === 'impact' && (
          <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
              <motion.div
                 initial={{ opacity: 1, scale: 1 }}
                 animate={{ opacity: 0, scale: 2 }}
                 transition={{ duration: 0.8 }}
                 className="w-full h-full bg-ua-blue mix-blend-screen"
              />
              <motion.div
                 initial={{ width: 0, height: 0, opacity: 1 }}
                 animate={{ width: '150vw', height: '150vh', opacity: 0 }}
                 transition={{ duration: 0.6, ease: 'easeOut' }}
                 className="rounded-full border-[20px] border-ua-yellow absolute"
              />
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroAnimation;