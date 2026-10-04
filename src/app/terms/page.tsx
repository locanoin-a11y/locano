import type { Metadata } from "next"
import Link from "next/link"
import { FileText, ArrowLeft, KeyRound, AlertTriangle, ShieldCheck } from "lucide-react"

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms of Service for LOCANO Mangaluru transport platform.",
}

export default function TermsPage() {
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
              <FileText className="w-3.5 h-3.5" />
              <span>Terms of Use</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10233f] tracking-tight">
              Terms of Service
            </h1>
            <p className="text-sm text-slate-500 mt-2">
              LOCANO Student Platform · Mangaluru, Karnataka
            </p>
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed space-y-6 text-slate-600">
            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-[#1f6fe5]" />
                <span>1. Account Waitlist &amp; Password Handling</span>
              </h2>
              <p>
                A password is checked only against a contact already saved in this browser, then thrown away immediately. Submitting an account form does not establish an authenticated server session. Full accounts with encrypted cloud credentials will launch when student accommodation and verified services go live.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>2. Indicative Timings &amp; Fares</span>
              </h2>
              <p>
                All transit durations, travel times, and calculated fares (formula <code>max(10, round((8 + km * 1.6) / 2) * 2)</code>) are estimates based on standard Mangaluru city speed corridors and intermediate dwell times. Traffic, road repairs, and peak college rush hours may cause variances. Always confirm the destination and fare with the bus conductor before boarding.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>3. Non-Transport Services</span>
              </h2>
              <p>
                Cards for Accommodation, Food &amp; Mess, Part-time Jobs, and Emergency Helplines represent informational roadmap previews of the broader student ecosystem and are not currently active transactions or live bookings.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
