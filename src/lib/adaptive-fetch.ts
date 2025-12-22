type MapiHttpRequestArgs = {
  path: string
  method?: string
  body?: unknown
  headers?: Record<string, string>
}

type MapiHttp = {
  request: (args: MapiHttpRequestArgs) => Promise<unknown>
}

const LOCAL_API_HOSTS = new Set(['127.0.0.1', 'localhost'])
const LOCAL_API_PORT = '23333'

const isMapiAvailable = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.$mapi?.http?.request === 'function'

const isPlainObject = (value: unknown): value is Record<string, unknown> => {
  if (!value || typeof value !== 'object') return false
  const proto = Object.getPrototypeOf(value)
  return proto === Object.prototype || proto === null
}

const toUrl = (input: RequestInfo | URL): URL | null => {
  if (input instanceof URL) return input
  if (typeof input === 'string') {
    try {
      return new URL(input, window.location.href)
    } catch {
      return null
    }
  }
  if (typeof Request !== 'undefined' && input instanceof Request) {
    try {
      return new URL(input.url)
    } catch {
      return null
    }
  }
  return null
}

const isLocalApiUrl = (url: URL): boolean =>
  (url.protocol === 'http:' || url.protocol === 'https:') &&
  LOCAL_API_HOSTS.has(url.hostname) &&
  (url.port || (url.protocol === 'https:' ? '443' : '80')) === LOCAL_API_PORT

const headersToRecord = (headers: HeadersInit | undefined) => {
  if (!headers) return undefined
  if (headers instanceof Headers) return Object.fromEntries(headers.entries())
  if (Array.isArray(headers)) return Object.fromEntries(headers)
  return headers
}

const normalizeBodyForMapi = (
  body: RequestInit['body'],
  headers: HeadersInit | undefined
) => {
  if (body == null) return { body: undefined, headers }
  if (typeof body === 'string') return { body, headers }
  if (body instanceof URLSearchParams) {
    const existing = headersToRecord(headers) ?? {}
    if (!('Content-Type' in existing) && !('content-type' in existing)) {
      existing['Content-Type'] = 'application/x-www-form-urlencoded;charset=UTF-8'
    }
    return { body: body.toString(), headers: existing }
  }
  if (isPlainObject(body)) {
    const existing = headersToRecord(headers) ?? {}
    if (!('Content-Type' in existing) && !('content-type' in existing)) {
      existing['Content-Type'] = 'application/json'
    }
    return { body: JSON.stringify(body), headers: existing }
  }
  return null
}

const responseFromMapiResult = (result: unknown): Response => {
  if (result instanceof Response) return result

  const status =
    result &&
    typeof result === 'object' &&
    'status' in result &&
    typeof result.status === 'number'
      ? result.status
      : 200

  const headers =
    result &&
    typeof result === 'object' &&
    'headers' in result &&
    result.headers &&
    typeof result.headers === 'object'
      ? new Headers(result.headers as Record<string, string>)
      : new Headers()

  const bodyValue =
    result && typeof result === 'object' && result !== null
      ? 'body' in result
        ? (result as { body?: unknown }).body
        : 'data' in result
          ? (result as { data?: unknown }).data
          : result
      : result

  if (typeof bodyValue === 'string') {
    return new Response(bodyValue, { status, headers })
  }

  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json')
  }

  return new Response(JSON.stringify(bodyValue ?? null), { status, headers })
}

/**
 * Like `fetch`, but will automatically route local API calls to `window.$mapi.http.request`
 * when running inside the `$mapi` environment.
 */
export async function adaptiveFetch(
  input: RequestInfo | URL,
  init: RequestInit = {}
): Promise<Response> {
  const url = typeof window !== 'undefined' ? toUrl(input) : null

  if (url && isLocalApiUrl(url) && isMapiAvailable()) {
    const normalized = normalizeBodyForMapi(init.body, init.headers)
    if (!normalized) return fetch(input, init)

    const mapiHttp = window.$mapi!.http as MapiHttp
    const result = await mapiHttp.request({
      path: `${url.pathname}${url.search}`,
      method: init.method ?? 'GET',
      body: normalized.body,
      headers: headersToRecord(normalized.headers),
    })
    return responseFromMapiResult(result)
  }

  return fetch(input, init)
}

