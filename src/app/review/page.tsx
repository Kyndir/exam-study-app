import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import Nav from '@/components/Nav'
import ReviewNoteEditor from '@/components/ReviewNoteEditor'

interface ReviewPageProps {
  searchParams: {
    attemptId?: string
    filter?: 'incorrect' | 'bookmarked' | 'all'
    domain?: string
  }
}

export default async function ReviewPage({ searchParams }: ReviewPageProps) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  const { attemptId, filter = 'all', domain } = searchParams

  // Base query: get attempt_answers with full question + option data
  let query = supabase
    .from('attempt_answers')
    .select(`
      id,
      question_id,
      is_correct,
      selected_option_id,
      correct_option_id,
      attempt_id,
      questions (
        id,
        question_text,
        domain,
        difficulty,
        explanation,
        answer_options (
          id,
          question_id,
          option_letter,
          option_text,
          is_correct,
          why_wrong
        ),
        question_references (
          references (
            id,
            title,
            publisher,
            url
          )
        )
      )
    `)

  if (attemptId) {
    // Filter by specific attempt (must belong to user via attempt)
    query = query.eq('attempt_id', attemptId)
  } else {
    // All attempts for this user
    const { data: userAttempts } = await supabase
      .from('exam_attempts')
      .select('id')
      .eq('user_id', user.id)

    const attemptIds = userAttempts?.map((a) => a.id) ?? []
    if (attemptIds.length === 0) {
      return (
        <div>
          <Nav userEmail={user.email} />
          <main className="max-w-3xl mx-auto px-4 py-12 text-center">
            <p className="text-gray-400">No exam attempts yet. Start an exam to review questions.</p>
            <Link href="/" className="mt-4 inline-block text-teal hover:underline">Back to Dashboard</Link>
          </main>
        </div>
      )
    }
    query = query.in('attempt_id', attemptIds)
  }

  if (filter === 'incorrect') {
    query = query.eq('is_correct', false)
  }

  const { data: answers, error } = await query

  if (error) {
    return (
      <div>
        <Nav userEmail={user.email} />
        <main className="max-w-3xl mx-auto px-4 py-12 text-center">
          <p className="text-red-400">Failed to load review data.</p>
        </main>
      </div>
    )
  }

  // Fetch bookmarks
  const { data: bookmarks } = await supabase
    .from('bookmarks')
    .select('question_id')
    .eq('user_id', user.id)

  const bookmarkedIds = new Set(bookmarks?.map((b) => b.question_id) ?? [])

  // Fetch notes
  const { data: notes } = await supabase
    .from('question_notes')
    .select('question_id, note_text')
    .eq('user_id', user.id)

  const notesMap: Record<string, string> = {}
  notes?.forEach((n) => {
    notesMap[n.question_id] = n.note_text
  })

  // Deduplicate by question_id (in case same question answered in multiple attempts)
  const seen = new Set<string>()
  let reviewItems = (answers ?? []).filter((a) => {
    const q = a.questions as unknown as { id: string } | null
    if (!q) return false
    if (seen.has(q.id)) return false
    seen.add(q.id)
    return true
  })

  if (filter === 'bookmarked') {
    reviewItems = reviewItems.filter((a) => {
      const q = a.questions as unknown as { id: string } | null
      return q && bookmarkedIds.has(q.id)
    })
  }

  if (domain) {
    reviewItems = reviewItems.filter((a) => {
      const q = a.questions as unknown as { domain: string } | null
      return q?.domain === domain
    })
  }

  const filterLabels: Record<string, string> = {
    all: 'All Reviewed Questions',
    incorrect: 'Missed Questions',
    bookmarked: 'Bookmarked Questions',
  }

  return (
    <div>
      <Nav userEmail={user.email} />

      <main className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold text-gray-100">{filterLabels[filter]}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{reviewItems.length} questions</p>
          </div>
          <div className="flex gap-2">
            {['all', 'incorrect', 'bookmarked'].map((f) => (
              <Link
                key={f}
                href={`/review?${attemptId ? `attemptId=${attemptId}&` : ''}filter=${f}`}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                  filter === f
                    ? 'bg-teal-dim text-teal border border-teal/40'
                    : 'bg-surface-2 text-gray-400 border border-surface-4 hover:text-gray-200'
                }`}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Link>
            ))}
          </div>
        </div>

        {reviewItems.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500">No questions match this filter.</p>
            <Link href="/" className="mt-4 inline-block text-teal hover:underline text-sm">
              Back to Dashboard
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {reviewItems.map((answer) => {
              const q = answer.questions as unknown as {
                id: string
                question_text: string
                domain: string
                difficulty: string
                explanation: string
                answer_options: Array<{
                  id: number
                  option_letter: string
                  option_text: string
                  is_correct: boolean
                  why_wrong: string | null
                }>
                question_references: Array<{
                  references: { id: number; title: string; publisher: string | null; url: string | null }
                }>
              }

              if (!q) return null

              const selectedOption = q.answer_options?.find((o) => o.id === answer.selected_option_id)
              const correctOption = q.answer_options?.find((o) => o.is_correct)
              const isBookmarked = bookmarkedIds.has(q.id)
              const noteText = notesMap[q.id] ?? ''
              const refs = q.question_references?.map((r) => r.references).filter(Boolean) ?? []

              return (
                <div key={answer.id} className="bg-surface-1 rounded-2xl border border-surface-4 overflow-hidden">
                  {/* Question header */}
                  <div className="px-5 pt-5 pb-4 border-b border-surface-4">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="px-2 py-0.5 rounded-md bg-teal-dim text-teal text-xs font-medium">
                          {q.domain}
                        </span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-xs font-medium ${
                            q.difficulty === 'easy'
                              ? 'bg-green-900/30 text-green-400'
                              : q.difficulty === 'medium'
                              ? 'bg-yellow-900/30 text-yellow-400'
                              : 'bg-red-900/30 text-red-400'
                          }`}
                        >
                          {q.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {answer.is_correct ? (
                          <span className="flex items-center gap-1 text-xs font-semibold text-green-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                            Correct
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-xs font-semibold text-red-400">
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Incorrect
                          </span>
                        )}
                        <BookmarkButton questionId={q.id} isBookmarked={isBookmarked} />
                      </div>
                    </div>
                    <p className="text-gray-200 text-sm leading-relaxed">{q.question_text}</p>
                  </div>

                  {/* Answer section */}
                  <div className="px-5 py-4 space-y-2">
                    {q.answer_options
                      ?.sort((a, b) => a.option_letter.localeCompare(b.option_letter))
                      .map((option) => {
                        const isUserSelected = option.id === answer.selected_option_id
                        const isCorrectOpt = option.is_correct

                        return (
                          <div
                            key={option.id}
                            className={`flex items-start gap-3 px-3 py-2.5 rounded-lg border text-sm ${
                              isCorrectOpt && isUserSelected
                                ? 'bg-green-900/20 border-green-600 text-green-100'
                                : isCorrectOpt
                                ? 'bg-green-900/10 border-green-800 text-green-200'
                                : isUserSelected
                                ? 'bg-red-900/20 border-red-600 text-red-100'
                                : 'bg-surface-2 border-surface-4 text-gray-500'
                            }`}
                          >
                            <span className="font-bold flex-shrink-0">{option.option_letter}.</span>
                            <span className="flex-1">{option.option_text}</span>
                            {isCorrectOpt && isUserSelected && (
                              <span className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-green-400">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Your answer — Correct
                              </span>
                            )}
                            {isCorrectOpt && !isUserSelected && (
                              <span className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-green-400">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                </svg>
                                Correct answer
                              </span>
                            )}
                            {!isCorrectOpt && isUserSelected && (
                              <span className="flex-shrink-0 flex items-center gap-1 text-xs font-bold text-red-400">
                                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                Your answer
                              </span>
                            )}
                          </div>
                        )
                      })}
                  </div>

                  {/* Explanation */}
                  <div className="px-5 pb-4 space-y-3">
                    {!answer.is_correct && selectedOption?.why_wrong && (
                      <div className="p-3 rounded-lg bg-red-900/10 border border-red-900/30">
                        <p className="text-xs font-semibold text-red-400 mb-1">Why {selectedOption.option_letter} is wrong</p>
                        <p className="text-xs text-gray-400">{selectedOption.why_wrong}</p>
                      </div>
                    )}

                    <div>
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Explanation</p>
                      <p className="text-sm text-gray-300 leading-relaxed">{q.explanation}</p>
                    </div>

                    {refs.length > 0 && (
                      <div>
                        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Sources</p>
                        <ul className="space-y-1">
                          {refs.map((ref) => (
                            <li key={ref.id} className="text-xs">
                              {ref.url ? (
                                <a href={ref.url} target="_blank" rel="noopener noreferrer" className="text-teal hover:underline">
                                  {ref.title}
                                </a>
                              ) : (
                                <span className="text-gray-500">{ref.title}</span>
                              )}
                              {ref.publisher && <span className="text-gray-600"> — {ref.publisher}</span>}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <ReviewNoteEditor questionId={q.id} initialNote={noteText} />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>
    </div>
  )
}

function BookmarkButton({ questionId, isBookmarked }: { questionId: string; isBookmarked: boolean }) {
  return (
    <form action="/api/bookmarks/toggle" method="POST">
      <input type="hidden" name="questionId" value={questionId} />
      <button
        type="submit"
        className={`p-1.5 rounded-lg transition ${
          isBookmarked
            ? 'text-yellow-400 hover:text-yellow-300'
            : 'text-gray-600 hover:text-gray-300'
        }`}
        title={isBookmarked ? 'Remove bookmark' : 'Bookmark this question'}
      >
        <svg className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
        </svg>
      </button>
    </form>
  )
}
