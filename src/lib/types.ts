export interface Draft {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  showId: string;
  songIds: string[];
  createdAt: string;
  scored: boolean;
  totalScore: number;
  songScores: SongScore[];
  leagueId?: string | null;
  shareCode?: string;
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
  userId: string;
  displayName: string;
  avatarUrl?: string | null;
  totalPoints: number;
  showsPlayed: number;
  avgPointsPerShow: number;
  bestShow: number;
  drafts: Draft[];
}

export interface League {
  id: string;
  name: string;
  description: string | null;
  inviteCode: string;
  createdBy: string;
  createdAt: string;
  memberCount?: number;
}

export interface LeagueMember {
  leagueId: string;
  userId: string;
  role: "owner" | "member";
  joinedAt: string;
  displayName?: string;
  avatarUrl?: string | null;
}
