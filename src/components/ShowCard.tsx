import Link from "next/link";
import { Show } from "@/data/shows";
import { formatDate } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface ShowCardProps {
  show: Show;
  draftCount?: number;
}

export function ShowCard({ show, draftCount = 0 }: ShowCardProps) {
  return (
    <Link
      href={`/shows/${show.id}`}
      className={cn(
        "block p-5 rounded-xl border border-border bg-surface-light",
        "hover:border-deep-sea hover:shadow-lg hover:shadow-deep-sea/20 transition-all hover:scale-[1.01]"
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-bold text-lg">{show.venue}</h3>
          <p className="text-text-muted text-sm">
            {show.city}, {show.state}
          </p>
          <p className="text-ocean-blue text-sm font-medium mt-1">
            {formatDate(show.date)}
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span
            className={cn(
              "px-3 py-1 rounded-full text-xs font-semibold",
              show.isCompleted
                ? "bg-success/20 text-success"
                : "bg-sandy-gold/20 text-sandy-gold"
            )}
          >
            {show.isCompleted ? "Completed" : "Upcoming"}
          </span>
          {draftCount > 0 && (
            <span className="text-xs text-text-muted">
              {draftCount} draft{draftCount !== 1 ? "s" : ""}
            </span>
          )}
        </div>
      </div>
      {show.isCompleted && (
        <div className="mt-3 flex gap-4 text-xs text-text-muted">
          <span>Set 1: {show.set1.length} songs</span>
          <span>Set 2: {show.set2.length} songs</span>
          <span>Encore: {show.encore.length} songs</span>
        </div>
      )}
    </Link>
  );
}
