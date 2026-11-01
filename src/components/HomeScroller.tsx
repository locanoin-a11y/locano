"use client"

import React, { useRef, useState, useEffect } from "react"
import Link from "next/link"
import {
  GraduationCap,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowUpRight,
  Sparkles,
} from "lucide-react"
import { fetchCampusHubs, CAMPUS_CONFIGS, type CampusHubWithCounts } from "@/lib/services/campuses"

export function HomeScroller() {
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const [hubs, setHubs] = useState<CampusHubWithCounts[]>(() =>
    CAMPUS_CONFIGS.map((c) => ({ ...c, pgCount: 0, messCount: 0 }))
  )
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let isMounted = true

    async function loadCampusData() {
      try {
        const res = await fetchCampusHubs()
        if (isMounted) {
          setHubs(res.hubs)
        }
      } catch (err) {
        console.warn("Failed to load campus counts:", err)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadCampusData()

    return () => {
      isMounted = false
    }
  }, [])

  const scroll = (direction: "left" | "right") => {
    if (!scrollContainerRef.current) return
    const offset = direction === "left" ? -340 : 340
    scrollContainerRef.current.scrollBy({ left: offset, behavior: "smooth" })
  }

  return (
    <section className="relative pt-10 sm:pt-14 pb-12 sm:pb-16 bg-white overflow-hidden border-b border-slate-100">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold text-[#1f6fe5] bg-blue-50 border border-blue-100 uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Campus &amp; Locality Hubs</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#10233f] tracking-tight">
              Mangaluru Student Campuses
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-xl">
              Tap any college or neighborhood to instantly view verified student PGs and daily home-style food near your campus.
            </p>
          </div>

          {/* Navigation Arrows for desktop */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
              className="w-9 h-9 rounded-full border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-600 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SNAP SCROLLER */}
      <div
        ref={scrollContainerRef}
        className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth px-4 sm:px-6 lg:px-8 pb-3 pt-1"
        style={{ scrollSnapType: "x mandatory" }}
      >
        {hubs.map((hub) => (
          <div
            key={hub.id}
            className="shrink-0 w-[280px] sm:w-[310px] bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:-translate-y-1 transition-all duration-300 p-4 sm:p-5 flex flex-col justify-between"
            style={{ scrollSnapAlign: "start" }}
          >
            <div>
              {/* Card Header: Tag & Pin */}
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-[10.5px] font-bold border ${hub.badgeBg}`}>
                  {hub.tag}
                </span>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <MapPin className="w-3 h-3 text-[#1f6fe5]" />
                  <span>{hub.locality}</span>
                </span>
              </div>

              {/* Institution Title */}
              <div className="flex items-start gap-2.5 mb-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 shrink-0 mt-0.5">
                  <GraduationCap className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm sm:text-base font-bold text-[#10233f] leading-snug line-clamp-1">
                    {hub.name}
                  </h3>
                  <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">
                    {hub.subtitle}
                  </p>
                </div>
              </div>

              {/* Availability Counters */}
              <div className="flex items-center gap-2 mt-3.5 mb-4 text-[11px] font-semibold text-slate-600">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 inline-flex items-center min-w-[50px] justify-center">
                  {isLoading ? (
                    <span className="inline-block w-8 h-3.5 bg-slate-200 rounded animate-pulse" />
                  ) : (
                    `${hub.pgCount} PGs`
                  )}
                </span>
                <span className="text-slate-300">•</span>
                <span className="px-2 py-0.5 rounded bg-orange-50 text-orange-700 inline-flex items-center min-w-[60px] justify-center">
                  {isLoading ? (
                    <span className="inline-block w-10 h-3.5 bg-orange-200/60 rounded animate-pulse" />
                  ) : (
                    `${hub.messCount} Messes`
                  )}
                </span>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="pt-3 border-t border-slate-100 grid grid-cols-2 gap-2">
              <Link
                href={`/accommodation?search=${encodeURIComponent(hub.locality)}`}
                className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-blue-50 hover:bg-[#1f6fe5] text-[#1f6fe5] hover:text-white text-[11.5px] font-bold transition-colors text-center"
              >
                <span>Find PGs</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
              <Link
                href={`/mess?search=${encodeURIComponent(hub.locality)}`}
                className="inline-flex items-center justify-center gap-1 py-1.5 px-2 rounded-xl bg-orange-50 hover:bg-[#ea580c] text-[#ea580c] hover:text-white text-[11.5px] font-bold transition-colors text-center"
              >
                <span>Find Mess</span>
                <ArrowUpRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
