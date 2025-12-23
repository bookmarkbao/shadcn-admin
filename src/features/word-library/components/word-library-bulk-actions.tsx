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
import { type UWord } from '../data/types'
import { WordLibraryBulkUpdateDialog } from './word-library-bulk-update-dialog'
import { WordLibraryMultiDeleteDialog } from './word-library-multi-delete-dialog'

type WordLibraryBulkActionsProps<TData> = {
  table: Table<TData>
}

export function WordLibraryBulkActions<TData>({
  table,
}: WordLibraryBulkActionsProps<TData>) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showBulkUpdate, setShowBulkUpdate] = useState(false)

  const selectedWords = table
    .getFilteredSelectedRowModel()
    .rows.map((row) => (row.original as UWord).word)
    .filter((word) => typeof word === 'string' && word.trim())

  return (
    <>
      <BulkActionsToolbar table={table} entityName='单词'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant='outline'
              size='icon'
              onClick={() => setShowBulkUpdate(true)}
              className='size-8'
              aria-label='Update status for selected words'
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
              aria-label='Delete selected words'
              title='Delete'
            >
              <Trash2 />
              <span className='sr-only'>批量删除</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>批量删除</TooltipContent>
        </Tooltip>
      </BulkActionsToolbar>

      <WordLibraryBulkUpdateDialog
        open={showBulkUpdate}
        onOpenChange={setShowBulkUpdate}
        words={selectedWords}
        onUpdated={() => table.resetRowSelection()}
      />

      <WordLibraryMultiDeleteDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        words={selectedWords}
        onDeleted={() => table.resetRowSelection()}
      />
    </>
  )
}
