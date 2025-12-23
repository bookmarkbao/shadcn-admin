import { useState } from 'react'
import { type Table } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { DataTableBulkActions as BulkActionsToolbar } from '@/components/data-table'
import { type UExpression } from '../data/types'
import { BulkUpdateDialog } from './bulk-update-dialog'
import { MultiDeleteDialog } from './multi-delete-dialog'

type BulkActionsProps<TData> = {
  table: Table<TData>
}

export function BulkActions<TData>({ table }: BulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showBulkUpdate, setShowBulkUpdate] = useState(false)

  const selectedItems = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => row.original as UExpression)
    .filter(
      (item) =>
        typeof item?.id === 'string' &&
        item.id.trim() &&
        typeof item.expression === 'string'
    )

  const selectedIds = selectedItems.map((item) => item.id)

  return (
    <>
      <BulkActionsToolbar table={table} entityName='表达'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setShowBulkUpdate(true)}
              className='size-8'
              aria-label='Update status for selected expressions'
              title='Update status'
            >
              <Pencil />
              <span className='sr-only'>批量更新状态</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>批量更新状态</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='destructive'
              size='icon'
              onClick={() => setShowDeleteConfirm(true)}
              className='size-8'
              aria-label='Delete selected expressions'
              title='Delete'
            >
              <Trash2 />
              <span className='sr-only'>批量删除</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>批量删除</TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <BulkUpdateDialog
        open={showBulkUpdate}
        onOpenChange={setShowBulkUpdate}
        ids={selectedIds}
        onUpdated={() => table.resetRowSelection()}
      />

      <MultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        items={selectedItems.map((item) => ({
          id: item.id,
          expression: item.expression,
        }))}
        onDeleted={() => table.resetRowSelection()}
      />
    </>
  )
}
