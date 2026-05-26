import { loadAuthSession } from "@/lib/auth-session";

export function isApiSyncEnabled() {
  if (typeof window === "undefined") return false;
  return Boolean(loadAuthSession()?.email);
}
