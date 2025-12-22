export {}

declare global {
  interface Window {
    $mapi?: {
      http?: {
        request: (args: {
          path: string
          method?: string
          body?: unknown
          headers?: Record<string, string>
        }) => Promise<unknown>
      }
    }
  }
}

