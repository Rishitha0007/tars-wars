import React, { useEffect, useState } from 'react';
import { Clock, AlertTriangle } from 'lucide-react';

interface CircularHudTimerProps {
  deadlineAt: string;
  totalSeconds?: number;
  onExpire: () => void;
  isPaused?: boolean;
}

export const CircularHudTimer: React.FC<CircularHudTimerProps> = ({
  deadlineAt,
  totalSeconds = 45,
  onExpire,
  isPaused = false,
}) => {
  const [remaining, setRemaining] = useState<number>(() => {
    if (!deadlineAt) return totalSeconds;
    const diff = Math.ceil((new Date(deadlineAt).getTime() - Date.now()) / 1000);
    return Math.max(0, Math.min(totalSeconds, diff));
  });

  useEffect(() => {
    if (!deadlineAt || isPaused) return;

    const interval = setInterval(() => {
      const now = Date.now();
      const target = new Date(deadlineAt).getTime();
      const diff = Math.ceil((target - now) / 1000);

      if (diff <= 0) {
        setRemaining(0);
        clearInterval(interval);
        onExpire();
      } else {
        setRemaining(Math.min(totalSeconds, diff));
      }
    }, 250);

    return () => clearInterval(interval);
  }, [deadlineAt, totalSeconds, onExpire, isPaused]);

  // SVG circular progress parameters
  const size = 68;
  const strokeWidth = 5;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progressRatio = Math.max(0, Math.min(1, remaining / totalSeconds));
  const strokeDashoffset = circumference - progressRatio * circumference;

  // Dynamic color coding based on remaining time
  let strokeColor = '#00e5ff'; // Cyan default
  let glowColor = 'rgba(0, 229, 255, 0.4)';
  let textColor = 'text-cyan-300';
  let isCritical = false;

  if (remaining <= 10) {
    strokeColor = '#f43f5e'; // Red critical
    glowColor = 'rgba(244, 63, 94, 0.6)';
    textColor = 'text-rose-400';
    isCritical = true;
  } else if (remaining <= 20) {
    strokeColor = '#fbbf24'; // Amber warning
    glowColor = 'rgba(251, 191, 36, 0.5)';
    textColor = 'text-amber-300';
  }

  return (
    <div className="relative flex items-center gap-2.5 select-none">
      <div className="relative w-[68px] h-[68px] flex items-center justify-center">
        {/* SVG Ring */}
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background Track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Progress Arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 0.3s linear, stroke 0.3s ease',
              filter: `drop-shadow(0 0 6px ${glowColor})`,
            }}
          />
        </svg>

        {/* Center Number */}
        <div className={`absolute flex flex-col items-center justify-center ${textColor}`}>
          <span className={`font-orbitron font-bold text-base leading-none ${isCritical ? 'animate-pulse' : ''}`}>
            {remaining}s
          </span>
        </div>
      </div>

      {/* Label & Status */}
      <div className="flex flex-col font-mono text-xs">
        <span className="text-[10px] text-slate-400 tracking-wider flex items-center gap-1 font-semibold">
          {isCritical ? (
            <AlertTriangle className="w-3 h-3 text-rose-400 animate-bounce" />
          ) : (
            <Clock className="w-3 h-3 text-cyan-400" />
          )}
          DEADLINE
        </span>
        <span className={`font-bold text-[11px] ${textColor}`}>
          {isCritical ? 'CRITICAL' : remaining <= 20 ? 'WARNING' : 'NOMINAL'}
        </span>
      </div>
    </div>
  );
};
