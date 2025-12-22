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
import { type UWordStatus } from '../data/types'
import { useWordLibraryStore } from '../store'
import { WordLibraryStatusPicker } from './word-library-status-picker'

type WordLibraryBatchAddDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

const parseWords = (text: string) => {
  const tokens = text
    .split(/[,\n]/g)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
  return Array.from(new Set(tokens))
}

export function WordLibraryBatchAddDialog({
  open,
  onOpenChange,
}: WordLibraryBatchAddDialogProps) {
  const createWordsBatch = useWordLibraryStore((state) => state.createWordsBatch)
  const mutating = useWordLibraryStore((state) => state.mutating)

  const [raw, setRaw] = useState('')
  const [status, setStatus] = useState<UWordStatus>('new')

  const words = useMemo(() => parseWords(raw), [raw])

  const handleAdd = async () => {
    if (words.length === 0) {
      toast.error('请输入要添加的单词（换行或逗号分隔）')
      return
    }

    await toast.promise(createWordsBatch({ words, status }), {
      loading: '正在批量添加...',
      success: `已提交添加 ${words.length} 个单词`,
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
          <DialogTitle>批量添加单词</DialogTitle>
          <DialogDescription>
            支持换行或逗号分隔，自动去重并转换为小写。
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4'>
          <Label className='space-y-1.5'>
            <Textarea
              value={raw}
              onChange={(e) => setRaw(e.target.value)}
              placeholder={'apple\nbanana, orange'}
              className='min-h-40'
            />
          
          </Label>

          <div className='space-y-1.5'>
            <Label>初始状态</Label>
            <WordLibraryStatusPicker value={status} onChange={setStatus} />
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={() => onOpenChange(false)}>
            取消
          </Button>
          <Button onClick={handleAdd} disabled={mutating || words.length === 0}>
            批量添加
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
