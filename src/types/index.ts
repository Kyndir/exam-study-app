export interface Question {
  id: string
  question_text: string
  domain: string
  difficulty: 'easy' | 'medium' | 'hard'
  explanation: string
  answer_options: AnswerOption[]
  question_references: { references: Reference }[]
}

export interface AnswerOption {
  id: number
  question_id: string
  option_letter: 'A' | 'B' | 'C' | 'D'
  option_text: string
  is_correct: boolean
  why_wrong: string | null
}

export interface Reference {
  id: number
  title: string
  publisher: string | null
  url: string | null
  date_accessed: string | null
}

export interface ExamAttempt {
  id: string
  user_id: string
  mode: 'full_exam' | 'practice'
  domain_filter: string | null
  status: 'in_progress' | 'completed' | 'abandoned'
  current_question_no: number
  total_questions: number
  correct_count: number
  incorrect_count: number
  time_spent_seconds: number
  completed_at: string | null
  created_at: string
  updated_at: string
}

export interface AttemptAnswer {
  id: string
  attempt_id: string
  question_id: string
  selected_option_id: number | null
  correct_option_id: number
  is_correct: boolean
  submitted_at: string
  locked: boolean
}

export interface QuestionNote {
  user_id: string
  question_id: string
  note_text: string
  updated_at: string
}

export interface Bookmark {
  user_id: string
  question_id: string
  created_at: string
}
