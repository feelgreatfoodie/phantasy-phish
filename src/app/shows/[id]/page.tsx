"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { getShowById } from "@/data/shows";
import { getSongById } from "@/data/songs";
import { getDraftsByShow, saveDraft } from "@/lib/storage";
import { scoreDraft } from "@/lib/scoring";
import { Draft } from "@/lib/types";
import { Show } from "@/data/shows";
import { formatDate, cn } from "@/lib/utils";

export default function ShowDetailPage() {
  const params = useParams();
  const showId = params.id as string;
  const [mounted, setMounted] = useState(false);
  const [drafts, setDrafts] = useState<Draft[]>([]);

  const show = getShowById(showId);

  useEffect(() => {
    setMounted(true);
    if (show) {
      let showDrafts = getDraftsByShow(showId);
      // Auto-score any unscored drafts if show is completed
      if (show.isCompleted) {
        showDrafts = showDrafts.map((draft) => {
          if (!draft.scored) {
            const scored = scoreDraft(draft, show);
            saveDraft(scored);
            return scored;
          }
          return draft;
        });
      }
      setDrafts(showDrafts);
    }
  }, [showId, show]);

  if (!show) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Show Not Found</h1>
        <Link
          href="/shows"
          className="text-ocean-blue hover:underline"
        >
          Back to Shows
        </Link>
      </div>
    );
  }

  const sortedDrafts = [...drafts].sort(
    (a, b) => b.totalScore - a.totalScore
  );

  return (
    <div className="space-y-8">
      {/* Show Header */}
      <div className="bg-surface rounded-2xl border border-border p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">{show.venue}</h1>
            <p className="text-text-muted">
              {show.city}, {show.state}
            </p>
            <p className="text-ocean-blue font-medium mt-1">
              {formatDate(show.date)}
            </p>
          </div>
          <div className="flex gap-2 sm:gap-3">
            <span
              className={cn(
                "px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold",
                show.isCompleted
                  ? "bg-success/20 text-success"
                  : "bg-coral-red/20 text-coral-red"
              )}
            >
              {show.isCompleted ? "Completed" : "Upcoming"}
            </span>
            <Link
              href="/draft"
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-xl bg-ocean-blue text-background font-bold text-xs sm:text-sm hover:bg-ocean-blue-dark transition-colors"
            >
              Draft for this show
            </Link>
          </div>
        </div>
      </div>

      {/* Setlist */}
      {show.isCompleted && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Setlist</h2>
          <SetlistDisplay show={show} />
        </div>
      )}

      {/* Drafts for this show */}
      {mounted && (
        <div>
          <h2 className="text-2xl font-bold mb-4">
            Drafts ({drafts.length})
          </h2>
          {drafts.length === 0 ? (
            <div className="bg-surface rounded-xl border border-border p-8 text-center">
              <p className="text-text-muted">
                No one has drafted for this show yet.
              </p>
              <Link
                href="/draft"
                className="inline-block mt-4 px-6 py-2 rounded-xl bg-ocean-blue text-background font-bold text-sm hover:bg-ocean-blue-dark transition-colors"
              >
                Be the first
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {sortedDrafts.map((draft, i) => (
                <Link
                  key={draft.id}
                  href={`/draft/${draft.id}`}
                  className="flex items-center justify-between p-3 sm:p-4 rounded-xl bg-surface border border-border hover:border-deep-sea-light transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    <span className="text-sandy-gold font-bold text-base sm:text-lg w-6 sm:w-8">
                      #{i + 1}
                    </span>
                    <div>
                      <span className="font-bold">{draft.playerName}</span>
                      <span className="text-text-muted text-sm ml-2">
                        {draft.songIds.length} songs
                      </span>
                    </div>
                  </div>
                  {draft.scored ? (
                    <div className="text-right">
                      <div className="text-2xl font-black text-ocean-blue">
                        {draft.totalScore}
                      </div>
                      <div className="text-xs text-text-muted">
                        {draft.songScores.filter((s) => s.played).length} hits
                      </div>
                    </div>
                  ) : (
                    <span className="text-sm text-text-muted">Pending</span>
                  )}
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function SetlistDisplay({ show }: { show: Show }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
      <SetSection title="Set 1" entries={show.set1} />
      <SetSection title="Set 2" entries={show.set2} />
      <SetSection title="Encore" entries={show.encore} />
    </div>
  );
}

function SetSection({
  title,
  entries,
}: {
  title: string;
  entries: { songId: string; isOpener: boolean; isCloser: boolean }[];
}) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4">
      <h3 className="font-bold text-sandy-gold mb-3">{title}</h3>
      <div className="space-y-1.5">
        {entries.map((entry, i) => {
          const song = getSongById(entry.songId);
          return (
            <div
              key={entry.songId}
              className="flex items-center gap-3 p-2 rounded-lg bg-surface-light"
            >
              <span className="text-xs text-text-muted w-5">{i + 1}.</span>
              <span className="font-medium text-sm flex-1">
                {song?.name || entry.songId}
              </span>
              <div className="flex gap-1">
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
                {song?.isCover && (
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-coral-red/20 text-coral-red">
                    Cover
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
