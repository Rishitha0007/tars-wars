import React, { useState, useEffect } from 'react';
import { BlackHoleBackground } from './components/BlackHoleBackground.js';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './pages/LandingPage.js';
import { QuizMissionPage } from './pages/QuizMissionPage.js';
import { ResultsPage } from './pages/ResultsPage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { QuestionClient } from './types/index.js';
import { api } from './services/api.js';

import { getActiveQuizSession } from './services/quizSession.js';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'quiz' | 'results' | 'leaderboard' | 'admin'>('landing');

  // Active quiz session state
  const [attemptId, setAttemptId] = useState<string | null>(() =>
    localStorage.getItem('tars_wars_active_attempt_id')
  );
  const [rollNumber, setRollNumber] = useState<string>(() =>
    localStorage.getItem('tars_wars_pilot_roll') || '21BCE1042'
  );
  const [quizResults, setQuizResults] = useState<any>(null);
  const [isResumedLoading, setIsResumedLoading] = useState<boolean>(false);

  // Resume active quiz session on initial load or browser refresh
  useEffect(() => {
    const resumeSavedAttempt = () => {
      const activeSession = getActiveQuizSession();
      if (activeSession) {
        setAttemptId(activeSession.attemptId);
        setRollNumber(activeSession.rollNumber);
        setCurrentView('quiz');
      }
    };

    resumeSavedAttempt();
  }, []);

  // Handle Starting Quiz from Landing
  const handleStartQuiz = (attemptData: {
    attemptId: string;
    rollNumber: string;
    score: number;
    energyPercentage: number;
    resumed: boolean;
  }) => {
    setAttemptId(attemptData.attemptId);
    setRollNumber(attemptData.rollNumber);

    localStorage.setItem('tars_wars_active_attempt_id', attemptData.attemptId);
    localStorage.setItem('tars_wars_pilot_roll', attemptData.rollNumber);

    setCurrentView('quiz');
  };

  // Handle Quiz Completion
  const handleQuizCompleted = (results: any) => {
    localStorage.removeItem('tars_wars_active_attempt_id');
    setQuizResults(results);
    setCurrentView('results');
  };

  // Handle Return Home
  const handleReturnHome = () => {
    setCurrentView('landing');
  };

  return (
    <div className="relative min-h-screen min-h-dvh flex flex-col justify-between bg-[#020612] text-slate-100 overflow-x-hidden">
      {/* Gargantua Canvas Black Hole Background */}
      <BlackHoleBackground />

      {/* Futuristic Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => setCurrentView(view)}
        activeAttemptId={attemptId && currentView !== 'quiz' ? attemptId : null}
      />

      {/* Main View Router */}
      <main className="flex-1 w-full flex flex-col justify-center py-4 sm:py-6 pb-20">
        {isResumedLoading ? (
          <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh]">
            <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mb-3" />
            <p className="font-mono text-cyan-300 text-xs tracking-wider">
              RESTORING ORBITAL TELEMETRY...
            </p>
          </div>
        ) : (
          <>
            {currentView === 'landing' && (
              <LandingPage
                onStartQuiz={handleStartQuiz}
                onViewLeaderboard={() => setCurrentView('leaderboard')}
                onOpenAdmin={() => setCurrentView('admin')}
              />
            )}

            {currentView === 'quiz' && (
              <QuizMissionPage
                rollNumber={rollNumber || '21BCE1042'}
                onQuizCompleted={handleQuizCompleted}
              />
            )}

            {currentView === 'results' && (
              <ResultsPage
                attemptId={attemptId}
                results={quizResults}
                onViewLeaderboard={() => setCurrentView('leaderboard')}
                onReturnHome={handleReturnHome}
              />
            )}

            {currentView === 'leaderboard' && (
              <LeaderboardPage onReturnHome={handleReturnHome} />
            )}

            {currentView === 'admin' && (
              <AdminDashboardPage onReturnHome={handleReturnHome} />
            )}
          </>
        )}
      </main>

      {/* Rapid Prototype Screen Switcher Bar */}
      <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_20px_rgba(0,0,0,0.85)] flex items-center gap-1 sm:gap-2">
        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest pl-2 pr-1 hidden sm:inline">
          HUD NAV:
        </span>
        <button
          onClick={() => setCurrentView('landing')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
            currentView === 'landing'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          LANDING
        </button>
        <button
          onClick={() => setCurrentView('quiz')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
            currentView === 'quiz'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          QUIZ
        </button>
        <button
          onClick={() => setCurrentView('results')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
            currentView === 'results'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          RESULTS
        </button>
        <button
          onClick={() => setCurrentView('leaderboard')}
          className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
            currentView === 'leaderboard'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
              : 'text-slate-400 hover:text-cyan-300'
          }`}
        >
          LEADERBOARD
        </button>
      </div>

      {/* Mission Footer */}
      <footer className="relative z-10 py-4 border-t border-slate-900 bg-slate-950/80 backdrop-blur-sm text-center text-xs font-mono text-slate-500">
        <div className="w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>TARS WARS // ASTRION TECHFEST QUANTUM MISSION</span>
          <span className="text-[11px] text-slate-400">
            SYSTEM STATUS: 100% NOMINAL // ENCRYPTED TELEMETRY
          </span>
        </div>
      </footer>
    </div>
  );
};

export default App;
