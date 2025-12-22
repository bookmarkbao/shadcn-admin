import { type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import { getWordStatusLabel, WORD_STATUS_BADGE_CLASSNAME } from '../constants'
import { type UWord, type UWordStatus } from '../data/types'
import { FluidButton } from './fluid-button'
import { WordLibraryRowActions } from './word-library-row-actions'

export const wordLibraryColumns: ColumnDef<UWord>[] = [
  {
    id: 'select',
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && 'indeterminate')
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label='Select all'
        className='translate-y-0.5'
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label='Select row'
        className='translate-y-0.5'
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'word',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='单词' />
    ),
    cell: ({ getValue }) => (
      <div className='text-base leading-tight font-semibold text-foreground'>
        {getValue<string>()?.toLowerCase()}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='状态' />
    ),
    cell: ({ getValue }) => {
      const value = getValue<UWordStatus>()
      return (
        <Badge
          variant='outline'
          className={cn(
            'border px-3 py-1 text-xs font-medium',
            WORD_STATUS_BADGE_CLASSNAME[value]
          )}
        >
          {getWordStatusLabel(value)}
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
    accessorKey: 'addedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='加入时间' />
    ),
    cell: ({ getValue }) => {
      const value = getValue<number>()
      return (
        <div className='text-sm text-muted-foreground'>
          {value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '—'}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='更新时间' />
    ),
    cell: ({ getValue }) => {
      const value = getValue<number>()
      return (
        <div className='text-sm text-muted-foreground'>
          {value ? dayjs(value).format('YYYY-MM-DD HH:mm:ss') : '—'}
        </div>
      )
    },
    enableSorting: true,
    enableHiding: false,
  },
  {
    id: 'actions',
    header: () => <div className='flex justify-end'><FluidButton /></div>,
    cell: WordLibraryRowActions,
    enableHiding: false,
  },
]
