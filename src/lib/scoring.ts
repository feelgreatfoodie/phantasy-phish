import { Show, SetlistEntry } from "@/data/shows";
import { songs, getSongById } from "@/data/songs";
import { Draft, SongScore } from "./types";

const POINTS = {
  PLAYED_SET1: 10,
  PLAYED_SET2: 10,
  PLAYED_ENCORE: 15,
  OPENER_BONUS: 20,
  CLOSER_BONUS: 15,
  BUST_OUT_BONUS: 25,
  COVER_BONUS: 20,
};

function findSongInSetlist(
  songId: string,
  show: Show
): { set: "set1" | "set2" | "encore"; entry: SetlistEntry } | null {
  for (const entry of show.set1) {
    if (entry.songId === songId) return { set: "set1", entry };
  }
  for (const entry of show.set2) {
    if (entry.songId === songId) return { set: "set2", entry };
  }
  for (const entry of show.encore) {
    if (entry.songId === songId) return { set: "encore", entry };
  }
  return null;
}

export function scoreDraft(draft: Draft, show: Show): Draft {
  const songScores: SongScore[] = draft.songIds.map((songId) => {
    const song = getSongById(songId);
    const found = findSongInSetlist(songId, show);
    const breakdown: string[] = [];
    let points = 0;

    if (!found || !song) {
      return {
        songId,
        played: false,
        set: null,
        isOpener: false,
        isCloser: false,
        isBustOut: false,
        isCover: false,
        points: 0,
        breakdown: ["Not played"],
      };
    }

    // Base points for being played
    if (found.set === "set1") {
      points += POINTS.PLAYED_SET1;
      breakdown.push(`Set 1: +${POINTS.PLAYED_SET1}`);
    } else if (found.set === "set2") {
      points += POINTS.PLAYED_SET2;
      breakdown.push(`Set 2: +${POINTS.PLAYED_SET2}`);
    } else if (found.set === "encore") {
      points += POINTS.PLAYED_ENCORE;
      breakdown.push(`Encore: +${POINTS.PLAYED_ENCORE}`);
    }

    // Opener bonus
    if (found.entry.isOpener) {
      points += POINTS.OPENER_BONUS;
      breakdown.push(`Opener: +${POINTS.OPENER_BONUS}`);
    }

    // Closer bonus
    if (found.entry.isCloser) {
      points += POINTS.CLOSER_BONUS;
      breakdown.push(`Closer: +${POINTS.CLOSER_BONUS}`);
    }

    // Bust-out bonus (avgGap >= 50 as proxy)
    const isBustOut = song.avgGap >= 50;
    if (isBustOut) {
      points += POINTS.BUST_OUT_BONUS;
      breakdown.push(`Bust-out: +${POINTS.BUST_OUT_BONUS}`);
    }

    // Cover bonus
    if (song.isCover) {
      points += POINTS.COVER_BONUS;
      breakdown.push(`Cover: +${POINTS.COVER_BONUS}`);
    }

    return {
      songId,
      played: true,
      set: found.set,
      isOpener: found.entry.isOpener,
      isCloser: found.entry.isCloser,
      isBustOut,
      isCover: song.isCover,
      points,
      breakdown,
    };
  });

  const totalScore = songScores.reduce((sum, s) => sum + s.points, 0);

  return {
    ...draft,
    scored: true,
    totalScore,
    songScores,
  };
}

export function getPointsBreakdown() {
  return POINTS;
}

// Get all songs from all sets of a show as a flat list with their set info
export function getAllSetlistSongs(show: Show): Array<{
  songId: string;
  set: string;
  isOpener: boolean;
  isCloser: boolean;
}> {
  const result: Array<{
    songId: string;
    set: string;
    isOpener: boolean;
    isCloser: boolean;
  }> = [];

  show.set1.forEach((e) =>
    result.push({ songId: e.songId, set: "Set 1", isOpener: e.isOpener, isCloser: e.isCloser })
  );
  show.set2.forEach((e) =>
    result.push({ songId: e.songId, set: "Set 2", isOpener: e.isOpener, isCloser: e.isCloser })
  );
  show.encore.forEach((e) =>
    result.push({ songId: e.songId, set: "Encore", isOpener: e.isOpener, isCloser: e.isCloser })
  );

  return result;
}

export { songs };
