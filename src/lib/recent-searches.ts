export type RecentSearch = {
  id: string
  label: string
  href: string
  at: number
}

const KEY = "locano.recent"
export const RECENT_EVENT = "locano-recent"

function isRecent(value: unknown): value is RecentSearch {
  if (!value || typeof value !== "object") return false
  const item = value as Partial<RecentSearch>
  return (
    typeof item.id === "string" &&
    typeof item.label === "string" &&
    typeof item.href === "string" &&
    item.href.startsWith("/") &&
    typeof item.at === "number"
  )
}

export function readRecent(): RecentSearch[] {
  if (typeof window === "undefined") return []
  try {
    const parsed = JSON.parse(window.localStorage.getItem(KEY) || "[]") as unknown
    if (!Array.isArray(parsed)) return []
    return parsed.filter(isRecent).slice(0, 6)
  } catch {
    return []
  }
}

export function pushRecent(item: Omit<RecentSearch, "at">) {
  if (typeof window === "undefined") return
  const next = [
    { ...item, at: Date.now() },
    ...readRecent().filter((entry) => entry.id !== item.id),
  ].slice(0, 6)
  window.localStorage.setItem(KEY, JSON.stringify(next))
  window.dispatchEvent(new Event(RECENT_EVENT))
}

export function clearRecent() {
  if (typeof window === "undefined") return
  window.localStorage.removeItem(KEY)
  window.dispatchEvent(new Event(RECENT_EVENT))
}

export function formatAgo(at: number) {
  const minutes = Math.max(0, Date.now() - at) / 60000
  if (minutes < 1) return "Just now"
  if (minutes < 60) {
    const rounded = Math.round(minutes)
    return `${rounded} min ago`
  }
  const hours = minutes / 60
  if (hours < 24) {
    const rounded = Math.round(hours)
    return rounded === 1 ? "1 hour ago" : `${rounded} hours ago`
  }
  const days = hours / 24
  if (days < 2) return "1 day ago"
  if (days < 7) return `${Math.round(days)} days ago`
  if (days < 14) return "1 week ago"
  const weeks = Math.round(days / 7)
  return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`
}