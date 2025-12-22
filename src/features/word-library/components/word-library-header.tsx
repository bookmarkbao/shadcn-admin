import { useEffect } from 'react'
import { Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { type UWordStatus } from '../data/types'
import { useWordLibraryStore } from '../store'

const statusFilters: { label: string; value: UWordStatus }[] = [
  { label: '新词', value: 'new' },
  { label: '学习中', value: 'learning' },
  { label: '已掌握', value: 'mastered' },
  { label: '忽略', value: 'ignored' },
]

export function WordLibraryHeader() {
  const word = useWordLibraryStore((state) => state.word)
  const statuses = useWordLibraryStore((state) => state.statuses)
  const page = useWordLibraryStore((state) => state.page)
  const pageSize = useWordLibraryStore((state) => state.pageSize)
  const loading = useWordLibraryStore((state) => state.loading)
  const pages = useWordLibraryStore((state) => state.pages)
  const setWord = useWordLibraryStore((state) => state.setWord)
  const toggleStatus = useWordLibraryStore((state) => state.toggleStatus)
  const resetFilters = useWordLibraryStore((state) => state.resetFilters)
  const fetchWords = useWordLibraryStore((state) => state.fetchWords)

  const statusSummary = pages
    ? `共 ${pages.total.toLocaleString()} 条词`
    : '正在加载词数...'

  const statusesKey = statuses.join(',')

  useEffect(() => {
    fetchWords()
  }, [fetchWords, word, statusesKey, page, pageSize])

  return (
    <div className='flex w-full flex-wrap items-center gap-3'>
      <div className='flex flex-1 items-center gap-3'>
        <Input
          placeholder='搜索单词'
          value={word}
          onChange={(event) => setWord(event.target.value)}
          className='h-10 flex-1'
        />
        <Button variant='outline' size='sm' onClick={resetFilters}>
          重置
        </Button>
      </div>

      <div className='flex flex-1 flex-wrap items-center gap-2 text-sm text-muted-foreground'>
        {statusFilters.map((filter) => {
          const active = statuses.includes(filter.value)
          return (
            <Badge
              key={filter.value}
              variant={active ? 'secondary' : 'outline'}
              className='cursor-pointer'
              onClick={() => toggleStatus(filter.value)}
            >
              {filter.label}
            </Badge>
          )
        })}
      </div>

      <div className='flex items-center gap-2 text-sm text-muted-foreground'>
        <span>{statusSummary}</span>
        {loading && (
          <Loader2 className='h-4 w-4 animate-spin text-muted-foreground' />
        )}
      </div>
    </div>
  )
}
