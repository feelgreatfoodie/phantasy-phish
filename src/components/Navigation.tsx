"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/components/AuthProvider";

const links = [
  {
    href: "/draft",
    label: "Draft",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
      </svg>
    ),
  },
  {
    href: "/shows",
    label: "Shows",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    href: "/songs",
    label: "Songs",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 18V5l12-2v13" />
        <circle cx="6" cy="18" r="3" />
        <circle cx="18" cy="16" r="3" />
      </svg>
    ),
  },
  {
    href: "/leagues",
    label: "Leagues",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: "/leaderboard",
    label: "Leaders",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
        <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
        <path d="M4 22h16" />
        <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20 7 22" />
        <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20 17 22" />
        <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
      </svg>
    ),
  },
];

const settingsIcon = (
  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
    <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

export function Navigation() {
  const pathname = usePathname();
  const { user, profile, loading } = useAuth();

  return (
    <nav className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="donut-ring shadow-lg shadow-deep-sea/30">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-coral-red via-deep-sea to-ocean-blue flex items-center justify-center text-background font-black text-sm sm:text-lg">
                PP
              </div>
            </div>
            <span className="text-base sm:text-xl font-black ocean-text">
              Phantasy Phish
            </span>
          </Link>
          {/* Desktop nav */}
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  title={link.label}
                  className={`p-2 rounded-lg transition-all ${
                    isActive
                      ? "bg-deep-sea/40 text-ocean-blue neon-glow"
                      : "text-text-muted hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  {link.icon}
                </Link>
              );
            })}
            {loading ? (
              <>
                <div className="w-px h-6 bg-border mx-1" />
                <div className="w-8 h-8 rounded-full bg-surface-light animate-pulse" />
              </>
            ) : user ? (
              <>
                <Link
                  href="/settings"
                  title="Settings"
                  className={`p-2 rounded-lg transition-all ${
                    pathname === "/settings"
                      ? "bg-deep-sea/40 text-ocean-blue neon-glow"
                      : "text-text-muted hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  {settingsIcon}
                </Link>
                <div className="w-px h-6 bg-border mx-1" />
                <Link
                  href="/profile"
                  className="rounded-full hover:ring-2 hover:ring-ocean-blue/40 transition-all"
                  aria-label="Profile"
                >
                  {profile?.avatar_url ? (
                    <img
                      src={profile.avatar_url}
                      alt={profile.display_name}
                      className="w-8 h-8 rounded-full block"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-deep-sea to-ocean-blue flex items-center justify-center text-xs font-bold text-foreground">
                      {(profile?.display_name || user.email || "?")[0].toUpperCase()}
                    </div>
                  )}
                </Link>
              </>
            ) : (
              <>
                <div className="w-px h-6 bg-border mx-1" />
                <Link
                  href="/login"
                  className="px-4 py-2 rounded-lg bg-ocean-blue/20 text-ocean-blue text-sm font-medium hover:bg-ocean-blue/30 transition-colors"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
          {/* Mobile: avatar + hamburger */}
          <div className="sm:hidden flex items-center gap-2">
            {!loading && user && (
              <Link href="/profile" className="shrink-0 rounded-full" aria-label="Profile">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.display_name}
                    className="w-7 h-7 rounded-full block"
                  />
                ) : (
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-deep-sea to-ocean-blue flex items-center justify-center text-xs font-bold text-foreground">
                    {(profile?.display_name || user.email || "?")[0].toUpperCase()}
                  </div>
                )}
              </Link>
            )}
            <HamburgerMenu pathname={pathname} user={!!user} loading={loading} />
          </div>
        </div>
      </div>
      <div className="wave-divider" />
    </nav>
  );
}

function HamburgerMenu({
  pathname,
  user,
  loading,
}: {
  pathname: string;
  user: boolean;
  loading: boolean;
}) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on click outside
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={menuRef} className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="p-2 rounded-lg text-text-muted hover:text-foreground hover:bg-surface-light transition-colors"
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-56 bg-surface border border-border rounded-xl shadow-xl shadow-background/50 overflow-hidden slide-up z-50">
          <div className="py-2">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-deep-sea/30 text-ocean-blue"
                      : "text-text-muted hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  {link.icon}
                  {link.label}
                </Link>
              );
            })}
          </div>
          <div className="border-t border-border py-2">
            {!loading && user ? (
              <>
                <Link
                  href="/profile"
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    pathname === "/profile"
                      ? "bg-deep-sea/30 text-ocean-blue"
                      : "text-text-muted hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Profile
                </Link>
                <Link
                  href="/settings"
                  className={`flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-colors ${
                    pathname === "/settings"
                      ? "bg-deep-sea/30 text-ocean-blue"
                      : "text-text-muted hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  {settingsIcon}
                  Settings
                </Link>
              </>
            ) : !loading ? (
              <Link
                href="/login"
                className="block px-4 py-2.5 text-sm font-medium text-ocean-blue hover:bg-surface-light transition-colors"
              >
                Sign In
              </Link>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );
}
