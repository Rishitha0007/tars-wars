import React, { useState, useEffect, useCallback } from 'react';
import { BlackHoleBackground } from './components/BlackHoleBackground.js';
import { Navbar } from './components/Navbar.js';
import { LandingPage } from './pages/LandingPage.js';
import { QuizMissionPage } from './pages/QuizMissionPage.js';
import { ResultsPage } from './pages/ResultsPage.js';
import { LeaderboardPage } from './pages/LeaderboardPage.js';
import { AdminDashboardPage } from './pages/AdminDashboardPage.js';
import { api } from './services/api.js';
import { QuestionClient, QuizResults } from './types/index.js';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'quiz' | 'results' | 'leaderboard' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (['landing', 'quiz', 'results', 'leaderboard', 'admin'].includes(hash)) {
        return hash as any;
      }
    }
    return 'landing';
  });

  // Active quiz session state
  const [attemptId, setAttemptId] = useState<string | null>(() =>
    localStorage.getItem('tars_wars_active_attempt_id')
  );
  const [rollNumber, setRollNumber] = useState<string>(() =>
    localStorage.getItem('tars_wars_pilot_roll') || ''
  );
  const [initialQuestion, setInitialQuestion] = useState<QuestionClient | undefined>(undefined);
  const [quizResults, setQuizResults] = useState<QuizResults | null>(() => {
    try {
      const saved = localStorage.getItem('tars_wars_last_results');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [isResumedLoading, setIsResumedLoading] = useState<boolean>(false);

  // Active quiz status: true whenever in quiz view with an active attemptId
  const isQuizActive = Boolean(attemptId && currentView === 'quiz');
  const isQuizActiveRef = React.useRef<boolean>(isQuizActive);
  useEffect(() => {
    isQuizActiveRef.current = isQuizActive;
  }, [isQuizActive]);

  // Authoritative Navigation Guard (Requirement 1: Lock Navigation During a Quiz)
  const navigateToView = useCallback((targetView: 'landing' | 'quiz' | 'results' | 'leaderboard' | 'admin') => {
    // If a quiz is active, prevent participant access to all other website pages/routes
    if (isQuizActiveRef.current && targetView !== 'quiz') {
      // Legitimate admin access is separately protected by authentication
      if (targetView === 'admin') {
        setCurrentView('admin');
        window.history.pushState({ view: 'admin' }, '', '#admin');
        return;
      }
      // Block all participant navigation during active attempt
      return;
    }

    setCurrentView(targetView);
    window.history.pushState({ view: targetView }, '', `#${targetView}`);
  }, []);

  // Trap Browser Back/Forward navigation and Hash changes during active quiz
  useEffect(() => {
    const handlePopState = () => {
      if (isQuizActiveRef.current) {
        // Enforce lock: immediately push quiz back into history
        window.history.pushState({ view: 'quiz' }, '', '#quiz');
        setCurrentView('quiz');
      } else {
        const hash = window.location.hash.replace('#', '');
        if (['landing', 'quiz', 'results', 'leaderboard', 'admin'].includes(hash)) {
          setCurrentView(hash as any);
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isQuizActiveRef.current) {
        e.preventDefault();
        e.returnValue = 'Active TARS WARS mission in progress. Leaving this page will not pause your 45-second mission timer!';
        return e.returnValue;
      }
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Restore active quiz attempt on browser refresh or initial load
  useEffect(() => {
    const savedAttemptId = localStorage.getItem('tars_wars_active_attempt_id');
    const savedRoll = localStorage.getItem('tars_wars_pilot_roll');

    if (savedAttemptId) {
      setIsResumedLoading(true);
      api.getAttempt(savedAttemptId)
        .then(async (data) => {
          if (data.isCompleted || data.status === 'completed') {
            // Attempt is already completed: unlock normal navigation & show results
            localStorage.removeItem('tars_wars_active_attempt_id');
            setAttemptId(null);
            try {
              const res = await api.getResults(savedAttemptId);
              setQuizResults(res);
              setCurrentView('results');
            } catch {
              setCurrentView('landing');
            }
          } else if (data.status === 'in_progress') {
            // Restore active attempt and remaining time
            setAttemptId(data.attemptId);
            setRollNumber(data.rollNumber);
            if (data.currentQuestion) {
              setInitialQuestion(data.currentQuestion);
            }
            setCurrentView('quiz');
            window.location.hash = '#quiz';
            window.history.pushState({ view: 'quiz' }, '', '#quiz');
          }
        })
        .catch(() => {
          // Attempt not found or server reset
          localStorage.removeItem('tars_wars_active_attempt_id');
          setAttemptId(null);
          setCurrentView('landing');
        })
        .finally(() => {
          setIsResumedLoading(false);
        });
    }
  }, []);

  // Handle Starting Quiz from Landing
  const handleStartQuiz = (attemptData: {
    attemptId: string;
    rollNumber: string;
    score: number;
    energyPercentage: number;
    resumed: boolean;
    currentQuestion?: QuestionClient;
  }) => {
    setAttemptId(attemptData.attemptId);
    setRollNumber(attemptData.rollNumber);
    if (attemptData.currentQuestion) {
      setInitialQuestion(attemptData.currentQuestion);
    }

    localStorage.setItem('tars_wars_active_attempt_id', attemptData.attemptId);
    localStorage.setItem('tars_wars_pilot_roll', attemptData.rollNumber);

    setCurrentView('quiz');
    window.location.hash = '#quiz';
    window.history.pushState({ view: 'quiz' }, '', '#quiz');
  };

  // Handle Quiz Completion
  const handleQuizCompleted = (results: QuizResults) => {
    isQuizActiveRef.current = false;
    localStorage.removeItem('tars_wars_active_attempt_id');
    try {
      localStorage.setItem('tars_wars_last_results', JSON.stringify(results));
    } catch (e) {
      console.warn('Failed to cache last results', e);
    }
    setAttemptId(null);
    setQuizResults(results);
    setCurrentView('results');
    window.history.pushState({ view: 'results' }, '', '#results');
  };

  // Handle Return Home
  const handleReturnHome = () => {
    navigateToView('landing');
  };

  return (
    <div className="relative min-h-screen min-h-dvh flex flex-col justify-between bg-[#020612] text-slate-100 overflow-x-hidden">
      {/* Gargantua Canvas Black Hole Background */}
      <BlackHoleBackground />

      {/* Futuristic Navbar */}
      <Navbar
        currentView={currentView}
        onNavigate={navigateToView}
        activeAttemptId={attemptId}
        isQuizActive={isQuizActive}
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
                onViewLeaderboard={() => navigateToView('leaderboard')}
                onOpenAdmin={() => navigateToView('admin')}
              />
            )}

            {currentView === 'quiz' && (
              attemptId ? (
                <QuizMissionPage
                  attemptId={attemptId}
                  rollNumber={rollNumber || 'TEST-PILOT'}
                  initialQuestion={initialQuestion}
                  onQuizCompleted={handleQuizCompleted}
                />
              ) : quizResults ? (
                <ResultsPage
                  attemptId={null}
                  results={quizResults}
                  onViewLeaderboard={() => navigateToView('leaderboard')}
                  onReturnHome={handleReturnHome}
                />
              ) : (
                <LandingPage
                  onStartQuiz={handleStartQuiz}
                  onViewLeaderboard={() => navigateToView('leaderboard')}
                  onOpenAdmin={() => navigateToView('admin')}
                />
              )
            )}

            {currentView === 'results' && (
              <ResultsPage
                attemptId={attemptId}
                results={quizResults}
                onViewLeaderboard={() => navigateToView('leaderboard')}
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

      {/* Prototype Screen Switcher Bar: STRICTLY HIDDEN WHEN QUIZ IS ACTIVE */}
      {!isQuizActive && (
        <div className="fixed bottom-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-full bg-slate-950/90 backdrop-blur-md border border-cyan-500/40 shadow-[0_0_20px_rgba(0,0,0,0.85)] flex items-center gap-1 sm:gap-2">
          <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest pl-2 pr-1 hidden sm:inline">
            HUD NAV:
          </span>
          <button
            onClick={() => navigateToView('landing')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              currentView === 'landing'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            LANDING
          </button>
          <button
            onClick={() => navigateToView('results')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              currentView === 'results'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            RESULTS
          </button>
          <button
            onClick={() => navigateToView('leaderboard')}
            className={`px-2.5 py-1 rounded-full text-[11px] font-mono transition-all cursor-pointer ${
              currentView === 'leaderboard'
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-[0_0_10px_rgba(0,229,255,0.6)]'
                : 'text-slate-400 hover:text-cyan-300'
            }`}
          >
            LEADERBOARD
          </button>
        </div>
      )}

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
