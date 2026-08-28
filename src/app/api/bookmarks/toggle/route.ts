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

  const { questionId } = await request.json()

  if (!questionId) {
    return NextResponse.json({ error: 'Missing questionId' }, { status: 400 })
  }

  // Check if bookmark exists
  const { data: existing } = await supabase
    .from('bookmarks')
    .select('question_id')
    .eq('user_id', user.id)
    .eq('question_id', questionId)
    .single()

  if (existing) {
    // Remove bookmark
    const { error } = await supabase
      .from('bookmarks')
      .delete()
      .eq('user_id', user.id)
      .eq('question_id', questionId)

    if (error) {
      return NextResponse.json({ error: 'Failed to remove bookmark' }, { status: 500 })
    }

    return NextResponse.json({ bookmarked: false })
  } else {
    // Add bookmark
    const { error } = await supabase.from('bookmarks').insert({
      user_id: user.id,
      question_id: questionId,
    })

    if (error) {
      return NextResponse.json({ error: 'Failed to add bookmark' }, { status: 500 })
    }

    return NextResponse.json({ bookmarked: true })
  }
}
