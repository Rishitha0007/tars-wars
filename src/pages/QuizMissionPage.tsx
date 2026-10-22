import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  Shield,
  RotateCcw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { TarsRobot, TarsState } from '../components/TarsRobot.js';
import { PaperRocketTransition } from '../components/PaperRocketTransition.js';
import { RemainingTimeHud } from '../components/RemainingTimeHud.js';
import { sound } from '../services/sound.js';
import { api } from '../services/api.js';
import { QuestionClient, QuizResults } from '../types/index.js';

interface QuizMissionPageProps {
  attemptId: string;
  rollNumber: string;
  initialQuestion?: QuestionClient;
  onQuizCompleted: (results: QuizResults) => void;
}

export const QuizMissionPage: React.FC<QuizMissionPageProps> = ({
  attemptId,
  rollNumber,
  initialQuestion,
  onQuizCompleted,
}) => {
  // Authoritative question state from server
  const [currentQuestion, setCurrentQuestion] = useState<QuestionClient | null>(initialQuestion || null);
  const [loading, setLoading] = useState<boolean>(!initialQuestion);
  const [fetchError, setFetchError] = useState<string | null>(null);

  // Score & Energy
  const [score, setScore] = useState<number>(initialQuestion?.score || 0);
  const [energy, setEnergy] = useState<number>(initialQuestion?.energyPercentage || 0);

  // Selection vs Submission state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isTimeoutUnanswered, setIsTimeoutUnanswered] = useState<boolean>(false);
  const [explanation, setExplanation] = useState<string>('');
  const [serverCorrectOptionIndex, setServerCorrectOptionIndex] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // TARS robot animation state
  const [tarsState, setTarsState] = useState<TarsState>('idle');

  // Paper rocket transition state
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const isSubmittingRef = useRef<boolean>(false);
  const autoAdvanceTimerRef = useRef<any>(null);
  const pendingNextQuestionRef = useRef<QuestionClient | null>(null);

  const [isFinalMission, setIsFinalMission] = useState<boolean>(false);
  const isFinalMissionRef = useRef<boolean>(false);

  const totalQuestions = currentQuestion?.totalQuestions || 20;
  const currentSeq = currentQuestion?.sequenceNumber || 1;
  const isLastQuestion = currentSeq === totalQuestions;

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // Fetch or restore attempt state if not supplied via props
  useEffect(() => {
    if (!currentQuestion && attemptId) {
      const loadAttemptState = async () => {
        try {
          setLoading(true);
          setFetchError(null);
          const data = await api.getAttempt(attemptId);
          if (data.isCompleted) {
            const results = await api.getResults(attemptId);
            onQuizCompleted(results);
            return;
          }
          if (data.currentQuestion) {
            setCurrentQuestion(data.currentQuestion);
            setScore(data.score);
            setEnergy(data.energyPercentage);
            if (data.currentQuestion.isAnswered) {
              setIsAnswered(true);
              setIsCorrect(!!data.currentQuestion.isCorrect);
              setSelectedOption(data.currentQuestion.selectedOptionIndex);
            }
          }
        } catch (err: any) {
          setFetchError(err.message || 'Failed to restore mission telemetry');
        } finally {
          setLoading(false);
        }
      };

      loadAttemptState();
    }
  }, [attemptId, currentQuestion]);

  // Handle Option Click: ONLY highlights the option locally, does NOT evaluate
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;

    sound.playChirp();
    setSelectedOption(optionIndex);
    setValidationMessage(null);
  };

  // REMOVE SELECTED OPTION button
  const handleRemoveSelectedOption = () => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;

    sound.playChirp();
    setSelectedOption(null);
    setValidationMessage(null);
    setTarsState('idle');
  };

  // Authoritative Submission via Server API
  const executeSubmission = async (chosenOption: number | null, isTimeout: boolean = false) => {
    if (isAnswered || isTransitioning || isSubmittingRef.current || !currentQuestion) return;
    isSubmittingRef.current = true;
    setValidationMessage(null);

    try {
      if (isTimeout || chosenOption === null) {
        // Report timeout to server
        const res = await api.reportTimeout(attemptId, currentSeq);
        setIsAnswered(true);
        setIsCorrect(false);
        setIsTimeoutUnanswered(true);
        setExplanation(res.explanation);
        setServerCorrectOptionIndex(res.correctOptionIndex);
        setScore(res.score);
        setEnergy(res.energyPercentage);

        sound.playWrong();
        setTarsState('collapsing');

        if (res.isLastQuestion || currentSeq >= totalQuestions) {
          isFinalMissionRef.current = true;
          setIsFinalMission(true);
        }

        // Schedule rocket transition or mission completion
        autoAdvanceTimerRef.current = setTimeout(() => {
          setTarsState('idle');
          handleProceedNext(res.isLastQuestion);
        }, 2400);
      } else {
        // Authoritative server evaluation
        const res = await api.submitAnswer(attemptId, currentSeq, chosenOption);
        setIsAnswered(true);
        setIsCorrect(res.isCorrect);
        setIsTimeoutUnanswered(false);
        setExplanation(res.explanation);
        setServerCorrectOptionIndex(res.correctOptionIndex);
        setScore(res.score);
        setEnergy(res.energyPercentage);

        if (res.isLastQuestion || currentSeq >= totalQuestions) {
          isFinalMissionRef.current = true;
          setIsFinalMission(true);
        }

        if (res.isCorrect) {
          sound.playCorrect();
          setTarsState('dancing');
        } else {
          sound.playWrong();
          setTarsState('collapsing');
        }

        autoAdvanceTimerRef.current = setTimeout(() => {
          setTarsState('idle');
          handleProceedNext(res.isLastQuestion);
        }, 2400);
      }
    } catch (err: any) {
      isSubmittingRef.current = false;
      setValidationMessage(err.message || 'Error processing telemetry response.');
    }
  };

  // NEXT button click handler
  const handleNextClick = () => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;

    if (selectedOption === null) {
      sound.playChirp();
      setValidationMessage('Select an answer or wait for the timer to expire.');
      return;
    }

    executeSubmission(selectedOption, false);
  };

  // 45-second timer expiration
  const handleTimerExpire = () => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;
    executeSubmission(selectedOption, true);
  };

  // Advance to Next Question (triggers Paper Rocket 3D transition)
  const handleProceedNext = async (forceLast: boolean = false) => {
    if (isTransitioning) return;
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    const isFinal = forceLast || isFinalMissionRef.current || (isAnswered && isLastQuestion);
    if (isFinal) {
      isFinalMissionRef.current = true;
      setIsFinalMission(true);
      setIsTransitioning(true);
      return;
    }

    try {
      // Pre-fetch next question from server so it's ready when card flips
      const nextData = await api.advanceQuestion(attemptId);
      if (nextData.completed) {
        isFinalMissionRef.current = true;
        setIsFinalMission(true);
        setIsTransitioning(true);
        return;
      }
      pendingNextQuestionRef.current = nextData.nextQuestion;
      setIsTransitioning(true);
    } catch (err: any) {
      // If error advancing, retry
      setValidationMessage(err.message || 'Failed to initialize next orbital sector');
    }
  };

  // Mid-transition hook: switch card data while rocket is flying off-screen
  const handleQuestionSwitchPoint = () => {
    if (isFinalMissionRef.current) {
      return;
    }

    if (pendingNextQuestionRef.current) {
      setCurrentQuestion(pendingNextQuestionRef.current);
      pendingNextQuestionRef.current = null;
    }
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsTimeoutUnanswered(false);
    setExplanation('');
    setServerCorrectOptionIndex(null);
    setValidationMessage(null);
    setTarsState('idle');
    isSubmittingRef.current = false;
  };

  // Transition complete
  const handleTransitionComplete = async () => {
    setIsTransitioning(false);
    if (isFinalMissionRef.current) {
      try {
        setLoading(true);
        const finalResults = await api.getResults(attemptId);
        onQuizCompleted(finalResults);
      } catch (err: any) {
        try {
          const attemptData = await api.getAttempt(attemptId);
          if (attemptData.isCompleted) {
            const finalResults = await api.getResults(attemptId);
            onQuizCompleted(finalResults);
            return;
          }
        } catch {}
        setFetchError('Error retrieving final mission debrief.');
      } finally {
        setLoading(false);
      }
    }
  };

  const padSeq = (n: number) => n.toString().padStart(2, '0');

  if (loading) {
    return (
      <div className="relative z-10 flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-10 h-10 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <p className="font-mono text-cyan-300 text-xs tracking-wider">
          SYNCHRONIZING TARS QUANTUM TELEMETRY...
        </p>
      </div>
    );
  }

  if (fetchError || !currentQuestion) {
    return (
      <div className="relative z-10 max-w-lg mx-auto p-6 glass-panel rounded-2xl border border-rose-500/40 text-center">
        <AlertCircle className="w-8 h-8 text-rose-400 mx-auto mb-3" />
        <h2 className="font-orbitron font-bold text-lg text-rose-200">TELEMETRY LINK SEVERED</h2>
        <p className="text-xs font-mono text-slate-300 mt-2">{fetchError || 'Unable to connect to orbital database.'}</p>
        <button
          onClick={() => window.location.reload()}
          className="mt-5 px-5 py-2 rounded-xl btn-primary text-xs font-mono"
        >
          RECONNECT TELEMETRY
        </button>
      </div>
    );
  }

  return (
    <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-5 flex flex-col gap-6 flex-1 justify-center">
      
      {/* HEADER: Identity, Question Progress & Remaining Time HUD Row */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 sm:p-5 rounded-2xl glass-panel border border-cyan-500/25 shadow-xl">
        
        {/* Left: Sequence Badge & Pilot Info */}
        <div className="md:col-span-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center font-orbitron font-black text-cyan-300 text-sm sm:text-base shadow-[0_0_12px_rgba(0,229,255,0.3)] shrink-0">
            #{padSeq(currentSeq)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">PILOT:</span>
              <span className="font-mono font-bold text-sm text-cyan-200 tracking-wider">
                {rollNumber}
              </span>
            </div>
            <p className="text-[11px] font-space text-cyan-400 font-semibold uppercase tracking-wider">
              QUESTION {padSeq(currentSeq)} / {padSeq(totalQuestions)} // {currentQuestion.category}
            </p>
          </div>
        </div>

        {/* Center: Mission Progress Visualizer */}
        <div className="md:col-span-4 flex flex-col items-center gap-1.5 w-full">
          <div className="w-full flex justify-between text-[11px] font-mono text-slate-400">
            <span>MISSION PROGRESS</span>
            <span className="text-cyan-300 font-bold">
              {Math.round((currentSeq / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const isPast = idx < currentSeq - 1;
              const isCurrent = idx === currentSeq - 1;

              return (
                <div
                  key={idx}
                  className={`flex-1 h-full rounded-2xs transition-all duration-300 ${
                    isCurrent
                      ? 'bg-cyan-400 shadow-[0_0_10px_#00e5ff] animate-pulse'
                      : isPast
                      ? 'bg-sky-600'
                      : 'bg-slate-900'
                  }`}
                />
              );
            })}
          </div>
        </div>

        {/* Right: Remaining Time HUD */}
        <div className="md:col-span-4 flex justify-start md:justify-end items-center">
          <RemainingTimeHud
            key={`timer_${currentSeq}`}
            initialSeconds={currentQuestion.remainingSeconds !== undefined ? currentQuestion.remainingSeconds : 45}
            onExpire={handleTimerExpire}
            isPaused={isAnswered || isTransitioning}
          />
        </div>
      </div>

      {/* MAIN AREA: Responsive Two-Column Composition */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center flex-1">
        
        {/* Left Column: Question Panel with Paper Rocket Transition */}
        <div className="lg:col-span-7 flex flex-col justify-center w-full">
          
          <PaperRocketTransition
            isTransitioning={isTransitioning}
            isFinalQuestion={isFinalMission || isLastQuestion}
            onTransitionComplete={handleTransitionComplete}
            onQuestionSwitchPoint={handleQuestionSwitchPoint}
          >
            {/* Elevated Deep Translucent Navy Question Card */}
            <div className="glass-panel p-6 sm:p-8 xl:p-10 rounded-2xl border border-cyan-500/35 shadow-2xl hud-corner w-full flex flex-col">
              
              {/* Category & Status Metadata Badges */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-5">
                <span className="px-3 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-semibold tracking-wider">
                  {currentQuestion.category}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  AUTHENTICATED SECTOR: <span className="text-slate-200 font-bold">Q{padSeq(currentSeq)}</span>
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl xl:text-2xl font-space font-medium text-slate-100 leading-snug mb-6 min-h-[3.25rem] flex items-center">
                {currentQuestion.questionText}
              </h2>

              {/* Four Answer Choices */}
              <div className="flex flex-col gap-3.5 mb-4">
                {currentQuestion.options.map((optionText, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrectAnswer = isAnswered && serverCorrectOptionIndex === index;
                  const isWrongAnswer = isAnswered && isSelected && !isCorrect;

                  let optionStyles =
                    'bg-slate-900/80 border-slate-700/80 hover:border-cyan-400 hover:bg-slate-850 text-slate-200';

                  if (isAnswered) {
                    if (isCorrectAnswer) {
                      optionStyles =
                        'bg-emerald-950/90 border-emerald-400 text-emerald-100 shadow-[0_0_20px_rgba(16,185,129,0.35)] ring-1 ring-emerald-400';
                    } else if (isWrongAnswer) {
                      optionStyles =
                        'bg-rose-950/90 border-rose-400 text-rose-100 shadow-[0_0_20px_rgba(244,63,94,0.35)] ring-1 ring-rose-400';
                    } else {
                      optionStyles =
                        'bg-slate-950/50 border-slate-800/50 text-slate-500 opacity-60';
                    }
                  } else if (isSelected) {
                    optionStyles =
                      'bg-cyan-950/90 border-cyan-400 text-cyan-100 shadow-[0_0_18px_rgba(0,229,255,0.4)] ring-1 ring-cyan-400/80 scale-[1.01]';
                  }

                  const optionLabels = ['A', 'B', 'C', 'D'];

                  return (
                    <button
                      key={index}
                      type="button"
                      disabled={isAnswered || isTransitioning}
                      onClick={() => handleSelectOption(index)}
                      className={`w-full min-h-[3.25rem] sm:min-h-[3.5rem] p-3.5 sm:p-4 rounded-xl border text-left font-space text-sm sm:text-base flex items-center justify-between transition-all duration-200 group focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:outline-none ${optionStyles} ${
                        isAnswered || isTransitioning
                          ? 'cursor-default'
                          : 'cursor-pointer hover:scale-[1.01]'
                      }`}
                    >
                      <div className="flex items-center gap-3.5">
                        <span
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center font-mono font-bold text-xs sm:text-sm shrink-0 transition-colors ${
                            isCorrectAnswer
                              ? 'bg-emerald-400 text-slate-950'
                              : isWrongAnswer
                              ? 'bg-rose-400 text-slate-950'
                              : isSelected
                              ? 'bg-cyan-400 text-slate-950 shadow-[0_0_8px_#00e5ff]'
                              : 'bg-slate-800 text-slate-300 group-hover:bg-cyan-500/20 group-hover:text-cyan-300'
                          }`}
                        >
                          {optionLabels[index]}
                        </span>
                        <span className="leading-snug">{optionText}</span>
                      </div>

                      {isAnswered && (
                        <div>
                          {isCorrectAnswer && (
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                          )}
                          {isWrongAnswer && (
                            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* REMOVE SELECTED OPTION button */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  disabled={isAnswered || isTransitioning || selectedOption === null}
                  onClick={handleRemoveSelectedOption}
                  className={`px-3.5 py-2 rounded-xl text-xs font-mono font-semibold tracking-wider transition-all flex items-center gap-2 border ${
                    selectedOption !== null && !isAnswered && !isTransitioning
                      ? 'bg-slate-900/90 text-slate-300 border-slate-700 hover:border-cyan-400 hover:text-cyan-300 hover:bg-slate-800 shadow-[0_0_12px_rgba(0,229,255,0.15)] cursor-pointer'
                      : 'bg-slate-950/40 text-slate-600 border-slate-800/60 cursor-not-allowed opacity-40'
                  }`}
                  title="Clear currently selected option"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>REMOVE SELECTED OPTION</span>
                </button>

                {selectedOption !== null && !isAnswered && (
                  <span className="text-xs font-mono text-cyan-400 flex items-center gap-1.5 animate-fadeIn">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                    <span>OPTION {['A', 'B', 'C', 'D'][selectedOption]} HIGHLIGHTED // PRESS NEXT TO LOCK</span>
                  </span>
                )}
              </div>

              {/* Validation message */}
              {validationMessage && !isAnswered && (
                <div className="mt-3.5 p-3 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs font-mono flex items-center gap-2.5 animate-fadeIn shadow-lg">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{validationMessage}</span>
                </div>
              )}

              {/* Answer Feedback & Explanation Box */}
              {isAnswered && (
                <div
                  className={`mt-5 p-4 rounded-xl border text-xs sm:text-sm transition-all duration-300 animate-fadeIn ${
                    isCorrect
                      ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
                      : 'bg-rose-950/40 border-rose-500/40 text-rose-200'
                  }`}
                >
                  <div className="flex items-center gap-2 font-mono font-bold uppercase tracking-wider mb-2">
                    {isCorrect ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span className="text-emerald-300">
                          PROTOCOL VERIFIED (+5% TARS CORE POWER)
                        </span>
                      </>
                    ) : (
                      <>
                        <XCircle className="w-4 h-4 text-rose-400" />
                        <span className="text-rose-300">
                          {isTimeoutUnanswered
                            ? 'TIME EXPIRED // 0% POWER EARNED'
                            : 'DIVERGENCE DETECTED (0% POWER EARNED)'}
                        </span>
                      </>
                    )}
                  </div>
                  {explanation && (
                    <p className="text-slate-300 font-space font-light leading-relaxed">
                      {explanation}
                    </p>
                  )}
                </div>
              )}

              {/* Action Bar with NEXT / SUBMIT BUTTON */}
              <div className="mt-6 pt-4 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-xs font-mono text-slate-400">
                  {!isAnswered ? (
                    <span className="flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
                      Selection is editable until submitted via NEXT.
                    </span>
                  ) : (
                    <span className="text-cyan-300 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                      Answer locked // Launching rocket transition...
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                  <button
                    type="button"
                    onClick={isAnswered ? () => handleProceedNext(isLastQuestion || isFinalMission) : handleNextClick}
                    disabled={isTransitioning}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-xl btn-primary flex items-center justify-center gap-3 text-xs sm:text-sm font-bold tracking-wider group shadow-xl cursor-pointer disabled:opacity-60"
                  >
                    <span>
                      {isAnswered
                        ? (isLastQuestion || isFinalMission)
                          ? 'COMPLETE MISSION // ENTER SINGULARITY'
                          : 'NEXT CHALLENGE // LAUNCH ROCKET'
                        : (isLastQuestion || isFinalMission)
                        ? 'SUBMIT FINAL PROTOCOL'
                        : 'NEXT // SUBMIT ANSWER'}
                    </span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                  </button>
                </div>
              </div>
            </div>
          </PaperRocketTransition>
        </div>

        {/* Right Column: Tactical TARS Mech Robot */}
        <div className="lg:col-span-5 flex flex-col items-center justify-center w-full">
          <TarsRobot
            energyPercentage={energy}
            state={tarsState}
            score={score}
            totalQuestions={totalQuestions}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizMissionPage;
