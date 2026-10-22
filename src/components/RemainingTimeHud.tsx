import React, { useEffect, useState } from 'react';
import { Play, Activity, AlertTriangle } from 'lucide-react';

interface RemainingTimeHudProps {
  initialSeconds?: number;
  onExpire: () => void;
  isPaused?: boolean;
  onTick?: (secondsLeft: number) => void;
}

export const RemainingTimeHud: React.FC<RemainingTimeHudProps> = ({
  initialSeconds = 45,
  onExpire,
  isPaused = false,
  onTick,
}) => {
  const [secondsLeft, setSecondsLeft] = useState<number>(initialSeconds);

  // Reset timer if initialSeconds changes (e.g. on new question)
  useEffect(() => {
    setSecondsLeft(initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (isPaused) return;

    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onExpire();
          return 0;
        }
        const next = prev - 1;
        if (onTick) onTick(next);
        return next;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPaused, onExpire, onTick]);

  const formatTime = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(mins)}:${pad(secs)}`;
  };

  const isUrgent = secondsLeft <= 8;
  const isWarning = secondsLeft <= 18 && !isUrgent;

  // Color theme based on urgency
  const theme = isUrgent
    ? {
        border: 'border-rose-500/80',
        glow: 'shadow-[0_0_25px_rgba(244,63,94,0.5)]',
        text: 'text-rose-400 glow-text-rose',
        accent: 'bg-rose-500',
        line: '#f43f5e',
        tag: 'text-rose-300',
        status: 'CRITICAL',
      }
    : isWarning
    ? {
        border: 'border-amber-500/80',
        glow: 'shadow-[0_0_25px_rgba(251,191,36,0.4)]',
        text: 'text-amber-300 glow-text-amber',
        accent: 'bg-amber-400',
        line: '#fbbf24',
        tag: 'text-amber-300',
        status: 'WARNING',
      }
    : {
        border: 'border-cyan-400/80',
        glow: 'shadow-[0_0_30px_rgba(0,229,255,0.45)]',
        text: 'text-cyan-300 glow-text-cyan',
        accent: 'bg-cyan-400',
        line: '#00e5ff',
        tag: 'text-cyan-300',
        status: 'ACTIVE',
      };

  return (
    <div className="relative inline-flex items-center justify-center select-none py-1">
      
      {/* Background Dot-Grid Corner Accents */}
      <div className="absolute -left-2 -right-2 inset-y-0 flex items-center justify-between pointer-events-none opacity-40">
        <div className="w-6 h-6 border-l border-t border-cyan-500/30" />
        <div className="w-6 h-6 border-r border-t border-cyan-500/30" />
      </div>

      {/* Main HUD Frame (Directly inspired by Image 1) */}
      <div
        className={`relative px-8 py-3.5 rounded-lg bg-slate-950/85 backdrop-blur-md border ${theme.border} ${theme.glow} transition-all duration-300 min-w-[260px] flex flex-col items-center`}
        style={{
          clipPath:
            'polygon(16px 0%, calc(100% - 16px) 0%, 100% 16px, 100% calc(100% - 16px), calc(100% - 16px) 100%, 16px 100%, 0% calc(100% - 16px), 0% 16px)',
        }}
      >
        {/* Top Notch Label: REMAINING TIME */}
        <div className="absolute -top-3 px-3 py-0.5 rounded-full bg-slate-950 border border-cyan-500/50 flex items-center gap-1.5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
          <span className="font-orbitron font-bold text-[9px] tracking-widest text-cyan-200 uppercase">
            REMAINING TIME
          </span>
        </div>

        {/* Outer Bracket Corners (Image 1 aesthetic) */}
        <div className="absolute top-1 left-2 w-3 h-3 border-t-2 border-l-2 border-cyan-400" />
        <div className="absolute top-1 right-2 w-3 h-3 border-t-2 border-r-2 border-cyan-400" />
        <div className="absolute bottom-1 left-2 w-3 h-3 border-b-2 border-l-2 border-cyan-400" />
        <div className="absolute bottom-1 right-2 w-3 h-3 border-b-2 border-r-2 border-cyan-400" />

        {/* Circular Orbital Arc Behind Clock */}
        <svg
          viewBox="0 0 200 80"
          className="absolute inset-0 w-full h-full pointer-events-none opacity-30 overflow-visible"
        >
          <ellipse
            cx="100"
            cy="40"
            rx="92"
            ry="36"
            fill="none"
            stroke={theme.line}
            strokeWidth="1"
            strokeDasharray="6 4"
          />
          <circle cx="12" cy="40" r="2.5" fill={theme.line} />
          <circle cx="188" cy="40" r="2.5" fill={theme.line} />
        </svg>

        {/* Big Digital Readout (00:45) */}
        <div className="my-1 flex items-baseline justify-center">
          <span
            className={`font-orbitron font-black text-3xl sm:text-4xl tracking-widest leading-none ${theme.text} ${
              isUrgent ? 'animate-pulse' : ''
            }`}
          >
            {formatTime(secondsLeft)}
          </span>
        </div>

        {/* Bottom Micro Telemetry Strip (from Image 1) */}
        <div className="flex items-center justify-between w-full pt-1 border-t border-slate-800/80 text-[10px] font-mono text-slate-400">
          <div className="flex items-center gap-1.5">
            <Activity className="w-3 h-3 text-cyan-400" />
            <span className={`font-semibold tracking-wider ${theme.tag}`}>
              {theme.status}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400" />
            <span className="text-[9px] text-slate-400 tracking-wider">45s / Q</span>
          </div>
        </div>
      </div>
    </div>
  );
};
