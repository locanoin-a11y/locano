import test from "node:test"
import assert from "node:assert/strict"

import {
  haversineDistanceKm,
  VERIFIED_AREA_COORDINATES,
  partitionListingsByMatch,
} from "../src/lib/search/fuzzy.ts"

test("LOCANO Location-Based Discovery & 5 KM Radius Engine", async (t) => {
  await t.test("1. Haversine Distance Formula Accuracy", () => {
    // Balmatta (12.8708, 74.8458) to Kadri (12.8770, 74.8560)
    // Real-world distance is ~1.3 km
    const d1 = haversineDistanceKm(12.8708, 74.8458, 12.8770, 74.8560)
    assert.ok(d1 > 1.0 && d1 < 1.6, `Expected Balmatta to Kadri ~1.3 km, got ${d1}`)

    // Balmatta (12.8708, 74.8458) to Hampankatta (12.8680, 74.8420)
    // Real-world distance is ~0.5 km
    const d2 = haversineDistanceKm(12.8708, 74.8458, 12.8680, 74.8420)
    assert.ok(d2 > 0.3 && d2 < 0.7, `Expected Balmatta to Hampankatta ~0.5 km, got ${d2}`)

    // Balmatta (12.8708, 74.8458) to Deralakatte (12.8125, 74.8875)
    // Real-world distance is ~7.9 km (outside 5 km)
    const d3 = haversineDistanceKm(12.8708, 74.8458, 12.8125, 74.8875)
    assert.ok(d3 > 7.0 && d3 < 9.0, `Expected Balmatta to Deralakatte ~7.9 km, got ${d3}`)

    // Distance to same point is 0
    const dZero = haversineDistanceKm(12.8708, 74.8458, 12.8708, 74.8458)
    assert.equal(dZero, 0)
  })

  await t.test("2. Verified Area Coordinates Registry", () => {
    // Key student areas must have verified coordinates
    assert.ok(VERIFIED_AREA_COORDINATES["Deralakatte"])
    assert.equal(typeof VERIFIED_AREA_COORDINATES["Deralakatte"].lat, "number")
    assert.equal(typeof VERIFIED_AREA_COORDINATES["Deralakatte"].lng, "number")

    assert.ok(VERIFIED_AREA_COORDINATES["Balmatta"])
    assert.ok(VERIFIED_AREA_COORDINATES["Kadri"])
    assert.ok(VERIFIED_AREA_COORDINATES["Kottara Chowki"])
    assert.ok(VERIFIED_AREA_COORDINATES["Surathkal"])
    assert.ok(VERIFIED_AREA_COORDINATES["Valencia"])
    assert.ok(VERIFIED_AREA_COORDINATES["Hampankatta"])

    // All lat/lng should be valid Mangaluru bounding box: lat ~ 12.7 to 13.1, lng ~ 74.7 to 75.1
    for (const [area, coords] of Object.entries(VERIFIED_AREA_COORDINATES)) {
      assert.ok(coords.lat >= 12.7 && coords.lat <= 13.2, `${area} latitude out of bounds: ${coords.lat}`)
      assert.ok(coords.lng >= 74.7 && coords.lng <= 75.1, `${area} longitude out of bounds: ${coords.lng}`)
    }
  })

  await t.test("3. Three-Way Results Partitioning & 5 KM Radius", () => {
    // Sample PG listings:
    // Balmatta reference coords: 12.8708, 74.8458
    // Listing 1: Exactly in Balmatta
    // Listing 2: In Hampankatta (~0.5 km away, with coords)
    // Listing 3: In Kadri (~1.3 km away, with coords)
    // Listing 4: In Deralakatte (~7.9 km away, with coords - EXCLUDED from 5 km)
    // Listing 5: In Falnir (nearby ~1.1 km away, but NO coordinates - MUST be excluded from nearby)
    const listings = [
      { id: "pg-1", name: "Balmatta Boys PG", area: "Balmatta", lat: 12.8708, lng: 74.8458 },
      { id: "pg-2", name: "City Center PG", area: "Hampankatta", lat: 12.8680, lng: 74.8420 },
      { id: "pg-3", name: "Kadri Hills PG", area: "Kadri", lat: 12.8770, lng: 74.8560 },
      { id: "pg-4", name: "Medical Scholar PG", area: "Deralakatte", lat: 12.8125, lng: 74.8875 },
      { id: "pg-5", name: "Falnir Luxury PG", area: "Falnir", lat: null, lng: null },
    ]

    const extractor = (item) => ({
      name: item.name,
      area: item.area,
      latitude: item.lat,
      longitude: item.lng,
    })

    const result = partitionListingsByMatch(listings, "Balmatta", extractor)

    // 1. Exact match contains pg-1
    assert.equal(result.exactMatches.length, 1)
    assert.equal(result.exactMatches[0].id, "pg-1")

    // 2. Similar matches is empty (since Balmatta was an exact match)
    assert.equal(result.similarMatches.length, 0)

    // 3. Nearby matches must contain pg-2 and pg-3, but NOT pg-1, NOT pg-4 (>5km), and NOT pg-5 (no coords)
    assert.equal(result.nearbyMatches.length, 2)

    // Sorted by shortest distance first: pg-2 (~0.5 km) then pg-3 (~1.3 km)
    assert.equal(result.nearbyMatches[0].item.id, "pg-2")
    assert.ok(result.nearbyMatches[0].distanceKm < 1.0)
    assert.equal(result.nearbyMatches[1].item.id, "pg-3")
    assert.ok(result.nearbyMatches[1].distanceKm > 1.0 && result.nearbyMatches[1].distanceKm < 2.0)

    // 4. Duplicate prevention: No ID should appear more than once across all sections
    const allSeenIds = [
      ...result.exactMatches.map((m) => m.id),
      ...result.similarMatches.map((m) => m.id),
      ...result.nearbyMatches.map((m) => m.item.id),
    ]
    const uniqueIds = new Set(allSeenIds)
    assert.equal(allSeenIds.length, uniqueIds.size, "Duplicate listing detected across sections!")
  })

  await t.test("4. Typo-Tolerant Query with Nearby 5 KM Results", () => {
    // When student types "Derlakatte" (typo for Deralakatte)
    // Reference coords for Deralakatte: 12.8166, 74.8988
    // Listing A: Registered under Deralakatte (matches canonical -> Similar match)
    // Listing B: Kankanady (~7.3 km from Deralakatte -> outside 5 km -> EXCLUDED)
    // Listing C: Kotekar (~3.2 km from Deralakatte -> inside 5 km -> Nearby match)
    // Listing D: Paneer (~1.8 km from Deralakatte -> inside 5 km -> Nearby match)
    const listings = [
      { id: "d-1", name: "Yenepoya Hostels", area: "Deralakatte", lat: 12.8166, lng: 74.8988 },
      { id: "d-2", name: "Kankanady Heights", area: "Kankanady", lat: 12.8633, lng: 74.8585 },
      { id: "d-3", name: "Kotekar Student Nest", area: "Kotekar", lat: 12.7900, lng: 74.8700 },
      { id: "d-4", name: "Paneer PG", area: "Paneer", lat: 12.8150, lng: 74.8750 },
    ]

    const extractor = (item) => ({
      name: item.name,
      area: item.area,
      latitude: item.lat,
      longitude: item.lng,
    })

    const result = partitionListingsByMatch(listings, "Derlakatte", extractor)

    // Similar matches should have d-1 (Deralakatte listing matched via typo)
    assert.equal(result.similarMatches.length, 1)
    assert.equal(result.similarMatches[0].id, "d-1")

    // Nearby matches should include Kotekar and Paneer, sorted by distance:
    // Paneer (~2.6 km) should come before Kotekar (~4.2 km)
    assert.equal(result.nearbyMatches.length, 2)
    assert.equal(result.nearbyMatches[0].item.id, "d-4") // Paneer is closer
    assert.equal(result.nearbyMatches[1].item.id, "d-3") // Kotekar is next
    assert.ok(result.nearbyMatches[0].distanceKm < result.nearbyMatches[1].distanceKm)

    // Kankanady (~7.3 km) must NOT be in nearbyMatches
    assert.ok(!result.nearbyMatches.some((m) => m.item.id === "d-2"))

    // Total unique listings check
    const allIds = [
      ...result.exactMatches.map((m) => m.id),
      ...result.similarMatches.map((m) => m.id),
      ...result.nearbyMatches.map((m) => m.item.id),
    ]
    assert.equal(new Set(allIds).size, allIds.length)
  })

  await t.test("5. Boundary Condition: Exactly 5.0 KM Radius", () => {
    // Reference point: Balmatta (12.8708, 74.8458)
    // Create synthetic listings at known distances:
    // Point A: 4.6 km away (Included)
    // Point B: 5.5 km away (Excluded)
    // Point C: No coordinates (Excluded)
    const refLat = 12.8708
    const refLng = 74.8458

    // ~1 deg lat is ~111 km, so 0.040 deg lat is ~4.4 km
    // 0.050 deg lat is ~5.5 km
    const listings = [
      { id: "near", name: "Within 5km PG", area: "Test Area 1", lat: refLat + 0.040, lng: refLng },
      { id: "far", name: "Beyond 5km PG", area: "Test Area 2", lat: refLat + 0.050, lng: refLng },
      { id: "no-coords", name: "No GPS PG", area: "Test Area 3", lat: null, lng: null },
    ]

    const extractor = (item) => ({
      name: item.name,
      area: item.area,
      latitude: item.lat,
      longitude: item.lng,
    })

    const result = partitionListingsByMatch(listings, "Balmatta", extractor)

    assert.equal(result.nearbyMatches.length, 1)
    assert.equal(result.nearbyMatches[0].item.id, "near")
    assert.ok(result.nearbyMatches[0].distanceKm <= 5.0)
  })

  await t.test("6. Mess Listings Discovery Interoperability", () => {
    // Mess listings using the same partition function
    const messListings = [
      { id: "mess-1", name: "Balmatta Tiffin House", area: "Balmatta", lat: 12.8708, lng: 74.8458 },
      { id: "mess-2", name: "Kadri Coastal Mess", area: "Kadri", lat: 12.8770, lng: 74.8560 },
      { id: "mess-3", name: "Surathkal Beach Tiffins", area: "Surathkal", lat: 13.0119, lng: 74.7943 },
    ]

    const extractor = (item) => ({
      name: item.name,
      area: item.area,
      latitude: item.lat,
      longitude: item.lng,
    })

    const result = partitionListingsByMatch(messListings, "Balmatta", extractor)

    assert.equal(result.exactMatches.length, 1)
    assert.equal(result.exactMatches[0].id, "mess-1")
    assert.equal(result.nearbyMatches.length, 1)
    assert.equal(result.nearbyMatches[0].item.id, "mess-2")
    assert.ok(!result.nearbyMatches.some((m) => m.item.id === "mess-3"), "Surathkal (~13km) should be excluded")
  })
})
