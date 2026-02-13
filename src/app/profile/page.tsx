"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { getDrafts } from "@/lib/storage";
import { getMyLeagues } from "@/lib/leagues";
import { Draft, League } from "@/lib/types";
import { shows } from "@/data/shows";
import { formatDate, cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, profile, loading, signOut } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [mounted, setMounted] = useState(false);

  // Name editing
  const [editing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name);
  }, [profile?.display_name]);

  useEffect(() => {
    if (loading || !user) return;
    loadData();
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadData() {
    if (!user) return;
    const [draftsData, leaguesData] = await Promise.all([
      getDrafts(user.id),
      getMyLeagues(user.id),
    ]);
    setDrafts(draftsData);
    setLeagues(leaguesData);
    setMounted(true);
  }

  async function handleSaveName() {
    if (!user || !displayName.trim()) return;
    setNameSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setNameSaving(false);
    setNameSaved(true);
    setEditing(false);
    setTimeout(() => setNameSaved(false), 2000);
  }

  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">Not Signed In</h1>
        <p className="text-text-muted mb-6">Sign in to view your profile.</p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  const scoredDrafts = drafts.filter((d) => d.scored);
  const totalPoints = scoredDrafts.reduce((sum, d) => sum + d.totalScore, 0);
  const bestShow =
    scoredDrafts.length > 0
      ? Math.max(...scoredDrafts.map((d) => d.totalScore))
      : 0;

  const name = profile?.display_name || user.email?.split("@")[0] || "Player";

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={name}
            className="w-20 h-20 rounded-full border-2 border-ocean-blue/30"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-deep-sea to-ocean-blue flex items-center justify-center text-3xl font-black text-foreground">
            {name[0].toUpperCase()}
          </div>
        )}
        <div className="text-center sm:text-left">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setNameSaved(false);
                }}
                placeholder="Your display name"
                maxLength={40}
                autoFocus
                className="px-3 py-1.5 rounded-lg bg-surface-light border border-border text-foreground text-lg font-bold placeholder:text-text-muted focus:outline-none focus:border-ocean-blue"
              />
              <button
                onClick={handleSaveName}
                disabled={!displayName.trim() || nameSaving}
                className="px-3 py-1.5 rounded-lg bg-ocean-blue text-background text-sm font-bold hover:bg-ocean-blue-dark transition-colors disabled:opacity-50"
              >
                {nameSaving ? "..." : "Save"}
              </button>
              <button
                onClick={() => {
                  setEditing(false);
                  setDisplayName(profile?.display_name || "");
                }}
                className="px-3 py-1.5 rounded-lg border border-border text-text-muted text-sm font-medium hover:text-foreground hover:bg-surface-light transition-colors"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold">{name}</h1>
              <button
                onClick={() => setEditing(true)}
                className="p-1 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-light transition-colors"
                title="Edit display name"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                  <path d="m15 5 4 4" />
                </svg>
              </button>
              {nameSaved && (
                <span className="text-sm text-success font-medium">Saved!</span>
              )}
            </div>
          )}
          <p className="text-text-muted text-sm mt-1">{user.email}</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Total Drafts", value: drafts.length },
          { label: "Total Points", value: totalPoints, highlight: true },
          { label: "Shows Scored", value: scoredDrafts.length },
          { label: "Best Show", value: bestShow },
        ].map((stat) => (
          <div
            key={stat.label}
            className="bg-surface rounded-xl border border-border p-4 text-center"
          >
            <div
              className={cn(
                "text-2xl sm:text-3xl font-black",
                stat.highlight ? "text-ocean-blue" : "text-foreground"
              )}
            >
              {stat.value}
            </div>
            <div className="text-xs text-text-muted mt-1">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Leagues */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">My Leagues</h2>
          <Link
            href="/leagues"
            className="text-sm text-ocean-blue hover:underline"
          >
            View all
          </Link>
        </div>
        {leagues.length === 0 ? (
          <div className="bg-surface rounded-xl border border-border p-6 text-center">
            <p className="text-text-muted text-sm mb-3">
              You haven&apos;t joined any leagues yet.
            </p>
            <Link
              href="/leagues"
              className="text-ocean-blue text-sm font-medium hover:underline"
            >
              Create or join a league
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {leagues.map((league) => (
              <Link
                key={league.id}
                href={`/leagues/${league.id}`}
                className="bg-surface rounded-xl border border-border p-4 hover:bg-surface-light hover:border-deep-sea transition-all"
              >
                <div className="font-bold text-sm">{league.name}</div>
                <div className="text-xs text-text-muted mt-1">
                  {league.memberCount}{" "}
                  {league.memberCount === 1 ? "member" : "members"}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Drafts */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold">Recent Drafts</h2>
          <Link
            href="/draft"
            className="text-sm text-ocean-blue hover:underline"
          >
            New draft
          </Link>
        </div>
        {drafts.length === 0 ? (
          <div className="bg-surface rounded-xl border border-border p-6 text-center">
            <p className="text-text-muted text-sm mb-3">
              No drafts yet. Pick your songs!
            </p>
            <Link
              href="/draft"
              className="text-ocean-blue text-sm font-medium hover:underline"
            >
              Start drafting
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {drafts.slice(0, 10).map((draft) => {
              const show = shows.find((s) => s.id === draft.showId);
              return (
                <Link
                  key={draft.id}
                  href={`/draft/${draft.id}`}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 rounded-xl bg-surface border border-border hover:bg-surface-light hover:border-deep-sea transition-all gap-1 sm:gap-0"
                >
                  <div className="min-w-0">
                    <div className="font-medium text-sm">
                      {show
                        ? `${show.venue} - ${show.city}, ${show.state}`
                        : draft.showId}
                    </div>
                    <div className="text-xs text-text-muted">
                      {show ? formatDate(show.date) : ""} &middot;{" "}
                      {draft.songIds.length} songs
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    {draft.scored ? (
                      <span className="text-ocean-blue font-bold text-lg">
                        {draft.totalScore} pts
                      </span>
                    ) : (
                      <span className="text-xs text-text-dim px-2 py-1 rounded-full bg-surface-light">
                        Pending
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Sign Out */}
      <div className="text-center pt-4">
        <button
          onClick={signOut}
          className="text-text-muted text-sm hover:text-foreground transition-colors"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
}
