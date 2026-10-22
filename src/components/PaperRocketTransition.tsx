import React, { useState, useEffect } from 'react';
import { sound } from '../services/sound.js';

export type RocketTransitionPhase =
  | 'idle'
  | 'folding'
  | 'outgoing-launch'
  | 'incoming-flight'
  | 'unfolding'
  | 'final-launch';

interface PaperRocketTransitionProps {
  children: React.ReactNode;
  isTransitioning: boolean;
  isFinalQuestion: boolean;
  onTransitionComplete: () => void;
  onQuestionSwitchPoint?: () => void; // Triggered when outgoing is offscreen to switch data
}

export const PaperRocketTransition: React.FC<PaperRocketTransitionProps> = ({
  children,
  isTransitioning,
  isFinalQuestion,
  onTransitionComplete,
  onQuestionSwitchPoint,
}) => {
  const [phase, setPhase] = useState<RocketTransitionPhase>('idle');
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    if (!isTransitioning) {
      setPhase('idle');
      return;
    }

    if (prefersReducedMotion) {
      // Reduced motion: quick clean transition
      if (onQuestionSwitchPoint) onQuestionSwitchPoint();
      const timer = setTimeout(() => {
        onTransitionComplete();
        setPhase('idle');
      }, 350);
      return () => clearTimeout(timer);
    }

    if (isFinalQuestion) {
      // Final question: Launch into Gargantua Singularity
      setPhase('folding');
      sound.playRocketLaunch();

      const t1 = setTimeout(() => {
        setPhase('final-launch');
      }, 300);

      const t2 = setTimeout(() => {
        onTransitionComplete();
        setPhase('idle');
      }, 1200);

      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
      };
    }

    // Standard Question Transition (Outgoing -> Incoming)
    // 1. Fold card into paper rocket
    setPhase('folding');

    // 2. Outgoing rocket launches up
    const tLaunch = setTimeout(() => {
      setPhase('outgoing-launch');
      sound.playRocketLaunch();
    }, 280);

    // 3. Peak of flight: switch data underneath while off-screen
    const tSwitch = setTimeout(() => {
      if (onQuestionSwitchPoint) onQuestionSwitchPoint();
      setPhase('incoming-flight');
    }, 620);

    // 4. Incoming rocket enters and unfolds
    const tUnfold = setTimeout(() => {
      setPhase('unfolding');
      sound.playUnfold();
    }, 880);

    // 5. Complete and unlock controls
    const tDone = setTimeout(() => {
      setPhase('idle');
      onTransitionComplete();
    }, 1180);

    return () => {
      clearTimeout(tLaunch);
      clearTimeout(tSwitch);
      clearTimeout(tUnfold);
      clearTimeout(tDone);
    };
  }, [isTransitioning, isFinalQuestion, prefersReducedMotion]);

  // Reusable Origami Paper Rocket SVG Silhouette
  const renderOrigamiRocket = (extraClasses: string = '') => (
    <div className={`relative flex flex-col items-center select-none ${extraClasses}`}>
      <svg
        viewBox="0 0 120 180"
        className="w-28 h-40 filter drop-shadow-[0_0_15px_rgba(0,229,255,0.7)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Left Wing (Origami folded facet) */}
        <path
          d="M60 10 L15 150 L60 130 Z"
          fill="url(#leftWingGrad)"
          stroke="#00e5ff"
          strokeWidth="1.2"
        />
        {/* Right Wing (Origami folded facet with light reflection) */}
        <path
          d="M60 10 L105 150 L60 130 Z"
          fill="url(#rightWingGrad)"
          stroke="#00e5ff"
          strokeWidth="1.2"
        />
        {/* Center Fuselage Fold Crease */}
        <path
          d="M60 10 L48 135 L60 130 L72 135 Z"
          fill="url(#centerFoldGrad)"
          stroke="rgba(255,255,255,0.8)"
          strokeWidth="1.5"
        />
        {/* Sharp Center Spine Line */}
        <line x1="60" y1="10" x2="60" y2="130" stroke="#00e5ff" strokeWidth="1.8" />

        {/* Paper Folds Shading Gradients */}
        <defs>
          <linearGradient id="leftWingGrad" x1="15" y1="80" x2="60" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#e2e8f0" />
            <stop offset="0.7" stopColor="#cbd5e1" />
            <stop offset="1" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="rightWingGrad" x1="60" y1="80" x2="105" y2="80" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f8fafc" />
            <stop offset="0.5" stopColor="#f1f5f9" />
            <stop offset="1" stopColor="#e2e8f0" />
          </linearGradient>
          <linearGradient id="centerFoldGrad" x1="60" y1="10" x2="60" y2="135" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffffff" />
            <stop offset="1" stopColor="#38bdf8" />
          </linearGradient>
        </defs>
      </svg>

      {/* Cyan Plasma Thruster Exhaust Trail */}
      <div className="relative -mt-6 flex flex-col items-center">
        <div className="w-4 h-12 bg-gradient-to-b from-cyan-300 via-sky-400 to-transparent rounded-full filter blur-[2px] animate-pulse" />
        <div className="w-1.5 h-16 bg-white rounded-full filter blur-[1px] -mt-10" />
        {/* Micro particle sparks */}
        <div className="w-1 h-1 bg-cyan-200 rounded-full animate-ping -mt-3" />
      </div>
    </div>
  );

  return (
    <div className="relative w-full overflow-visible perspective-1000">
      {/* 1. OUTGOING: Origami Paper Rocket Launching Up */}
      {(phase === 'folding' || phase === 'outgoing-launch') && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div
            className={`transition-all duration-300 ${
              phase === 'folding' ? 'anim-fold-rocket' : 'anim-rocket-launch'
            }`}
          >
            {renderOrigamiRocket()}
          </div>
        </div>
      )}

      {/* 2. INCOMING: Origami Paper Rocket Flying Up & Decelerating */}
      {phase === 'incoming-flight' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="anim-rocket-incoming">
            {renderOrigamiRocket()}
          </div>
        </div>
      )}

      {/* 3. FINAL MISSION LAUNCH: Hyperdrive Singularity Launch */}
      {phase === 'final-launch' && (
        <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none">
          <div className="anim-final-warp">
            {renderOrigamiRocket('scale-125')}
          </div>
        </div>
      )}

      {/* Question Card Content Container */}
      <div
        className={`w-full transition-opacity duration-300 ${
          phase === 'folding' || phase === 'outgoing-launch' || phase === 'incoming-flight' || phase === 'final-launch'
            ? 'opacity-0 scale-95 pointer-events-none'
            : phase === 'unfolding'
            ? 'anim-unfold-card pointer-events-none'
            : 'opacity-100 scale-100'
        }`}
      >
        {children}
      </div>
    </div>
  );
};
