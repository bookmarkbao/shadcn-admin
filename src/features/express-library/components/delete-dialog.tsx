import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type UExpression } from '../data/types'
import { useExpressionLibraryStore } from '../store'

type DeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: UExpression
}

export function DeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: DeleteDialogProps) {
  const deleteExpression = useExpressionLibraryStore(
    (state) => state.deleteExpression
  )
  const mutating = useExpressionLibraryStore((state) => state.mutating)

  const handleDelete = async () => {
    await toast.promise(deleteExpression({ id: currentRow.id }), {
      loading: '正在删除...',
      success: '已删除',
      error: (err) => (err instanceof Error ? err.message : '删除失败'),
    })
    onOpenChange(false)
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={onOpenChange}
      handleConfirm={handleDelete}
      isLoading={mutating}
      title="提示"
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
             <AlertTriangle
            className='me-1 inline-block stroke-destructive'
            size={18}
          />确认删除{' '}
            <span className='font-semibold'>{currentRow.expression}</span>？
          </p>
        </div>
      }
      confirmText='删除'
      cancelBtnText='取消'
      destructive
      className='w-80'
    />
  )
}
