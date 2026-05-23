"use client";

import { useEffect, useState } from "react";
import {
  AUTH_SESSION_KEY,
  getEmailUsername,
  loadAuthSession,
  type AuthSession,
} from "@/lib/auth-session";

export function useAuthUser() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setSession(loadAuthSession());
      setReady(true);
    };
    refresh();
    window.addEventListener("akai-auth-updated", refresh);
    window.addEventListener("storage", (e) => {
      if (e.key === AUTH_SESSION_KEY) refresh();
    });
    return () => window.removeEventListener("akai-auth-updated", refresh);
  }, []);

  const email = session?.email ?? "";
  const displayName = session?.name?.trim() || (email ? getEmailUsername(email) : "Student");

  return {
    session,
    email,
    displayName,
    ready,
    isLoggedIn: Boolean(email),
  };
}
