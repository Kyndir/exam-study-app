'use client'

import { useState } from 'react'

interface ReviewNoteEditorProps {
  questionId: string
  initialNote: string
}

export default function ReviewNoteEditor({ questionId, initialNote }: ReviewNoteEditorProps) {
  const [note, setNote] = useState(initialNote)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    setError(null)

    try {
      const res = await fetch('/api/notes/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId, noteText: note }),
      })
      if (!res.ok) throw new Error('Failed to save note')
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Could not save note. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="mt-3">
      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
        Your notes
      </label>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        rows={3}
        className="w-full px-3 py-2.5 rounded-lg bg-surface-3 border border-surface-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-teal resize-none transition"
        placeholder="Add a personal note about this question…"
      />
      <div className="flex items-center justify-between mt-2">
        {error && <p className="text-xs text-red-400">{error}</p>}
        {saved && <p className="text-xs text-green-400">Saved!</p>}
        {!error && !saved && <span />}
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="px-3 py-1.5 rounded-lg bg-surface-4 text-xs font-medium text-gray-300 hover:bg-surface-3 hover:text-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {saving ? 'Saving…' : 'Save note'}
        </button>
      </div>
    </div>
  )
}
