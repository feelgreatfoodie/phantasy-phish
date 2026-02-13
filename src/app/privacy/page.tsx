import Link from "next/link";

export default function PrivacyPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Privacy Policy</h1>
        <p className="text-text-muted mt-1">Last updated: February 2026</p>
      </div>

      <div className="bg-surface rounded-xl border border-border p-4 sm:p-6 space-y-6 text-sm text-text-muted">
        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">What We Collect</h2>
          <p>
            When you sign in with Google or email, we store the minimum information needed
            to run your account:
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li><strong className="text-foreground">Display name</strong> &mdash; shown on leaderboards and in leagues</li>
            <li><strong className="text-foreground">Email address</strong> &mdash; used for authentication only, visible only to you</li>
            <li><strong className="text-foreground">Avatar URL</strong> &mdash; from your Google account, shown next to your name</li>
            <li><strong className="text-foreground">Draft picks</strong> &mdash; the songs you select for each show</li>
            <li><strong className="text-foreground">League memberships</strong> &mdash; which leagues you&apos;ve joined</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">How We Use It</h2>
          <p>
            Your data is used exclusively to power Phantasy Phish features: scoring your
            drafts, displaying leaderboards, and managing leagues. We do not sell, share, or
            monetize your personal information.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">Third-Party Services</h2>
          <ul className="list-disc list-inside space-y-1">
            <li><strong className="text-foreground">Supabase</strong> &mdash; authentication and database hosting</li>
            <li><strong className="text-foreground">Vercel</strong> &mdash; application hosting</li>
            <li><strong className="text-foreground">Google OAuth</strong> &mdash; optional sign-in method (subject to Google&apos;s privacy policy)</li>
          </ul>
          <p className="mt-2">No analytics or tracking services are used.</p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">Data Retention</h2>
          <p>
            Your data is retained as long as your account exists. You can delete your account
            at any time from the <Link href="/settings" className="text-ocean-blue hover:underline">Settings</Link> page,
            which permanently removes all your drafts, league memberships, and profile data.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">Your Rights</h2>
          <p>You can:</p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>View all your data on your <Link href="/profile" className="text-ocean-blue hover:underline">profile page</Link></li>
            <li>Edit your display name at any time</li>
            <li>Delete your account and all associated data</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-bold text-foreground mb-2">Contact</h2>
          <p>
            Questions about this policy? Open an issue on{" "}
            <a
              href="https://github.com/feelgreatfoodie/phantasy-phish"
              target="_blank"
              rel="noopener noreferrer"
              className="text-ocean-blue hover:underline"
            >
              GitHub
            </a>.
          </p>
        </section>
      </div>
    </div>
  );
}
