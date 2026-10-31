import React from "react"
import Link from "next/link"
import Image from "next/image"
import { Bus, MapPin, Navigation, Shield, FileText, Info } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-[#0b1626] text-slate-400 pt-16 pb-12 border-t border-slate-800/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/80">
          {/* BRAND COLUMN */}
          <div className="md:col-span-1 space-y-4">
            <Link href="/" className="inline-flex items-center">
              <Image
                src="/locano-logo.png"
                alt="Locano Logo"
                width={200}
                height={60}
                className="h-10 w-auto object-contain brightness-0 invert"
              />
            </Link>
            <p className="text-xs text-slate-400 leading-relaxed">
              Helping students and newcomers in Mangaluru find what they need.
            </p>
            {/* Social Icons (Instagram & WhatsApp) */}
            <div className="flex items-center gap-3 pt-2">
              {/* Instagram */}
              <a
                href="https://www.instagram.com/locano.in/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow LOCANO on Instagram (@locano.in)"
                title="Follow on Instagram @locano.in"
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white flex items-center justify-center shadow-md shadow-pink-900/30 hover:scale-110 hover:shadow-pink-500/40 transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-5 h-5 fill-none stroke-current stroke-[2]"
                  viewBox="0 0 24 24"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>

              {/* WhatsApp */}
              <a
                href="https://wa.me/919497382322?text=Hi%20LOCANO%2C%20I%20have%20an%20enquiry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with LOCANO on WhatsApp (+91 94973 82322)"
                title="Chat on WhatsApp +91 94973 82322"
                className="w-10 h-10 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-md shadow-emerald-900/30 hover:scale-110 hover:shadow-emerald-500/40 transition-all duration-200 cursor-pointer"
              >
                <svg
                  className="w-5 h-5 fill-current"
                  viewBox="0 0 24 24"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>
          </div>

          {/* BUS TRANSPORT LINKS */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              BUS TRANSPORT
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/transport"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Bus className="w-3.5 h-3.5 text-[#1f6fe5]" />
                  <span>Find a bus</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/transport/near"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Navigation className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Stops near you</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/transport/route/balmatta-to-deralakatte"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <MapPin className="w-3.5 h-3.5 text-amber-400" />
                  <span>Balmatta to Yenepoya</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* STUDENT PLATFORM */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              STUDENT PLATFORM
            </div>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>
                <Link
                  href="/accommodation"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>Accommodation &amp; PGs</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/mess"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <span>Food &amp; Mess directory</span>
                </Link>
              </li>
              <li className="flex items-center gap-2">
                <span>Part-time Student Jobs</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-slate-800 text-slate-400 font-medium">
                  Soon
                </span>
              </li>
            </ul>
          </div>

          {/* ABOUT & PRIVACY */}
          <div className="space-y-3">
            <div className="text-xs font-bold text-white uppercase tracking-wider">
              ABOUT &amp; PRIVACY
            </div>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link
                  href="/about"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Info className="w-3.5 h-3.5 text-slate-400" />
                  <span>About LOCANO</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <Shield className="w-3.5 h-3.5 text-slate-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-slate-400" />
                  <span>Terms of Service</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM ATTRIBUTION */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © 2025 LOCANO. All rights reserved.
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <span>📍 Mangaluru, India</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
