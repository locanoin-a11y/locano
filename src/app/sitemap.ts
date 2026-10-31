import type { MetadataRoute } from "next"
import { buses } from "@/data/buses"
import { stops } from "@/data/stops"
import { createClient } from "@supabase/supabase-js"

const BASE_URL = "https://locano.in"

/**
 * Create a lightweight Supabase client for sitemap generation.
 * Uses anon key (public, read-only via RLS) — no cookies needed since
 * sitemaps don't require user sessions.
 */
function getSitemapSupabaseClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !key || !url.startsWith("https://")) return null
  return createClient(url, key)
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const lastModified = new Date()

  // ── Static routes ──────────────────────────────────────────────────
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/transport`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/transport/near`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/transport/route/balmatta-to-deralakatte`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/transport/route/state-bank-to-surathkal`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/accommodation`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/mess`,
      lastModified,
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/emergency`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ]

  // ── Transport dynamic routes ───────────────────────────────────────
  const busRoutes: MetadataRoute.Sitemap = buses.map((bus) => ({
    url: `${BASE_URL}/transport/bus/${encodeURIComponent(bus.id)}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  const stopRoutes: MetadataRoute.Sitemap = stops.map((stop) => ({
    url: `${BASE_URL}/transport/stop/${encodeURIComponent(stop.id)}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 0.7,
  }))

  // ── Dynamic Supabase routes (accommodation + mess listings) ────────
  let accommodationRoutes: MetadataRoute.Sitemap = []
  let messRoutes: MetadataRoute.Sitemap = []

  const supabase = getSitemapSupabaseClient()
  if (supabase) {
    try {
      const [accResult, messResult] = await Promise.all([
        supabase
          .from("accommodation_listings")
          .select("id, updated_at")
          .eq("status", "published"),
        supabase
          .from("mess_listings")
          .select("id, updated_at")
          .eq("status", "published"),
      ])

      if (accResult.data) {
        accommodationRoutes = accResult.data.map((row) => ({
          url: `${BASE_URL}/accommodation/${row.id}`,
          lastModified: row.updated_at ? new Date(row.updated_at) : lastModified,
          changeFrequency: "weekly",
          priority: 0.8,
        }))
      }

      if (messResult.data) {
        messRoutes = messResult.data.map((row) => ({
          url: `${BASE_URL}/mess/${row.id}`,
          lastModified: row.updated_at ? new Date(row.updated_at) : lastModified,
          changeFrequency: "weekly",
          priority: 0.8,
        }))
      }
    } catch {
      // Silently fall back to static-only sitemap if DB is unreachable
    }
  }

  return [
    ...staticRoutes,
    ...busRoutes,
    ...stopRoutes,
    ...accommodationRoutes,
    ...messRoutes,
  ]
}
