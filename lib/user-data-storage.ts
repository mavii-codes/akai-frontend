import { loadAuthSession } from "@/lib/auth-session";

export const TASKS_KEY_PREFIX = "akai-tasks";
export const SCHEDULES_KEY_PREFIX = "akai-schedules";
export const SUBJECTS_KEY_PREFIX = "akai-subjects";

export function getUserStorageKey(prefix: string, email: string) {
  return `${prefix}:${email.trim().toLowerCase()}`;
}

export function getCurrentUserEmail(): string | null {
  return loadAuthSession()?.email ?? null;
}

/** Clear tasks & planner for a brand-new account */
export function initializeNewUserData(email: string) {
  if (typeof window === "undefined") return;
  const normalized = email.trim().toLowerCase();
  localStorage.setItem(getUserStorageKey(TASKS_KEY_PREFIX, normalized), "[]");
  localStorage.setItem(
    getUserStorageKey(SCHEDULES_KEY_PREFIX, normalized),
    "[]"
  );
  localStorage.setItem(
    getUserStorageKey(SUBJECTS_KEY_PREFIX, normalized),
    "[]"
  );
  window.dispatchEvent(new Event("akai-user-data-updated"));
}

export function notifyUserDataUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("akai-user-data-updated"));
  }
}
