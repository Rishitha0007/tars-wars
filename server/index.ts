import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import quizRoutes from './routes/quiz.js';
import leaderboardRoutes from './routes/leaderboard.js';
import adminRoutes from './routes/admin.js';
import { db } from './db/database.js';
import { runSeed } from './db/seed.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: true,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// Health check / System status
app.get('/api/health', (req, res) => {
  const activeQuestions = db.getActiveQuestionsCount();
  res.json({
    status: 'online',
    system: 'TARS WARS Mission Control',
    activeQuestions,
    timestamp: new Date().toISOString(),
  });
});

// Mount Routes
app.use('/api/quiz', quizRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/admin', adminRoutes);

// Auto-seed if question bank has fewer than 20 questions
try {
  runSeed(false);
} catch (err) {
  console.error('Failed to auto-seed database:', err);
}

// In production, serve the Vite build output
const clientDistPath = path.resolve(process.cwd(), 'dist');
app.use(express.static(clientDistPath));

app.get(/^(?!\/api).*/, (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      // In dev mode when client is served by Vite on 5173
      res.status(200).send('TARS WARS API Server is online. Vite Dev Server is at http://localhost:5173');
    }
  });
});

// Start server
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 TARS WARS Command Node online at http://localhost:${PORT}`);
    console.log(`🌌 Accretion Disk Simulation: Ready`);
    console.log(`🤖 TARS Robot Matrix: Standby (0% Energy)`);
    console.log(`======================================================\n`);
  });
}

export default app;
