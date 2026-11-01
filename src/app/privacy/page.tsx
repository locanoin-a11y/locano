import type { Metadata } from "next"
import Link from "next/link"
import {
  Shield,
  ArrowLeft,
  User,
  Store,
  Cpu,
  Database,
  MapPin,
  Share2,
  CreditCard,
  Cookie,
  Lock,
  Trash2,
  ExternalLink,
  Users,
  RefreshCw,
  Mail,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Privacy Policy · LOCANO",
  description:
    "Privacy Policy for LOCANO — how student and vendor information, authentication, and location data are handled.",
  alternates: {
    canonical: "https://locano.in/privacy",
  },
}

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#f4f8fc] pt-32 pb-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1f6fe5] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-slate-100 locano-card space-y-10">
          {/* Header */}
          <div className="border-b border-slate-100 pb-8">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#1f6fe5] mb-3">
              <Shield className="w-3.5 h-3.5" />
              <span>LOCANO LEGAL &amp; PRIVACY</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10233f] tracking-tight">
              Privacy Policy
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span><strong>Effective Date:</strong> November 1, 2026</span>
              <span>•</span>
              <span><strong>Website:</strong> <a href="https://locano.in" className="text-[#1f6fe5] hover:underline">https://locano.in</a></span>
              <span>•</span>
              <span><strong>Contact:</strong> <a href="mailto:locano.in@gmail.com" className="text-[#1f6fe5] hover:underline">locano.in@gmail.com</a></span>
            </div>
          </div>

          {/* Policy Content */}
          <div className="space-y-8 text-sm leading-relaxed text-slate-600">
            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">1</span>
                <span>Introduction</span>
              </h2>
              <p>
                LOCANO is a student accommodation and local discovery platform operating in Mangaluru, Karnataka, India.
              </p>
              <p>
                We connect students and newcomers with accommodation providers, PGs, hostels, mess services, local transport information and emergency services.
              </p>
              <p>
                LOCANO acts as a discovery and enquiry platform. We do not directly provide accommodation, prepare food or operate public transport.
              </p>
              <p>
                This Privacy Policy explains how we collect, use, store and protect personal information.
              </p>
            </section>

            {/* 2. Information We Collect */}
            <section className="space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">2</span>
                <span>Information We Collect</span>
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
                {/* A. Student Information */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#10233f] uppercase tracking-wider">
                    <User className="w-4 h-4 text-[#1f6fe5]" />
                    <span>A. Student Information</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    <li>Full name</li>
                    <li>Email address</li>
                    <li>Mobile number</li>
                    <li>Account authentication information</li>
                    <li>Enquiry details submitted through the platform</li>
                  </ul>
                </div>

                {/* B. Vendor Information */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#10233f] uppercase tracking-wider">
                    <Store className="w-4 h-4 text-emerald-600" />
                    <span>B. Vendor Information</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    <li>Business or property name</li>
                    <li>Contact person&apos;s name</li>
                    <li>Phone number</li>
                    <li>Property or mess address</li>
                    <li>Pricing, facilities and service information</li>
                    <li>Photographs submitted for listings</li>
                  </ul>
                </div>

                {/* C. Technical Information */}
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#10233f] uppercase tracking-wider">
                    <Cpu className="w-4 h-4 text-purple-600" />
                    <span>C. Technical Information</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-xs text-slate-600">
                    <li>IP address and request headers for security and abuse prevention</li>
                    <li>Essential authentication session cookies</li>
                    <li>Recent searches stored locally in the browser</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* 3. How We Use Your Information */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">3</span>
                <span>How We Use Your Information</span>
              </h2>
              <p>We use collected information to:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Create and manage user accounts.</li>
                <li>Authenticate users securely.</li>
                <li>Display accommodation and mess listings.</li>
                <li>Connect interested students with relevant vendors.</li>
                <li>Process vendor applications and administrative verification.</li>
                <li>Respond to enquiries.</li>
                <li>Maintain platform security and prevent misuse.</li>
                <li>Improve platform functionality.</li>
              </ul>
            </section>

            {/* 4. Database and Data Storage */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">4</span>
                <Database className="w-4 h-4 text-[#1f6fe5]" />
                <span>Database and Data Storage</span>
              </h2>
              <p>
                LOCANO uses Supabase for authentication, database management and image storage.
              </p>
              <p>Information may be stored in:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>User profile records.</li>
                <li>Accommodation and mess listing records.</li>
                <li>Vendor application records.</li>
                <li>Administrative enquiry and notification records.</li>
                <li>Supabase Storage for listing photographs.</li>
              </ul>
              <p>
                Vercel provides website hosting and application infrastructure.
              </p>
              <p>
                We apply appropriate access restrictions and security measures to protect stored information.
              </p>
            </section>

            {/* 5. Location Information */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">5</span>
                <MapPin className="w-4 h-4 text-emerald-600" />
                <span>Location Information</span>
              </h2>
              <p>
                Certain features, including Transport and Emergency Services, may request access to your device&apos;s location.
              </p>
              <p>
                Location coordinates are processed within the browser to calculate distances and identify nearby services.
              </p>
              <div className="p-3.5 rounded-xl bg-blue-50/70 border border-blue-100 text-xs text-slate-700">
                According to the current implementation, these coordinates are not transmitted to LOCANO&apos;s backend or stored in its database.
              </div>
              <p>
                You can deny location permission through your browser settings.
              </p>
            </section>

            {/* 6. Sharing of Information */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">6</span>
                <Share2 className="w-4 h-4 text-indigo-600" />
                <span>Sharing of Information</span>
              </h2>
              <p>LOCANO may share relevant information with:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>PG owners and accommodation providers when a student submits an enquiry.</li>
                <li>Mess providers when a student requests information.</li>
                <li>Service providers such as Supabase and Vercel for platform operations.</li>
                <li>WhatsApp when users voluntarily choose to initiate an external conversation.</li>
              </ul>
              <p className="font-semibold text-[#10233f]">
                We do not sell personal information to advertisers.
              </p>
            </section>

            {/* 7. Payments and Financial Information */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">7</span>
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Payments and Financial Information</span>
              </h2>
              <p>
                LOCANO does not directly collect rent, security deposits, mess subscription fees or bus ticket payments.
              </p>
              <p>
                All financial transactions take place directly between students and independent service providers.
              </p>
              <p>
                LOCANO does not collect credit card details, UPI PINs or banking credentials.
              </p>
            </section>

            {/* 8. Cookies and Local Storage */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">8</span>
                <Cookie className="w-4 h-4 text-amber-700" />
                <span>Cookies and Local Storage</span>
              </h2>
              <p>
                LOCANO uses essential authentication cookies to maintain login sessions.
              </p>
              <p>
                We may also use browser local storage for convenience features such as recent searches.
              </p>
              <p>
                We do not currently use advertising or behavioural tracking cookies.
              </p>
            </section>

            {/* 9. Data Security */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">9</span>
                <Lock className="w-4 h-4 text-emerald-600" />
                <span>Data Security</span>
              </h2>
              <p>We use security measures including:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Secure HTTPS communication.</li>
                <li>Supabase authentication.</li>
                <li>Database access restrictions and Row-Level Security.</li>
                <li>Restricted administrative access.</li>
                <li>Rate limiting and abuse prevention.</li>
              </ul>
              <p>
                Passwords are handled through Supabase authentication and are not stored in plain text.
              </p>
              <p className="text-xs text-slate-500 italic">
                Although we take reasonable security precautions, no internet-based service can guarantee absolute security.
              </p>
            </section>

            {/* 10. Data Retention and Deletion */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">10</span>
                <Trash2 className="w-4 h-4 text-rose-600" />
                <span>Data Retention and Deletion</span>
              </h2>
              <p>
                Personal information is retained only as necessary for the purposes described in this policy, subject to applicable legal obligations.
              </p>
              <p>
                Users may request account deletion or correction of their personal information by contacting:
              </p>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 font-mono text-xs text-[#10233f]">
                <a href="mailto:contact@locano.in" className="text-[#1f6fe5] hover:underline font-semibold">contact@locano.in</a> / <a href="mailto:locano.in@gmail.com" className="text-[#1f6fe5] hover:underline font-semibold">locano.in@gmail.com</a>
              </div>
              <p>
                Requests will be reviewed and handled in accordance with applicable laws.
              </p>
            </section>

            {/* 11. Third-Party Services */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">11</span>
                <ExternalLink className="w-4 h-4 text-[#1f6fe5]" />
                <span>Third-Party Services</span>
              </h2>
              <p>Our platform relies on:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li><strong>Supabase</strong> – Authentication, database and storage.</li>
                <li><strong>Vercel</strong> – Website hosting.</li>
                <li><strong>WhatsApp</strong> – Voluntary external communication.</li>
                <li><strong>OpenStreetMap and Leaflet</strong> – Map functionality.</li>
                <li><strong>Google Fonts</strong> – Typography.</li>
              </ul>
              <p>
                Use of third-party services may also be subject to their respective privacy policies.
              </p>
            </section>

            {/* 12. Children's Privacy */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">12</span>
                <Users className="w-4 h-4 text-purple-600" />
                <span>Children&apos;s Privacy</span>
              </h2>
              <p>
                LOCANO is intended for individuals who are legally capable of using the relevant services. Users who are minors must use the platform in accordance with applicable parental consent and child-data protection requirements.
              </p>
            </section>

            {/* 13. Changes to This Policy */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">13</span>
                <RefreshCw className="w-4 h-4 text-[#1f6fe5]" />
                <span>Changes to This Policy</span>
              </h2>
              <p>
                LOCANO may update this Privacy Policy when platform functionality, data practices or applicable legal requirements change.
              </p>
              <p>
                Updated versions will be published on this page.
              </p>
            </section>

            {/* 14. Contact */}
            <section className="space-y-3 pt-2 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">14</span>
                <Mail className="w-4 h-4 text-[#1f6fe5]" />
                <span>Contact</span>
              </h2>
              <p>For privacy-related questions, corrections or deletion requests:</p>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100 text-xs space-y-1.5 text-slate-700">
                <div><strong>Email:</strong> <a href="mailto:locano.in@gmail.com" className="text-[#1f6fe5] hover:underline">locano.in@gmail.com</a> / <a href="mailto:contact@locano.in" className="text-[#1f6fe5] hover:underline">contact@locano.in</a></div>
                <div><strong>Website:</strong> <a href="https://locano.in" className="text-[#1f6fe5] hover:underline">https://locano.in</a></div>
                <div><strong>Location:</strong> Mangaluru, Karnataka, India</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
