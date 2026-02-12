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
    setMounted(true);
    setLeaderboard(getLeaderboard());
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
        <h1 className="text-3xl font-bold">Leaderboard</h1>
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
            className="px-6 py-3 rounded-xl bg-electric-teal text-background font-bold hover:bg-electric-teal-dark transition-colors"
          >
            Start Drafting
          </Link>
        </div>
      ) : (
        <>
          {/* Top 3 podium */}
          {leaderboard.length >= 1 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {leaderboard.slice(0, 3).map((entry, i) => (
                <div
                  key={entry.playerName}
                  className={cn(
                    "rounded-2xl border p-6 text-center",
                    i === 0
                      ? "bg-gradient-to-b from-electric-teal/20 to-surface border-electric-teal/30 sm:order-2"
                      : i === 1
                      ? "bg-surface border-border sm:order-1"
                      : "bg-surface border-border sm:order-3"
                  )}
                >
                  <div
                    className={cn(
                      "text-4xl font-black mb-2",
                      i === 0
                        ? "text-electric-teal"
                        : i === 1
                        ? "text-warm-orange"
                        : "text-deep-purple-light"
                    )}
                  >
                    #{i + 1}
                  </div>
                  <h3 className="text-xl font-bold">{entry.playerName}</h3>
                  <div className="text-3xl font-black text-electric-teal mt-2">
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
                    <th className="text-left p-4 text-text-muted text-sm font-medium">
                      Rank
                    </th>
                    <th className="text-left p-4 text-text-muted text-sm font-medium">
                      Player
                    </th>
                    <th className="text-right p-4 text-text-muted text-sm font-medium">
                      Total Points
                    </th>
                    <th className="text-right p-4 text-text-muted text-sm font-medium hidden sm:table-cell">
                      Shows
                    </th>
                    <th className="text-right p-4 text-text-muted text-sm font-medium hidden sm:table-cell">
                      Avg/Show
                    </th>
                    <th className="text-right p-4 text-text-muted text-sm font-medium hidden sm:table-cell">
                      Best Show
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, i) => (
                    <tr
                      key={entry.playerName}
                      className="border-b border-border/50 hover:bg-surface-light transition-colors"
                    >
                      <td className="p-4">
                        <span
                          className={cn(
                            "font-bold",
                            i < 3 ? "text-warm-orange" : "text-text-muted"
                          )}
                        >
                          #{i + 1}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{entry.playerName}</span>
                        <div className="text-xs text-text-muted mt-0.5">
                          {entry.drafts.length} draft
                          {entry.drafts.length !== 1 ? "s" : ""}
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className="text-electric-teal font-bold text-lg">
                          {entry.totalPoints}
                        </span>
                      </td>
                      <td className="p-4 text-right hidden sm:table-cell">
                        {entry.showsPlayed}
                      </td>
                      <td className="p-4 text-right hidden sm:table-cell">
                        {entry.avgPointsPerShow}
                      </td>
                      <td className="p-4 text-right hidden sm:table-cell">
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
            <h2 className="text-2xl font-bold mb-4">Show Breakdown</h2>
            <div className="space-y-3">
              {leaderboard.map((entry) => (
                <div
                  key={entry.playerName}
                  className="bg-surface rounded-xl border border-border p-4"
                >
                  <h3 className="font-bold mb-3">{entry.playerName}</h3>
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
                            className="flex items-center justify-between p-3 rounded-lg bg-surface-light hover:bg-surface-lighter transition-colors"
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
                            <span className="text-electric-teal font-bold">
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
