import dayjs from 'dayjs'
import { ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { useExpressionLibraryStore } from '../store'

type UpdatedAtFilterOption = {
  value: string
  label: string
  getRange: () => { gte: number | null; lte: number | null }
}

const OPTIONS: UpdatedAtFilterOption[] = [
  {
    value: '',
    label: '不限',
    getRange: () => ({ gte: null, lte: null }),
  },
  {
    value: '0',
    label: '今天',
    getRange: () => ({
      gte: dayjs().startOf('day').valueOf(),
      lte: dayjs().endOf('day').valueOf(),
    }),
  },
  {
    value: '1',
    label: '昨天',
    getRange: () => {
      const d = dayjs().subtract(1, 'day')
      return { gte: d.startOf('day').valueOf(), lte: d.endOf('day').valueOf() }
    },
  },
  {
    value: '7',
    label: '本周',
    getRange: () => ({
      gte: dayjs().startOf('week').valueOf(),
      lte: dayjs().endOf('day').valueOf(),
    }),
  },
  {
    value: '30',
    label: '本月',
    getRange: () => ({
      gte: dayjs().startOf('month').valueOf(),
      lte: dayjs().endOf('day').valueOf(),
    }),
  },
  {
    value: 'prev-30',
    label: '上月',
    getRange: () => {
      const lastMonth = dayjs().subtract(1, 'month')
      return {
        gte: lastMonth.startOf('month').valueOf(),
        lte: lastMonth.endOf('month').valueOf(),
      }
    },
  },
  {
    value: '365',
    label: '今年',
    getRange: () => ({
      gte: dayjs().startOf('year').valueOf(),
      lte: dayjs().endOf('day').valueOf(),
    }),
  },
]

export function UpdatedAtFilter({
  className,
}: {
  className?: string
}) {
  const preset = useExpressionLibraryStore((state) => state.updatedAtPreset)
  const setUpdatedAtFilter = useExpressionLibraryStore(
    (state) => state.setUpdatedAtFilter
  )

  const [expanded, setExpanded] = useState(false)

  const renderOption = (opt: UpdatedAtFilterOption) => {
    const active = preset === opt.value
    return (
      <Button
        key={opt.value || 'all'}
        type='button'
        variant={active ? 'default' : 'outline'}
        size='sm'
        className={cn(
          'h-7 gap-1.5 rounded-full px-3 text-[12px] border',
          active ? 'hover:bg-primary/90' : 'opacity-80 hover:opacity-100'
        )}
        onClick={() => {
          const range = opt.getRange()
          setUpdatedAtFilter({
            preset: opt.value,
            gte: range.gte,
            lte: range.lte,
          })
        }}
      >
        {opt.label}
      </Button>
    )
  }

  const containerClassName = useMemo(() => {
    return cn(
      'flex flex-nowrap items-center gap-2 transition-[max-width] duration-300 ease-out',
      expanded
        ? 'max-w-full'
        : 'max-w-[240px] overflow-hidden [mask-image:linear-gradient(to_right,black_75%,transparent)]'
    )
  }, [expanded])

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <div className={containerClassName}>
        {OPTIONS.map(renderOption)}
      </div>

      <Button
        type='button'
        variant='outline'
        size='icon'
        className='h-7 w-7 shrink-0 rounded-full'
        onClick={() => setExpanded((v) => !v)}
        aria-label={expanded ? '收起更多时间筛选' : '展开更多时间筛选'}
        aria-expanded={expanded}
      >
        <ChevronRight
          className={cn(
            'h-4 w-4 transition-transform duration-200',
            expanded ? 'rotate-180' : 'rotate-0'
          )}
        />
      </Button>
    </div>
  )
}
