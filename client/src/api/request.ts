export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

// Shared fetch wrapper: JSON in, JSON out, errors become thrown Errors.
// Relative URLs go through the Vite proxy in dev, so the jwt cookie is same-origin.
export async function request<T>(
  url: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })

  // Some responses (e.g. a plain-text 429) aren't JSON, so don't let parsing throw
  const body = await res.json().catch(() => null)

  if (!res.ok) {
    throw new ApiError(
      body?.message ?? 'Something went wrong. Try again.',
      res.status,
    )
  }

  return body?.data as T
}
