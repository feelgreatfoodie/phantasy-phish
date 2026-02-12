"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getDraftById, saveDraft, encodeDraftForShare } from "@/lib/storage";
import { Draft, SongScore } from "@/lib/types";
import { songs, getSongById } from "@/data/songs";
import { shows, getShowById } from "@/data/shows";
import { scoreDraft } from "@/lib/scoring";
import { SongCard } from "@/components/SongCard";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

export default function DraftDetailPage() {
  const params = useParams();
  const draftId = params.id as string;
  const [draft, setDraft] = useState<Draft | null>(null);
  const [mounted, setMounted] = useState(false);
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setMounted(true);
    const d = getDraftById(draftId);
    if (d) {
      const show = getShowById(d.showId);
      // Auto-score if show is completed and not yet scored
      if (show && show.isCompleted && !d.scored) {
        const scored = scoreDraft(d, show);
        saveDraft(scored);
        setDraft(scored);
      } else {
        setDraft(d);
      }
    }
  }, [draftId]);

  const handleShare = () => {
    if (!draft) return;
    const encoded = encodeDraftForShare(draft);
    const url = `${window.location.origin}/draft?share=${encoded}`;
    setShareUrl(url);
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

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
          This draft may have been deleted or doesn&apos;t exist.
        </p>
        <Link
          href="/draft"
          className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
        >
          Create New Draft
        </Link>
      </div>
    );
  }

  const show = getShowById(draft.showId);
  const playedCount = draft.songScores.filter((s) => s.played).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{draft.playerName}&apos;s Draft</h1>
          {show && (
            <p className="text-text-muted mt-1">
              {show.venue} - {formatDate(show.date)}
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            onClick={handleShare}
            className="px-4 py-2 rounded-xl border border-border text-sm font-medium hover:bg-surface-light transition-colors"
          >
            {copied ? "Copied!" : "Share Draft"}
          </button>
          <Link
            href="/draft"
            className="px-4 py-2 rounded-xl bg-deep-sea text-foreground text-sm font-medium hover:bg-deep-sea-light transition-colors"
          >
            New Draft
          </Link>
        </div>
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
              <div className="text-xl sm:text-2xl font-bold text-seafoam">{playedCount}</div>
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
            This draft will be scored automatically once the show setlist is entered.
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

      {/* Show setlist comparison */}
      {draft.scored && show && show.isCompleted && (
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Actual Setlist</h2>

          <SetlistSection
            title="Set 1"
            entries={show.set1}
            draftSongs={draft.songIds}
          />
          <SetlistSection
            title="Set 2"
            entries={show.set2}
            draftSongs={draft.songIds}
          />
          <SetlistSection
            title="Encore"
            entries={show.encore}
            draftSongs={draft.songIds}
          />
        </div>
      )}

      {shareUrl && (
        <div className="bg-surface-light rounded-xl p-4 border border-border">
          <p className="text-sm text-text-muted mb-2">Share this draft:</p>
          <code className="text-xs text-ocean-blue break-all">{shareUrl}</code>
        </div>
      )}
    </div>
  );
}

function SetlistSection({
  title,
  entries,
  draftSongs,
}: {
  title: string;
  entries: { songId: string; isOpener: boolean; isCloser: boolean }[];
  draftSongs: string[];
}) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h3 className="font-bold text-sandy-gold mb-3">{title}</h3>
      <div className="space-y-1.5">
        {entries.map((entry, i) => {
          const song = getSongById(entry.songId);
          const wasDrafted = draftSongs.includes(entry.songId);
          return (
            <div
              key={entry.songId}
              className={cn(
                "flex items-center justify-between p-2 rounded-lg",
                wasDrafted ? "bg-success/10" : "bg-surface-light"
              )}
            >
              <div className="flex items-center gap-3">
                <span className="text-xs text-text-muted w-5">{i + 1}.</span>
                <span
                  className={cn(
                    "font-medium text-sm",
                    wasDrafted && "text-success"
                  )}
                >
                  {song?.name || entry.songId}
                </span>
                {entry.isOpener && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-coral-red/20 text-coral-red">
                    Opener
                  </span>
                )}
                {entry.isCloser && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-deep-sea text-ocean-blue">
                    Closer
                  </span>
                )}
              </div>
              {wasDrafted && (
                <span className="text-xs text-success font-medium">
                  DRAFTED
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
