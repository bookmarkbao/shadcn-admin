import { useMemo, useState } from 'react'
import { AlertTriangle } from 'lucide-react'
import { toast } from 'sonner'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useWordLibraryStore } from '../store'

type WordLibraryMultiDeleteDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  words: string[]
  onDeleted?: () => void
}

const CONFIRM_WORD = 'DELETE'

export function WordLibraryMultiDeleteDialog({
  open,
  onOpenChange,
  words,
  onDeleted,
}: WordLibraryMultiDeleteDialogProps) {
  const deleteWordsBatch = useWordLibraryStore(
    (state) => state.deleteWordsBatch
  )
  const mutating = useWordLibraryStore((state) => state.mutating)
  const [value, setValue] = useState('')

  const preview = useMemo(() => words.slice(0, 8), [words])

  const handleDelete = async () => {
    if (value.trim() !== CONFIRM_WORD) {
      toast.error(`请输入 "${CONFIRM_WORD}" 确认删除`)
      return
    }

    await toast.promise(deleteWordsBatch({ words }), {
      loading: '正在批量删除...',
      success: `已删除 ${words.length} 个单词`,
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
            已选中 <span className='font-semibold'>{words.length}</span>{' '}
            个单词，操作不可撤销。
          </p>

          {preview.length > 0 && (
            <div className='text-sm text-muted-foreground'>
              示例：{preview.join(', ')}
              {words.length > preview.length ? ' ...' : null}
            </div>
          )}

          <Label className='my-4 flex flex-col items-start gap-1.5'>
            <span>输入 "{CONFIRM_WORD}" 确认：</span>
            <Input
              value={value}
              onChange={(e) => setValue(e.target.value)}
              placeholder={`输入 "${CONFIRM_WORD}" 确认删除`}
            />
          </Label>

          <Alert variant='destructive'>
            <AlertTitle>注意</AlertTitle>
            <AlertDescription>
              删除后无法恢复，请谨慎操作。
            </AlertDescription>
          </Alert>
        </div>
      }
      confirmText='删除'
      cancelBtnText='取消'
      className='w-80'
      destructive
    />
  )
}
