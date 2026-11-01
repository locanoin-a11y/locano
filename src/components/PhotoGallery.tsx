"use client"

import React, { useState } from "react"
import { Camera, ImageOff, Maximize2, ShieldCheck } from "lucide-react"
import { FullScreenGallery } from "./FullScreenGallery"

export interface PhotoGalleryProps {
  images?: string[]
  coverImage?: string | null
  title: string
  type: "accommodation" | "mess"
}

export function PhotoGallery({
  images = [],
  coverImage,
  title,
  type,
}: PhotoGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  // 1. Filter out placeholder defaults so real images are used
  const isRealPhoto = (url: string | null | undefined): boolean => {
    if (!url || typeof url !== "string") return false
    const lower = url.toLowerCase()
    return (
      !lower.includes("hero-coast") &&
      !lower.includes("mess-tiffin") &&
      !lower.includes("mess-thali") &&
      !lower.includes("default")
    )
  }

  const rawImages = (Array.isArray(images) ? images : []).filter(isRealPhoto)

  // If no images array but coverImage is a real photo, include it
  if (rawImages.length === 0 && isRealPhoto(coverImage)) {
    rawImages.push(coverImage as string)
  }

  // If coverImage exists and is in the list, place cover photo first
  const displayImages: string[] =
    coverImage && rawImages.includes(coverImage)
      ? [coverImage, ...rawImages.filter((img) => img !== coverImage)]
      : rawImages

  const photoCount = displayImages.length

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
  }

  const closeLightbox = () => {
    setLightboxIndex(null)
  }

  const isAccom = type === "accommodation"

  return (
    <>
      <div className="mt-6 w-full">
        {/* ========================================================= */}
        {/* CASE 0: ZERO PHOTOS -> CLEAN PLACEHOLDER                  */}
        {/* ========================================================= */}
        {photoCount === 0 && (
          <div className="relative w-full rounded-2xl border border-dashed border-slate-300 bg-slate-50/80 p-8 sm:p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-xs flex items-center justify-center text-slate-400 mb-3">
              <ImageOff className="w-7 h-7 text-slate-400" />
            </div>
            <h4 className="text-base font-bold text-[#10233f]">
              No Photos Uploaded Yet
            </h4>
            <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-1 leading-relaxed">
              The property manager hasn&apos;t added official gallery photos for this{" "}
              {isAccom ? "accommodation" : "mess"} yet. You can enquire directly for live
              photos, a video walkthrough, or to schedule a visit.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Listing
              </span>
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                <Camera className="w-3.5 h-3.5 text-slate-400" />
                Photos Coming Soon
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 1: ONE PHOTO -> FULL-WIDTH IMAGE                     */}
        {/* ========================================================= */}
        {photoCount === 1 && (
          <div
            onClick={() => openLightbox(0)}
            className="group relative h-64 sm:h-80 md:h-[400px] w-full rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayImages[0]}
              alt={`${title} - Photo 1`}
              className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            />
            {/* Hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />

            {/* Bottom-right photo count badge */}
            <div className="absolute bottom-3 right-3 z-10">
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md text-white text-xs font-semibold shadow-md border border-white/10 group-hover:bg-black/80 transition-colors">
                <Camera className="w-3.5 h-3.5" />
                <span>1 Photo · Click to Enlarge</span>
                <Maximize2 className="w-3 h-3 text-white/80" />
              </span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 2: TWO PHOTOS -> TWO EQUAL-SIZED IMAGES              */}
        {/* ========================================================= */}
        {photoCount === 2 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 w-full">
            {displayImages.map((img, idx) => (
              <div
                key={`${img}_${idx}`}
                onClick={() => openLightbox(idx)}
                className="group relative h-56 sm:h-72 md:h-80 w-full rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${title} - Photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />

                {idx === 1 && (
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md text-white text-xs font-semibold shadow-md border border-white/10 group-hover:bg-black/80 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>View all 2 photos</span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 3: THREE PHOTOS -> THREE EQUAL-SIZED IMAGES          */}
        {/* ========================================================= */}
        {photoCount === 3 && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 w-full">
            {displayImages.map((img, idx) => (
              <div
                key={`${img}_${idx}`}
                onClick={() => openLightbox(idx)}
                className="group relative h-48 sm:h-64 md:h-72 w-full rounded-2xl overflow-hidden cursor-pointer bg-slate-100 border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={img}
                  alt={`${title} - Photo ${idx + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />

                {idx === 2 && (
                  <div className="absolute bottom-3 right-3 z-10">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/65 backdrop-blur-md text-white text-xs font-semibold shadow-md border border-white/10 group-hover:bg-black/80 transition-colors">
                      <Camera className="w-3.5 h-3.5" />
                      <span>View all 3 photos</span>
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ========================================================= */}
        {/* CASE 4+: 4 OR MORE PHOTOS -> HERO + SECONDARY GRID        */}
        {/* ========================================================= */}
        {photoCount >= 4 && (
          <div className="relative w-full">
            <div className="grid grid-cols-2 sm:grid-cols-4 sm:grid-rows-2 gap-2.5 sm:gap-3 h-72 sm:h-96 md:h-[420px] rounded-2xl overflow-hidden">
              {/* Main Large Photo (Span 2x2) */}
              <div
                onClick={() => openLightbox(0)}
                className="col-span-2 row-span-2 relative h-full w-full overflow-hidden cursor-pointer group bg-slate-100 border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImages[0]}
                  alt={`${title} - Main photo`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              </div>

              {/* Photo 2 (Row 1, Col 3) */}
              <div
                onClick={() => openLightbox(1)}
                className="col-span-1 row-span-1 relative h-full w-full overflow-hidden cursor-pointer group bg-slate-100 border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImages[1]}
                  alt={`${title} - Photo 2`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              </div>

              {/* Photo 3 (Row 1, Col 4) */}
              <div
                onClick={() => openLightbox(2)}
                className="col-span-1 row-span-1 relative h-full w-full overflow-hidden cursor-pointer group bg-slate-100 border border-slate-200"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImages[2]}
                  alt={`${title} - Photo 3`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              </div>

              {/* Photo 4 (Row 2, Col 3) */}
              <div
                onClick={() => openLightbox(3)}
                className={`${
                  photoCount === 4 ? "col-span-2" : "col-span-1"
                } row-span-1 relative h-full w-full overflow-hidden cursor-pointer group bg-slate-100 border border-slate-200`}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={displayImages[3]}
                  alt={`${title} - Photo 4`}
                  className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
              </div>

              {/* Photo 5 / Overflow Thumbnail (Row 2, Col 4, if photoCount >= 5) */}
              {photoCount >= 5 && (
                <div
                  onClick={() => openLightbox(4)}
                  className="col-span-1 row-span-1 relative h-full w-full overflow-hidden cursor-pointer group bg-slate-100 border border-slate-200"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={displayImages[4]}
                    alt={`${title} - Photo 5`}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />

                  {/* If more than 5 photos, show count overlay */}
                  {photoCount > 5 ? (
                    <div className="absolute inset-0 bg-black/60 backdrop-blur-xs flex flex-col items-center justify-center text-white p-2 text-center group-hover:bg-black/70 transition-colors">
                      <span className="text-base sm:text-lg font-bold">
                        +{photoCount - 5}
                      </span>
                      <span className="text-[10px] sm:text-xs font-medium text-slate-200">
                        more photos
                      </span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/15 transition-colors" />
                  )}
                </div>
              )}
            </div>

            {/* Bottom-right button to view all photos */}
            <button
              type="button"
              onClick={() => openLightbox(0)}
              className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 z-10 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-black/70 hover:bg-black/85 text-white text-xs font-semibold backdrop-blur-md border border-white/20 transition-all cursor-pointer shadow-lg"
            >
              <Camera className="w-3.5 h-3.5" />
              <span>View all {photoCount} photos</span>
            </button>
          </div>
        )}
      </div>

      {/* Lightbox Component */}
      <FullScreenGallery
        images={displayImages}
        initialIndex={lightboxIndex ?? 0}
        isOpen={lightboxIndex !== null}
        onClose={closeLightbox}
        title={title}
      />
    </>
  )
}
