"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/components/AuthProvider";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

const GITHUB_REPO = "https://github.com/feelgreatfoodie/phantasy-phish";

const scoringRules = [
  { event: "Song played in Set 1", points: "10" },
  { event: "Song played in Set 2", points: "10" },
  { event: "Song played in Encore", points: "15" },
  { event: "Opener (first song of set)", points: "+20 bonus" },
  { event: "Closer (last song of set)", points: "+15 bonus" },
  { event: "Bust-out (50+ show gap)", points: "+25 bonus" },
  { event: "Cover song", points: "+20 bonus" },
];

export default function SettingsPage() {
  const { user, profile, loading, signOut } = useAuth();

  // Edit name
  const [displayName, setDisplayName] = useState("");
  const [nameSaving, setNameSaving] = useState(false);
  const [nameSaved, setNameSaved] = useState(false);

  // Sync displayName when profile loads asynchronously
  useEffect(() => {
    if (profile?.display_name) setDisplayName(profile.display_name);
  }, [profile?.display_name]);

  // Expandable sections
  const [showHelp, setShowHelp] = useState(false);
  const [showScoring, setShowScoring] = useState(false);

  // Delete account
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleSaveName() {
    if (!user || !displayName.trim()) return;
    setNameSaving(true);
    const supabase = createClient();
    await supabase
      .from("profiles")
      .update({ display_name: displayName.trim(), updated_at: new Date().toISOString() })
      .eq("id", user.id);
    setNameSaving(false);
    setNameSaved(true);
    setTimeout(() => setNameSaved(false), 2000);
  }

  async function handleDeleteAccount() {
    if (!user) return;
    setDeleting(true);
    const supabase = createClient();

    // Delete user's drafts
    await supabase.from("drafts").delete().eq("user_id", user.id);

    // Remove from all leagues
    await supabase.from("league_members").delete().eq("user_id", user.id);

    // Sign out — auth state change will redirect via AuthProvider
    await signOut();
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-text-muted">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-2">Not Signed In</h1>
        <p className="text-text-muted mb-6">Sign in to access settings.</p>
        <Link
          href="/login"
          className="px-6 py-3 rounded-xl bg-ocean-blue text-background font-bold hover:bg-ocean-blue-dark transition-colors"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Settings</h1>
        <p className="text-text-muted mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile Section */}
      <section className="bg-surface rounded-xl border border-border p-4 sm:p-6">
        <h2 className="text-lg font-bold mb-4">Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-muted mb-1">
              Display Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={displayName}
                onChange={(e) => {
                  setDisplayName(e.target.value);
                  setNameSaved(false);
                }}
                placeholder="Your display name"
                maxLength={40}
                className="flex-1 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-surface-light border border-border text-foreground text-sm placeholder:text-text-muted focus:outline-none focus:border-ocean-blue"
              />
              <button
                onClick={handleSaveName}
                disabled={!displayName.trim() || nameSaving || nameSaved}
                className={cn(
                  "px-4 py-2 rounded-xl font-bold text-sm transition-colors shrink-0",
                  nameSaved
                    ? "bg-success text-background"
                    : displayName.trim()
                    ? "bg-ocean-blue text-background hover:bg-ocean-blue-dark"
                    : "bg-surface-light text-text-muted cursor-not-allowed"
                )}
              >
                {nameSaved ? "Saved!" : nameSaving ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-xs sm:text-sm font-medium text-text-muted mb-1">
              Email
            </label>
            <div className="px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-surface-light border border-border text-text-muted text-sm">
              {user.email}
            </div>
          </div>
        </div>
      </section>

      {/* Help & Info Section */}
      <section className="bg-surface rounded-xl border border-border overflow-hidden">
        <h2 className="text-lg font-bold p-4 sm:p-6 pb-0 sm:pb-0">Help &amp; Info</h2>

        {/* How to Play */}
        <div className="border-b border-border">
          <button
            onClick={() => setShowHelp(!showHelp)}
            className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-light transition-colors"
          >
            <span>How to Play</span>
            <svg
              className={cn("w-4 h-4 transition-transform", showHelp && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showHelp && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-sm text-text-muted space-y-3 slide-up">
              <div>
                <h3 className="font-bold text-foreground mb-1">1. Pick a Show</h3>
                <p>Go to the Draft page and select an upcoming (or past) show from the dropdown.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">2. Draft 15 Songs</h3>
                <p>Browse the catalog and pick 15 songs you think the band will play. Use search, filters, and sort to find your picks.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">3. Save Your Draft</h3>
                <p>Once you have 15 songs and a show selected, hit Save Draft. You can view your draft anytime from the Draft page.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">4. Get Scored</h3>
                <p>After the show happens, your draft is scored against the actual setlist. Earn points for every song that was played, with bonuses for openers, closers, bust-outs, and covers.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">5. Compete</h3>
                <p>Check the Leaderboard to see how you rank globally. Create or join Leagues to compete with friends in private groups.</p>
              </div>
              <div>
                <h3 className="font-bold text-foreground mb-1">6. Create or Join a League</h3>
                <p>Go to the Leagues page and click Create League — give it a name and optional description. Share the invite code with friends so they can join. You can also join an existing league by entering an invite code. Each league has its own leaderboard so you can compete head-to-head.</p>
              </div>
            </div>
          )}
        </div>

        {/* Scoring Rules */}
        <div className="border-b border-border">
          <button
            onClick={() => setShowScoring(!showScoring)}
            className="w-full flex items-center justify-between px-4 sm:px-6 py-4 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-light transition-colors"
          >
            <span>Scoring Rules</span>
            <svg
              className={cn("w-4 h-4 transition-transform", showScoring && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {showScoring && (
            <div className="px-4 sm:px-6 pb-4 sm:pb-6 slide-up">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 text-text-muted font-medium">Event</th>
                    <th className="text-right py-2 text-text-muted font-medium">Points</th>
                  </tr>
                </thead>
                <tbody>
                  {scoringRules.map((rule) => (
                    <tr key={rule.event} className="border-b border-border/50">
                      <td className="py-2 text-text-muted">{rule.event}</td>
                      <td className="py-2 text-right text-ocean-blue font-bold">{rule.points}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <p className="text-xs text-text-dim mt-3">
                Bonuses stack. A bust-out cover that opens Set 1 scores: 10 + 20 + 25 + 20 = 75 pts.
              </p>
            </div>
          )}
        </div>

        {/* Report a Bug */}
        <a
          href={`${GITHUB_REPO}/issues/new?labels=bug&title=Bug+report&body=Describe+the+issue...`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 sm:px-6 py-4 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-light transition-colors border-b border-border"
        >
          <span>Report a Bug</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* Request a Feature */}
        <a
          href={`${GITHUB_REPO}/issues/new?labels=enhancement&title=Feature+request&body=Describe+your+idea...`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-4 sm:px-6 py-4 text-sm font-medium text-text-muted hover:text-foreground hover:bg-surface-light transition-colors border-b border-border"
        >
          <span>Request a Feature</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>

        {/* About */}
        <div className="px-4 sm:px-6 py-4">
          <div className="text-sm text-text-muted space-y-1">
            <div className="flex justify-between">
              <span>Version</span>
              <span className="text-foreground">0.1.0</span>
            </div>
            <div className="flex justify-between">
              <span>Source</span>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ocean-blue hover:underline"
              >
                GitHub
              </a>
            </div>
            <div className="flex justify-between">
              <span>Built with</span>
              <span className="text-foreground">Next.js, Supabase, Tailwind</span>
            </div>
          </div>
        </div>
      </section>

      {/* Account Section */}
      <section className="bg-surface rounded-xl border border-border p-4 sm:p-6">
        <h2 className="text-lg font-bold mb-4">Account</h2>
        <div className="space-y-3">
          <button
            onClick={signOut}
            className="w-full py-3 rounded-xl border border-border text-text-muted font-bold text-sm hover:text-foreground hover:bg-surface-light transition-colors"
          >
            Sign Out
          </button>

          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-3 rounded-xl border border-danger/20 text-danger/70 font-bold text-sm hover:border-danger/40 hover:text-danger hover:bg-danger/5 transition-colors"
            >
              Delete Account
            </button>
          ) : (
            <div className="border border-danger/30 rounded-xl p-4 space-y-3 slide-up">
              <p className="text-sm text-danger font-medium">
                This will permanently delete all your drafts and remove you from all leagues.
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-2.5 rounded-xl border border-border text-text-muted font-bold text-sm hover:text-foreground hover:bg-surface-light transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteAccount}
                  disabled={deleting}
                  className="flex-1 py-2.5 rounded-xl bg-danger text-background font-bold text-sm hover:bg-coral-red-dark transition-colors"
                >
                  {deleting ? "Deleting..." : "Yes, Delete Everything"}
                </button>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
