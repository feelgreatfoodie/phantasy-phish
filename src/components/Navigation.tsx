"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/draft", label: "Draft" },
  { href: "/shows", label: "Shows" },
  { href: "/songs", label: "Songs" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-full bg-electric-teal flex items-center justify-center text-background font-bold text-lg">
              FP
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-electric-teal to-warm-orange bg-clip-text text-transparent">
              Fantasy Phish
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => {
              const isActive =
                link.href === "/"
                  ? pathname === "/"
                  : pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-deep-purple text-electric-teal"
                      : "text-text-muted hover:text-foreground hover:bg-surface-light"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
          {/* Mobile menu */}
          <div className="sm:hidden">
            <MobileMenu pathname={pathname} />
          </div>
        </div>
      </div>
    </nav>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
              isActive
                ? "bg-deep-purple text-electric-teal"
                : "text-text-muted hover:text-foreground"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </div>
  );
}
