import React from "react"
import Link from "next/link"
import Image from "next/image"
import { ScrollReveal } from "@/components/ScrollReveal"
import {
  Home,
  UtensilsCrossed,
  Bus,
  HeartPulse,
  ShieldCheck,
  ArrowRight,
  Compass,
  CheckCircle2,
  Sparkles,
} from "lucide-react"

export function AboutSection() {
  return (
    <section
      id="about"
      className="scroll-mt-24 pt-24 sm:pt-32 pb-20 sm:pb-28 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white via-[#f4f8fe] to-[#f4f8fe] relative overflow-hidden"
    >
      <div className="max-w-6xl mx-auto w-full">
        {/* TOP ABOUT SECTION GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          {/* LEFT COLUMN: Narrative, 4 Core Pillars, & Mission Statement */}
          <ScrollReveal className="lg:col-span-7" distance={16} duration={620}>
            {/* Category Tag */}
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-blue-50 text-[#1f6fe5] border border-blue-100/80 mb-4">
              <Sparkles className="w-3.5 h-3.5 text-[#1f6fe5]" />
              <span>ABOUT LOCANO · MANGALURU STUDENT PLATFORM</span>
            </div>

            {/* Main Headline */}
            <h2 className="text-3xl sm:text-5xl font-extrabold text-[#10233f] tracking-tight leading-[1.12] mb-5">
              <div>A new city.</div>
              <div className="text-[#1f6fe5]">Settling made simple.</div>
            </h2>

            {/* Introduction: Why LOCANO Exists */}
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-xl mb-8">
              Every year, thousands of students move to Mangaluru to join premier universities and colleges.
              Yet, navigating a new city alone can be overwhelming. Finding a safe place to stay, securing wholesome
              daily food, figuring out local bus routes, and knowing where to turn during an emergency shouldn&apos;t depend
              on guesswork or expensive middlemen. LOCANO was built to bring all of Mangaluru&apos;s student essentials together
              in one transparent, student-first platform.
            </p>

            {/* Four Core Pillars of LOCANO */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
              {/* Pillar 1: Accommodation */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-xs hover:border-blue-100 transition-all">
                <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#1f6fe5] flex items-center justify-center mb-3">
                  <Home className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#10233f]">
                  Student Accommodations
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Verified PGs, hostels, and shared flats with photo galleries, transparent rent, and direct owner contact without broker commissions.
                </p>
              </div>

              {/* Pillar 2: Food & Mess */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-xs hover:border-orange-100 transition-all">
                <div className="w-9 h-9 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center mb-3">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#10233f]">
                  Food &amp; Mess Directory
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Explore local messes and tiffins with dietary tags, meal timings, flexible daily/monthly pricing models, and group discounts.
                </p>
              </div>

              {/* Pillar 3: Transit */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-xs hover:border-emerald-100 transition-all">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
                  <Bus className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#10233f]">
                  City Bus Transit Guide
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Accurate route numbers, stop sequences, nearby stop locator, and indicative fares to travel across campuses with confidence.
                </p>
              </div>

              {/* Pillar 4: Emergency Services */}
              <div className="p-4 rounded-2xl bg-white border border-slate-100/90 shadow-2xs hover:shadow-xs hover:border-rose-100 transition-all">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-3">
                  <HeartPulse className="w-4 h-4" />
                </div>
                <h3 className="text-sm font-bold text-[#10233f]">
                  Emergency &amp; Health
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed mt-1">
                  Instant access to 24/7 verified hospital casualty desks, ambulance lines, and emergency contact numbers across Mangaluru corridors.
                </p>
              </div>
            </div>

            {/* Mission Statement Card */}
            <div className="p-5 rounded-2xl bg-[#eef5fd] border border-blue-200/60 shadow-2xs mb-8">
              <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#1f6fe5] uppercase tracking-wider">
                <Compass className="w-4 h-4" />
                <span>Our Mission</span>
              </div>
              <p className="text-xs sm:text-sm text-[#10233f] font-medium leading-relaxed italic">
                &ldquo;To eliminate the confusion of moving to a new city by empowering every student in Mangaluru with trusted local information, verified living spaces, and essential daily services so they can thrive from day one.&rdquo;
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
              <Link
                href="/accommodation"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1f6fe5] hover:bg-[#1656b8] text-white text-xs sm:text-sm font-semibold transition-all shadow-xs"
              >
                <span>Find Accommodation</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/mess"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold transition-all shadow-2xs"
              >
                <span>Explore Messes</span>
              </Link>
              <Link
                href="/transport"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[#1f6fe5] hover:gap-2.5 transition-all group ml-1"
              >
                <span>Bus Routes</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </ScrollReveal>

          {/* RIGHT COLUMN: Coastal Card with Trust Elements */}
          <ScrollReveal
            className="lg:col-span-5 flex justify-center lg:justify-end relative"
            delay={140}
            distance={16}
            duration={650}
          >
            {/* Subtle decorative curved shape */}
            <div
              className="absolute -right-6 top-1/2 -translate-y-1/2 w-72 sm:w-84 h-72 sm:h-84 rounded-full bg-[#e1eefc]/70 blur-2xl -z-10 pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute right-0 top-1/2 -translate-y-1/2 w-48 sm:w-60 h-80 sm:h-96 rounded-r-full bg-[#e8f1fc]/50 -z-10 pointer-events-none hidden sm:block"
              aria-hidden="true"
            />

            {/* The Coastal Road Card with Floating Badges */}
            <div className="relative rounded-[28px] overflow-hidden shadow-xl border border-slate-100 max-w-[400px] w-full locano-card transition-transform duration-300 hover:scale-[1.01]">
              <Image
                src="/about-coast.png"
                alt="Same city. New beginnings. Mangaluru coast"
                width={389}
                height={430}
                className="w-full h-auto object-cover block"
                priority
              />

              {/* Floating Badge 1: Top-left Verified Quality */}
              <div className="absolute top-4 left-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-[#10233f] text-xs font-bold shadow-md border border-slate-100">
                  <ShieldCheck className="w-4 h-4 text-emerald-500" />
                  <span>Verified Listings</span>
                </span>
              </div>

              {/* Floating Badge 2: Bottom-right Direct Contact */}
              <div className="absolute bottom-4 right-4 z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#10233f]/90 backdrop-blur-md text-white text-xs font-semibold shadow-md border border-white/10">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>Zero Brokerage</span>
                </span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* BOTTOM SUMMARY BANNER */}
        <ScrollReveal distance={16} duration={620} className="mt-16 sm:mt-20">
          <div className="p-6 sm:p-8 rounded-3xl bg-[#eaf3fe] border border-blue-100/80 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
              <div className="w-14 h-14 rounded-full bg-white text-[#1f6fe5] flex items-center justify-center shadow-xs shrink-0">
                <ShieldCheck className="w-7 h-7 text-[#1f6fe5]" />
              </div>
              <div>
                <h3 className="text-lg sm:text-xl font-bold text-[#10233f]">
                  Built for students. Made for Mangaluru.
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Connecting students with verified accommodations, mess subscriptions, and city transit.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Link
                href="/accommodation"
                className="px-6 py-3 rounded-full bg-[#10233f] text-white hover:bg-[#1f6fe5] transition-colors text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-xs"
              >
                <span>Find Your Place</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
