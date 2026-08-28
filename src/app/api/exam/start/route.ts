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

  let mode: string
  let domainFilter: string | null = null

  const contentType = request.headers.get('content-type') ?? ''

  if (contentType.includes('application/json')) {
    const body = await request.json()
    mode = body.mode ?? 'full_exam'
    domainFilter = body.domainFilter ?? null
  } else {
    // Form submission
    const formData = await request.formData()
    mode = (formData.get('mode') as string) ?? 'full_exam'
    domainFilter = (formData.get('domainFilter') as string) ?? null
  }

  // Build question query
  let query = supabase
    .from('questions')
    .select('id')
    .order('id', { ascending: true })

  if (mode === 'practice' && domainFilter) {
    query = query.eq('domain', domainFilter)
  }

  if (mode === 'full_exam') {
    query = query.limit(65)
  } else {
    query = query.limit(20)
  }

  const { data: questions, error: qErr } = await query

  if (qErr || !questions || questions.length === 0) {
    return NextResponse.json({ error: 'No questions found' }, { status: 500 })
  }

  const totalQuestions = questions.length

  // Create the attempt
  const { data: attempt, error: aErr } = await supabase
    .from('exam_attempts')
    .insert({
      user_id: user.id,
      mode: mode === 'full_exam' ? 'full_exam' : 'practice',
      domain_filter: domainFilter,
      status: 'in_progress',
      current_question_no: 1,
      total_questions: totalQuestions,
      correct_count: 0,
      incorrect_count: 0,
      time_spent_seconds: 0,
    })
    .select()
    .single()

  if (aErr || !attempt) {
    return NextResponse.json({ error: 'Failed to create attempt' }, { status: 500 })
  }

  // If JSON request, return the attemptId
  if (contentType.includes('application/json')) {
    return NextResponse.json({ attemptId: attempt.id })
  }

  // Form submission: redirect to exam page
  return NextResponse.redirect(new URL(`/exam/${attempt.id}`, request.url), { status: 302 })
}
