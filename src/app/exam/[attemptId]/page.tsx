import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import ExamClient from './ExamClient'
import type { Question, ExamAttempt, AttemptAnswer } from '@/types'

interface PageProps {
  params: { attemptId: string }
}

export default async function ExamPage({ params }: PageProps) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login')
  }

  // Fetch attempt
  const { data: attempt, error: aErr } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('id', params.attemptId)
    .eq('user_id', user.id)
    .single()

  if (aErr || !attempt) {
    notFound()
  }

  if (attempt.status === 'completed') {
    redirect(`/results/${params.attemptId}`)
  }

  // Fetch questions with their options and references
  let questionQuery = supabase
    .from('questions')
    .select(`
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
          url,
          date_accessed
        )
      )
    `)
    .order('id', { ascending: true })

  if (attempt.mode === 'practice' && attempt.domain_filter) {
    questionQuery = questionQuery.eq('domain', attempt.domain_filter)
  }

  questionQuery = questionQuery.limit(attempt.total_questions)

  const { data: questions, error: qErr } = await questionQuery

  if (qErr || !questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-400">Failed to load questions. Please try again.</p>
      </div>
    )
  }

  // Fetch all existing answers for this attempt
  const { data: existingAnswers } = await supabase
    .from('attempt_answers')
    .select('*')
    .eq('attempt_id', params.attemptId)

  return (
    <ExamClient
      attempt={attempt as ExamAttempt}
      questions={questions as unknown as Question[]}
      existingAnswers={(existingAnswers ?? []) as AttemptAnswer[]}
      userEmail={user.email}
    />
  )
}
