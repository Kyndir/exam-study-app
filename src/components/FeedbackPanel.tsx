'use client'

import { useState } from 'react'
import type { AnswerOption, Reference } from '@/types'

interface FeedbackPanelProps {
  isCorrect: boolean
  selectedOption: AnswerOption | undefined
  correctOption: AnswerOption | undefined
  explanation: string
  references: Reference[]
}

export default function FeedbackPanel({
  isCorrect,
  selectedOption,
  correctOption,
  explanation,
  references,
}: FeedbackPanelProps) {
  const [sourcesOpen, setSourcesOpen] = useState(false)

  return (
    <div className="rounded-xl border overflow-hidden mt-4">
      {/* Result banner */}
      <div
        className={`flex items-center gap-3 px-5 py-4 ${
          isCorrect
            ? 'bg-green-900/30 border-b border-green-800/50'
            : 'bg-red-900/30 border-b border-red-800/50'
        }`}
      >
        <div
          className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${
            isCorrect ? 'bg-green-500/20' : 'bg-red-500/20'
          }`}
        >
          {isCorrect ? (
            <svg
              className="w-5 h-5 text-green-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="w-5 h-5 text-red-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>
        <div>
          <p
            className={`font-bold text-base ${isCorrect ? 'text-green-300' : 'text-red-300'}`}
            role="status"
            aria-live="polite"
          >
            {isCorrect ? 'Correct!' : 'Incorrect'}
          </p>
          {!isCorrect && correctOption && (
            <p className="text-sm text-gray-400 mt-0.5">
              The correct answer was:{' '}
              <span className="font-semibold text-green-300">
                {correctOption.option_letter}. {correctOption.option_text}
              </span>
            </p>
          )}
        </div>
      </div>

      <div className="bg-surface-2 p-5 space-y-4">
        {/* Why wrong (if incorrect) */}
        {!isCorrect && selectedOption?.why_wrong && (
          <div className="p-3 rounded-lg bg-red-900/10 border border-red-900/30">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-1">Why this answer is wrong</p>
            <p className="text-sm text-gray-300">{selectedOption.why_wrong}</p>
          </div>
        )}

        {/* Explanation */}
        <div>
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Explanation</p>
          <p className="text-sm text-gray-300 leading-relaxed">{explanation}</p>
        </div>

        {/* Sources accordion */}
        {references.length > 0 && (
          <div>
            <button
              type="button"
              onClick={() => setSourcesOpen(!sourcesOpen)}
              className="flex items-center gap-2 text-xs font-semibold text-gray-500 uppercase tracking-wide hover:text-gray-300 transition"
            >
              <svg
                className={`w-4 h-4 transition-transform ${sourcesOpen ? 'rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              Sources ({references.length})
            </button>
            {sourcesOpen && (
              <ul className="mt-2 space-y-1.5">
                {references.map((ref) => (
                  <li key={ref.id} className="text-sm">
                    {ref.url ? (
                      <a
                        href={ref.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-teal hover:underline"
                      >
                        {ref.title}
                        {ref.publisher && (
                          <span className="text-gray-500"> — {ref.publisher}</span>
                        )}
                      </a>
                    ) : (
                      <span className="text-gray-400">
                        {ref.title}
                        {ref.publisher && (
                          <span className="text-gray-500"> — {ref.publisher}</span>
                        )}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
