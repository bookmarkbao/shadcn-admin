import { useEffect, useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { type UWord, type UWordStatus } from '../data/types'
import { useWordLibraryStore } from '../store'
import { WordLibraryStatusPicker } from './word-library-status-picker'

type WordLibraryEditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: UWord
}

export function WordLibraryEditDialog({
  open,
  onOpenChange,
  currentRow,
}: WordLibraryEditDialogProps) {
  const updateWordStatus = useWordLibraryStore((state) => state.updateWordStatus)
  const mutating = useWordLibraryStore((state) => state.mutating)

  const [status, setStatus] = useState<UWordStatus>(currentRow.status)

  useEffect(() => {
    if (open) setStatus(currentRow.status)
  }, [open, currentRow.status])

  const handleSave = async () => {
    await toast.promise(updateWordStatus({ word: currentRow.word, status }), {
      loading: '正在更新...',
      success: '已更新状态',
      error: (err) => (err instanceof Error ? err.message : '更新失败'),
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>编辑</DialogTitle>
          <DialogDescription>
            <span className='text-3xl font-semibold'>{currentRow.word}</span>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-1.5'>
          <Label>状态</Label>
          <WordLibraryStatusPicker value={status} onChange={setStatus} />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleSave} disabled={mutating}>
            保存
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
