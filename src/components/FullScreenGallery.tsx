"use client"

import React, { useState, useEffect, useCallback, useRef } from "react"
import { X, ChevronLeft, ChevronRight, Camera } from "lucide-react"

export interface FullScreenGalleryProps {
  images: string[]
  initialIndex?: number
  isOpen: boolean
  onClose: () => void
  title?: string
}

export function FullScreenGallery({
  images,
  initialIndex = 0,
  isOpen,
  onClose,
  title = "Photo Gallery",
}: FullScreenGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen)
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex)

  // Adjust state during render phase without triggering cascading effect renders
  if (isOpen !== prevIsOpen || initialIndex !== prevInitialIndex) {
    setPrevIsOpen(isOpen)
    setPrevInitialIndex(initialIndex)
    if (isOpen) {
      setCurrentIndex(initialIndex >= 0 && initialIndex < images.length ? initialIndex : 0)
    }
  }

  // Lock body scroll
  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      document.body.style.overflow = originalOverflow
    }
  }, [isOpen])

  const handleNext = useCallback(() => {
    if (images.length <= 1) return
    setCurrentIndex((prev) => (prev + 1) % images.length)
  }, [images.length])

  const handlePrev = useCallback(() => {
    if (images.length <= 1) return
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length)
  }, [images.length])

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
      } else if (e.key === "ArrowRight") {
        handleNext()
      } else if (e.key === "ArrowLeft") {
        handlePrev()
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, handleNext, handlePrev, onClose])

  // Mobile swipe support
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.targetTouches[0].clientX
    touchEndX.current = null
  }

  const onTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.targetTouches[0].clientX
  }

  const onTouchEnd = () => {
    if (touchStartX.current === null || touchEndX.current === null) return
    const deltaX = touchStartX.current - touchEndX.current
    const swipeThreshold = 50 // Minimum swipe distance in px

    if (deltaX > swipeThreshold) {
      // Swiped left -> next
      handleNext()
    } else if (deltaX < -swipeThreshold) {
      // Swiped right -> prev
      handlePrev()
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  if (!isOpen || images.length === 0) return null

  const activeImage = images[currentIndex] || images[0]

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Full-screen photo gallery"
      className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between select-none animate-in fade-in duration-200"
    >
      {/* TOP BAR */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-4 z-20 bg-linear-to-b from-black/80 to-transparent">
        <div className="flex items-center gap-3 text-white">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-xs font-semibold">
            <Camera className="w-3.5 h-3.5" />
            <span>
              {currentIndex + 1} / {images.length}
            </span>
          </div>
          {title && (
            <span className="text-xs sm:text-sm font-medium text-slate-300 truncate max-w-[200px] sm:max-w-md">
              {title}
            </span>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close gallery"
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* MAIN IMAGE VIEWPORT */}
      <div
        className="relative flex-1 flex items-center justify-center px-4 sm:px-16 overflow-hidden cursor-grab active:cursor-grabbing"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Previous photo"
            className="absolute left-3 sm:left-6 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
        )}

        {/* Current Photo */}
        <div className="relative max-h-[72vh] max-w-[92vw] sm:max-w-[85vw] w-full h-full flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={activeImage}
            alt={`${title} - Photo ${currentIndex + 1}`}
            className="max-h-[72vh] max-w-full w-auto object-contain rounded-xl shadow-2xl transition-opacity duration-200"
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={handleNext}
            aria-label="Next photo"
            className="absolute right-3 sm:right-6 z-20 w-11 h-11 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 flex items-center justify-center transition-all cursor-pointer backdrop-blur-xs"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* BOTTOM THUMBNAIL STRIP */}
      {images.length > 1 && (
        <div className="py-4 px-4 bg-linear-to-t from-black/80 to-transparent z-20">
          <div className="max-w-4xl mx-auto flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {images.map((img, idx) => {
              const isActive = idx === currentIndex
              return (
                <button
                  key={`${img}_${idx}`}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Go to photo ${idx + 1}`}
                  className={`relative w-14 h-11 sm:w-16 sm:h-12 rounded-lg overflow-hidden shrink-0 transition-all cursor-pointer border ${
                    isActive
                      ? "ring-2 ring-white border-white scale-105 opacity-100"
                      : "border-white/20 opacity-50 hover:opacity-80"
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={`Thumbnail ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
