import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useExpressionLibraryStore } from '../store'

type MultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  items: { id: string; expression: string }[]
  onDeleted?: () => void
}

const CONFIRM_WORD = 'DELETE'

export function MultiDeleteDialog({
  open,
  onOpenChange,
  items,
  onDeleted,
}: MultiDeleteDialogProps) {
  const deleteExpressionsBatch = useExpressionLibraryStore(
    (state) => state.deleteExpressionsBatch
  )
  const mutating = useExpressionLibraryStore((state) => state.mutating)
  const [value, setValue] = useState('')

  const ids = useMemo(
    () => items.map((item) => item.id).filter((id) => id.trim()),
    [items]
  )
  const preview = useMemo(
    () => items.map((item) => item.expression).slice(0, 8),
    [items]
  )

  const handleDelete = async () => {
    await toast.promise(deleteExpressionsBatch({ ids }), {
      loading: '正在批量删除...',
      success: `已删除 ${ids.length} 条表达`,
      error: (err) => (err instanceof Error ? err.message : '删除失败'),
    })

    setValue('')
    onOpenChange(false)
    onDeleted?.()
  }

  return (
    <ConfirmDialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) setValue('')
      }}
      handleConfirm={handleDelete}
      disabled={value.trim() !== CONFIRM_WORD}
      isLoading={mutating}
      title='批量删除提示'
      desc={
        <div className='space-y-4'>
          <p className='mb-2'>
            <AlertTriangle
              className='me-1 inline-block stroke-destructive'
              size={18}
            />
            已选中 <span className='font-semibold'>{ids.length}</span> 条表达，
            操作不可撤销。
          </p>

          {preview.length > 0 && (
            <div className='text-sm text-muted-foreground'>
              {preview.join(', ')}
              {items.length > preview.length ? ' ...' : null}
            </div>
          )}
        </div>
      }
      confirmText='删除'
      cancelBtnText='取消'
      className='w-80'
      destructive
    />
  )
}
