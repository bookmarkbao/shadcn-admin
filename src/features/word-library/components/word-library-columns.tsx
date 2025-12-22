import { type ColumnDef } from '@tanstack/react-table'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { type UWord, type UWordStatus } from '../data/types'

const statusVariants: Record<UWordStatus, string> = {
  new: 'text-secondary-foreground bg-secondary/10 border-secondary',
  learning: 'text-primary-foreground bg-primary/10 border-primary',
  mastered: 'text-foreground/70 bg-foreground/5 border-foreground/10',
  ignored: 'text-destructive-foreground bg-destructive/10 border-destructive',
}

const dateFormatter = new Intl.DateTimeFormat('zh-CN', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
})

const getStatusLabel = (status: UWordStatus) => {
  switch (status) {
    case 'learning':
      return '学习中'
    case 'mastered':
      return '已掌握'
    case 'ignored':
      return '忽略'
    default:
      return '新词'
  }
}

export const wordLibraryColumns: ColumnDef<UWord>[] = [
  {
    accessorKey: 'word',
    header: '单词',
    cell: ({ getValue }) => (
      <div className='text-base font-semibold leading-tight text-foreground'>
        {getValue<string>()?.toLowerCase()}
      </div>
    ),
    enableSorting: false,
    filterFn: 'includesString',
  },
  {
    accessorKey: 'status',
    header: '状态',
    cell: ({ getValue }) => {
      const value = getValue<UWordStatus>()
      return (
        <Badge
          variant='outline'
          className={cn(
            'border px-3 py-1 text-xs font-medium',
            statusVariants[value]
          )}
        >
          {getStatusLabel(value)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const normalized = (value as string[]) ?? []
      if (!normalized.length) return true
      return normalized.includes(row.getValue<UWordStatus>(id))
    },
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.addedAt,
    id: 'addedAt',
    header: '加入时间',
    cell: ({ getValue }) => {
      const value = getValue<number>()
      return (
        <div className='text-sm text-muted-foreground'>
          {value ? dateFormatter.format(new Date(value)) : '—'}
        </div>
      )
    },
    enableSorting: false,
  },
  {
    accessorFn: (row) => row.updatedAt,
    id: 'updatedAt',
    header: '更新时间',
    cell: ({ getValue }) => {
      const value = getValue<number>()
      return (
        <div className='text-sm text-muted-foreground'>
          {value ? dateFormatter.format(new Date(value)) : '—'}
        </div>
      )
    },
    enableSorting: false,
  },
]
