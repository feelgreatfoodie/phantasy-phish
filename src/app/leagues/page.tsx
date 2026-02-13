"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";
import {
  getMyLeagues,
  createLeague,
  getLeagueByInviteCode,
  joinLeague,
  isLeagueMember,
} from "@/lib/leagues";
import { League } from "@/lib/types";
import { cn } from "@/lib/utils";

export default function LeaguesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [leagues, setLeagues] = useState<League[]>([]);
  const [mounted, setMounted] = useState(false);

  // Create league form
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);

  // Join league form
  const [inviteCode, setInviteCode] = useState("");
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    loadLeagues();
  }, [user, loading]); // eslint-disable-line react-hooks/exhaustive-deps

  async function loadLeagues() {
    if (!user) return;
    const data = await getMyLeagues(user.id);
    setLeagues(data);
    setMounted(true);
  }

  async function handleCreate() {
    const trimmedName = newName.trim();
    if (!user || !trimmedName || trimmedName.length > 50) return;
    setCreating(true);
    const league = await createLeague({
      name: newName.trim(),
      description: newDesc.trim() || undefined,
      userId: user.id,
    });
    setCreating(false);
    if (league) {
      setNewName("");
      setNewDesc("");
      setShowCreate(false);
      router.push(`/leagues/${league.id}`);
    }
  }

  async function handleJoin() {
    if (!user || !inviteCode.trim()) return;
    setJoining(true);
    setJoinError("");

    const league = await getLeagueByInviteCode(inviteCode.trim());
    if (!league) {
      setJoinError("No league found with that invite code.");
      setJoining(false);
      return;
    }

    const alreadyMember = await isLeagueMember(league.id, user.id);
    if (alreadyMember) {
      setJoining(false);
      router.push(`/leagues/${league.id}`);
      return;
    }

    const success = await joinLeague(league.id, user.id);
    setJoining(false);
    if (success) {
      setInviteCode("");
      router.push(`/leagues/${league.id}`);
    } else {
      setJoinError("Failed to join league. Try again.");
    }
  }

  if (loading || !mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Leagues</h1>
          <p className="text-text-muted mt-1">
            Compete with friends across shows
          </p>
        </div>
        <button
          onClick={() => setShowCreate(!showCreate)}
          className="px-4 py-2 rounded-xl bg-ocean-blue text-background font-bold text-sm hover:bg-ocean-blue-dark transition-colors"
        >
          {showCreate ? "Cancel" : "Create League"}
        </button>
      </div>

      {/* Create League Form */}
      {showCreate && (
        <div className="bg-surface rounded-xl border border-ocean-blue/30 p-4 sm:p-6 slide-up">
          <h2 className="text-lg font-bold mb-4">Create a New League</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-muted mb-1">
                League Name
              </label>
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="e.g. Phish Phriends"
                maxLength={50}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-sm placeholder:text-text-muted focus:outline-none focus:border-ocean-blue"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-text-muted mb-1">
                Description (optional)
              </label>
              <textarea
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="What's your league about?"
                maxLength={200}
                rows={2}
                className="w-full px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-sm placeholder:text-text-muted focus:outline-none focus:border-ocean-blue resize-none"
              />
            </div>
            <button
              onClick={handleCreate}
              disabled={!newName.trim() || creating}
              className={cn(
                "w-full py-3 rounded-xl font-bold text-sm transition-colors",
                newName.trim()
                  ? "bg-ocean-blue text-background hover:bg-ocean-blue-dark"
                  : "bg-surface-light text-text-muted cursor-not-allowed"
              )}
            >
              {creating ? "Creating..." : "Create League"}
            </button>
          </div>
        </div>
      )}

      {/* Join League */}
      <div className="bg-surface rounded-xl border border-border p-4 sm:p-6">
        <h2 className="text-lg font-bold mb-3">Join a League</h2>
        <div className="flex gap-2">
          <input
            type="text"
            value={inviteCode}
            onChange={(e) => {
              setInviteCode(e.target.value);
              setJoinError("");
            }}
            placeholder="Enter invite code"
            className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-sm placeholder:text-text-muted focus:outline-none focus:border-ocean-blue"
          />
          <button
            onClick={handleJoin}
            disabled={!inviteCode.trim() || joining}
            className={cn(
              "px-4 sm:px-6 py-2 rounded-xl font-bold text-sm transition-colors shrink-0",
              inviteCode.trim()
                ? "bg-ocean-blue text-background hover:bg-ocean-blue-dark"
                : "bg-surface-light text-text-muted cursor-not-allowed"
            )}
          >
            {joining ? "Joining..." : "Join"}
          </button>
        </div>
        {joinError && (
          <p className="text-danger text-xs mt-2">{joinError}</p>
        )}
      </div>

      {/* My Leagues */}
      {leagues.length === 0 ? (
        <div className="bg-surface rounded-2xl border border-border p-12 text-center">
          <h2 className="text-xl font-bold mb-2">No Leagues Yet</h2>
          <p className="text-text-muted mb-6">
            Create a league or join one with an invite code to start competing
            with friends.
          </p>
        </div>
      ) : (
        <div>
          <h2 className="text-xl font-bold mb-4">My Leagues</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {leagues.map((league) => (
              <Link
                key={league.id}
                href={`/leagues/${league.id}`}
                className="bg-surface rounded-xl border border-border p-4 sm:p-5 hover:bg-surface-light hover:border-deep-sea hover:shadow-lg hover:shadow-ocean-blue/10 transition-all group"
              >
                <h3 className="font-bold text-base sm:text-lg group-hover:text-ocean-blue transition-colors">
                  {league.name}
                </h3>
                {league.description && (
                  <p className="text-text-muted text-sm mt-1 line-clamp-2">
                    {league.description}
                  </p>
                )}
                <div className="flex items-center gap-4 mt-3 text-xs text-text-muted">
                  <span>
                    {league.memberCount}{" "}
                    {league.memberCount === 1 ? "member" : "members"}
                  </span>
                  <span className="font-mono text-text-dim">
                    {league.inviteCode}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
