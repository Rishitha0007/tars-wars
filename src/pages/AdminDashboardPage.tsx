import React, { useState, useEffect } from 'react';
import {
  Shield,
  Key,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  Upload,
  RefreshCw,
  Settings,
  Users,
  FileQuestion,
  CheckCircle,
  AlertTriangle,
  LogOut,
  X,
  Search,
  ArrowLeft,
} from 'lucide-react';
import { AdminQuestion, AdminAttempt } from '../types/index.js';
import { api } from '../services/api.js';
import { sound } from '../services/sound.js';

interface AdminDashboardPageProps {
  onReturnHome: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({ onReturnHome }) => {
  // Auth state
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem('tars_wars_admin_token')
  );
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loggingIn, setLoggingIn] = useState(false);

  // Active Tab
  const [activeTab, setActiveTab] = useState<'questions' | 'attempts' | 'settings'>('questions');

  // Questions state
  const [questions, setQuestions] = useState<AdminQuestion[]>([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [searchFilter, setSearchFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<AdminQuestion | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');

  // Attempts state with pagination, search, sort, and metrics (supports up to 1,000 records)
  const [attempts, setAttempts] = useState<AdminAttempt[]>([]);
  const [attemptsTotal, setAttemptsTotal] = useState(0);
  const [attemptsPage, setAttemptsPage] = useState(1);
  const [attemptsLimit, setAttemptsLimit] = useState(25);
  const [attemptsTotalPages, setAttemptsTotalPages] = useState(1);
  const [attemptsSearch, setAttemptsSearch] = useState('');
  const [attemptsStatus, setAttemptsStatus] = useState('all');
  const [attemptsSortBy, setAttemptsSortBy] = useState('started_at');
  const [attemptsSortOrder, setAttemptsSortOrder] = useState<'ASC' | 'DESC'>('DESC');
  const [attemptsLoading, setAttemptsLoading] = useState(false);
  const [attemptsError, setAttemptsError] = useState<string | null>(null);
  const [attemptsSummary, setAttemptsSummary] = useState<{
    totalAttempts: number;
    completedAttempts: number;
    inProgressAttempts: number;
    averageScore: number;
    highestScore: number;
  }>({
    totalAttempts: 0,
    completedAttempts: 0,
    inProgressAttempts: 0,
    averageScore: 0,
    highestScore: 0,
  });

  // Settings state
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [settingsMsg, setSettingsMsg] = useState<string | null>(null);

  // Loading & Global message
  const [loading, setLoading] = useState(false);
  const [globalMessage, setGlobalMessage] = useState<string | null>(null);

  // Form state for Add/Edit
  const [formText, setFormText] = useState('');
  const [formOptions, setFormOptions] = useState(['', '', '', '']);
  const [formCorrectIndex, setFormCorrectIndex] = useState(0);
  const [formExplanation, setFormExplanation] = useState('');
  const [formCategory, setFormCategory] = useState('General');
  const [formDifficulty, setFormDifficulty] = useState('medium');
  const [formIsActive, setFormIsActive] = useState(true);

  // Handle Login
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    setLoggingIn(true);
    try {
      sound.playChirp();
      const res = await api.adminLogin(username, password);
      setToken(res.token);
      sound.playCorrect();
    } catch (err: any) {
      sound.playWrong();
      setLoginError(err.message || 'Authentication rejected');
    } finally {
      setLoggingIn(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('tars_wars_admin_token');
    setToken(null);
    sound.playChirp();
  };

  // Dedicated Attempts Fetcher
  const fetchAttempts = async (page = attemptsPage, limit = attemptsLimit, search = attemptsSearch, status = attemptsStatus, sortBy = attemptsSortBy, sortOrder = attemptsSortOrder) => {
    if (!token) return;
    try {
      setAttemptsLoading(true);
      setAttemptsError(null);
      const res = await api.adminGetAttempts({
        page,
        limit,
        search,
        status,
        sortBy,
        sortOrder,
      });
      setAttempts(res.attempts);
      setAttemptsTotal(res.total);
      setAttemptsPage(res.page);
      setAttemptsLimit(res.limit);
      setAttemptsTotalPages(res.totalPages);
      if (res.summary) {
        setAttemptsSummary(res.summary);
      }
    } catch (err: any) {
      if (err.message?.includes('Unauthorized')) {
        handleLogout();
        return;
      }
      setAttemptsError('Failed to fetch participant telemetry from backend server.');
    } finally {
      setAttemptsLoading(false);
    }
  };

  // Load Data on Initial Login
  const loadData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      const [qData, settsData] = await Promise.all([
        api.adminGetQuestions().catch(() => null),
        api.adminGetSettings().catch(() => null),
      ]);
      if (qData) {
        setQuestions(qData.questions);
        setTotalQuestions(qData.total);
        setActiveCount(qData.activeCount);
      }
      if (settsData) {
        setSettings(settsData);
      }
      await fetchAttempts(1, attemptsLimit, attemptsSearch, attemptsStatus, attemptsSortBy, attemptsSortOrder);
    } catch (err: any) {
      if (err.message?.includes('Unauthorized')) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadData();
    }
  }, [token]);

  // Open Add Question Modal
  const openAddModal = () => {
    setEditingQuestion(null);
    setFormText('');
    setFormOptions(['', '', '', '']);
    setFormCorrectIndex(0);
    setFormExplanation('');
    setFormCategory('General');
    setFormDifficulty('medium');
    setFormIsActive(true);
    setShowAddModal(true);
  };

  // Open Edit Question Modal
  const openEditModal = (q: AdminQuestion) => {
    setEditingQuestion(q);
    setFormText(q.question_text);
    const opts = q.parsedOptions || JSON.parse(q.options);
    setFormOptions(opts);
    setFormCorrectIndex(q.correct_option_index);
    setFormExplanation(q.explanation || '');
    setFormCategory(q.category || 'General');
    setFormDifficulty(q.difficulty || 'medium');
    setFormIsActive(q.is_active === 1);
    setShowAddModal(true);
  };

  // Save Question (Create or Update)
  const handleSaveQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formText.trim()) return;
    if (formOptions.some((o) => !o.trim())) {
      alert('All 4 options must be filled.');
      return;
    }

    try {
      sound.playChirp();
      if (editingQuestion) {
        await api.adminUpdateQuestion(editingQuestion.id, {
          question_text: formText,
          options: formOptions,
          correct_option_index: formCorrectIndex,
          explanation: formExplanation,
          category: formCategory,
          difficulty: formDifficulty,
          is_active: formIsActive,
        });
      } else {
        await api.adminCreateQuestion({
          question_text: formText,
          options: formOptions,
          correct_option_index: formCorrectIndex,
          explanation: formExplanation,
          category: formCategory,
          difficulty: formDifficulty,
          is_active: formIsActive,
        });
      }
      setShowAddModal(false);
      loadData();
      showTemporaryNotice('Question matrix updated successfully.');
    } catch (err: any) {
      alert(err.message || 'Failed to save question');
    }
  };

  // Toggle Question Status
  const handleToggleStatus = async (q: AdminQuestion) => {
    try {
      sound.playChirp();
      await api.adminToggleQuestion(q.id, q.is_active !== 1);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to toggle status');
    }
  };

  // Delete Question
  const handleDeleteQuestion = async (id: string) => {
    if (!confirm('Are you sure you want to delete this question?')) return;
    try {
      sound.playChirp();
      await api.adminDeleteQuestion(id);
      loadData();
      showTemporaryNotice('Question deleted from database.');
    } catch (err: any) {
      alert(err.message || 'Failed to delete question');
    }
  };

  // Bulk Import
  const handleBulkImport = async () => {
    try {
      const parsed = JSON.parse(importJsonText);
      if (!Array.isArray(parsed)) {
        alert('JSON must be an array of questions');
        return;
      }
      sound.playChirp();
      const res = await api.adminBulkImport(parsed);
      setShowImportModal(false);
      setImportJsonText('');
      loadData();
      showTemporaryNotice(`Successfully imported ${res.importedCount} questions.`);
    } catch (err: any) {
      alert(err.message || 'Invalid JSON format');
    }
  };

  // Reseed standard questions
  const handleReseed = async () => {
    if (!confirm('Reseed will add the standard 60 questions to the database. Continue?')) return;
    try {
      sound.playChirp();
      const res = await api.adminReseed();
      loadData();
      showTemporaryNotice(`Reseeded ${res.seededCount} questions.`);
    } catch (err: any) {
      alert(err.message || 'Failed to reseed');
    }
  };

  // Reset Attempt
  const handleResetAttempt = async (attemptId: string, roll: string) => {
    if (!confirm(`Are you sure you want to reset the attempt for ${roll}? This will allow the student to retake the quiz.`)) return;
    try {
      sound.playChirp();
      await api.adminResetAttempt(attemptId);
      loadData();
      showTemporaryNotice(`Attempt for ${roll} reset successfully.`);
    } catch (err: any) {
      alert(err.message || 'Failed to reset attempt');
    }
  };

  // Save Settings
  const handleSaveSettings = async () => {
    try {
      sound.playChirp();
      await api.adminUpdateSettings(settings);
      setSettingsMsg('Settings saved successfully.');
      setTimeout(() => setSettingsMsg(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  const showTemporaryNotice = (msg: string) => {
    setGlobalMessage(msg);
    setTimeout(() => setGlobalMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // LOGIN SCREEN
  // -------------------------------------------------------------
  if (!token) {
    return (
      <div className="relative z-10 max-w-md mx-auto px-4 py-16">
        <button
          onClick={onReturnHome}
          className="mb-6 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK TO MISSION</span>
        </button>

        <div className="glass-panel p-8 rounded-2xl border border-cyan-500/40 shadow-2xl hud-corner">
          <div className="text-center mb-6">
            <div className="w-12 h-12 rounded-xl bg-cyan-950/80 border border-cyan-500/60 flex items-center justify-center mx-auto mb-3 shadow-[0_0_15px_rgba(0,229,255,0.4)]">
              <Shield className="w-6 h-6 text-cyan-400" />
            </div>
            <h1 className="font-orbitron font-bold text-xl text-slate-100">FLIGHT COMMAND LOGIN</h1>
            <p className="text-xs font-space text-slate-400 mt-1">
              Authorized Organizer Administration Portal
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs">
              {loginError}
            </div>
          )}

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                ORGANIZER USERNAME
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:border-cyan-400 outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-300 uppercase mb-1">
                ACCESS KEY / PASSWORD
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter flight command key"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:border-cyan-400 outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loggingIn}
              className="mt-2 py-3 rounded-xl btn-primary text-xs font-bold flex items-center justify-center gap-2"
            >
              <Key className="w-4 h-4" />
              <span>{loggingIn ? 'AUTHENTICATING...' : 'AUTHORIZE ACCESS'}</span>
            </button>
          </form>

          <p className="mt-6 text-[10px] font-mono text-slate-500 text-center">
            Credentials configured in server environment (.env).
          </p>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // AUTHENTICATED DASHBOARD
  // -------------------------------------------------------------
  const categories = ['ALL', ...Array.from(new Set(questions.map((q) => q.category || 'General')))];

  const filteredQuestions = questions.filter((q) => {
    const matchesCategory = categoryFilter === 'ALL' || q.category === categoryFilter;
    const matchesSearch =
      q.question_text.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (q.explanation && q.explanation.toLowerCase().includes(searchFilter.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-8">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-800">
        <div>
          <button
            onClick={onReturnHome}
            className="mb-2 inline-flex items-center gap-2 text-xs font-mono text-slate-400 hover:text-cyan-300"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO PUBLIC MISSION</span>
          </button>
          <h1 className="font-orbitron font-bold text-2xl sm:text-3xl text-slate-100 flex items-center gap-2.5">
            <Shield className="w-6 h-6 text-cyan-400" />
            <span>FLIGHT COMMAND DASHBOARD</span>
          </h1>
          <p className="text-xs font-space text-slate-400 mt-1">
            Question bank management, live attempt monitoring, and festival configuration.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-800 text-emerald-400 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            ORBITAL DB ONLINE
          </span>
          <button
            onClick={handleLogout}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
            title="Logout"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Global Notification Banner */}
      {globalMessage && (
        <div className="mb-6 p-3 rounded-xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-200 text-xs font-mono flex items-center gap-2 shadow-lg">
          <CheckCircle className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>{globalMessage}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-800 pb-2">
        <button
          onClick={() => {
            sound.playChirp();
            setActiveTab('questions');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
            activeTab === 'questions'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <FileQuestion className="w-4 h-4" />
          <span>QUESTIONS ({totalQuestions})</span>
          {activeCount < 20 && (
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" title="Needs >= 20 active" />
          )}
        </button>

        <button
          onClick={() => {
            sound.playChirp();
            setActiveTab('attempts');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
            activeTab === 'attempts'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>PARTICIPANT ATTEMPTS ({attempts.length})</span>
        </button>

        <button
          onClick={() => {
            sound.playChirp();
            setActiveTab('settings');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-mono flex items-center gap-2 transition-all ${
            activeTab === 'settings'
              ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-[0_0_10px_rgba(0,229,255,0.2)]'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>FESTIVAL CONFIG</span>
        </button>
      </div>

      {/* ============================================================= */}
      {/* TAB 1: QUESTIONS MANAGEMENT */}
      {/* ============================================================= */}
      {activeTab === 'questions' && (
        <div className="flex flex-col gap-6">
          
          {/* Active Questions Alert if < 20 */}
          {activeCount < 20 && (
            <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-500/60 text-amber-200 text-xs flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
              <div>
                <p className="font-bold">INSUFFICIENT ACTIVE QUESTIONS ({activeCount}/20)</p>
                <p className="text-amber-200/80">
                  A quiz attempt requires at least 20 active questions to initialize. Please activate or import questions.
                </p>
              </div>
            </div>
          )}

          {/* Action Header & Filters */}
          <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
            
            {/* Search & Category Filter */}
            <div className="flex items-center gap-3 flex-1 min-w-[280px]">
              <div className="relative flex-1 max-w-xs">
                <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search questions..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 outline-none"
                />
              </div>

              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 outline-none"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Buttons: Add Question, Bulk Import, Reseed */}
            <div className="flex items-center gap-2">
              <button
                onClick={openAddModal}
                className="px-3.5 py-2 rounded-xl btn-primary text-xs font-bold flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>NEW QUESTION</span>
              </button>

              <button
                onClick={() => setShowImportModal(true)}
                className="px-3 py-2 rounded-xl glass-panel text-xs font-mono text-slate-300 hover:text-cyan-300 flex items-center gap-1.5"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>IMPORT JSON</span>
              </button>

              <button
                onClick={handleReseed}
                className="px-3 py-2 rounded-xl glass-panel text-xs font-mono text-slate-400 hover:text-amber-300 flex items-center gap-1.5"
                title="Restore default 60 questions"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>RE-SEED</span>
              </button>
            </div>
          </div>

          {/* Questions List */}
          <div className="flex flex-col gap-3">
            {filteredQuestions.map((q) => {
              const opts: string[] = q.parsedOptions || JSON.parse(q.options);
              const isActive = q.is_active === 1;

              return (
                <div
                  key={q.id}
                  className={`glass-panel p-5 rounded-2xl border transition-all ${
                    isActive ? 'border-cyan-500/20' : 'border-slate-800 opacity-60'
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[10px] font-mono text-cyan-300">
                        {q.category}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400 uppercase">
                        {q.difficulty}
                      </span>
                      <span
                        className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          isActive
                            ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-300'
                            : 'bg-slate-900 text-slate-500'
                        }`}
                      >
                        {isActive ? 'ACTIVE' : 'INACTIVE'}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => handleToggleStatus(q)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                        title={isActive ? 'Deactivate' : 'Activate'}
                      >
                        {isActive ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={() => openEditModal(q)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-cyan-300 hover:bg-slate-800"
                        title="Edit Question"
                      >
                        <Edit className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteQuestion(q.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800"
                        title="Delete Question"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <p className="font-space text-sm text-slate-200 mb-3">{q.question_text}</p>

                  {/* 4 Options Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono mb-2">
                    {opts.map((opt, idx) => {
                      const isCorrect = idx === q.correct_option_index;
                      return (
                        <div
                          key={idx}
                          className={`p-2 rounded-lg border flex items-center gap-2 ${
                            isCorrect
                              ? 'bg-emerald-950/30 border-emerald-600/50 text-emerald-300 font-bold'
                              : 'bg-slate-900/60 border-slate-800 text-slate-400'
                          }`}
                        >
                          <span className="w-4 h-4 rounded bg-slate-800 flex items-center justify-center text-[10px]">
                            {['A', 'B', 'C', 'D'][idx]}
                          </span>
                          <span>{opt}</span>
                          {isCorrect && <CheckCircle className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
                        </div>
                      );
                    })}
                  </div>

                  {q.explanation && (
                    <p className="text-[11px] font-space text-slate-400 mt-2 border-t border-slate-800/60 pt-2">
                      <span className="font-mono text-slate-500 font-semibold mr-1">EXPLANATION:</span>
                      {q.explanation}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 2: ATTEMPTS OVERSIGHT (PAGINATED UP TO 1,000 PARTICIPANTS) */}
      {/* ============================================================= */}
      {activeTab === 'attempts' && (
        <div className="space-y-6">
          {/* Telemetry Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
            <div className="glass-panel p-4 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block mb-1">
                TOTAL ATTEMPTS
              </span>
              <span className="font-orbitron font-bold text-xl text-slate-100">
                {attemptsSummary.totalAttempts || attemptsTotal}
              </span>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-emerald-500/20">
              <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider block mb-1">
                COMPLETED
              </span>
              <span className="font-orbitron font-bold text-xl text-emerald-300">
                {attemptsSummary.completedAttempts}
              </span>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-cyan-500/20">
              <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-wider block mb-1">
                IN-FLIGHT
              </span>
              <span className="font-orbitron font-bold text-xl text-cyan-300">
                {attemptsSummary.inProgressAttempts}
              </span>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-blue-500/20">
              <span className="text-[10px] font-mono text-blue-400 uppercase tracking-wider block mb-1">
                AVG SCORE
              </span>
              <span className="font-orbitron font-bold text-xl text-blue-300">
                {attemptsSummary.averageScore ? `${attemptsSummary.averageScore}/20` : '0/20'}
              </span>
            </div>
            <div className="glass-panel p-4 rounded-xl border border-amber-500/20 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono text-amber-400 uppercase tracking-wider block mb-1">
                PEAK SCORE
              </span>
              <span className="font-orbitron font-bold text-xl text-amber-300">
                {attemptsSummary.highestScore ? `${attemptsSummary.highestScore}/20` : '0/20'}
              </span>
            </div>
          </div>

          {/* Main Attempts Panel */}
          <div className="glass-panel p-6 rounded-2xl border border-cyan-500/20">
            {/* Header and Controls */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800 mb-4">
              <div>
                <h2 className="font-orbitron font-bold text-base text-slate-100 flex items-center gap-2">
                  <Users className="w-4 h-4 text-cyan-400" />
                  PARTICIPANT TELEMETRY OVERSIGHT
                </h2>
                <p className="text-xs font-mono text-slate-400 mt-0.5">
                  Authoritative persistent SQLite records ({attemptsTotal} total matching)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Search Bar */}
                <div className="relative min-w-[200px]">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    value={attemptsSearch}
                    onChange={(e) => {
                      setAttemptsSearch(e.target.value);
                      fetchAttempts(1, attemptsLimit, e.target.value, attemptsStatus, attemptsSortBy, attemptsSortOrder);
                    }}
                    placeholder="Search roll number..."
                    className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-200 outline-none focus:border-cyan-400"
                  />
                </div>

                {/* Status Filter */}
                <select
                  value={attemptsStatus}
                  onChange={(e) => {
                    setAttemptsStatus(e.target.value);
                    fetchAttempts(1, attemptsLimit, attemptsSearch, e.target.value, attemptsSortBy, attemptsSortOrder);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 outline-none focus:border-cyan-400"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed Only</option>
                  <option value="in_progress">In-Progress Only</option>
                </select>

                {/* Sort Option */}
                <select
                  value={attemptsSortBy}
                  onChange={(e) => {
                    setAttemptsSortBy(e.target.value);
                    fetchAttempts(1, attemptsLimit, attemptsSearch, attemptsStatus, e.target.value, attemptsSortOrder);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 outline-none focus:border-cyan-400"
                >
                  <option value="started_at">Started Time</option>
                  <option value="completed_at">Completed Time</option>
                  <option value="score">Score</option>
                  <option value="roll_number">Roll Number</option>
                  <option value="time_taken_seconds">Duration</option>
                </select>

                {/* Sort Direction Toggle */}
                <button
                  onClick={() => {
                    const newDir = attemptsSortOrder === 'DESC' ? 'ASC' : 'DESC';
                    setAttemptsSortOrder(newDir);
                    fetchAttempts(attemptsPage, attemptsLimit, attemptsSearch, attemptsStatus, attemptsSortBy, newDir);
                  }}
                  className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:border-cyan-400"
                  title="Toggle ascending / descending"
                >
                  {attemptsSortOrder}
                </button>

                {/* Page Limit */}
                <select
                  value={attemptsLimit}
                  onChange={(e) => {
                    const l = parseInt(e.target.value, 10);
                    setAttemptsLimit(l);
                    fetchAttempts(1, l, attemptsSearch, attemptsStatus, attemptsSortBy, attemptsSortOrder);
                  }}
                  className="px-2 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 outline-none focus:border-cyan-400"
                >
                  <option value="25">25 / page</option>
                  <option value="50">50 / page</option>
                  <option value="100">100 / page</option>
                </select>

                {/* Manual Refresh Button */}
                <button
                  onClick={() => {
                    sound.playChirp();
                    fetchAttempts(attemptsPage, attemptsLimit, attemptsSearch, attemptsStatus, attemptsSortBy, attemptsSortOrder);
                  }}
                  disabled={attemptsLoading}
                  className="px-3 py-1.5 rounded-lg bg-cyan-950/80 border border-cyan-500/50 text-cyan-300 hover:bg-cyan-900/60 text-xs font-mono flex items-center gap-1.5 cursor-pointer"
                  title="Reload participant records from backend"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${attemptsLoading ? 'animate-spin' : ''}`} />
                  <span className="hidden sm:inline">REFRESH</span>
                </button>
              </div>
            </div>

            {/* Error Message if Fetch Fails */}
            {attemptsError && (
              <div className="mb-4 p-3 rounded-lg bg-rose-950/80 border border-rose-500/60 text-rose-200 text-xs font-mono flex items-center justify-between">
                <span>{attemptsError}</span>
                <button
                  onClick={() => fetchAttempts()}
                  className="underline hover:text-rose-100 ml-2"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Table */}
            {attemptsLoading ? (
              <div className="text-center py-16">
                <div className="w-8 h-8 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-2" />
                <p className="text-xs font-mono text-cyan-400">QUERYING ORBITAL TELEMETRY RECORDS...</p>
              </div>
            ) : attempts.length === 0 ? (
              <div className="text-center py-16 text-slate-500 font-mono text-xs">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                <p>No participant attempts match the specified query.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left font-mono text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px]">
                      <th className="py-2.5 px-3">PILOT ROLL NUMBER</th>
                      <th className="py-2.5 px-3">STATUS</th>
                      <th className="py-2.5 px-3 text-center">SCORE & %</th>
                      <th className="py-2.5 px-3 text-center">ENERGY</th>
                      <th className="py-2.5 px-3">ACCURACY (C / I / U)</th>
                      <th className="py-2.5 px-3">DURATION</th>
                      <th className="py-2.5 px-3">TIMESTAMPS</th>
                      <th className="py-2.5 px-3 text-right">ACTION</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {attempts.map((att) => {
                      const normalized = att.normalized_roll_number || att.roll_number;
                      const raw = att.raw_roll_number;
                      const hasRawDiff = raw && raw !== normalized;
                      const pct = att.percentage != null
                        ? Number(att.percentage).toFixed(0)
                        : Math.round((att.score / 20) * 100);

                      return (
                        <tr key={att.id} className="hover:bg-slate-900/60 transition-colors">
                          <td className="py-3 px-3">
                            <span className="font-bold text-slate-100 block">{normalized}</span>
                            {hasRawDiff && (
                              <span className="text-[10px] text-slate-500 block">Raw: {raw}</span>
                            )}
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                att.status === 'completed'
                                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800'
                                  : 'bg-cyan-950/60 text-cyan-300 border border-cyan-800 animate-pulse'
                              }`}
                            >
                              {att.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-center">
                            <span className="font-bold text-cyan-300">{att.score}/20</span>
                            <span className="text-[10px] text-slate-400 block">({pct}%)</span>
                          </td>
                          <td className="py-3 px-3 text-center font-bold text-amber-300">
                            {att.energy_percentage}%
                          </td>
                          <td className="py-3 px-3 text-slate-300 text-[11px]">
                            <span className="text-emerald-400 font-bold">{att.correct_count ?? att.score}C</span>
                            {' / '}
                            <span className="text-rose-400">{att.incorrect_count ?? 0}I</span>
                            {' / '}
                            <span className="text-slate-400">{att.unanswered_count ?? 0}U</span>
                          </td>
                          <td className="py-3 px-3 text-slate-400">{att.time_taken_seconds}s</td>
                          <td className="py-3 px-3 text-slate-400 text-[11px]">
                            <div>
                              <span className="text-slate-500">Start:</span>{' '}
                              {att.started_at ? new Date(att.started_at).toLocaleTimeString() : 'N/A'}
                            </div>
                            {att.completed_at && (
                              <div>
                                <span className="text-slate-500">End:</span>{' '}
                                {new Date(att.completed_at).toLocaleTimeString()}
                              </div>
                            )}
                          </td>
                          <td className="py-3 px-3 text-right">
                            <button
                              onClick={async () => {
                                await handleResetAttempt(att.id, normalized);
                                fetchAttempts(attemptsPage, attemptsLimit, attemptsSearch, attemptsStatus, attemptsSortBy, attemptsSortOrder);
                              }}
                              className="px-2.5 py-1 rounded bg-rose-950/40 border border-rose-800/60 text-rose-300 hover:bg-rose-900/60 text-[10px] font-mono cursor-pointer"
                              title="Clear this attempt to allow a retake"
                            >
                              RESET ATTEMPT
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination Controls */}
            {attemptsTotalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800 mt-4 text-xs font-mono">
                <span className="text-slate-400">
                  Showing {(attemptsPage - 1) * attemptsLimit + 1} to{' '}
                  {Math.min(attemptsPage * attemptsLimit, attemptsTotal)} of {attemptsTotal} records
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => {
                      if (attemptsPage > 1) {
                        const p = attemptsPage - 1;
                        setAttemptsPage(p);
                        fetchAttempts(p, attemptsLimit, attemptsSearch, attemptsStatus, attemptsSortBy, attemptsSortOrder);
                      }
                    }}
                    disabled={attemptsPage <= 1}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    PREV
                  </button>

                  <span className="px-3 py-1.5 text-cyan-400 font-bold">
                    PAGE {attemptsPage} OF {attemptsTotalPages}
                  </span>

                  <button
                    onClick={() => {
                      if (attemptsPage < attemptsTotalPages) {
                        const p = attemptsPage + 1;
                        setAttemptsPage(p);
                        fetchAttempts(p, attemptsLimit, attemptsSearch, attemptsStatus, attemptsSortBy, attemptsSortOrder);
                      }
                    }}
                    disabled={attemptsPage >= attemptsTotalPages}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 hover:border-cyan-400 disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    NEXT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* TAB 3: FESTIVAL SETTINGS */}
      {/* ============================================================= */}
      {activeTab === 'settings' && (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/20 max-w-3xl">
          <h2 className="font-orbitron font-bold text-base text-slate-100 mb-6 pb-3 border-b border-slate-800">
            TECHNICAL FESTIVAL RULES & POLICIES
          </h2>

          {settingsMsg && (
            <div className="mb-6 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-200 text-xs font-mono">
              {settingsMsg}
            </div>
          )}

          <div className="flex flex-col gap-6 font-space text-sm">
            {/* Setting 1: Allow Duplicate Attempts */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Allow Duplicate Attempts</p>
                <p className="text-xs text-slate-400">
                  If disabled, each roll number can only complete the mission once.
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.allow_duplicate_attempts === 'true'}
                  onChange={(e) =>
                    setSettings({ ...settings, allow_duplicate_attempts: e.target.checked ? 'true' : 'false' })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            {/* Setting 2: Leaderboard Display Mode */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Leaderboard Scoring Mode</p>
                <p className="text-xs text-slate-400">
                  When retakes are allowed, should the leaderboard display the student's highest score or first completed attempt?
                </p>
              </div>
              <select
                value={settings.leaderboard_display_mode || 'best'}
                onChange={(e) =>
                  setSettings({ ...settings, leaderboard_display_mode: e.target.value })
                }
                className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-cyan-300 outline-none"
              >
                <option value="best">Best Attempt (Highest Score)</option>
                <option value="first">First Attempt Only</option>
              </select>
            </div>

            {/* Setting 3: Mask Roll Numbers */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div>
                <p className="font-semibold text-slate-200">Privacy Masking on Public Leaderboard</p>
                <p className="text-xs text-slate-400">
                  Mask student roll numbers on public screens (e.g. 21BCE****91).
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={settings.mask_roll_numbers === 'true'}
                  onChange={(e) =>
                    setSettings({ ...settings, mask_roll_numbers: e.target.checked ? 'true' : 'false' })
                  }
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
              </label>
            </div>

            <button
              onClick={handleSaveSettings}
              className="py-3 px-6 rounded-xl btn-primary text-xs font-bold self-start"
            >
              SAVE FESTIVAL CONFIGURATION
            </button>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: ADD / EDIT QUESTION */}
      {/* ============================================================= */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/40 my-8">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-orbitron font-bold text-base text-slate-100">
                {editingQuestion ? 'EDIT QUESTION' : 'ADD NEW QUESTION TO ORBITAL BANK'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveQuestion} className="flex flex-col gap-4 font-space text-xs">
              <div>
                <label className="block font-mono text-slate-300 uppercase mb-1">
                  QUESTION TEXT
                </label>
                <textarea
                  value={formText}
                  onChange={(e) => setFormText(e.target.value)}
                  rows={3}
                  className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-sm focus:border-cyan-400 outline-none"
                  required
                />
              </div>

              {/* 4 Options with radio for correct answer */}
              <div>
                <label className="block font-mono text-slate-300 uppercase mb-2">
                  OPTIONS (SELECT THE RADIO BUTTON FOR CORRECT ANSWER)
                </label>
                <div className="flex flex-col gap-2.5">
                  {formOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="correctOption"
                        checked={formCorrectIndex === idx}
                        onChange={() => setFormCorrectIndex(idx)}
                        className="w-4 h-4 text-cyan-400 cursor-pointer"
                      />
                      <span className="w-6 font-mono font-bold text-slate-400">
                        {['A', 'B', 'C', 'D'][idx]}:
                      </span>
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...formOptions];
                          updated[idx] = e.target.value;
                          setFormOptions(updated);
                        }}
                        placeholder={`Option ${['A', 'B', 'C', 'D'][idx]}`}
                        className="flex-1 p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs focus:border-cyan-400 outline-none"
                        required
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Category & Difficulty */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-slate-300 uppercase mb-1">CATEGORY</label>
                  <input
                    type="text"
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none"
                  />
                </div>
                <div>
                  <label className="block font-mono text-slate-300 uppercase mb-1">DIFFICULTY</label>
                  <select
                    value={formDifficulty}
                    onChange={(e) => setFormDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none"
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-mono text-slate-300 uppercase mb-1">
                  EXPLANATION (FOR PILOT REVIEW)
                </label>
                <textarea
                  value={formExplanation}
                  onChange={(e) => setFormExplanation(e.target.value)}
                  rows={2}
                  className="w-full p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 text-xs outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isActiveCheck"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-cyan-400"
                />
                <label htmlFor="isActiveCheck" className="text-slate-300 font-mono">
                  ACTIVE IN RANDOM DRAW
                </label>
              </div>

              <div className="flex justify-end gap-3 mt-4 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 rounded-xl btn-secondary text-xs"
                >
                  Cancel
                </button>
                <button type="submit" className="px-6 py-2.5 rounded-xl btn-primary text-xs font-bold">
                  {editingQuestion ? 'UPDATE QUESTION' : 'SAVE TO DATABASE'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================= */}
      {/* MODAL: BULK IMPORT JSON */}
      {/* ============================================================= */}
      {showImportModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="w-full max-w-2xl glass-panel p-6 sm:p-8 rounded-2xl border border-cyan-500/40">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-4">
              <h3 className="font-orbitron font-bold text-base text-slate-100">
                BULK IMPORT QUESTIONS VIA JSON
              </h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-400 font-space mb-3">
              Paste a JSON array of question objects. Format required:
            </p>
            <pre className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto mb-4">
{`[
  {
    "question_text": "What is the time complexity of binary search?",
    "options": ["O(log N)", "O(N)", "O(1)", "O(N log N)"],
    "correct_option_index": 0,
    "explanation": "Binary search divides the search interval in half each step.",
    "category": "Algorithms",
    "difficulty": "easy"
  }
]`}
            </pre>

            <textarea
              value={importJsonText}
              onChange={(e) => setImportJsonText(e.target.value)}
              placeholder="Paste JSON array here..."
              rows={8}
              className="w-full p-3 rounded-xl bg-slate-900 border border-slate-700 text-slate-100 font-mono text-xs focus:border-cyan-400 outline-none mb-4"
            />

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowImportModal(false)}
                className="px-4 py-2 rounded-xl btn-secondary text-xs"
              >
                Cancel
              </button>
              <button
                onClick={handleBulkImport}
                className="px-6 py-2 rounded-xl btn-primary text-xs font-bold"
              >
                EXECUTE BULK IMPORT
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
