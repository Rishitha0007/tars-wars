import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

// 1. Participant entry: Start or resume quiz attempt
router.post('/start', (req: Request, res: Response) => {
  try {
    const { rollNumber } = req.body;
    if (!rollNumber || typeof rollNumber !== 'string') {
      return res.status(400).json({ error: 'Roll number is required to access the TARS interface' });
    }

    const trimmed = rollNumber.trim().toUpperCase();
    if (trimmed.length < 2 || trimmed.length > 35) {
      return res.status(400).json({ error: 'Roll number must be between 2 and 35 alphanumeric characters' });
    }

    // Alphanumeric + hyphens/underscores/slashes allowed for university formats (e.g., CS24-102, 21BCE0491)
    const validPattern = /^[A-Z0-9\-_/]+$/;
    if (!validPattern.test(trimmed)) {
      return res.status(400).json({ error: 'Roll number contains invalid characters. Use letters, numbers, hyphens or slashes.' });
    }

    const metadata = {
      ip: req.ip || req.headers['x-forwarded-for'],
      userAgent: req.headers['user-agent'],
    };

    const result = db.startQuizAttempt(trimmed, metadata);
    return res.status(200).json({
      attemptId: result.attempt.id,
      rollNumber: result.attempt.roll_number,
      status: result.attempt.status,
      resumed: result.resumed,
      score: result.attempt.score,
      energyPercentage: result.attempt.energy_percentage,
      currentQuestion: result.currentQuestion,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to initialize TARS WARS mission' });
  }
});

// 2. Get current attempt state and active question
router.get('/attempt/:attemptId', (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const attempt = db.getAttemptById(attemptId);
    if (!attempt) {
      return res.status(404).json({ error: 'Mission attempt not found' });
    }

    if (attempt.status === 'completed') {
      return res.status(200).json({
        attemptId: attempt.id,
        rollNumber: attempt.roll_number,
        status: attempt.status,
        score: attempt.score,
        energyPercentage: attempt.energy_percentage,
        isCompleted: true,
      });
    }

    const currentQuestion = db.getCurrentQuestionDetails(attemptId);
    return res.status(200).json({
      attemptId: attempt.id,
      rollNumber: attempt.roll_number,
      status: attempt.status,
      score: attempt.score,
      energyPercentage: attempt.energy_percentage,
      currentQuestion,
      isCompleted: false,
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Error fetching attempt state' });
  }
});

// 3. Submit an answer for the current question
router.post('/attempt/:attemptId/submit', (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const { sequenceNumber, selectedOptionIndex } = req.body;

    if (typeof sequenceNumber !== 'number' || typeof selectedOptionIndex !== 'number') {
      return res.status(400).json({ error: 'Sequence number and selected option index are required' });
    }

    if (selectedOptionIndex < 0 || selectedOptionIndex > 3) {
      return res.status(400).json({ error: 'Selected option index must be between 0 and 3' });
    }

    const result = db.submitAnswer(attemptId, sequenceNumber, selectedOptionIndex);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to submit answer' });
  }
});

// 4. Record question timeout
router.post('/attempt/:attemptId/timeout', (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const { sequenceNumber } = req.body;

    if (typeof sequenceNumber !== 'number') {
      return res.status(400).json({ error: 'Sequence number is required' });
    }

    const result = db.handleQuestionTimeout(attemptId, sequenceNumber);
    return res.status(200).json(result);
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to process timeout' });
  }
});

// 5. Advance to the next question (called during/after paper rocket transition)
router.post('/attempt/:attemptId/next', (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const result = db.advanceToNextQuestion(attemptId);
    return res.status(200).json({
      success: true,
      nextQuestion: result,
      completed: result.completed || false,
    });
  } catch (error: any) {
    return res.status(400).json({ error: error.message || 'Failed to advance question sequence' });
  }
});

// 6. Get final mission results and debriefing
router.get('/attempt/:attemptId/results', (req: Request, res: Response) => {
  try {
    const { attemptId } = req.params;
    const results = db.getAttemptResults(attemptId);
    if (!results) {
      return res.status(404).json({ error: 'Results not found for this attempt' });
    }

    return res.status(200).json(results);
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to retrieve mission results' });
  }
});

export default router;
