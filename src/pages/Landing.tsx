import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Landing() {
  const { profile } = useAuth();

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
        <span className="text-xl font-semibold tracking-tight">Relay</span>
        <Link
          to={profile ? "/dashboard" : "/login"}
          className="px-5 py-2 text-sm font-medium text-white bg-black rounded-full hover:bg-gray-800 transition"
        >
          {profile ? "Dashboard" : "Get Started"}
        </Link>
      </nav>

      <section className="flex-1 flex flex-col items-center justify-center text-center px-6 py-24 max-w-2xl mx-auto">
        <span className="inline-block px-3 py-1 text-xs font-medium rounded-full border border-gray-200 text-gray-500 mb-8">
          Fast. Simple. Reliable.
        </span>
        <h1 className="text-5xl sm:text-7xl font-semibold tracking-tight leading-[1.05] mb-6">
          Shorten your links,
          <br />
          <span className="text-gray-400">amplify your reach</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-md mb-10">
          Relay turns long URLs into clean, trackable short links. Monitor
          clicks and referrers in real time.
        </p>
        <Link
          to={profile ? "/dashboard" : "/login"}
          className="px-6 py-3 text-base font-medium text-white bg-black rounded-full hover:bg-gray-800 transition"
        >
          Start for free
        </Link>
      </section>

      <footer className="text-center py-8 border-t border-gray-200 text-xs text-gray-400">
        &copy; 2026 Relay
      </footer>
    </div>
  );
}
