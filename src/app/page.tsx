import React from "react"
import { HomeHero } from "@/components/HomeHero"
import { RoutesSection } from "@/components/RoutesSection"
import { AboutSection } from "@/components/AboutSection"
import { HomeScroller } from "@/components/HomeScroller"

export default function HomePage() {
  return (
    <div className="relative">
      <HomeHero />
      <RoutesSection />
      <AboutSection />
      <HomeScroller />
    </div>
  )
}
