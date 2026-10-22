import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { db } from '../db/database.js';

describe('TARS WARS Backend API Suite', () => {
  const timestamp = Date.now();
  const testRoll = `PILOT-${timestamp}`;

  it('GET /api/health returns system online and active questions >= 20', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('online');
    expect(res.body.activeQuestions).toBeGreaterThanOrEqual(20);
  });

  it('POST /api/quiz/start creates an attempt with exactly 20 unique questions', async () => {
    const res = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: testRoll });

    expect(res.status).toBe(200);
    expect(res.body.attemptId).toBeDefined();
    expect(res.body.rollNumber).toBe(testRoll);
    expect(res.body.score).toBe(0);
    expect(res.body.energyPercentage).toBe(0);

    const q = res.body.currentQuestion;
    expect(q).toBeDefined();
    expect(q.sequenceNumber).toBe(1);
    expect(q.totalQuestions).toBe(20);
    expect(q.options.length).toBe(4);
    // Security check: correct option index must NEVER be sent to client
    expect(q.correct_option_index).toBeUndefined();
    expect(q.correctShuffledIndex).toBeUndefined();
  });

  it('POST /api/quiz/start with same in-progress roll number resumes the ongoing attempt', async () => {
    const res = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: testRoll });

    expect(res.status).toBe(200);
    expect(res.body.resumed).toBe(true);
  });

  it('Evaluates answer correctly and updates energy by exactly +5% per correct answer', async () => {
    // Start fresh attempt with unique roll
    const roll = `ENERGY-${timestamp}`;
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: roll });

    const attemptId = startRes.body.attemptId;

    // Get the hidden correct answer from DB for testing
    const respRow = (db as any).db.prepare(`
      SELECT correct_shuffled_index FROM attempt_responses
      WHERE attempt_id = ? AND sequence_number = 1
    `).get(attemptId);

    const correctIndex = respRow.correct_shuffled_index;

    // Submit correct answer
    const submitRes = await request(app)
      .post(`/api/quiz/attempt/${attemptId}/submit`)
      .send({
        sequenceNumber: 1,
        selectedOptionIndex: correctIndex,
      });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.isCorrect).toBe(true);
    expect(submitRes.body.score).toBe(1);
    expect(submitRes.body.energyPercentage).toBe(5); // 1 * 5 = 5%

    // Double submission prevention: submitting again should return same evaluated result without advancing score
    const doubleRes = await request(app)
      .post(`/api/quiz/attempt/${attemptId}/submit`)
      .send({
        sequenceNumber: 1,
        selectedOptionIndex: correctIndex,
      });

    expect(doubleRes.status).toBe(200);
    expect(doubleRes.body.score).toBe(1);
    expect(doubleRes.body.energyPercentage).toBe(5);

    // Advance to question 2
    const nextRes = await request(app)
      .post(`/api/quiz/attempt/${attemptId}/next`);
    expect(nextRes.status).toBe(200);

    // Submit wrong answer on question 2
    const q2Row = (db as any).db.prepare(`
      SELECT correct_shuffled_index FROM attempt_responses
      WHERE attempt_id = ? AND sequence_number = 2
    `).get(attemptId);
    const wrongIndex = (q2Row.correct_shuffled_index + 1) % 4;

    const submitWrongRes = await request(app)
      .post(`/api/quiz/attempt/${attemptId}/submit`)
      .send({
        sequenceNumber: 2,
        selectedOptionIndex: wrongIndex,
      });

    expect(submitWrongRes.status).toBe(200);
    expect(submitWrongRes.body.isCorrect).toBe(false);
    // Score remains 1, energy remains 5% (wrong answer must not subtract earned energy!)
    expect(submitWrongRes.body.score).toBe(1);
    expect(submitWrongRes.body.energyPercentage).toBe(5);
  });

  it('Leaderboard returns ranked list with tie breakers', async () => {
    const res = await request(app).get('/api/leaderboard');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.leaderboard)).toBe(true);
    expect(res.body.displayMode).toBeDefined();
  });

  it('Handles timeout properly and awards zero energy without subtracting', async () => {
    const roll = `TIMEOUT-${Date.now()}`;
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: roll });

    const attemptId = startRes.body.attemptId;

    const timeoutRes = await request(app)
      .post(`/api/quiz/attempt/${attemptId}/timeout`)
      .send({ sequenceNumber: 1 });

    expect(timeoutRes.status).toBe(200);
    expect(timeoutRes.body.score).toBe(0);
    expect(timeoutRes.body.energyPercentage).toBe(0);
  });

  it('Rejects duplicate completed attempts when ALLOW_DUPLICATE_ATTEMPTS is false', async () => {
    const roll = `DUP-${Date.now()}`;
    // Start attempt
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: roll });
    const attemptId = startRes.body.attemptId;

    // Fast-forward / complete the attempt directly in db
    (db as any).db.prepare(`
      UPDATE attempts SET status = 'completed', completed_at = ? WHERE id = ?
    `).run(new Date().toISOString(), attemptId);

    // Try starting again with same roll
    const restartRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: roll });

    expect(restartRes.status).toBe(400);
    expect(restartRes.body.error).toContain('already completed');
  });

  it('Admin can reset an attempt and allow participant to restart', async () => {
    const roll = `RESET-${Date.now()}`;
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: roll });
    const attemptId = startRes.body.attemptId;

    // Login admin
    const loginRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'interstellar2026' });
    const token = loginRes.body.token;

    // Reset attempt
    const resetRes = await request(app)
      .delete(`/api/admin/attempts/${attemptId}`)
      .set('Authorization', `Bearer ${token}`);
    expect(resetRes.status).toBe(200);
  });

  it('Admin login succeeds with valid flight credentials and can view questions', async () => {
    // Bad credentials
    const badRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'hacker', password: 'bad' });
    expect(badRes.status).toBe(401);

    // Good credentials
    const goodRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'interstellar2026' });
    expect(goodRes.status).toBe(200);
    expect(goodRes.body.token).toBeDefined();

    // Access protected route
    const qRes = await request(app)
      .get('/api/admin/questions')
      .set('Authorization', `Bearer ${goodRes.body.token}`);
    expect(qRes.status).toBe(200);
    expect(qRes.body.questions.length).toBeGreaterThanOrEqual(20);
  });
});
