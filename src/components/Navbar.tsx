import React, { useState } from 'react';
import { Volume2, VolumeX, Trophy, ShieldAlert, Rocket, Sparkles, Lock } from 'lucide-react';
import { sound } from '../services/sound.js';

interface NavbarProps {
  currentView: 'landing' | 'quiz' | 'results' | 'leaderboard' | 'admin';
  onNavigate: (view: 'landing' | 'quiz' | 'results' | 'leaderboard' | 'admin') => void;
  activeAttemptId?: string | null;
  isQuizActive?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  activeAttemptId,
  isQuizActive = false,
}) => {
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sound.isSoundEnabled());

  const handleToggleSound = () => {
    const newState = sound.toggleSound();
    setSoundEnabled(newState);
  };

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur-md">
      <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 h-16 flex items-center justify-between">
        
        {/* Brand / Logo */}
        <button
          onClick={() => {
            if (isQuizActive) {
              sound.playWrong();
              return;
            }
            sound.playChirp();
            onNavigate('landing');
          }}
          disabled={isQuizActive}
          className={`flex items-center gap-3 text-left group transition-all ${
            isQuizActive ? 'opacity-80 cursor-not-allowed' : 'cursor-pointer'
          }`}
          title={isQuizActive ? 'Navigation locked during active mission' : 'Return to Mission Control'}
        >
          <div className="relative w-9 h-9 rounded-lg bg-gradient-to-br from-cyan-500/30 to-blue-900/50 border border-cyan-400/50 flex items-center justify-center shadow-[0_0_12px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.7)] group-hover:border-cyan-300 transition-all">
            <Rocket className="w-5 h-5 text-cyan-300 transform -rotate-45 group-hover:scale-110 transition-transform" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-orbitron font-black text-lg sm:text-xl tracking-wider text-slate-100 group-hover:text-cyan-300 transition-colors">
                TARS WARS
              </span>
              <span className="hidden sm:inline-block px-1.5 py-0.5 rounded text-[10px] font-mono font-semibold bg-cyan-950 text-cyan-400 border border-cyan-800">
                v2.6 MISSION
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400 tracking-widest uppercase">
              Quantum Techfest
            </p>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-4">
          
          {/* Mission In Progress / Navigation Locked Indicator */}
          {isQuizActive && (
            <div className="px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/40 text-amber-300 text-xs font-mono flex items-center gap-1.5 animate-pulse shadow-[0_0_12px_rgba(245,158,11,0.2)]">
              <Lock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span className="hidden sm:inline">MISSION ACTIVE // NAVIGATION LOCKED</span>
              <span className="sm:hidden">LOCKED</span>
            </div>
          )}

          {/* Active Quiz Indicator (when navigating results or leaderboard with an active attempt) */}
          {activeAttemptId && !isQuizActive && currentView !== 'quiz' && (
            <button
              onClick={() => {
                sound.playChirp();
                onNavigate('quiz');
              }}
              className="px-2.5 py-1 rounded bg-cyan-500/10 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20 text-xs font-mono flex items-center gap-1.5 animate-pulse transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>RESUME MISSION</span>
            </button>
          )}

          {/* Leaderboard CTA (Hidden while quiz is active) */}
          {!isQuizActive && (
            <button
              onClick={() => {
                sound.playChirp();
                onNavigate('leaderboard');
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-space font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
                currentView === 'leaderboard'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,229,255,0.3)]'
                  : 'text-slate-300 hover:text-cyan-300 hover:bg-slate-900 border border-transparent'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" />
              <span className="hidden sm:inline">LEADERBOARD</span>
            </button>
          )}

          {/* Organizer / Admin Button (Separately protected by auth) */}
          <button
            onClick={() => {
              sound.playChirp();
              onNavigate('admin');
            }}
            className={`px-3 py-1.5 rounded-lg text-xs font-space font-medium flex items-center gap-1.5 transition-all cursor-pointer ${
              currentView === 'admin'
                ? 'bg-blue-600/30 text-sky-200 border border-blue-500/60 shadow-[0_0_10px_rgba(56,189,248,0.3)]'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900 border border-transparent'
            }`}
          >
            <ShieldAlert className="w-4 h-4 text-cyan-400" />
            <span className="hidden md:inline">FLIGHT COMMAND</span>
          </button>

          {/* Sound Toggle */}
          <button
            onClick={handleToggleSound}
            title={soundEnabled ? 'Mute Sci-Fi Audio' : 'Enable Sci-Fi Audio'}
            className="p-2 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-900 transition-colors cursor-pointer"
            aria-label={soundEnabled ? 'Mute Sci-Fi Audio' : 'Enable Sci-Fi Audio'}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-cyan-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-slate-500" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
