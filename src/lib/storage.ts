import { createClient } from "@/lib/supabase/client";
import { Draft, LeaderboardEntry, SongScore } from "./types";

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
    avatarUrl: row.profiles?.avatar_url || null,
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

export async function getDrafts(userId?: string): Promise<Draft[]> {
  const supabase = createClient();
  let query = supabase
    .from("drafts")
    .select(DRAFT_SELECT)
    .order("created_at", { ascending: false });
  if (userId) query = query.eq("user_id", userId);
  const { data, error } = await query;
  if (error || !data) return [];
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
  if (error || !row) return null;
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
  await supabase.from("drafts").update(dbUpdates).eq("id", id);
}

export async function getDraftById(id: string): Promise<Draft | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drafts")
    .select(DRAFT_SELECT)
    .eq("id", id)
    .single();
  if (error || !data) return null;
  return mapDbDraft(data as unknown as DbDraft);
}

export async function getDraftsByShow(
  showId: string,
  leagueId?: string
): Promise<Draft[]> {
  const supabase = createClient();
  let query = supabase
    .from("drafts")
    .select(DRAFT_SELECT)
    .eq("show_id", showId);
  if (leagueId) query = query.eq("league_id", leagueId);
  const { data, error } = await query;
  if (error || !data) return [];
  return (data as unknown as DbDraft[]).map(mapDbDraft);
}

export async function getDraftCountsByShow(): Promise<Record<string, number>> {
  const supabase = createClient();
  const { data, error } = await supabase.from("drafts").select("show_id");
  if (error || !data) return {};
  const counts: Record<string, number> = {};
  (data as { show_id: string }[]).forEach((row) => {
    counts[row.show_id] = (counts[row.show_id] || 0) + 1;
  });
  return counts;
}

export async function deleteDraft(id: string): Promise<void> {
  const supabase = createClient();
  await supabase.from("drafts").delete().eq("id", id);
}

export async function getDraftByShareCode(code: string): Promise<Draft | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("drafts")
    .select(DRAFT_SELECT)
    .eq("share_code", code)
    .single();
  if (error || !data) return null;
  return mapDbDraft(data as unknown as DbDraft);
}

export async function getLeaderboard(leagueId?: string): Promise<LeaderboardEntry[]> {
  const supabase = createClient();
  let query = supabase.from("drafts").select(DRAFT_SELECT);
  if (leagueId) query = query.eq("league_id", leagueId);
  const { data, error } = await query;
  if (error || !data) return [];

  const drafts = (data as unknown as DbDraft[]).map(mapDbDraft);
  const userMap = new Map<string, Draft[]>();

  drafts.forEach((draft) => {
    const existing = userMap.get(draft.userId) || [];
    existing.push(draft);
    userMap.set(draft.userId, existing);
  });

  const entries: LeaderboardEntry[] = [];
  userMap.forEach((userDrafts, userId) => {
    const scoredDrafts = userDrafts.filter((d) => d.scored);
    const totalPoints = scoredDrafts.reduce((sum, d) => sum + d.totalScore, 0);
    const showsPlayed = scoredDrafts.length;
    const bestShow =
      scoredDrafts.length > 0
        ? Math.max(...scoredDrafts.map((d) => d.totalScore))
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
