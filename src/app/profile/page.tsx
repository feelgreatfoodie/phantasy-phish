"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { getDrafts } from "@/lib/storage";
import { getMyLeagues } from "@/lib/leagues";
import { Draft, League } from "@/lib/types";
import { shows } from "@/data/shows";
import { formatDate, cn } from "@/lib/utils";

export default function ProfilePage() {
  const { user, profile, loading } = useAuth();
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [leagues, setLeagues] = useState<League[]>([]);
  const [mounted, setMounted] = useState(false);

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

  const displayName = profile?.display_name || user.email?.split("@")[0] || "Player";

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-surface rounded-2xl border border-border p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-5">
        {profile?.avatar_url ? (
          <img
            src={profile.avatar_url}
            alt={displayName}
            className="w-20 h-20 rounded-full border-2 border-ocean-blue/30"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-deep-sea to-ocean-blue flex items-center justify-center text-3xl font-black text-foreground">
            {displayName[0].toUpperCase()}
          </div>
        )}
        <div className="text-center sm:text-left">
          <h1 className="text-2xl sm:text-3xl font-bold">{displayName}</h1>
          <p className="text-text-muted text-sm mt-1">{user.email}</p>
          <Link
            href="/settings"
            className="mt-3 inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg border border-border text-text-muted text-xs hover:text-foreground hover:bg-surface-light transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            Settings
          </Link>
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
    </div>
  );
}
