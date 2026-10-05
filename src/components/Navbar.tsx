"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { useModal } from "@/context/ModalContext"
import { Search, User, Compass } from "lucide-react"

export function Navbar() {
  const pathname = usePathname()
  const { openSearch, openAccount } = useModal()
  const [isScrolled, setIsScrolled] = useState(false)
  const [onHero, setOnHero] = useState(pathname === "/")

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 24)

      if (pathname === "/") {
        const heroEl = document.getElementById("hero")
        if (heroEl) {
          const rect = heroEl.getBoundingClientRect()
          // If hero is mostly in view, onHero is true
          setOnHero(rect.bottom > 120)
        } else {
          setOnHero(window.scrollY < 300)
        }
      } else {
        setOnHero(false)
      }
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [pathname])

  return (
    <header className="fixed top-5 left-0 right-0 z-40 flex justify-center px-4 pointer-events-none">
      <nav
        className={`pointer-events-auto flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-full border border-slate-200/60 pill-navbar transition-all duration-420 ${
          isScrolled
            ? "pill-navbar-scrolled bg-white/92 shadow-md shadow-slate-900/5"
            : "bg-white/80 backdrop-blur-md shadow-xs"
        }`}
      >
        {/* LOGO */}
        <div className="flex items-center mr-2 sm:mr-3">
          <Link
            href="/"
            className="flex items-center select-none group"
          >
            <Image
              src="/locano-logo.png"
              alt="Locano Logo"
              width={200}
              height={60}
              className="h-9 sm:h-10 w-auto object-contain"
              priority
            />
          </Link>
        </div>

        {/* NAVIGATION LINKS */}
        <div className="flex items-center gap-0.5 sm:gap-1 text-xs sm:text-sm font-medium text-slate-700">
          <Link
            href={pathname === "/" ? "#hero" : "/"}
            className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-[#1f6fe5] hover:bg-slate-100/60 transition-colors"
          >
            Home
          </Link>
          <Link
            href="/transport"
            className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-[#1f6fe5] hover:bg-slate-100/60 transition-colors"
          >
            Routes
          </Link>
          <Link
            href={pathname === "/" ? "#about" : "/about"}
            className="px-2.5 sm:px-3 py-1.5 rounded-full hover:text-[#1f6fe5] hover:bg-slate-100/60 transition-colors"
          >
            About
          </Link>
        </div>

        {/* DIVIDER */}
        <div className="w-[1px] h-4 bg-slate-200 mx-1 sm:mx-1.5" />

        {/* SEARCH TRIGGER */}
        <button
          type="button"
          onClick={() => openSearch("location")}
          className="p-1.5 sm:px-3 sm:py-1.5 rounded-full hover:bg-slate-100/80 text-slate-700 hover:text-[#1f6fe5] transition-colors flex items-center gap-1.5 text-xs sm:text-sm font-medium"
          aria-label="Search routes and buses"
        >
          <Search className="w-4 h-4 text-slate-600" />
          <span className="hidden sm:inline">Search</span>
        </button>

        {/* SIGN IN BUTTON */}
        <button
          type="button"
          onClick={openAccount}
          className="ml-1 px-3 sm:px-4 py-1.5 rounded-full bg-[#10233f] text-white hover:bg-[#1f6fe5] transition-colors text-xs sm:text-sm font-semibold shadow-xs flex items-center gap-1.5"
        >
          <User className="w-3.5 h-3.5" />
          <span>Sign In</span>
        </button>
      </nav>
    </header>
  )
}
