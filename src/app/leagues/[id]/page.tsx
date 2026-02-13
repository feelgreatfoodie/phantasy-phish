"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { LeaderboardDisplay } from "@/components/LeaderboardDisplay";
import {
  getLeagueById,
  getLeagueMembers,
  leaveLeague,
} from "@/lib/leagues";
import { getLeaderboard } from "@/lib/storage";
import { League, LeagueMember, LeaderboardEntry } from "@/lib/types";

export default function LeagueDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [league, setLeague] = useState<League | null>(null);
  const [members, setMembers] = useState<LeagueMember[]>([]);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [leaving, setLeaving] = useState(false);

  const leagueId = params.id as string;

  useEffect(() => {
    async function loadData() {
      const [leagueData, membersData, lbData] = await Promise.all([
        getLeagueById(leagueId),
        getLeagueMembers(leagueId),
        getLeaderboard(leagueId),
      ]);
      setLeague(leagueData);
      setMembers(membersData);
      setLeaderboard(lbData);
      setMounted(true);
    }
    loadData();
  }, [leagueId]);

  async function handleCopyInvite() {
    if (!league) return;
    await navigator.clipboard.writeText(league.inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleLeave() {
    if (!user || !league) return;
    setLeaving(true);
    const success = await leaveLeague(league.id, user.id);
    setLeaving(false);
    if (success) router.push("/leagues");
  }

  const currentMember = members.find((m) => m.userId === user?.id);
  const isOwner = currentMember?.role === "owner";

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!league) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">League Not Found</h1>
        <p className="text-text-muted mb-6">
          This league doesn&apos;t exist or has been removed.
        </p>
        <Link
          href="/leagues"
          className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
        >
          Back to Leagues
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/leagues"
          className="text-text-muted text-sm hover:text-foreground transition-colors"
        >
          &larr; All Leagues
        </Link>
        <h1 className="text-2xl sm:text-3xl font-bold mt-2">{league.name}</h1>
        {league.description && (
          <p className="text-text-muted mt-1">{league.description}</p>
        )}
      </div>

      {/* Invite Code & Actions */}
      <div className="bg-surface rounded-xl border border-border p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="text-xs text-text-muted mb-1">Invite Code</div>
          <div className="flex items-center gap-2">
            <span className="font-mono text-lg font-bold text-ocean-blue tracking-wider">
              {league.inviteCode}
            </span>
            <button
              onClick={handleCopyInvite}
              className="px-3 py-1 rounded-lg bg-surface-light border border-border text-xs font-medium hover:bg-surface-lighter transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/draft`}
            className="px-4 py-2 rounded-xl bg-ocean-blue text-background font-bold text-sm hover:bg-ocean-blue-dark transition-colors"
          >
            Draft for League
          </Link>
          {currentMember && !isOwner && (
            <button
              onClick={handleLeave}
              disabled={leaving}
              className="px-4 py-2 rounded-xl border border-danger/30 text-danger text-sm font-medium hover:bg-danger/10 transition-colors"
            >
              {leaving ? "Leaving..." : "Leave"}
            </button>
          )}
        </div>
      </div>

      {/* Members */}
      <div>
        <h2 className="text-xl font-bold mb-3">
          Members{" "}
          <span className="text-text-muted text-sm font-normal">
            ({members.length})
          </span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {members.map((member) => (
            <div
              key={member.userId}
              className="bg-surface rounded-xl border border-border p-3 sm:p-4 flex items-center gap-3"
            >
              {member.avatarUrl ? (
                <img
                  src={member.avatarUrl}
                  alt={member.displayName}
                  className="w-9 h-9 rounded-full shrink-0"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-deep-sea flex items-center justify-center text-sm font-bold text-foreground shrink-0">
                  {(member.displayName || "?")[0].toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="font-medium text-sm truncate">
                  {member.displayName}
                </div>
                {member.role === "owner" && (
                  <span className="text-[10px] text-sandy-gold font-medium">
                    Owner
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Leaderboard */}
      <div>
        <h2 className="text-xl font-bold mb-3">League Leaderboard</h2>
        {leaderboard.length === 0 ? (
          <div className="bg-surface rounded-xl border border-border p-8 text-center">
            <p className="text-text-muted">
              No scored drafts yet. Create drafts for completed shows to see
              rankings here.
            </p>
          </div>
        ) : (
          <LeaderboardDisplay entries={leaderboard} />
        )}
      </div>
    </div>
  );
}
