-- ==============================================================================
-- LOCANO — Security Hardening Migration
-- Migration: 20261031000001_security_hardening.sql
--
-- Changes:
--  1. Tighten storage RLS: only authenticated admins can upload/update/delete
--     listing images (public SELECT remains open).
--  2. Add explicit RLS policy so the Edge middleware can verify admin role
--     via the anon key without requiring a service-role bypass.
-- ==============================================================================

-- ── 1. STORAGE POLICIES (replace the open insert/update/delete policies) ──────

-- 1.1 Public read — unchanged, everyone can view listing images.
drop policy if exists "Public Access to Listing Images" on storage.objects;
create policy "Public Access to Listing Images"
  on storage.objects for select
  using (bucket_id = 'listings');

-- 1.2 Upload — authenticated admin only.
drop policy if exists "Admins can upload listing images" on storage.objects;
create policy "Admins can upload listing images"
  on storage.objects for insert
  with check (
    bucket_id = 'listings'
    and public.is_admin()
  );

-- 1.3 Update — authenticated admin only.
drop policy if exists "Admins can update listing images" on storage.objects;
create policy "Admins can update listing images"
  on storage.objects for update
  using (
    bucket_id = 'listings'
    and public.is_admin()
  );

-- 1.4 Delete — authenticated admin only.
drop policy if exists "Admins can delete listing images" on storage.objects;
create policy "Admins can delete listing images"
  on storage.objects for delete
  using (
    bucket_id = 'listings'
    and public.is_admin()
  );

-- ── 2. PROFILES — middleware role-check policy ─────────────────────────────────
-- The Edge middleware uses the anon key + the user's JWT to call
-- supabase.from("profiles").select("role").eq("id", user.id).
-- The existing "Users can view own profile" policy (auth.uid() = id) already
-- covers this — no new policy needed.  This comment documents it explicitly.

-- Verify policy exists (informational, no-op if already present):
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public'
      and tablename  = 'profiles'
      and policyname = 'Users can view own profile'
  ) then
    -- Recreate if somehow missing
    execute $policy$
      create policy "Users can view own profile"
        on public.profiles for select
        using (auth.uid() = id or public.is_admin())
    $policy$;
  end if;
end;
$$;

-- ── 3. BLOCK UNAUTHENTICATED INSERT on all sensitive tables ───────────────────
-- Belt-and-suspenders: make sure no anonymous (null uid) INSERT is possible
-- even if a future policy accidentally opens a table.

-- profiles: only the trigger (security definer) should insert; no direct anon insert.
drop policy if exists "Block anon inserts on profiles" on public.profiles;
create policy "Block anon inserts on profiles"
  on public.profiles for insert
  with check (auth.uid() is not null and auth.uid() = id);

-- admin_notifications: only admins and security-definer functions may insert.
drop policy if exists "Only admins can insert notifications" on public.admin_notifications;
create policy "Only admins can insert notifications"
  on public.admin_notifications for insert
  with check (public.is_admin());

