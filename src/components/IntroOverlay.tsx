import { useEffect, useState } from 'react';
import BlackHole from './BlackHole';

type Phase = 'idle' | 'imploding' | 'shrinking' | 'turning_white' | 'exploding' | 'fading_out';

export default function IntroOverlay({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<Phase>('idle');
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const short = window.innerWidth < 600;
    const timer = window.setTimeout(() => setPhase(reduced ? 'fading_out' : 'imploding'), reduced ? 80 : short ? 350 : 450);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const short = window.innerWidth < 600;
    const durations: Partial<Record<Phase, number>> = {
      imploding: short ? 600 : 900,
      shrinking: short ? 450 : 550,
      turning_white: short ? 180 : 220,
      exploding: short ? 260 : 320,
      fading_out: short ? 260 : 320,
    };
    const duration = durations[phase];
    if (!duration) return;
    const timer = window.setTimeout(() => {
      if (phase === 'fading_out') {
        setOpacity(0);
        window.setTimeout(onComplete, short ? 260 : 320);
      } else {
        setPhase(({ imploding: 'shrinking', shrinking: 'turning_white', turning_white: 'exploding', exploding: 'fading_out' } as const)[phase]);
      }
    }, duration);
    return () => window.clearTimeout(timer);
  }, [phase, onComplete]);

  const skip = () => setPhase('fading_out');
  const imploding = phase !== 'idle';
  const shrinking = phase === 'shrinking' || phase === 'turning_white';
  const exploding = phase === 'exploding' || phase === 'fading_out';

  return <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#0d0c0d] transition-opacity duration-500" style={{ opacity }} role="dialog" aria-label="Opening animation" aria-modal="true">
    <div className="absolute inset-0 pointer-events-none">
      <BlackHole
        orbitSpeed={5}
        pullSpeed={imploding ? 16 : .5}
        particleSize={6}
        particleCount={window.innerWidth < 600 ? 360 : 900}
        colors={["#ffffff", "#d7a36d"]}
        tilt={20}
        disableRespawn={imploding}
        coreRadiusScale={exploding ? 80 : shrinking ? .2 : 1}
        coreColorOverride={shrinking || exploding ? '#ffffff' : undefined}
        ringOpacity={shrinking || exploding ? 0 : 1}
      />
    </div>
    <div className={`absolute inset-0 pointer-events-none bg-white transition-opacity ${exploding ? 'opacity-100 duration-200' : 'opacity-0 duration-150'}`} />
    <p className={`absolute bottom-16 left-1/2 -translate-x-1/2 text-white/60 text-[11px] tracking-[.3em] uppercase transition-opacity duration-300 ${phase === 'idle' ? 'opacity-100' : 'opacity-0'}`}>Kay G. Hagler</p>
    <button type="button" className="absolute bottom-8 right-8 z-10 min-h-11 rounded-full border border-white/25 px-4 py-2 text-xs uppercase tracking-widest text-white/75 transition-colors hover:border-white hover:text-white" onClick={skip}>Skip intro</button>
  </div>;
}
