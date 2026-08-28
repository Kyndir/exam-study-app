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

  const { questionId, noteText } = await request.json()

  if (!questionId) {
    return NextResponse.json({ error: 'Missing questionId' }, { status: 400 })
  }

  const { error } = await supabase
    .from('question_notes')
    .upsert(
      {
        user_id: user.id,
        question_id: questionId,
        note_text: noteText ?? '',
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,question_id' }
    )

  if (error) {
    return NextResponse.json({ error: 'Failed to save note' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
