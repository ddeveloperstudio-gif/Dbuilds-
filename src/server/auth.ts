import { Request, Response, NextFunction } from 'express';
import crypto from 'crypto';

interface AdminSession {
  token: string;
  email: string;
  createdAt: number;
  expiresAt: number;
}

// Active session store in memory
const activeSessions = new Map<string, AdminSession>();

// Rate limiter store for IP addresses on public form
interface RateLimitEntry {
  count: number;
  firstAttempt: number;
}
const rateLimitMap = new Map<string, RateLimitEntry>();

// Configuration
export const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || process.env.OWNER_EMAIL || 'professional1511new@gmail.com').toLowerCase().trim();
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'dbuilds2026'; // Configurable via .env

const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

// Create new authenticated admin session
export function createAdminSession(email: string): string {
  const token = crypto.randomBytes(32).toString('hex');
  const now = Date.now();

  activeSessions.set(token, {
    token,
    email: email.toLowerCase(),
    createdAt: now,
    expiresAt: now + SESSION_DURATION_MS,
  });

  return token;
}

// Validate session token
export function validateSession(token: string | undefined): AdminSession | null {
  if (!token) return null;

  const session = activeSessions.get(token);
  if (!session) return null;

  if (Date.now() > session.expiresAt) {
    activeSessions.delete(token);
    return null;
  }

  return session;
}

// Invalidate session (logout)
export function invalidateSession(token: string | undefined): boolean {
  if (!token) return false;
  return activeSessions.delete(token);
}

// Express Middleware: Require Admin Authentication
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);

  const session = validateSession(token);
  if (!session) {
    return res.status(401).json({
      error: 'Unauthorized: Valid administrator session required to access customer CRM data.',
    });
  }

  (req as any).adminSession = session;
  next();
}

// Express Middleware: Public submission rate limiting (Max 5 submissions per 10 minutes per IP)
export function submissionRateLimiter(req: Request, res: Response, next: NextFunction) {
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const windowMs = 10 * 60 * 1000; // 10 minutes
  const maxSubmissions = 6;

  const entry = rateLimitMap.get(clientIp);

  if (!entry) {
    rateLimitMap.set(clientIp, { count: 1, firstAttempt: now });
    return next();
  }

  if (now - entry.firstAttempt > windowMs) {
    // Window expired, reset
    rateLimitMap.set(clientIp, { count: 1, firstAttempt: now });
    return next();
  }

  if (entry.count >= maxSubmissions) {
    return res.status(429).json({
      error: 'Submission rate limit reached. Please wait a few minutes before submitting another enquiry, or contact Dhanush directly via Instagram @dbuilds.2.0.',
    });
  }

  entry.count += 1;
  next();
}
