-- PROFILES (auto-created on signup)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

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

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- LEAGUES
CREATE TABLE leagues (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  invite_code TEXT NOT NULL UNIQUE DEFAULT substring(gen_random_uuid()::text, 1, 8),
  created_by UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- LEAGUE MEMBERS (many-to-many)
CREATE TABLE league_members (
  league_id UUID NOT NULL REFERENCES leagues(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('owner', 'member')),
  joined_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (league_id, user_id)
);

-- DRAFTS (replaces localStorage)
CREATE TABLE drafts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  league_id UUID REFERENCES leagues(id) ON DELETE SET NULL,
  show_id TEXT NOT NULL,
  song_ids TEXT[] NOT NULL,
  scored BOOLEAN NOT NULL DEFAULT false,
  total_score INTEGER NOT NULL DEFAULT 0,
  song_scores JSONB NOT NULL DEFAULT '[]'::jsonb,
  share_code TEXT UNIQUE DEFAULT substring(gen_random_uuid()::text, 1, 12),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- INDEXES
CREATE INDEX idx_drafts_user_id ON drafts(user_id);
CREATE INDEX idx_drafts_show_id ON drafts(show_id);
CREATE INDEX idx_drafts_league_id ON drafts(league_id);
CREATE INDEX idx_drafts_share_code ON drafts(share_code);
CREATE INDEX idx_league_members_user_id ON league_members(user_id);
CREATE INDEX idx_leagues_invite_code ON leagues(invite_code);

-- RLS POLICIES
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles readable by all" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

ALTER TABLE leagues ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Leagues readable by all" ON leagues FOR SELECT USING (true);
CREATE POLICY "Auth users create leagues" ON leagues FOR INSERT WITH CHECK (auth.uid() = created_by);
CREATE POLICY "Owners update leagues" ON leagues FOR UPDATE USING (auth.uid() = created_by);
CREATE POLICY "Owners delete leagues" ON leagues FOR DELETE USING (auth.uid() = created_by);

ALTER TABLE league_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Members readable by all" ON league_members FOR SELECT USING (true);
CREATE POLICY "Users join leagues" ON league_members FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users leave leagues" ON league_members FOR DELETE USING (auth.uid() = user_id);

ALTER TABLE drafts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Drafts readable by all" ON drafts FOR SELECT USING (true);
CREATE POLICY "Users create own drafts" ON drafts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own drafts" ON drafts FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own drafts" ON drafts FOR DELETE USING (auth.uid() = user_id);
