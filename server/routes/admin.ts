import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';
import { requireAdminAuth, generateAdminToken, AdminAuthRequest } from '../middleware/auth.js';
import { SEED_QUESTIONS } from '../db/seed-data.js';

const router = Router();

const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'interstellar2026';

// 1. Organizer Login
router.post('/login', (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }

  if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
    return res.status(401).json({ error: 'Invalid flight command credentials' });
  }

  const token = generateAdminToken(username);
  return res.status(200).json({
    token,
    username,
    role: 'organizer',
    expiresIn: '24h',
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
    const { id } = req.params;
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
    const { id } = req.params;
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
    const { id } = req.params;
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

    // Validate each item
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

// 3. Attempts Oversight
router.get('/attempts', (req: AdminAuthRequest, res: Response) => {
  try {
    const attempts = db.getAllAttempts();
    return res.status(200).json(attempts);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

router.delete('/attempts/:id', (req: AdminAuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const success = db.resetAttempt(id);
    if (!success) {
      return res.status(404).json({ error: 'Attempt not found' });
    }
    return res.status(200).json({ success: true, message: 'Attempt reset successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. Festival Settings
router.get('/settings', (req: AdminAuthRequest, res: Response) => {
  try {
    const settings = db.getSettings();
    return res.status(200).json(settings);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
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
    return res.status(500).json({ error: error.message });
  }
});

export default router;
