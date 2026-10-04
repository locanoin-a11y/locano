import type { Metadata } from "next"
import Link from "next/link"
import { Shield, Lock, EyeOff, HardDrive, ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "Privacy policy for LOCANO — how client-side storage and student data are handled.",
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f4f8fc] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1f6fe5] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-100 locano-card space-y-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1f6fe5] mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>LOCANO Privacy</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10233f] tracking-tight">
              Privacy Policy
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              Last updated: Mangaluru, Karnataka
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-600">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-[#1f6fe5]" />
                <span>1. The Waitlist Stays in This Browser</span>
              </h2>
              <p>
                When you join the student waitlist on LOCANO, your contact identifier (email or phone number) is saved solely in your local browser storage under the key <code>locano.waitlist</code>. We do not transmit or persist this information on an external backend database.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>2. Passwords Are Never Stored</span>
              </h2>
              <p>
                Passwords submitted in the student account card are checked only within your browser and are cleared immediately from memory upon form submission. Passwords are never written to disk, cookies, or remote endpoints.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <EyeOff className="w-4 h-4 text-purple-600" />
                <span>3. Zero Tracking &amp; No Cookies</span>
              </h2>
              <p>
                LOCANO does not set profiling cookies, does not collect analytics tokens, and requires zero environment variables or third-party authentication servers. Your recent searches (up to 6 items) stay exclusively on your device inside <code>locano.recent</code>.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <Shield className="w-4 h-4 text-amber-600" />
                <span>4. Geolocation Data</span>
              </h2>
              <p>
                When you access the Nearby Stops feature, coordinates retrieved from the browser&apos;s Geolocation API are evaluated strictly on the client to calculate straight-line distances to the nearest 10 bus stops. They are not transmitted, logged, or retained. If permission is denied, no location is generated or guessed.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
