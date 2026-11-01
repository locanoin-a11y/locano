import { fetchAccommodations } from "./accommodation"
import { fetchMesses } from "./mess"
import {
  CAMPUS_CONFIGS,
  calculateCampusCounts,
  type CampusHubConfig,
  type CampusHubWithCounts,
} from "@/types/campuses"

export {
  CAMPUS_CONFIGS,
  calculateCampusCounts,
  type CampusHubConfig,
  type CampusHubWithCounts,
}

/**
 * Fetches published listings from Supabase in a single parallel query
 * and aggregates actual counts for each student campus.
 */
export async function fetchCampusHubs(): Promise<{
  hubs: CampusHubWithCounts[]
  isFromDatabase: boolean
  error?: string
}> {
  try {
    const [accRes, messRes] = await Promise.all([
      fetchAccommodations(),
      fetchMesses(),
    ])

    const hubs = calculateCampusCounts(
      CAMPUS_CONFIGS,
      accRes.listings || [],
      messRes.listings || []
    )

    return {
      hubs,
      isFromDatabase: accRes.isFromDatabase && messRes.isFromDatabase,
      error: accRes.error || messRes.error,
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to fetch campus counts"
    return {
      hubs: CAMPUS_CONFIGS.map((c) => ({ ...c, pgCount: 0, messCount: 0 })),
      isFromDatabase: false,
      error: msg,
    }
  }
}
