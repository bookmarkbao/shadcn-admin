import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  EXPRESSION_STATUS_BADGE_CLASSNAME,
  EXPRESSION_STATUS_OPTIONS,
} from '../constants'
import { useExpressionLibraryStore } from '../store'

export function StatusFilters() {
  const statuses = useExpressionLibraryStore((state) => state.statuses)
  const toggleStatus = useExpressionLibraryStore((state) => state.toggleStatus)

  return (
    <div className='flex flex-1 flex-wrap items-center gap-2 text-sm text-muted-foreground'>
      {EXPRESSION_STATUS_OPTIONS.map((filter) => {
        const active = statuses.includes(filter.value)
        return (
          <Badge
            key={filter.value}
            variant={active ? 'secondary' : 'outline'}
            className={cn(
              'cursor-pointer',
              active ? EXPRESSION_STATUS_BADGE_CLASSNAME[filter.value] : null
            )}
            onClick={() => toggleStatus(filter.value)}
          >
            {filter.label}
          </Badge>
        )
      })}
    </div>
  )
}
