import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

interface ShortenedUrl {
  id: string;
  shortUrl: string;
  longUrl: string;
  customUrl?: string;
  expiresIn: string;
  createdAt: string;
}

interface ClickRecord {
  id: string;
  ip: string;
  userAgent: string;
  referrer: string;
  timestamp: string;
}

interface AnalyticsSummary {
  totalClicks: number;
  uniqueClicks: number;
  topReferrers: { referrer: string; count: number }[];
  clicksByDay: { date: string; count: number }[];
}

interface Page<T> {
  items: T[];
}

export default function Dashboard() {
  const { profile, loading: authLoading, logout } = useAuth();
  const [urls, setUrls] = useState<ShortenedUrl[]>([]);
  const [loadingUrls, setLoadingUrls] = useState(true);

  const [longUrl, setLongUrl] = useState("");
  const [customSlug, setCustomSlug] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [creating, setCreating] = useState(false);

  const [selectedUrl, setSelectedUrl] = useState<ShortenedUrl | null>(null);
  const [clicks, setClicks] = useState<ClickRecord[]>([]);
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  const [copied, setCopied] = useState<string | null>(null);

  const fetchUrls = useCallback(async () => {
    setLoadingUrls(true);
    try {
      const data = await apiFetch<Page<ShortenedUrl>>("api/short-url?size=50");
      setUrls(data.items ?? []);
    } catch {
      // todo
    } finally {
      setLoadingUrls(false);
    }
  }, []);

  useEffect(() => {
    if (profile) fetchUrls();
  }, [profile, fetchUrls]);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!longUrl.trim()) return;
    setCreating(true);
    try {
      const body: Record<string, string> = {
        longUrl: longUrl.trim(),
        expiresIn: expiresIn
          ? new Date(expiresIn).toISOString()
          : new Date(Date.now() + 30 * 86400000).toISOString(),
      };
      if (customSlug.trim()) body.customUrl = customSlug.trim();
      await apiFetch("api/short-url", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setLongUrl("");
      setCustomSlug("");
      setExpiresIn("");
      await fetchUrls();
    } catch {
      // handled
    } finally {
      setCreating(false);
    }
  }

  async function loadStats(url: ShortenedUrl) {
    setSelectedUrl(url);
    setLoadingStats(true);
    setClicks([]);
    setSummary(null);
    try {
      const [clickData, summaryData] = await Promise.all([
        apiFetch<Page<ClickRecord>>(`api/short-url/${url.shortUrl}/analytics?size=50`),
        apiFetch<AnalyticsSummary>(`api/short-url/${url.shortUrl}/analytics/summary`),
      ]);
      setClicks(clickData.items ?? []);
      setSummary(summaryData ?? null);
    } catch {
      // handled
    } finally {
      setLoadingStats(false);
    }
  }

  const SHORT_BASE = import.meta.env.VITE_SHORT_BASE_URL ?? window.location.origin;

  function handleCopy(shortUrl: string) {
    navigator.clipboard.writeText(`${SHORT_BASE}/${shortUrl}`);
    setCopied(shortUrl);
    setTimeout(() => setCopied(null), 2000);
  }

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  if (!profile) return <Navigate to="/login" replace />;

  const maxClicks = summary ? Math.max(...(summary.clicksByDay?.map((d) => d.count) ?? [0]), 1) : 1;

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
        <span className="text-xl font-semibold tracking-tight">Relay</span>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-500">{profile.email}</span>
          <button
            onClick={logout}
            className="text-sm text-gray-500 hover:text-black transition"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="flex-1 max-w-6xl mx-auto w-full px-8 py-8 space-y-6">
        <section className="border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">Shorten a URL</h2>
          <form onSubmit={handleCreate} className="flex flex-col sm:flex-row gap-3">
            <input
              type="url"
              required
              placeholder="https://example.com/your-long-url"
              value={longUrl}
              onChange={(e) => setLongUrl(e.target.value)}
              className="flex-2 min-w-0 px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:border-black transition"
            />
            <input
              type="text"
              placeholder="custom slug (optional)"
              value={customSlug}
              onChange={(e) => setCustomSlug(e.target.value)}
              pattern="[a-zA-Z0-9]+"
              title="Letters and numbers only"
              className="flex-1 min-w-0 px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:border-black transition"
            />
            <input
              type="datetime-local"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
              className="flex-1 min-w-0 px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white focus:outline-none focus:border-black transition"
            />
            <button
              type="submit"
              disabled={creating}
              className="px-5 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition whitespace-nowrap"
            >
              {creating ? "Creating..." : "Shorten"}
            </button>
          </form>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <section className="border border-gray-200 rounded-2xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              Your Links
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                {urls.length}
              </span>
            </h2>

            {loadingUrls ? (
              <p className="text-sm text-gray-400 py-4">Loading links...</p>
            ) : urls.length === 0 ? (
              <p className="text-sm text-gray-400 py-4">
                No links yet. Create your first one above!
              </p>
            ) : (
              <ul className="space-y-2">
                {urls.map((url) => (
                  <li
                    key={url.id}
                    onClick={() => loadStats(url)}
                    onKeyDown={(e) => e.key === "Enter" && loadStats(url)}
                    role="button"
                    tabIndex={0}
                    className={`flex items-start gap-2 p-3 rounded-lg border transition cursor-pointer ${
                      selectedUrl?.id === url.id
                        ? "border-black bg-gray-50"
                        : "border-gray-200 hover:border-gray-400"
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm font-semibold">
                          {url.shortUrl}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(url.shortUrl);
                          }}
                          className="text-gray-400 hover:text-black text-xs transition"
                          title="Copy link"
                        >
                          {copied === url.shortUrl ? "✓" : "⎘"}
                        </button>
                      </div>
                      <p className="text-xs text-gray-500 truncate mt-0.5">{url.longUrl}</p>
                      <p className="text-xs text-gray-400 mt-1">
                        {new Date(url.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>

          <section className="border border-gray-200 rounded-2xl p-6 lg:sticky lg:top-6">
            {selectedUrl ? (
              loadingStats ? (
                <p className="text-sm text-gray-400 py-8 text-center">Loading analytics...</p>
              ) : (
                <>
                  <h2 className="text-lg font-semibold mb-3">Stats</h2>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-sm font-semibold">
                      {selectedUrl.shortUrl}
                    </span>
                    <span className="text-sm font-semibold">
                      {summary?.totalClicks ?? 0} clicks
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate pb-4 mb-4 border-b border-gray-200">
                    {selectedUrl.longUrl}
                  </p>

                  {summary && summary.clicksByDay && summary.clicksByDay.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Clicks over time</h3>
                      <div className="flex items-end gap-1.5 h-36 mb-6">
                        {summary.clicksByDay.map((d) => (
                          <div
                            key={d.date}
                            className="flex-1 flex flex-col items-center justify-end h-full"
                          >
                            <div
                              className="w-full max-w-9 bg-black rounded-t-md relative min-h-1"
                              style={{
                                height: `${(d.count / maxClicks) * 100}%`,
                              }}
                            >
                              <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-semibold text-gray-700">
                                {d.count}
                              </span>
                            </div>
                            <span className="text-[10px] text-gray-400 mt-1">
                              {new Date(d.date).toLocaleDateString("en", {
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}

                  {summary?.topReferrers && summary.topReferrers.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mb-2">Top Referrers</h3>
                      <ul className="space-y-1 mb-4">
                        {summary.topReferrers.map((r) => (
                          <li
                            key={r.referrer}
                            className="flex justify-between items-center text-sm px-3 py-1.5 rounded-md bg-gray-50"
                          >
                            <span className="text-gray-700">{r.referrer || "direct"}</span>
                            <span className="font-mono text-xs font-semibold">
                              {r.count}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {clicks.length > 0 && (
                    <>
                      <h3 className="text-sm font-medium text-gray-500 mt-4 mb-2">Recent Clicks</h3>
                      <div className="max-h-48 overflow-y-auto space-y-1">
                        {clicks.map((c) => (
                          <div
                            key={c.id}
                            className="text-xs px-3 py-1.5 rounded-md bg-gray-50 flex justify-between gap-2"
                          >
                            <span className="text-gray-500 truncate">{c.referrer || "direct"}</span>
                            <span className="text-gray-400 whitespace-nowrap">
                              {new Date(c.timestamp).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )
            ) : (
              <div className="flex items-center justify-center h-52 text-sm text-gray-400">
                Select a link to view its analytics
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
