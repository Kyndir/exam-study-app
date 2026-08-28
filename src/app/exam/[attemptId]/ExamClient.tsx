'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Nav from '@/components/Nav'
import ProgressBar from '@/components/ProgressBar'
import AnswerChoice from '@/components/AnswerChoice'
import FeedbackPanel from '@/components/FeedbackPanel'
import type { Question, ExamAttempt, AttemptAnswer, AnswerOption, Reference } from '@/types'

interface ExamClientProps {
  attempt: ExamAttempt
  questions: Question[]
  existingAnswers: AttemptAnswer[]
  userEmail: string | undefined
}

export default function ExamClient({
  attempt,
  questions,
  existingAnswers,
  userEmail,
}: ExamClientProps) {
  const router = useRouter()

  // Build a map from questionId → answer
  const [answersMap, setAnswersMap] = useState<Record<string, AttemptAnswer>>(() => {
    const map: Record<string, AttemptAnswer> = {}
    existingAnswers.forEach((a) => {
      map[a.question_id] = a
    })
    return map
  })

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(() => {
    // Resume at the first unanswered question
    const answeredIds = new Set(existingAnswers.map((a) => a.question_id))
    const firstUnanswered = questions.findIndex((q) => !answeredIds.has(q.id))
    return firstUnanswered === -1 ? questions.length - 1 : firstUnanswered
  })

  const [selectedOptionId, setSelectedOptionId] = useState<number | null>(null)
  const [submittedAnswer, setSubmittedAnswer] = useState<AttemptAnswer | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [noteSaving, setNoteSaving] = useState(false)
  const [noteSaved, setNoteSaved] = useState(false)
  const [isFinishing, setIsFinishing] = useState(false)
  const [timeElapsed, setTimeElapsed] = useState(attempt.time_spent_seconds)

  const currentQuestion = questions[currentQuestionIndex]

  // Timer
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeElapsed((t) => t + 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Load the current question's existing answer
  useEffect(() => {
    if (!currentQuestion) return
    const existing = answersMap[currentQuestion.id]
    if (existing) {
      setSubmittedAnswer(existing)
      setSelectedOptionId(existing.selected_option_id)
    } else {
      setSubmittedAnswer(null)
      setSelectedOptionId(null)
    }
    setSubmitError(null)
  }, [currentQuestionIndex, currentQuestion, answersMap])

  const correctCount = Object.values(answersMap).filter((a) => a.is_correct).length
  const incorrectCount = Object.values(answersMap).filter((a) => !a.is_correct).length

  async function handleSubmit() {
    if (selectedOptionId === null || submittedAnswer || isSubmitting) return

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const res = await fetch('/api/exam/submit-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attemptId: attempt.id,
          questionId: currentQuestion.id,
          selectedOptionId,
        }),
      })

      if (res.status === 409) {
        // Already answered — fetch existing
        const data = await res.json()
        if (data.attemptAnswer) {
          setSubmittedAnswer(data.attemptAnswer)
          setAnswersMap((prev) => ({
            ...prev,
            [currentQuestion.id]: data.attemptAnswer,
          }))
        }
        return
      }

      if (!res.ok) {
        const data = await res.json()
        setSubmitError(data.error ?? 'Failed to submit answer')
        return
      }

      const data = await res.json()
      setSubmittedAnswer(data.attemptAnswer)
      setAnswersMap((prev) => ({
        ...prev,
        [currentQuestion.id]: data.attemptAnswer,
      }))
    } catch {
      setSubmitError('Network error. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleSaveNote() {
    if (!currentQuestion) return
    setNoteSaving(true)
    setNoteSaved(false)
    try {
      await fetch('/api/notes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: currentQuestion.id, noteText: note }),
      })
      setNoteSaved(true)
      setTimeout(() => setNoteSaved(false), 2000)
    } finally {
      setNoteSaving(false)
    }
  }

  const handlePrev = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((i) => i - 1)
    }
  }, [currentQuestionIndex])

  const handleNext = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((i) => i + 1)
    }
  }, [currentQuestionIndex, questions.length])

  async function handleFinishExam() {
    setIsFinishing(true)
    try {
      await fetch('/api/exam/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ attemptId: attempt.id }),
      })
      router.push(`/results/${attempt.id}`)
    } catch {
      setIsFinishing(false)
    }
  }

  const allAnswered = questions.every((q) => answersMap[q.id])
  const isLastQuestion = currentQuestionIndex === questions.length - 1

  if (!currentQuestion) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">No questions available.</p>
      </div>
    )
  }

  // Get the referenced objects
  const references: Reference[] = currentQuestion.question_references
    ?.map((qr) => qr.references)
    .filter(Boolean) as Reference[] ?? []

  const selectedOption = currentQuestion.answer_options?.find(
    (o) => o.id === selectedOptionId
  )
  const correctOption = currentQuestion.answer_options?.find((o) => o.is_correct)

  const isCurrentAnswered = !!submittedAnswer

  // Format time
  const mins = Math.floor(timeElapsed / 60)
  const secs = timeElapsed % 60
  const timeStr = `${mins}:${secs.toString().padStart(2, '0')}`

  return (
    <div className="min-h-screen flex flex-col">
      <Nav userEmail={userEmail} />

      <ProgressBar
        current={currentQuestionIndex + 1}
        total={questions.length}
        correctCount={correctCount}
        incorrectCount={incorrectCount}
      />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-6 pb-24">
        {/* Domain + difficulty + timer */}
        <div className="flex items-center justify-between flex-wrap gap-2 mb-4">
          <div className="flex items-center gap-2">
            <span className="px-2 py-1 rounded-md bg-teal-dim text-teal text-xs font-medium">
              {currentQuestion.domain}
            </span>
            <span
              className={`px-2 py-1 rounded-md text-xs font-medium ${
                currentQuestion.difficulty === 'easy'
                  ? 'bg-green-900/30 text-green-400'
                  : currentQuestion.difficulty === 'medium'
                  ? 'bg-yellow-900/30 text-yellow-400'
                  : 'bg-red-900/30 text-red-400'
              }`}
            >
              {currentQuestion.difficulty}
            </span>
          </div>
          <span className="text-xs text-gray-500 font-mono">{timeStr}</span>
        </div>

        {/* Question text */}
        <div className="bg-surface-1 rounded-2xl border border-surface-4 p-6 mb-5">
          <p className="text-gray-100 text-base leading-relaxed font-medium">
            {currentQuestion.question_text}
          </p>
        </div>

        {/* Answer choices */}
        <div
          role="radiogroup"
          aria-label="Answer choices"
          className="space-y-3 mb-5"
        >
          {currentQuestion.answer_options
            ?.sort((a, b) => a.option_letter.localeCompare(b.option_letter))
            .map((option) => (
              <AnswerChoice
                key={option.id}
                option={option}
                isSelected={selectedOptionId === option.id}
                isSubmitted={isCurrentAnswered}
                isSelectedByUser={submittedAnswer?.selected_option_id === option.id}
                onSelect={setSelectedOptionId}
              />
            ))}
        </div>

        {/* Submit button */}
        {!isCurrentAnswered && (
          <div className="mb-5">
            {submitError && (
              <p className="text-sm text-red-400 mb-2">{submitError}</p>
            )}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={selectedOptionId === null || isSubmitting}
              className="w-full py-3.5 rounded-xl bg-teal text-brand-dark font-semibold text-base hover:bg-teal/90 focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-brand-dark disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {isSubmitting ? 'Submitting…' : 'Submit Answer'}
            </button>
          </div>
        )}

        {/* Feedback panel */}
        {isCurrentAnswered && submittedAnswer && (
          <FeedbackPanel
            isCorrect={submittedAnswer.is_correct}
            selectedOption={selectedOption}
            correctOption={correctOption}
            explanation={currentQuestion.explanation}
            references={references}
          />
        )}

        {/* Note textarea */}
        <div className="mt-5">
          <label
            htmlFor="question-note"
            className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5"
          >
            Your notes
          </label>
          <textarea
            id="question-note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-3 py-2.5 rounded-xl bg-surface-2 border border-surface-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal resize-none transition"
            placeholder="Add a note about this question…"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-600">
              {noteSaved ? <span className="text-green-400">Saved!</span> : 'Auto-save your thoughts'}
            </span>
            <button
              type="button"
              onClick={handleSaveNote}
              disabled={noteSaving}
              className="px-3 py-1.5 rounded-lg bg-surface-3 text-xs font-medium text-gray-400 hover:bg-surface-4 hover:text-gray-200 disabled:opacity-50 transition"
            >
              {noteSaving ? 'Saving…' : 'Save note'}
            </button>
          </div>
        </div>
      </main>

      {/* Fixed bottom navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-surface-1 border-t border-surface-4 px-4 py-3 z-40">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={handlePrev}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-3 text-sm font-medium text-gray-300 hover:bg-surface-4 hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Prev
          </button>

          <div className="flex-1 text-center text-sm text-gray-500">
            <span className="text-gray-200 font-medium">{currentQuestionIndex + 1}</span> / {questions.length}
          </div>

          {allAnswered && isLastQuestion ? (
            <button
              type="button"
              onClick={handleFinishExam}
              disabled={isFinishing}
              className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-teal text-brand-dark text-sm font-bold hover:bg-teal/90 disabled:opacity-60 transition"
            >
              {isFinishing ? 'Finishing…' : 'Finish Exam'}
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          ) : (
            <button
              type="button"
              onClick={handleNext}
              disabled={!isCurrentAnswered || currentQuestionIndex === questions.length - 1}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-3 text-sm font-medium text-gray-300 hover:bg-surface-4 hover:text-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
              Next
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>

        {/* Show finish button when all answered but not on last question */}
        {allAnswered && !isLastQuestion && (
          <div className="max-w-3xl mx-auto mt-2">
            <button
              type="button"
              onClick={handleFinishExam}
              disabled={isFinishing}
              className="w-full py-2.5 rounded-xl bg-teal text-brand-dark text-sm font-bold hover:bg-teal/90 disabled:opacity-60 transition"
            >
              {isFinishing ? 'Finishing…' : 'All answered — Finish Exam'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
