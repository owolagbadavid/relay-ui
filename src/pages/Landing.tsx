import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-950">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <span className="text-xl font-bold text-blue-600 dark:text-blue-400 tracking-tight">
          Relay
        </span>
        {profile ? (
          <Link
            to="/dashboard"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Dashboard
          </Link>
        ) : (
          <Link
            to="/login"
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        )}
      </nav>

      {/* Hero */}
      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 mb-6">
          Fast. Simple. Reliable.
        </span>
        <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-5">
          Shorten your links,
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
            amplify your reach
          </span>
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-lg mb-8">
          Relay turns long, messy URLs into clean, trackable short links.
          Monitor clicks, referrers, and geographic data in real time.
        </p>
        <Link
          to={profile ? "/dashboard" : "/login"}
          className="px-6 py-3 text-base font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition"
        >
          Start for free
        </Link>
      </section>

      {/* Features */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-4xl mx-auto px-6 pb-16">
        {[
          {
            icon: "\u26A1",
            title: "Instant Short Links",
            desc: "Create short URLs in one click. Custom slugs supported.",
          },
          {
            icon: "\uD83D\uDCCA",
            title: "Real-time Analytics",
            desc: "Track clicks, referrers, browsers, and locations as they happen.",
          },
          {
            icon: "\uD83D\uDD12",
            title: "Secure & Reliable",
            desc: "Enterprise-grade infrastructure. Your links never go down.",
          },
        ].map((f) => (
          <div
            key={f.title}
            className="text-center p-6 border border-gray-200 dark:border-gray-800 rounded-xl bg-white dark:bg-gray-900 hover:shadow-lg transition"
          >
            <div className="text-3xl mb-3">{f.icon}</div>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
              {f.title}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {f.desc}
            </p>
          </div>
        ))}
      </section>

      {/* Footer */}
      <footer className="text-center py-6 border-t border-gray-200 dark:border-gray-800 text-xs text-gray-400">
        &copy; 2026 Relay. All rights reserved.
      </footer>
    </div>
  );
}
