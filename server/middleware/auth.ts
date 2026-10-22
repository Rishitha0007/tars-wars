import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'tars_wars_super_secret_quantum_key_2026_matrix';

export interface AdminAuthRequest extends Request {
  adminUser?: { username: string; role: string };
}

export function requireAdminAuth(req: AdminAuthRequest, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized: Admin authentication token required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { username: string; role: string };
    req.adminUser = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid or expired session token' });
  }
}

export function generateAdminToken(username: string): string {
  return jwt.sign({ username, role: 'organizer' }, JWT_SECRET, { expiresIn: '24h' });
}
