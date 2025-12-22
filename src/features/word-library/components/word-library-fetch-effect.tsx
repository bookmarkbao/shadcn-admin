import { useEffect } from 'react'
import { useWordLibraryStore } from '../store'

export function WordLibraryFetchEffect() {
  const word = useWordLibraryStore((state) => state.word)
  const statusesKey = useWordLibraryStore((state) => state.statuses.join(','))
  const order = useWordLibraryStore((state) => state.order)
  const updatedAtPreset = useWordLibraryStore((state) => state.updatedAtPreset)
  const updatedAtGte = useWordLibraryStore((state) => state.updatedAtGte)
  const updatedAtLte = useWordLibraryStore((state) => state.updatedAtLte)
  const page = useWordLibraryStore((state) => state.page)
  const pageSize = useWordLibraryStore((state) => state.pageSize)
  const fetchWords = useWordLibraryStore((state) => state.fetchWords)

  useEffect(() => {
    fetchWords()
  }, [
    fetchWords,
    word,
    statusesKey,
    order,
    updatedAtPreset,
    updatedAtGte,
    updatedAtLte,
    page,
    pageSize,
  ])

  return null
}

