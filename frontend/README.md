ReachInbox — Smart Email Scheduling System

A full-stack email scheduling platform built using React, Express, BullMQ, Redis, and PostgreSQL.
It allows users to schedule emails in bulk, process them reliably in the background, enforce rate limits, and recover queued jobs even after server restarts.

The system is designed to behave like a real-world production email pipeline rather than a simple “send email” app.

What This Project Does

With ReachInbox, users can:

Schedule emails for any future time
Queue thousands of emails safely
Prevent duplicate sends
Handle retries automatically
Apply hourly sending limits
Process multiple jobs concurrently
Recover scheduled jobs after crashes or restarts
System Architecture
React Frontend
       │
       ▼
Express Backend API
       │
       ▼
BullMQ Queue (Redis)
       │
       ▼
BullMQ Worker
       │
 ┌─────┴─────┐
 ▼           ▼
PostgreSQL   Redis
Flow of an Email
User schedules an email from the frontend
Backend stores the email job in PostgreSQL
A delayed BullMQ job is created in Redis
When the scheduled time arrives:
Worker picks the job
Checks rate limits
Sends email using Nodemailer
Updates database status
Tech Stack
Layer	Technology
Frontend	React + TypeScript + Vite
Backend	Node.js + Express
Queue System	BullMQ
Queue Storage	Redis
Database	PostgreSQL + Prisma
Email Service	Nodemailer + Ethereal
Authentication	Google OAuth
Backend Setup
Requirements
Node.js 18+
Redis
PostgreSQL
Installation
cd backend
npm install

Create environment variables:

cp .env.example .env

Generate Prisma client and run migrations:

npx prisma generate
npx prisma migrate dev --name init

Run the backend:

npm run dev

Backend runs on:

http://localhost:5000
Frontend Setup
cd frontend
npm install
npm run dev

Frontend runs on:

http://localhost:5173
Frontend Structure
src/
├── components/
├── hooks/
├── layouts/
├── pages/
├── services/
├── types/
└── utils/
Main Modules
Folder	Purpose
components	UI and email components
hooks	Custom React hooks
services	API calls
layouts	Dashboard layout
utils	Helper functions
types	Shared TypeScript types
Redis Setup
Using Docker (Recommended)
docker run -d --name redis -p 6379:6379 redis:alpine

Verify Redis is running:

redis-cli ping

Expected output:

PONG

Environment variables:

REDIS_HOST=localhost
REDIS_PORT=6379
PostgreSQL Setup
Using Docker
docker run -d --name postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=reachinbox \
  -p 5432:5432 \
  postgres:15

Environment variable:

DATABASE_URL=postgresql://postgres:password@localhost:5432/reachinbox

Run migrations:

npx prisma migrate dev --name init
Database Models
User

Stores authenticated users.

Field	Type
id	UUID
name	String
email	String
googleId	String
EmailJob

Stores every scheduled email.

Field	Description
recipientEmail	Receiver email
senderEmail	Sender email
subject	Email subject
body	Email body
scheduledTime	Scheduled send time
sentTime	Actual send time
status	SCHEDULED / SENT / FAILED
retryCount	Retry attempts
How Email Scheduling Works

When a user schedules an email:

delay = scheduledTime - Date.now()

BullMQ stores this delay in Redis.

Once the delay expires:

Job moves to waiting state
Worker picks it up automatically
Email is processed and sent
Worker Lifecycle
Receive Job
    │
    ▼
Fetch Email From DB
    │
    ▼
Check If Already Sent
    │
    ▼
Apply Rate Limits
    │
    ▼
Throttle Send Delay
    │
    ▼
Send Email
    │
 ┌──┴──┐
 ▼     ▼
SENT  FAILED
Persistence & Recovery

One major goal of this project is reliability.

Even if the server crashes:

BullMQ jobs remain stored in Redis
Delayed jobs survive restarts
Worker resumes automatically after reconnecting

Additional protections:

Completed jobs are not removed
Failed jobs remain inspectable
Database acts as the source of truth
Duplicate sends are prevented using status checks
Rate Limiting System

Rate limiting is implemented using Redis counters.

Two Limits Exist
Global Limit
200 emails/hour
Per Sender Limit
100 emails/hour per sender
What Happens When Limits Are Exceeded?

Emails are not lost.

Instead:

Job is rescheduled
Retry is delayed by 1 hour
New BullMQ job is created safely

Example:

await emailQueue.add("send-email", data, {
  delay: 60 * 60 * 1000
});
Concurrency Handling

Worker concurrency is configurable.

WORKER_CONCURRENCY=5

This means:

5 email jobs can run simultaneously
Throttling Between Sends

Even with concurrency enabled, emails are intentionally slowed down to avoid SMTP bursts.

MIN_DELAY_BETWEEN_EMAILS=2000

This adds a 2-second delay before every send operation.

Environment Variables
PORT=5000

DATABASE_URL=postgresql://postgres:password@localhost:5432/reachinbox

REDIS_HOST=localhost
REDIS_PORT=6379

GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

ETHEREAL_USER=your_ethereal_email
ETHEREAL_PASS=your_ethereal_password

WORKER_CONCURRENCY=5
MAX_EMAILS_PER_HOUR=200
MAX_EMAILS_PER_HOUR_PER_SENDER=100
MIN_DELAY_BETWEEN_EMAILS=2000
API Endpoints
Schedule Email
POST /emails/schedule
Get Scheduled Emails
GET /emails/scheduled
Get Sent Emails
GET /emails/sent
Get Single Email
GET /emails/:id
Example Request
{
  "recipientEmail": "john@example.com",
  "subject": "Hello",
  "body": "Hi John!",
  "scheduledTime": "2024-11-10T09:00:00.000Z"
}
Email Preview

Emails are sent using Ethereal SMTP for testing.

After sending, a preview URL is logged:
https://ethereal.email/message/xxxx
