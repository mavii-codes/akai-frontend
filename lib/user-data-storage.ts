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
export function initializeNewUserData(email?: string) {
  void email;
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("akai-user-data-updated"));
  }
}

export function notifyUserDataUpdated() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("akai-user-data-updated"));
  }
}
