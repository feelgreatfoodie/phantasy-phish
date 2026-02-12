export interface Draft {
  id: string;
  playerName: string;
  showId: string;
  songIds: string[];
  createdAt: string;
  scored: boolean;
  totalScore: number;
  songScores: SongScore[];
}

export interface SongScore {
  songId: string;
  played: boolean;
  set: "set1" | "set2" | "encore" | null;
  isOpener: boolean;
  isCloser: boolean;
  isBustOut: boolean;
  isCover: boolean;
  points: number;
  breakdown: string[];
}

export interface LeaderboardEntry {
  playerName: string;
  totalPoints: number;
  showsPlayed: number;
  avgPointsPerShow: number;
  bestShow: number;
  drafts: Draft[];
}
