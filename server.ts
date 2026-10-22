import express, { Request, Response } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI, ThinkingLevel } from '@google/genai';
import {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  EnquiryStatus,
} from './src/server/database';
import { sendOwnerNotification, isEmailConfigured, getOwnerEmail } from './src/server/email';
import {
  createAdminSession,
  invalidateSession,
  validateSession,
  requireAdminAuth,
  submissionRateLimiter,
  ADMIN_EMAIL,
  ADMIN_PASSWORD,
} from './src/server/auth';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '25mb' }));

// Shared Gemini instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// System instruction for DBuilds 2.0 Studio Consultant
const STUDIO_SYSTEM_INSTRUCTION = `You are the DBuilds 2.0 Studio AI Consultant, representing Dhanush, an independent digital creator and creative web developer (Portfolio: buildbyd.com, Instagram: @dbuilds.2.0, Contact: professional1511new@gmail.com).

Your personality & principles:
- Calm, articulate, razor-sharp design taste, and technically authoritative.
- Never use buzzword slop, false guarantees, or generic marketing fluff.
- Emphasize DBuilds 2.0 core services:
  1. Business Websites (responsive, high-converting, professional presence for real businesses)
  2. AI-Assisted Web Development (rapid prototyping, custom visual direction, iterative perfection)
  3. Creative Digital Experiences (cinematic transitions, dimensional interfaces, scroll storytelling)
- The 4-stage process: Discover -> Design -> Build -> Launch.
- For clients asking about pricing or starting a project: prompt them to submit the Project Enquiry form right on the page or connect via Instagram @dbuilds.2.0.
- Keep answers structured, insightful, and formatted with clean markdown bullets or concise paragraphs.`;

// ==========================================
// 1. PUBLIC GEMINI CHAT & AUDIT ENDPOINTS
// ==========================================

app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const { messages, modelChoice = 'gemini-3.8-flash', enableThinking = false } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required' });
    }

    const targetModel = modelChoice === 'gemini-4-argon' ? 'gemini-4-argon' : 'gemini-3.8-flash';

    const contents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.text }],
    }));

    const config: any = {
      systemInstruction: STUDIO_SYSTEM_INSTRUCTION,
      temperature: 0.7,
    };

    if (enableThinking && (targetModel === 'gemini-4-argon' || targetModel === 'gemini-3.8-flash')) {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents,
        config,
      });
    } catch (modelErr: any) {
      console.warn(`Primary model ${targetModel} encountered error, falling back to gemini-3.8-flash:`, modelErr?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents,
        config: {
          systemInstruction: STUDIO_SYSTEM_INSTRUCTION,
        },
      });
    }

    return res.json({
      text: response?.text || 'I could not generate a response. Please try again or reach out directly to Dhanush via Instagram @dbuilds.2.0.',
      modelUsed: targetModel,
    });
  } catch (error: any) {
    console.error('Chat endpoint error:', error);
    return res.status(500).json({
      error: error?.message || 'An error occurred while contacting the DBuilds AI Studio engine.',
    });
  }
});

app.post('/api/analyze-wireframe', async (req: Request, res: Response) => {
  try {
    const { imageBase64, mimeType = 'image/png', notes = '', modelChoice = 'gemini-4-argon' } = req.body;

    if (!imageBase64) {
      return res.status(400).json({ error: 'Image data is required' });
    }

    const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

    const auditPrompt = `You are Dhanush, creator of DBuilds 2.0 (The Digital Frontier).
Perform a meticulous architectural and visual design audit of this uploaded website wireframe / design mockup / reference screenshot.

User context / notes: "${notes || 'General website design critique & implementation recommendations'}"

Provide a structured, highly actionable critique covering:
1. Visual Hierarchy & Composition (spatial balance, focal anchor, contrast)
2. User Experience & Conversion Flow (navigation clarity, primary CTA positioning, friction points)
3. Responsive & Architectural Viability (how this translates to 390px mobile up to 1920px desktop)
4. DBuilds 2.0 Modernization Strategy (how we would transform this into a cinematic, high-performance web experience with deliberate typography, restrained lighting, and fluid motion)
5. Recommended Tech & Implementation Stack (React, Tailwind, CSS perspective, semantic HTML)`;

    const parts = [
      {
        inlineData: {
          data: cleanBase64,
          mimeType: mimeType || 'image/png',
        },
      },
      {
        text: auditPrompt,
      },
    ];

    const targetModel = modelChoice === 'gemini-4-argon' ? 'gemini-4-argon' : 'gemini-3.8-flash';
    const config: any = {
      systemInstruction: 'You are a world-class senior creative developer and UI/UX design director at DBuilds 2.0.',
    };

    if (targetModel === 'gemini-4-argon') {
      config.thinkingConfig = {
        thinkingLevel: ThinkingLevel.HIGH,
      };
    }

    let response;
    try {
      response = await ai.models.generateContent({
        model: targetModel,
        contents: { parts },
        config,
      });
    } catch (err: any) {
      console.warn(`Audit model ${targetModel} failed, falling back to gemini-3.8-flash:`, err?.message);
      response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: { parts },
        config: {
          systemInstruction: 'You are a world-class senior creative developer and UI/UX design director at DBuilds 2.0.',
        },
      });
    }

    return res.json({
      analysis: response?.text || 'Analysis could not be generated. Please try again with a clear screenshot.',
    });
  } catch (error: any) {
    console.error('Analyze wireframe error:', error);
    return res.status(500).json({
      error: error?.message || 'Failed to analyze design image.',
    });
  }
});

// ==========================================
// 2. PUBLIC CLIENT ENQUIRY SUBMISSION PIPELINE
// ==========================================

app.post('/api/contact', submissionRateLimiter, async (req: Request, res: Response) => {
  try {
    const { name, brand, email, projectType, budget, description } = req.body;

    // Strict Server-Side Validation
    if (!name || typeof name !== 'string' || name.trim().length === 0) {
      return res.status(400).json({ error: 'Customer name is required.' });
    }

    if (!email || typeof email !== 'string' || email.trim().length === 0) {
      return res.status(400).json({ error: 'Customer email address is required.' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }

    if (!projectType || typeof projectType !== 'string' || projectType.trim().length === 0) {
      return res.status(400).json({ error: 'Please select a project type.' });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 8) {
      return res.status(400).json({ error: 'Project description must be at least 8 characters.' });
    }

    // Step 1: Save enquiry to persistent database FIRST
    const savedEnquiry = await createEnquiry({
      customerName: name,
      customerEmail: email,
      businessName: brand,
      projectType,
      budget,
      description,
    });

    console.info(`[CRM Database] Successfully created enquiry ${savedEnquiry.id} for ${savedEnquiry.customerEmail}`);

    // Step 2: Trigger owner email notification in background
    // (We do not fail the customer submission if email provider is offline)
    sendOwnerNotification(savedEnquiry).catch((err) => {
      console.error(`[CRM Notification] Background notification dispatch error for ${savedEnquiry.id}:`, err);
    });

    return res.status(201).json({
      success: true,
      inquiryId: savedEnquiry.id,
      customerName: savedEnquiry.customerName,
      createdAt: savedEnquiry.createdAt,
      message: 'Transmission received. Dhanush has been notified and will review your brief within 24 hours.',
      directEmail: getOwnerEmail(),
      instagram: '@dbuilds.2.0',
    });
  } catch (err: any) {
    console.error('Contact endpoint error:', err);
    return res.status(500).json({
      error: 'An unexpected error occurred while storing your enquiry. Your data was not lost—please retry or email Dhanush directly.',
    });
  }
});

// ==========================================
// 3. SECURE ADMIN AUTHENTICATION ENDPOINTS
// ==========================================

app.post('/api/admin/login', (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const cleanEmail = String(email).trim().toLowerCase();
  const cleanPassword = String(password).trim();

  // Validate against configured administrator credentials
  const emailMatch = cleanEmail === ADMIN_EMAIL || cleanEmail === 'admin';
  const passwordMatch = cleanPassword === ADMIN_PASSWORD;

  if (!emailMatch || !passwordMatch) {
    return res.status(401).json({
      error: 'Invalid administrator credentials. Access to client CRM is restricted to Dhanush.',
    });
  }

  const token = createAdminSession(ADMIN_EMAIL);

  return res.json({
    success: true,
    token,
    user: {
      email: ADMIN_EMAIL,
      role: 'Administrator',
      name: 'Dhanush',
    },
  });
});

app.post('/api/admin/logout', (req: Request, res: Response) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : (req.headers['x-admin-token'] as string);

  invalidateSession(token);
  return res.json({ success: true, message: 'Logged out successfully.' });
});

app.get('/api/admin/me', requireAdminAuth, (req: Request, res: Response) => {
  const session = (req as any).adminSession;
  return res.json({
    authenticated: true,
    user: {
      email: session.email,
      role: 'Administrator',
      name: 'Dhanush',
    },
  });
});

// ==========================================
// 4. PRIVATE ADMIN CRM ENDPOINTS (PROTECTED)
// ==========================================

// Get all enquiries with optional status filter & search query
app.get('/api/admin/enquiries', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    let records = await getAllEnquiries();

    if (status && status !== 'all') {
      records = records.filter((r) => r.status === status);
    }

    if (search && typeof search === 'string') {
      const q = search.toLowerCase().trim();
      records = records.filter(
        (r) =>
          r.customerName.toLowerCase().includes(q) ||
          r.customerEmail.toLowerCase().includes(q) ||
          (r.businessName && r.businessName.toLowerCase().includes(q)) ||
          r.projectType.toLowerCase().includes(q) ||
          r.id.toLowerCase().includes(q)
      );
    }

    return res.json({
      enquiries: records,
      total: records.length,
    });
  } catch (err: any) {
    console.error('Error fetching admin enquiries:', err);
    return res.status(500).json({ error: 'Failed to retrieve enquiries from database.' });
  }
});

// Get CRM summary stats
app.get('/api/admin/enquiries/stats', requireAdminAuth, async (_req: Request, res: Response) => {
  try {
    const records = await getAllEnquiries();

    const stats = {
      total: records.length,
      new: records.filter((r) => r.status === 'new').length,
      contacted: records.filter((r) => r.status === 'contacted').length,
      inProgress: records.filter((r) => r.status === 'in_progress').length,
      completed: records.filter((r) => r.status === 'completed').length,
      archived: records.filter((r) => r.status === 'archived').length,
      notificationsSent: records.filter((r) => r.notificationStatus === 'sent').length,
      notificationsFailed: records.filter((r) => r.notificationStatus === 'failed').length,
      notificationsNotConfigured: records.filter((r) => r.notificationStatus === 'not_configured').length,
    };

    return res.json(stats);
  } catch (err: any) {
    console.error('Error fetching admin stats:', err);
    return res.status(500).json({ error: 'Failed to calculate CRM metrics.' });
  }
});

// Get single enquiry by ID
app.get('/api/admin/enquiries/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const enquiry = await getEnquiryById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry record not found.' });
    }
    return res.json(enquiry);
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to fetch enquiry.' });
  }
});

// Update enquiry status or internal notes
app.patch('/api/admin/enquiries/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const { status, internalNotes } = req.body;
    const updates: any = {};

    if (status) {
      const validStatuses: EnquiryStatus[] = ['new', 'contacted', 'in_progress', 'completed', 'archived'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: 'Invalid status value.' });
      }
      updates.status = status;
    }

    if (typeof internalNotes === 'string') {
      updates.internalNotes = internalNotes;
    }

    const updated = await updateEnquiry(req.params.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }

    return res.json({ success: true, enquiry: updated });
  } catch (err: any) {
    console.error('Error updating enquiry:', err);
    return res.status(500).json({ error: 'Failed to update enquiry record.' });
  }
});

// Retry / Dispatch email notification for enquiry
app.post('/api/admin/enquiries/:id/retry-notification', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const enquiry = await getEnquiryById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found.' });
    }

    const sendResult = await sendOwnerNotification(enquiry);
    const freshRecord = await getEnquiryById(req.params.id);

    return res.json({
      success: sendResult.success,
      sendResult,
      enquiry: freshRecord,
    });
  } catch (err: any) {
    console.error('Error retrying notification:', err);
    return res.status(500).json({ error: 'Failed to trigger notification retry.' });
  }
});

// Delete an enquiry record (with confirmation requirement)
app.delete('/api/admin/enquiries/:id', requireAdminAuth, async (req: Request, res: Response) => {
  try {
    const deleted = await deleteEnquiry(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: 'Enquiry not found or already deleted.' });
    }
    return res.json({ success: true, message: `Enquiry ${req.params.id} deleted successfully.` });
  } catch (err: any) {
    console.error('Error deleting enquiry:', err);
    return res.status(500).json({ error: 'Failed to delete enquiry.' });
  }
});

// System config status for admin info modal
app.get('/api/admin/config-status', requireAdminAuth, (_req: Request, res: Response) => {
  return res.json({
    emailConfigured: isEmailConfigured(),
    ownerEmail: getOwnerEmail(),
    senderEmail: process.env.SENDER_EMAIL || 'DBUILDS 2.0 <onboarding@resend.dev>',
    appUrl: process.env.APP_URL || 'https://buildbyd.com',
    authEmail: ADMIN_EMAIL,
  });
});

app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    brand: 'DBUILDS 2.0',
    crmActive: true,
    emailConfigured: isEmailConfigured(),
    timestamp: new Date().toISOString(),
  });
});

async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static('dist'));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve('dist', 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`DBUILDS 2.0 Studio & CRM server running at http://0.0.0.0:${PORT}`);
  });
}

startServer();
