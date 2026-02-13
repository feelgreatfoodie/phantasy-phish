"use client";

import { getUpcomingShows, getCompletedShows } from "@/data/shows";
import { ShowCard } from "@/components/ShowCard";
import { getDraftCountsByShowOptimized } from "@/lib/storage";
import { useEffect, useState } from "react";

export default function ShowsPage() {
  const upcoming = getUpcomingShows();
  const completed = getCompletedShows();
  const [draftCounts, setDraftCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    getDraftCountsByShowOptimized().then(setDraftCounts);
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Shows</h1>
        <p className="text-text-muted mt-1">
          View upcoming shows to draft for and past shows with results
        </p>
      </div>

      {upcoming.length > 0 && (
        <section>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-sandy-gold" />
            Upcoming Shows
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {upcoming.map((show) => (
              <ShowCard
                key={show.id}
                show={show}
                draftCount={draftCounts[show.id] || 0}
              />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-success" />
          Completed Shows
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {completed.map((show) => (
            <ShowCard
              key={show.id}
              show={show}
              draftCount={draftCounts[show.id] || 0}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
