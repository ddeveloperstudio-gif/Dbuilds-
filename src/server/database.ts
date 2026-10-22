import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

export type EnquiryStatus = 'new' | 'contacted' | 'in_progress' | 'completed' | 'archived';
export type NotificationStatus = 'pending' | 'sent' | 'failed' | 'not_configured';

export interface EnquiryRecord {
  id: string;
  customerName: string;
  customerEmail: string;
  businessName: string;
  projectType: string;
  budget?: string;
  description: string;
  status: EnquiryStatus;
  createdAt: string;
  updatedAt: string;
  notificationStatus: NotificationStatus;
  notificationError?: string;
  notificationAttempts: number;
  lastNotificationAttemptAt?: string;
  internalNotes?: string;
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'enquiries.json');

// Initialize database directory and file
async function ensureDbExists() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      // File does not exist, initialize empty array
      await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Failed to ensure database directory:', error);
  }
}

// Read all enquiries
export async function getAllEnquiries(): Promise<EnquiryRecord[]> {
  await ensureDbExists();
  try {
    const raw = await fs.readFile(DB_FILE, 'utf-8');
    const records = JSON.parse(raw);
    return Array.isArray(records) ? records : [];
  } catch (error) {
    console.error('Error reading enquiries database:', error);
    return [];
  }
}

// Save all enquiries atomically
async function saveAllEnquiries(enquiries: EnquiryRecord[]): Promise<void> {
  await ensureDbExists();
  const tempFile = `${DB_FILE}.tmp.${Date.now()}`;
  await fs.writeFile(tempFile, JSON.stringify(enquiries, null, 2), 'utf-8');
  await fs.rename(tempFile, DB_FILE);
}

// Generate human-friendly, collision-resistant unique ID
export function generateEnquiryId(): string {
  const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
  const randomSuffix = crypto.randomBytes(3).toString('hex').toUpperCase();
  return `DB-${dateStr}-${randomSuffix}`;
}

// Create new enquiry
export async function createEnquiry(data: {
  customerName: string;
  customerEmail: string;
  businessName?: string;
  projectType: string;
  budget?: string;
  description: string;
}): Promise<EnquiryRecord> {
  const enquiries = await getAllEnquiries();

  const now = new Date().toISOString();
  const newRecord: EnquiryRecord = {
    id: generateEnquiryId(),
    customerName: data.customerName.trim(),
    customerEmail: data.customerEmail.trim().toLowerCase(),
    businessName: (data.businessName || '').trim(),
    projectType: data.projectType.trim(),
    budget: (data.budget || '').trim(),
    description: data.description.trim(),
    status: 'new',
    createdAt: now,
    updatedAt: now,
    notificationStatus: 'pending',
    notificationAttempts: 0,
    internalNotes: '',
  };

  // Prepend newest first
  enquiries.unshift(newRecord);
  await saveAllEnquiries(enquiries);

  return newRecord;
}

// Update an existing enquiry
export async function updateEnquiry(
  id: string,
  updates: Partial<Omit<EnquiryRecord, 'id' | 'createdAt'>>
): Promise<EnquiryRecord | null> {
  const enquiries = await getAllEnquiries();
  const index = enquiries.findIndex((e) => e.id === id);

  if (index === -1) {
    return null;
  }

  const existing = enquiries[index];
  const updatedRecord: EnquiryRecord = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  enquiries[index] = updatedRecord;
  await saveAllEnquiries(enquiries);

  return updatedRecord;
}

// Delete an enquiry
export async function deleteEnquiry(id: string): Promise<boolean> {
  const enquiries = await getAllEnquiries();
  const initialLength = enquiries.length;
  const filtered = enquiries.filter((e) => e.id !== id);

  if (filtered.length === initialLength) {
    return false;
  }

  await saveAllEnquiries(filtered);
  return true;
}

// Find single enquiry by ID
export async function getEnquiryById(id: string): Promise<EnquiryRecord | null> {
  const enquiries = await getAllEnquiries();
  return enquiries.find((e) => e.id === id) || null;
}
