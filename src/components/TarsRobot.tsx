import React, { useState, useEffect } from 'react';
import { Zap, Cpu } from 'lucide-react';

export type TarsState = 'idle' | 'dancing' | 'collapsing';

interface TarsRobotProps {
  energyPercentage: number; // 0 to 100
  state?: TarsState;
  score?: number;
  totalQuestions?: number;
  compact?: boolean;
  className?: string;
}

export const TarsRobot: React.FC<TarsRobotProps> = ({
  energyPercentage = 0,
  state = 'idle',
  score = 0,
  totalQuestions = 20,
  compact = false,
  className = '',
}) => {
  const [particles, setParticles] = useState<{ id: number; x: number; y: number }[]>([]);

  // Floating energy spark particles during celebration dance
  useEffect(() => {
    if (state === 'dancing') {
      const newParticles = Array.from({ length: 16 }).map((_, i) => ({
        id: Date.now() + i,
        x: (Math.random() - 0.5) * 180,
        y: -(Math.random() * 90 + 30),
      }));
      setParticles(newParticles);
      const timer = setTimeout(() => setParticles([]), 1200);
      return () => clearTimeout(timer);
    }
  }, [state, energyPercentage]);

  // Status diagnostics
  let statusText = 'STANDBY // 0% POWER';
  let statusColor = 'text-cyan-400';
  if (state === 'dancing') {
    statusText = 'ENERGY SURGE // NOMINAL';
    statusColor = 'text-emerald-400';
  } else if (state === 'collapsing') {
    statusText = 'HYDRAULIC SLUMP // RECOVERING';
    statusColor = 'text-rose-400';
  } else if (energyPercentage === 100) {
    statusText = 'MAXIMUM ENERGY ATTAINED';
    statusColor = 'text-cyan-300';
  } else if (energyPercentage > 0) {
    statusText = 'REACTOR ONLINE // CHARGING';
    statusColor = 'text-sky-300';
  }

  // Animation class based on state
  const getAnimationClass = () => {
    if (state === 'dancing') return 'tars-dancing';
    if (state === 'collapsing') return 'tars-collapsing';
    return 'tars-idle';
  };

  const totalBars = 20;
  const activeBars = Math.round((energyPercentage / 100) * totalBars);

  return (
    <div className={`relative flex flex-col items-center select-none w-full max-w-[340px] sm:max-w-[380px] xl:max-w-[420px] ${compact ? 'scale-80' : ''} ${className}`}>
      
      {/* Floating Spark Particles on Dance */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute pointer-events-none rounded-full bg-cyan-300 shadow-[0_0_10px_#00e5ff] transition-all duration-1000 ease-out"
          style={{
            width: '6px',
            height: '6px',
            transform: `translate(${p.x}px, ${p.y}px)`,
            opacity: 0,
            top: '30%',
            left: '50%',
          }}
        />
      ))}

      {/* TARS Mech Body */}
      <div className={`w-full transition-all duration-500 ${getAnimationClass()}`}>
        <div className="relative w-full h-[320px] sm:h-[350px] xl:h-[380px] flex items-center justify-center filter drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)]">
          
          {/* Detailed Scalable Vector Mech Illustration */}
          <svg
            viewBox="0 0 240 320"
            className="w-full h-full max-h-full overflow-visible"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              {/* Titanium Armor Gradients */}
              <linearGradient id="armorHead" x1="120" y1="10" x2="120" y2="60" gradientUnits="userSpaceOnUse">
                <stop stopColor="#334155" />
                <stop offset="0.5" stopColor="#1e293b" />
                <stop offset="1" stopColor="#0f172a" />
              </linearGradient>

              <linearGradient id="armorChest" x1="120" y1="65" x2="120" y2="155" gradientUnits="userSpaceOnUse">
                <stop stopColor="#475569" />
                <stop offset="0.3" stopColor="#1e293b" />
                <stop offset="0.8" stopColor="#0f172a" />
                <stop offset="1" stopColor="#020617" />
              </linearGradient>

              <linearGradient id="armorLimbs" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
                <stop stopColor="#334155" />
                <stop offset="0.6" stopColor="#1e293b" />
                <stop offset="1" stopColor="#090d16" />
              </linearGradient>

              <linearGradient id="cyanPlasma" x1="0" y1="0" x2="1" y2="1">
                <stop stopColor="#f8fafc" />
                <stop offset="0.4" stopColor="#00e5ff" />
                <stop offset="1" stopColor="#0284c7" />
              </linearGradient>

              {/* Reactor Core Radial Glow */}
              <radialGradient id="reactorGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="40%" stopColor="#00e5ff" />
                <stop offset="100%" stopColor="transparent" />
              </radialGradient>
            </defs>

            {/* 1. SHOULDERS & PAULDRONS (Image 3) */}
            <path
              d="M45 80 L75 70 L80 115 L40 120 Z"
              fill="url(#armorChest)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            <path
              d="M195 80 L165 70 L160 115 L200 120 Z"
              fill="url(#armorChest)"
              stroke="#475569"
              strokeWidth="1.5"
            />
            {/* Shoulder LED Nodes */}
            <circle
              cx="58"
              cy="95"
              r="4"
              fill={activeBars > 2 ? 'url(#cyanPlasma)' : '#334155'}
              className={activeBars > 2 ? 'filter drop-shadow-[0_0_6px_#00e5ff]' : ''}
            />
            <circle
              cx="182"
              cy="95"
              r="4"
              fill={activeBars > 4 ? 'url(#cyanPlasma)' : '#334155'}
              className={activeBars > 4 ? 'filter drop-shadow-[0_0_6px_#00e5ff]' : ''}
            />

            {/* 2. ARMS & FOREARM GUARDS (Image 3) */}
            {/* Left Arm */}
            <g className={state === 'dancing' ? 'origin-top animate-pulse' : ''}>
              <rect x="36" y="122" width="22" height="60" rx="4" fill="url(#armorHead)" stroke="#334155" />
              <rect x="32" y="185" width="26" height="50" rx="3" fill="url(#armorHead)" stroke="#1e293b" />
              {/* Arm Conduit Line */}
              <line
                x1="47"
                y1="130"
                x2="47"
                y2="175"
                stroke={activeBars > 6 ? '#00e5ff' : '#1e293b'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* Right Arm */}
            <g className={state === 'dancing' ? 'origin-top animate-pulse' : ''}>
              <rect x="182" y="122" width="22" height="60" rx="4" fill="url(#armorHead)" stroke="#334155" />
              <rect x="182" y="185" width="26" height="50" rx="3" fill="url(#armorHead)" stroke="#1e293b" />
              {/* Arm Conduit Line */}
              <line
                x1="193"
                y1="130"
                x2="193"
                y2="175"
                stroke={activeBars > 8 ? '#00e5ff' : '#1e293b'}
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </g>

            {/* 3. TORSO & CHEST CARAPACE (Image 3) */}
            <path
              d="M78 68 L162 68 L152 145 L120 165 L88 145 Z"
              fill="url(#armorChest)"
              stroke="#64748b"
              strokeWidth="1.8"
            />
            {/* Beveled Chest Plate Seams */}
            <path d="M88 85 L120 100 L152 85" stroke="#334155" strokeWidth="1.5" />
            <path d="M100 135 L120 148 L140 135" stroke="#1e293b" strokeWidth="1.5" />

            {/* 4. CENTRAL CHEST ARC REACTOR (Image 3 Key Focal Point) */}
            <circle cx="120" cy="115" r="16" fill="#090d16" stroke="#475569" strokeWidth="2" />
            <circle
              cx="120"
              cy="115"
              r="12"
              fill={energyPercentage > 0 ? 'url(#cyanPlasma)' : '#1e293b'}
              className={`transition-all duration-300 ${
                energyPercentage > 0 ? 'filter drop-shadow-[0_0_12px_#00e5ff] animate-pulse' : ''
              }`}
            />
            <circle cx="120" cy="115" r="5" fill={energyPercentage > 0 ? '#ffffff' : '#0f172a'} />

            {/* Chest Conduit Nodes */}
            <circle
              cx="96"
              cy="98"
              r="3.5"
              fill={activeBars > 1 ? '#00e5ff' : '#1e293b'}
              className={activeBars > 1 ? 'filter drop-shadow-[0_0_5px_#00e5ff]' : ''}
            />
            <circle
              cx="144"
              cy="98"
              r="3.5"
              fill={activeBars > 3 ? '#00e5ff' : '#1e293b'}
              className={activeBars > 3 ? 'filter drop-shadow-[0_0_5px_#00e5ff]' : ''}
            />

            {/* 5. WAIST & HIP GIRDLE */}
            <rect x="94" y="165" width="52" height="24" rx="3" fill="url(#armorChest)" stroke="#334155" />
            <line x1="102" y1="177" x2="138" y2="177" stroke="#00e5ff" strokeWidth="1.5" opacity={activeBars > 10 ? 1 : 0.2} />

            {/* 6. LEGS & POWER HYDRAULICS (Image 3) */}
            {/* Left Leg */}
            <rect x="88" y="192" width="28" height="62" rx="4" fill="url(#armorChest)" stroke="#334155" />
            <rect x="84" y="258" width="34" height="52" rx="4" fill="url(#armorHead)" stroke="#1e293b" />
            {/* Leg Conduits */}
            <line
              x1="102"
              y1="202"
              x2="102"
              y2="245"
              stroke={activeBars > 12 ? '#00e5ff' : '#1e293b'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="101"
              y1="268"
              x2="101"
              y2="298"
              stroke={activeBars > 16 ? '#38bdf8' : '#1e293b'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* Right Leg */}
            <rect x="124" y="192" width="28" height="62" rx="4" fill="url(#armorChest)" stroke="#334155" />
            <rect x="122" y="258" width="34" height="52" rx="4" fill="url(#armorHead)" stroke="#1e293b" />
            {/* Leg Conduits */}
            <line
              x1="138"
              y1="202"
              x2="138"
              y2="245"
              stroke={activeBars > 14 ? '#00e5ff' : '#1e293b'}
              strokeWidth="3"
              strokeLinecap="round"
            />
            <line
              x1="139"
              y1="268"
              x2="139"
              y2="298"
              stroke={activeBars > 18 ? '#38bdf8' : '#1e293b'}
              strokeWidth="2.5"
              strokeLinecap="round"
            />

            {/* 7. ARTICULATED HEAD & VISOR OPTICS (Image 3 Key Focal Point) */}
            <path
              d="M98 25 L142 25 L148 45 L136 64 L104 64 L92 45 Z"
              fill="url(#armorHead)"
              stroke="#64748b"
              strokeWidth="1.8"
            />
            {/* Crown Antenna / Rangefinder */}
            <line x1="100" y1="24" x2="96" y2="12" stroke="#64748b" strokeWidth="2" />
            <circle cx="95" cy="11" r="2" fill="#00e5ff" />

            {/* Glowing Cyan Optical Visor Eyes (Directly matching Image 3) */}
            <polygon
              points="104,36 114,37 112,43 103,42"
              fill={state === 'collapsing' ? '#e11d48' : '#00e5ff'}
              className="filter drop-shadow-[0_0_8px_#00e5ff]"
            />
            <polygon
              points="126,37 136,36 137,42 128,43"
              fill={state === 'collapsing' ? '#e11d48' : '#00e5ff'}
              className="filter drop-shadow-[0_0_8px_#00e5ff]"
            />
          </svg>
        </div>

        {/* Shadow Grounding */}
        <div className="w-48 sm:w-56 h-3 mx-auto -mt-2 bg-cyan-950/40 rounded-full blur-md" />
      </div>

      {/* Holographic Diagnostic HUD Telemetry Panel */}
      <div className="mt-3.5 w-full glass-panel p-4 rounded-xl border border-cyan-500/35 text-xs font-mono shadow-2xl">
        
        {/* Header Readout */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400">
          <span className="flex items-center gap-1.5 font-bold tracking-wider text-slate-100 font-orbitron text-[11px]">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" /> TARS MECH MK-IV
          </span>
          <span className="text-[10px] bg-slate-900 px-2 py-0.5 rounded text-cyan-300 border border-slate-700">
            ONLINE
          </span>
        </div>

        {/* Live Energy Gauge */}
        <div className="py-2.5">
          <div className="flex justify-between items-center mb-1.5">
            <span className="flex items-center gap-1 text-slate-200 font-semibold text-xs">
              <Zap className={`w-3.5 h-3.5 ${energyPercentage > 0 ? 'text-cyan-400 fill-cyan-400' : 'text-slate-600'}`} />
              CORE POWER
            </span>
            <span className="font-orbitron font-bold text-sm text-cyan-300 glow-text-cyan">
              {energyPercentage}%
            </span>
          </div>

          {/* 20 Segmented LED Reactor Bars (5% each = 20 total) */}
          <div className="w-full h-3.5 bg-slate-950 rounded-xs overflow-hidden p-0.5 border border-slate-700/80 flex gap-0.5">
            {Array.from({ length: 20 }).map((_, i) => {
              const isFilled = i < activeBars;
              return (
                <div
                  key={i}
                  className={`flex-1 h-full rounded-2xs transition-all duration-300 ${
                    isFilled
                      ? 'bg-gradient-to-t from-cyan-500 to-sky-300 shadow-[0_0_8px_#00e5ff]'
                      : 'bg-slate-900/60'
                  }`}
                />
              );
            })}
          </div>

          <div className="flex justify-between items-center mt-1 text-[10px] text-slate-400">
            <span>0% OFFLINE</span>
            <span className="text-cyan-400 font-bold">{score}/{totalQuestions} CHARGED</span>
            <span>100% MAX</span>
          </div>
        </div>

        {/* Diagnostics & Alignment Settings */}
        <div className="pt-2 border-t border-slate-800/80 flex flex-col gap-1 text-[11px]">
          <div className="flex items-center justify-between">
            <span className="text-slate-400 text-[10px]">DIAGNOSTIC:</span>
            <span className={`font-semibold ${statusColor} text-[10px]`}>{statusText}</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>HUMOR: 75%</span>
            <span>HONESTY: 90%</span>
          </div>
        </div>
      </div>
    </div>
  );
};
