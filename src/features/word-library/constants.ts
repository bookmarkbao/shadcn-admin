import { type UWordStatus } from './data/types'

export type WordStatusOption = {
  value: UWordStatus
  label: string
}

export const WORD_STATUS_OPTIONS: WordStatusOption[] = [
  { value: 'new', label: '新词' },
  { value: 'learning', label: '学习中' },
  { value: 'mastered', label: '已掌握' },
  { value: 'ignored', label: '忽略' },
]

export const WORD_STATUS_LABELS: Record<UWordStatus, string> = {
  new: '新词',
  learning: '学习中',
  mastered: '已掌握',
  ignored: '忽略',
}

export const WORD_STATUS_BADGE_CLASSNAME: Record<UWordStatus, string> = {
  new: 'text-sky-700 bg-sky-500/10 border-sky-500/20 dark:text-sky-300',
  learning:
    'text-amber-800 bg-amber-500/15 border-amber-500/30 dark:text-amber-300',
  mastered:
    'text-emerald-700 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-300',
  ignored: 'text-muted-foreground bg-muted/40 border-muted-foreground/20',
}

export const WORD_STATUS_BUTTON_CLASSNAME: Record<UWordStatus, string> = {
  new: 'border-sky-500/25 bg-sky-500/10 text-sky-700 hover:bg-sky-500/15 dark:text-sky-300',
  learning:
    'border-amber-500/30 bg-amber-500/15 text-amber-800 hover:bg-amber-500/20 dark:text-amber-300',
  mastered:
    'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300',
  ignored:
    'border-muted-foreground/20 bg-muted/40 text-muted-foreground hover:bg-muted/50',
}

export function getWordStatusLabel(status: UWordStatus) {
  return WORD_STATUS_LABELS[status]
}
