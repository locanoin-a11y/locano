import test from "node:test"
import assert from "node:assert/strict"

import {
  CAMPUS_CONFIGS,
  matchesCampusLocality,
  calculateCampusCounts,
} from "../src/types/campuses.ts"

test("LOCANO Mangaluru Student Campuses - Real Data Integration", async (t) => {
  await t.test("1. Campus Configuration & Locality Registry Integrity", () => {
    assert.equal(CAMPUS_CONFIGS.length, 5, "Expected exactly 5 initial student campus cards")

    const expectedMapping = {
      "nitk-surathkal": { name: "NITK Surathkal", locality: "Surathkal" },
      "yenepoya-university": { name: "Yenepoya University", locality: "Deralakatte" },
      "kshema-nitte": { name: "KSHEMA / Nitte", locality: "Deralakatte" },
      "father-muller": { name: "Father Muller", locality: "Kankanady" },
      "st-aloysius": { name: "St. Aloysius University", locality: "Hampankatta" },
    }

    for (const campus of CAMPUS_CONFIGS) {
      const expected = expectedMapping[campus.id]
      assert.ok(expected, `Unknown campus id: ${campus.id}`)
      assert.equal(campus.name, expected.name)
      assert.equal(campus.locality, expected.locality)
    }
  })

  await t.test("2. matchesCampusLocality Typo Tolerance & Area Isolation", () => {
    // Exact canonical matching
    assert.equal(matchesCampusLocality("Surathkal", "Surathkal"), true)
    assert.equal(matchesCampusLocality("Deralakatte", "Deralakatte"), true)
    assert.equal(matchesCampusLocality("Kankanady", "Kankanady"), true)
    assert.equal(matchesCampusLocality("Hampankatta", "Hampankatta"), true)

    // Spelling variations & verified aliases
    assert.equal(matchesCampusLocality("suratkal", "Surathkal"), true)
    assert.equal(matchesCampusLocality("Derlakatte", "Deralakatte"), true)
    assert.equal(matchesCampusLocality("derlakate", "Deralakatte"), true)
    assert.equal(matchesCampusLocality("daralakatte", "Deralakatte"), true)
    assert.equal(matchesCampusLocality("kankanadi", "Kankanady"), true)
    assert.equal(matchesCampusLocality("hampankata", "Hampankatta"), true)

    // Strict area isolation (do not match unrelated areas)
    assert.equal(matchesCampusLocality("Kadri", "Surathkal"), false)
    assert.equal(matchesCampusLocality("Valencia", "Deralakatte"), false)
    assert.equal(matchesCampusLocality("Balmatta", "Kankanady"), false)
    assert.equal(matchesCampusLocality("Bejai", "Hampankatta"), false)
    assert.equal(matchesCampusLocality("Surathkal", "Deralakatte"), false)
    assert.equal(matchesCampusLocality("", "Deralakatte"), false)
  })

  await t.test("3. calculateCampusCounts Filtering Rules (Published & Non-Demo Only)", () => {
    const mockAccommodations = [
      // Deralakatte: 2 published, 1 pending, 1 demo, 1 rejected
      { id: "acc-1", area: "Deralakatte", status: "published", isDemo: false },
      { id: "acc-2", area: "Derlakatte", status: "published", isDemo: false }, // Typo variation
      { id: "acc-3", area: "Deralakatte", status: "pending", isDemo: false },   // Excluded (pending)
      { id: "acc-4", area: "Deralakatte", status: "published", isDemo: true },   // Excluded (demo)
      { id: "acc-5", area: "Deralakatte", status: "rejected", isDemo: false },  // Excluded (rejected)

      // Surathkal: 1 published
      { id: "acc-6", area: "Surathkal", status: "published", isDemo: false },

      // Kankanady: 0 published
      { id: "acc-7", area: "Kankanady", status: "archived", isDemo: false },   // Excluded (archived)

      // Hampankatta: 3 published
      { id: "acc-8", area: "Hampankatta", status: "published", isDemo: false },
      { id: "acc-9", area: "Hampankatta", status: "published", isDemo: false },
      { id: "acc-10", area: "hampankata", status: "published", isDemo: false },
    ]

    const mockMesses = [
      // Deralakatte: 1 published
      { id: "mess-1", area: "Deralakatte", status: "published", isDemo: false },
      { id: "mess-2", area: "Deralakatte", status: "pending", isDemo: false },

      // Surathkal: 2 published
      { id: "mess-3", area: "Surathkal", status: "published", isDemo: false },
      { id: "mess-4", area: "suratkal", status: "published", isDemo: false },

      // Kankanady: 1 published
      { id: "mess-5", area: "Kankanady", status: "published", isDemo: false },

      // Hampankatta: 0 published
    ]

    const result = calculateCampusCounts(CAMPUS_CONFIGS, mockAccommodations, mockMesses)

    const nitk = result.find((c) => c.id === "nitk-surathkal")
    assert.equal(nitk.pgCount, 1, "NITK should have 1 published PG")
    assert.equal(nitk.messCount, 2, "NITK should have 2 published Messes")

    // Both Yenepoya and KSHEMA reside in Deralakatte and should reflect the Deralakatte counts
    const yenepoya = result.find((c) => c.id === "yenepoya-university")
    assert.equal(yenepoya.pgCount, 2, "Yenepoya should have 2 published PGs (excluding pending, demo, rejected)")
    assert.equal(yenepoya.messCount, 1, "Yenepoya should have 1 published Mess")

    const kshema = result.find((c) => c.id === "kshema-nitte")
    assert.equal(kshema.pgCount, 2, "KSHEMA should have 2 published PGs")
    assert.equal(kshema.messCount, 1, "KSHEMA should have 1 published Mess")

    const fatherMuller = result.find((c) => c.id === "father-muller")
    assert.equal(fatherMuller.pgCount, 0, "Father Muller should have 0 PGs (archived excluded)")
    assert.equal(fatherMuller.messCount, 1, "Father Muller should have 1 published Mess")

    const stAloysius = result.find((c) => c.id === "st-aloysius")
    assert.equal(stAloysius.pgCount, 3, "St. Aloysius should have 3 published PGs")
    assert.equal(stAloysius.messCount, 0, "St. Aloysius should have 0 published Messes")
  })

  await t.test("4. Display String & Format Invariant (No Plus Suffix)", () => {
    const counts = calculateCampusCounts(CAMPUS_CONFIGS, [], [])
    for (const campus of counts) {
      assert.equal(campus.pgCount, 0)
      assert.equal(campus.messCount, 0)

      // Format check: exact numbers without '+'
      const pgDisplay = `${campus.pgCount} PGs`
      const messDisplay = `${campus.messCount} Messes`
      assert.ok(!pgDisplay.includes("+"), "Must not contain '+' suffix")
      assert.ok(!messDisplay.includes("+"), "Must not contain '+' suffix")
      assert.equal(pgDisplay, "0 PGs")
      assert.equal(messDisplay, "0 Messes")
    }
  })
})
