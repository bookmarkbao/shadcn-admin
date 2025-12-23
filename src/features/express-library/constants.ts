import { type UExpressionStatus } from './data/types'

export type ExpressionStatusOption = {
  value: UExpressionStatus
  label: string
}

export const EXPRESSION_STATUS_OPTIONS: ExpressionStatusOption[] = [
  { value: 'new', label: '新建' },
  { value: 'learning', label: '学习中' },
  { value: 'mastered', label: '已掌握' },
  { value: 'fluent', label: '流利' },
  { value: 'transferable', label: '脱口而出' },
  { value: 'ignored', label: '忽略' },
]

export const EXPRESSION_STATUS_LABELS: Record<UExpressionStatus, string> = {
  new: '新建',
  learning: '学习中',
  mastered: '已掌握',
  fluent: '流利',
  transferable: '可迁移',
  ignored: '忽略',
}

export const EXPRESSION_STATUS_BADGE_CLASSNAME: Record<
  UExpressionStatus,
  string
> = {
  new: 'text-sky-700 bg-sky-500/10 border-sky-500/20 dark:text-sky-300',
  learning:
    'text-amber-800 bg-amber-500/15 border-amber-500/30 dark:text-amber-300',
  mastered:
    'text-emerald-700 bg-emerald-500/10 border-emerald-500/20 dark:text-emerald-300',
  fluent:
    'text-purple-700 bg-purple-500/10 border-purple-500/20 dark:text-purple-300',
  transferable:
    'text-indigo-700 bg-indigo-500/10 border-indigo-500/20 dark:text-indigo-300',
  ignored: 'text-muted-foreground bg-muted/40 border-muted-foreground/20',
}

export const EXPRESSION_STATUS_BUTTON_CLASSNAME: Record<
  UExpressionStatus,
  string
> = {
  new: 'border-sky-500/25 bg-sky-500/10 text-sky-700 hover:bg-sky-500/15 dark:text-sky-300',
  learning:
    'border-amber-500/30 bg-amber-500/15 text-amber-800 hover:bg-amber-500/20 dark:text-amber-300',
  mastered:
    'border-emerald-500/20 bg-emerald-500/10 text-emerald-700 hover:bg-emerald-500/15 dark:text-emerald-300',
  fluent:
    'border-purple-500/20 bg-purple-500/10 text-purple-700 hover:bg-purple-500/15 dark:text-purple-300',
  transferable:
    'border-indigo-500/20 bg-indigo-500/10 text-indigo-700 hover:bg-indigo-500/15 dark:text-indigo-300',
  ignored:
    'border-muted-foreground/20 bg-muted/40 text-muted-foreground hover:bg-muted/50',
}

export function getExpressionStatusLabel(status: UExpressionStatus) {
  return EXPRESSION_STATUS_LABELS[status]
}
