'use client'

interface ProgressBarProps {
  current: number
  total: number
  correctCount: number
  incorrectCount: number
}

export default function ProgressBar({ current, total, correctCount, incorrectCount }: ProgressBarProps) {
  const answered = correctCount + incorrectCount
  const unanswered = total - answered
  const score = answered > 0 ? Math.round((correctCount / answered) * 100) : 0

  return (
    <div className="bg-surface-1 border-b border-surface-4 px-4 py-3">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-300">
            Question <span className="text-teal font-bold">{current}</span> of {total}
          </span>
          <div className="flex items-center gap-3 text-sm">
            <span className="flex items-center gap-1 text-green-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {correctCount}
            </span>
            <span className="flex items-center gap-1 text-red-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              {incorrectCount}
            </span>
            {answered > 0 && (
              <span className={`font-bold ${score >= 67 ? 'text-teal' : score >= 50 ? 'text-yellow-400' : 'text-red-400'}`}>
                {score}%
              </span>
            )}
          </div>
        </div>

        {/* Segmented progress bar */}
        <div className="h-2 rounded-full bg-surface-4 overflow-hidden flex">
          {/* Correct segment */}
          {correctCount > 0 && (
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${(correctCount / total) * 100}%` }}
              role="progressbar"
              aria-label={`${correctCount} correct`}
            />
          )}
          {/* Incorrect segment */}
          {incorrectCount > 0 && (
            <div
              className="h-full bg-red-500 transition-all duration-300"
              style={{ width: `${(incorrectCount / total) * 100}%` }}
              role="progressbar"
              aria-label={`${incorrectCount} incorrect`}
            />
          )}
          {/* Unanswered (empty) */}
          {unanswered > 0 && (
            <div
              className="h-full bg-surface-4 flex-1"
              style={{ width: `${(unanswered / total) * 100}%` }}
            />
          )}
        </div>

        <div className="flex items-center gap-4 mt-1.5 text-xs text-gray-600">
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
            Correct
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            Incorrect
          </span>
          <span className="flex items-center gap-1">
            <span className="inline-block w-2 h-2 rounded-full bg-surface-4" />
            Remaining
          </span>
        </div>
      </div>
    </div>
  )
}
