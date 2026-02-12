"use client";

import Link from "next/link";
import { shows, getUpcomingShows, getCompletedShows } from "@/data/shows";
import { songs } from "@/data/songs";
import { getDrafts, getLeaderboard } from "@/lib/storage";
import { ShowCard } from "@/components/ShowCard";
import { useEffect, useState } from "react";
import { Draft } from "@/lib/types";

export default function HomePage() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setDrafts(getDrafts());
    setMounted(true);
  }, []);

  const upcoming = getUpcomingShows();
  const completed = getCompletedShows();
  const leaderboard = mounted ? getLeaderboard() : [];

  return (
    <div className="space-y-10">
      {/* Hero Section */}
      <section className="text-center py-16 relative overflow-hidden">
        <div className="fishman-pattern absolute inset-0 opacity-40" />
        <div className="absolute inset-0 bg-gradient-to-b from-deep-sea/10 via-transparent to-coral-red/5" />
        <div className="relative">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black ocean-text">
            Phantasy Phish
          </h1>
          <p className="mt-3 sm:mt-4 text-base sm:text-lg text-text-muted max-w-xl mx-auto px-2">
            Draft your setlist predictions, score points from real shows, and
            prove you know Phish better than anyone.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/draft"
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-ocean-blue to-seafoam text-background font-bold text-lg hover:shadow-lg hover:shadow-ocean-blue/25 transition-all hover:scale-105"
            >
              Start Drafting
            </Link>
            <Link
              href="/shows"
              className="px-8 py-3 rounded-xl border-2 border-deep-sea text-foreground font-bold text-lg hover:bg-deep-sea/30 hover:border-coral-red hover:shadow-lg hover:shadow-coral-red/15 transition-all"
            >
              View Shows
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Stats */}
      <section className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
        <StatBox label="Songs in Catalog" value={songs.length} color="teal" />
        <StatBox label="Shows Tracked" value={shows.length} color="orange" />
        <StatBox
          label="Your Drafts"
          value={mounted ? drafts.length : 0}
          color="purple"
        />
        <StatBox
          label="Top Score"
          value={
            mounted && leaderboard.length > 0
              ? leaderboard[0].bestShow
              : 0
          }
          color="teal"
        />
      </section>

      {/* How Scoring Works */}
      <section className="bg-surface rounded-2xl p-4 sm:p-6 border border-deep-sea/30">
        <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">How Scoring Works</h2>
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
          <ScoreRule label="Song in Set 1 or 2" points={10} />
          <ScoreRule label="Song in Encore" points={15} />
          <ScoreRule label="Opener Bonus" points={20} />
          <ScoreRule label="Closer Bonus" points={15} />
          <ScoreRule label="Bust-out (50+ shows)" points={25} />
          <ScoreRule label="Cover Predicted" points={20} />
        </div>
      </section>

      {/* Upcoming Shows */}
      {upcoming.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Upcoming Shows</h2>
            <Link
              href="/shows"
              className="text-ocean-blue text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((show) => (
              <ShowCard key={show.id} show={show} />
            ))}
          </div>
        </section>
      )}

      {/* Recent Shows */}
      {completed.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Recent Shows</h2>
            <Link
              href="/shows"
              className="text-ocean-blue text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completed.slice(0, 4).map((show) => (
              <ShowCard
                key={show.id}
                show={show}
                draftCount={
                  mounted
                    ? drafts.filter((d) => d.showId === show.id).length
                    : 0
                }
              />
            ))}
          </div>
        </section>
      )}

      {/* Leaderboard Preview */}
      {mounted && leaderboard.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold">Leaderboard</h2>
            <Link
              href="/leaderboard"
              className="text-ocean-blue text-sm font-medium hover:underline"
            >
              Full standings
            </Link>
          </div>
          <div className="bg-surface rounded-xl border border-border overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 text-text-muted text-sm font-medium">
                    Rank
                  </th>
                  <th className="text-left p-3 text-text-muted text-sm font-medium">
                    Player
                  </th>
                  <th className="text-right p-3 text-text-muted text-sm font-medium">
                    Points
                  </th>
                </tr>
              </thead>
              <tbody>
                {leaderboard.slice(0, 5).map((entry, i) => (
                  <tr key={entry.playerName} className="border-b border-border/50">
                    <td className="p-3">
                      <span className="text-sandy-gold font-bold">
                        #{i + 1}
                      </span>
                    </td>
                    <td className="p-3 font-medium">{entry.playerName}</td>
                    <td className="p-3 text-right text-ocean-blue font-bold">
                      {entry.totalPoints}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

function StatBox({
  label,
  value,
  color,
}: {
  label: string;
  value: number;
  color: "teal" | "orange" | "purple";
}) {
  const colorMap = {
    teal: "text-ocean-blue neon-glow",
    orange: "text-coral-red neon-glow-coral",
    purple: "text-deep-sea-light",
  };
  const borderMap = {
    teal: "border-ocean-blue/20 hover:border-ocean-blue/40",
    orange: "border-coral-red/20 hover:border-coral-red/40",
    purple: "border-deep-sea/30 hover:border-deep-sea/50",
  };
  return (
    <div className={`bg-surface rounded-xl p-3 sm:p-4 border ${borderMap[color]} text-center transition-colors`}>
      <div className={`text-2xl sm:text-3xl font-black ${colorMap[color]}`}>{value}</div>
      <div className="text-xs sm:text-sm text-text-muted mt-1">{label}</div>
    </div>
  );
}

function ScoreRule({ label, points }: { label: string; points: number }) {
  return (
    <div className="flex items-center justify-between p-2 sm:p-3 bg-surface-light rounded-lg border border-border/50 hover:border-deep-sea/40 transition-colors">
      <span className="text-xs sm:text-sm">{label}</span>
      <span className="text-ocean-blue font-bold text-xs sm:text-sm neon-glow">+{points}</span>
    </div>
  );
}
