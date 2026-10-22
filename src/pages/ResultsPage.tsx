import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Trophy,
  Zap,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ArrowRight,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Award,
  Terminal,
} from 'lucide-react';
import { QuizResults } from '../types/index.js';
import { TarsRobot } from '../components/TarsRobot.js';
import { api } from '../services/api.js';
import { sound } from '../services/sound.js';
import { getLastResults } from '../services/quizSession.js';

interface ResultsPageProps {
  attemptId?: string | null;
  results?: any;
  onViewLeaderboard: () => void;
  onReturnHome: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  attemptId,
  results: propResults,
  onViewLeaderboard,
  onReturnHome,
}) => {
  const [results, setResults] = useState<QuizResults | null>(() => propResults || getLastResults() || null);
  const [loading, setLoading] = useState<boolean>(() => !propResults && !getLastResults() && Boolean(attemptId));
  const [error, setError] = useState<string | null>(null);
  const [showReview, setShowReview] = useState<boolean>(false);

  useEffect(() => {
    // 1. If propResults passed directly:
    if (propResults) {
      setResults(propResults);
      setLoading(false);
      sound.playVictory();
      try {
        localStorage.setItem('tars_wars_last_results', JSON.stringify(propResults));
      } catch {}
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#38bdf8', '#fbbf24', '#ffffff'],
        });
      } catch (e) {
        console.warn('Confetti effect failed', e);
      }
      return;
    }

    // 2. Check local stored last results
    const storedLast = getLastResults();
    if (storedLast) {
      setResults(storedLast);
      setLoading(false);
      sound.playVictory();
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#00e5ff', '#38bdf8', '#fbbf24', '#ffffff'],
        });
      } catch (e) {
        console.warn('Confetti effect failed', e);
      }
      return;
    }

    // 3. Attempt to fetch from API if attemptId provided
    const fetchResults = async () => {
      try {
        setLoading(true);
        if (attemptId) {
          const data = await api.getResults(attemptId);
          setResults(data);
          sound.playVictory();
          try {
            localStorage.setItem('tars_wars_last_results', JSON.stringify(data));
          } catch {}
          try {
            confetti({
              particleCount: 80,
              spread: 70,
              origin: { y: 0.6 },
              colors: ['#00e5ff', '#38bdf8', '#fbbf24', '#ffffff'],
            });
          } catch (e) {
            console.warn('Confetti effect failed', e);
          }
        } else {
          setError('Complete a 20-question quantum mission to generate your debriefing report.');
        }
      } catch (err: any) {
        setError(err?.message || 'No completed mission found. Complete a mission to view your debriefing report.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [attemptId, propResults]);

  if (loading) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="font-mono text-cyan-300 text-sm tracking-wider">
          DECODING TARS TELEMETRY ARCHIVE...
        </p>
      </div>
    );
  }

  if (error || !results) {
    return (
      <div className="relative z-10 max-w-lg mx-auto p-8 glass-panel rounded-2xl border border-cyan-500/30 text-center my-12 shadow-2xl">
        <XCircle className="w-12 h-12 text-cyan-400 mx-auto mb-4" />
        <h2 className="font-orbitron font-bold text-xl text-slate-100 mb-2">
          NO ACTIVE MISSION DEBRIEFING
        </h2>
        <p className="text-slate-400 font-space text-sm mb-6 leading-relaxed">
          {error || 'Complete a 20-question quantum mission to generate your telemetry debriefing report.'}
        </p>
        <button
          onClick={onReturnHome}
          className="btn-primary py-2.5 px-6 rounded-xl text-sm cursor-pointer shadow-lg"
        >
          Return to Command
        </button>
      </div>
    );
  }

  // Rank Title
  const userScore = results?.score ?? 0;
  let rankTier = 'EXPLORATION CADET';
  let rankColor = 'text-slate-300 border-slate-700 bg-slate-900';
  if (userScore >= 18) {
    rankTier = 'SINGULARITY COMMANDER';
    rankColor = 'text-amber-300 border-amber-500/50 bg-amber-950/40 shadow-[0_0_15px_rgba(251,191,36,0.3)]';
  } else if (userScore >= 14) {
    rankTier = 'ORBITAL FLIGHT SPECIALIST';
    rankColor = 'text-cyan-300 border-cyan-500/50 bg-cyan-950/40 shadow-[0_0_15px_rgba(0,229,255,0.3)]';
  } else if (userScore >= 10) {
    rankTier = 'MISSION NAVIGATOR';
    rankColor = 'text-sky-300 border-sky-500/50 bg-sky-950/40';
  }

  const formatDuration = (seconds?: number | null) => {
    const totalSecs = Math.max(0, Math.floor(seconds || 0));
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins}m ${secs}s`;
  };

  return (
    <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-4 sm:py-6 flex flex-col gap-6 flex-1 justify-center">
      
      {/* Header Banner */}
      <div className="text-center w-full max-w-3xl mx-auto mb-2">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono mb-2 shadow-[0_0_15px_rgba(0,229,255,0.2)]">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span>MISSION DEBRIEFING REPORT // ENDURANCE COMPLETE</span>
        </div>
        <h1 className="font-orbitron font-black text-3xl sm:text-5xl text-slate-100 glow-text-white mb-2">
          MISSION SUMMARY
        </h1>
        <p className="text-sm sm:text-base font-space text-slate-400">
          Pilot <span className="font-mono font-bold text-cyan-300">{results.rollNumber}</span> has completed the quantum protocol.
        </p>
      </div>

      {/* Main Grid: Telemetry Card + Illuminated TARS */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center mb-6">
        
        {/* Left: Score Card (lg:col-span-7 = 58.3%) */}
        <div className="lg:col-span-7 glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/35 shadow-2xl hud-corner w-full flex flex-col justify-between">
          
          {/* Rank Badge & Mission Time */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80 mb-6">
            <span className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold tracking-wider ${rankColor}`}>
              <Award className="w-4 h-4 inline-block mr-1.5 -mt-0.5" />
              {rankTier}
            </span>
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              MISSION TIME: <span className="text-slate-200 font-bold">{formatDuration(results.timeTakenSeconds)}</span>
            </span>
          </div>

          {/* Primary Score & Energy Display */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            
            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase mb-1">
                TOTAL SCORE
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-orbitron font-black text-4xl sm:text-5xl text-cyan-400 glow-text-cyan">
                  {results.score}
                </span>
                <span className="text-slate-500 font-mono text-lg">/ 20</span>
              </div>
              <span className="text-xs text-slate-400 mt-1">
                {Math.round((results.score / 20) * 100)}% Accuracy
              </span>
            </div>

            <div className="p-5 rounded-xl bg-slate-900/90 border border-slate-800 flex flex-col items-center justify-center text-center">
              <span className="text-[11px] font-mono text-slate-400 tracking-wider uppercase mb-1">
                TARS CORE CHARGE
              </span>
              <div className="flex items-baseline gap-1">
                <span className="font-orbitron font-black text-4xl sm:text-5xl text-sky-300 glow-text-white">
                  {results.energyPercentage}%
                </span>
              </div>
              <span className="text-xs text-cyan-400 mt-1 flex items-center gap-1 font-mono">
                <Zap className="w-3.5 h-3.5 fill-cyan-400" />
                {results.score} × 5% Powered
              </span>
            </div>
          </div>

          {/* Breakdown Stats */}
          <div className="grid grid-cols-3 gap-3 pt-4 border-t border-slate-800 font-mono text-xs">
            <div className="p-3 rounded-lg bg-emerald-950/30 border border-emerald-900/50 text-center">
              <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                <CheckCircle2 className="w-4 h-4" />
                <span className="font-bold text-sm">{results.correctCount}</span>
              </div>
              <span className="text-[10px] text-slate-400">CORRECT</span>
            </div>

            <div className="p-3 rounded-lg bg-rose-950/30 border border-rose-900/50 text-center">
              <div className="flex items-center justify-center gap-1 text-rose-400 mb-0.5">
                <XCircle className="w-4 h-4" />
                <span className="font-bold text-sm">{results.incorrectCount}</span>
              </div>
              <span className="text-[10px] text-slate-400">INCORRECT</span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-center">
              <div className="flex items-center justify-center gap-1 text-slate-400 mb-0.5">
                <HelpCircle className="w-4 h-4" />
                <span className="font-bold text-sm">{results.unansweredCount}</span>
              </div>
              <span className="text-[10px] text-slate-500">EXPIRED</span>
            </div>
          </div>

          {/* Actions: Clean responsive grid */}
          <div className="mt-6 pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-12 gap-3 w-full">
            <button
              onClick={() => {
                sound.playChirp();
                onViewLeaderboard();
              }}
              className="sm:col-span-6 py-3.5 px-4 rounded-xl btn-primary flex items-center justify-center gap-2 text-xs sm:text-sm font-bold tracking-wider cursor-pointer shadow-lg"
            >
              <Trophy className="w-4 h-4 text-slate-950 shrink-0" />
              <span>VIEW LIVE LEADERBOARD</span>
            </button>

            <button
              onClick={() => {
                sound.playChirp();
                setShowReview(!showReview);
              }}
              className="sm:col-span-4 py-3.5 px-3 rounded-xl btn-secondary text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 cursor-pointer text-slate-200"
            >
              <span>{showReview ? 'Hide Questions' : 'Review 20 Questions'}</span>
              {showReview ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>

            <button
              onClick={() => {
                sound.playChirp();
                onReturnHome();
              }}
              className="sm:col-span-2 py-3.5 px-2 rounded-xl btn-secondary text-xs sm:text-sm text-slate-300 hover:text-white flex items-center justify-center gap-1.5 cursor-pointer"
              title="Return to Main Mission Landing"
            >
              <RotateCcw className="w-4 h-4 shrink-0" />
              <span>COMMAND</span>
            </button>
          </div>
        </div>

        {/* Right: TARS Robot Fully Energized Companion (lg:col-span-5 = 41.7%) */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center w-full">
          <div className="text-center mb-3">
            <span className="text-xs font-mono text-cyan-400 tracking-wider uppercase font-semibold">
              // TARS FINAL POWER STATUS
            </span>
            <p className="text-xs font-space text-slate-400 mt-0.5">
              Energized to {results.energyPercentage}% Core Potential
            </p>
          </div>
          <TarsRobot
            energyPercentage={results.energyPercentage}
            state={results.energyPercentage > 50 ? 'dancing' : 'idle'}
            score={results.score}
            totalQuestions={20}
          />
        </div>
      </div>

      {/* Accordion: Question Breakdown Review */}
      {showReview && (
        <div className="mt-8 glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/20">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
            <h3 className="font-orbitron font-bold text-lg text-slate-100">
              QUESTION ARCHIVE & PROTOCOL EXPLANATIONS
            </h3>
            <span className="text-xs font-mono text-slate-400">20 / 20 AUDITED</span>
          </div>

          <div className="flex flex-col gap-4">
            {(results.breakdown || []).map((item) => (
              <div
                key={item.sequence}
                className={`p-5 rounded-xl border text-sm transition-all ${
                  item.isCorrect
                    ? 'bg-emerald-950/20 border-emerald-500/30'
                    : item.isUnanswered
                    ? 'bg-slate-900/60 border-slate-800'
                    : 'bg-rose-950/20 border-rose-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold text-slate-400">
                    QUESTION {item.sequence} // {item.category}
                  </span>
                  <span
                    className={`font-mono text-xs font-bold px-2 py-0.5 rounded ${
                      item.isCorrect
                        ? 'bg-emerald-500/20 text-emerald-300'
                        : item.isUnanswered
                        ? 'bg-slate-800 text-slate-400'
                        : 'bg-rose-500/20 text-rose-300'
                    }`}
                  >
                    {item.isCorrect ? '+5% ENERGY' : '0% ENERGY'}
                  </span>
                </div>

                <p className="font-space font-medium text-slate-200 mb-4">{item.questionText}</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-space mb-3">
                  <div
                    className={`p-2.5 rounded-lg border ${
                      item.isCorrect
                        ? 'bg-emerald-900/30 border-emerald-700/50 text-emerald-200'
                        : 'bg-rose-900/30 border-rose-700/50 text-rose-200'
                    }`}
                  >
                    <span className="block font-mono text-[10px] text-slate-400 mb-0.5">
                      PILOT SELECTION:
                    </span>
                    <span>
                      {item.isUnanswered ? '[EXPIRED / NO SELECTION]' : item.selectedOptionText}
                    </span>
                  </div>

                  {!item.isCorrect && (
                    <div className="p-2.5 rounded-lg border bg-slate-900 border-slate-700 text-cyan-200">
                      <span className="block font-mono text-[10px] text-slate-400 mb-0.5">
                        CORRECT PROTOCOL:
                      </span>
                      <span>{item.correctOptionText}</span>
                    </div>
                  )}
                </div>

                {item.explanation && (
                  <div className="pt-2 text-xs text-slate-400 font-space border-t border-slate-800/80">
                    <span className="font-mono font-semibold text-slate-300 mr-1">ANALYSIS:</span>
                    {item.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
