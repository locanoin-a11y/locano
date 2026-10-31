-- ==============================================================================
-- LOCANO — Food & Mess Module Redesign Migration
-- Migration: 20261031000002_food_and_mess_redesign.sql
--
-- Scope:
--  1. Add pricing_type column: 'meals_per_day' | 'meal_combinations'
--  2. Add meals_per_day_pricing JSONB (Model A: 1/2/3 meals/day + optional 5-person tier)
--  3. Add meal_combinations_pricing JSONB (Model B: 7 meal combinations)
--  4. Add weekly_holidays TEXT[] (e.g. ['Sunday'])
--  5. Backfill existing rows with safe defaults so no data is lost
-- ==============================================================================

-- 1. ADD PRICING_TYPE COLUMN
alter table public.mess_listings
  add column if not exists pricing_type text not null default 'meals_per_day';

-- Add check constraint for pricing_type
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'check_mess_pricing_type'
  ) then
    alter table public.mess_listings
      add constraint check_mess_pricing_type
      check (pricing_type in ('meals_per_day', 'meal_combinations'));
  end if;
end;
$$;

-- 2. ADD STRUCTURED PRICING JSONB COLUMNS
alter table public.mess_listings
  add column if not exists meals_per_day_pricing jsonb not null default '{}'::jsonb;

alter table public.mess_listings
  add column if not exists meal_combinations_pricing jsonb not null default '{}'::jsonb;

-- 3. ADD WEEKLY_HOLIDAYS COLUMN
alter table public.mess_listings
  add column if not exists weekly_holidays text[] not null default '{}';

-- 4. CREATE INDEXES FOR SEARCH AND FILTERING
create index if not exists idx_mess_pricing_type on public.mess_listings(pricing_type);

-- 5. BACKFILL EXISTING MESS LISTINGS
-- Migrate existing records so they have structured meals_per_day_pricing populated from their existing monthly_price_from
-- Stores both camelCase & snake_case keys for universal frontend & admin interoperability
update public.mess_listings
set
  meals_per_day_pricing = case
    when meals_per_day_pricing = '{}'::jsonb or meals_per_day_pricing is null then
      jsonb_build_object(
        'oneMealPrice', round(monthly_price_from * 0.6),
        'one_meal_price', round(monthly_price_from * 0.6),
        'twoMealsPrice', monthly_price_from,
        'two_meals_price', monthly_price_from,
        'threeMealsPrice', round(monthly_price_from * 1.3),
        'three_meals_price', round(monthly_price_from * 1.3),
        'hasGroupPricing', false,
        'has_group_pricing', false
      )
    else
      meals_per_day_pricing || jsonb_build_object(
        'oneMealPrice', coalesce(meals_per_day_pricing->'oneMealPrice', meals_per_day_pricing->'one_meal_price', to_jsonb(round(monthly_price_from * 0.6))),
        'one_meal_price', coalesce(meals_per_day_pricing->'one_meal_price', meals_per_day_pricing->'oneMealPrice', to_jsonb(round(monthly_price_from * 0.6))),
        'twoMealsPrice', coalesce(meals_per_day_pricing->'twoMealsPrice', meals_per_day_pricing->'two_meals_price', to_jsonb(monthly_price_from)),
        'two_meals_price', coalesce(meals_per_day_pricing->'two_meals_price', meals_per_day_pricing->'twoMealsPrice', to_jsonb(monthly_price_from)),
        'threeMealsPrice', coalesce(meals_per_day_pricing->'threeMealsPrice', meals_per_day_pricing->'three_meals_price', to_jsonb(round(monthly_price_from * 1.3))),
        'three_meals_price', coalesce(meals_per_day_pricing->'three_meals_price', meals_per_day_pricing->'threeMealsPrice', to_jsonb(round(monthly_price_from * 1.3)))
      )
  end,
  weekly_holidays = case
    when weekly_holidays is null or array_length(weekly_holidays, 1) is null then
      array['Sunday']::text[]
    else weekly_holidays
  end
where pricing_type = 'meals_per_day';
