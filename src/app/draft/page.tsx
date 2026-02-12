"use client";

import { useState, useMemo, useEffect } from "react";
import { useRouter } from "next/navigation";
import { songs, Song } from "@/data/songs";
import { shows, getUpcomingShows, getCompletedShows } from "@/data/shows";
import { SongCard } from "@/components/SongCard";
import { saveDraft, generateDraftId, getDrafts } from "@/lib/storage";
import { Draft } from "@/lib/types";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/utils";
import Link from "next/link";

const DRAFT_SIZE = 15;

type SortOption = "name" | "timesPlayed" | "avgGap" | "debut";
type FilterOption = "all" | "originals" | "covers" | "bustouts";

export default function DraftPage() {
  const router = useRouter();
  const [selectedSongs, setSelectedSongs] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [letterFilter, setLetterFilter] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOption>("name");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [playerName, setPlayerName] = useState("");
  const [selectedShow, setSelectedShow] = useState("");
  const [showSaved, setShowSaved] = useState(false);
  const [existingDrafts, setExistingDrafts] = useState<Draft[]>([]);

  useEffect(() => {
    setExistingDrafts(getDrafts());
  }, []);

  const allShows = [...getUpcomingShows(), ...getCompletedShows()];

  const filteredSongs = useMemo(() => {
    let result = [...songs];

    // Text search
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          (s.originalArtist && s.originalArtist.toLowerCase().includes(q))
      );
    }

    // Letter filter
    if (letterFilter) {
      result = result.filter(
        (s) => s.name.charAt(0).toUpperCase() === letterFilter
      );
    }

    // Category filter
    switch (filter) {
      case "covers":
        result = result.filter((s) => s.isCover);
        break;
      case "originals":
        result = result.filter((s) => !s.isCover);
        break;
      case "bustouts":
        result = result.filter((s) => s.avgGap >= 50);
        break;
    }

    // Sort
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
    }

    return result;
  }, [search, letterFilter, sort, filter]);

  const toggleSong = (songId: string) => {
    setSelectedSongs((prev) => {
      if (prev.includes(songId)) {
        return prev.filter((id) => id !== songId);
      }
      if (prev.length >= DRAFT_SIZE) return prev;
      return [...prev, songId];
    });
  };

  const handleSaveDraft = () => {
    if (!playerName.trim() || !selectedShow || selectedSongs.length === 0)
      return;

    const draft: Draft = {
      id: generateDraftId(),
      playerName: playerName.trim(),
      showId: selectedShow,
      songIds: selectedSongs,
      createdAt: new Date().toISOString(),
      scored: false,
      totalScore: 0,
      songScores: [],
    };

    saveDraft(draft);
    setShowSaved(true);
    setTimeout(() => {
      router.push(`/draft/${draft.id}`);
    }, 1000);
  };

  const letters = useMemo(() => {
    const set = new Set(songs.map((s) => s.name.charAt(0).toUpperCase()));
    return Array.from(set).sort();
  }, []);

  const selectedSongObjects = selectedSongs
    .map((id) => songs.find((s) => s.id === id))
    .filter(Boolean) as Song[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Draft Your Setlist</h1>
          <p className="text-text-muted mt-1">
            Pick {DRAFT_SIZE} songs you think will be played
          </p>
        </div>
      </div>

      {/* Player name and show selection */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Your Name
          </label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-electric-teal"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-text-muted mb-1">
            Show
          </label>
          <select
            value={selectedShow}
            onChange={(e) => setSelectedShow(e.target.value)}
            className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-border text-foreground focus:outline-none focus:border-electric-teal"
          >
            <option value="">Select a show</option>
            {allShows.map((show) => (
              <option key={show.id} value={show.id}>
                {formatDate(show.date)} - {show.venue}, {show.city}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Selected songs panel */}
      <div className="bg-surface rounded-xl border border-border p-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-bold text-lg">
            Your Draft{" "}
            <span
              className={cn(
                "text-sm font-normal",
                selectedSongs.length === DRAFT_SIZE
                  ? "text-success"
                  : "text-text-muted"
              )}
            >
              ({selectedSongs.length}/{DRAFT_SIZE})
            </span>
          </h2>
          {selectedSongs.length > 0 && (
            <button
              onClick={() => setSelectedSongs([])}
              className="text-xs text-danger hover:text-danger/80"
            >
              Clear all
            </button>
          )}
        </div>
        {selectedSongs.length === 0 ? (
          <p className="text-text-muted text-sm py-4 text-center">
            Select songs from the catalog below to build your draft
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {selectedSongObjects.map((song) => (
              <button
                key={song.id}
                onClick={() => toggleSong(song.id)}
                className="group flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-electric-teal/10 border border-electric-teal/30 text-electric-teal text-sm hover:bg-danger/10 hover:border-danger/30 hover:text-danger transition-colors"
              >
                <span>{song.name}</span>
                <svg
                  className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            ))}
          </div>
        )}
        {selectedSongs.length > 0 && playerName.trim() && selectedShow && (
          <div className="mt-4 pt-4 border-t border-border">
            <button
              onClick={handleSaveDraft}
              disabled={showSaved}
              className={cn(
                "w-full py-3 rounded-xl font-bold text-lg transition-colors",
                showSaved
                  ? "bg-success text-background"
                  : "bg-electric-teal text-background hover:bg-electric-teal-dark"
              )}
            >
              {showSaved ? "Draft Saved!" : `Save Draft (${selectedSongs.length} songs)`}
            </button>
          </div>
        )}
      </div>

      {/* Existing Drafts */}
      {existingDrafts.length > 0 && (
        <div className="bg-surface-light rounded-xl border border-border p-4">
          <h3 className="font-bold mb-2">Your Existing Drafts</h3>
          <div className="space-y-2">
            {existingDrafts.map((draft) => {
              const show = shows.find((s) => s.id === draft.showId);
              return (
                <Link
                  key={draft.id}
                  href={`/draft/${draft.id}`}
                  className="flex items-center justify-between p-3 rounded-lg bg-surface hover:bg-surface-lighter transition-colors"
                >
                  <div>
                    <span className="font-medium">{draft.playerName}</span>
                    <span className="text-text-muted text-sm ml-2">
                      {show ? `${formatDate(show.date)} - ${show.venue}` : draft.showId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-text-muted">
                      {draft.songIds.length} songs
                    </span>
                    {draft.scored && (
                      <span className="text-electric-teal font-bold">
                        {draft.totalScore} pts
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Search and Filters */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setLetterFilter(null);
              }}
              placeholder="Search songs..."
              className="w-full px-4 py-2.5 rounded-xl bg-surface-light border border-border text-foreground placeholder:text-text-muted focus:outline-none focus:border-electric-teal"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="px-3 py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-sm focus:outline-none focus:border-electric-teal"
            >
              <option value="name">Sort: A-Z</option>
              <option value="timesPlayed">Sort: Most Played</option>
              <option value="avgGap">Sort: Biggest Gap</option>
              <option value="debut">Sort: Debut Year</option>
            </select>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as FilterOption)}
              className="px-3 py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-sm focus:outline-none focus:border-electric-teal"
            >
              <option value="all">All Songs</option>
              <option value="originals">Originals</option>
              <option value="covers">Covers</option>
              <option value="bustouts">Bust-outs</option>
            </select>
          </div>
        </div>

        {/* Letter filter */}
        <div className="flex flex-wrap gap-1">
          <button
            onClick={() => setLetterFilter(null)}
            className={cn(
              "w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors",
              letterFilter === null
                ? "bg-electric-teal text-background"
                : "bg-surface-light text-text-muted hover:text-foreground"
            )}
          >
            All
          </button>
          {letters.map((letter) => (
            <button
              key={letter}
              onClick={() =>
                setLetterFilter(letterFilter === letter ? null : letter)
              }
              className={cn(
                "w-8 h-8 rounded-lg text-xs font-bold flex items-center justify-center transition-colors",
                letterFilter === letter
                  ? "bg-electric-teal text-background"
                  : "bg-surface-light text-text-muted hover:text-foreground"
              )}
            >
              {letter}
            </button>
          ))}
        </div>
      </div>

      {/* Song catalog grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filteredSongs.map((song) => (
          <SongCard
            key={song.id}
            song={song}
            selected={selectedSongs.includes(song.id)}
            disabled={
              selectedSongs.length >= DRAFT_SIZE &&
              !selectedSongs.includes(song.id)
            }
            onClick={() => toggleSong(song.id)}
          />
        ))}
      </div>

      {filteredSongs.length === 0 && (
        <div className="text-center py-12 text-text-muted">
          <p className="text-lg">No songs match your search.</p>
          <button
            onClick={() => {
              setSearch("");
              setLetterFilter(null);
              setFilter("all");
            }}
            className="mt-2 text-electric-teal hover:underline"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
