# DBUILDS 2.0 — Private Client CRM & Live Enquiry System Setup Guide

This guide documents the architecture, database persistence, email notifications, and administrative dashboard implemented for **Dhanush** (`@dbuilds.2.0`, `buildbyd.com`).

---

## 1. System Architecture Overview

The system consists of three connected, production-grade components:

1. **Public Client Enquiry Form (`src/components/Contact.tsx`)**:
   - Captures customer name, email, business/brand name, project type, budget, and description.
   - Client-side validation + duplicate submission prevention.
   - Submits to `/api/contact` on the server.
   - Displays real server-generated reference ID (`DB-YYMMDD-XXXX`) upon confirmation.
   - Retains form inputs if a submission error occurs.

2. **Persistent Database & Pipeline (`src/server/database.ts` & `server.ts`)**:
   - Server-side validation, sanitization, and rate-limiting (max 6 submissions per 10 minutes per IP).
   - Atomic database persistence in `./data/enquiries.json` with temporary-file swapping for crash-safe durability.
   - Tracks pipeline stages: `new`, `contacted`, `in_progress`, `completed`, `archived`.
   - Tracks notification statuses: `pending`, `sent`, `failed`, `not_configured`.
   - Server-side access control: only authenticated administrators can read, update, or delete enquiry records. Public visitors cannot query the CRM.

3. **Private Admin CRM Dashboard (`/admin` / `src/components/AdminDashboard.tsx`)**:
   - Secured with session token authentication (session validity: 7 days).
   - Real-time metrics: Total leads, New enquiries, Contacted, In progress, Completed.
   - Searchable by name, email, brand, scope, or reference ID.
   - Status filtering tabs.
   - Detail drawer with quick email reply, email copy, full details copy, status selector, private internal notes, and notification retry.
   - Live polling with arrival banner and optional audio chime toggle.

---

## 2. Administrator Login Credentials

Navigate to `/admin` in the browser or click **Admin CRM** in the website footer.

- **Admin Email**: `professional1511new@gmail.com` (or `admin`)
- **Default Password**: `dbuilds2026` (changeable in `.env` via `ADMIN_PASSWORD`)

---

## 3. Email Notification Configuration (Resend)

The system is architected to notify Dhanush's phone/inbox immediately whenever a client submits an enquiry.

### Free Tier Details
- Provider: **Resend** ([https://resend.com](https://resend.com))
- Free tier: **3,000 emails/month** (100 emails/day), 100% free with no credit card required.

### Setup Steps:
1. Sign up at [resend.com](https://resend.com).
2. Go to **API Keys** and generate an API key (starts with `re_...`).
3. In AI Studio **Settings > Secrets** (or your server `.env`), set:
   ```env
   RESEND_API_KEY="re_your_api_key_here"
   OWNER_EMAIL="professional1511new@gmail.com"
   SENDER_EMAIL="DBUILDS 2.0 <onboarding@resend.dev>"
   ```
4. **Domain Verification (Optional / Recommended)**:
   - To send emails from `notifications@buildbyd.com`, add your domain `buildbyd.com` in Resend and add the provided DNS DKIM/SPF records.
   - Then update `SENDER_EMAIL="DBUILDS 2.0 <notifications@buildbyd.com>"`.

### Failure Resilience:
- If `RESEND_API_KEY` is not yet set, the customer submission is **never lost**. It is safely saved to the database and marked as `not_configured`.
- Once configured, Dhanush can open any enquiry in the Admin CRM and click **"Retry Notification"** to dispatch the notification email immediately.
