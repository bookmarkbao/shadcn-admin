import { Circle, CircleCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  EXPRESSION_STATUS_BUTTON_CLASSNAME,
  EXPRESSION_STATUS_OPTIONS,
} from '../constants'
import { type UExpressionStatus } from '../data/types'

type StatusPickerProps = {
  value: UExpressionStatus
  onChange: (value: UExpressionStatus) => void
  className?: string
}

export function StatusPicker({
  value,
  onChange,
  className,
}: StatusPickerProps) {
  return (
    <div className={cn('grid grid-cols-2 gap-2 sm:flex sm:flex-wrap', className)}>
      {EXPRESSION_STATUS_OPTIONS.map((opt) => {
        const active = opt.value === value
        return (
          <Button
            key={opt.value}
            type='button'
            variant='outline'
            onClick={() => onChange(opt.value)}
            className={cn(
              'h-9 justify-start gap-2 rounded-md border px-3 text-sm',
              EXPRESSION_STATUS_BUTTON_CLASSNAME[opt.value],
              active ? 'ring-2 ring-ring/50 ring-offset-2 ring-offset-background' : 'opacity-70 hover:opacity-100'
            )}
          >
            <span className='inline-flex w-4 items-center justify-center'>
              {active ? <CircleCheck className='h-4 w-4' /> : <Circle className='h-4 w-4' />}
            </span>
            <span>{opt.label}</span>
          </Button>
        )
      })}
    </div>
  )
}
