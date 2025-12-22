import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { type UWord } from '../data/types'
import { useWordLibraryStore } from '../store'

type WordLibraryDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow: UWord
}

export function WordLibraryDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: WordLibraryDeleteDialogProps) {
  const deleteWord = useWordLibraryStore((state) => state.deleteWord)
  const mutating = useWordLibraryStore((state) => state.mutating)

  const handleDelete = async () => {
    await toast.promise(deleteWord({ word: currentRow.word }), {
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
          />确认删除 <span className='font-semibold'>{currentRow.word}</span>？
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
