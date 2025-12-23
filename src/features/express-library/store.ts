import { create } from 'zustand'
import { adaptiveFetch } from '@/lib/adaptive-fetch'
import type { UExpression, UExpressionStatus } from './data/types'

export type ExpressionLibraryPages = {
  page: number
  pageSize: number
  next: number | null
  previous: number | null
  last: number
  total: number
}

const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL ?? 'http://127.0.0.1:23333') +
  '/api/db/user_expressions'

type RawExpressionRecord = {
  id: string
  expression: string
  meaning?: string | null
  note?: string | null
  status: unknown
  practice_count?: number
  usage_count?: number
  tags?: string | null
  added_at: number
  updated_at: number
}

type ExpressionLibraryApiResponse = {
  success: number
  data?: RawExpressionRecord[]
  id?: unknown
  pages?: {
    page?: number
    pageSize?: number
    next?: number | null
    previous?: number | null
    last?: number
    total?: number
  }
  message?: string
}

const normalizePages = (
  json: ExpressionLibraryApiResponse,
  defaultPage: number,
  defaultPageSize: number
): ExpressionLibraryPages => ({
  page: json.pages?.page ?? defaultPage,
  pageSize: json.pages?.pageSize ?? defaultPageSize,
  next: json.pages?.next ?? null,
  previous: json.pages?.previous ?? null,
  last: json.pages?.last ?? 0,
  total: json.pages?.total ?? (Array.isArray(json.data) ? json.data.length : 0),
})

const normalizeUExpressionStatus = (value: unknown): UExpressionStatus => {
  if (
    value === 'new' ||
    value === 'learning' ||
    value === 'mastered' ||
    value === 'fluent' ||
    value === 'transferable' ||
    value === 'ignored'
  ) {
    return value
  }
  return 'new'
}

type ExpressionLibraryState = {
  expression: string
  statuses: UExpressionStatus[]
  order: string
  updatedAtPreset: string
  updatedAtGte: number | null
  updatedAtLte: number | null
  page: number
  pageSize: number
  data: UExpression[]
  pages: ExpressionLibraryPages | null
  loading: boolean
  mutating: boolean
  error: string | null
  isFluid: boolean
  toggleFluid: () => void
  setExpression: (value: string) => void
  toggleStatus: (value: UExpressionStatus) => void
  resetFilters: () => void
  setOrder: (value: string) => void
  setUpdatedAtFilter: (value: {
    preset: string
    gte: number | null
    lte: number | null
  }) => void
  setPage: (value: number) => void
  setPageSize: (value: number) => void
  setData: (value: UExpression[]) => void
  setError: (value: string | null) => void
  setLoading: (value: boolean) => void
  setMutating: (value: boolean) => void
  fetchExpressions: () => Promise<void>
  createExpressionsBatch: (payload: {
    expressions: string[]
    status: UExpressionStatus
  }) => Promise<void>
  updateExpressionsStatusBatch: (payload: {
    ids: string[]
    status: UExpressionStatus
  }) => Promise<void>
  deleteExpressionsBatch: (payload: { ids: string[] }) => Promise<void>
  updateExpressionStatus: (payload: {
    id: string
    status: UExpressionStatus
  }) => Promise<void>
  deleteExpression: (payload: { id: string }) => Promise<void>
}

const parseErrorMessage = async (response: Response) => {
  const fallback = `${response.status} ${response.statusText}`.trim()
  try {
    const json = (await response.json()) as Partial<ExpressionLibraryApiResponse>
    if (typeof json.message === 'string' && json.message.trim()) {
      return json.message
    }
  } catch {
    // ignore
  }
  return fallback || 'Request failed'
}

function assertSuccess(
  json: unknown,
  fallbackMessage: string
): asserts json is ExpressionLibraryApiResponse {
  if (
    !json ||
    typeof json !== 'object' ||
    !('success' in json) ||
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (json as any).success !== 1
  ) {
    const message =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      typeof (json as any)?.message === 'string' ? (json as any).message : null
    throw new Error(message ?? fallbackMessage)
  }
}

export const useExpressionLibraryStore = create<ExpressionLibraryState>(
  (set, get) => ({
  expression: '',
  statuses: [],
  order: '',
  updatedAtPreset: '',
  updatedAtGte: null,
  updatedAtLte: null,
  page: 1,
  pageSize: 10,
  data: [],
  pages: null,
  loading: false,
  mutating: false,
  error: null,
  isFluid: true,
  setExpression: (value) => set(() => ({ expression: value, page: 1 })), // reset to first page when filter changes
  toggleStatus: (value) =>
    set((state) => {
      const exists = state.statuses.includes(value)
      const statuses = exists
        ? state.statuses.filter((status) => status !== value)
        : [...state.statuses, value]
      return { statuses, page: 1 }
    }),
  resetFilters: () =>
    set(() => ({
      expression: '',
      statuses: [],
      order: '',
      updatedAtPreset: '',
      updatedAtGte: null,
      updatedAtLte: null,
      page: 1,
    })),
  setOrder: (value) =>
    set(() => ({
      order: value,
      page: 1,
    })),
  setUpdatedAtFilter: ({ preset, gte, lte }) =>
    set(() => ({
      updatedAtPreset: preset,
      updatedAtGte: gte,
      updatedAtLte: lte,
      page: 1,
    })),
  setPage: (value) =>
    set((state) => ({
      page: value,
      pageSize: state.pageSize,
    })),
  setPageSize: (value) =>
    set(() => ({
      pageSize: value,
      page: 1,
    })),
  setData: (value) => set({ data: value }),
  setError: (value) => set({ error: value }),
  setLoading: (value) => set({ loading: value }),
  setMutating: (value) => set({ mutating: value }),
  fetchExpressions: async () => {
    const {
      expression,
      statuses,
      order,
      updatedAtGte,
      updatedAtLte,
      page,
      pageSize,
    } = get()
    set({ loading: true, error: null })

    const query = new URLSearchParams({
      _limit: pageSize.toString(),
      _page: page.toString(),
    })

    if (expression.trim()) {
      query.set('expression_like', expression.trim())
    }

    if (statuses.length > 0) {
      query.set('status_in', statuses.join(','))
    }

    if (order.trim()) {
      query.set('_order', order.trim())
    }

    if (typeof updatedAtGte === 'number') {
      query.set('updated_at_gte', updatedAtGte.toString())
    }

    if (typeof updatedAtLte === 'number') {
      query.set('updated_at_lte', updatedAtLte.toString())
    }

    try {
      const response = await adaptiveFetch(`${API_BASE_URL}?${query.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load the expression library.')
      }
      const json: ExpressionLibraryApiResponse = await response.json()
      if (json.success !== 1) {
        throw new Error(
          json.message ?? 'Unexpected response from expression library.'
        )
      }

      const normalized: UExpression[] =
        Array.isArray(json.data) && json.data.length > 0
          ? json.data.map((item) => ({
              id: item.id,
              expression: item.expression,
              meaning: item.meaning ?? null,
              note: item.note ?? null,
              status: normalizeUExpressionStatus(item.status),
              practiceCount: item.practice_count ?? 0,
              usageCount: item.usage_count ?? 0,
              tags: item.tags ?? null,
              addedAt: item.added_at,
              updatedAt: item.updated_at,
            }))
          : []

      set({
        data: normalized,
        pages: normalizePages(json, page, pageSize),
        loading: false,
      })
    } catch (error) {
      set({
        data: [],
        pages: null,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
    }
  },
  createExpressionsBatch: async ({ expressions, status }) => {
    if (expressions.length === 0) return
    set({ mutating: true, error: null })
    const now = Date.now()

    try {
      const response = await adaptiveFetch(`${API_BASE_URL}/batch`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          expressions.map((expressionItem) => ({
            id: crypto.randomUUID(),
            expression: expressionItem,
            status,
            added_at: now,
            updated_at: now,
          }))
        ),
      })

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to add expressions.')

      await get().fetchExpressions()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  updateExpressionsStatusBatch: async ({ ids, status }) => {
    if (ids.length === 0) return
    set({ mutating: true, error: null })
    const now = Date.now()

    try {
      const response = await adaptiveFetch(`${API_BASE_URL}/batch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          ids.map((id) => ({
            id,
            status,
            updated_at: now,
          }))
        ),
      })

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to update expressions.')

      await get().fetchExpressions()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  deleteExpressionsBatch: async ({ ids }) => {
    if (ids.length === 0) return
    set({ mutating: true, error: null })

    try {
      const response = await adaptiveFetch(`${API_BASE_URL}/batch`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids }),
      })

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to delete expressions.')

      await get().fetchExpressions()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  updateExpressionStatus: async ({ id, status }) => {
    if (!id.trim()) return
    set({ mutating: true, error: null })
    const now = Date.now()

    try {
      const response = await adaptiveFetch(
        `${API_BASE_URL}/${encodeURIComponent(id)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, updated_at: now }),
        }
      )

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to update the expression.')

      await get().fetchExpressions()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  deleteExpression: async ({ id }) => {
    if (!id.trim()) return
    set({ mutating: true, error: null })

    try {
      const response = await adaptiveFetch(
        `${API_BASE_URL}/${encodeURIComponent(id)}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to delete the expression.')

      await get().fetchExpressions()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  toggleFluid: () =>
    set((state) => ({
      isFluid: !state.isFluid,
    })),
  }))
