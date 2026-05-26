import { loadAuthSession, saveAuthSession } from "@/lib/auth-session";

export type UserProfile = {
  name: string;
  email: string;
  about: string;
  profileImage?: string;
};

export const PROFILE_STORAGE_KEY = "akai-profile";

export const defaultProfile: UserProfile = {
  name: "Jane Doe",
  email: "jane@study.com",
  about: "I like organizing my study plan around creative projects.",
  profileImage: "",
};

export function loadProfile(): UserProfile {
  if (typeof window === "undefined") return defaultProfile;
  const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
  if (!raw) return mergeWithAuthSession(defaultProfile);
  try {
    return mergeWithAuthSession({ ...defaultProfile, ...JSON.parse(raw) });
  } catch {
    return mergeWithAuthSession(defaultProfile);
  }
}

/** Prefer saved profile; fill email/name from login session when profile is still default */
export function mergeWithAuthSession(profile: UserProfile): UserProfile {
  const session = loadAuthSession();
  if (!session) return profile;

  const merged = { ...profile };
  if (
    session.email &&
    (!merged.email || merged.email === defaultProfile.email)
  ) {
    merged.email = session.email;
  }
  if (session.name && merged.name === defaultProfile.name) {
    merged.name = session.name;
  }
  return merged;
}

export function getFirstName(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || trimmed === defaultProfile.name) return "";
  return trimmed.split(/\s+/)[0];
}

export function getDisplayName(profile: UserProfile): string {
  const first = getFirstName(profile.name);
  if (first) return first;
  if (profile.email?.includes("@")) {
    return profile.email.split("@")[0];
  }
  return "Student";
}

export function getAvatarInitial(profile: UserProfile): string {
  if (profile.profileImage) return "";
  const first = getFirstName(profile.name);
  if (first) return first.charAt(0).toUpperCase();
  if (profile.email?.includes("@")) {
    return profile.email.charAt(0).toUpperCase();
  }
  return "S";
}

export function saveProfile(profile: UserProfile) {
  const normalized: UserProfile = {
    ...profile,
    name: profile.name.trim(),
    email: profile.email.trim().toLowerCase(),
    about: profile.about.trim(),
  };

  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(normalized));

  // Keep login session in sync so sidebar, header, and settings all match
  const session = loadAuthSession();
  if (session || normalized.email.includes("@")) {
    saveAuthSession({
      email: normalized.email,
      name: normalized.name,
    });
  }

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("akai-profile-updated"));
    window.dispatchEvent(new Event("akai-account-updated"));
  }
}
