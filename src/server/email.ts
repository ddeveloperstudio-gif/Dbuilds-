import { EnquiryRecord, updateEnquiry } from './database';

export interface EmailSendResult {
  success: boolean;
  messageId?: string;
  error?: string;
  provider: 'resend' | 'simulated' | 'unconfigured';
}

const OWNER_EMAIL = process.env.OWNER_EMAIL || 'professional1511new@gmail.com';
const SENDER_EMAIL = process.env.SENDER_EMAIL || 'DBUILDS 2.0 <onboarding@resend.dev>';
const APP_URL = process.env.APP_URL || 'https://buildbyd.com';

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.RESEND_API_KEY.trim().length > 0);
}

export function getOwnerEmail(): string {
  return OWNER_EMAIL;
}

/**
 * Generates responsive, mobile-friendly HTML email for new client enquiry
 */
function buildEnquiryEmailHtml(enquiry: EnquiryRecord): string {
  const adminUrl = `${APP_URL}/admin`;
  const formattedDate = new Date(enquiry.createdAt).toLocaleString('en-US', {
    timeZone: 'UTC',
    dateStyle: 'full',
    timeStyle: 'medium',
  });

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Enquiry — DBuilds 2.0</title>
  <style>
    body { margin: 0; padding: 0; background-color: #05070C; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #F4F6FA; }
    .wrapper { max-width: 600px; margin: 0 auto; padding: 32px 20px; background-color: #0A0E16; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); }
    .header { border-bottom: 1px solid rgba(255, 255, 255, 0.08); padding-bottom: 20px; margin-bottom: 24px; }
    .brand { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; color: #FFFFFF; }
    .brand-accent { color: #63B3FF; font-family: monospace; font-size: 14px; }
    .kicker { font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #65F4E8; margin-bottom: 8px; font-family: monospace; }
    .headline { font-size: 24px; font-weight: 700; color: #FFFFFF; margin: 0 0 8px 0; }
    .ref-badge { display: inline-block; padding: 4px 10px; background: #101723; border: 1px solid rgba(99, 179, 255, 0.3); border-radius: 4px; font-size: 12px; font-family: monospace; color: #63B3FF; margin-bottom: 24px; }
    .field-card { background-color: #101723; border: 1px solid rgba(255, 255, 255, 0.06); border-radius: 8px; padding: 18px; margin-bottom: 16px; }
    .field-label { font-size: 11px; text-transform: uppercase; letter-spacing: 1.5px; color: #929BAA; margin-bottom: 6px; font-family: monospace; }
    .field-value { font-size: 15px; color: #FFFFFF; font-weight: 500; }
    .field-value a { color: #63B3FF; text-decoration: none; }
    .brief-text { font-size: 14px; line-height: 1.6; color: #E4E8F0; white-space: pre-wrap; }
    .button-row { margin-top: 32px; text-align: center; }
    .primary-btn { display: inline-block; padding: 12px 28px; background-color: #F4F6FA; color: #05070C; text-decoration: none; font-size: 13px; font-weight: 700; border-radius: 6px; text-transform: uppercase; letter-spacing: 1px; font-family: monospace; }
    .footer { margin-top: 36px; padding-top: 20px; border-top: 1px solid rgba(255, 255, 255, 0.06); text-align: center; font-size: 11px; color: #929BAA; font-family: monospace; }
  </style>
</head>
<body>
  <div style="padding: 20px 10px; background-color: #05070C;">
    <div class="wrapper">
      <div class="header">
        <div class="brand">DBUILDS <span class="brand-accent">2.0</span></div>
      </div>

      <div class="kicker">Live Client Transmission</div>
      <h1 class="headline">New Client Enquiry</h1>
      <div class="ref-badge">REF: ${enquiry.id}</div>

      <div class="field-card">
        <div class="field-label">Customer Contact</div>
        <div class="field-value">${enquiry.customerName}</div>
        <div style="font-size: 13px; color: #63B3FF; margin-top: 4px;">
          <a href="mailto:${enquiry.customerEmail}?subject=Re:%20DBuilds%202.0%20Website%20Inquiry%20(${enquiry.id})">${enquiry.customerEmail}</a>
        </div>
      </div>

      ${
        enquiry.businessName
          ? `
      <div class="field-card">
        <div class="field-label">Business / Brand Name</div>
        <div class="field-value">${enquiry.businessName}</div>
      </div>`
          : ''
      }

      <div class="field-card">
        <div class="field-label">Project Scope & Approximate Budget</div>
        <div class="field-value">${enquiry.projectType} ${enquiry.budget ? `· Budget: ${enquiry.budget}` : ''}</div>
      </div>

      <div class="field-card">
        <div class="field-label">Project Description & Requirements</div>
        <div class="brief-text">${enquiry.description}</div>
      </div>

      <div class="field-card">
        <div class="field-label">Transmission Timestamp</div>
        <div style="font-size: 13px; color: #929BAA; font-family: monospace;">${formattedDate} (UTC)</div>
      </div>

      <div class="button-row">
        <a href="${adminUrl}" class="primary-btn">Open Private Admin CRM</a>
      </div>

      <div class="footer">
        DBUILDS 2.0 · Ideas into Digital Reality<br>
        Direct reply will route to ${enquiry.customerEmail}
      </div>
    </div>
  </div>
</body>
</html>
  `.trim();
}

/**
 * Builds plain text fallback for email clients
 */
function buildEnquiryEmailText(enquiry: EnquiryRecord): string {
  return `
NEW CLIENT ENQUIRY — DBUILDS 2.0
Reference ID: ${enquiry.id}
Time: ${enquiry.createdAt}

CUSTOMER DETAILS:
- Name: ${enquiry.customerName}
- Email: ${enquiry.customerEmail}
- Business: ${enquiry.businessName || 'Not specified'}

PROJECT DETAILS:
- Project Type: ${enquiry.projectType}
- Budget: ${enquiry.budget || 'Not specified'}

PROJECT BRIEF:
${enquiry.description}

Access your Admin CRM: ${APP_URL}/admin
Reply to customer: mailto:${enquiry.customerEmail}
  `.trim();
}

/**
 * Sends notification email to owner via Resend API or records status
 */
export async function sendOwnerNotification(enquiry: EnquiryRecord): Promise<EmailSendResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();

  // If no API key configured in env
  if (!apiKey) {
    const errorMsg = 'RESEND_API_KEY is not set in environment secrets. Email notification recorded as not configured.';
    console.info(`[Email Notification] Notice for ${enquiry.id}: ${errorMsg}`);

    await updateEnquiry(enquiry.id, {
      notificationStatus: 'not_configured',
      notificationError: errorMsg,
      notificationAttempts: (enquiry.notificationAttempts || 0) + 1,
      lastNotificationAttemptAt: new Date().toISOString(),
    });

    return {
      success: false,
      error: errorMsg,
      provider: 'unconfigured',
    };
  }

  try {
    const payload = {
      from: SENDER_EMAIL,
      to: [OWNER_EMAIL],
      reply_to: enquiry.customerEmail,
      subject: `New Client Enquiry — DBuilds 2.0 [${enquiry.customerName}]`,
      html: buildEnquiryEmailHtml(enquiry),
      text: buildEnquiryEmailText(enquiry),
    };

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const resData: any = await response.json();

    if (!response.ok) {
      const errorDetail = resData.message || resData.error || `HTTP ${response.status} from Resend API`;
      console.error(`[Email Notification] Resend API error for ${enquiry.id}:`, errorDetail);

      await updateEnquiry(enquiry.id, {
        notificationStatus: 'failed',
        notificationError: errorDetail,
        notificationAttempts: (enquiry.notificationAttempts || 0) + 1,
        lastNotificationAttemptAt: new Date().toISOString(),
      });

      return {
        success: false,
        error: errorDetail,
        provider: 'resend',
      };
    }

    // Success
    console.info(`[Email Notification] Successfully sent notification to ${OWNER_EMAIL} for ${enquiry.id} (Resend ID: ${resData.id})`);

    await updateEnquiry(enquiry.id, {
      notificationStatus: 'sent',
      notificationError: undefined,
      notificationAttempts: (enquiry.notificationAttempts || 0) + 1,
      lastNotificationAttemptAt: new Date().toISOString(),
    });

    return {
      success: true,
      messageId: resData.id,
      provider: 'resend',
    };
  } catch (err: any) {
    const errMsg = err?.message || 'Network error attempting to send transactional email.';
    console.error(`[Email Notification] Exception sending notification for ${enquiry.id}:`, errMsg);

    await updateEnquiry(enquiry.id, {
      notificationStatus: 'failed',
      notificationError: errMsg,
      notificationAttempts: (enquiry.notificationAttempts || 0) + 1,
      lastNotificationAttemptAt: new Date().toISOString(),
    });

    return {
      success: false,
      error: errMsg,
      provider: 'resend',
    };
  }
}
