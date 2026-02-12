"use client";

import { useState, useMemo } from "react";
import { songs, Song } from "@/data/songs";
import { cn } from "@/lib/utils";

type SortOption = "name" | "timesPlayed" | "avgGap" | "debut" | "lastPlayed";

export default function SongsPage() {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortOption>("name");
  const [showCovers, setShowCovers] = useState<"all" | "covers" | "originals">(
    "all"
  );

  const filteredSongs = useMemo(() => {
    let result = [...songs];

    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.originalArtist && s.originalArtist.toLowerCase().includes(q))
      );
    }

    if (showCovers === "covers") {
      result = result.filter((s) => s.isCover);
    } else if (showCovers === "originals") {
      result = result.filter((s) => !s.isCover);
    }

    switch (sort) {
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "timesPlayed":
        result.sort((a, b) => b.timesPlayed - a.timesPlayed);
        break;
      case "avgGap":
        result.sort((a, b) => b.avgGap - a.avgGap);
        break;
      case "debut":
        result.sort((a, b) => a.debut.localeCompare(b.debut));
        break;
      case "lastPlayed":
        result.sort((a, b) => b.lastPlayed.localeCompare(a.lastPlayed));
        break;
    }

    return result;
  }, [search, sort, showCovers]);

  const coverCount = songs.filter((s) => s.isCover).length;
  const bustOutCount = songs.filter((s) => s.avgGap >= 50).length;
  const avgTimesPlayed = Math.round(
    songs.reduce((sum, s) => sum + s.timesPlayed, 0) / songs.length
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Song Catalog</h1>
        <p className="text-text-muted mt-1">
          {songs.length} songs in the Phish catalog
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
        <div className="bg-surface rounded-xl p-3 border border-ocean-blue/20 text-center">
          <div className="text-2xl font-bold text-ocean-blue neon-glow">
            {songs.length}
          </div>
          <div className="text-xs text-text-muted">Total Songs</div>
        </div>
        <div className="bg-surface rounded-xl p-3 border border-coral-red/20 text-center">
          <div className="text-2xl font-bold text-coral-red neon-glow-coral">
            {coverCount}
          </div>
          <div className="text-xs text-text-muted">Covers</div>
        </div>
        <div className="bg-surface rounded-xl p-3 border border-deep-sea/30 text-center">
          <div className="text-2xl font-bold text-deep-sea-light">
            {bustOutCount}
          </div>
          <div className="text-xs text-text-muted">Bust-outs</div>
        </div>
        <div className="bg-surface rounded-xl p-3 border border-sandy-gold/20 text-center">
          <div className="text-2xl font-bold text-sandy-gold">
            {avgTimesPlayed}
          </div>
          <div className="text-xs text-text-muted">Avg Times Played</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search songs or artists..."
          className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-sm placeholder:text-text-muted focus:outline-none focus:border-ocean-blue"
        />
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortOption)}
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:border-ocean-blue"
          >
            <option value="name">A-Z</option>
            <option value="timesPlayed">Most Played</option>
            <option value="avgGap">Biggest Gap</option>
            <option value="debut">Debut Year</option>
            <option value="lastPlayed">Recently Played</option>
          </select>
          <select
            value={showCovers}
            onChange={(e) =>
              setShowCovers(e.target.value as "all" | "covers" | "originals")
            }
            className="flex-1 sm:flex-initial px-2 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-xs sm:text-sm focus:outline-none focus:border-ocean-blue"
          >
            <option value="all">All</option>
            <option value="originals">Originals</option>
            <option value="covers">Covers</option>
          </select>
        </div>
      </div>

      {/* Songs table */}
      <div className="bg-surface rounded-xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 sm:p-3 text-text-muted text-xs sm:text-sm font-medium">
                  Song
                </th>
                <th className="text-center p-2 sm:p-3 text-text-muted text-xs sm:text-sm font-medium hidden sm:table-cell">
                  Debut
                </th>
                <th className="text-center p-2 sm:p-3 text-text-muted text-xs sm:text-sm font-medium">
                  Played
                </th>
                <th className="text-center p-2 sm:p-3 text-text-muted text-xs sm:text-sm font-medium">
                  Gap
                </th>
                <th className="text-center p-2 sm:p-3 text-text-muted text-xs sm:text-sm font-medium hidden sm:table-cell">
                  Last Played
                </th>
                <th className="text-center p-2 sm:p-3 text-text-muted text-xs sm:text-sm font-medium">
                  Tags
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredSongs.map((song) => (
                <SongRow key={song.id} song={song} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-8 text-text-muted">
          No songs match your search.
        </div>
      )}
    </div>
  );
}

function SongRow({ song }: { song: Song }) {
  const isBustOut = song.avgGap >= 50;

  return (
    <tr className="border-b border-border/50 hover:bg-surface-light transition-colors">
      <td className="p-2 sm:p-3">
        <div className="font-medium text-xs sm:text-sm">{song.name}</div>
        {song.isCover && song.originalArtist && (
          <div className="text-[10px] sm:text-xs text-text-muted">by {song.originalArtist}</div>
        )}
      </td>
      <td className="p-2 sm:p-3 text-center text-xs sm:text-sm text-text-muted hidden sm:table-cell">
        {song.debut}
      </td>
      <td className="p-2 sm:p-3 text-center">
        <span className="text-xs sm:text-sm font-medium">{song.timesPlayed}</span>
      </td>
      <td className="p-2 sm:p-3 text-center">
        <span
          className={cn(
            "text-xs sm:text-sm font-medium",
            isBustOut ? "text-coral-red" : "text-text-muted"
          )}
        >
          {song.avgGap}
        </span>
      </td>
      <td className="p-2 sm:p-3 text-center text-xs sm:text-sm text-text-muted hidden sm:table-cell">
        {song.lastPlayed}
      </td>
      <td className="p-2 sm:p-3 text-center">
        <div className="flex flex-wrap gap-1 justify-center">
          {song.isCover && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-coral-red/20 text-coral-red">
              Cover
            </span>
          )}
          {isBustOut && (
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-deep-sea text-ocean-blue">
              Bust-out
            </span>
          )}
        </div>
      </td>
    </tr>
  );
}
