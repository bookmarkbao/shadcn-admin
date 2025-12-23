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
import { type UExpressionStatus } from '../data/types'
import { useExpressionLibraryStore } from '../store'
import { StatusPicker } from './status-picker'

type BulkUpdateDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  ids: string[]
  onUpdated?: () => void
}

export function BulkUpdateDialog({
  open,
  onOpenChange,
  ids,
  onUpdated,
}: BulkUpdateDialogProps) {
  const updateExpressionsStatusBatch = useExpressionLibraryStore(
    (state) => state.updateExpressionsStatusBatch
  )
  const mutating = useExpressionLibraryStore((state) => state.mutating)

  const [status, setStatus] = useState<UExpressionStatus>('learning')

  const handleUpdate = async () => {
    if (ids.length === 0) return

    await toast.promise(updateExpressionsStatusBatch({ ids, status }), {
      loading: '正在批量更新...',
      success: `已更新 ${ids.length} 条表达`,
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
          <DialogDescription>已选中 {ids.length} 条表达</DialogDescription>
        </DialogHeader>

        <div className='space-y-1.5'>
          <Label>更新为</Label>
          <StatusPicker value={status} onChange={setStatus} />
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleUpdate} disabled={mutating || ids.length === 0}>
            更新
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
