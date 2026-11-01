/**
 * LOCANO Smart Search & Fuzzy Matching Engine
 * High-performance, zero-external-API typo-tolerant search utility.
 * Implements Damerau–Levenshtein distance (insertions, deletions, substitutions, and adjacent transpositions)
 * with Mangaluru local geography awareness.
 */

// Master list of recognized Mangaluru areas & student localities
export const CANONICAL_MANGALURU_AREAS = [
  "Valencia",
  "Balmatta",
  "Deralakatte",
  "Kadri",
  "Kankanady",
  "Hampankatta",
  "Bejai",
  "Falnir",
  "Attavar",
  "Pumpwell",
  "Bendoor",
  "Bendoorwell",
  "Lalbagh",
  "Kodialbail",
  "Kottara",
  "Kottara Chowki",
  "Urwa",
  "Urwa Store",
  "Chilimbi",
  "Ladyhill",
  "Mannagudda",
  "Ballalbagh",
  "Bunts Hostel",
  "PVS Circle",
  "Surathkal",
  "Mudippu",
  "Adyar",
  "Jeppu",
  "Jeppu Market",
  "Pandeshwar",
  "Car Street",
  "State Bank",
  "Kapikad",
  "Mallikatte",
  "Nandigudda",
  "Bikarnakatte",
  "Kuntikana",
  "Padil",
  "Ullal",
  "Valachil",
  "Bondel",
  "Kavoor",
  "Derebail",
  "Maryhill",
  "Ashoknagar",
  "Yeyyadi",
  "Shaktinagar",
  "Kotekani",
  "Bolar",
  "Panambur",
  "Baikampady",
  "Konchady",
  "Jyothi",
] as const

// Known spelling variations and local college campus landmarks
export const AREA_SYNONYMS_AND_ALIASES: Record<string, string> = {
  // Deralakatte variations
  derlakatte: "Deralakatte",
  derlakate: "Deralakatte",
  deralakate: "Deralakatte",
  daralakatte: "Deralakatte",
  darlakatte: "Deralakatte",
  deralkatte: "Deralakatte",
  derlakatee: "Deralakatte",
  deralakatta: "Deralakatte",
  kshema: "Deralakatte",
  yenepoya: "Deralakatte",
  nitte: "Deralakatte",
  khema: "Deralakatte",

  // Valencia variations
  valancia: "Valencia",
  valenshiya: "Valencia",
  valenshia: "Valencia",
  velencia: "Valencia",
  valencia: "Valencia",

  // Hampankatta variations
  hampankata: "Hampankatta",
  hampanakatta: "Hampankatta",
  hampankatte: "Hampankatta",
  hampankatt: "Hampankatta",
  hampankatha: "Hampankatta",
  hampanakatte: "Hampankatta",

  // Balmatta variations
  balmata: "Balmatta",
  balmatha: "Balmatta",
  balmatte: "Balmatta",

  // Surathkal variations
  suratkal: "Surathkal",
  suratkall: "Surathkal",
  surathkall: "Surathkal",
  nitk: "Surathkal",

  // Kankanady variations
  kankanadi: "Kankanady",
  kankannady: "Kankanady",
  kankanaddy: "Kankanady",
  kankanaday: "Kankanady",
  "father muller": "Kankanady",
  fathmuller: "Kankanady",

  // Kadri & Mallikatte
  kadari: "Kadri",
  kadry: "Kadri",
  mallikate: "Mallikatte",
  malikatte: "Mallikatte",
  malikkatte: "Mallikatte",

  // Bejai & Kottara
  bijai: "Bejai",
  bejay: "Bejai",
  kottarachowki: "Kottara Chowki",
  "kottara chowki": "Kottara Chowki",

  // Pumpwell & Falnir
  pumpwel: "Pumpwell",
  pumpwal: "Pumpwell",
  falneer: "Falnir",
  falner: "Falnir",

  // Bendoor & Bendoorwell
  bendor: "Bendoor",
  bendoor: "Bendoor",
  bendorwell: "Bendoorwell",

  // Lalbagh & Jyothi
  lalbag: "Lalbagh",
  jyoti: "Jyothi",
  jyothycirle: "Jyothi",

  // State Bank
  statebank: "State Bank",
  "state bank": "State Bank",
}

/**
 * Normalizes text for typo matching: trims, converts to lowercase,
 * replaces multiple spaces, and normalizes common phonetic character sequences.
 */
export function normalizeSearchText(text: string): string {
  if (!text) return ""
  return text
    .toLowerCase()
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Computes Damerau–Levenshtein distance between two strings.
 * Handles:
 * - Insertions (e.g. Derlakate -> Deralakatte)
 * - Deletions (e.g. Hampankatta -> Hampankata)
 * - Substitutions (e.g. Valencia -> Valancia)
 * - Transpositions of adjacent characters (e.g. Deralkatte -> Deralakatte)
 */
export function damerauLevenshtein(source: string, target: string): number {
  const src = source.toLowerCase()
  const tgt = target.toLowerCase()
  const m = src.length
  const n = tgt.length

  if (m === 0) return n
  if (n === 0) return m
  if (src === tgt) return 0

  // 2D distance matrix
  const matrix: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0))

  for (let i = 0; i <= m; i++) matrix[i][0] = i
  for (let j = 0; j <= n; j++) matrix[0][j] = j

  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = src[i - 1] === tgt[j - 1] ? 0 : 1

      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,       // deletion
        matrix[i][j - 1] + 1,       // insertion
        matrix[i - 1][j - 1] + cost // substitution
      )

      // Transposition
      if (
        i > 1 &&
        j > 1 &&
        src[i - 1] === tgt[j - 2] &&
        src[i - 2] === tgt[j - 1]
      ) {
        matrix[i][j] = Math.min(matrix[i][j], matrix[i - 2][j - 2] + cost)
      }
    }
  }

  return matrix[m][n]
}

/**
 * Checks whether pattern and target match closely.
 * Max allowed distance is proportional to string length so short words don't overmatch.
 */
export function isFuzzyMatch(
  query: string,
  target: string,
  maxDistanceOverride?: number
): { isMatch: boolean; distance: number; score: number } {
  const q = normalizeSearchText(query)
  const t = normalizeSearchText(target)

  if (!q || !t) return { isMatch: false, distance: Infinity, score: 0 }

  // Exact match
  if (q === t) return { isMatch: true, distance: 0, score: 100 }

  // Prefix match
  if (t.startsWith(q)) return { isMatch: true, distance: 0, score: 90 }

  // Substring match
  if (t.includes(q)) return { isMatch: true, distance: 0, score: 80 }

  // Word token containment (e.g. "near valencia" -> matches "Valencia")
  const qTokens = q.split(" ").filter(Boolean)
  const tTokens = t.split(" ").filter(Boolean)

  if (qTokens.length > 1 && qTokens.every((token) => t.includes(token))) {
    return { isMatch: true, distance: 0, score: 75 }
  }

  // Damerau-Levenshtein distance calculation
  const dist = damerauLevenshtein(q, t)

  // Max allowed distance based on query length:
  // length <= 3: max 1
  // length 4-7: max 2
  // length >= 8: max 3
  const maxDistance =
    maxDistanceOverride !== undefined
      ? maxDistanceOverride
      : q.length <= 3
      ? 1
      : q.length <= 7
      ? 2
      : 3

  if (dist <= maxDistance) {
    const score = Math.max(50, 70 - dist * 10)
    return { isMatch: true, distance: dist, score }
  }

  // Also check if any single token in target has a close fuzzy match with query
  for (const token of tTokens) {
    if (token.length >= 3) {
      const tokenDist = damerauLevenshtein(q, token)
      const tokenMax = q.length <= 4 ? 1 : 2
      if (tokenDist <= tokenMax) {
        return { isMatch: true, distance: tokenDist, score: 60 - tokenDist * 5 }
      }
    }
  }

  return { isMatch: false, distance: dist, score: 0 }
}

/**
 * Resolves a search term to its canonical Mangaluru area, recognizing spelling mistakes,
 * missing letters, swapped letters, extra letters, and known aliases.
 */
export function resolveCanonicalArea(rawQuery: string): {
  canonical: string
  isExact: boolean
  isAlias: boolean
  isFuzzy: boolean
  distance: number
} | null {
  const clean = normalizeSearchText(rawQuery)
  if (!clean || clean.length < 2) return null

  // 1. Exact alias lookup
  if (AREA_SYNONYMS_AND_ALIASES[clean]) {
    const canonical = AREA_SYNONYMS_AND_ALIASES[clean]
    return {
      canonical,
      isExact: canonical.toLowerCase() === clean,
      isAlias: canonical.toLowerCase() !== clean,
      isFuzzy: false,
      distance: 0,
    }
  }

  // 2. Exact match against canonical areas
  for (const area of CANONICAL_MANGALURU_AREAS) {
    if (area.toLowerCase() === clean) {
      return { canonical: area, isExact: true, isAlias: false, isFuzzy: false, distance: 0 }
    }
  }

  // 3. Prefix match against canonical areas
  for (const area of CANONICAL_MANGALURU_AREAS) {
    if (area.toLowerCase().startsWith(clean)) {
      return { canonical: area, isExact: false, isAlias: false, isFuzzy: false, distance: 0 }
    }
  }

  // 4. Check aliases with fuzzy distance (e.g. "derlakate" -> "derlakatte" -> Deralakatte)
  let bestCandidate: string | null = null
  let minDistance = Infinity

  for (const [alias, canonical] of Object.entries(AREA_SYNONYMS_AND_ALIASES)) {
    const dist = damerauLevenshtein(clean, alias)
    const threshold = clean.length <= 4 ? 1 : clean.length <= 7 ? 2 : 3
    if (dist <= threshold && dist < minDistance) {
      minDistance = dist
      bestCandidate = canonical
    }
  }

  if (bestCandidate) {
    return {
      canonical: bestCandidate,
      isExact: false,
      isAlias: true,
      isFuzzy: true,
      distance: minDistance,
    }
  }

  // 5. Check canonical areas with Damerau-Levenshtein
  for (const area of CANONICAL_MANGALURU_AREAS) {
    const dist = damerauLevenshtein(clean, area.toLowerCase())
    const threshold = clean.length <= 4 ? 1 : clean.length <= 7 ? 2 : 3
    if (dist <= threshold && dist < minDistance) {
      minDistance = dist
      bestCandidate = area
    }
  }

  if (bestCandidate) {
    return {
      canonical: bestCandidate,
      isExact: false,
      isAlias: false,
      isFuzzy: true,
      distance: minDistance,
    }
  }

  return null
}

/**
 * Ranks suggestions for auto-complete dropdowns:
 * 1. Exact matches (score 100)
 * 2. Prefix matches (score 90, sorted alphabetically)
 * 3. Substring contains matches (score 80, sorted alphabetically)
 * 4. Fuzzy / typo matches (score 50-70, closest edit distance first)
 * Deduplicates results case-insensitively while preserving canonical casing.
 */
export function rankSuggestions(
  query: string,
  candidates: string[],
  limit = 14
): { suggestions: string[]; bestFuzzyCorrection: string | null } {
  const clean = normalizeSearchText(query)
  if (!clean || clean === "all" || clean === "all areas") {
    return { suggestions: candidates.slice(0, limit), bestFuzzyCorrection: null }
  }

  // Check if query is an identifiable typo of a known area
  const resolved = resolveCanonicalArea(clean)
  const bestFuzzyCorrection = resolved?.isFuzzy || resolved?.isAlias ? resolved.canonical : null

  interface ScoredCandidate {
    value: string
    score: number
    distance: number
  }

  const scored: ScoredCandidate[] = []
  const seen = new Set<string>()

  for (const item of candidates) {
    const lower = item.toLowerCase().trim()
    if (seen.has(lower)) continue
    seen.add(lower)

    // Direct exact
    if (lower === clean) {
      scored.push({ value: item, score: 100, distance: 0 })
      continue
    }

    // Direct prefix
    if (lower.startsWith(clean)) {
      scored.push({ value: item, score: 90, distance: 0 })
      continue
    }

    // Direct contains
    if (lower.includes(clean)) {
      scored.push({ value: item, score: 80, distance: 0 })
      continue
    }

    // If query matches a resolved area alias and candidate is that area
    if (resolved && lower === resolved.canonical.toLowerCase()) {
      scored.push({ value: item, score: 85, distance: resolved.distance })
      continue
    }

    // Damerau-Levenshtein fuzzy matching
    const fuzzy = isFuzzyMatch(clean, lower)
    if (fuzzy.isMatch) {
      scored.push({ value: item, score: fuzzy.score, distance: fuzzy.distance })
    }
  }

  // Sort by score DESC, distance ASC, alphabetical ASC
  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score
    if (a.distance !== b.distance) return a.distance - b.distance
    return a.value.localeCompare(b.value)
  })

  // Ensure the resolved canonical area appears at the top if it's a known typo
  const result: string[] = []
  const resultSet = new Set<string>()

  if (bestFuzzyCorrection) {
    result.push(bestFuzzyCorrection)
    resultSet.add(bestFuzzyCorrection.toLowerCase())
  }

  for (const s of scored) {
    if (!resultSet.has(s.value.toLowerCase())) {
      result.push(s.value)
      resultSet.add(s.value.toLowerCase())
    }
    if (result.length >= limit) break
  }

  return { suggestions: result, bestFuzzyCorrection }
}

export const VERIFIED_AREA_COORDINATES: Record<string, { lat: number; lng: number }> = {
  Valencia: { lat: 12.8596, lng: 74.8519 },
  Balmatta: { lat: 12.8708, lng: 74.8458 },
  Deralakatte: { lat: 12.8166, lng: 74.8988 },
  Kankanady: { lat: 12.8633, lng: 74.8585 },
  Hampankatta: { lat: 12.8687, lng: 74.8427 },
  Kadri: { lat: 12.8858, lng: 74.8560 },
  Surathkal: { lat: 13.0119, lng: 74.7943 },
  Bejai: { lat: 12.8872, lng: 74.8422 },
  Attavar: { lat: 12.8617, lng: 74.8475 },
  Falnir: { lat: 12.8640, lng: 74.8460 },
  Pumpwell: { lat: 12.8590, lng: 74.8635 },
  Bendoor: { lat: 12.8708, lng: 74.8520 },
  Bendoorwell: { lat: 12.8680, lng: 74.8540 },
  Kuntikana: { lat: 12.8985, lng: 74.8570 },
  Kodialbail: { lat: 12.8735, lng: 74.8415 },
  Lalbagh: { lat: 12.8805, lng: 74.8427 },
  Kottara: { lat: 12.8940, lng: 74.8430 },
  "Kottara Chowki": { lat: 12.9000, lng: 74.8390 },
  Urwa: { lat: 12.8870, lng: 74.8360 },
  "Urwa Store": { lat: 12.8920, lng: 74.8350 },
  Adyar: { lat: 12.8680, lng: 74.9120 },
  Mudippu: { lat: 12.8120, lng: 74.9540 },
  Padil: { lat: 12.8670, lng: 74.8850 },
  Ullal: { lat: 12.8250, lng: 74.8540 },
  Bondel: { lat: 12.9150, lng: 74.8650 },
  Panambur: { lat: 12.9520, lng: 74.8080 },
  Jeppu: { lat: 12.8519, lng: 74.8465 },
  "Jeppu Market": { lat: 12.8530, lng: 74.8450 },
  Pandeshwar: { lat: 12.8586, lng: 74.8392 },
  Mannagudda: { lat: 12.8780, lng: 74.8340 },
  Chilimbi: { lat: 12.8900, lng: 74.8320 },
  Ladyhill: { lat: 12.8850, lng: 74.8340 },
  Jyothi: { lat: 12.8710, lng: 74.8460 },
  Mallikatte: { lat: 12.8750, lng: 74.8570 },
  Bikarnakatte: { lat: 12.8760, lng: 74.8680 },
  Derebail: { lat: 12.9050, lng: 74.8480 },
  Maryhill: { lat: 12.9100, lng: 74.8550 },
  Kavoor: { lat: 12.9180, lng: 74.8590 },
  Yeyyadi: { lat: 12.8950, lng: 74.8620 },
  Shaktinagar: { lat: 12.8880, lng: 74.8780 },
  Valachil: { lat: 12.8660, lng: 74.9350 },
  Baikampady: { lat: 12.9600, lng: 74.8150 },
  Bolar: { lat: 12.8450, lng: 74.8390 },
  "Car Street": { lat: 12.8690, lng: 74.8380 },
  "State Bank": { lat: 12.8620, lng: 74.8390 },
  "Bunts Hostel": { lat: 12.8740, lng: 74.8480 },
  "PVS Circle": { lat: 12.8750, lng: 74.8450 },
  Ballalbagh: { lat: 12.8820, lng: 74.8380 },
  Kotekani: { lat: 12.8910, lng: 74.8390 },
  Nandigudda: { lat: 12.8540, lng: 74.8490 },
  Kapikad: { lat: 12.8900, lng: 74.8380 },
  Ashoknagar: { lat: 12.8920, lng: 74.8370 },
  Konchady: { lat: 12.9080, lng: 74.8510 },
}

/**
 * Genuine Haversine formula calculation: Computes great-circle distance
 * in kilometers between two latitude/longitude points on Earth.
 */
export function haversineDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const toRad = (deg: number) => (deg * Math.PI) / 180
  const R = 6371 // Earth radius in km

  const dLat = toRad(lat2 - lat1)
  const dLon = toRad(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export interface NearbyMatch<T> {
  item: T
  distanceKm: number
}

export interface PartitionedSearchResults<T> {
  exactMatches: T[]
  similarMatches: T[]
  nearbyMatches: NearbyMatch<T>[]
  matchedArea: string | null
  referenceCoords: { lat: number; lng: number } | null
  isTypoCorrection: boolean
  totalCount: number
}

/**
 * Partitions listings into three strictly separate, non-overlapping sections:
 * 1. Exact Matches: Listings whose registered area matches the query or canonical area.
 * 2. Similar Matches: Listings matching verified spelling variations or typos (excluding exact matches).
 * 3. Nearby Matches: Other listings located within 5.0 KM of the searched area's verified reference
 *    coordinates, sorted by shortest distance first.
 *
 * Guarantees:
 * - A listing is NEVER duplicated across sections.
 * - Only listings with verified coordinates appear in the nearby section.
 * - Distance is measured from the searched area's verified reference coordinates.
 */
export function partitionListingsByMatch<T extends { id: string }>(
  items: T[],
  searchQuery: string,
  fieldExtractor: (item: T) => {
    name: string
    area: string
    landmark?: string
    description?: string
    latitude?: number | null
    longitude?: number | null
  }
): PartitionedSearchResults<T> {
  const clean = normalizeSearchText(searchQuery)
  if (!clean || clean === "all" || clean === "all areas") {
    return {
      exactMatches: items,
      similarMatches: [],
      nearbyMatches: [],
      matchedArea: null,
      referenceCoords: null,
      isTypoCorrection: false,
      totalCount: items.length,
    }
  }

  const resolved = resolveCanonicalArea(clean)
  const canonicalTarget = resolved?.canonical.toLowerCase() || null

  // Retrieve verified reference coordinates for the searched/resolved area
  const matchedAreaName = resolved?.canonical || null
  const referenceCoords = matchedAreaName
    ? VERIFIED_AREA_COORDINATES[matchedAreaName] || null
    : null

  const exactMatches: T[] = []
  const similarMatches: T[] = []
  const nearbyMatches: NearbyMatch<T>[] = []
  const seenIds = new Set<string>()

  // 1. Find Exact Matches
  for (const item of items) {
    const fields = fieldExtractor(item)
    const nameNorm = normalizeSearchText(fields.name)
    const areaNorm = normalizeSearchText(fields.area)
    const landmarkNorm = normalizeSearchText(fields.landmark || "")

    // Exact area match
    const isExactArea = areaNorm === clean
    // If search was resolved to an exact canonical area without typo
    const isCanonicalExact = resolved?.isExact && canonicalTarget === areaNorm
    // Substring in name, area, or landmark
    const isSubstrMatch =
      areaNorm.includes(clean) ||
      nameNorm.includes(clean) ||
      landmarkNorm.includes(clean)

    if (isExactArea || isCanonicalExact || isSubstrMatch) {
      exactMatches.push(item)
      seenIds.add(item.id)
    }
  }

  // 2. Find Similar Matches (Typo tolerance / spelling variations)
  for (const item of items) {
    if (seenIds.has(item.id)) continue

    const fields = fieldExtractor(item)
    const nameNorm = normalizeSearchText(fields.name)
    const areaNorm = normalizeSearchText(fields.area)
    const landmarkNorm = normalizeSearchText(fields.landmark || "")

    let isSimilar = false

    // Matches the resolved canonical area for a typo (e.g. "Derlakatte" -> "Deralakatte")
    if (canonicalTarget && areaNorm === canonicalTarget) {
      isSimilar = true
    } else {
      // Fuzzy match on area
      const areaFuzzy = isFuzzyMatch(clean, areaNorm)
      if (areaFuzzy.isMatch && areaFuzzy.score >= 50) {
        isSimilar = true
      } else {
        // Fuzzy match on name or landmark
        const nameFuzzy = isFuzzyMatch(clean, nameNorm)
        const landmarkFuzzy = isFuzzyMatch(clean, landmarkNorm)
        if (nameFuzzy.isMatch || landmarkFuzzy.isMatch) {
          isSimilar = true
        }
      }
    }

    if (isSimilar) {
      similarMatches.push(item)
      seenIds.add(item.id)
    }
  }

  // 3. Find Nearby Matches (Within 5.0 KM radius of reference coordinates)
  if (referenceCoords) {
    const scoredNearby: NearbyMatch<T>[] = []

    for (const item of items) {
      if (seenIds.has(item.id)) continue

      const fields = fieldExtractor(item)
      const lat = fields.latitude
      const lng = fields.longitude

      // Only listings with confirmed, verified coordinates are eligible
      if (typeof lat === "number" && typeof lng === "number" && !isNaN(lat) && !isNaN(lng)) {
        const distanceKm = haversineDistanceKm(
          referenceCoords.lat,
          referenceCoords.lng,
          lat,
          lng
        )

        // Strict 5.0 km boundary
        if (distanceKm <= 5.0) {
          scoredNearby.push({
            item,
            distanceKm: Math.round(distanceKm * 10) / 10, // Round to 1 decimal place (e.g. 1.8 km)
          })
          seenIds.add(item.id)
        }
      }
    }

    // Sort by shortest distance first
    scoredNearby.sort((a, b) => a.distanceKm - b.distanceKm)
    nearbyMatches.push(...scoredNearby)
  }

  return {
    exactMatches,
    similarMatches,
    nearbyMatches,
    matchedArea: matchedAreaName,
    referenceCoords,
    isTypoCorrection: Boolean(resolved?.isFuzzy || resolved?.isAlias),
    totalCount: exactMatches.length + similarMatches.length + nearbyMatches.length,
  }
}

