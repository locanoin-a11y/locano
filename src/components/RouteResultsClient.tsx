"use client"

import React, { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import type { ResultCard } from "@/lib/search-results"
import type { Stop } from "@/data/stops"
import { formatMinutes, indicativeFare, formatInr } from "@/lib/format"
import { compareBusNumbers } from "@/lib/bus-service"
import { pushRecent } from "@/lib/recent-searches"
import { RouteMap } from "@/components/RouteMap"
import { LocationSearch } from "@/components/LocationSearch"
import {
  Bus,
  ArrowRight,
  Clock,
  Navigation,
  Compass,
  Filter,
  ArrowDownUp,
  MapPin,
  AlertCircle,
  Sparkles,
} from "lucide-react"

interface RouteResultsClientProps {
  from: Stop
  to: Stop
  initialCards: ResultCard[]
}

type FilterType = "All Buses" | "Direct Buses" | "Nearby Stops"
type SortType = "time" | "number" | "fleet"

export function RouteResultsClient({ from, to, initialCards }: RouteResultsClientProps) {
  const [activeFilter, setActiveFilter] = useState<FilterType>("All Buses")
  const [activeSort, setActiveSort] = useState<SortType>("time")
  const [showEditSearch, setShowEditSearch] = useState(false)

  // Save to recent searches on client mount
  useEffect(() => {
    pushRecent({
      id: `${from.id}:${to.id}`,
      label: `${from.name} → ${to.name}`,
      href: `/transport/route/${from.id}-to-${to.id}`,
    })
  }, [from, to])

  const filteredAndSortedCards = useMemo(() => {
    let result = [...initialCards]

    // Filters: All Buses, Direct Buses, Nearby Stops
    if (activeFilter === "Direct Buses") {
      result = result.filter((card) => !card.nearby)
    } else if (activeFilter === "Nearby Stops") {
      result = result.filter((card) => card.nearby)
    }

    // Sorts: time, number, fleet
    result.sort((a, b) => {
      if (activeSort === "time") {
        return a.minutes - b.minutes || compareBusNumbers(a.number, b.number)
      }
      if (activeSort === "number") {
        return compareBusNumbers(a.number, b.number)
      }
      if (activeSort === "fleet") {
        const fleetA = a.fleet ?? -1
        const fleetB = b.fleet ?? -1
        return fleetB - fleetA || a.minutes - b.minutes
      }
      return 0
    })

    return result
  }, [initialCards, activeFilter, activeSort])

  const directCount = initialCards.filter((c) => !c.nearby).length
  const nearbyCount = initialCards.filter((c) => c.nearby).length

  return (
    <div className="space-y-8">
      {/* ROUTE HEADER CARD */}
      <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1f6fe5] mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>Route Search Results</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#10233f] tracking-tight flex items-center gap-3 flex-wrap">
              <span>{from.name}</span>
              <ArrowRight className="w-5 h-5 text-slate-400" />
              <span>{to.name}</span>
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              Found {initialCards.length} connection{initialCards.length === 1 ? "" : "s"} ({directCount} direct, {nearbyCount} nearby alternatives).
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowEditSearch(!showEditSearch)}
            className="px-4 py-2 rounded-full border border-slate-200 text-xs font-semibold text-slate-700 hover:text-[#1f6fe5] hover:border-blue-300 transition-colors self-start md:self-auto"
          >
            {showEditSearch ? "Hide Search Bar" : "Change Stops"}
          </button>
        </div>

        {/* EDIT SEARCH ACCORDION */}
        {showEditSearch && (
          <div className="pt-5 pb-2">
            <LocationSearch showRecents={false} onSuccess={() => setShowEditSearch(false)} />
          </div>
        )}

        {/* CONTROLS: FILTERS & SORTS */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* FILTERS */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-full text-xs font-semibold text-slate-600 max-w-max">
            <button
              onClick={() => setActiveFilter("All Buses")}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === "All Buses"
                  ? "bg-white text-[#10233f] shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              All Buses ({initialCards.length})
            </button>
            <button
              onClick={() => setActiveFilter("Direct Buses")}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === "Direct Buses"
                  ? "bg-white text-[#10233f] shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Direct ({directCount})
            </button>
            <button
              onClick={() => setActiveFilter("Nearby Stops")}
              className={`px-3 py-1.5 rounded-full transition-all ${
                activeFilter === "Nearby Stops"
                  ? "bg-white text-[#10233f] shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              Nearby Stops ({nearbyCount})
            </button>
          </div>

          {/* SORTS */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-slate-400 font-medium flex items-center gap-1">
              <ArrowDownUp className="w-3.5 h-3.5" />
              <span>Sort by:</span>
            </span>
            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as SortType)}
              className="px-3 py-1.5 rounded-full border border-slate-200 bg-white font-medium text-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-[#1f6fe5]"
            >
              <option value="time">Travel Time (Fastest)</option>
              <option value="number">Bus Number</option>
              <option value="fleet">Fleet Capacity</option>
            </select>
          </div>
        </div>
      </div>

      {/* RESULTS LIST & MAP GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* CARDS LIST (LEFT 7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          {filteredAndSortedCards.map((card) => {
            const fare = indicativeFare(card.minutes * 0.3) // indicative estimate

            return (
              <Link
                key={card.id}
                href={`/transport/bus/${card.busId}?from=${card.fromId}&to=${card.toId}`}
                className="block p-5 bg-white rounded-3xl border border-slate-100 locano-card locano-card-interactive group transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* BUS NUMBER & ROUTE INFO */}
                  <div className="flex items-start gap-4">
                    <div className="w-13 h-13 rounded-2xl bg-blue-50 border border-blue-100 text-[#1f6fe5] font-extrabold flex items-center justify-center text-lg shrink-0 group-hover:bg-[#1f6fe5] group-hover:text-white transition-colors">
                      {card.number}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-base font-bold text-[#10233f] group-hover:text-[#1f6fe5] transition-colors">
                          {card.fromName} → {card.toName}
                        </span>

                        {card.nearby ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200/70 flex items-center gap-1">
                            <Navigation className="w-2.5 h-2.5" />
                            <span>Nearby Stop</span>
                          </span>
                        ) : card.alongRoad ? (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200/70">
                            Along the Road
                          </span>
                        ) : (
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/70">
                            Direct Ride
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-slate-400 flex items-center gap-1.5 flex-wrap">
                        <span>Via:</span>
                        <span className="text-slate-600 font-medium">
                          {card.via.join(" · ")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* STATS & LINK */}
                  <div className="flex items-center justify-between sm:justify-end gap-5 pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-base font-extrabold text-[#10233f] flex items-center gap-1 justify-start sm:justify-end">
                        <Clock className="w-3.5 h-3.5 text-[#1f6fe5]" />
                        <span>{formatMinutes(card.minutes)}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Fleet: {card.fleet !== null ? `${card.fleet}` : "—"}
                      </div>
                    </div>

                    <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-[#1f6fe5] transition-colors shrink-0">
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}

          {filteredAndSortedCards.length === 0 && (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200 text-sm text-slate-500">
              <AlertCircle className="w-8 h-8 text-amber-500 mx-auto mb-2" />
              <div className="font-semibold text-slate-700">No buses matching this filter.</div>
              <div className="text-xs text-slate-400 mt-1">
                Try switching to &quot;All Buses&quot; to see alternatives.
              </div>
            </div>
          )}
        </div>

        {/* MAP DISPLAY (RIGHT 5 COLS) */}
        <div className="lg:col-span-5 sticky top-28 space-y-4">
          <div className="bg-white rounded-3xl p-4 border border-slate-100 locano-card h-[460px] overflow-hidden">
            <RouteMap stops={[from, to]} fromId={from.id} toId={to.id} />
          </div>
          <div className="text-center text-xs text-slate-400">
            A: {from.name} · B: {to.name}
          </div>
        </div>
      </div>
    </div>
  )
}
