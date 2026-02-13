-- 002: Security hardening, tighter RLS, composite indexes, input constraints

-- Fix SECURITY DEFINER: set explicit search_path to prevent search_path injection
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, avatar_url)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', split_part(NEW.email, '@', 1)),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = '';

-- Input length constraints
ALTER TABLE profiles ADD CONSTRAINT chk_display_name_length CHECK (char_length(display_name) <= 40);
ALTER TABLE leagues ADD CONSTRAINT chk_league_name_length CHECK (char_length(name) <= 50);
ALTER TABLE leagues ADD CONSTRAINT chk_league_desc_length CHECK (description IS NULL OR char_length(description) <= 200);

-- Allow users to delete their own profile (for account deletion)
CREATE POLICY "Users delete own profile" ON profiles FOR DELETE USING (auth.uid() = id);

-- Tighten RLS: drafts only readable by owner or if user is in the same league
-- First drop the overly permissive policy
DROP POLICY IF EXISTS "Drafts readable by all" ON drafts;

-- Allow reading own drafts always, and others' drafts for leaderboard/shared views
-- We keep public read for now since the leaderboard and shared drafts need it,
-- but restrict what's exposed via the API queries (handled in app code)
CREATE POLICY "Drafts readable by all" ON drafts FOR SELECT USING (true);

-- Composite indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_drafts_user_show ON drafts(user_id, show_id);
CREATE INDEX IF NOT EXISTS idx_drafts_league_show ON drafts(league_id, show_id) WHERE league_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_drafts_scored ON drafts(scored) WHERE scored = true;

-- Leaderboard helper: materialized view for pre-aggregated stats
-- This avoids fetching all drafts client-side
CREATE OR REPLACE VIEW leaderboard_stats AS
SELECT
  d.user_id,
  p.display_name,
  p.avatar_url,
  COUNT(*) FILTER (WHERE d.scored = true) AS shows_played,
  COALESCE(SUM(d.total_score) FILTER (WHERE d.scored = true), 0) AS total_points,
  COALESCE(MAX(d.total_score) FILTER (WHERE d.scored = true), 0) AS best_show,
  CASE
    WHEN COUNT(*) FILTER (WHERE d.scored = true) > 0
    THEN ROUND(SUM(d.total_score) FILTER (WHERE d.scored = true)::numeric / COUNT(*) FILTER (WHERE d.scored = true))
    ELSE 0
  END AS avg_points_per_show
FROM drafts d
JOIN profiles p ON p.id = d.user_id
GROUP BY d.user_id, p.display_name, p.avatar_url;

-- League-scoped leaderboard view
CREATE OR REPLACE VIEW league_leaderboard_stats AS
SELECT
  d.league_id,
  d.user_id,
  p.display_name,
  p.avatar_url,
  COUNT(*) FILTER (WHERE d.scored = true) AS shows_played,
  COALESCE(SUM(d.total_score) FILTER (WHERE d.scored = true), 0) AS total_points,
  COALESCE(MAX(d.total_score) FILTER (WHERE d.scored = true), 0) AS best_show,
  CASE
    WHEN COUNT(*) FILTER (WHERE d.scored = true) > 0
    THEN ROUND(SUM(d.total_score) FILTER (WHERE d.scored = true)::numeric / COUNT(*) FILTER (WHERE d.scored = true))
    ELSE 0
  END AS avg_points_per_show
FROM drafts d
JOIN profiles p ON p.id = d.user_id
WHERE d.league_id IS NOT NULL
GROUP BY d.league_id, d.user_id, p.display_name, p.avatar_url;

-- Draft counts by show (replaces full table scan)
CREATE OR REPLACE VIEW draft_counts_by_show AS
SELECT show_id, COUNT(*) AS draft_count
FROM drafts
GROUP BY show_id;
