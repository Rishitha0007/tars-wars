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
import { QuestionBankItem } from '../data/questions.js';
import {
  QuizSession,
  UserAnswerRecord,
  getActiveQuizSession,
  updateActiveQuizSession,
  finalizeQuizSession,
  startNewQuizSession,
} from '../services/quizSession.js';
import { TarsRobot, TarsState } from '../components/TarsRobot.js';
import { PaperRocketTransition } from '../components/PaperRocketTransition.js';
import { RemainingTimeHud } from '../components/RemainingTimeHud.js';
import { sound } from '../services/sound.js';
import { QuizResults } from '../types/index.js';

interface QuizMissionPageProps {
  rollNumber: string;
  onQuizCompleted: (results: QuizResults) => void;
}

export const QuizMissionPage: React.FC<QuizMissionPageProps> = ({
  rollNumber,
  onQuizCompleted,
}) => {
  // Session initialization (retrieves active or initializes 20 random questions)
  const [session, setSession] = useState<QuizSession>(() => {
    const active = getActiveQuizSession();
    if (active && active.rollNumber === rollNumber.trim().toUpperCase()) {
      return active;
    }
    return startNewQuizSession(rollNumber);
  });

  const [currentIdx, setCurrentIdx] = useState<number>(session.currentIdx || 0);
  const [score, setScore] = useState<number>(session.score || 0);
  const [energy, setEnergy] = useState<number>(session.energyPercentage || 0);

  // FEATURE 1: Selection vs Submission state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [isTimeoutUnanswered, setIsTimeoutUnanswered] = useState<boolean>(false);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  // TARS robot animation state
  const [tarsState, setTarsState] = useState<TarsState>('idle');

  // Paper rocket transition state
  const [isTransitioning, setIsTransitioning] = useState<boolean>(false);
  const nextIdxRef = useRef<number>(0);
  const isSubmittingRef = useRef<boolean>(false);
  const autoAdvanceTimerRef = useRef<any>(null);

  // Question bank list for this attempt (exactly 20 unique questions)
  const questions: QuestionBankItem[] = session.questions;
  const totalQuestions = questions.length;
  const currentQ: QuestionBankItem = questions[currentIdx] || questions[0];
  const isLastQuestion = currentIdx === totalQuestions - 1;

  // Cleanup pending auto-advance timers on unmount
  useEffect(() => {
    return () => {
      if (autoAdvanceTimerRef.current) clearTimeout(autoAdvanceTimerRef.current);
    };
  }, []);

  // Update session state in localStorage when question index or score changes
  useEffect(() => {
    updateActiveQuizSession({
      currentIdx,
      score,
      energyPercentage: energy,
    });
  }, [currentIdx, score, energy]);

  // FEATURE 1.1: Clicking an option ONLY highlights it, does NOT submit or evaluate
  const handleSelectOption = (optionIndex: number) => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;

    sound.playChirp();
    setSelectedOption(optionIndex);
    setValidationMessage(null); // Clear any warning
  };

  // FEATURE 1.4 & 1.5: REMOVE SELECTED OPTION button
  const handleRemoveSelectedOption = () => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;

    sound.playChirp();
    setSelectedOption(null);
    setValidationMessage(null);
  };

  // Common submission logic for NEXT click or Timer expiry
  const executeSubmission = (chosenOption: number | null, isTimeout: boolean = false) => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;
    isSubmittingRef.current = true;
    setIsAnswered(true);
    setValidationMessage(null);

    const isUnanswered = chosenOption === null;
    const correct = !isUnanswered && chosenOption === currentQ.correctOptionIndex;

    setIsCorrect(correct);
    setIsTimeoutUnanswered(isUnanswered);

    // FEATURE 2: Update energy & score only once per question
    const newScore = correct ? score + 1 : score;
    const newEnergy = newScore * 5; // +5 percentage points per correct answer (20 = 100%)

    setScore(newScore);
    setEnergy(newEnergy);

    // Build audited user answer record
    const record: UserAnswerRecord = {
      questionId: currentQ.id,
      sourcePdf: currentQ.sourcePdf,
      originalQNum: currentQ.originalQNum,
      questionText: currentQ.questionText,
      category: currentQ.category,
      options: currentQ.options,
      selectedOptionIndex: chosenOption,
      selectedOptionText: chosenOption !== null ? currentQ.options[chosenOption] : '[UNANSWERED / EXPIRED]',
      correctOptionIndex: currentQ.correctOptionIndex,
      correctOptionText: currentQ.correctOptionText,
      isCorrect: correct,
      isUnanswered: isUnanswered,
      explanation: currentQ.explanation,
    };

    // Update session answers
    const updatedAnswers = [...session.userAnswers, record];
    const updatedSession = {
      ...session,
      score: newScore,
      energyPercentage: newEnergy,
      userAnswers: updatedAnswers,
    };
    setSession(updatedSession);
    updateActiveQuizSession(updatedSession);

    // FEATURE 2: TARS Robot Reaction
    if (correct) {
      sound.playCorrect();
      setTarsState('dancing');
    } else {
      sound.playWrong();
      setTarsState('collapsing');
    }

    // FEATURE 3: Smooth timing - after feedback & robot reaction played (2400ms), launch rocket transition
    autoAdvanceTimerRef.current = setTimeout(() => {
      setTarsState('idle');
      handleProceedNext();
    }, 2400);
  };

  // FEATURE 1.6: NEXT button click handler
  const handleNextClick = () => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;

    if (selectedOption === null) {
      // Show small polished message without submitting
      sound.playChirp();
      setValidationMessage('Select an answer or wait for the timer to expire.');
      return;
    }

    // Submit and lock selected option
    executeSubmission(selectedOption, false);
  };

  // FEATURE 1.10 & 7: 45-second timer expiration
  const handleTimerExpire = () => {
    if (isAnswered || isTransitioning || isSubmittingRef.current) return;

    // Automatically submit selected option if any, else submit as unanswered
    executeSubmission(selectedOption, true);
  };

  // Advance to Next Question (Paper Rocket Transition trigger)
  const handleProceedNext = () => {
    if (isTransitioning) return;
    if (autoAdvanceTimerRef.current) {
      clearTimeout(autoAdvanceTimerRef.current);
      autoAdvanceTimerRef.current = null;
    }

    if (isLastQuestion) {
      // Final launch into singularity results
      setIsTransitioning(true);
      return;
    }

    nextIdxRef.current = currentIdx + 1;
    setIsTransitioning(true);
  };

  // Mid-transition hook: switch card data while rocket is flying off-screen
  const handleQuestionSwitchPoint = () => {
    setCurrentIdx(nextIdxRef.current);
    setSelectedOption(null);
    setIsAnswered(false);
    setIsCorrect(false);
    setIsTimeoutUnanswered(false);
    setValidationMessage(null);
    setTarsState('idle');
    isSubmittingRef.current = false;
  };

  // Transition complete
  const handleTransitionComplete = () => {
    setIsTransitioning(false);
    if (isLastQuestion && isAnswered) {
      const finalResults = finalizeQuizSession(session);
      onQuizCompleted(finalResults);
    }
  };

  const padSeq = (n: number) => n.toString().padStart(2, '0');

  return (
    <div className="relative z-10 w-full max-w-[1600px] mx-auto px-4 sm:px-8 lg:px-12 py-3 sm:py-5 flex flex-col gap-6 flex-1 justify-center">
      
      {/* HEADER: Identity, Question Progress & Remaining Time HUD Row */}
      <div className="w-full grid grid-cols-1 md:grid-cols-12 gap-4 items-center p-4 sm:p-5 rounded-2xl glass-panel border border-cyan-500/25 shadow-xl">
        
        {/* Left: Sequence Badge & Pilot Info (md:col-span-4) */}
        <div className="md:col-span-4 flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-400/50 flex items-center justify-center font-orbitron font-black text-cyan-300 text-sm sm:text-base shadow-[0_0_12px_rgba(0,229,255,0.3)] shrink-0">
            #{padSeq(currentIdx + 1)}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">PILOT:</span>
              <span className="font-mono font-bold text-sm text-cyan-200 tracking-wider">
                {rollNumber || '21BCE1042'}
              </span>
            </div>
            <p className="text-[11px] font-space text-cyan-400 font-semibold uppercase tracking-wider">
              QUESTION {padSeq(currentIdx + 1)} / {padSeq(totalQuestions)} // {currentQ.category}
            </p>
          </div>
        </div>

        {/* Center: Mission Progress Visualizer (md:col-span-4) */}
        <div className="md:col-span-4 flex flex-col items-center gap-1.5 w-full">
          <div className="w-full flex justify-between text-[11px] font-mono text-slate-400">
            <span>MISSION PROGRESS</span>
            <span className="text-cyan-300 font-bold">
              {Math.round(((currentIdx + 1) / totalQuestions) * 100)}%
            </span>
          </div>
          <div className="w-full h-3 bg-slate-950 rounded-full overflow-hidden p-0.5 border border-slate-800 flex gap-1">
            {Array.from({ length: totalQuestions }).map((_, idx) => {
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

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

        {/* Right: Remaining Time HUD (md:col-span-4, right aligned) */}
        <div className="md:col-span-4 flex justify-start md:justify-end items-center">
          <RemainingTimeHud
            key={`timer_${currentIdx}`}
            initialSeconds={45}
            onExpire={handleTimerExpire}
            isPaused={isAnswered || isTransitioning}
          />
        </div>
      </div>

      {/* MAIN AREA: Responsive Two-Column Composition (58% Question Panel + 42% TARS Robot) */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 xl:gap-12 items-center flex-1">
        
        {/* Left Column: Question Panel with Paper Rocket Transition (lg:col-span-7 = 58.3%) */}
        <div className="lg:col-span-7 flex flex-col justify-center w-full">
          
          <PaperRocketTransition
            isTransitioning={isTransitioning}
            isFinalQuestion={isLastQuestion}
            onTransitionComplete={handleTransitionComplete}
            onQuestionSwitchPoint={handleQuestionSwitchPoint}
          >
            {/* Elevated Deep Translucent Navy Question Card */}
            <div className="glass-panel p-6 sm:p-8 xl:p-10 rounded-2xl border border-cyan-500/35 shadow-2xl hud-corner w-full flex flex-col">
              
              {/* Category & Source Metadata Badges */}
              <div className="flex items-center justify-between pb-3.5 border-b border-slate-800/80 mb-5">
                <span className="px-3 py-1 rounded-md bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 text-xs font-mono font-semibold tracking-wider">
                  {currentQ.category}
                </span>
                <span className="text-xs font-mono text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  ORIGIN: <span className="text-slate-200 font-bold">{currentQ.sourcePdf} // Q{currentQ.originalQNum}</span>
                </span>
              </div>

              {/* Question Text */}
              <h2 className="text-lg sm:text-xl xl:text-2xl font-space font-medium text-slate-100 leading-snug mb-6 min-h-[3.25rem] flex items-center">
                {currentQ.questionText}
              </h2>

              {/* Four Large Polished Answer Choices */}
              <div className="flex flex-col gap-3.5 mb-4">
                {currentQ.options.map((optionText, index) => {
                  const isSelected = selectedOption === index;
                  const isCorrectAnswer = isAnswered && currentQ.correctOptionIndex === index;
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
                    // FEATURE 1.1 & 1.3: Selection Highlight (not locked yet)
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

                      {/* Status Icon (Only displayed AFTER submission) */}
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

              {/* FEATURE 1.4 & 1.5: REMOVE SELECTED OPTION button */}
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

              {/* FEATURE 1.6: Validation message when NEXT clicked without an option */}
              {validationMessage && !isAnswered && (
                <div className="mt-3.5 p-3 rounded-xl bg-amber-950/70 border border-amber-500/50 text-amber-200 text-xs font-mono flex items-center gap-2.5 animate-fadeIn shadow-lg">
                  <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>{validationMessage}</span>
                </div>
              )}

              {/* Answer Feedback & Explanation Box (Only shown AFTER submission) */}
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
                  <p className="text-slate-300 font-space font-light leading-relaxed">
                    {currentQ.explanation}
                  </p>
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
                  {/* NEXT Button */}
                  <button
                    type="button"
                    onClick={isAnswered ? handleProceedNext : handleNextClick}
                    disabled={isTransitioning}
                    className="w-full sm:w-auto py-3.5 px-8 rounded-xl btn-primary flex items-center justify-center gap-3 text-xs sm:text-sm font-bold tracking-wider group shadow-xl cursor-pointer disabled:opacity-60"
                  >
                    <span>
                      {isAnswered
                        ? isLastQuestion
                          ? 'COMPLETE MISSION // ENTER SINGULARITY'
                          : 'NEXT CHALLENGE // LAUNCH ROCKET'
                        : isLastQuestion
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

        {/* Right Column: Tactical TARS Mech Robot (lg:col-span-5 = 41.7%) */}
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
