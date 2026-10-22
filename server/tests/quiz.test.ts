import { describe, it, expect } from 'vitest';
import request from 'supertest';
import app from '../index.js';
import { db } from '../db/database.js';

describe('TARS WARS Comprehensive Technical Fest Test Suite', () => {
  const timestamp = Date.now();
  const testRoll = `PILOT-${timestamp}`;

  // REQUIREMENT 8 - CASE 1: A new roll number can start one attempt
  it('CASE 1: A new roll number can start one attempt with 20 questions', async () => {
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
    // Security check: answer key must NEVER be leaked to browser
    expect(q.correct_option_index).toBeUndefined();
    expect(q.correctShuffledIndex).toBeUndefined();
  });

  // REQUIREMENT 8 - CASE 2: Same roll number with different casing is rejected after completion
  it('CASE 2: Same roll number with lowercase casing is rejected after completion', async () => {
    const baseRoll = `24BQ1A05J2_${timestamp}`;
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: baseRoll });
    const attemptId = startRes.body.attemptId;

    // Fast-forward / complete the attempt in database
    (db as any).db.prepare(`
      UPDATE attempts SET status = 'completed', completed_at = ? WHERE id = ?
    `).run(new Date().toISOString(), attemptId);

    // Try starting with lowercase casing: '24bq1a05j2_...'
    const lowercaseRoll = baseRoll.toLowerCase();
    const restartRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: lowercaseRoll });

    expect([400, 409]).toContain(restartRes.status);
    expect(restartRes.body.error).toContain('already completed');
  });

  // REQUIREMENT 8 - CASE 3: Leading/trailing spaces do not bypass the restriction
  it('CASE 3: Leading and trailing whitespace does not bypass the restriction', async () => {
    const baseRoll = `SPACES_${timestamp}`;
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: `  ${baseRoll}  ` });
    const attemptId = startRes.body.attemptId;

    // Complete the attempt
    (db as any).db.prepare(`
      UPDATE attempts SET status = 'completed', completed_at = ? WHERE id = ?
    `).run(new Date().toISOString(), attemptId);

    // Try again with tabs and spaces
    const spacedRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: `   \t ${baseRoll} \n  ` });

    expect([400, 409]).toContain(spacedRes.status);
    expect(spacedRes.body.error).toContain('already completed');
  });

  // REQUIREMENT 8 - CASE 4: Two simultaneous start requests cannot create two attempts
  it('CASE 4: Concurrent start requests for same roll number atomically create only 1 attempt', async () => {
    const raceRoll = `RACE-${timestamp}`;

    // Launch 3 simultaneous requests for the exact same roll number
    const [res1, res2, res3] = await Promise.all([
      request(app).post('/api/quiz/start').send({ rollNumber: raceRoll }),
      request(app).post('/api/quiz/start').send({ rollNumber: raceRoll }),
      request(app).post('/api/quiz/start').send({ rollNumber: ` ${raceRoll} ` }),
    ]);

    expect(res1.status).toBe(200);
    expect(res2.status).toBe(200);
    expect(res3.status).toBe(200);

    // All must share the exact same attemptId
    expect(res1.body.attemptId).toBe(res2.body.attemptId);
    expect(res1.body.attemptId).toBe(res3.body.attemptId);

    // Check at database level that strictly 1 row was created
    const countRow = (db as any).db.prepare(`
      SELECT count(*) as count FROM attempts WHERE normalized_roll_number = ?
    `).get(raceRoll);
    expect(countRow.count).toBe(1);
  });

  // REQUIREMENT 8 - CASE 5: Refreshing active attempt restores same attempt and remaining time
  it('CASE 5: Refreshing active attempt restores the ongoing attempt without generating new questions', async () => {
    const resumeRoll = `RESUME-${timestamp}`;
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: resumeRoll });

    const attemptId = startRes.body.attemptId;
    const initialDeadline = startRes.body.currentQuestion.deadlineAt;

    // Simulate page reload: fetch attempt state from server
    const reloadRes = await request(app).get(`/api/quiz/attempt/${attemptId}`);

    expect(reloadRes.status).toBe(200);
    expect(reloadRes.body.attemptId).toBe(attemptId);
    expect(reloadRes.body.currentQuestion.sequenceNumber).toBe(1);
    expect(reloadRes.body.currentQuestion.deadlineAt).toBe(initialDeadline);
    expect(reloadRes.body.isCompleted).toBe(false);
  });

  // REQUIREMENT 8 - CASE 7 & 8: Completing persists correct score & repeat submit does not overwrite
  it('CASE 7 & 8: Submitting answers updates energy +5%, persists stats, and prevents double scoring', async () => {
    const energyRoll = `SCORING-${timestamp}`;
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: energyRoll });

    const attemptId = startRes.body.attemptId;

    // Query hidden correct option index from SQLite
    const respRow = (db as any).db.prepare(`
      SELECT correct_shuffled_index FROM attempt_responses
      WHERE attempt_id = ? AND sequence_number = 1
    `).get(attemptId);
    const correctIdx = respRow.correct_shuffled_index;

    // Submit correct answer
    const submitRes = await request(app)
      .post(`/api/quiz/attempt/${attemptId}/submit`)
      .send({ sequenceNumber: 1, selectedOptionIndex: correctIdx });

    expect(submitRes.status).toBe(200);
    expect(submitRes.body.isCorrect).toBe(true);
    expect(submitRes.body.score).toBe(1);
    expect(submitRes.body.percentage).toBe(5); // (1 / 20) * 100
    expect(submitRes.body.energyPercentage).toBe(5);

    // Repeat submission must be idempotent: cannot inflate score
    const repeatRes = await request(app)
      .post(`/api/quiz/attempt/${attemptId}/submit`)
      .send({ sequenceNumber: 1, selectedOptionIndex: correctIdx });

    expect(repeatRes.status).toBe(200);
    expect(repeatRes.body.score).toBe(1);
    expect(repeatRes.body.energyPercentage).toBe(5);

    // Verify stats in database table
    const attemptInDb = (db as any).db.prepare(`
      SELECT score, percentage, energy_percentage, correct_count FROM attempts WHERE id = ?
    `).get(attemptId);
    expect(attemptInDb.score).toBe(1);
    expect(attemptInDb.energy_percentage).toBe(5);
    expect(attemptInDb.correct_count).toBe(1);
  });

  // REQUIREMENT 8 - CASE 9 & 10: Admin authentication and security
  it('CASE 9 & 10: Admin login verifies credentials securely and rejects unauthorized requests', async () => {
    // 1. Unauthenticated request to protected endpoint rejected
    const unauthRes = await request(app).get('/api/admin/questions');
    expect(unauthRes.status).toBe(401);

    // 2. Bad credentials rejected
    const badRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: 'wrong_password_123' });
    expect(badRes.status).toBe(401);
    expect(badRes.body.error).toContain('Invalid flight command credentials');

    // 3. Valid credentials succeed
    const validRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: process.env.ADMIN_PASSWORD || 'interstellar2026' });
    expect(validRes.status).toBe(200);
    expect(validRes.body.token).toBeDefined();

    // 4. Authorized request succeeds
    const authRes = await request(app)
      .get('/api/admin/questions')
      .set('Authorization', `Bearer ${validRes.body.token}`);
    expect(authRes.status).toBe(200);
    expect(authRes.body.total).toBeGreaterThanOrEqual(20);
  });

  // REQUIREMENT 8 - CASE 11: Admin dashboard paginated attempts oversight
  it('CASE 11: Admin dashboard fetches paginated attempts with search, sort, and summary', async () => {
    const loginRes = await request(app)
      .post('/api/admin/login')
      .send({ username: 'admin', password: process.env.ADMIN_PASSWORD || 'interstellar2026' });
    const token = loginRes.body.token;

    // Fetch page 1
    const attemptsRes = await request(app)
      .get('/api/admin/attempts?page=1&limit=10&sortBy=started_at&sortOrder=DESC')
      .set('Authorization', `Bearer ${token}`);

    expect(attemptsRes.status).toBe(200);
    expect(attemptsRes.body.attempts).toBeDefined();
    expect(Array.isArray(attemptsRes.body.attempts)).toBe(true);
    expect(attemptsRes.body.total).toBeGreaterThanOrEqual(1);
    expect(attemptsRes.body.page).toBe(1);
    expect(attemptsRes.body.limit).toBe(10);
    expect(attemptsRes.body.summary).toBeDefined();
    expect(attemptsRes.body.summary.totalAttempts).toBeGreaterThanOrEqual(1);

    // Search by roll number
    const searchRes = await request(app)
      .get(`/api/admin/attempts?search=${testRoll}&page=1&limit=10`)
      .set('Authorization', `Bearer ${token}`);

    expect(searchRes.status).toBe(200);
    expect(searchRes.body.attempts.length).toBeGreaterThanOrEqual(1);
    expect(searchRes.body.attempts[0].normalized_roll_number).toBe(testRoll);
  });

  // REQUIREMENT 8 - CASE 12: Handles timeouts without data loss
  it('CASE 12: Handles timeout accurately, recording unanswered state without losing data', async () => {
    const timeoutRoll = `TIMEOUT-${timestamp}`;
    const startRes = await request(app)
      .post('/api/quiz/start')
      .send({ rollNumber: timeoutRoll });
    const attemptId = startRes.body.attemptId;

    const timeoutRes = await request(app)
      .post(`/api/quiz/attempt/${attemptId}/timeout`)
      .send({ sequenceNumber: 1 });

    expect(timeoutRes.status).toBe(200);
    expect(timeoutRes.body.score).toBe(0);
    expect(timeoutRes.body.energyPercentage).toBe(0);

    const respInDb = (db as any).db.prepare(`
      SELECT is_unanswered, is_correct, selected_option_index FROM attempt_responses
      WHERE attempt_id = ? AND sequence_number = 1
    `).get(attemptId);

    expect(respInDb.is_unanswered).toBe(1);
    expect(respInDb.is_correct).toBe(0);
    expect(respInDb.selected_option_index).toBeNull();
  });

  // REQUIREMENT 8 - CASE 14: Concurrency test with multiple simulated participants
  it('CASE 14: Concurrent simulated participants operate safely on SQLite without lock contention', async () => {
    const participants = Array.from({ length: 8 }, (_, i) => `CONCURRENT-PILOT-${timestamp}-${i}`);

    // All 8 participants start their quiz concurrently
    const startPromises = participants.map((roll) =>
      request(app).post('/api/quiz/start').send({ rollNumber: roll })
    );

    const results = await Promise.all(startPromises);

    for (let i = 0; i < results.length; i++) {
      expect(results[i].status).toBe(200);
      expect(results[i].body.attemptId).toBeDefined();
      expect(results[i].body.rollNumber).toBe(participants[i]);
    }

    // Check all 8 attempts exist in database
    const rows = (db as any).db.prepare(`
      SELECT count(*) as count FROM attempts WHERE normalized_roll_number LIKE ?
    `).get(`CONCURRENT-PILOT-${timestamp}%`);

    expect(rows.count).toBe(8);
  });
});
