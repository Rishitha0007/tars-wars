import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { db } from '../db/database.js';
import { requireAdminAuth, generateAdminToken, AdminAuthRequest } from '../middleware/auth.js';
import { SEED_QUESTIONS } from '../db/seed-data.js';

const router = Router();

// In-memory rate limiter for Admin Login (max 5 failed attempts per IP per 15 minutes)
interface RateLimitRecord {
  failures: number;
  lockedUntil: number;
}
const loginAttemptsMap = new Map<string, RateLimitRecord>();
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes

function getClientIp(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (typeof forwarded === 'string') {
    return forwarded.split(',')[0].trim();
  }
  return req.ip || req.socket.remoteAddress || 'unknown-client';
}

// 1. Organizer Login with rate-limiting and bcrypt hash support
router.post('/login', (req: Request, res: Response) => {
  const clientIp = getClientIp(req);
  const now = Date.now();

  // Check rate limit status
  const rateRecord = loginAttemptsMap.get(clientIp);
  if (rateRecord && rateRecord.lockedUntil > now) {
    const remainingMinutes = Math.ceil((rateRecord.lockedUntil - now) / 60000);
    return res.status(429).json({
      error: `Too many failed authentication attempts. Flight command terminal locked for ${remainingMinutes} more minute(s).`,
    });
  }

  const { username, password } = req.body;

  if (!username || !password || typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Username and password required' });
  }

  const configuredUsername = process.env.ADMIN_USERNAME || 'admin';
  const configuredPasswordHash = process.env.ADMIN_PASSWORD_HASH;
  const configuredPasswordPlain = process.env.ADMIN_PASSWORD;

  if (!configuredPasswordHash && !configuredPasswordPlain) {
    return res.status(500).json({
      error: 'Flight command authorization key is not configured on this server environment.',
    });
  }

  // Check username match
  let isUsernameMatch = false;
  try {
    const userBufA = Buffer.from(username.trim());
    const userBufB = Buffer.from(configuredUsername.trim());
    if (userBufA.length === userBufB.length) {
      isUsernameMatch = crypto.timingSafeEqual(userBufA, userBufB);
    }
  } catch {
    isUsernameMatch = (username.trim() === configuredUsername.trim());
  }

  // Check password match (prefer bcrypt hash, fallback to timingSafeEqual)
  let isPasswordMatch = false;
  if (configuredPasswordHash) {
    try {
      isPasswordMatch = bcrypt.compareSync(password, configuredPasswordHash);
    } catch {
      isPasswordMatch = false;
    }
  } else if (configuredPasswordPlain) {
    try {
      const passBufA = Buffer.from(password);
      const passBufB = Buffer.from(configuredPasswordPlain);
      if (passBufA.length === passBufB.length) {
        isPasswordMatch = crypto.timingSafeEqual(passBufA, passBufB);
      }
    } catch {
      isPasswordMatch = (password === configuredPasswordPlain);
    }
  }

  if (!isUsernameMatch || !isPasswordMatch) {
    // Record failed attempt
    const currentFailures = (rateRecord && rateRecord.lockedUntil <= now ? 0 : rateRecord?.failures || 0) + 1;
    const lockedUntil = currentFailures >= MAX_FAILED_ATTEMPTS ? now + LOCKOUT_DURATION_MS : 0;
    loginAttemptsMap.set(clientIp, { failures: currentFailures, lockedUntil });

    return res.status(401).json({
      error: 'Invalid flight command credentials',
    });
  }

  // Authentication succeeded: clear rate limiter
  loginAttemptsMap.delete(clientIp);

  const token = generateAdminToken(username.trim());
  return res.status(200).json({
    token,
    username: username.trim(),
    role: 'organizer',
    expiresIn: '8h',
  });
});

// All subsequent routes require Admin Auth
router.use(requireAdminAuth);

// 2. Questions CRUD
router.get('/questions', (req: AdminAuthRequest, res: Response) => {
  try {
    const questions = db.getAllQuestions(true);
    const activeCount = questions.filter(q => q.is_active === 1).length;
    return res.status(200).json({
      questions,
      total: questions.length,
      activeCount,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.post('/questions', (req: AdminAuthRequest, res: Response) => {
  try {
    const { question_text, options, correct_option_index, explanation, category, difficulty, is_active } = req.body;

    if (!question_text || typeof question_text !== 'string' || question_text.trim().length === 0) {
      return res.status(400).json({ error: 'Question text is required' });
    }

    if (!Array.isArray(options) || options.length !== 4) {
      return res.status(400).json({ error: 'Exactly 4 options are required' });
    }

    if (typeof correct_option_index !== 'number' || correct_option_index < 0 || correct_option_index > 3) {
      return res.status(400).json({ error: 'Correct option index must be 0, 1, 2, or 3' });
    }

    const created = db.createQuestion({
      question_text,
      options,
      correct_option_index,
      explanation,
      category,
      difficulty,
      is_active: is_active ?? true,
    });

    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.put('/questions/:id', (req: AdminAuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { question_text, options, correct_option_index, explanation, category, difficulty, is_active } = req.body;

    const updated = db.updateQuestion(id, {
      question_text,
      options,
      correct_option_index,
      explanation,
      category,
      difficulty,
      is_active,
    });

    if (!updated) {
      return res.status(404).json({ error: 'Question not found' });
    }

    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/questions/:id', (req: AdminAuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const success = db.deleteQuestion(id);
    if (!success) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.status(200).json({ success: true, message: 'Question eliminated from matrix' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.patch('/questions/:id/toggle', (req: AdminAuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const { is_active } = req.body;
    if (typeof is_active !== 'boolean') {
      return res.status(400).json({ error: 'is_active boolean required' });
    }

    const updated = db.toggleQuestionStatus(id, is_active);
    if (!updated) {
      return res.status(404).json({ error: 'Question not found' });
    }
    return res.status(200).json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Bulk Import JSON
router.post('/questions/bulk-import', (req: AdminAuthRequest, res: Response) => {
  try {
    const { questions } = req.body;
    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ error: 'Array of questions required for import' });
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question_text || !Array.isArray(q.options) || q.options.length !== 4 || typeof q.correct_option_index !== 'number') {
        return res.status(400).json({ error: `Question item at index ${i} is invalid (requires question_text, 4 options, and correct_option_index)` });
      }
    }

    const count = db.bulkInsertQuestions(questions);
    return res.status(200).json({ success: true, importedCount: count });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// Reseed Questions
router.post('/questions/reseed', (req: AdminAuthRequest, res: Response) => {
  try {
    const count = db.bulkInsertQuestions(SEED_QUESTIONS);
    return res.status(200).json({ success: true, seededCount: count });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 3. Attempts Oversight - Supports search, status filter, sort, and pagination (up to 1,000 records)
router.get('/attempts', (req: AdminAuthRequest, res: Response) => {
  try {
    const search = typeof req.query.search === 'string' ? req.query.search : undefined;
    const status = typeof req.query.status === 'string' ? req.query.status : undefined;
    const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : undefined;
    const sortOrder = (String(req.query.sortOrder || 'DESC').toUpperCase() === 'ASC') ? 'ASC' : 'DESC';
    const page = parseInt(String(req.query.page), 10) || 1;
    const limit = parseInt(String(req.query.limit), 10) || 50;

    const result = db.getAttemptsPaginated({
      search,
      status,
      sortBy,
      sortOrder,
      page,
      limit,
    });

    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to retrieve participant telemetry records' });
  }
});

router.delete('/attempts/:id', (req: AdminAuthRequest, res: Response) => {
  try {
    const id = String(req.params.id);
    const success = db.resetAttempt(id);
    if (!success) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    return res.status(200).json({ success: true, message: 'Attempt reset successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to reset participant attempt' });
  }
});

// 4. Festival Settings
router.get('/settings', (req: AdminAuthRequest, res: Response) => {
  try {
    const settings = db.getSettings();
    return res.status(200).json(settings);
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

router.post('/settings', (req: AdminAuthRequest, res: Response) => {
  try {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Settings object required' });
    }

    for (const [k, v] of Object.entries(updates)) {
      db.updateSetting(k, String(v));
    }

    return res.status(200).json({ success: true, settings: db.getSettings() });
  } catch (error: any) {
    return res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
