import React, { useState, useEffect, useRef } from 'react';
import BlackHole from './BlackHole';

type Phase = 'idle' | 'imploding' | 'shrinking' | 'turning_white' | 'exploding' | 'fading_out';

export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [opacity, setOpacity] = useState(1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-skip if no interaction for a bit (simulate reading/loading)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (phase === 'idle') {
        setPhase('imploding'); // Auto-trigger implosion after 3 seconds
      }
    }, 3000);
    return () => clearTimeout(timer);
  }, [phase]);

  // Handle phase transitions
  useEffect(() => {
    if (phase === 'imploding') {
      // Ring collapses into center
      const t = setTimeout(() => {
        setPhase('shrinking');
      }, 1800);
      return () => clearTimeout(t);
    }
    
    if (phase === 'shrinking') {
      // Sphere shrinks and turns white
      const t = setTimeout(() => {
        setPhase('turning_white');
      }, 1200);
      return () => clearTimeout(t);
    }

    if (phase === 'turning_white') {
      // Stays small and pure white to build anticipation
      const t = setTimeout(() => {
        setPhase('exploding');
      }, 600);
      return () => clearTimeout(t);
    }
    
    if (phase === 'exploding') {
      // Explodes massively, triggers whiteout
      const t = setTimeout(() => {
        setPhase('fading_out');
      }, 800);
      return () => clearTimeout(t);
    }

    if (phase === 'fading_out') {
      // Fades out intro overlay entirely
      setOpacity(0);
      const t = setTimeout(onComplete, 1000);
      return () => clearTimeout(t);
    }
  }, [phase, onComplete]);

  const handleInteraction = () => {
    if (phase === 'idle') {
      setPhase('imploding');
    }
  };

  // BlackHole props based on phase
  let disableRespawn = false;
  let pullSpeed = 0.5;
  let coreRadiusScale = 1;
  let coreColorOverride: string | undefined = undefined;
  let ringOpacity = 1;

  if (phase !== 'idle') {
    disableRespawn = true;
  }

  if (phase === 'imploding') {
    pullSpeed = 16.0; // Strong spiraling pull to completely swallow the ring
    coreRadiusScale = 1.0; // The sphere remains full size while swallowing
    ringOpacity = 1.0; // Keep the collapsing ring fully visible
  }

  if (phase === 'shrinking') {
    pullSpeed = 16.0;
    ringOpacity = 0; // Fade out remaining stray dust
    coreRadiusScale = 0.20; // Shrink the core down to a small dense point
    coreColorOverride = "#ffffff"; // Turns white as it compresses
  }

  if (phase === 'turning_white') {
    ringOpacity = 0;
    coreRadiusScale = 0.20; // Stays small and dense
    coreColorOverride = "#ffffff"; // White point of energy
  }

  if (phase === 'exploding' || phase === 'fading_out') {
    ringOpacity = 0;
    coreRadiusScale = 80; // Expands massively
    coreColorOverride = "#ffffff";
  }

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] bg-[#121212] transition-opacity duration-1000 flex items-center justify-center overflow-hidden"
      style={{ opacity }}
      onMouseMove={handleInteraction}
      onClick={handleInteraction}
    >
        {/* The Black Hole Canvas with NO CSS transforms during collapse */}
        <div className="absolute inset-0 transition-all origin-center pointer-events-none duration-[0ms] scale-100 brightness-100 grayscale-0">
            <BlackHole 
                orbitSpeed={5}
                pullSpeed={pullSpeed}
                particleSize={8}
                particleCount={1500}
                colors={["#ffffff", "#e0a87e"]}
                tilt={20}
                disableRespawn={disableRespawn}
                coreRadiusScale={coreRadiusScale}
                coreColorOverride={coreColorOverride}
                ringOpacity={ringOpacity}
            />
        </div>
        
        {/* Full whiteout flash overlay during explosion */}
        <div 
            className={`absolute inset-0 bg-white pointer-events-none transition-opacity ${phase === 'exploding' || phase === 'fading_out' ? 'opacity-100 duration-300' : 'opacity-0 duration-200'}`} 
        />

        {/* Loading text */}
        <div className={`absolute bottom-16 left-1/2 -translate-x-1/2 text-white/50 text-xs tracking-[0.4em] uppercase transition-opacity duration-500 font-medium ${phase === 'idle' ? 'opacity-100 animate-pulse' : 'opacity-0'}`}>
            Loading...
        </div>
    </div>
  );
}