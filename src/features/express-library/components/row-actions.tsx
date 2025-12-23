import { type Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { type UExpression } from '../data/types'
import { useLibrary } from './provider'

type RowActionsProps = {
  row: Row<UExpression>
}

export function RowActions({ row }: RowActionsProps) {
  const { setOpen, setCurrentRow } = useLibrary()

  return (
    <div className='flex justify-end gap-1'>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8'
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('edit')
            }}
            aria-label='Edit expression'
          >
            <Pencil className='h-4 w-4' />
            <span className='sr-only'>Edit</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>编辑</TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
            className='h-8 w-8 text-destructive hover:text-destructive'
            onClick={() => {
              setCurrentRow(row.original)
              setOpen('delete')
            }}
            aria-label='Delete expression'
          >
            <Trash2 className='h-4 w-4' />
            <span className='sr-only'>Delete</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>删除</TooltipContent>
      </Tooltip>
    </div>
  )
}
