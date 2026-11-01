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

export interface PartitionedSearchResults<T> {
  exactMatches: T[]
  similarMatches: T[]
  matchedArea: string | null
  isTypoCorrection: boolean
  totalCount: number
}

/**
 * Partitions listings into "Exact Matches" and "Similar Matches" without duplication.
 * Exact Matches:
 *  - Area matches exactly or normalized search term
 *  - OR item name / landmark exactly contains the query
 * Similar Matches:
 *  - Area or name matches a fuzzy typo or canonical alias
 *  - NEVER duplicates any listing already in exactMatches
 */
export function partitionListingsByMatch<T extends { id: string }>(
  items: T[],
  searchQuery: string,
  fieldExtractor: (item: T) => {
    name: string
    area: string
    landmark?: string
    description?: string
  }
): PartitionedSearchResults<T> {
  const clean = normalizeSearchText(searchQuery)
  if (!clean || clean === "all" || clean === "all areas") {
    return {
      exactMatches: items,
      similarMatches: [],
      matchedArea: null,
      isTypoCorrection: false,
      totalCount: items.length,
    }
  }

  const resolved = resolveCanonicalArea(clean)
  const canonicalTarget = resolved?.canonical.toLowerCase() || null

  const exactMatches: T[] = []
  const similarMatches: T[] = []
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

  return {
    exactMatches,
    similarMatches,
    matchedArea: resolved?.canonical || null,
    isTypoCorrection: Boolean(resolved?.isFuzzy || resolved?.isAlias),
    totalCount: exactMatches.length + similarMatches.length,
  }
}

