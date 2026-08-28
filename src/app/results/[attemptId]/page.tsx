import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import type { ExamAttempt } from '@/types'

interface PageProps {
  params: { attemptId: string }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export default async function ResultsPage({ params }: PageProps) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { data: attempt, error: aErr } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('id', params.attemptId)
    .eq('user_id', user.id)
    .single()

  if (aErr || !attempt) {
    notFound()
  }

  const examAttempt = attempt as ExamAttempt
  const answered = examAttempt.correct_count + examAttempt.incorrect_count
  const score = answered > 0 ? Math.round((examAttempt.correct_count / answered) * 100) : 0
  const passed = score >= 67

  // Fetch attempt answers with question data for domain breakdown
  const { data: answers } = await supabase
    .from('attempt_answers')
    .select(`
      id,
      question_id,
      is_correct,
      selected_option_id,
      questions (
        id,
        question_text,
        domain
      )
    `)
    .eq('attempt_id', params.attemptId)

  // Calculate domain performance
  const domainStats: Record<string, { correct: number; total: number }> = {}
  const missedQuestions: { id: string; domain: string; question_text: string }[] = []

  answers?.forEach((answer) => {
    const q = answer.questions as unknown as { id: string; question_text: string; domain: string } | null
    if (!q) return

    if (!domainStats[q.domain]) {
      domainStats[q.domain] = { correct: 0, total: 0 }
    }
    domainStats[q.domain].total++
    if (answer.is_correct) {
      domainStats[q.domain].correct++
    } else {
      missedQuestions.push({
        id: q.id,
        domain: q.domain,
        question_text: q.question_text,
      })
    }
  })

  // Determine weakest domains
  const domainPerformance = Object.entries(domainStats)
    .map(([domain, stats]) => ({
      domain,
      correct: stats.correct,
      total: stats.total,
      pct: stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0,
    }))
    .sort((a, b) => a.pct - b.pct)

  const weakestDomains = domainPerformance.slice(0, 2)

  return (
    <div>
      <Nav userEmail={user.email} />

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-8">
        {/* Score Hero */}
        <div
          className={`rounded-2xl border p-8 text-center ${
            passed
              ? 'bg-green-900/20 border-green-800/50'
              : 'bg-red-900/20 border-red-800/50'
          }`}
        >
          <div
            className={`inline-flex items-center justify-center w-20 h-20 rounded-full text-2xl font-bold mb-4 ${
              passed ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}
          >
            {score}%
          </div>
          <h1 className="text-2xl font-bold text-gray-100 mb-1">
            {passed ? 'Well done!' : 'Keep studying!'}
          </h1>
          <p className="text-gray-400">
            {passed
              ? 'You met the passing threshold of 67%.'
              : 'The passing score is 67%. You can do it!'}
          </p>
          <div className="flex items-center justify-center gap-8 mt-5">
            <div className="text-center">
              <p className="text-3xl font-bold text-green-400">{examAttempt.correct_count}</p>
              <p className="text-xs text-gray-500 mt-1">Correct</p>
            </div>
            <div className="w-px h-10 bg-surface-4" />
            <div className="text-center">
              <p className="text-3xl font-bold text-red-400">{examAttempt.incorrect_count}</p>
              <p className="text-xs text-gray-500 mt-1">Incorrect</p>
            </div>
            <div className="w-px h-10 bg-surface-4" />
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-300">{answered}</p>
              <p className="text-xs text-gray-500 mt-1">Answered</p>
            </div>
          </div>
          {examAttempt.completed_at && (
            <p className="text-xs text-gray-600 mt-4">{formatDate(examAttempt.completed_at)}</p>
          )}
        </div>

        {/* Domain Performance */}
        {domainPerformance.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-4 p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">Performance by Domain</h2>
            <div className="space-y-4">
              {domainPerformance.map(({ domain, correct, total, pct }) => (
                <div key={domain}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-gray-300">{domain}</span>
                    <span
                      className={`text-sm font-semibold ${
                        pct >= 67 ? 'text-green-400' : pct >= 50 ? 'text-yellow-400' : 'text-red-400'
                      }`}
                    >
                      {correct}/{total} ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-surface-4 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        pct >= 67 ? 'bg-green-500' : pct >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Study Recommendations */}
        {weakestDomains.length > 0 && weakestDomains[0].pct < 100 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-4 p-6">
            <h2 className="text-lg font-semibold text-gray-100 mb-3">Study Recommendations</h2>
            <p className="text-sm text-gray-400 mb-4">Focus on these domains to improve your score:</p>
            <div className="space-y-3">
              {weakestDomains.map(({ domain, pct }) => (
                <div key={domain} className="flex items-center gap-3 p-3 rounded-xl bg-surface-2 border border-surface-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-red-900/30 flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-200">{domain}</p>
                    <p className="text-xs text-gray-500">{pct}% accuracy — needs improvement</p>
                  </div>
                  <form action="/api/exam/start" method="POST">
                    <input type="hidden" name="mode" value="practice" />
                    <input type="hidden" name="domainFilter" value={domain} />
                    <button
                      type="submit"
                      className="px-3 py-1.5 rounded-lg bg-teal-dim border border-teal/40 text-xs font-medium text-teal hover:bg-teal hover:text-brand-dark transition"
                    >
                      Practice
                    </button>
                  </form>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Missed Questions */}
        {missedQuestions.length > 0 && (
          <div className="bg-surface-1 rounded-2xl border border-surface-4 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-100">
                Missed Questions ({missedQuestions.length})
              </h2>
              <Link
                href={`/review?attemptId=${params.attemptId}&filter=incorrect`}
                className="text-sm text-teal hover:text-teal/80 font-medium transition"
              >
                Review all →
              </Link>
            </div>
            <div className="space-y-2">
              {missedQuestions.slice(0, 5).map((q) => (
                <div key={q.id} className="flex items-start gap-3 p-3 rounded-xl bg-surface-2">
                  <svg className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-gray-500 mb-0.5">{q.domain}</p>
                    <p className="text-sm text-gray-300 line-clamp-2">{q.question_text}</p>
                  </div>
                </div>
              ))}
              {missedQuestions.length > 5 && (
                <p className="text-xs text-gray-500 text-center pt-1">
                  +{missedQuestions.length - 5} more missed questions
                </p>
              )}
            </div>
          </div>
        )}

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href={`/review?attemptId=${params.attemptId}&filter=incorrect`}
            className="flex-1 text-center py-3 rounded-xl border border-surface-4 text-sm font-medium text-gray-300 hover:bg-surface-2 hover:text-gray-100 transition"
          >
            Review Missed Questions
          </Link>
          <form action="/api/exam/start" method="POST" className="flex-1">
            <input type="hidden" name="mode" value="full_exam" />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-teal text-brand-dark text-sm font-semibold hover:bg-teal/90 transition"
            >
              Start New Attempt
            </button>
          </form>
        </div>

        <div className="text-center">
          <Link href="/" className="text-sm text-gray-500 hover:text-gray-300 transition">
            ← Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  )
}
