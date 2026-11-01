import type { Metadata } from "next"
import Link from "next/link"
import {
  FileText,
  ArrowLeft,
  Info,
  Home,
  UtensilsCrossed,
  ShieldCheck,
  Store,
  MessageSquare,
  CreditCard,
  Bus,
  HeartPulse,
  UserCheck,
  Scale,
  Ban,
  AlertTriangle,
  StopCircle,
  Shield,
  RefreshCw,
  Landmark,
  Mail,
} from "lucide-react"

export const metadata: Metadata = {
  title: "Terms & Conditions · LOCANO",
  description:
    "Terms and Conditions for LOCANO — student discovery platform for accommodation, food & mess, transport, and emergency services in Mangaluru.",
  alternates: {
    canonical: "https://locano.in/terms",
  },
}

export default function TermsPage() {
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
              <FileText className="w-3.5 h-3.5" />
              <span>LOCANO TERMS OF SERVICE</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#10233f] tracking-tight">
              Terms &amp; Conditions
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
              <span><strong>Effective Date:</strong> November 1, 2026</span>
              <span>•</span>
              <span><strong>Website:</strong> <a href="https://locano.in" className="text-[#1f6fe5] hover:underline">https://locano.in</a></span>
              <span>•</span>
              <span><strong>Jurisdiction:</strong> Mangaluru, Karnataka, India</span>
            </div>
          </div>

          {/* Terms Content */}
          <div className="space-y-8 text-sm leading-relaxed text-slate-600">
            {/* 1. Introduction */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">1</span>
                <span>Introduction</span>
              </h2>
              <p>Welcome to LOCANO.</p>
              <p>LOCANO is a student-focused discovery platform operating in Mangaluru, Karnataka, India.</p>
              <p>By accessing or using LOCANO, you agree to these Terms &amp; Conditions.</p>
              <p>
                LOCANO provides information and discovery services for accommodation, PGs, hostels, mess services, local transport and emergency facilities.
              </p>
            </section>

            {/* 2. Nature of LOCANO's Services */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">2</span>
                <Info className="w-4 h-4 text-[#1f6fe5]" />
                <span>Nature of LOCANO&apos;s Services</span>
              </h2>
              <p>LOCANO operates as an information and lead-generation intermediary.</p>
              <p><strong>LOCANO:</strong></p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Displays accommodation and PG listings.</li>
                <li>Displays food and mess service listings.</li>
                <li>Provides local transport information.</li>
                <li>Provides an emergency service directory.</li>
                <li>Connects interested students with independent service providers.</li>
              </ul>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs space-y-1.5 text-slate-700">
                <p className="font-bold text-[#10233f]">LOCANO is not:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>A landlord or property management company.</li>
                  <li>A real estate broker or rental contracting party.</li>
                  <li>A food preparation or catering business.</li>
                  <li>A public transport operator.</li>
                  <li>A payment processor or escrow service.</li>
                </ul>
              </div>
            </section>

            {/* 3. Accommodation Listings */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">3</span>
                <Home className="w-4 h-4 text-[#1f6fe5]" />
                <span>Accommodation Listings</span>
              </h2>
              <p>Accommodation listings may include:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Property name and address.</li>
                <li>Room and sharing types.</li>
                <li>Monthly rent and security deposit.</li>
                <li>Amenities and facilities.</li>
                <li>Food availability.</li>
                <li>Property photographs.</li>
              </ul>
              <p>
                Students must independently verify property conditions, availability, pricing, facilities and rental terms before making any commitment.
              </p>
              <p className="font-semibold text-[#10233f]">
                LOCANO does not guarantee the availability or suitability of any property.
              </p>
            </section>

            {/* 4. Food & Mess Listings */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">4</span>
                <UtensilsCrossed className="w-4 h-4 text-orange-600" />
                <span>Food &amp; Mess Listings</span>
              </h2>
              <p>Mess listings may contain:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Meal plans and pricing.</li>
                <li>Number of meals per day.</li>
                <li>Meal combinations.</li>
                <li>Food categories and dietary information.</li>
                <li>Operating timings and holidays.</li>
                <li>Photographs and facility information.</li>
              </ul>
              <p>
                LOCANO does not prepare, supply or control the food provided by independent mess operators.
              </p>
              <p>
                Users should independently verify food quality, hygiene, ingredients, pricing and applicable FSSAI registration before subscribing.
              </p>
            </section>

            {/* 5. Listing Verification */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">5</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Listing Verification</span>
              </h2>
              <p>
                LOCANO may display Verified Property or Verified Mess badges.
              </p>
              <p>
                Verification indicates that LOCANO has conducted administrative checks on the available listing information or documentation.
              </p>
              <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 text-xs space-y-1.5 text-emerald-950">
                <p className="font-bold">A verification badge does not constitute:</p>
                <ul className="list-disc list-inside space-y-1 pl-2">
                  <li>A guarantee of property safety.</li>
                  <li>A structural inspection certificate.</li>
                  <li>A guarantee of legal ownership.</li>
                  <li>A guarantee of food quality or hygiene.</li>
                  <li>An endorsement of every claim made by a vendor.</li>
                </ul>
              </div>
              <p>Users should independently conduct their own checks.</p>
            </section>

            {/* 6. Vendor Responsibilities */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">6</span>
                <Store className="w-4 h-4 text-indigo-600" />
                <span>Vendor Responsibilities</span>
              </h2>
              <p>Vendors submitting information to LOCANO agree that:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Listing information must be accurate.</li>
                <li>Pricing and availability must be updated.</li>
                <li>Photographs must represent the actual property or service.</li>
                <li>They must have the necessary rights to upload submitted photographs.</li>
                <li>They must not submit misleading or unlawful information.</li>
                <li>They must comply with applicable laws and regulations.</li>
              </ul>
              <p>
                LOCANO reserves the right to review, reject, suspend or remove listings.
              </p>
            </section>

            {/* 7. Enquiries and Communication */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">7</span>
                <MessageSquare className="w-4 h-4 text-blue-600" />
                <span>Enquiries and Communication</span>
              </h2>
              <p>Students may submit enquiries to obtain information about listings.</p>
              <p>
                Relevant enquiry information, including name, phone number, email and listing identification, may be shared with the relevant service provider for responding to the enquiry.
              </p>
              <p>Users may also voluntarily initiate communication through WhatsApp.</p>
              <p className="font-semibold text-[#10233f]">
                LOCANO is not responsible for independent communications or agreements between students and vendors.
              </p>
            </section>

            {/* 8. Payments and Financial Transactions */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">8</span>
                <CreditCard className="w-4 h-4 text-amber-600" />
                <span>Payments and Financial Transactions</span>
              </h2>
              <p>LOCANO does not collect:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Monthly rent.</li>
                <li>Security deposits.</li>
                <li>Mess subscription charges.</li>
                <li>Bus ticket payments.</li>
              </ul>
              <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs space-y-1 text-amber-950">
                <p className="font-bold">Important Notice:</p>
                <p>
                  All payments are made directly between the student and the relevant independent provider.
                </p>
                <p>
                  LOCANO is not responsible for payment disputes, refunds, deposits or financial losses arising from such transactions.
                </p>
              </div>
              <p>
                Users should verify payment details and service providers before transferring money.
              </p>
            </section>

            {/* 9. Transport Information */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">9</span>
                <Bus className="w-4 h-4 text-emerald-600" />
                <span>Transport Information</span>
              </h2>
              <p>
                LOCANO provides curated local bus information, route sequences, estimated travel times and indicative fares.
              </p>
              <p>Transport information is provided for convenience.</p>
              <p>
                Schedules, routes and fares may change due to operator decisions, traffic, municipal revisions or other circumstances.
              </p>
              <p>Users should independently confirm current transport information before travelling.</p>
              <p className="font-semibold text-[#10233f]">
                LOCANO does not operate or control the buses listed.
              </p>
            </section>

            {/* 10. Emergency Services */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">10</span>
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>Emergency Services</span>
              </h2>
              <p>LOCANO provides information about hospitals and emergency contact services.</p>
              <p>This directory is intended to assist users in locating relevant services.</p>
              <p>
                LOCANO does not operate emergency facilities and cannot guarantee their availability, response times or services.
              </p>
              <p className="font-semibold text-[#10233f]">
                In an emergency, users should contact the appropriate emergency authorities directly.
              </p>
            </section>

            {/* 11. User Accounts */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">11</span>
                <UserCheck className="w-4 h-4 text-[#1f6fe5]" />
                <span>User Accounts</span>
              </h2>
              <p>Users must:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Provide accurate registration information.</li>
                <li>Maintain the confidentiality of their login credentials.</li>
                <li>Avoid sharing account access.</li>
                <li>Notify LOCANO of suspected unauthorized access.</li>
              </ul>
              <p>
                LOCANO may restrict or suspend accounts involved in misuse, fraudulent activity or violations of these Terms.
              </p>
            </section>

            {/* 12. Intellectual Property */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">12</span>
                <Scale className="w-4 h-4 text-indigo-600" />
                <span>Intellectual Property</span>
              </h2>
              <p>
                The LOCANO name, branding, website design, software and original platform content are protected by applicable intellectual property laws.
              </p>
              <p>
                Users and vendors must not copy, reproduce, distribute or commercially exploit LOCANO materials without appropriate authorization.
              </p>
              <p>
                Vendors retain responsibility for ensuring that uploaded photographs and other submitted content do not infringe third-party rights.
              </p>
            </section>

            {/* 13. Prohibited Activities */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">13</span>
                <Ban className="w-4 h-4 text-rose-600" />
                <span>Prohibited Activities</span>
              </h2>
              <p>Users must not:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Submit false or misleading information.</li>
                <li>Upload unlawful or unauthorized content.</li>
                <li>Attempt unauthorized access to platform systems.</li>
                <li>Interfere with website functionality.</li>
                <li>Use the platform for fraudulent or illegal activities.</li>
                <li>Misuse another person&apos;s personal information.</li>
              </ul>
            </section>

            {/* 14. Limitation of Liability */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">14</span>
                <AlertTriangle className="w-4 h-4 text-amber-600" />
                <span>Limitation of Liability</span>
              </h2>
              <p>LOCANO acts as a discovery and information platform.</p>
              <p>To the extent permitted by applicable law, LOCANO is not responsible for:</p>
              <ul className="list-disc list-inside space-y-1 pl-2 text-slate-600">
                <li>Disputes between students and accommodation providers.</li>
                <li>Rental agreements or tenancy disputes.</li>
                <li>Food quality, hygiene or service issues.</li>
                <li>Incorrect information submitted by independent vendors.</li>
                <li>Changes in transport routes, schedules or fares.</li>
                <li>Independent vendor actions or failure to provide services.</li>
                <li>Financial transactions conducted outside LOCANO.</li>
              </ul>
              <p>
                Nothing in these Terms excludes liability that cannot legally be excluded under applicable law.
              </p>
            </section>

            {/* 15. Suspension and Termination */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">15</span>
                <StopCircle className="w-4 h-4 text-rose-600" />
                <span>Suspension and Termination</span>
              </h2>
              <p>
                LOCANO reserves the right to suspend or remove accounts, listings or access where misuse, fraudulent activity, inaccurate information or violations of these Terms are identified.
              </p>
            </section>

            {/* 16. Privacy */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">16</span>
                <Shield className="w-4 h-4 text-[#1f6fe5]" />
                <span>Privacy</span>
              </h2>
              <p>
                Use of LOCANO is also governed by our <Link href="/privacy" className="text-[#1f6fe5] hover:underline font-semibold">Privacy Policy</Link>, which explains how personal information is collected, used and stored.
              </p>
            </section>

            {/* 17. Changes to Terms */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">17</span>
                <RefreshCw className="w-4 h-4 text-[#1f6fe5]" />
                <span>Changes to Terms</span>
              </h2>
              <p>
                LOCANO may update these Terms when platform features, operations or legal requirements change.
              </p>
              <p>
                Continued use of the platform after updated Terms are published constitutes acceptance to the extent permitted by applicable law.
              </p>
            </section>

            {/* 18. Governing Law and Jurisdiction */}
            <section className="space-y-3">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">18</span>
                <Landmark className="w-4 h-4 text-indigo-600" />
                <span>Governing Law and Jurisdiction</span>
              </h2>
              <p>These Terms are governed by the laws of India.</p>
              <p>
                Subject to applicable law, courts with competent jurisdiction in Mangaluru, Karnataka, shall have jurisdiction over disputes relating to these Terms.
              </p>
            </section>

            {/* 19. Contact */}
            <section className="space-y-3 pt-2 border-t border-slate-100">
              <h2 className="text-base sm:text-lg font-bold text-[#10233f] flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-blue-50 text-[#1f6fe5] text-xs font-extrabold flex items-center justify-center shrink-0">19</span>
                <Mail className="w-4 h-4 text-[#1f6fe5]" />
                <span>Contact</span>
              </h2>
              <p>For questions or concerns:</p>
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
