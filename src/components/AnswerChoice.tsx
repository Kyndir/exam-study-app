import type { AnswerOption } from '@/types'

interface AnswerChoiceProps {
  option: AnswerOption
  isSelected: boolean
  isSubmitted: boolean
  isSelectedByUser: boolean
  onSelect: (optionId: number) => void
}

export default function AnswerChoice({
  option,
  isSelected,
  isSubmitted,
  isSelectedByUser,
  onSelect,
}: AnswerChoiceProps) {
  const isCorrect = option.is_correct

  function getVariant() {
    if (!isSubmitted) {
      return isSelected ? 'selected' : 'default'
    }
    if (isCorrect && isSelectedByUser) return 'correct-selected'
    if (isCorrect && !isSelectedByUser) return 'correct-unselected'
    if (!isCorrect && isSelectedByUser) return 'incorrect-selected'
    return 'neutral'
  }

  const variant = getVariant()

  const baseClasses =
    'w-full flex items-start gap-3 px-4 py-4 rounded-xl border text-left transition-all min-h-[56px] focus:outline-none'

  const variantClasses: Record<string, string> = {
    default:
      'bg-surface-2 border-surface-4 text-gray-200 hover:bg-surface-3 hover:border-gray-600 focus:ring-2 focus:ring-teal cursor-pointer',
    selected:
      'bg-teal-dim border-teal text-gray-100 ring-2 ring-teal cursor-pointer',
    'correct-selected':
      'bg-green-900/20 border-green-500 text-green-100 cursor-default',
    'correct-unselected':
      'bg-green-900/10 border-green-700 text-green-200 cursor-default',
    'incorrect-selected':
      'bg-red-900/20 border-red-500 text-red-100 cursor-default',
    neutral:
      'bg-surface-2 border-surface-4 text-gray-500 cursor-default opacity-60',
  }

  const letterClasses: Record<string, string> = {
    default: 'bg-surface-3 text-gray-400 border-surface-4',
    selected: 'bg-teal text-brand-dark border-teal',
    'correct-selected': 'bg-green-500 text-white border-green-500',
    'correct-unselected': 'bg-green-900/40 text-green-400 border-green-700',
    'incorrect-selected': 'bg-red-500 text-white border-red-500',
    neutral: 'bg-surface-3 text-gray-600 border-surface-4',
  }

  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      disabled={isSubmitted}
      onClick={() => !isSubmitted && onSelect(option.id)}
      className={`${baseClasses} ${variantClasses[variant]}`}
    >
      {/* Option letter badge */}
      <span
        className={`flex-shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center text-sm font-bold mt-0.5 ${letterClasses[variant]}`}
      >
        {option.option_letter}
      </span>

      {/* Option text + result label */}
      <span className="flex-1 min-w-0">
        <span className="block">{option.option_text}</span>
        {isSubmitted && (
          <span className="mt-1 flex items-center gap-1 text-xs font-semibold">
            {variant === 'correct-selected' && (
              <>
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">Your answer — Correct!</span>
              </>
            )}
            {variant === 'correct-unselected' && (
              <>
                <svg className="w-3.5 h-3.5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-green-400">Correct answer</span>
              </>
            )}
            {variant === 'incorrect-selected' && (
              <>
                <svg className="w-3.5 h-3.5 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                </svg>
                <span className="text-red-400">Your answer — Incorrect</span>
              </>
            )}
          </span>
        )}
      </span>
    </button>
  )
}
