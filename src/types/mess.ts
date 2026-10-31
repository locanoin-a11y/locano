export type DietaryType = "Pure Veg" | "Veg & Non-Veg"
export type ServiceType = "Dine-in Mess" | "Tiffin & Delivery" | "Dine-in & Delivery"
export type MealType = "Breakfast" | "Lunch" | "Dinner"

export type MessPricingType = "meals_per_day" | "meal_combinations"

export interface MealPlan {
  name: string
  price: number
  period: "month" | "15-days" | "per-meal"
  description: string
  popular?: boolean
}

/**
 * Model A: Pricing based on the number of meals per day (1, 2, or 3 meals/day).
 * Includes optional 5-person group pricing tier.
 */
export interface MealsPerDayPricing {
  oneMealPrice?: number | null
  twoMealsPrice?: number | null
  threeMealsPrice?: number | null
  hasGroupPricing?: boolean
  groupPricing?: {
    oneMealPrice?: number | null
    twoMealsPrice?: number | null
    threeMealsPrice?: number | null
    groupSize?: number
    notes?: string
  } | null
}

/**
 * Model B: Pricing based on specific meal combinations (7 combinations).
 */
export interface MealCombinationsPricing {
  breakfastOnly?: number | null
  lunchOnly?: number | null
  dinnerOnly?: number | null
  breakfastLunch?: number | null
  breakfastDinner?: number | null
  lunchDinner?: number | null
  allThree?: number | null
}

export interface MessTimings {
  breakfast?: string
  lunch?: string
  dinner?: string
}

export interface MessListing {
  id: string
  ownerId?: string | null
  name: string
  tagline: string
  cuisine: string
  dietary: DietaryType
  serviceType: ServiceType
  area: string
  approximateLocation: string
  nearestLandmark: string
  // Pricing model
  pricingType: MessPricingType
  mealsPerDayPricing?: MealsPerDayPricing
  mealCombinationsPricing?: MealCombinationsPricing
  weeklyHolidays?: string[]
  // Starting monthly price (dynamically computed or loaded)
  monthlyPriceFrom: number
  perMealPriceFrom: number
  mealsServed: MealType[]
  mealPlans: MealPlan[]
  dailyMenuSample: {
    breakfast?: string
    lunch?: string
    dinner?: string
  }
  timings: MessTimings
  highlights: string[]
  kitchenFeatures: string[]
  subscriptionRules: string[]
  description: string
  sampleImage: string
  images?: string[]
  status?: "pending" | "published" | "rejected" | "archived"
  isDemo?: boolean
  createdAt?: string
}

/**
 * Helper to compute the lowest valid monthly price from whichever pricing model is active
 */
export function calculateStartingPrice(mess: Partial<MessListing>): number {
  if (mess.pricingType === "meal_combinations" && mess.mealCombinationsPricing) {
    const comb = mess.mealCombinationsPricing as Record<string, unknown>
    const prices = [
      comb.breakfastOnly ?? comb.breakfast_only,
      comb.lunchOnly ?? comb.lunch_only,
      comb.dinnerOnly ?? comb.dinner_only,
      comb.breakfastLunch ?? comb.breakfast_lunch,
      comb.breakfastDinner ?? comb.breakfast_dinner,
      comb.lunchDinner ?? comb.lunch_dinner,
      comb.allThree ?? comb.all_three,
    ].filter((p): p is number => typeof p === "number" && p > 0)

    if (prices.length > 0) {
      return Math.min(...prices)
    }
  }

  if (mess.pricingType === "meals_per_day" && mess.mealsPerDayPricing) {
    const mpd = mess.mealsPerDayPricing as Record<string, unknown>
    const prices = [
      mpd.oneMealPrice ?? mpd.one_meal_price,
      mpd.twoMealsPrice ?? mpd.two_meals_price,
      mpd.threeMealsPrice ?? mpd.three_meals_price,
    ].filter((p): p is number => typeof p === "number" && p > 0)

    if (prices.length > 0) {
      return Math.min(...prices)
    }
  }

  return mess.monthlyPriceFrom || 0
}
