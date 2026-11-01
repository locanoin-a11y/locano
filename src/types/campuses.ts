export interface CampusHubConfig {
  id: string
  name: string
  subtitle: string
  locality: string
  tag: string
  badgeBg: string
}

export interface CampusHubWithCounts extends CampusHubConfig {
  pgCount: number
  messCount: number
}

/**
 * Centralized campus-to-locality mapping.
 * Each campus maps to its primary student residential locality.
 * Easily extensible for additional colleges.
 */
export const CAMPUS_CONFIGS: CampusHubConfig[] = [
  {
    id: "nitk-surathkal",
    name: "NITK Surathkal",
    subtitle: "National Institute of Technology",
    locality: "Surathkal",
    tag: "Engineering & Tech",
    badgeBg: "bg-blue-50 text-[#1f6fe5] border-blue-200/60",
  },
  {
    id: "yenepoya-university",
    name: "Yenepoya University",
    subtitle: "Medical, Dental & Allied Sciences",
    locality: "Deralakatte",
    tag: "Medical Hub",
    badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
  },
  {
    id: "kshema-nitte",
    name: "KSHEMA / Nitte",
    subtitle: "K.S. Hegde Medical Academy",
    locality: "Deralakatte",
    tag: "Health Sciences",
    badgeBg: "bg-purple-50 text-purple-700 border-purple-200/60",
  },
  {
    id: "father-muller",
    name: "Father Muller",
    subtitle: "Medical & Nursing College",
    locality: "Kankanady",
    tag: "Healthcare",
    badgeBg: "bg-rose-50 text-rose-700 border-rose-200/60",
  },
  {
    id: "st-aloysius",
    name: "St. Aloysius University",
    subtitle: "Autonomous Multi-Disciplinary",
    locality: "Hampankatta",
    tag: "Central Campus",
    badgeBg: "bg-amber-50 text-amber-800 border-amber-200/60",
  },
]

const VERIFIED_LOCALITY_ALIASES: Record<string, string[]> = {
  surathkal: ["surathkal", "suratkal", "suratkall", "surathcal", "surathkall", "nitk"],
  deralakatte: [
    "deralakatte",
    "derlakatte",
    "derlakate",
    "daralakatte",
    "darlakatte",
    "kshema",
    "yenepoya",
    "nitte",
    "dharalakatte",
  ],
  kankanady: ["kankanady", "kankanadi", "kankannady", "kankanaddy", "kankanaday", "father muller", "fathmuller"],
  hampankatta: ["hampankatta", "hampankata", "hampanakatta", "hampankatte", "st aloysius", "aloysius"],
}

function cleanText(text: string): string {
  if (!text) return ""
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Checks whether a listing's registered area matches a campus's target locality.
 * Reuses verified spelling variations and aliases.
 * Strictly prevents false matches on unrelated areas.
 */
export function matchesCampusLocality(listingArea: string, targetLocality: string): boolean {
  if (!listingArea || !targetLocality) return false

  const cleanListing = cleanText(listingArea)
  const cleanTarget = cleanText(targetLocality)

  if (cleanListing === cleanTarget) return true

  // Check verified aliases for the target locality
  const aliases = VERIFIED_LOCALITY_ALIASES[cleanTarget] || [cleanTarget]
  return aliases.some((alias) => cleanListing === alias || cleanListing.includes(alias))
}

/**
 * Calculates live counts for each campus hub from listing arrays.
 * Strictly enforces business rules:
 * - Only includes status === "published"
 * - Excludes pending, rejected, archived, or draft listings
 * - Excludes demo listings (isDemo === true)
 */
export function calculateCampusCounts<
  A extends { area?: string; status?: string; isDemo?: boolean },
  M extends { area?: string; status?: string; isDemo?: boolean }
>(
  campuses: CampusHubConfig[],
  accommodations: A[],
  messes: M[]
): CampusHubWithCounts[] {
  const validPgs = accommodations.filter(
    (item) => item.status === "published" && !item.isDemo
  )
  const validMesses = messes.filter(
    (item) => item.status === "published" && !item.isDemo
  )

  return campuses.map((campus) => {
    const pgCount = validPgs.filter((pg) =>
      matchesCampusLocality(pg.area || "", campus.locality)
    ).length

    const messCount = validMesses.filter((m) =>
      matchesCampusLocality(m.area || "", campus.locality)
    ).length

    return {
      ...campus,
      pgCount,
      messCount,
    }
  })
}

