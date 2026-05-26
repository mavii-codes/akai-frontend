"use client";

import { useEffect, useState } from "react";
import {
  AUTH_SESSION_KEY,
  loadAuthSession,
  type AuthSession,
} from "@/lib/auth-session";
import {
  PROFILE_STORAGE_KEY,
  defaultProfile,
  getDisplayName,
  getAvatarInitial,
  loadProfile,
  type UserProfile,
} from "@/lib/profile-storage";

export function useAuthUser() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<UserProfile>(defaultProfile);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const refresh = () => {
      setSession(loadAuthSession());
      setProfile(loadProfile());
      setReady(true);
    };
    refresh();

    window.addEventListener("akai-auth-updated", refresh);
    window.addEventListener("akai-profile-updated", refresh);
    window.addEventListener("akai-account-updated", refresh);
    window.addEventListener("storage", (e) => {
      if (e.key === AUTH_SESSION_KEY || e.key === PROFILE_STORAGE_KEY) {
        refresh();
      }
    });

    return () => {
      window.removeEventListener("akai-auth-updated", refresh);
      window.removeEventListener("akai-profile-updated", refresh);
      window.removeEventListener("akai-account-updated", refresh);
    };
  }, []);

  const email = profile.email || session?.email || "";
  const displayName = getDisplayName(profile);
  const fullName = profile.name.trim() || displayName;
  const avatarInitial = getAvatarInitial(profile);
  const avatarUrl = profile.profileImage || undefined;

  return {
    session,
    profile,
    email,
    displayName,
    fullName,
    avatarInitial,
    avatarUrl,
    ready,
    isLoggedIn: Boolean(email?.includes("@")),
  };
}
