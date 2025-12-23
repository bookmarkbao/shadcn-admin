import { useEffect } from 'react'
import { useExpressionLibraryStore } from '../store'

export function FetchEffect() {
  const expression = useExpressionLibraryStore((state) => state.expression)
  const statusesKey = useExpressionLibraryStore((state) =>
    state.statuses.join(',')
  )
  const order = useExpressionLibraryStore((state) => state.order)
  const updatedAtPreset = useExpressionLibraryStore(
    (state) => state.updatedAtPreset
  )
  const updatedAtGte = useExpressionLibraryStore((state) => state.updatedAtGte)
  const updatedAtLte = useExpressionLibraryStore((state) => state.updatedAtLte)
  const page = useExpressionLibraryStore((state) => state.page)
  const pageSize = useExpressionLibraryStore((state) => state.pageSize)
  const fetchExpressions = useExpressionLibraryStore(
    (state) => state.fetchExpressions
  )

  useEffect(() => {
    fetchExpressions()
  }, [
    fetchExpressions,
    expression,
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
