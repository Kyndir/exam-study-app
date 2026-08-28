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

  const { attemptId } = await request.json()

  if (!attemptId) {
    return NextResponse.json({ error: 'Missing attemptId' }, { status: 400 })
  }

  // Verify ownership
  const { data: attempt } = await supabase
    .from('exam_attempts')
    .select('id, user_id, status')
    .eq('id', attemptId)
    .eq('user_id', user.id)
    .single()

  if (!attempt) {
    return NextResponse.json({ error: 'Attempt not found' }, { status: 404 })
  }

  if (attempt.status === 'completed') {
    return NextResponse.json({ success: true, alreadyCompleted: true })
  }

  const { error } = await supabase
    .from('exam_attempts')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', attemptId)

  if (error) {
    return NextResponse.json({ error: 'Failed to complete attempt' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
