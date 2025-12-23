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
import { type UExpression, type UExpressionStatus } from '../data/types'
import { useExpressionLibraryStore } from '../store'
import { StatusPicker } from './status-picker'

type EditDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: UExpression
}

export function EditDialog({
  open,
  onOpenChange,
  currentRow,
}: EditDialogProps) {
  const updateExpressionStatus = useExpressionLibraryStore(
    (state) => state.updateExpressionStatus
  )
  const mutating = useExpressionLibraryStore((state) => state.mutating)

  const [status, setStatus] = useState<UExpressionStatus>(currentRow.status)

  const handleSave = async () => {
    await toast.promise(updateExpressionStatus({ id: currentRow.id, status }), {
      loading: '正在更新...',
      success: '已更新状态',
      error: (err) => (err instanceof Error ? err.message : '更新失败'),
    })
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (next) setStatus(currentRow.status)
      }}
    >
      <DialogContent key={currentRow.id} className='sm:max-w-md'>
        <DialogHeader className='text-start'>
          <DialogTitle>编辑</DialogTitle>
          <DialogDescription>
            <span className='text-3xl font-semibold'>{currentRow.expression}</span>
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-1.5'>
          <Label>状态</Label>
          <StatusPicker value={status} onChange={setStatus} />
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
