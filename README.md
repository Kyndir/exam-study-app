# SF Admin Study — Salesforce Administrator Exam Prep

A complete, deployable Next.js 14 + TypeScript + Tailwind CSS + Supabase application for Salesforce Administrator certification exam preparation.

## Features

- 65 practice questions across all 7 Salesforce Admin exam domains
- One-question-at-a-time exam format (no answer peeking)
- Immediate feedback after submission (locked server-side — cannot change answer)
- Color + icon + text indicators (never color-only for accessibility)
- Resume exam where you left off (auto-persisted per question)
- Domain performance breakdown and weak-area recommendations
- Full Review mode (filter by incorrect, bookmarked, or all)
- Personal notes per question
- Question bookmarking
- Reference library (25 Salesforce official references)
- Mobile-first, responsive design

---

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd sf-admin-study
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local` with your Supabase credentials:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_KEY=your_service_role_key
```

> **Important:** The `SUPABASE_SERVICE_KEY` is required for the seed script to bypass Row Level Security (RLS). Get it from your Supabase Dashboard → Settings → API → `service_role` key. Never expose this key in client-side code.

### 3. Auth setup (Supabase Dashboard)

1. Go to **Supabase Dashboard → Authentication → Providers**
2. Ensure **Email** provider is enabled
3. Go to **Authentication → URL Configuration**
4. Set **Site URL** to your deployment URL (e.g., `https://your-app.vercel.app` or `http://localhost:3000` for local)
5. Add the following to **Redirect URLs**:
   - `http://localhost:3000/auth/callback`
   - `https://your-app.vercel.app/auth/callback`

### 4. Seed the database

```bash
SUPABASE_SERVICE_KEY=your_service_role_key npm run seed
```

This seeds:
- 25 references (Salesforce documentation links)
- 65 questions across all 7 exam domains
- 260 answer options (4 per question)
- Question–reference mappings

> Run this only once. Re-running it will skip questions that already exist.

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and sign up for an account.

---

## Deployment (Vercel)

### One-click deploy

1. Push the project to GitHub
2. Import the repository in [Vercel](https://vercel.com)
3. Add the following environment variables in the Vercel project settings:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy

> Do NOT add `SUPABASE_SERVICE_KEY` to Vercel — it is only needed for the local seed script.

### Post-deploy

1. Copy your Vercel deployment URL
2. Add it to Supabase **Authentication → URL Configuration** (Site URL + Redirect URLs)
3. Run the seed locally if you haven't already (only needs to run once against the remote Supabase project)

---

## How progress is saved and resumed

Each answer is saved to the database immediately when the user clicks **Submit Answer**. The API route (`/api/exam/submit-answer`) inserts an `attempt_answers` row with `locked: true`, preventing re-submission.

The `exam_attempts` table tracks `current_question_no`, which advances with each submitted answer. When a user returns to the dashboard, any `in_progress` attempt is shown with a **Resume Exam** button that links to `/exam/[attemptId]`. The exam page starts at the first unanswered question based on the existing `attempt_answers`.

Lock enforcement is **server-side**: even if a client sends a duplicate submit request, the API returns HTTP 409 and the existing answer.

---

## Domain distribution (65 questions)

| Domain | Weight | Questions |
|--------|--------|-----------|
| Configuration & Setup | 20% | 13 (q001–q013) |
| Object Manager & Lightning App Builder | 20% | 13 (q014–q026) |
| Sales & Marketing Applications | 12% | 8 (q027–q034) |
| Service & Support Applications | 11% | 7 (q035–q041) |
| Productivity & Collaboration | 7% | 5 (q042–q046) |
| Data & Analytics Management | 14% | 9 (q047–q055) |
| Workflow/Process Automation | 16% | 10 (q056–q065) |

---

## Testing checklist

### Desktop (1280px+)
- [ ] Sign up with a new email
- [ ] Check confirmation email and activate account
- [ ] Start a Full Exam (65 questions)
- [ ] Select an answer → Submit Answer → verify feedback panel appears
- [ ] Verify Next is disabled until submitted
- [ ] Navigate Previous → verify read-only mode for answered question
- [ ] Close browser tab → reopen → verify Resume Exam shows on dashboard
- [ ] Finish exam → verify Results page with score and domain breakdown
- [ ] Visit Review page, filter by Incorrect
- [ ] Add a note, save, refresh → verify note persists
- [ ] Bookmark a question → filter by Bookmarked in Review
- [ ] Visit References page

### Tablet (768px)
- [ ] All above scenarios
- [ ] Hamburger navigation works
- [ ] Answer choices stack vertically, touch-friendly

### Mobile (375px)
- [ ] All above scenarios
- [ ] No horizontal scrolling
- [ ] Answer buttons at least 56px tall
- [ ] Bottom navigation bar usable with thumbs
- [ ] Feedback panel readable

---

## Issues fixed vs. a static prototype

| Problem | Solution |
|---------|----------|
| No persistence — quiz state lost on refresh | Supabase DB: exam_attempts + attempt_answers |
| No auth — anyone could see any data | Supabase Auth with RLS policies |
| Not mobile-friendly | Mobile-first Tailwind CSS, min-height 56px touch targets |
| Answer could be changed after submission | Server-side lock: 409 on re-submit, locked=true in DB |
| Color-only feedback (accessibility) | Icon + text + border color on every state |
| No real exam structure | 65 questions, 7 domains, difficulty levels, references |
| No study tools | Notes, bookmarks, review mode, weak-domain recommendations |

---

## Project structure

```
src/
├── app/
│   ├── auth/          # Login, Signup, Callback, Logout
│   ├── exam/          # Exam page (server + client components)
│   ├── results/       # Post-exam results and domain breakdown
│   ├── review/        # Reviewed questions with filters
│   ├── references/    # Reference library
│   ├── api/           # API routes (auth-gated)
│   ├── globals.css
│   └── layout.tsx
├── components/        # Nav, ProgressBar, AnswerChoice, FeedbackPanel, etc.
├── lib/supabase/      # Browser, server, and middleware clients
├── types/             # TypeScript interfaces
└── middleware.ts      # Auth enforcement

scripts/
└── seed.ts            # Database seeder (65 questions + 25 references)
```
