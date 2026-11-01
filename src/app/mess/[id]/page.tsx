import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { fetchMessById } from "@/lib/services/mess"
import { EnquiryPreviewButton } from "@/components/EnquiryPreviewButton"
import { PhotoGallery } from "@/components/PhotoGallery"
import {
  ArrowLeft,
  MapPin,
  CheckCircle2,
  Utensils,
  UtensilsCrossed,
  Clock,
  Sparkles,
  Info,
  Coffee,
  ShieldCheck,
  Users,
  Calendar,
  AlertCircle,
} from "lucide-react"

interface MessPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: MessPageProps): Promise<Metadata> {
  const { id } = await params
  const listing = await fetchMessById(id)
  if (!listing) return { title: "Mess Provider Not Found" }
  const title = `${listing.name} · ${listing.area}`
  const description = `${listing.tagline} — ${listing.dietary} ${listing.cuisine} student mess in ${listing.area}, Mangaluru.`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `https://locano.in/mess/${id}`,
      type: "website",
      images: listing.images?.[0]
        ? [{ url: listing.images[0], alt: listing.name }]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: listing.images?.[0] ? [listing.images[0]] : undefined,
    },
    alternates: {
      canonical: `https://locano.in/mess/${id}`,
    },
  }
}

export default async function MessDetailPage({ params }: MessPageProps) {
  const { id } = await params
  const listing = await fetchMessById(id)

  if (!listing) {
    notFound()
  }

  const dietaryBadgeClass =
    listing.dietary === "Pure Veg"
      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
      : "bg-amber-50 text-amber-800 border-amber-200"

  const hasAnyTimings = Boolean(
    listing.timings?.breakfast || listing.timings?.lunch || listing.timings?.dinner
  )

  // Extract and normalize Model A pricing with fallback to monthlyPriceFrom
  const rawMpd = (listing.mealsPerDayPricing || {}) as Record<string, unknown>
  const baseMonthly = typeof listing.monthlyPriceFrom === "number" && listing.monthlyPriceFrom > 0 ? listing.monthlyPriceFrom : 3000

  const oneMealPrice = (rawMpd.oneMealPrice as number) ?? (rawMpd.one_meal_price as number) ?? (listing.pricingType === "meals_per_day" ? Math.round(baseMonthly * 0.6) : null)
  const twoMealsPrice = (rawMpd.twoMealsPrice as number) ?? (rawMpd.two_meals_price as number) ?? (listing.pricingType === "meals_per_day" ? baseMonthly : null)
  const threeMealsPrice = (rawMpd.threeMealsPrice as number) ?? (rawMpd.three_meals_price as number) ?? (listing.pricingType === "meals_per_day" ? Math.round(baseMonthly * 1.3) : null)

  const rawGrp = ((rawMpd.groupPricing || rawMpd.group_pricing) || {}) as Record<string, unknown>
  const hasGroupPricing = Boolean(rawMpd.hasGroupPricing ?? rawMpd.has_group_pricing)
  const groupOneMealPrice = (rawGrp.oneMealPrice as number) ?? (rawGrp.one_meal_price as number) ?? null
  const groupTwoMealsPrice = (rawGrp.twoMealsPrice as number) ?? (rawGrp.two_meals_price as number) ?? null
  const groupThreeMealsPrice = (rawGrp.threeMealsPrice as number) ?? (rawGrp.three_meals_price as number) ?? null
  const groupNotes = (rawGrp.notes as string) ?? (rawGrp.note as string) ?? "Discounted subscription tier when 5 students or roommates join together."

  // Combination definitions for Model B
  const rawMcp = (listing.mealCombinationsPricing || {}) as Record<string, unknown>
  const combinationsList = [
    {
      id: "breakfastOnly",
      name: "Breakfast Only",
      price: (rawMcp.breakfastOnly as number) ?? (rawMcp.breakfast_only as number) ?? undefined,
      meals: ["Breakfast"],
      description: "Morning energetic breakfast with hot tea or filter coffee",
    },
    {
      id: "lunchOnly",
      name: "Lunch Only",
      price: (rawMcp.lunchOnly as number) ?? (rawMcp.lunch_only as number) ?? undefined,
      meals: ["Lunch"],
      description: "Hearty wholesome afternoon meal with rice, curries, and sides",
    },
    {
      id: "dinnerOnly",
      name: "Dinner Only",
      price: (rawMcp.dinnerOnly as number) ?? (rawMcp.dinner_only as number) ?? undefined,
      meals: ["Dinner"],
      description: "Light digestible evening dinner with phulkas/rice and dal",
    },
    {
      id: "breakfastLunch",
      name: "Breakfast + Lunch",
      price: (rawMcp.breakfastLunch as number) ?? (rawMcp.breakfast_lunch as number) ?? undefined,
      meals: ["Breakfast", "Lunch"],
      description: "Morning breakfast and afternoon lunch combo",
    },
    {
      id: "breakfastDinner",
      name: "Breakfast + Dinner",
      price: (rawMcp.breakfastDinner as number) ?? (rawMcp.breakfast_dinner as number) ?? undefined,
      meals: ["Breakfast", "Dinner"],
      description: "Ideal for students having canteen meals during college hours",
    },
    {
      id: "lunchDinner",
      name: "Lunch + Dinner",
      price: (rawMcp.lunchDinner as number) ?? (rawMcp.lunch_dinner as number) ?? undefined,
      meals: ["Lunch", "Dinner"],
      description: "Complete afternoon and evening meals daily (most popular)",
    },
    {
      id: "allThree",
      name: "Breakfast + Lunch + Dinner",
      price: (rawMcp.allThree as number) ?? (rawMcp.all_three as number) ?? undefined,
      meals: ["Breakfast", "Lunch", "Dinner"],
      description: "Full daily subscription covering all three wholesome meals",
    },
  ].filter((c) => typeof c.price === "number" && c.price > 0)

  return (
    <div className="min-h-screen bg-[#f4f8fc] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* BACK LINK */}
        <div className="mb-6">
          <Link
            href="/mess"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#ea580c] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Messes &amp; Tiffins</span>
          </Link>
        </div>

        {/* MAIN PROVIDER HEADER CARD */}
        <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full border ${dietaryBadgeClass}`}
                >
                  {listing.dietary}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-slate-100 text-slate-700">
                  {listing.serviceType}
                </span>
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-orange-50 text-[#ea580c] border border-orange-200/60">
                  {listing.cuisine}
                </span>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Verified Mess</span>
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-[#10233f] tracking-tight">
                {listing.name}
              </h1>
              <p className="text-sm sm:text-base text-slate-500 mt-1">
                {listing.tagline}
              </p>
              <div className="mt-3 flex items-center gap-2 text-xs sm:text-sm text-slate-600 flex-wrap">
                <div className="flex items-center gap-1.5 font-semibold text-slate-800">
                  <MapPin className="w-4 h-4 text-[#ea580c] shrink-0" />
                  <span>{listing.area}</span>
                </div>
                {listing.approximateLocation && (
                  <span className="text-slate-400">· {listing.approximateLocation}</span>
                )}
                {listing.nearestLandmark && (
                  <span className="text-slate-400">({listing.nearestLandmark})</span>
                )}
              </div>
            </div>

            {/* PRICING STAT */}
            <div className="lg:text-right shrink-0 bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-100">
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                Starting Monthly Pass
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-[#10233f]">
                ₹{listing.monthlyPriceFrom.toLocaleString("en-IN")}
                <span className="text-xs sm:text-sm font-normal text-slate-500"> /month</span>
              </div>
              {listing.perMealPriceFrom > 0 && (
                <div className="text-xs text-slate-500 mt-1">
                  Walk-in single meal: ₹{listing.perMealPriceFrom}
                </div>
              )}
              <div className="mt-2 inline-flex items-center gap-1 text-[10.5px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-200/80 text-slate-700">
                {listing.pricingType === "meals_per_day" ? "Meals Per Day" : "Meal Combinations"}
              </div>
            </div>
          </div>

          {/* ADAPTIVE PHOTO GALLERY (0, 1, 2, 3, 4+ photos with Fullscreen Lightbox) */}
          <PhotoGallery
            images={listing.images}
            coverImage={listing.sampleImage}
            title={listing.name}
            type="mess"
          />
        </div>

        {/* DETAILS GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">
            {/* OVERVIEW */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card space-y-3">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <Info className="w-4 h-4 text-[#ea580c]" />
                <span>About this Mess Service</span>
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {listing.description}
              </p>
            </div>

            {/* DYNAMIC PRICING STRUCTURE */}
            {listing.pricingType === "meals_per_day" ? (
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-blue-50 text-[#0066FF] border border-blue-200 mb-1">
                      <Utensils className="w-3 h-3" />
                      <span>PRICING MODEL A</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#10233f]">
                      Meals Per Day Subscriptions
                    </h2>
                    <p className="text-xs text-slate-500">
                      Choose your monthly pass based on the number of daily meals you require.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">Monthly Rates</span>
                </div>

                {/* 3 TIERS: 1, 2, 3 MEALS PER DAY */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* 1 Meal / Day */}
                  <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Option 1
                      </div>
                      <h3 className="text-base font-bold text-[#10233f] mb-1">
                        1 Meal / Day
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Single daily meal (Lunch or Dinner). Ideal for students eating breakfast in PG.
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200/60">
                      <div className="text-[11px] text-slate-400">Monthly Fee</div>
                      <div className="text-xl font-extrabold text-[#10233f]">
                        {oneMealPrice
                          ? `₹${Number(oneMealPrice).toLocaleString("en-IN")}`
                          : "On Request"}
                        <span className="text-xs font-normal text-slate-500"> /mo</span>
                      </div>
                    </div>
                  </div>

                  {/* 2 Meals / Day */}
                  <div className="p-5 rounded-2xl border-2 border-[#0066FF]/60 bg-blue-50/30 flex flex-col justify-between shadow-xs relative">
                    <span className="absolute -top-2.5 right-4 text-[10px] font-extrabold text-white bg-[#0066FF] px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-xs">
                      Most Popular
                    </span>
                    <div>
                      <div className="text-xs font-bold text-[#0066FF] uppercase tracking-wider mb-1">
                        Option 2
                      </div>
                      <h3 className="text-base font-bold text-[#10233f] mb-1">
                        2 Meals / Day
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Lunch and Dinner essential package covering main daily nutritional needs.
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-blue-200/60">
                      <div className="text-[11px] text-slate-400">Monthly Fee</div>
                      <div className="text-xl font-extrabold text-[#0066FF]">
                        {twoMealsPrice
                          ? `₹${Number(twoMealsPrice).toLocaleString("en-IN")}`
                          : "On Request"}
                        <span className="text-xs font-normal text-slate-500"> /mo</span>
                      </div>
                    </div>
                  </div>

                  {/* 3 Meals / Day */}
                  <div className="p-5 rounded-2xl border border-slate-200/80 bg-slate-50 flex flex-col justify-between">
                    <div>
                      <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Option 3
                      </div>
                      <h3 className="text-base font-bold text-[#10233f] mb-1">
                        3 Meals / Day
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        Breakfast, Lunch, and Dinner complete pass. Zero cooking required.
                      </p>
                    </div>
                    <div className="pt-4 mt-4 border-t border-slate-200/60">
                      <div className="text-[11px] text-slate-400">Monthly Fee</div>
                      <div className="text-xl font-extrabold text-[#10233f]">
                        {threeMealsPrice
                          ? `₹${Number(threeMealsPrice).toLocaleString("en-IN")}`
                          : "On Request"}
                        <span className="text-xs font-normal text-slate-500"> /mo</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* OPTIONAL 5-PERSON GROUP PRICING TIER */}
                {hasGroupPricing && (
                  <div className="mt-6 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-emerald-50/80 to-teal-50/50 border border-emerald-200/80">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                          <Users className="w-4 h-4" />
                        </div>
                        <div>
                          <h3 className="text-sm font-bold text-emerald-950">
                            5-Person Student Group Concession
                          </h3>
                          <p className="text-xs text-emerald-700">
                            {groupNotes}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10.5px] font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-1 rounded-full uppercase tracking-wider shrink-0">
                        Group Tier
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                      <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200/60 text-center">
                        <div className="text-[11px] font-semibold text-slate-500">1 Meal / Day (Group)</div>
                        <div className="text-base font-extrabold text-emerald-900 mt-0.5">
                          {groupOneMealPrice
                            ? `₹${Number(groupOneMealPrice).toLocaleString("en-IN")}`
                            : "Contact"}
                          <span className="text-[11px] font-normal text-slate-500"> /mo</span>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200/60 text-center">
                        <div className="text-[11px] font-semibold text-slate-500">2 Meals / Day (Group)</div>
                        <div className="text-base font-extrabold text-emerald-900 mt-0.5">
                          {groupTwoMealsPrice
                            ? `₹${Number(groupTwoMealsPrice).toLocaleString("en-IN")}`
                            : "Contact"}
                          <span className="text-[11px] font-normal text-slate-500"> /mo</span>
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl bg-white/90 border border-emerald-200/60 text-center">
                        <div className="text-[11px] font-semibold text-slate-500">3 Meals / Day (Group)</div>
                        <div className="text-base font-extrabold text-emerald-900 mt-0.5">
                          {groupThreeMealsPrice
                            ? `₹${Number(groupThreeMealsPrice).toLocaleString("en-IN")}`
                            : "Contact"}
                          <span className="text-[11px] font-normal text-slate-500"> /mo</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* MODEL B: MEAL COMBINATIONS PRICING */
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-purple-50 text-purple-700 border border-purple-200 mb-1">
                      <UtensilsCrossed className="w-3 h-3" />
                      <span>PRICING MODEL B</span>
                    </div>
                    <h2 className="text-lg font-bold text-[#10233f]">
                      Available Meal Combinations &amp; Rates
                    </h2>
                    <p className="text-xs text-slate-500">
                      Subscribe to exactly the meal combinations you eat. Only pay for what you select.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-400">
                    {combinationsList.length} options available
                  </span>
                </div>

                {combinationsList.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {combinationsList.map((combo) => (
                      <div
                        key={combo.id}
                        className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="text-sm font-bold text-[#10233f]">
                              {combo.name}
                            </span>
                            <div className="flex gap-1 flex-wrap">
                              {combo.meals.map((m) => (
                                <span
                                  key={m}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200/60"
                                >
                                  {m}
                                </span>
                              ))}
                            </div>
                          </div>
                          <p className="text-xs text-slate-500 leading-relaxed mb-3">
                            {combo.description}
                          </p>
                        </div>
                        <div className="pt-2.5 border-t border-slate-200/60 flex items-center justify-between">
                          <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
                            Monthly Rate
                          </span>
                          <span className="text-base font-extrabold text-[#10233f]">
                            ₹{combo.price?.toLocaleString("en-IN")}
                            <span className="text-xs font-normal text-slate-500"> /mo</span>
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 rounded-2xl bg-slate-50 text-center text-xs text-slate-500">
                    No individual meal combinations configured for this listing. Please contact the mess owner for customized rates.
                  </div>
                )}
              </div>
            )}

            {/* ADDITIONAL MEAL PLANS (IF CONFIGURED) */}
            {listing.mealPlans && listing.mealPlans.length > 0 && (
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                    <Utensils className="w-4 h-4 text-[#ea580c]" />
                    <span>Special Passes &amp; Packages</span>
                  </h2>
                  <span className="text-xs text-slate-400">Flexible Options</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {listing.mealPlans.map((plan) => (
                    <div
                      key={plan.name}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all ${
                        plan.popular
                          ? "border-[#ea580c]/50 bg-orange-50/30"
                          : "border-slate-200/80 bg-slate-50"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-1.5">
                          <span className="text-xs font-bold text-[#10233f]">
                            {plan.name}
                          </span>
                          {plan.popular && (
                            <span className="text-[10px] font-bold text-[#ea580c] bg-orange-100/80 px-2 py-0.5 rounded-full">
                              Popular
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed mb-3">
                          {plan.description}
                        </p>
                      </div>
                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
                        <span className="text-[11px] text-slate-400 capitalize">
                          {plan.period === "month"
                            ? "Monthly"
                            : plan.period === "15-days"
                            ? "15-Day Pass"
                            : "Per Meal"}
                        </span>
                        <span className="text-base font-extrabold text-[#10233f]">
                          ₹{plan.price.toLocaleString("en-IN")}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SERVICE HOURS & MEAL TIMINGS (ONLY DISPLAY PROVIDED TIMINGS) */}
            {hasAnyTimings && (
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#ea580c]" />
                    <span>Service Hours &amp; Meal Timings</span>
                  </h2>
                  <span className="text-xs text-slate-400">Strictly Observed</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {listing.timings.breakfast && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Breakfast
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#10233f]">
                        {listing.timings.breakfast}
                      </div>
                    </div>
                  )}
                  {listing.timings.lunch && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Lunch
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#10233f]">
                        {listing.timings.lunch}
                      </div>
                    </div>
                  )}
                  {listing.timings.dinner && (
                    <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 text-center">
                      <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                        Dinner
                      </div>
                      <div className="text-xs sm:text-sm font-bold text-[#10233f]">
                        {listing.timings.dinner}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* WEEKLY HOLIDAYS & OPERATING SCHEDULE */}
            <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card space-y-4">
              <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                <Calendar className="w-4 h-4 text-[#ea580c]" />
                <span>Operating Days &amp; Weekly Offs</span>
              </h2>
              {listing.weeklyHolidays && listing.weeklyHolidays.length > 0 ? (
                <div className="p-4 rounded-2xl bg-rose-50/70 border border-rose-200/60 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-rose-950">
                      Closed on {listing.weeklyHolidays.join(", ")}
                    </h3>
                    <p className="text-xs text-rose-700 mt-0.5 leading-relaxed">
                      This mess does not operate on {listing.weeklyHolidays.join(" and ")}. Monthly passes are structured taking these scheduled off-days into account.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/60 flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950">
                      Open All 7 Days a Week
                    </h3>
                    <p className="text-xs text-emerald-700 mt-0.5 leading-relaxed">
                      Hot, fresh meals are served seven days a week including Sundays and holidays with regular weekend specials.
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* DAILY MENU SAMPLE */}
            {(listing.dailyMenuSample?.breakfast ||
              listing.dailyMenuSample?.lunch ||
              listing.dailyMenuSample?.dinner) && (
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card space-y-4">
                <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                  <Coffee className="w-4 h-4 text-[#ea580c]" />
                  <span>Sample Daily Menu</span>
                </h2>
                <div className="space-y-3">
                  {listing.dailyMenuSample.breakfast && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400" />
                        <span>Breakfast</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-3.5">
                        {listing.dailyMenuSample.breakfast}
                      </p>
                    </div>
                  )}
                  {listing.dailyMenuSample.lunch && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-orange-500" />
                        <span>Lunch</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-3.5">
                        {listing.dailyMenuSample.lunch}
                      </p>
                    </div>
                  )}
                  {listing.dailyMenuSample.dinner && (
                    <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full bg-indigo-500" />
                        <span>Dinner</span>
                      </div>
                      <p className="text-xs text-slate-600 pl-3.5">
                        {listing.dailyMenuSample.dinner}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* HIGHLIGHTS & KITCHEN STANDARDS */}
            {((listing.highlights && listing.highlights.length > 0) ||
              (listing.kitchenFeatures && listing.kitchenFeatures.length > 0)) && (
              <div className="p-6 sm:p-8 bg-white rounded-3xl border border-slate-100 locano-card space-y-4">
                <h2 className="text-lg font-bold text-[#10233f] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ea580c]" />
                  <span>Highlights &amp; Hygiene Standards</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {[...(listing.highlights || []), ...(listing.kitchenFeatures || [])].map((feature) => (
                    <div key={feature} className="flex items-center gap-2 text-xs text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-[#ea580c] shrink-0" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBSCRIPTION GUIDELINES */}
            {listing.subscriptionRules && listing.subscriptionRules.length > 0 && (
              <div className="p-6 bg-white rounded-3xl border border-slate-100 locano-card space-y-3">
                <h3 className="text-sm font-bold text-[#10233f] uppercase tracking-wider">
                  Subscription Guidelines &amp; Policies
                </h3>
                <ul className="space-y-2 text-xs text-slate-600">
                  {listing.subscriptionRules.map((rule) => (
                    <li key={rule} className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#ea580c]" />
                      <span>{rule}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: ACTION & SUMMARY SIDEBAR */}
          <div className="lg:col-span-4 sticky top-28 space-y-6">
            <div className="p-6 bg-white rounded-3xl border border-slate-100 locano-card shadow-lg space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                    Starting Monthly
                  </span>
                  <span className="text-2xl font-extrabold text-[#10233f]">
                    ₹{listing.monthlyPriceFrom.toLocaleString("en-IN")}
                  </span>
                </div>
                <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-orange-100/80 text-[#ea580c]">
                  {listing.pricingType === "meals_per_day" ? "Per Day Plan" : "Meal Combos"}
                </span>
              </div>

              <div className="space-y-2.5 text-xs text-slate-600 border-t border-slate-100 pt-3">
                {listing.perMealPriceFrom > 0 && (
                  <div className="flex justify-between">
                    <span>Single Meal Rate:</span>
                    <span className="font-semibold text-slate-800">
                      ₹{listing.perMealPriceFrom}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Dietary Type:</span>
                  <span className="font-semibold text-slate-800">{listing.dietary}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service Type:</span>
                  <span className="font-semibold text-slate-800">{listing.serviceType}</span>
                </div>
                <div className="flex justify-between">
                  <span>Cuisine:</span>
                  <span className="font-semibold text-slate-800">{listing.cuisine}</span>
                </div>
                <div className="flex justify-between">
                  <span>Operating Days:</span>
                  <span className="font-semibold text-slate-800">
                    {listing.weeklyHolidays && listing.weeklyHolidays.length > 0
                      ? `Off: ${listing.weeklyHolidays.join(", ")}`
                      : "All 7 Days"}
                  </span>
                </div>
              </div>

              {/* ENQUIRY PREVIEW BUTTON */}
              <div className="pt-2">
                <EnquiryPreviewButton
                  listingName={listing.name}
                  listingId={listing.id}
                  category="mess"
                  buttonText="Enquire for Mess Pass"
                />
              </div>
            </div>

            {/* TRANSIT CONNECTION NOTICE */}
            <div className="p-5 rounded-3xl bg-orange-50/70 border border-orange-100 text-xs text-slate-600 space-y-2">
              <div className="font-bold text-[#10233f] flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
                <span>Transit Connectivity</span>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                This mess in {listing.area} is easily reachable from major colleges via Mangaluru local buses.
              </p>
              <Link
                href="/transport"
                className="inline-flex items-center gap-1 text-[#ea580c] font-semibold hover:underline text-[11px] pt-1"
              >
                <span>Check bus routes to {listing.area} →</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

