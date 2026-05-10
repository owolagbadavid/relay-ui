import { useCallback, useEffect, useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext, type Profile } from "../context/AuthContext";
import { apiFetch } from "../lib/api";

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const clearProfile = useCallback(() => {
    setProfile(null);
  }, []);

  // Fetch profile on mount
  useEffect(() => {
    apiFetch<Profile>("api/auth/profile")
      .then(setProfile)
      .catch(() => setProfile(null))
      .finally(() => setLoading(false));
  }, []);

  // Listen for 401 events from apiFetch
  useEffect(() => {
    window.addEventListener("auth:unauthorized", clearProfile);
    return () => window.removeEventListener("auth:unauthorized", clearProfile);
  }, [clearProfile]);

  async function login(email: string) {
    await apiFetch("api/auth/login", {
      body: JSON.stringify({ email }),
      method: "POST",
    });
    const p = await apiFetch<Profile>("api/auth/profile");
    setProfile(p);
    navigate("/dashboard");
  }

  function logout() {
    setProfile(null);
    navigate("/");
  }

  return (
    <AuthContext.Provider value={{ profile, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
