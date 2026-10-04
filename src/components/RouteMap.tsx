"use client"

import dynamic from "next/dynamic"
import React from "react"
import type { Stop } from "@/data/stops"

const RouteMapInner = dynamic(() => import("./RouteMapInner"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[300px] rounded-3xl bg-[#f4f7fb] flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-200/60">
      <div className="w-8 h-8 rounded-full border-2 border-[#1f6fe5] border-t-transparent animate-spin" />
      <span className="text-xs font-medium">Loading Mangaluru transit map...</span>
    </div>
  ),
})

interface RouteMapProps {
  stops: Stop[]
  fromId?: string
  toId?: string
  highlightIds?: string[]
  className?: string
}

export function RouteMap(props: RouteMapProps) {
  return (
    <div className={`w-full h-full ${props.className || ""}`}>
      <RouteMapInner {...props} />
    </div>
  )
}
