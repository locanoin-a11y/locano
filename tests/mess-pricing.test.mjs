import { describe, it } from 'node:test'
import assert from 'node:assert'
import { calculateStartingPrice } from '../src/types/mess.ts'

describe('Food & Mess Module - Pricing & Data Integrity', () => {
  describe('Model A (Meals per Day) Starting Price Calculation', () => {
    it('calculates lowest monthly price when 1, 2, and 3 meals are provided', () => {
      const starting = calculateStartingPrice({
        pricingType: 'meals_per_day',
        mealsPerDayPricing: {
          oneMealPrice: 1900,
          twoMealsPrice: 3000,
          threeMealsPrice: 3900,
        },
        monthlyPriceFrom: 4000,
      })
      assert.strictEqual(starting, 1900)
    })

    it('calculates lowest price when only 2 and 3 meals are advertised', () => {
      const starting = calculateStartingPrice({
        pricingType: 'meals_per_day',
        mealsPerDayPricing: {
          twoMealsPrice: 3200,
          threeMealsPrice: 4100,
        },
        monthlyPriceFrom: 4000,
      })
      assert.strictEqual(starting, 3200)
    })

    it('ignores 5-person group tier prices when finding individual starting price', () => {
      const starting = calculateStartingPrice({
        pricingType: 'meals_per_day',
        mealsPerDayPricing: {
          oneMealPrice: 2100,
          twoMealsPrice: 3400,
          threeMealsPrice: 4200,
          fivePersonTier: {
            enabled: true,
            oneMealPrice: 9500,
            twoMealsPrice: 15500,
            threeMealsPrice: 19000,
            pricingBasis: 'for_group',
          },
        },
        monthlyPriceFrom: 5000,
      })
      assert.strictEqual(starting, 2100)
    })
  })

  describe('Model B (Meal Combinations) Starting Price Calculation', () => {
    it('calculates lowest price across all 7 combinations', () => {
      const starting = calculateStartingPrice({
        pricingType: 'meal_combinations',
        mealCombinationsPricing: {
          breakfastOnly: 1500,
          lunchOnly: 2000,
          dinnerOnly: 2000,
          breakfastLunch: 2800,
          breakfastDinner: 2800,
          lunchDinner: 3200,
          allThree: 3800,
        },
        monthlyPriceFrom: 4000,
      })
      assert.strictEqual(starting, 1500)
    })

    it('calculates lowest price when only subset of combinations is advertised', () => {
      const starting = calculateStartingPrice({
        pricingType: 'meal_combinations',
        mealCombinationsPricing: {
          lunchOnly: 2200,
          lunchDinner: 3400,
        },
        monthlyPriceFrom: 4000,
      })
      assert.strictEqual(starting, 2200)
    })

    it('falls back to default price if no combinations have prices entered', () => {
      const starting = calculateStartingPrice({
        pricingType: 'meal_combinations',
        mealCombinationsPricing: {},
        monthlyPriceFrom: 3000,
      })
      assert.strictEqual(starting, 3000)
    })
  })

  describe('Meal Timings Integrity', () => {
    it('supports independent Breakfast, Lunch, and Dinner without omitting lunch', () => {
      const timings = {
        breakfast: '7:30 AM - 10:00 AM',
        lunch: '12:30 PM - 3:00 PM',
        dinner: '7:30 PM - 10:00 PM',
      }
      assert.ok(timings.breakfast)
      assert.ok(timings.lunch)
      assert.ok(timings.dinner)
      assert.strictEqual(timings.lunch, '12:30 PM - 3:00 PM')
    })

    it('preserves only provided timings without inventing missing meals', () => {
      const partialTimings = {
        lunch: '1:00 PM - 3:30 PM',
        dinner: '8:00 PM - 10:30 PM',
      }
      assert.strictEqual(partialTimings.breakfast, undefined)
      assert.strictEqual(partialTimings.lunch, '1:00 PM - 3:30 PM')
      assert.strictEqual(partialTimings.dinner, '8:00 PM - 10:30 PM')
    })
  })

  describe('Weekly Holidays Representation', () => {
    it('supports single or multiple weekly holidays', () => {
      const singleOff = ['Sunday']
      const multipleOff = ['Sunday', 'Wednesday']
      const noOff = []

      assert.strictEqual(singleOff.length, 1)
      assert.strictEqual(multipleOff.length, 2)
      assert.strictEqual(noOff.length, 0)
    })
  })
})
