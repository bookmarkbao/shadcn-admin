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
  page: number
  pageSize: number
  data: UWord[]
  pages: WordLibraryPages | null
  loading: boolean
  error: string | null
  setWord: (value: string) => void
  toggleStatus: (value: UWordStatus) => void
  resetFilters: () => void
  setPage: (value: number) => void
  setPageSize: (value: number) => void
  setData: (value: UWord[]) => void
  setError: (value: string | null) => void
  setLoading: (value: boolean) => void
  fetchWords: () => Promise<void>
}

export const useWordLibraryStore = create<WordLibraryState>((set, get) => ({
  word: '',
  statuses: [],
  page: 1,
  pageSize: 10,
  data: [],
  pages: null,
  loading: false,
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
  fetchWords: async () => {
    const { word, statuses, page, pageSize } = get()
    set({ loading: true, error: null })

    const query = new URLSearchParams({
      _limit: pageSize.toString(),
      _page: page.toString(),
    })

    if (word.trim()) {
      query.set('word_like', word.trim())
    }

    if (statuses.length > 0) {
      query.set('status', statuses.join(','))
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
}))
