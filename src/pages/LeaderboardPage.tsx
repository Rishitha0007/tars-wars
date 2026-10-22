import React, { useState, useEffect } from 'react';
import {
  Trophy,
  Medal,
  Search,
  RefreshCw,
  Clock,
  Zap,
  Users,
  Terminal,
  Shield,
  ArrowLeft,
} from 'lucide-react';
import { LeaderboardEntry } from '../types/index.js';
import { api } from '../services/api.js';
import { sound } from '../services/sound.js';
import { getLocalLeaderboard } from '../services/quizSession.js';

interface LeaderboardPageProps {
  onReturnHome: () => void;
}

export const LeaderboardPage: React.FC<LeaderboardPageProps> = ({ onReturnHome }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [displayMode, setDisplayMode] = useState<string>('local');
  const [isMasked, setIsMasked] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const loadLeaderboard = async (isManual = false) => {
    try {
      if (isManual) setRefreshing(true);
      else setLoading(true);

      // Attempt API first, or fallback to browser localStorage leaderboard
      try {
        const data = await api.getLeaderboard();
        setEntries(data.leaderboard);
        setDisplayMode(data.displayMode || 'local');
        setIsMasked(data.isMasked || false);
      } catch (backendErr) {
        const localList = getLocalLeaderboard();
        setEntries(localList);
        setDisplayMode('local');
        setIsMasked(false);
      }
      setError(null);
    } catch (err: any) {
      const localList = getLocalLeaderboard();
      setEntries(localList);
      setDisplayMode('local');
      setIsMasked(false);
      setError(null);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLeaderboard();
  }, []);

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  const filteredEntries = entries.filter((e) =>
    e.rollNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (e.rawRollNumber && e.rawRollNumber.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const topThree = entries.slice(0, 3);

  return (
    <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      
      {/* Back to Mission Navigation */}
      <button
        onClick={() => {
          sound.playChirp();
          onReturnHome();
        }}
        className="mb-6 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>RETURN TO MISSION CONTROL</span>
      </button>

      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/30 text-cyan-300 text-xs font-mono mb-2">
            <Terminal className="w-3.5 h-3.5" />
            <span>LOCAL BROWSER STANDINGS // ATTEMPTS RECORDED LOCALLY</span>
          </div>
          <h1 className="font-orbitron font-black text-3xl sm:text-5xl text-slate-100 glow-text-white">
            MISSION <span className="text-cyan-400 glow-text-cyan">LEADERBOARD</span>
          </h1>
          <p className="text-xs sm:text-sm font-space text-slate-400 mt-1">
            Local browser storage standings (No external database). Deterministic rank: Score (DESC) → Duration (ASC) → Time (ASC).
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              sound.playChirp();
              loadLeaderboard(true);
            }}
            disabled={refreshing}
            className="px-4 py-2 rounded-xl glass-panel text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-2 transition-all"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin text-cyan-400' : ''}`} />
            <span>SYNC DATA</span>
          </button>
        </div>
      </div>

      {/* Top 3 Podium (Visible if at least 2 entries exist) */}
      {!loading && topThree.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 items-end">
          
          {/* 2nd Place (Silver) */}
          {topThree[1] && (
            <div className="order-2 md:order-1 glass-panel p-5 rounded-2xl border border-slate-400/30 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-slate-400/20 border border-slate-300 flex items-center justify-center text-slate-300 font-orbitron font-bold mb-3 shadow-[0_0_12px_rgba(203,213,225,0.4)]">
                2
              </div>
              <span className="font-mono font-bold text-base text-slate-100 tracking-wider">
                {topThree[1].rollNumber}
              </span>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono">
                <span className="text-cyan-400 font-bold">{topThree[1].score}/20 PTS</span>
                <span className="text-slate-400">{topThree[1].energyPercentage}% PWR</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatDuration(topThree[1].timeTakenSeconds)}</span>
              </span>
            </div>
          )}

          {/* 1st Place (Gold) - Elevated */}
          {topThree[0] && (
            <div className="order-1 md:order-2 glass-panel p-6 sm:p-7 rounded-2xl border border-amber-500/50 text-center flex flex-col items-center md:-translate-y-3 bg-gradient-to-b from-amber-950/30 to-slate-950/80 shadow-[0_0_25px_rgba(251,191,36,0.2)]">
              <div className="w-12 h-12 rounded-full bg-amber-500/20 border border-amber-400 flex items-center justify-center text-amber-300 font-orbitron font-black text-lg mb-3 shadow-[0_0_15px_rgba(251,191,36,0.6)] animate-pulse">
                <Trophy className="w-6 h-6 text-amber-400" />
              </div>
              <span className="text-[10px] font-mono font-semibold tracking-widest text-amber-400 uppercase">
                SUPREME COMMANDER
              </span>
              <span className="font-mono font-black text-lg sm:text-xl text-amber-100 tracking-wider mt-1">
                {topThree[0].rollNumber}
              </span>
              <div className="mt-3 flex items-center justify-center gap-4 text-sm font-mono">
                <span className="text-amber-300 font-bold">{topThree[0].score}/20 PTS</span>
                <span className="text-cyan-400">{topThree[0].energyPercentage}% PWR</span>
              </div>
              <span className="text-xs font-mono text-slate-400 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                <span>{formatDuration(topThree[0].timeTakenSeconds)}</span>
              </span>
            </div>
          )}

          {/* 3rd Place (Bronze) */}
          {topThree[2] && (
            <div className="order-3 glass-panel p-5 rounded-2xl border border-amber-700/30 text-center flex flex-col items-center">
              <div className="w-10 h-10 rounded-full bg-amber-800/20 border border-amber-600 flex items-center justify-center text-amber-400 font-orbitron font-bold mb-3 shadow-[0_0_12px_rgba(217,119,6,0.3)]">
                3
              </div>
              <span className="font-mono font-bold text-base text-slate-100 tracking-wider">
                {topThree[2].rollNumber}
              </span>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs font-mono">
                <span className="text-cyan-400 font-bold">{topThree[2].score}/20 PTS</span>
                <span className="text-slate-400">{topThree[2].energyPercentage}% PWR</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500 mt-1 flex items-center justify-center gap-1">
                <Clock className="w-3 h-3 text-slate-400" />
                <span>{formatDuration(topThree[2].timeTakenSeconds)}</span>
              </span>
            </div>
          )}
        </div>
      )}

      {/* Standings Filter & Table */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/20 shadow-xl">
        
        {/* Search Bar & Pilot Count */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            <input
              type="text"
              placeholder="Search roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 focus:border-cyan-400 text-xs font-mono text-slate-200 outline-none"
            />
          </div>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
            <Users className="w-4 h-4 text-cyan-400" />
            <span>TOTAL PILOTS: {entries.length}</span>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-16 text-center">
            <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-xs font-mono text-slate-400">Scanning telemetry from orbit...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && entries.length === 0 && (
          <div className="py-16 text-center">
            <Shield className="w-12 h-12 text-slate-600 mx-auto mb-3" />
            <h3 className="font-orbitron font-bold text-base text-slate-300">
              NO COMPLETED MISSIONS YET
            </h3>
            <p className="text-xs font-space text-slate-500 max-w-md mx-auto mt-1">
              Be the first pilot to initialize TARS and enter the hall of orbital fame!
            </p>
          </div>
        )}

        {/* Filtered Empty State */}
        {!loading && entries.length > 0 && filteredEntries.length === 0 && (
          <div className="py-12 text-center text-xs font-mono text-slate-400">
            No pilot found matching "{searchQuery}"
          </div>
        )}

        {/* Standings Table */}
        {!loading && filteredEntries.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="w-full text-left font-mono text-xs">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400 uppercase tracking-wider text-[10px]">
                  <th className="py-3 px-3">RANK</th>
                  <th className="py-3 px-3">PILOT ROLL NUMBER</th>
                  <th className="py-3 px-3 text-center">SCORE</th>
                  <th className="py-3 px-3 text-center">TARS ENERGY</th>
                  <th className="py-3 px-3 text-right">TIME TAKEN</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredEntries.map((row) => {
                  let badge = null;
                  if (row.rank === 1) {
                    badge = (
                      <span className="text-amber-400 font-bold flex items-center gap-1.5">
                        <Trophy className="w-4 h-4 text-amber-400" />
                        <span>1</span>
                      </span>
                    );
                  } else if (row.rank === 2) {
                    badge = (
                      <span className="text-slate-300 font-bold flex items-center gap-1.5">
                        <Medal className="w-4 h-4 text-slate-300" />
                        <span>2</span>
                      </span>
                    );
                  } else if (row.rank === 3) {
                    badge = (
                      <span className="text-amber-600 font-bold flex items-center gap-1.5">
                        <Medal className="w-4 h-4 text-amber-600" />
                        <span>3</span>
                      </span>
                    );
                  } else {
                    badge = <span className="text-slate-400">#{row.rank}</span>;
                  }

                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-900/60 transition-colors group"
                    >
                      <td className="py-3.5 px-3 font-bold font-orbitron">{badge}</td>
                      <td className="py-3.5 px-3 font-semibold text-slate-200 tracking-wider">
                        {row.rollNumber}
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="font-bold text-cyan-300 text-sm">{row.score}</span>
                        <span className="text-slate-500 text-[10px]"> / 20</span>
                      </td>
                      <td className="py-3.5 px-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-800 text-cyan-300 font-bold">
                          <Zap className="w-3 h-3 fill-cyan-400" />
                          {row.energyPercentage}%
                        </span>
                      </td>
                      <td className="py-3.5 px-3 text-right text-slate-400">
                        {formatDuration(row.timeTakenSeconds)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
