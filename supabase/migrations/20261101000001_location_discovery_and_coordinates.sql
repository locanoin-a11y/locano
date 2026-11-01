-- Migration: 20261101000001_location_discovery_and_coordinates.sql
-- Description: Additive migration for PG & Mess coordinates and central searchable areas registry.
-- ZERO EXISTING DATA IS DELETED, DROPPED, OR OVERWRITTEN.
-- STRICT REQUIREMENT: NO BULK UPLOADS, NO RESEEDING, NO OVERWRITING EXISTING LISTINGS.

-- ============================================================================
-- QUERY 1: SCHEMA CHANGES (ADD NULLABLE COORDINATES TO EXISTING LISTING TABLES)
-- ============================================================================

-- 1.1 Add nullable coordinates to public.accommodation_listings
ALTER TABLE public.accommodation_listings
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision;

-- 1.2 Partial index for listings with verified coordinates (leaves NULL listings unindexed)
CREATE INDEX IF NOT EXISTS idx_acc_coords
ON public.accommodation_listings(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- 1.3 Add nullable coordinates to public.mess_listings
ALTER TABLE public.mess_listings
ADD COLUMN IF NOT EXISTS latitude double precision,
ADD COLUMN IF NOT EXISTS longitude double precision;

-- 1.4 Partial index for messes with verified coordinates (leaves NULL listings unindexed)
CREATE INDEX IF NOT EXISTS idx_mess_coords
ON public.mess_listings(latitude, longitude)
WHERE latitude IS NOT NULL AND longitude IS NOT NULL;


-- ============================================================================
-- QUERY 2: SEARCHABLE AREAS REGISTRY (TABLE & SECURITY POLICIES)
-- ============================================================================

-- 2.1 Create central searchable areas registry table
CREATE TABLE IF NOT EXISTS public.searchable_areas (
  id text PRIMARY KEY,
  canonical_name text NOT NULL UNIQUE,
  aliases text[] NOT NULL DEFAULT '{}',
  latitude double precision NOT NULL,
  longitude double precision NOT NULL,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- 2.2 Indexes for high-performance area resolution
CREATE INDEX IF NOT EXISTS idx_searchable_areas_canonical
ON public.searchable_areas(canonical_name);

CREATE INDEX IF NOT EXISTS idx_searchable_areas_active
ON public.searchable_areas(is_active);

-- 2.3 Row Level Security configuration
ALTER TABLE public.searchable_areas ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if re-running to ensure idempotency
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'searchable_areas' AND policyname = 'Allow public read on searchable_areas'
  ) THEN
    DROP POLICY "Allow public read on searchable_areas" ON public.searchable_areas;
  END IF;

  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'searchable_areas' AND policyname = 'Allow admin full access on searchable_areas'
  ) THEN
    DROP POLICY "Allow admin full access on searchable_areas" ON public.searchable_areas;
  END IF;
END $$;

-- Public can view only active verified areas
CREATE POLICY "Allow public read on searchable_areas"
ON public.searchable_areas
FOR SELECT
USING (is_active = true);

-- Only admins and service role can insert, update, or delete reference areas
CREATE POLICY "Allow admin full access on searchable_areas"
ON public.searchable_areas
FOR ALL
USING (
  coalesce(auth.jwt() ->> 'role', '') = 'service_role' OR
  exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  )
);


-- ============================================================================
-- QUERY 3: VERIFIED AREA REFERENCE DATA (SAFE INSERT-ONLY, 53 RECONCILED LOCALITIES)
-- ============================================================================
-- Note: Uses ON CONFLICT (id) DO NOTHING to protect existing records and prevent overwriting.

INSERT INTO public.searchable_areas (id, canonical_name, aliases, latitude, longitude, is_active)
VALUES
  ('valencia', 'Valencia', ARRAY['valancia', 'valenshiya', 'velencia'], 12.8596, 74.8519, true),
  ('balmatta', 'Balmatta', ARRAY['balmata', 'balmatha', 'balmatte'], 12.8708, 74.8458, true),
  ('deralakatte', 'Deralakatte', ARRAY['derlakatte', 'derlakate', 'daralakatte', 'darlakatte', 'kshema', 'yenepoya', 'nitte'], 12.8166, 74.8988, true),
  ('kankanady', 'Kankanady', ARRAY['kankanadi', 'kankannady'], 12.8633, 74.8585, true),
  ('hampankatta', 'Hampankatta', ARRAY['hampankata', 'hampanakatta', 'hampankatte'], 12.8687, 74.8427, true),
  ('kadri', 'Kadri', ARRAY['kadry', 'kaadri'], 12.8858, 74.8560, true),
  ('surathkal', 'Surathkal', ARRAY['suratkal', 'surathcal', 'nitk'], 13.0119, 74.7943, true),
  ('bejai', 'Bejai', ARRAY['bijai', 'bejay'], 12.8872, 74.8422, true),
  ('attavar', 'Attavar', ARRAY['attavara', 'athavar'], 12.8617, 74.8475, true),
  ('falnir', 'Falnir', ARRAY['falneer', 'falner'], 12.8640, 74.8460, true),
  ('pumpwell', 'Pumpwell', ARRAY['pumpwel', 'pumpwal', 'kankanady bypass'], 12.8590, 74.8635, true),
  ('bendoor', 'Bendoor', ARRAY['bendor'], 12.8708, 74.8520, true),
  ('bendoorwell', 'Bendoorwell', ARRAY['bendoor well', 'bendorwell'], 12.8680, 74.8540, true),
  ('kuntikana', 'Kuntikana', ARRAY['kuntikan', 'aj hospital'], 12.8985, 74.8570, true),
  ('kodialbail', 'Kodialbail', ARRAY['kodialbailu', 'kodialbayal'], 12.8735, 74.8415, true),
  ('lalbagh', 'Lalbagh', ARRAY['lalbag', 'mangaluru corporation'], 12.8805, 74.8427, true),
  ('kottara', 'Kottara', ARRAY['kotara'], 12.8940, 74.8430, true),
  ('kottara_chowki', 'Kottara Chowki', ARRAY['kottarachowki', 'chowki'], 12.9000, 74.8390, true),
  ('urwa', 'Urwa', ARRAY['urva'], 12.8870, 74.8360, true),
  ('urwa_store', 'Urwa Store', ARRAY['urvastore', 'urwa market'], 12.8920, 74.8350, true),
  ('adyar', 'Adyar', ARRAY['adyar mangalore', 'sahyadri'], 12.8680, 74.9120, true),
  ('mudippu', 'Mudippu', ARRAY['mudipu', 'mangalore university'], 12.8120, 74.9540, true),
  ('padil', 'Padil', ARRAY['padeel'], 12.8670, 74.8850, true),
  ('ullal', 'Ullal', ARRAY['ulal'], 12.8250, 74.8540, true),
  ('bondel', 'Bondel', ARRAY['mpt'], 12.9150, 74.8650, true),
  ('panambur', 'Panambur', ARRAY['panamboor', 'panambur beach'], 12.9520, 74.8080, true),
  ('jeppu', 'Jeppu', ARRAY['jeppu bappal'], 12.8519, 74.8465, true),
  ('jeppu_market', 'Jeppu Market', ARRAY['jeppumarket'], 12.8530, 74.8450, true),
  ('pandeshwar', 'Pandeshwar', ARRAY['pandeshwara', 'forum mall'], 12.8586, 74.8392, true),
  ('mannagudda', 'Mannagudda', ARRAY['mannagudde'], 12.8780, 74.8340, true),
  ('chilimbi', 'Chilimbi', ARRAY['chilimby'], 12.8900, 74.8320, true),
  ('ladyhill', 'Ladyhill', ARRAY['lady hill', 'brahmashree narayana guru circle'], 12.8850, 74.8340, true),
  ('jyothi', 'Jyothi', ARRAY['jyoti', 'jyothi circle', 'ambedkar circle'], 12.8710, 74.8460, true),
  ('mallikatte', 'Mallikatte', ARRAY['malikkatte', 'kadri market'], 12.8750, 74.8570, true),
  ('bikarnakatte', 'Bikarnakatte', ARRAY['bikarnakatta'], 12.8760, 74.8680, true),
  ('derebail', 'Derebail', ARRAY['derebayal'], 12.9050, 74.8480, true),
  ('maryhill', 'Maryhill', ARRAY['helipad'], 12.9100, 74.8550, true),
  ('kavoor', 'Kavoor', ARRAY['kavur'], 12.9180, 74.8590, true),
  ('yeyyadi', 'Yeyyadi', ARRAY['yeyyady'], 12.8950, 74.8620, true),
  ('shaktinagar', 'Shaktinagar', ARRAY['sakthinagar'], 12.8880, 74.8780, true),
  ('valachil', 'Valachil', ARRAY['srinivas college'], 12.8660, 74.9350, true),
  ('baikampady', 'Baikampady', ARRAY['baikampadi'], 12.9600, 74.8150, true),
  ('bolar', 'Bolar', ARRAY['bolaara'], 12.8450, 74.8390, true),
  ('car_street', 'Car Street', ARRAY['carstreet', 'venkataramana temple'], 12.8690, 74.8380, true),
  ('state_bank', 'State Bank', ARRAY['statebank', 'service bus stand'], 12.8620, 74.8390, true),
  ('bunts_hostel', 'Bunts Hostel', ARRAY['buntshostel', 'bunthshostel'], 12.8740, 74.8480, true),
  ('pvs_circle', 'PVS Circle', ARRAY['pvs', 'pvs junction'], 12.8750, 74.8450, true),
  ('ballalbagh', 'Ballalbagh', ARRAY['ballal bagh'], 12.8820, 74.8380, true),
  ('kotekani', 'Kotekani', ARRAY['kotekany', 'urwa kotekani'], 12.8910, 74.8390, true),
  ('nandigudda', 'Nandigudda', ARRAY['nandigudde'], 12.8540, 74.8490, true),
  ('kapikad', 'Kapikad', ARRAY['kaapikad', 'bejai kapikad'], 12.8900, 74.8380, true),
  ('ashoknagar', 'Ashoknagar', ARRAY['ashok nagar'], 12.8920, 74.8370, true),
  ('konchady', 'Konchady', ARRAY['konchadi'], 12.9080, 74.8510, true)
ON CONFLICT (id) DO NOTHING;
