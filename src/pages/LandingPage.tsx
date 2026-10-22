import React, { useState } from 'react';
import { Rocket, Shield, AlertCircle, ArrowRight, Zap, Clock, Terminal, ChevronRight } from 'lucide-react';
import { TarsRobot } from '../components/TarsRobot.js';
import { sound } from '../services/sound.js';
import { startNewQuizSession } from '../services/quizSession.js';

interface LandingPageProps {
  onStartQuiz: (attemptData: {
    attemptId: string;
    rollNumber: string;
    score: number;
    energyPercentage: number;
    resumed: boolean;
  }) => void;
  onViewLeaderboard: () => void;
  onOpenAdmin: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onStartQuiz,
  onViewLeaderboard,
  onOpenAdmin,
}) => {
  const [rollNumber, setRollNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const trimmed = rollNumber.trim().toUpperCase();
    if (!trimmed) {
      setError('Please enter your college roll number.');
      return;
    }

    if (trimmed.length < 2) {
      setError('Roll number must be at least 2 characters long.');
      return;
    }

    try {
      setLoading(true);
      sound.playChirp();

      // Initialize fresh 20-question randomized session from the verified 200 question bank
      const newSession = startNewQuizSession(trimmed);

      sound.playCorrect();
      onStartQuiz({
        attemptId: newSession.attemptId,
        rollNumber: newSession.rollNumber,
        score: newSession.score,
        energyPercentage: newSession.energyPercentage,
        resumed: false,
      });
    } catch (err: any) {
      sound.playWrong();
      setError(err.message || 'Failed to initialize mission session');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center min-h-[calc(100vh-4rem)] justify-center">
      
      {/* Hero Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-4 tracking-widest shadow-[0_0_15px_rgba(0,229,255,0.25)]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>ASTRION TECHFEST // ENDURANCE QUANTUM INITIATIVE</span>
        </div>

        <h1 className="font-orbitron font-black text-4xl sm:text-6xl md:text-7xl tracking-wider text-slate-100 mb-2 glow-text-white">
          TARS <span className="text-cyan-400 glow-text-cyan">WARS</span>
        </h1>

        <h2 className="font-orbitron font-bold text-xl sm:text-2xl text-cyan-300 tracking-wide mb-3 glow-text-cyan">
          ENTER THE EVENT HORIZON
        </h2>

        <p className="text-base sm:text-lg text-slate-300 font-space font-light max-w-2xl mx-auto leading-relaxed">
          Initialize the TARS quantum robot core. Answer 20 randomized high-caliber technical challenges across computer science, aerospace, and innovation to power the reactor before traversing the Gargantua black-hole singularity.
        </p>
      </div>

      {/* Main Grid: Pilot Entry Panel + TARS Standby Companion */}
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        
        {/* Left Column: Mission Entry Card */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/30 shadow-2xl hud-corner">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div>
                <h2 className="font-orbitron font-bold text-lg text-slate-100 flex items-center gap-2">
                  <Rocket className="w-5 h-5 text-cyan-400" /> PILOT AUTHENTICATION
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Universal Technical Fest Mission Entry
                </p>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_#10b981] animate-ping" />
            </div>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-4 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs sm:text-sm flex items-start gap-3 shadow-lg">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-rose-300">ACCESS RESTRICTED</p>
                  <p className="mt-0.5 text-rose-200/90">{error}</p>
                </div>
              </div>
            )}

            {/* Roll Number Form */}
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="rollNumberInput"
                  className="block text-xs font-mono font-semibold tracking-wider text-slate-300 uppercase mb-2"
                >
                  COLLEGE ROLL NUMBER / STUDENT ID
                </label>
                <div className="relative">
                  <input
                    id="rollNumberInput"
                    type="text"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    placeholder="e.g. 21BCE1042 / CS24-001"
                    className="w-full px-4 py-3.5 rounded-xl bg-slate-900/90 border border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/20 text-slate-100 font-mono text-base tracking-wider placeholder:text-slate-600 outline-none transition-all"
                    disabled={loading}
                    autoComplete="off"
                    autoFocus
                  />
                  <div className="absolute right-3 top-3.5 text-slate-500 text-xs font-mono">
                    [REQ]
                  </div>
                </div>
                <p className="text-[11px] font-mono text-slate-400 mt-2">
                  Draws 20 unique challenges without replacement from the 200 verified PDF questions.
                </p>
              </div>

              {/* Start Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-2 w-full py-4 rounded-xl btn-primary flex items-center justify-center gap-3 text-sm sm:text-base group cursor-pointer"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>SYNCHRONIZING TARS CORE...</span>
                  </>
                ) : (
                  <>
                    <span>START MISSION // INITIALIZE TARS</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1.5 transition-transform" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Rules Preview */}
            <div className="mt-8 pt-6 border-t border-slate-800/80 grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="flex items-center gap-2 text-slate-300">
                <Clock className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>45s / Question</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Zap className="w-4 h-4 text-sky-400 shrink-0" />
                <span>+5% Energy / Correct</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Shield className="w-4 h-4 text-amber-400 shrink-0" />
                <span>20 Randomized Qs</span>
              </div>
              <div className="flex items-center gap-2 text-slate-300">
                <Rocket className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Paper Rocket Transitions</span>
              </div>
            </div>
          </div>

          {/* Secondary Action CTAs */}
          <div className="flex items-center justify-between text-xs font-space px-2">
            <button
              onClick={() => {
                sound.playChirp();
                onViewLeaderboard();
              }}
              className="text-slate-400 hover:text-cyan-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Local Standings</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => {
                sound.playChirp();
                onOpenAdmin();
              }}
              className="text-slate-500 hover:text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Flight Command Overview</span>
            </button>
          </div>
        </div>

        {/* Right Column: TARS Robot Standby Display */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center p-4">
          <div className="text-center mb-4">
            <span className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase">
              // TARS MK-IV UNIT STATUS
            </span>
            <p className="text-xs font-space text-slate-400">
              Core waiting at 0% energy for pilot input
            </p>
          </div>
          <TarsRobot energyPercentage={0} state="idle" score={0} totalQuestions={20} />
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
