import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client"
import {
  type MessListing,
  type DietaryType,
  type ServiceType,
  type MealType,
  type MealPlan,
  type MessPricingType,
  type MealsPerDayPricing,
  type MealCombinationsPricing,
  type MessTimings,
  calculateStartingPrice,
} from "@/types/mess"
import type { Database } from "@/types/database"

export interface FetchMessesParams {
  search?: string
  dietary?: string
  service?: string
  includeDemo?: boolean
}

type MessRow = Database["public"]["Tables"]["mess_listings"]["Row"]

function mapRowToMess(row: MessRow): MessListing {
  const pricingType = (row.pricing_type as MessPricingType) || "meals_per_day"

  // Support both camelCase and snake_case stored in JSONB
  const rawMpd = (row.meals_per_day_pricing as Record<string, unknown>) || {}
  const rawGrp = ((rawMpd.groupPricing || rawMpd.group_pricing) as Record<string, unknown>) || {}
  const hasGroup = Boolean(rawMpd.hasGroupPricing ?? rawMpd.has_group_pricing)

  // Fallback to monthly_price_from if individual meal prices are null
  const baseMonthly = typeof row.monthly_price_from === "number" && row.monthly_price_from > 0 ? row.monthly_price_from : 3000
  const parsedOneMeal = (rawMpd.oneMealPrice as number) ?? (rawMpd.one_meal_price as number) ?? null
  const parsedTwoMeals = (rawMpd.twoMealsPrice as number) ?? (rawMpd.two_meals_price as number) ?? null
  const parsedThreeMeals = (rawMpd.threeMealsPrice as number) ?? (rawMpd.three_meals_price as number) ?? null

  const mealsPerDayPricing: MealsPerDayPricing = {
    oneMealPrice: parsedOneMeal ?? (pricingType === "meals_per_day" ? Math.round(baseMonthly * 0.6) : null),
    twoMealsPrice: parsedTwoMeals ?? (pricingType === "meals_per_day" ? baseMonthly : null),
    threeMealsPrice: parsedThreeMeals ?? (pricingType === "meals_per_day" ? Math.round(baseMonthly * 1.3) : null),
    hasGroupPricing: hasGroup,
    groupPricing: hasGroup
      ? {
          oneMealPrice: (rawGrp.oneMealPrice as number) ?? (rawGrp.one_meal_price as number) ?? null,
          twoMealsPrice: (rawGrp.twoMealsPrice as number) ?? (rawGrp.two_meals_price as number) ?? null,
          threeMealsPrice: (rawGrp.threeMealsPrice as number) ?? (rawGrp.three_meals_price as number) ?? null,
          groupSize: (rawGrp.groupSize as number) ?? (rawGrp.group_size as number) ?? 5,
          notes: (rawGrp.notes as string) ?? (rawGrp.note as string) ?? "5-person group pricing tier",
        }
      : null,
  }

  const rawComb = (row.meal_combinations_pricing as Record<string, unknown>) || {}
  const mealCombinationsPricing: MealCombinationsPricing = {
    breakfastOnly: (rawComb.breakfastOnly as number) ?? (rawComb.breakfast_only as number) ?? null,
    lunchOnly: (rawComb.lunchOnly as number) ?? (rawComb.lunch_only as number) ?? null,
    dinnerOnly: (rawComb.dinnerOnly as number) ?? (rawComb.dinner_only as number) ?? null,
    breakfastLunch: (rawComb.breakfastLunch as number) ?? (rawComb.breakfast_lunch as number) ?? null,
    breakfastDinner: (rawComb.breakfastDinner as number) ?? (rawComb.breakfast_dinner as number) ?? null,
    lunchDinner: (rawComb.lunchDinner as number) ?? (rawComb.lunch_dinner as number) ?? null,
    allThree: (rawComb.allThree as number) ?? (rawComb.all_three as number) ?? null,
  }

  const weeklyHolidays = Array.isArray(row.weekly_holidays) ? row.weekly_holidays : []

  const startingPrice = calculateStartingPrice({
    pricingType,
    mealsPerDayPricing,
    mealCombinationsPricing,
    monthlyPriceFrom: row.monthly_price_from,
  })

  return {
    id: row.id,
    ownerId: row.owner_id,
    name: row.name,
    tagline: row.tagline,
    cuisine: row.cuisine,
    dietary: row.dietary as DietaryType,
    serviceType: row.service_type as ServiceType,
    area: row.area,
    approximateLocation: row.approximate_location,
    nearestLandmark: row.nearest_landmark,
    pricingType,
    mealsPerDayPricing,
    mealCombinationsPricing,
    weeklyHolidays,
    monthlyPriceFrom: startingPrice || row.monthly_price_from,
    perMealPriceFrom: row.per_meal_price_from,
    mealsServed: row.meals_served as MealType[],
    mealPlans: (row.meal_plans as unknown as MealPlan[]) || [],
    dailyMenuSample: (row.daily_menu_sample as unknown as MessListing["dailyMenuSample"]) || { lunch: "", dinner: "" },
    timings: (row.timings as unknown as MessTimings) || {},
    highlights: row.highlights,
    kitchenFeatures: row.kitchen_features,
    subscriptionRules: row.subscription_rules,
    description: row.description,
    sampleImage: row.sample_image || "/mess-tiffin.jpg",
    images: row.images,
    status: row.status,
    isDemo: row.is_demo,
    createdAt: row.created_at,
  }
}

export async function fetchMesses(
  params: FetchMessesParams = {}
): Promise<{ listings: MessListing[]; isFromDatabase: boolean; error?: string }> {
  const { dietary, service } = params

  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        let query = supabase
          .from("mess_listings")
          .select("*")
          .eq("status", "published")
          .eq("is_demo", false)

        if (dietary && dietary !== "All") {
          query = query.eq("dietary", dietary as DietaryType)
        }
        if (service && service !== "All") {
          query = query.eq("service_type", service as ServiceType)
        }

        const { data, error } = await query.order("created_at", { ascending: false })

        if (error) {
          console.error("Supabase mess query error:", error.message)
          return { listings: [], isFromDatabase: true, error: error.message }
        } else if (data) {
          // Return all published results; fuzzy partitioning is done in the page component
          const results = data.map(mapRowToMess)
          return { listings: results, isFromDatabase: true }
        }
      }
    } catch (err) {
      console.warn("Supabase mess query error:", err)
      return { listings: [], isFromDatabase: true }
    }
  }

  return { listings: [], isFromDatabase: false }
}

export async function fetchMessById(id: string): Promise<MessListing | null> {
  if (isSupabaseConfigured()) {
    try {
      const supabase = getSupabaseBrowserClient()
      if (supabase) {
        const { data, error } = await supabase
          .from("mess_listings")
          .select("*")
          .eq("id", id)
          .eq("is_demo", false)
          .single()

        if (!error && data) {
          return mapRowToMess(data)
        }
      }
    } catch (err) {
      console.warn("Error fetching mess by id:", err)
    }
  }

  return null
}
