"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDraftByShareCode } from "@/lib/storage";
import { Draft } from "@/lib/types";
import { getSongById } from "@/data/songs";
import { getShowById } from "@/data/shows";
import { scoreDraft } from "@/lib/scoring";
import { updateDraft } from "@/lib/storage";
import { SongCard } from "@/components/SongCard";
import { formatDate, cn } from "@/lib/utils";

export default function SharedDraftPage() {
  const params = useParams();
  const code = params.code as string;
  const [draft, setDraft] = useState<Draft | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    async function load() {
      const d = await getDraftByShareCode(code);
      if (d) {
        const show = getShowById(d.showId);
        if (show && show.isCompleted && !d.scored) {
          const scored = scoreDraft(d, show);
          await updateDraft(d.id, {
            scored: scored.scored,
            totalScore: scored.totalScore,
            songScores: scored.songScores,
          });
          setDraft(scored);
        } else {
          setDraft(d);
        }
      }
      setMounted(true);
    }
    load();
  }, [code]);

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!draft) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Draft Not Found</h1>
        <p className="text-text-muted mb-6">
          This shared draft link may be invalid or expired.
        </p>
        <Link
          href="/"
          className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
        >
          Go Home
        </Link>
      </div>
    );
  }

  const show = getShowById(draft.showId);
  const playedCount = draft.songScores.filter((s) => s.played).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="text-xs text-text-muted uppercase tracking-wide mb-1">
          Shared Draft
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold">
          {draft.displayName}&apos;s Draft
        </h1>
        {show && (
          <p className="text-text-muted mt-1">
            {show.venue} - {formatDate(show.date)}
          </p>
        )}
      </div>

      {/* Score summary */}
      {draft.scored && (
        <div className="bg-gradient-to-b from-deep-sea/15 to-surface rounded-2xl border border-deep-sea/30 p-4 sm:p-6 text-center">
          <div className="text-4xl sm:text-5xl font-black text-ocean-blue neon-glow score-reveal">
            {draft.totalScore}
          </div>
          <div className="text-text-muted mt-1">Total Points</div>
          <div className="wave-divider my-4" />
          <div className="flex justify-center gap-4 sm:gap-6">
            <div>
              <div className="text-xl sm:text-2xl font-bold text-seafoam">
                {playedCount}
              </div>
              <div className="text-xs text-text-muted">Songs Hit</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-coral-red">
                {draft.songIds.length - playedCount}
              </div>
              <div className="text-xs text-text-muted">Missed</div>
            </div>
            <div>
              <div className="text-xl sm:text-2xl font-bold text-sandy-gold">
                {Math.round(
                  (playedCount / draft.songIds.length) * 100
                )}
                %
              </div>
              <div className="text-xs text-text-muted">Hit Rate</div>
            </div>
          </div>
        </div>
      )}

      {!draft.scored && show && !show.isCompleted && (
        <div className="bg-gradient-to-b from-coral-red/10 to-surface rounded-2xl border border-coral-red/20 p-6 text-center">
          <div className="text-xl font-bold text-coral-red breathe">
            Awaiting Results
          </div>
          <p className="text-text-muted mt-2">
            This draft will be scored automatically once the show setlist
            is entered.
          </p>
        </div>
      )}

      {/* Song list */}
      <div>
        <h2 className="text-xl font-bold mb-4">
          {draft.scored ? "Results" : "Selected Songs"}
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {draft.songIds.map((songId) => {
            const song = getSongById(songId);
            if (!song) return null;
            const scoreInfo = draft.scored
              ? draft.songScores.find((s) => s.songId === songId)
              : undefined;
            return (
              <SongCard
                key={songId}
                song={song}
                selected={!draft.scored}
                showStats={!draft.scored}
                scoreInfo={
                  scoreInfo
                    ? {
                        points: scoreInfo.points,
                        breakdown: scoreInfo.breakdown,
                        played: scoreInfo.played,
                      }
                    : undefined
                }
              />
            );
          })}
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          href="/draft"
          className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
        >
          Create Your Own Draft
        </Link>
      </div>
    </div>
  );
}
