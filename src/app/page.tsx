import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import type { ExamAttempt } from '@/types'

const DOMAINS = [
  'Configuration & Setup',
  'Object Manager & Lightning App Builder',
  'Sales & Marketing Applications',
  'Service & Support Applications',
  'Productivity & Collaboration',
  'Data & Analytics Management',
  'Workflow/Process Automation',
]

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function scorePercent(attempt: ExamAttempt) {
  const answered = attempt.correct_count + attempt.incorrect_count
  if (answered === 0) return 0
  return Math.round((attempt.correct_count / answered) * 100)
}

export default async function DashboardPage() {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch in-progress attempt
  const { data: inProgressAttempts } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'in_progress')
    .order('updated_at', { ascending: false })
    .limit(1)

  const inProgressAttempt: ExamAttempt | null = inProgressAttempts?.[0] ?? null

  // Fetch completed attempts
  const { data: completedAttempts } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('user_id', user.id)
    .eq('status', 'completed')
    .order('completed_at', { ascending: false })
    .limit(10)

  return (
    <div>
      <Nav userEmail={user.email} />

      <main className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-100">
            Welcome back{user.email ? `, ${user.email.split('@')[0]}` : ''}!
          </h1>
          <p className="text-gray-400 mt-1">Ready to ace the Salesforce Admin exam?</p>
        </div>

        {/* Resume / Start */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {inProgressAttempt && (
            <div className="bg-surface-1 rounded-2xl border border-teal/40 p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal bg-teal-dim px-2 py-1 rounded-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-teal animate-pulse" />
                    In Progress
                  </span>
                  <h2 className="text-lg font-semibold text-gray-100 mt-2">Resume Exam</h2>
                </div>
                <span className="text-3xl font-bold text-teal">
                  {inProgressAttempt.current_question_no - 1}/{inProgressAttempt.total_questions}
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-surface-4 mb-4">
                <div
                  className="h-full rounded-full bg-teal transition-all"
                  style={{
                    width: `${((inProgressAttempt.current_question_no - 1) / inProgressAttempt.total_questions) * 100}%`,
                  }}
                />
              </div>
              <p className="text-sm text-gray-400 mb-4">
                Score so far: {inProgressAttempt.correct_count} correct, {inProgressAttempt.incorrect_count} incorrect
              </p>
              <Link
                href={`/exam/${inProgressAttempt.id}`}
                className="block text-center py-3 rounded-xl bg-teal text-brand-dark font-semibold hover:bg-teal/90 transition"
              >
                Resume Exam →
              </Link>
            </div>
          )}

          <div className="bg-surface-1 rounded-2xl border border-surface-4 p-6">
            <div className="w-10 h-10 rounded-xl bg-teal-dim flex items-center justify-center mb-3">
              <svg className="w-5 h-5 text-teal" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-gray-100 mb-1">Full Exam</h2>
            <p className="text-sm text-gray-400 mb-4">65 questions across all domains. Simulates the real exam.</p>
            <form action="/api/exam/start" method="POST">
              <input type="hidden" name="mode" value="full_exam" />
              <StartExamButton label="Start New Full Exam (65 questions)" />
            </form>
          </div>
        </div>

        {/* Practice Mode */}
        <div className="bg-surface-1 rounded-2xl border border-surface-4 p-6">
          <h2 className="text-lg font-semibold text-gray-100 mb-1">Practice Mode</h2>
          <p className="text-sm text-gray-400 mb-4">Focus on a specific domain to target your weak areas.</p>
          <div className="flex flex-wrap gap-2">
            {DOMAINS.map((domain) => (
              <DomainChip key={domain} domain={domain} />
            ))}
          </div>
        </div>

        {/* Past Attempts */}
        {completedAttempts && completedAttempts.length > 0 && (
          <div>
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Past Attempts</h2>
            <div className="space-y-3">
              {completedAttempts.map((attempt: ExamAttempt) => {
                const pct = scorePercent(attempt)
                return (
                  <div
                    key={attempt.id}
                    className="bg-surface-1 rounded-xl border border-surface-4 p-4 flex items-center gap-4"
                  >
                    <div
                      className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm ${
                        pct >= 67
                          ? 'bg-green-900/30 text-green-400'
                          : pct >= 50
                          ? 'bg-yellow-900/30 text-yellow-400'
                          : 'bg-red-900/30 text-red-400'
                      }`}
                    >
                      {pct}%
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-200">
                        {attempt.mode === 'full_exam' ? 'Full Exam' : `Practice: ${attempt.domain_filter ?? 'Mixed'}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {attempt.correct_count}/{attempt.correct_count + attempt.incorrect_count} correct
                        {attempt.completed_at && ` • ${formatDate(attempt.completed_at)}`}
                      </p>
                    </div>
                    <Link
                      href={`/results/${attempt.id}`}
                      className="flex-shrink-0 px-3 py-1.5 rounded-lg bg-surface-3 text-xs font-medium text-gray-300 hover:bg-surface-4 hover:text-gray-100 transition"
                    >
                      Review
                    </Link>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div className="flex flex-wrap gap-3">
          <Link
            href="/review"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-surface-4 text-sm text-gray-300 hover:bg-surface-3 hover:text-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
            Bookmarked questions
          </Link>
          <Link
            href="/references"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface-2 border border-surface-4 text-sm text-gray-300 hover:bg-surface-3 hover:text-gray-100 transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
            Study references
          </Link>
        </div>
      </main>
    </div>
  )
}

// Client component for start exam form button
function StartExamButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="w-full py-3 rounded-xl border border-surface-4 text-sm font-medium text-gray-300 hover:bg-surface-3 hover:text-gray-100 transition"
    >
      {label}
    </button>
  )
}

function DomainChip({ domain }: { domain: string }) {
  return (
    <form action="/api/exam/start" method="POST">
      <input type="hidden" name="mode" value="practice" />
      <input type="hidden" name="domainFilter" value={domain} />
      <button
        type="submit"
        className="px-3 py-1.5 rounded-lg bg-surface-3 border border-surface-4 text-xs font-medium text-gray-300 hover:bg-teal-dim hover:border-teal hover:text-teal transition"
      >
        {domain}
      </button>
    </form>
  )
}
