import { useState } from 'react'
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
import { type UWordStatus } from '../data/types'
import { useWordLibraryStore } from '../store'
import { WordLibraryStatusPicker } from './word-library-status-picker'

type WordLibraryBulkUpdateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  words: string[]
  onUpdated?: () => void
}

export function WordLibraryBulkUpdateDialog({
  open,
  onOpenChange,
  words,
  onUpdated,
}: WordLibraryBulkUpdateDialogProps) {
  const updateWordsStatusBatch = useWordLibraryStore(
    (state) => state.updateWordsStatusBatch
  )
  const mutating = useWordLibraryStore((state) => state.mutating)

  const [status, setStatus] = useState<UWordStatus>('learning')

  const handleUpdate = async () => {
    if (words.length === 0) return

    await toast.promise(updateWordsStatusBatch({ words, status }), {
      loading: '正在批量更新...',
      success: `已更新 ${words.length} 个单词`,
      error: (err) => (err instanceof Error ? err.message : '更新失败'),
    })

    onOpenChange(false)
    onUpdated?.()
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (next) setStatus('learning')
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>批量更新状态</DialogTitle>
          <DialogDescription>已选中 {words.length} 个单词</DialogDescription>
        </DialogHeader>

        <div className='space-y-1.5'>
          <Label>更新为</Label>
          <WordLibraryStatusPicker value={status} onChange={setStatus} />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleUpdate} disabled={mutating || words.length === 0}>
            更新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
