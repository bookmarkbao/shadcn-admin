import { type ColumnDef } from '@tanstack/react-table'
import dayjs from 'dayjs'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import { DataTableColumnHeader } from '@/components/data-table'
import {
  EXPRESSION_STATUS_BADGE_CLASSNAME,
  getExpressionStatusLabel,
} from '../constants'
import { type UExpression, type UExpressionStatus } from '../data/types'
import { FluidButton } from './fluid-button'
import { RowActions } from './row-actions'

export const columns: ColumnDef<UExpression>[] = [
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
      meta: {
      thClassName: 'w-[40px]',
      tdClassName: 'w-[40px] whitespace-nowrap',
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'expression',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='表达' />
    ),
    cell: ({ getValue }) => (
      <div className='text-base leading-tight font-semibold text-foreground text-left'>
        {getValue<string>()}
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
      const value = getValue<UExpressionStatus>()
      return (
        <Badge
          variant='outline'
          className={cn(
            'border px-3 py-1 text-xs font-medium',
            EXPRESSION_STATUS_BADGE_CLASSNAME[value]
          )}
        >
          {getExpressionStatusLabel(value)}
        </Badge>
      )
    },
    filterFn: (row, id, value) => {
      const normalized = (value as string[]) ?? []
      if (!normalized.length) return true
      return normalized.includes(row.getValue<UExpressionStatus>(id))
    },
    enableSorting: false,

  },
  {
    accessorKey: 'updatedAt',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='更新时间' />
    ),
    meta: {
      thClassName: 'w-[220px]',
      tdClassName: 'w-[220px] whitespace-nowrap',
    },
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
    header: () => (
      <div className='flex justify-end'>
        <FluidButton />
      </div>
    ),
    cell: RowActions,
    meta: {
      thClassName: 'w-[120px]',
      tdClassName: 'w-[120px] whitespace-nowrap',
    },
    enableHiding: false,
  },
]
