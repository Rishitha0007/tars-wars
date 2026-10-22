import { Router, Request, Response } from 'express';
import { db } from '../db/database.js';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  try {
    const leaderboard = db.getLeaderboard();
    const settings = db.getSettings();

    return res.status(200).json({
      leaderboard,
      displayMode: settings.leaderboard_display_mode || 'best',
      isMasked: settings.mask_roll_numbers === 'true',
      totalParticipants: leaderboard.length,
      updatedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Failed to fetch leaderboard' });
  }
});

export default router;
