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
  if (!raw) return defaultProfile;
  try {
    return { ...defaultProfile, ...JSON.parse(raw) };
  } catch {
    return defaultProfile;
  }
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("akai-profile-updated"));
  }
}
