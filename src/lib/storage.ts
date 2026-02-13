import { createClient } from "@/lib/supabase/client";
import { Draft, LeaderboardEntry, SongScore } from "./types";
import { sanitizeAvatarUrl } from "./utils";

interface DbDraft {
  id: string;
  user_id: string;
  show_id: string;
  song_ids: string[];
  scored: boolean;
  total_score: number;
  song_scores: SongScore[];
  share_code: string;
  league_id: string | null;
  created_at: string;
  updated_at: string;
  profiles: { display_name: string; avatar_url: string | null };
}

function mapDbDraft(row: DbDraft): Draft {
  return {
    id: row.id,
    userId: row.user_id,
    displayName: row.profiles?.display_name || "Unknown",
    avatarUrl: sanitizeAvatarUrl(row.profiles?.avatar_url),
    showId: row.show_id,
    songIds: row.song_ids || [],
    createdAt: row.created_at,
    scored: row.scored,
    totalScore: row.total_score,
    songScores: (row.song_scores || []) as SongScore[],
    leagueId: row.league_id,
    shareCode: row.share_code,
  };
}

const DRAFT_SELECT = "*, profiles(display_name, avatar_url)";

export async function getDrafts(
  userId?: string,
  options?: { limit?: number; offset?: number }
): Promise<Draft[]> {
  const supabase = createClient();
  const limit = options?.limit ?? 100;
  const offset = options?.offset ?? 0;
  let query = supabase
    .from("drafts")
    .select(DRAFT_SELECT)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error) { console.error("getDrafts error:", error.message); return []; }
  if (!data) return [];
  return (data as unknown as DbDraft[]).map(mapDbDraft);
}

export async function createDraft(data: {
  userId: string;
  showId: string;
  songIds: string[];
  leagueId?: string;
}): Promise<Draft | null> {
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("drafts")
    .insert({
      user_id: data.userId,
      show_id: data.showId,
      song_ids: data.songIds,
      league_id: data.leagueId || null,
    })
    .select(DRAFT_SELECT)
    .single();
  if (error) { console.error("createDraft error:", error.message); return null; }
  if (!row) return null;
  return mapDbDraft(row as unknown as DbDraft);
}

export async function updateDraft(
  id: string,
  updates: { scored?: boolean; totalScore?: number; songScores?: SongScore[] }
): Promise<void> {
  const supabase = createClient();
  const dbUpdates: Record<string, unknown> = {
    updated_at: new Date().toISOString(),
  };
  if (updates.scored !== undefined) dbUpdates.scored = updates.scored;
  if (updates.totalScore !== undefined) dbUpdates.total_score = updates.totalScore;
  if (updates.songScores !== undefined) dbUpdates.song_scores = updates.songScores;
  const { error } = await supabase.from("drafts").update(dbUpdates).eq("id", id);
  if (error) console.error("updateDraft error:", error.message);
}

export async function getDraftById(id: string): Promise<Draft | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drafts")
    .select(DRAFT_SELECT)
    .eq("id", id)
    .single();
  if (error) { console.error("getDraftById error:", error.message); return null; }
  if (!data) return null;
  return mapDbDraft(data as unknown as DbDraft);
}

export async function getDraftsByShow(
  showId: string,
  leagueId?: string,
  options?: { limit?: number; offset?: number }
): Promise<Draft[]> {
  const supabase = createClient();
  const limit = options?.limit ?? 200;
  const offset = options?.offset ?? 0;
  let query = supabase
    .from("drafts")
    .select(DRAFT_SELECT)
    .eq("show_id", showId)
    .range(offset, offset + limit - 1);
  if (leagueId) query = query.eq("league_id", leagueId);
  const { data, error } = await query;
  if (error) { console.error("getDraftsByShow error:", error.message); return []; }
  if (!data) return [];
  return (data as unknown as DbDraft[]).map(mapDbDraft);
}

export async function getDraftCountsByShow(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data, error } = await supabase.from("drafts").select("show_id");
  if (error) { console.error("getDraftCountsByShow error:", error.message); return {}; }
  if (!data) return {};
  const counts: Record<string, number> = {};
  (data as { show_id: string }[]).forEach((row) => {
    counts[row.show_id] = (counts[row.show_id] || 0) + 1;
  });
  return counts;
}

export async function deleteDraft(id: string): Promise<void> {
  const supabase = createClient();
  const { error } = await supabase.from("drafts").delete().eq("id", id);
  if (error) console.error("deleteDraft error:", error.message);
}

export async function getDraftByShareCode(code: string): Promise<Draft | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drafts")
    .select(DRAFT_SELECT)
    .eq("share_code", code)
    .single();
  if (error) { console.error("getDraftByShareCode error:", error.message); return null; }
  if (!data) return null;
  return mapDbDraft(data as unknown as DbDraft);
}

/** Lightweight leaderboard stats from Postgres view (no draft details) */
export async function getLeaderboardStats(leagueId?: string): Promise<LeaderboardEntry[]> {
  const supabase = createClient();
  const view = leagueId ? "league_leaderboard_stats" : "leaderboard_stats";
  let query = supabase.from(view).select("*");
  if (leagueId) query = query.eq("league_id", leagueId);
  const { data, error } = await query;

  if (error) {
    console.error("getLeaderboardStats error:", error.message);
    // Fallback to client-side aggregation if view doesn't exist yet
    return getLeaderboard(leagueId);
  }
  if (!data || data.length === 0) return [];

  return (data as Array<{
    user_id: string;
    display_name: string;
    avatar_url: string | null;
    shows_played: number;
    total_points: number;
    best_show: number;
    avg_points_per_show: number;
  }>)
    .map((row) => ({
      userId: row.user_id,
      displayName: row.display_name,
      avatarUrl: sanitizeAvatarUrl(row.avatar_url),
      totalPoints: Number(row.total_points),
      showsPlayed: Number(row.shows_played),
      avgPointsPerShow: Number(row.avg_points_per_show),
      bestShow: Number(row.best_show),
      drafts: [],
    }))
    .sort((a, b) => b.totalPoints - a.totalPoints);
}

/** Full leaderboard with per-user draft breakdown (for detail pages) */
export async function getLeaderboard(leagueId?: string): Promise<LeaderboardEntry[]> {
  const supabase = createClient();
  let query = supabase.from("drafts").select(DRAFT_SELECT).eq("scored", true);
  if (leagueId) query = query.eq("league_id", leagueId);
  const { data, error } = await query;
  if (error) { console.error("getLeaderboard error:", error.message); return []; }
  if (!data) return [];

  const drafts = (data as unknown as DbDraft[]).map(mapDbDraft);
  const userMap = new Map<string, Draft[]>();

  drafts.forEach((draft) => {
    const existing = userMap.get(draft.userId) || [];
    existing.push(draft);
    userMap.set(draft.userId, existing);
  });

  const entries: LeaderboardEntry[] = [];
  userMap.forEach((userDrafts, userId) => {
    const totalPoints = userDrafts.reduce((sum, d) => sum + d.totalScore, 0);
    const showsPlayed = userDrafts.length;
    const bestShow =
      showsPlayed > 0
        ? Math.max(...userDrafts.map((d) => d.totalScore))
        : 0;
    const first = userDrafts[0];

    entries.push({
      userId,
      displayName: first.displayName,
      avatarUrl: first.avatarUrl,
      totalPoints,
      showsPlayed,
      avgPointsPerShow: showsPlayed > 0 ? Math.round(totalPoints / showsPlayed) : 0,
      bestShow,
      drafts: userDrafts,
    });
  });

  entries.sort((a, b) => b.totalPoints - a.totalPoints);
  return entries;
}

/** Draft counts by show from Postgres view */
export async function getDraftCountsByShowOptimized(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data, error } = await supabase.from("draft_counts_by_show").select("*");
  if (error) {
    console.error("getDraftCountsByShowOptimized error:", error.message);
    // Fallback to original function if view doesn't exist
    return getDraftCountsByShow();
  }
  if (!data) return {};
  const counts: Record<string, number> = {};
  (data as Array<{ show_id: string; draft_count: number }>).forEach((row) => {
    counts[row.show_id] = Number(row.draft_count);
  });
  return counts;
}
