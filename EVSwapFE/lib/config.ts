const apiBase =
  process.env.NEXT_PUBLIC_API_BASE ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:8080"

if (!process.env.NEXT_PUBLIC_API_BASE && !process.env.NEXT_PUBLIC_API_URL) {
  console.warn(
    "[config] NEXT_PUBLIC_API_BASE not set. Falling back to http://localhost:8080. " +
      "Set NEXT_PUBLIC_API_BASE in your .env.local to silence this warning.",
  )
}

export const API_BASE_URL = apiBase.replace(/\/+$/, "")

