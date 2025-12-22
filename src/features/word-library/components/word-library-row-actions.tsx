import { type Row } from '@tanstack/react-table'
import { Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { type UWord } from '../data/types'
import { useWordLibrary } from './word-library-provider'

type WordLibraryRowActionsProps = {
  row: Row<UWord>
}

export function WordLibraryRowActions({ row }: WordLibraryRowActionsProps) {
  const { setOpen, setCurrentRow } = useWordLibrary()

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
            aria-label='Edit word'
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
            aria-label='Delete word'
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

