import { Badge } from '@/components/ui/badge'
import { useWordLibraryStore } from '../store'
import { WORD_STATUS_BADGE_CLASSNAME, WORD_STATUS_OPTIONS } from '../constants'
import { cn } from '@/lib/utils'

export function WordLibraryStatusFilters() {
  const statuses = useWordLibraryStore((state) => state.statuses)
  const toggleStatus = useWordLibraryStore((state) => state.toggleStatus)

  return (
    <div className='flex flex-1 flex-wrap items-center gap-2 text-sm text-muted-foreground'>
      {WORD_STATUS_OPTIONS.map((filter) => {
        const active = statuses.includes(filter.value)
        return (
          <Badge
            key={filter.value}
            variant={active ? 'secondary' : 'outline'}
            className={cn(
              'cursor-pointer',
              active ? WORD_STATUS_BADGE_CLASSNAME[filter.value] : null
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
