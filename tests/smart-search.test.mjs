import { describe, it } from "node:test"
import assert from "node:assert/strict"
import {
  damerauLevenshtein,
  normalizeSearchText,
  isFuzzyMatch,
  resolveCanonicalArea,
  rankSuggestions,
  partitionListingsByMatch,
} from "../src/lib/search/fuzzy.ts"

describe("LOCANO Smart Typo-Tolerant Search Engine", () => {
  describe("1. Damerau-Levenshtein & Normalization", () => {
    it("handles zero distance for exact identical strings", () => {
      assert.strictEqual(damerauLevenshtein("Valencia", "Valencia"), 0)
    })

    it("handles substitutions (1 edit)", () => {
      assert.strictEqual(damerauLevenshtein("Valencia", "Valancia"), 1)
    })

    it("handles deletions / missing letters (1 edit)", () => {
      assert.strictEqual(damerauLevenshtein("Hampankatta", "Hampankata"), 1)
    })

    it("handles transpositions of adjacent characters", () => {
      // Swapped adjacent letters e.g. Bejai -> Beaji
      assert.strictEqual(damerauLevenshtein("bejai", "beaji"), 1)
    })

    it("handles extra letters / insertions", () => {
      assert.strictEqual(damerauLevenshtein("Kadri", "Kaadri"), 1)
    })

    it("normalizes text by trimming, lowercasing and stripping special chars", () => {
      assert.strictEqual(normalizeSearchText("  Deralakatte, Mangalore!  "), "deralakatte mangalore")
    })
  })

  describe("2. Mangaluru Area Typo Resolution (resolveCanonicalArea)", () => {
    it("resolves Derlakatte -> Deralakatte", () => {
      const match = resolveCanonicalArea("Derlakatte")
      assert.ok(match)
      assert.strictEqual(match.canonical, "Deralakatte")
    })

    it("resolves Deralakatte (exact canonical)", () => {
      const match = resolveCanonicalArea("Deralakatte")
      assert.ok(match)
      assert.strictEqual(match.canonical, "Deralakatte")
      assert.strictEqual(match.isExact, true)
    })

    it("resolves Derlakate -> Deralakatte", () => {
      const match = resolveCanonicalArea("Derlakate")
      assert.ok(match)
      assert.strictEqual(match.canonical, "Deralakatte")
    })

    it("resolves Daralakatte -> Deralakatte", () => {
      const match = resolveCanonicalArea("Daralakatte")
      assert.ok(match)
      assert.strictEqual(match.canonical, "Deralakatte")
    })

    it("resolves Valencia (exact canonical)", () => {
      const match = resolveCanonicalArea("Valencia")
      assert.ok(match)
      assert.strictEqual(match.canonical, "Valencia")
      assert.strictEqual(match.isExact, true)
    })

    it("resolves Valancia -> Valencia", () => {
      const match = resolveCanonicalArea("Valancia")
      assert.ok(match)
      assert.strictEqual(match.canonical, "Valencia")
    })

    it("resolves Hampankatta (exact canonical)", () => {
      const match = resolveCanonicalArea("Hampankatta")
      assert.ok(match)
      assert.strictEqual(match.canonical, "Hampankatta")
      assert.strictEqual(match.isExact, true)
    })

    it("resolves Hampankata -> Hampankatta", () => {
      const match = resolveCanonicalArea("Hampankata")
      assert.ok(match)
      assert.strictEqual(match.canonical, "Hampankatta")
    })

    it("returns null for completely unrelated or gibberish searches", () => {
      const match = resolveCanonicalArea("xyzqwe999zz")
      assert.strictEqual(match, null)
    })
  })

  describe("3. Fuzzy Matching & Partial Search", () => {
    it("correctly identifies prefix match for partial queries", () => {
      const res = isFuzzyMatch("Balm", "Balmatta")
      assert.strictEqual(res.isMatch, true)
      assert.strictEqual(res.distance, 0)
    })

    it("correctly identifies fuzzy match for single typo", () => {
      const res = isFuzzyMatch("Valancia", "Valencia")
      assert.strictEqual(res.isMatch, true)
      assert.strictEqual(res.distance, 1)
    })

    it("rejects non-matching random strings", () => {
      const res = isFuzzyMatch("qwertyuiop", "Deralakatte")
      assert.strictEqual(res.isMatch, false)
    })
  })

  describe("4. Live Suggestions & Ranking (rankSuggestions)", () => {
    const candidateAreas = [
      "Valencia",
      "Balmatta",
      "Deralakatte",
      "Kadri",
      "Kankanady",
      "Hampankatta",
      "Bejai",
      "Falnir",
      "Pumpwell",
    ]

    it("ranks exact prefix match first", () => {
      const { suggestions } = rankSuggestions("Val", candidateAreas)
      assert.strictEqual(suggestions[0], "Valencia")
    })

    it("ranks closest spelling match first for typos", () => {
      const { suggestions, bestFuzzyCorrection } = rankSuggestions("Valancia", candidateAreas)
      assert.strictEqual(suggestions[0], "Valencia")
      assert.strictEqual(bestFuzzyCorrection, "Valencia")
    })

    it("suggests Deralakatte for Derlakatte", () => {
      const { suggestions, bestFuzzyCorrection } = rankSuggestions("Derlakatte", candidateAreas)
      assert.strictEqual(suggestions[0], "Deralakatte")
      assert.strictEqual(bestFuzzyCorrection, "Deralakatte")
    })

    it("prevents duplicate suggestions", () => {
      const withDups = ["Valencia", "valencia", "VALENCIA", "Balmatta"]
      const { suggestions } = rankSuggestions("val", withDups)
      const valenciaCount = suggestions.filter((s) => s.toLowerCase() === "valencia").length
      assert.strictEqual(valenciaCount, 1)
    })

    it("returns empty suggestions for zero-match query", () => {
      const { suggestions, bestFuzzyCorrection } = rankSuggestions("zzzzqqqq111", candidateAreas)
      assert.strictEqual(suggestions.length, 0)
      assert.strictEqual(bestFuzzyCorrection, null)
    })
  })

  describe("5. Results Partitioning: Exact Matches vs Similar Matches", () => {
    const mockListings = [
      { id: "1", name: "Green View PG", area: "Deralakatte", landmark: "Near KSHEMA" },
      { id: "2", name: "Sunshine Ladies Hostel", area: "Deralakatte", landmark: "Near Yenepoya" },
      { id: "3", name: "Ocean Breeze PG", area: "Valencia", landmark: "Near Roshni Nilaya" },
      { id: "4", name: "Heritage Student Home", area: "Balmatta", landmark: "Near Collector Gate" },
      { id: "5", name: "Metro Stay", area: "Kankanady", landmark: "Near Father Muller" },
    ]

    it("correctly partitions when user types an exact area name", () => {
      const result = partitionListingsByMatch(mockListings, "Deralakatte", (item) => ({
        name: item.name,
        area: item.area,
        landmark: item.landmark,
      }))

      assert.strictEqual(result.exactMatches.length, 2)
      assert.strictEqual(result.similarMatches.length, 0)
      assert.strictEqual(result.isTypoCorrection, false)
      assert.strictEqual(result.matchedArea, "Deralakatte")
      assert.deepStrictEqual(
        result.exactMatches.map((m) => m.id),
        ["1", "2"]
      )
    })

    it("correctly partitions when user types a typo (Derlakatte)", () => {
      const result = partitionListingsByMatch(mockListings, "Derlakatte", (item) => ({
        name: item.name,
        area: item.area,
        landmark: item.landmark,
      }))

      // Exact matches are 0 because none has area literal "Derlakatte"
      assert.strictEqual(result.exactMatches.length, 0)
      // Similar matches should catch the two Deralakatte listings
      assert.strictEqual(result.similarMatches.length, 2)
      assert.strictEqual(result.isTypoCorrection, true)
      assert.strictEqual(result.matchedArea, "Deralakatte")
      assert.deepStrictEqual(
        result.similarMatches.map((m) => m.id),
        ["1", "2"]
      )
    })

    it("correctly partitions for Valancia -> Valencia", () => {
      const result = partitionListingsByMatch(mockListings, "Valancia", (item) => ({
        name: item.name,
        area: item.area,
        landmark: item.landmark,
      }))

      assert.strictEqual(result.exactMatches.length, 0)
      assert.strictEqual(result.similarMatches.length, 1)
      assert.strictEqual(result.similarMatches[0].name, "Ocean Breeze PG")
      assert.strictEqual(result.isTypoCorrection, true)
    })

    it("guarantees no listing appears in both exact and similar sections", () => {
      const result = partitionListingsByMatch(mockListings, "Deralakatte", (item) => ({
        name: item.name,
        area: item.area,
        landmark: item.landmark,
      }))

      const exactIds = new Set(result.exactMatches.map((m) => m.id))
      for (const similar of result.similarMatches) {
        assert.ok(!exactIds.has(similar.id), `Listing ${similar.id} duplicated across sections`)
      }
    })

    it("returns empty arrays when query does not match any listing", () => {
      const result = partitionListingsByMatch(mockListings, "UnknownArea999", (item) => ({
        name: item.name,
        area: item.area,
        landmark: item.landmark,
      }))

      assert.strictEqual(result.exactMatches.length, 0)
      assert.strictEqual(result.similarMatches.length, 0)
    })
  })
})
