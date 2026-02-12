"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/draft", label: "Draft" },
  { href: "/shows", label: "Shows" },
  { href: "/songs", label: "Songs" },
  { href: "/leaderboard", label: "Leaders" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="bg-surface/80 backdrop-blur-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2 sm:gap-3 group shrink-0">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-br from-coral-red via-deep-sea to-ocean-blue flex items-center justify-center text-background font-black text-sm sm:text-lg shadow-lg shadow-deep-sea/30">
              PP
            </div>
            <span className="text-base sm:text-xl font-black ocean-text">
              Phantasy Phish
            </span>
          </Link>
          <div className="hidden sm:flex items-center gap-1">
            {links.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? "bg-deep-sea/40 text-ocean-blue neon-glow"
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
      <div className="wave-divider" />
    </nav>
  );
}

function MobileMenu({ pathname }: { pathname: string }) {
  return (
    <div className="flex gap-0.5 overflow-x-auto pb-1">
      {links.map((link) => {
        const isActive =
          link.href === "/"
            ? pathname === "/"
            : pathname.startsWith(link.href);
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`px-2 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              isActive
                ? "bg-deep-sea/40 text-ocean-blue"
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
