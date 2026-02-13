import { createClient } from "@/lib/supabase/client";
import { League, LeagueMember } from "./types";
import { sanitizeAvatarUrl } from "./utils";

interface DbLeague {
  id: string;
  name: string;
  description: string | null;
  invite_code: string;
  created_by: string;
  created_at: string;
}

interface DbLeagueMember {
  league_id: string;
  user_id: string;
  role: "owner" | "member";
  joined_at: string;
  profiles: { display_name: string; avatar_url: string | null };
}

function mapDbLeague(row: DbLeague, memberCount?: number): League {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    inviteCode: row.invite_code,
    createdBy: row.created_by,
    createdAt: row.created_at,
    memberCount,
  };
}

function mapDbMember(row: DbLeagueMember): LeagueMember {
  return {
    leagueId: row.league_id,
    userId: row.user_id,
    role: row.role,
    joinedAt: row.joined_at,
    displayName: row.profiles?.display_name || "Unknown",
    avatarUrl: sanitizeAvatarUrl(row.profiles?.avatar_url),
  };
}

export async function createLeague(data: {
  name: string;
  description?: string;
  userId: string;
}): Promise<League | null> {
  if (!data.name.trim() || data.name.trim().length > 50) return null;
  if (data.description && data.description.trim().length > 200) return null;
  const supabase = createClient();
  const { data: row, error } = await supabase
    .from("leagues")
    .insert({
      name: data.name,
      description: data.description || null,
      created_by: data.userId,
    })
    .select("*")
    .single();
  if (error) { console.error("createLeague error:", error.message); return null; }
  if (!row) return null;

  // Add creator as owner member
  const { error: memberError } = await supabase.from("league_members").insert({
    league_id: row.id,
    user_id: data.userId,
    role: "owner",
  });
  if (memberError) console.error("createLeague member error:", memberError.message);

  return mapDbLeague(row as DbLeague, 1);
}

export async function getMyLeagues(userId: string): Promise<League[]> {
  const supabase = createClient();

  // Single query: get leagues the user belongs to with league details
  const { data, error } = await supabase
    .from("league_members")
    .select("league_id, leagues(id, name, description, invite_code, created_by, created_at)")
    .eq("user_id", userId);

  if (error) { console.error("getMyLeagues error:", error.message); return []; }
  if (!data || data.length === 0) return [];

  const leagueIds = data.map((m) => m.league_id);

  // Get member counts in one query
  const { data: memberCounts } = await supabase
    .from("league_members")
    .select("league_id")
    .in("league_id", leagueIds);

  const counts: Record<string, number> = {};
  (memberCounts || []).forEach((m) => {
    counts[m.league_id] = (counts[m.league_id] || 0) + 1;
  });

  return data
    .map((row) => {
      const league = row.leagues as unknown as DbLeague;
      if (!league) return null;
      return mapDbLeague(league, counts[league.id] || 0);
    })
    .filter((l): l is League => l !== null)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function getLeagueById(id: string): Promise<League | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("id", id)
    .single();
  if (error) { console.error("getLeagueById error:", error.message); return null; }
  if (!data) return null;

  const { count } = await supabase
    .from("league_members")
    .select("*", { count: "exact", head: true })
    .eq("league_id", id);

  return mapDbLeague(data as DbLeague, count || 0);
}

export async function getLeagueByInviteCode(
  code: string
): Promise<League | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("leagues")
    .select("*")
    .eq("invite_code", code)
    .single();
  if (error) { console.error("getLeagueByInviteCode error:", error.message); return null; }
  if (!data) return null;

  const { count } = await supabase
    .from("league_members")
    .select("*", { count: "exact", head: true })
    .eq("league_id", data.id);

  return mapDbLeague(data as DbLeague, count || 0);
}

export async function getLeagueMembers(
  leagueId: string
): Promise<LeagueMember[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from("league_members")
    .select("*, profiles(display_name, avatar_url)")
    .eq("league_id", leagueId)
    .order("joined_at", { ascending: true });
  if (error) { console.error("getLeagueMembers error:", error.message); return []; }
  if (!data) return [];
  return (data as unknown as DbLeagueMember[]).map(mapDbMember);
}

export async function joinLeague(
  leagueId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase.from("league_members").insert({
    league_id: leagueId,
    user_id: userId,
    role: "member",
  });
  return !error;
}

export async function isLeagueMember(
  leagueId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();
  const { data } = await supabase
    .from("league_members")
    .select("user_id")
    .eq("league_id", leagueId)
    .eq("user_id", userId)
    .single();
  return !!data;
}

export async function leaveLeague(
  leagueId: string,
  userId: string
): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from("league_members")
    .delete()
    .eq("league_id", leagueId)
    .eq("user_id", userId);
  return !error;
}
