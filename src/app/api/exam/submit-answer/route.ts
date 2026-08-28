import { NextResponse, type NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const supabase = createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { attemptId, questionId, selectedOptionId } = await request.json()

  if (!attemptId || !questionId || selectedOptionId == null) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  // Verify attempt belongs to user
  const { data: attempt, error: aErr } = await supabase
    .from('exam_attempts')
    .select('*')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .single()

  if (aErr || !attempt) {
    return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
  }

  if (attempt.status !== 'in_progress') {
    return NextResponse.json({ error: 'Attempt is not in progress' }, { status: 409 })
  }

  // Check if already answered (prevent double-submit)
  const { data: existingAnswer } = await supabase
    .from('attempt_answers')
    .select('*')
    .eq('attempt_id', attemptId)
    .eq('question_id', questionId)
    .single()

  if (existingAnswer) {
    return NextResponse.json(
      {
        error: 'Already answered',
        attemptAnswer: existingAnswer,
        isCorrect: existingAnswer.is_correct,
        correctOptionId: existingAnswer.correct_option_id,
      },
      { status: 409 }
    )
  }

  // Get the answer options for this question
  const { data: options, error: optErr } = await supabase
    .from('answer_options')
    .select('*')
    .eq('question_id', questionId)

  if (optErr || !options || options.length === 0) {
    return NextResponse.json({ error: 'Question options not found' }, { status: 404 })
  }

  const correctOption = options.find((o) => o.is_correct)
  const selectedOption = options.find((o) => o.id === selectedOptionId)

  if (!correctOption) {
    return NextResponse.json({ error: 'No correct option defined' }, { status: 500 })
  }

  if (!selectedOption) {
    return NextResponse.json({ error: 'Selected option not found' }, { status: 400 })
  }

  const isCorrect = selectedOption.is_correct

  // Insert attempt_answer
  const { data: attemptAnswer, error: insErr } = await supabase
    .from('attempt_answers')
    .insert({
      attempt_id: attemptId,
      question_id: questionId,
      selected_option_id: selectedOptionId,
      correct_option_id: correctOption.id,
      is_correct: isCorrect,
      locked: true,
    })
    .select()
    .single()

  if (insErr || !attemptAnswer) {
    return NextResponse.json({ error: 'Failed to record answer' }, { status: 500 })
  }

  // Determine which question number this is
  // Count total answered answers for this attempt
  const { count: answeredCount } = await supabase
    .from('attempt_answers')
    .select('*', { count: 'exact', head: true })
    .eq('attempt_id', attemptId)

  const nextQuestionNo = (answeredCount ?? 0) + 1

  // Update attempt counts
  const updatePayload: Record<string, unknown> = {
    current_question_no: nextQuestionNo,
    updated_at: new Date().toISOString(),
  }

  if (isCorrect) {
    updatePayload.correct_count = attempt.correct_count + 1
  } else {
    updatePayload.incorrect_count = attempt.incorrect_count + 1
  }

  await supabase.from('exam_attempts').update(updatePayload).eq('id', attemptId)

  return NextResponse.json({
    isCorrect,
    correctOptionId: correctOption.id,
    attemptAnswer,
  })
}
