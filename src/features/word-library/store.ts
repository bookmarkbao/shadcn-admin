import { create } from 'zustand'
import type { UWord, UWordStatus } from './data/types'

export type WordLibraryPages = {
  page: number
  pageSize: number
  next: number | null
  previous: number | null
  last: number
  total: number
}

const API_BASE_URL =
  import.meta.env.VITE_WORD_LIBRARY_API ??
  'http://127.0.0.1:23333/api/db/user_words'

type RawWordRecord = {
  word: string
  status: UWordStatus
  added_at: number
  updated_at: number
}

type WordLibraryApiResponse = {
  success: number
  data?: RawWordRecord[]
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
  json: WordLibraryApiResponse,
  defaultPage: number,
  defaultPageSize: number
): WordLibraryPages => ({
  page: json.pages?.page ?? defaultPage,
  pageSize: json.pages?.pageSize ?? defaultPageSize,
  next: json.pages?.next ?? null,
  previous: json.pages?.previous ?? null,
  last: json.pages?.last ?? 0,
  total:
    json.pages?.total ?? (Array.isArray(json.data) ? json.data.length : 0),
})

type WordLibraryState = {
  word: string
  statuses: UWordStatus[]
  order: string
  page: number
  pageSize: number
  data: UWord[]
  pages: WordLibraryPages | null
  loading: boolean
  mutating: boolean
  error: string | null
  setWord: (value: string) => void
  toggleStatus: (value: UWordStatus) => void
  resetFilters: () => void
  setOrder: (value: string) => void
  setPage: (value: number) => void
  setPageSize: (value: number) => void
  setData: (value: UWord[]) => void
  setError: (value: string | null) => void
  setLoading: (value: boolean) => void
  setMutating: (value: boolean) => void
  fetchWords: () => Promise<void>
  createWordsBatch: (payload: { words: string[]; status: UWordStatus }) => Promise<void>
  updateWordsStatusBatch: (payload: {
    words: string[]
    status: UWordStatus
  }) => Promise<void>
  deleteWordsBatch: (payload: { words: string[] }) => Promise<void>
  updateWordStatus: (payload: { word: string; status: UWordStatus }) => Promise<void>
  deleteWord: (payload: { word: string }) => Promise<void>
}

const parseErrorMessage = async (response: Response) => {
  const fallback = `${response.status} ${response.statusText}`.trim()
  try {
    const json = (await response.json()) as Partial<WordLibraryApiResponse>
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
): asserts json is WordLibraryApiResponse {
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

export const useWordLibraryStore = create<WordLibraryState>((set, get) => ({
  word: '',
  statuses: [],
  order: '',
  page: 1,
  pageSize: 10,
  data: [],
  pages: null,
  loading: false,
  mutating: false,
  error: null,
  setWord: (value) =>
    set(() => ({ word: value, page: 1 })), // reset to first page when filter changes
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
      word: '',
      statuses: [],
      order: '',
      page: 1,
    })),
  setOrder: (value) =>
    set(() => ({
      order: value,
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
  fetchWords: async () => {
    const { word, statuses, order, page, pageSize } = get()
    set({ loading: true, error: null })

    const query = new URLSearchParams({
      _limit: pageSize.toString(),
      _page: page.toString(),
    })

    if (word.trim()) {
      query.set('word_like', word.trim())
    }

    if (statuses.length > 0) {
      query.set('status_in', statuses.join(','))
    }

    if (order.trim()) {
      query.set('_order', order.trim())
    }

    try {
      const response = await fetch(`${API_BASE_URL}?${query.toString()}`)
      if (!response.ok) {
        throw new Error('Failed to load the word library.')
      }
      const json: WordLibraryApiResponse = await response.json()
      if (json.success !== 1) {
        throw new Error(json.message ?? 'Unexpected response from word library.')
      }

      const normalized: UWord[] =
        Array.isArray(json.data) && json.data.length > 0
          ? json.data.map((item) => ({
              word: item.word,
              status: item.status,
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
  createWordsBatch: async ({ words, status }) => {
    if (words.length === 0) return
    set({ mutating: true, error: null })
    const now = Date.now()

    try {
      const response = await fetch(`${API_BASE_URL}/batch-upsert`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conflictKeys: ['word'],
          items: words.map((word) => ({
            word,
            status,
            added_at: now,
            updated_at: now,
          })),
        }),
      })

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to add words.')

      await get().fetchWords()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  updateWordsStatusBatch: async ({ words, status }) => {
    if (words.length === 0) return
    set({ mutating: true, error: null })
    const now = Date.now()

    try {
      const response = await fetch(`${API_BASE_URL}/batch`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(
          words.map((word) => ({
            word,
            status,
            updated_at: now,
          }))
        ),
      })

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to update words.')

      await get().fetchWords()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  deleteWordsBatch: async ({ words }) => {
    if (words.length === 0) return
    set({ mutating: true, error: null })

    try {
      const response = await fetch(`${API_BASE_URL}/batch`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: words }),
      })

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to delete words.')

      await get().fetchWords()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  updateWordStatus: async ({ word, status }) => {
    if (!word.trim()) return
    set({ mutating: true, error: null })
    const now = Date.now()

    try {
      const response = await fetch(
        `${API_BASE_URL}/${encodeURIComponent(word)}`,
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
      assertSuccess(json, 'Failed to update the word.')

      await get().fetchWords()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
  deleteWord: async ({ word }) => {
    if (!word.trim()) return
    set({ mutating: true, error: null })

    try {
      const response = await fetch(
        `${API_BASE_URL}/${encodeURIComponent(word)}`,
        {
          method: 'DELETE',
        }
      )

      if (!response.ok) {
        throw new Error(await parseErrorMessage(response))
      }

      const json = (await response.json()) as unknown
      assertSuccess(json, 'Failed to delete the word.')

      await get().fetchWords()
      set({ mutating: false })
    } catch (error) {
      set({
        mutating: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      })
      throw error
    }
  },
}))
