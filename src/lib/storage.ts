"use client";

import { Draft, LeaderboardEntry } from "./types";

const DRAFTS_KEY = "phantasy-phish-drafts";

export function getDrafts(): Draft[] {
  if (typeof window === "undefined") return [];
  const raw = localStorage.getItem(DRAFTS_KEY);
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export function saveDraft(draft: Draft): void {
  const drafts = getDrafts();
  const existing = drafts.findIndex((d) => d.id === draft.id);
  if (existing >= 0) {
    drafts[existing] = draft;
  } else {
    drafts.push(draft);
  }
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function getDraftById(id: string): Draft | null {
  const drafts = getDrafts();
  return drafts.find((d) => d.id === id) || null;
}

export function getDraftsByShow(showId: string): Draft[] {
  const drafts = getDrafts();
  return drafts.filter((d) => d.showId === showId);
}

export function deleteDraft(id: string): void {
  const drafts = getDrafts().filter((d) => d.id !== id);
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
}

export function getLeaderboard(): LeaderboardEntry[] {
  const drafts = getDrafts();
  const playerMap = new Map<string, Draft[]>();

  drafts.forEach((draft) => {
    const existing = playerMap.get(draft.playerName) || [];
    existing.push(draft);
    playerMap.set(draft.playerName, existing);
  });

  const entries: LeaderboardEntry[] = [];
  playerMap.forEach((playerDrafts, playerName) => {
    const scoredDrafts = playerDrafts.filter((d) => d.scored);
    const totalPoints = scoredDrafts.reduce((sum, d) => sum + d.totalScore, 0);
    const showsPlayed = scoredDrafts.length;
    const bestShow =
      scoredDrafts.length > 0
        ? Math.max(...scoredDrafts.map((d) => d.totalScore))
        : 0;

    entries.push({
      playerName,
      totalPoints,
      showsPlayed,
      avgPointsPerShow: showsPlayed > 0 ? Math.round(totalPoints / showsPlayed) : 0,
      bestShow,
      drafts: playerDrafts,
    });
  });

  entries.sort((a, b) => b.totalPoints - a.totalPoints);
  return entries;
}

export function generateDraftId(): string {
  return `draft-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
}

export function encodeDraftForShare(draft: Draft): string {
  const data = {
    p: draft.playerName,
    s: draft.showId,
    songs: draft.songIds,
  };
  return btoa(JSON.stringify(data));
}

export function decodeDraftFromShare(
  encoded: string
): { playerName: string; showId: string; songIds: string[] } | null {
  try {
    const data = JSON.parse(atob(encoded));
    return {
      playerName: data.p,
      showId: data.s,
      songIds: data.songs,
    };
  } catch {
    return null;
  }
}
