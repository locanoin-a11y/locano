"use client"

import React, { useState, useRef, useEffect, useMemo } from "react"
import { MapPin, Navigation, X, Loader2, Check, Search } from "lucide-react"

export const POPULAR_MANGALURU_AREAS = [
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
  "Malikkatte",
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
]

export const MANGALURU_COORDS: Record<string, { lat: number; lng: number }> = {
  Valencia: { lat: 12.8596, lng: 74.8519 },
  Balmatta: { lat: 12.8708, lng: 74.8458 },
  Deralakatte: { lat: 12.8166, lng: 74.8988 },
  Kankanady: { lat: 12.8633, lng: 74.8585 },
  Hampankatta: { lat: 12.8687, lng: 74.8427 },
  Kadri: { lat: 12.8858, lng: 74.856 },
  Surathkal: { lat: 13.0119, lng: 74.7943 },
  Bejai: { lat: 12.8872, lng: 74.8422 },
  Attavar: { lat: 12.8617, lng: 74.8475 },
  Falnir: { lat: 12.864, lng: 74.846 },
  Pumpwell: { lat: 12.859, lng: 74.8635 },
  Bendoor: { lat: 12.8708, lng: 74.852 },
  Kuntikana: { lat: 12.8985, lng: 74.857 },
  Kodialbail: { lat: 12.8735, lng: 74.8415 },
  Lalbagh: { lat: 12.8805, lng: 74.8427 },
  Kottara: { lat: 12.894, lng: 74.843 },
  Urwa: { lat: 12.887, lng: 74.836 },
  Adyar: { lat: 12.868, lng: 74.912 },
  Mudippu: { lat: 12.812, lng: 74.954 },
  Padil: { lat: 12.867, lng: 74.885 },
  Ullal: { lat: 12.825, lng: 74.854 },
  Bondel: { lat: 12.915, lng: 74.865 },
  Panambur: { lat: 12.952, lng: 74.808 },
  Jeppu: { lat: 12.8519, lng: 74.8465 },
  Pandeshwar: { lat: 12.8586, lng: 74.8392 },
}

export function getClosestMangaluruArea(lat: number, lng: number): string {
  let closest = "Balmatta"
  let minDistance = Infinity

  for (const [area, coords] of Object.entries(MANGALURU_COORDS)) {
    const dLat = coords.lat - lat
    const dLng = coords.lng - lng
    const distSq = dLat * dLat + dLng * dLng
    if (distSq < minDistance) {
      minDistance = distSq
      closest = area
    }
  }

  return closest
}

interface LocationSearchInputProps {
  value: string
  onChange: (val: string) => void
  placeholder?: string
  accentColor?: "blue" | "brand"
  className?: string
  customSuggestions?: string[]
}

export function LocationSearchInput({
  value,
  onChange,
  placeholder = "e.g. Valencia, Balmatta, Deralakatte...",
  accentColor = "blue",
  className = "",
  customSuggestions,
}: LocationSearchInputProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isLocating, setIsLocating] = useState(false)
  const [geoError, setGeoError] = useState<string | null>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(-1)

  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Merge built-in master areas with any dynamic suggestions passed from active listings
  const allAvailableSuggestions = useMemo(() => {
    const set = new Set<string>()
    POPULAR_MANGALURU_AREAS.forEach((a) => set.add(a))

    if (customSuggestions && Array.isArray(customSuggestions)) {
      customSuggestions.forEach((s) => {
        const trimmed = s?.trim()
        if (trimmed && trimmed.length > 1) {
          const lower = trimmed.toLowerCase()
          let alreadyExists = false
          for (const existing of set) {
            if (existing.toLowerCase() === lower) {
              alreadyExists = true
              break
            }
          }
          if (!alreadyExists) {
            set.add(trimmed)
          }
        }
      })
    }

    return Array.from(set)
  }, [customSuggestions])

  // Filter and prioritize suggestions in real-time as user types
  const query = value?.trim().toLowerCase() || ""
  const matchingSuggestions = useMemo(() => {
    if (!query || query === "all areas") {
      return POPULAR_MANGALURU_AREAS.slice(0, 15)
    }

    const starts: string[] = []
    const contains: string[] = []

    for (const item of allAvailableSuggestions) {
      const lower = item.toLowerCase()
      if (lower.startsWith(query)) {
        starts.push(item)
      } else if (lower.includes(query)) {
        contains.push(item)
      }
    }

    // Sort alphabetically within each priority bucket
    starts.sort((a, b) => a.localeCompare(b))
    contains.sort((a, b) => a.localeCompare(b))

    return [...starts, ...contains].slice(0, 14)
  }, [query, allAvailableSuggestions])

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick)
      document.addEventListener("keydown", handleKeyDown)
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [isOpen])

  // Reset selected index when query changes (rendered adjust pattern)
  const [prevQuery, setPrevQuery] = useState(query)
  if (prevQuery !== query) {
    setPrevQuery(query)
    setSelectedIndex(-1)
  }

  const handleUseCurrentLocation = () => {
    setGeoError(null)
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.")
      return
    }

    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false)
        const area = getClosestMangaluruArea(pos.coords.latitude, pos.coords.longitude)
        onChange(area)
        setIsOpen(false)
        setSelectedIndex(-1)
      },
      (err) => {
        setIsLocating(false)
        console.warn("Geolocation notice:", err.message)
        onChange("Balmatta")
        setIsOpen(false)
        setSelectedIndex(-1)
      },
      { timeout: 8000, enableHighAccuracy: true }
    )
  }

  const handleSelect = (item: string) => {
    onChange(item)
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setIsOpen(true)
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev < matchingSuggestions.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : matchingSuggestions.length - 1))
    } else if (e.key === "Enter") {
      if (isOpen && selectedIndex >= 0 && selectedIndex < matchingSuggestions.length) {
        e.preventDefault()
        handleSelect(matchingSuggestions[selectedIndex])
      } else {
        setIsOpen(false)
      }
    }
  }

  const activeBorder =
    accentColor === "brand"
      ? "border-[#0066FF] ring-2 ring-[#0066FF]/15 bg-white"
      : "border-[#1f6fe5] ring-2 ring-[#1f6fe5]/15 bg-white"

  const activeIconColor = accentColor === "brand" ? "text-[#0066FF]" : "text-[#1f6fe5]"
  const highlightColor = accentColor === "brand" ? "text-[#0066FF]" : "text-[#1f6fe5]"

  // Helper to highlight matching text in suggestion
  const renderHighlightedText = (text: string) => {
    if (!query || query === "all areas") return text
    const idx = text.toLowerCase().indexOf(query)
    if (idx === -1) return text
    const before = text.substring(0, idx)
    const matched = text.substring(idx, idx + query.length)
    const after = text.substring(idx + query.length)
    return (
      <span>
        {before}
        <strong className={`${highlightColor} font-bold bg-blue-50/90 px-0.5 rounded`}>
          {matched}
        </strong>
        {after}
      </span>
    )
  }

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      {/* Search Input Box */}
      <div
        onClick={() => {
          setIsOpen(true)
          inputRef.current?.focus()
        }}
        className={`w-full h-[50px] flex items-center gap-3 px-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 transition-all cursor-text hover:bg-slate-50/90 hover:border-slate-300 ${
          isOpen ? activeBorder : ""
        }`}
      >
        <MapPin className={`w-4 h-4 ${activeIconColor} shrink-0`} />

        <div className="flex-1 min-w-0">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 leading-none mb-1">
            Location / Area
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onFocus={() => setIsOpen(true)}
            onChange={(e) => {
              onChange(e.target.value)
              if (!isOpen) setIsOpen(true)
            }}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            className="w-full bg-transparent text-xs sm:text-[13px] font-semibold text-[#10233f] placeholder:text-slate-400 placeholder:font-normal focus:outline-none"
          />
        </div>

        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation()
              onChange("")
              setSelectedIndex(-1)
              inputRef.current?.focus()
            }}
            className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer shrink-0"
            aria-label="Clear location search"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Dropdown Options Popup */}
      {isOpen && (
        <div
          ref={listRef}
          className="absolute top-[calc(100%+0.35rem)] left-0 w-full z-40 bg-white rounded-2xl border border-slate-200/90 shadow-2xl overflow-hidden py-1.5 animate-in fade-in zoom-in-95 duration-150 max-h-80 overflow-y-auto"
        >
          {/* Option 1: Use Current Location */}
          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-blue-50/70 text-left transition-colors cursor-pointer border-b border-slate-100 group"
          >
            <div className="w-8 h-8 rounded-full bg-blue-50 group-hover:bg-blue-100 text-[#1f6fe5] flex items-center justify-center shrink-0 transition-colors">
              {isLocating ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#1f6fe5]" />
              ) : (
                <Navigation className="w-4 h-4 text-[#1f6fe5]" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs sm:text-[13px] font-bold text-[#1f6fe5] leading-tight">
                {isLocating ? "Detecting location..." : "Use current location"}
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Automatically detect nearest student zone
              </div>
            </div>
          </button>

          {geoError && (
            <div className="px-4 py-2 text-[11px] text-rose-500 bg-rose-50 border-b border-rose-100">
              {geoError}
            </div>
          )}

          {/* Option List: Matching Suggestions */}
          <div className="pt-1.5">
            <div className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center justify-between">
              <span>{query ? "Matching Locations" : "Popular Student Zones"}</span>
              {query && (
                <span className="text-[9px] font-normal text-slate-400">
                  {matchingSuggestions.length} found
                </span>
              )}
            </div>

            {matchingSuggestions.length > 0 ? (
              matchingSuggestions.map((item, index) => {
                const isSelected = value.toLowerCase() === item.toLowerCase()
                const isFocused = selectedIndex === index

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => handleSelect(item)}
                    className={`w-full px-4 py-2 text-left text-xs sm:text-[13px] flex items-center justify-between transition-colors cursor-pointer ${
                      isSelected
                        ? "bg-blue-50/80 text-[#1f6fe5] font-bold"
                        : isFocused
                        ? "bg-slate-100/90 text-[#10233f] font-semibold"
                        : "text-[#10233f] font-semibold hover:bg-slate-50"
                    }`}
                  >
                    <span className="flex items-center gap-2 min-w-0 flex-1 pr-2 truncate">
                      <MapPin
                        className={`w-3.5 h-3.5 shrink-0 ${
                          isSelected ? "text-[#1f6fe5]" : "text-slate-400"
                        }`}
                      />
                      <span className="truncate">{renderHighlightedText(item)}</span>
                    </span>

                    {isSelected && <Check className="w-4 h-4 text-[#1f6fe5] shrink-0" />}
                  </button>
                )
              })
            ) : (
              <div className="px-4 py-3 text-center text-xs text-slate-500">
                <Search className="w-4 h-4 text-slate-300 mx-auto mb-1" />
                <p>No matching areas found for &ldquo;{value}&rdquo;</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Press Enter to search anyway</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
