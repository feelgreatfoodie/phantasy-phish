export interface SetlistEntry {
  songId: string;
  position: number;
  isOpener: boolean;
  isCloser: boolean;
}

export interface Show {
  id: string;
  date: string;
  venue: string;
  city: string;
  state: string;
  set1: SetlistEntry[];
  set2: SetlistEntry[];
  encore: SetlistEntry[];
  showNumber: number; // for bust-out calculations
  isCompleted: boolean;
}

export const shows: Show[] = [
  {
    id: "2024-12-28",
    date: "2024-12-28",
    venue: "Madison Square Garden",
    city: "New York",
    state: "NY",
    showNumber: 1,
    isCompleted: true,
    set1: [
      { songId: "buried-alive", position: 1, isOpener: true, isCloser: false },
      { songId: "ac-dc-bag", position: 2, isOpener: false, isCloser: false },
      { songId: "46-days", position: 3, isOpener: false, isCloser: false },
      { songId: "sample-in-a-jar", position: 4, isOpener: false, isCloser: false },
      { songId: "stash", position: 5, isOpener: false, isCloser: false },
      { songId: "limb-by-limb", position: 6, isOpener: false, isCloser: false },
      { songId: "bouncing-around-the-room", position: 7, isOpener: false, isCloser: false },
      { songId: "bathtub-gin", position: 8, isOpener: false, isCloser: true },
    ],
    set2: [
      { songId: "crosseyed-and-painless", position: 1, isOpener: true, isCloser: false },
      { songId: "steam", position: 2, isOpener: false, isCloser: false },
      { songId: "no-men-in-no-mans-land", position: 3, isOpener: false, isCloser: false },
      { songId: "dirt", position: 4, isOpener: false, isCloser: false },
      { songId: "guyute", position: 5, isOpener: false, isCloser: false },
      { songId: "the-sloth", position: 6, isOpener: false, isCloser: false },
      { songId: "heavy-things", position: 7, isOpener: false, isCloser: false },
      { songId: "slave-to-the-traffic-light", position: 8, isOpener: false, isCloser: true },
    ],
    encore: [
      { songId: "evolve", position: 1, isOpener: true, isCloser: false },
      { songId: "character-zero", position: 2, isOpener: false, isCloser: true },
    ],
  },
  {
    id: "2024-12-29",
    date: "2024-12-29",
    venue: "Madison Square Garden",
    city: "New York",
    state: "NY",
    showNumber: 2,
    isCompleted: true,
    set1: [
      { songId: "divided-sky", position: 1, isOpener: true, isCloser: false },
      { songId: "fee", position: 2, isOpener: false, isCloser: false },
      { songId: "maze", position: 3, isOpener: false, isCloser: false },
      { songId: "sand", position: 4, isOpener: false, isCloser: false },
      { songId: "the-wedge", position: 5, isOpener: false, isCloser: false },
      { songId: "rift", position: 6, isOpener: false, isCloser: false },
      { songId: "taste", position: 7, isOpener: false, isCloser: false },
      { songId: "golgi-apparatus", position: 8, isOpener: false, isCloser: true },
    ],
    set2: [
      { songId: "down-with-disease", position: 1, isOpener: true, isCloser: false },
      { songId: "cities", position: 2, isOpener: false, isCloser: false },
      { songId: "fuego", position: 3, isOpener: false, isCloser: false },
      { songId: "reba", position: 4, isOpener: false, isCloser: false },
      { songId: "thread", position: 5, isOpener: false, isCloser: false },
      { songId: "bug", position: 6, isOpener: false, isCloser: false },
      { songId: "oblivion", position: 7, isOpener: false, isCloser: false },
      { songId: "cavern", position: 8, isOpener: false, isCloser: true },
    ],
    encore: [
      { songId: "stealing-time", position: 1, isOpener: true, isCloser: false },
      { songId: "mound", position: 2, isOpener: false, isCloser: true },
    ],
  },
  {
    id: "2024-12-30",
    date: "2024-12-30",
    venue: "Madison Square Garden",
    city: "New York",
    state: "NY",
    showNumber: 3,
    isCompleted: true,
    set1: [
      { songId: "fluffhead", position: 1, isOpener: true, isCloser: false },
      { songId: "horn", position: 2, isOpener: false, isCloser: false },
      { songId: "poor-heart", position: 3, isOpener: false, isCloser: false },
      { songId: "suzy-greenberg", position: 4, isOpener: false, isCloser: false },
      { songId: "theme-from-the-bottom", position: 5, isOpener: false, isCloser: false },
      { songId: "ya-mar", position: 6, isOpener: false, isCloser: false },
      { songId: "free", position: 7, isOpener: false, isCloser: false },
      { songId: "possum", position: 8, isOpener: false, isCloser: true },
    ],
    set2: [
      { songId: "twists", position: 1, isOpener: true, isCloser: false },
      { songId: "simple", position: 2, isOpener: false, isCloser: false },
      { songId: "mercury", position: 3, isOpener: false, isCloser: false },
      { songId: "carini", position: 4, isOpener: false, isCloser: false },
      { songId: "blaze-on", position: 5, isOpener: false, isCloser: false },
      { songId: "my-friend-my-friend", position: 6, isOpener: false, isCloser: false },
      { songId: "tube", position: 7, isOpener: false, isCloser: false },
      { songId: "run-like-an-antelope", position: 8, isOpener: false, isCloser: true },
    ],
    encore: [
      { songId: "silent-in-the-morning", position: 1, isOpener: true, isCloser: false },
      { songId: "loving-cup", position: 2, isOpener: false, isCloser: true },
    ],
  },
  {
    id: "2024-12-31",
    date: "2024-12-31",
    venue: "Madison Square Garden",
    city: "New York",
    state: "NY",
    showNumber: 4,
    isCompleted: true,
    set1: [
      { songId: "chalk-dust-torture", position: 1, isOpener: true, isCloser: false },
      { songId: "sparkle", position: 2, isOpener: false, isCloser: false },
      { songId: "mikes-song", position: 3, isOpener: false, isCloser: false },
      { songId: "weekapaug-groove", position: 4, isOpener: false, isCloser: false },
      { songId: "julius", position: 5, isOpener: false, isCloser: false },
      { songId: "first-tube", position: 6, isOpener: false, isCloser: false },
      { songId: "punch-you-in-the-eye", position: 7, isOpener: false, isCloser: false },
      { songId: "llama", position: 8, isOpener: false, isCloser: true },
    ],
    set2: [
      { songId: "also-sprach-zarathustra", position: 1, isOpener: true, isCloser: false },
      { songId: "ghost", position: 2, isOpener: false, isCloser: false },
      { songId: "piper", position: 3, isOpener: false, isCloser: false },
      { songId: "light", position: 4, isOpener: false, isCloser: false },
      { songId: "wolfmans-brother", position: 5, isOpener: false, isCloser: false },
      { songId: "harry-hood", position: 6, isOpener: false, isCloser: false },
      { songId: "david-bowie", position: 7, isOpener: false, isCloser: false },
      { songId: "tweezer", position: 8, isOpener: false, isCloser: true },
    ],
    encore: [
      { songId: "harpua", position: 1, isOpener: true, isCloser: false },
      { songId: "tweezer-reprise", position: 2, isOpener: false, isCloser: true },
    ],
  },
  {
    id: "2025-07-15",
    date: "2025-07-15",
    venue: "The Gorge Amphitheatre",
    city: "George",
    state: "WA",
    showNumber: 5,
    isCompleted: false,
    set1: [],
    set2: [],
    encore: [],
  },
];

export function getShowById(id: string): Show | undefined {
  return shows.find((s) => s.id === id);
}

export function getUpcomingShows(): Show[] {
  return shows.filter((s) => !s.isCompleted);
}

export function getCompletedShows(): Show[] {
  return shows.filter((s) => s.isCompleted);
}
