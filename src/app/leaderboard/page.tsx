"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeaderboard } from "@/lib/storage";
import { LeaderboardEntry } from "@/lib/types";
import { shows } from "@/data/shows";
import { formatDate, cn } from "@/lib/utils";

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function load() {
      const lb = await getLeaderboard();
      setLeaderboard(lb);
      setMounted(true);
    }
    load();
  }, []);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Leaderboard</h1>
        <p className="text-text-muted mt-1">
          Rankings across all shows and drafts
        </p>
      </div>

      {leaderboard.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <h2 className="text-xl font-bold mb-2">No Scores Yet</h2>
          <p className="text-text-muted mb-6">
            Create a draft for a completed show to see scores here.
          </p>
          <Link
            href="/draft"
            className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
          >
            Start Drafting
          </Link>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {leaderboard.length >= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {leaderboard.slice(0, 3).map((entry, i) => (
                <div
                  key={entry.userId}
                  className={cn(
                    "rounded-2xl border p-4 sm:p-6 text-center transition-all hover:scale-[1.02]",
                    i === 0
                      ? "bg-gradient-to-b from-ocean-blue/15 via-deep-sea/10 to-surface border-ocean-blue/30 shadow-lg shadow-ocean-blue/10 sm:order-2"
                      : i === 1
                      ? "bg-gradient-to-b from-coral-red/10 to-surface border-coral-red/20 sm:order-1"
                      : "bg-gradient-to-b from-deep-sea/10 to-surface border-deep-sea/20 sm:order-3"
                  )}
                >
                  <div
                    className={cn(
                      "text-4xl font-black mb-2",
                      i === 0
                        ? "text-ocean-blue neon-glow"
                        : i === 1
                        ? "text-coral-red neon-glow-coral"
                        : "text-deep-sea-light"
                    )}
                  >
                    #{i + 1}
                  </div>
                  <h3 className="text-xl font-bold">{entry.displayName}</h3>
                  <div className="text-2xl sm:text-3xl font-black text-ocean-blue mt-2">
                    {entry.totalPoints}
                  </div>
                  <div className="text-xs text-text-muted">total points</div>
                  <div className="flex justify-center gap-4 mt-3 text-sm">
                    <div>
                      <div className="font-bold">{entry.showsPlayed}</div>
                      <div className="text-text-muted text-xs">shows</div>
                    </div>
                    <div>
                      <div className="font-bold">{entry.avgPointsPerShow}</div>
                      <div className="text-text-muted text-xs">avg/show</div>
                    </div>
                    <div>
                      <div className="font-bold">{entry.bestShow}</div>
                      <div className="text-text-muted text-xs">best</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Full table */}
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-2 sm:p-4 text-text-muted text-xs sm:text-sm font-medium">
                      Rank
                    </th>
                    <th className="text-left p-2 sm:p-4 text-text-muted text-xs sm:text-sm font-medium">
                      Player
                    </th>
                    <th className="text-right p-2 sm:p-4 text-text-muted text-xs sm:text-sm font-medium">
                      Total Points
                    </th>
                    <th className="text-right p-2 sm:p-4 text-text-muted text-xs sm:text-sm font-medium hidden sm:table-cell">
                      Shows
                    </th>
                    <th className="text-right p-2 sm:p-4 text-text-muted text-xs sm:text-sm font-medium hidden sm:table-cell">
                      Avg/Show
                    </th>
                    <th className="text-right p-2 sm:p-4 text-text-muted text-xs sm:text-sm font-medium hidden sm:table-cell">
                      Best Show
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr
                      key={entry.userId}
                      className="border-b border-border/50 hover:bg-surface-light transition-colors"
                    >
                      <td className="p-2 sm:p-4">
                        <span
                          className={cn(
                            "font-bold text-sm",
                            i < 3 ? "text-sandy-gold" : "text-text-muted"
                          )}
                        >
                          #{i + 1}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4">
                        <span className="font-medium text-sm">{entry.displayName}</span>
                        <div className="text-[10px] sm:text-xs text-text-muted mt-0.5">
                          {entry.drafts.length} draft
                          {entry.drafts.length !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="p-2 sm:p-4 text-right">
                        <span className="text-ocean-blue font-bold text-base sm:text-lg">
                          {entry.totalPoints}
                        </span>
                      </td>
                      <td className="p-2 sm:p-4 text-right hidden sm:table-cell">
                        {entry.showsPlayed}
                      </td>
                      <td className="p-2 sm:p-4 text-right hidden sm:table-cell">
                        {entry.avgPointsPerShow}
                      </td>
                      <td className="p-2 sm:p-4 text-right hidden sm:table-cell">
                        {entry.bestShow}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Per-show breakdown */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold mb-4">Show Breakdown</h2>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.userId}
                  className="bg-surface rounded-xl border border-border p-3 sm:p-4"
                >
                  <h3 className="font-bold text-sm sm:text-base mb-3">{entry.displayName}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                    {entry.drafts
                      .filter((d) => d.scored)
                      .map((draft) => {
                        const show = shows.find(
                          (s) => s.id === draft.showId
                        );
                        return (
                          <Link
                            key={draft.id}
                            href={`/draft/${draft.id}`}
                            className="flex items-center justify-between p-2 sm:p-3 rounded-lg bg-surface-light hover:bg-surface-lighter transition-colors"
                          >
                            <div className="text-sm">
                              <div className="font-medium">
                                {show
                                  ? formatDate(show.date)
                                  : draft.showId}
                              </div>
                              <div className="text-xs text-text-muted">
                                {show?.venue}
                              </div>
                            </div>
                            <span className="text-ocean-blue font-bold">
                              {draft.totalScore}
                            </span>
                          </Link>
                        );
                      })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
