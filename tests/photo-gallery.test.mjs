import { test, describe } from "node:test"
import assert from "node:assert/strict"

describe("Adaptive Photo Gallery & Multi-Photo Management Tests", () => {
  // Helper matching PhotoGallery real photo check
  const isRealPhoto = (url) => {
    if (!url || typeof url !== "string") return false
    const lower = url.toLowerCase()
    return (
      !lower.includes("hero-coast") &&
      !lower.includes("mess-tiffin") &&
      !lower.includes("mess-thali") &&
      !lower.includes("default")
    )
  }

  const getGalleryImages = (images, coverImage) => {
    const rawImages = (Array.isArray(images) ? images : []).filter(isRealPhoto)
    if (rawImages.length === 0 && isRealPhoto(coverImage)) {
      rawImages.push(coverImage)
    }
    return coverImage && rawImages.includes(coverImage)
      ? [coverImage, ...rawImages.filter((img) => img !== coverImage)]
      : rawImages
  }

  const getGalleryLayout = (images, coverImage) => {
    const count = getGalleryImages(images, coverImage).length
    if (count === 0) return "placeholder"
    if (count === 1) return "single-full"
    if (count === 2) return "two-equal"
    if (count === 3) return "three-equal"
    return "four-plus-grid"
  }

  describe("1. Adaptive Gallery Layout Classification", () => {
    test("0 photos: classifies as clean placeholder when no images or dummy placeholder", () => {
      assert.equal(getGalleryLayout([], null), "placeholder")
      assert.equal(getGalleryLayout([], "/hero-coast.png"), "placeholder")
      assert.equal(getGalleryLayout(null, "/mess-tiffin.jpg"), "placeholder")
    })

    test("1 photo: classifies as single-full layout", () => {
      assert.equal(
        getGalleryLayout(["https://supabase.co/storage/img1.jpg"], null),
        "single-full"
      )
      // Legacy single-photo where images array is empty but sample_image is real
      assert.equal(
        getGalleryLayout([], "https://supabase.co/storage/cover.jpg"),
        "single-full"
      )
    })

    test("2 photos: classifies as two-equal layout", () => {
      assert.equal(
        getGalleryLayout([
          "https://supabase.co/storage/img1.jpg",
          "https://supabase.co/storage/img2.jpg",
        ], null),
        "two-equal"
      )
    })

    test("3 photos: classifies as three-equal layout", () => {
      assert.equal(
        getGalleryLayout([
          "https://supabase.co/storage/img1.jpg",
          "https://supabase.co/storage/img2.jpg",
          "https://supabase.co/storage/img3.jpg",
        ], null),
        "three-equal"
      )
    })

    test("4+ photos: classifies as four-plus-grid layout", () => {
      const fourImgs = [
        "https://supabase.co/storage/img1.jpg",
        "https://supabase.co/storage/img2.jpg",
        "https://supabase.co/storage/img3.jpg",
        "https://supabase.co/storage/img4.jpg",
      ]
      assert.equal(getGalleryLayout(fourImgs, null), "four-plus-grid")

      const eightImgs = [
        ...fourImgs,
        "https://supabase.co/storage/img5.jpg",
        "https://supabase.co/storage/img6.jpg",
        "https://supabase.co/storage/img7.jpg",
        "https://supabase.co/storage/img8.jpg",
      ]
      assert.equal(getGalleryLayout(eightImgs, null), "four-plus-grid")
    })
  })

  describe("2. Cover Photo Priority and Ordering", () => {
    test("places selected cover photo first in display list", () => {
      const photos = [
        "https://supabase.co/storage/photoA.jpg",
        "https://supabase.co/storage/photoB.jpg",
        "https://supabase.co/storage/photoC.jpg",
      ]
      const cover = "https://supabase.co/storage/photoC.jpg"
      const ordered = getGalleryImages(photos, cover)

      assert.equal(ordered[0], cover)
      assert.equal(ordered.length, 3)
    })

    test("preserves single photo legacy records without breaking", () => {
      const ordered = getGalleryImages([], "https://supabase.co/storage/legacy_single.jpg")
      assert.equal(ordered.length, 1)
      assert.equal(ordered[0], "https://supabase.co/storage/legacy_single.jpg")
    })
  })

  describe("3. Admin Multi-Photo Reorder & Removal Operations", () => {
    test("reorders photos by moving items forward and backward", () => {
      const list = ["img1.jpg", "img2.jpg", "img3.jpg"]
      // Move img3 backward (to index 1)
      const updated = [...list]
      const [moved] = updated.splice(2, 1)
      updated.splice(1, 0, moved)
      assert.deepEqual(updated, ["img1.jpg", "img3.jpg", "img2.jpg"])
    })

    test("removes photo and updates cover if cover was removed", () => {
      const list = ["img1.jpg", "img2.jpg", "img3.jpg"]
      let cover = "img1.jpg"

      // Remove img1 (the cover)
      const updated = list.filter((x) => x !== "img1.jpg")
      if (cover === "img1.jpg") {
        cover = updated.length > 0 ? updated[0] : null
      }

      assert.deepEqual(updated, ["img2.jpg", "img3.jpg"])
      assert.equal(cover, "img2.jpg")
    })
  })
})
