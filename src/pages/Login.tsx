import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setError("");
    setSubmitting(true);
    try {
      await login(email.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black">
      <nav className="flex items-center px-8 py-5 border-b border-gray-200">
        <Link to="/" className="text-xl font-semibold tracking-tight">
          Relay
        </Link>
      </nav>

      <div className="flex-1 flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <h1 className="text-3xl font-semibold tracking-tight mb-2">
            Welcome back
          </h1>
          <p className="text-gray-500 mb-8">Enter your email to continue</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-1.5"
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
                className="w-full px-4 py-2.5 text-sm border border-gray-300 rounded-lg bg-white placeholder:text-gray-400 focus:outline-none focus:border-black transition"
              />
            </div>

            {error && <p className="text-sm text-gray-700">{error}</p>}

            <button
              type="submit"
              disabled={submitting}
              className="w-full px-4 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {submitting ? "Signing in..." : "Continue"}
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-gray-400">
            By continuing, you agree to our terms of service.
          </p>
        </div>
      </div>
    </div>
  );
}
