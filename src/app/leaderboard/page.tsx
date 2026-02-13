"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getLeaderboard } from "@/lib/storage";
import { LeaderboardEntry } from "@/lib/types";
import { LeaderboardDisplay } from "@/components/LeaderboardDisplay";

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
        <LeaderboardDisplay entries={leaderboard} showDraftCount />
      )}
    </div>
  );
}
