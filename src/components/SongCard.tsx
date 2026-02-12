"use client";

import { Song } from "@/data/songs";
import { cn } from "@/lib/utils";

interface SongCardProps {
  song: Song;
  selected?: boolean;
  disabled?: boolean;
  showStats?: boolean;
  onClick?: () => void;
  scoreInfo?: {
    points: number;
    breakdown: string[];
    played: boolean;
  };
}

export function SongCard({
  song,
  selected = false,
  disabled = false,
  showStats = true,
  onClick,
  scoreInfo,
}: SongCardProps) {
  const isBustOutCandidate = song.avgGap >= 50;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled && !selected}
      className={cn(
        "song-card w-full text-left p-3 rounded-xl border transition-all",
        selected
          ? "border-ocean-blue bg-ocean-blue/10 shadow-lg shadow-ocean-blue/10"
          : "border-border bg-surface-light hover:border-deep-sea-light",
        disabled && !selected && "opacity-40 cursor-not-allowed",
        !disabled && "cursor-pointer",
        scoreInfo?.played && "border-success bg-success/10",
        scoreInfo && !scoreInfo.played && "border-danger/30 bg-danger/5 opacity-60"
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3
              className={cn(
                "font-semibold text-sm truncate",
                selected && "text-ocean-blue",
                scoreInfo?.played && "text-success"
              )}
            >
              {song.name}
            </h3>
          </div>
          <div className="flex flex-wrap gap-1.5 mt-1.5">
            {song.isCover && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral-red/20 text-coral-red">
                Cover
              </span>
            )}
            {isBustOutCandidate && (
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-deep-sea text-ocean-blue">
                Bust-out
              </span>
            )}
            {song.isCover && song.originalArtist && (
              <span className="text-[10px] text-text-muted">
                {song.originalArtist}
              </span>
            )}
          </div>
        </div>
        {scoreInfo ? (
          <div className="text-right">
            <span
              className={cn(
                "text-lg font-bold score-reveal",
                scoreInfo.points > 0 ? "text-ocean-blue" : "text-text-muted"
              )}
            >
              {scoreInfo.points}
            </span>
            <div className="text-[10px] text-text-muted">pts</div>
          </div>
        ) : (
          selected && (
            <div className="w-6 h-6 rounded-full bg-ocean-blue flex items-center justify-center flex-shrink-0">
              <svg
                className="w-4 h-4 text-background"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )
        )}
      </div>
      {showStats && !scoreInfo && (
        <div className="flex gap-3 mt-2 text-[11px] text-text-muted">
          <span>Played: {song.timesPlayed}x</span>
          <span>Gap: {song.avgGap}</span>
          <span>Since {song.debut}</span>
        </div>
      )}
      {scoreInfo && scoreInfo.breakdown.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {scoreInfo.breakdown.map((item, i) => (
            <span
              key={i}
              className={cn(
                "text-[10px] px-1.5 py-0.5 rounded",
                item === "Not played"
                  ? "bg-danger/10 text-danger"
                  : "bg-ocean-blue/10 text-ocean-blue"
              )}
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </button>
  );
}
