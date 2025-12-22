import { useEffect, useState } from 'react'
import { Loader2, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useWordLibraryStore } from '../store'
import { WordLibraryBatchAddDialog } from './word-library-batch-add-dialog'

export function WordLibraryHeader() {
  const word = useWordLibraryStore((state) => state.word)
  const order = useWordLibraryStore((state) => state.order)
  const page = useWordLibraryStore((state) => state.page)
  const pageSize = useWordLibraryStore((state) => state.pageSize)
  const loading = useWordLibraryStore((state) => state.loading)
  const setWord = useWordLibraryStore((state) => state.setWord)
  const resetFilters = useWordLibraryStore((state) => state.resetFilters)
  const fetchWords = useWordLibraryStore((state) => state.fetchWords)

  const [showBatchAdd, setShowBatchAdd] = useState(false)
  const [draftWord, setDraftWord] = useState(word)

  const statusesKey = useWordLibraryStore((state) => state.statuses.join(','))

  useEffect(() => {
    fetchWords()
  }, [fetchWords, word, statusesKey, order, page, pageSize])

  useEffect(() => {
    setDraftWord(word)
  }, [word])

  const handleSearch = () => {
    setWord(draftWord.trim())
  }

  const handleReset = () => {
    resetFilters()
  }

  return (
    <div className='flex w-full flex-wrap items-center gap-3'>
      <div className='flex flex-1 items-center gap-3'>
        <Input
          placeholder='搜索单词'
          value={draftWord}
          onChange={(event) => setDraftWord(event.target.value)}
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

      <WordLibraryBatchAddDialog
        open={showBatchAdd}
        onOpenChange={setShowBatchAdd}
      />
    </div>
  )
}
