import { useRef, useEffect } from "react";
import { useInfiniteReadings } from "../lib/queries";

export default function ReadingsList() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteReadings(20);

  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!loadMoreRef.current || !hasNextPage || isFetchingNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(loadMoreRef.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allReadings = data?.pages.flatMap((page) => page.items) ?? [];
  const getTempIcon = (temp: number) => {
    if (temp < 0) return "❄️";
    if (temp < 15) return "🧊";
    if (temp < 25) return "😊";
    if (temp < 35) return "🌡️";
    return "🔥";
  };

  const getTempColor = (temp: number) => {
    if (temp < 0) return "from-blue-400 to-cyan-500";
    if (temp < 15) return "from-cyan-400 to-teal-500";
    if (temp < 25) return "from-green-400 to-emerald-500";
    if (temp < 35) return "from-yellow-400 to-orange-500";
    return "from-orange-500 to-red-600";
  };

  return (
    <div className="bg-purple-800/40 backdrop-blur-md rounded-2xl p-6 border border-purple-600/30 shadow-xl">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <svg
            className="w-5 h-5 text-purple-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            />
          </svg>
          <h2 className="text-lg font-bold text-white">Temperature Readings</h2>
        </div>
        <button className="flex items-center gap-1 px-3 py-1.5 bg-purple-600/50 hover:bg-white/10 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] rounded-lg text-sm text-white transition-all duration-200">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Export
        </button>
      </div>

      {isLoading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-purple-300 border-t-white"></div>
          <p className="text-purple-300 mt-4">Loading readings...</p>
        </div>
      ) : isError ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 text-lg font-medium">
            Failed to load readings
          </p>
          <p className="text-purple-400 text-sm mt-2">
            {error instanceof Error ? error.message : "Unknown error"}
          </p>
        </div>
      ) : allReadings.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-purple-200 text-lg font-medium">No readings yet</p>
          <p className="text-purple-400 text-sm mt-2">
            Add your first temperature reading to get started
          </p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {allReadings.map((reading) => {
            // Parse UTC string and convert to local time
            const utcDate = reading.createdAtUtc.endsWith("Z")
              ? reading.createdAtUtc
              : `${reading.createdAtUtc}Z`; // Ensure Z suffix for UTC
            const date = new Date(utcDate);

            const now = new Date();
            const isToday = date.toDateString() === now.toDateString();

            return (
              <div
                key={reading.id}
                className="bg-purple-900/40 backdrop-blur-sm rounded-xl p-4 border border-purple-600/20 hover:border-purple-500/40 transition group"
              >
                <div className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    <div
                      className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getTempColor(
                        reading.temperatureC
                      )} flex items-center justify-center text-2xl`}
                    >
                      {getTempIcon(reading.temperatureC)}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2">
                      <span
                        className={`text-2xl font-bold bg-gradient-to-r ${getTempColor(
                          reading.temperatureC
                        )} bg-clip-text text-transparent`}
                      >
                        {reading.temperatureC.toFixed(1)}°C
                      </span>
                      <span className="text-white/60 text-xs">
                        ID: {reading.id}
                      </span>
                    </div>
                    <p className="text-white/60 text-sm mt-0.5">
                      {date.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div className="text-right">
                    <p className="text-white/90 font-medium text-sm">
                      {date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                    <p className="text-white/60 text-xs mt-0.5">
                      {isToday
                        ? "Today"
                        : date.toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                          })}{" "}
                      {date.toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                {(reading.location || reading.notes) && (
                  <div className="mt-3 pt-3 border-t border-purple-600/20 space-y-1">
                    {reading.location && (
                      <p className="text-purple-300 text-xs flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        {reading.location}
                      </p>
                    )}
                    {reading.notes && (
                      <p className="text-purple-300 text-xs flex items-center gap-1">
                        <svg
                          className="w-3 h-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                          />
                        </svg>
                        {reading.notes}
                      </p>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {/* Infinite scroll trigger */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="py-4 text-center">
              {isFetchingNextPage ? (
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-2 border-purple-300 border-t-white"></div>
              ) : (
                <button
                  onClick={() => fetchNextPage()}
                  className="px-4 py-2 bg-purple-600/50 hover:bg-purple-600/70 rounded-lg text-sm text-white transition-colors"
                >
                  Load More
                </button>
              )}
            </div>
          )}
        </div>
      )}

      {!isLoading && allReadings.length > 0 && (
        <div className="mt-4 pt-4 border-t border-purple-600/30 flex items-center gap-2 text-xs text-purple-400">
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>
            Tip: Track your temperature readings over time to identify patterns
            and uplifts energy usage.
          </span>
        </div>
      )}
    </div>
  );
}
