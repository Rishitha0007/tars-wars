import {
  QuestionClient,
  SubmitAnswerResponse,
  QuizResults,
  LeaderboardEntry,
  AdminQuestion,
  AdminAttempt,
  AdminAttemptsResponse,
} from '../types/index.js';

const API_BASE = 'https://tars-wars.onrender.com/api';
class ApiService {
  private getAdminToken(): string | null {
    return localStorage.getItem('tars_wars_admin_token');
  }

  // Quiz Endpoints
  async startQuiz(rollNumber: string): Promise<{
    attemptId: string;
    rollNumber: string;
    status: string;
    resumed: boolean;
    score: number;
    energyPercentage: number;
    currentQuestion: QuestionClient;
  }> {
    const res = await fetch(`${API_BASE}/quiz/start`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ rollNumber }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to start quiz');
    }
    return data;
  }

  async getAttempt(attemptId: string): Promise<{
    attemptId: string;
    rollNumber: string;
    status: string;
    score: number;
    energyPercentage: number;
    currentQuestion?: QuestionClient;
    isCompleted: boolean;
  }> {
    const res = await fetch(`${API_BASE}/quiz/attempt/${attemptId}`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch attempt');
    }
    return data;
  }

  async submitAnswer(
    attemptId: string,
    sequenceNumber: number,
    selectedOptionIndex: number
  ): Promise<SubmitAnswerResponse> {
    const res = await fetch(`${API_BASE}/quiz/attempt/${attemptId}/submit`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequenceNumber, selectedOptionIndex }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to submit answer');
    }
    return data;
  }

  async reportTimeout(
    attemptId: string,
    sequenceNumber: number
  ): Promise<{
    success: boolean;
    score: number;
    energyPercentage: number;
    isLastQuestion: boolean;
    nextQuestionIndex: number;
    explanation: string;
    correctOptionIndex: number;
  }> {
    const res = await fetch(`${API_BASE}/quiz/attempt/${attemptId}/timeout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sequenceNumber }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to handle timeout');
    }
    return data;
  }

  async advanceQuestion(attemptId: string): Promise<{
    success: boolean;
    nextQuestion: QuestionClient;
    completed: boolean;
  }> {
    const res = await fetch(`${API_BASE}/quiz/attempt/${attemptId}/next`, {
      method: 'POST',
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to advance to next question');
    }
    return data;
  }

  async getResults(attemptId: string): Promise<QuizResults> {
    const res = await fetch(`${API_BASE}/quiz/attempt/${attemptId}/results`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to load results');
    }
    return data;
  }

  // Leaderboard
  async getLeaderboard(): Promise<{
    leaderboard: LeaderboardEntry[];
    displayMode: string;
    isMasked: boolean;
    totalParticipants: number;
    updatedAt: string;
  }> {
    const res = await fetch(`${API_BASE}/leaderboard`);
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to fetch leaderboard');
    }
    return data;
  }

  // Admin Endpoints
  async adminLogin(username: string, password: string): Promise<{ token: string; username: string }> {
    const res = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Invalid credentials');
    }
    localStorage.setItem('tars_wars_admin_token', data.token);
    return data;
  }

  async adminGetQuestions(): Promise<{ questions: AdminQuestion[]; total: number; activeCount: number }> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/questions`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load questions');
    return data;
  }

  async adminCreateQuestion(payload: any): Promise<AdminQuestion> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/questions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create question');
    return data;
  }

  async adminUpdateQuestion(id: string, payload: any): Promise<AdminQuestion> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update question');
    return data;
  }

  async adminDeleteQuestion(id: string): Promise<void> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/questions/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to delete question');
  }

  async adminToggleQuestion(id: string, is_active: boolean): Promise<AdminQuestion> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/questions/${id}/toggle`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ is_active }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to toggle status');
    return data;
  }

  async adminBulkImport(questions: any[]): Promise<{ importedCount: number }> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/questions/bulk-import`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ questions }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to bulk import questions');
    return data;
  }

  async adminReseed(): Promise<{ seededCount: number }> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/questions/reseed`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reseed database');
    return data;
  }

  async adminGetAttempts(params?: {
    search?: string;
    status?: string;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
    page?: number;
    limit?: number;
  }): Promise<AdminAttemptsResponse> {
    const token = this.getAdminToken();
    const query = new URLSearchParams();
    if (params?.search) query.set('search', params.search);
    if (params?.status) query.set('status', params.status);
    if (params?.sortBy) query.set('sortBy', params.sortBy);
    if (params?.sortOrder) query.set('sortOrder', params.sortOrder);
    if (params?.page) query.set('page', String(params.page));
    if (params?.limit) query.set('limit', String(params.limit));

    const qs = query.toString() ? `?${query.toString()}` : '';
    const res = await fetch(`${API_BASE}/admin/attempts${qs}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load attempts');

    if (Array.isArray(data)) {
      return {
        attempts: data,
        total: data.length,
        page: 1,
        limit: data.length,
        totalPages: 1,
        summary: {
          totalAttempts: data.length,
          completedAttempts: data.filter((a: any) => a.status === 'completed').length,
          inProgressAttempts: data.filter((a: any) => a.status === 'in_progress').length,
          averageScore: 0,
          highestScore: 0,
        },
      };
    }
    return data;
  }

  async adminResetAttempt(attemptId: string): Promise<void> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/attempts/${attemptId}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to reset attempt');
  }

  async adminGetSettings(): Promise<Record<string, string>> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/settings`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to load settings');
    return data;
  }

  async adminUpdateSettings(settings: Record<string, string>): Promise<void> {
    const token = this.getAdminToken();
    const res = await fetch(`${API_BASE}/admin/settings`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(settings),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update settings');
  }
}

export const api = new ApiService();
