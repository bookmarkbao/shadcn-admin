import { useEffect, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useExpressionLibraryStore } from '../store'
import { BatchAddDialog } from './batch-add-dialog'

export function Header() {
  const expression = useExpressionLibraryStore((state) => state.expression)
  const loading = useExpressionLibraryStore((state) => state.loading)
  const setExpression = useExpressionLibraryStore((state) => state.setExpression)
  const resetFilters = useExpressionLibraryStore((state) => state.resetFilters)


  const [showBatchAdd, setShowBatchAdd] = useState(false)
  const [draftExpression, setDraftExpression] = useState(expression)

  useEffect(() => {
    setDraftExpression(expression)
  }, [expression])

  const handleSearch = () => {
    setExpression(draftExpression.trim())
  }

  const handleReset = () => {
    resetFilters()
  }

  return (
    <div className='flex w-full flex-wrap items-center gap-3'>
      <div className='flex flex-1 items-center gap-3'>
        <Input
          placeholder='搜索表达'
          value={draftExpression}
          onChange={(event) => setDraftExpression(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleSearch()
            }
          }}
          className='w-60'
        />
        <Button size='sm' onClick={handleSearch}>
          搜索
        </Button>
        <Button variant='outline' size='sm' onClick={handleReset}>
          重置
        </Button>
      </div>

      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <Button size='sm' onClick={() => setShowBatchAdd(true)}>
          <Plus className='me-1 h-4 w-4' />
          批量添加
        </Button>

        {loading && (
          <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
        )}
      </div>

      <BatchAddDialog
        open={showBatchAdd}
        onOpenChange={setShowBatchAdd}
      />
    </div>
  )
}
