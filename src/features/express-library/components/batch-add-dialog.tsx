import { useMemo, useState } from 'react'
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
import { Textarea } from '@/components/ui/textarea'
import { type UExpressionStatus } from '../data/types'
import { useExpressionLibraryStore } from '../store'
import { StatusPicker } from './status-picker'

type BatchAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const parseExpressions = (text: string) => {
  const tokens = text
    .split(/[,\n]/g)
    .map((item) => item.trim())
    .filter(Boolean)
  return Array.from(new Set(tokens))
}

export function BatchAddDialog({ open, onOpenChange }: BatchAddDialogProps) {
  const createExpressionsBatch = useExpressionLibraryStore(
    (state) => state.createExpressionsBatch
  )
  const mutating = useExpressionLibraryStore((state) => state.mutating)

  const [raw, setRaw] = useState('')
  const [status, setStatus] = useState<UExpressionStatus>('new')

  const expressions = useMemo(() => parseExpressions(raw), [raw])

  const handleAdd = async () => {
    if (expressions.length === 0) {
      toast.error('请输入要添加的表达（换行或逗号分隔）')
      return
    }

    await toast.promise(createExpressionsBatch({ expressions, status }), {
      loading: '正在批量添加...',
      success: `已提交添加 ${expressions.length} 条表达`,
      error: (err) => (err instanceof Error ? err.message : '添加失败'),
    })

    setRaw('')
    onOpenChange(false)
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next)
        if (!next) {
          setRaw('')
          setStatus('new')
        }
      }}
    >
      <DialogContent className='sm:max-w-lg'>
        <DialogHeader className='text-start'>
          <DialogTitle>批量添加表达</DialogTitle>
          <DialogDescription>支持换行或逗号分隔，自动去重。</DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <Label className='space-y-1.5'>
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={'That makes sense.\nCould you elaborate?'}
              className='min-h-40'
            />
          </Label>

          <div className='space-y-1.5'>
            <Label>初始状态</Label>
            <StatusPicker value={status} onChange={setStatus} />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button
            onClick={handleAdd}
            disabled={mutating || expressions.length === 0}
          >
            批量添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
