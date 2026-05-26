export type AuthSession = {
  email: string;
  name?: string;
};

export const AUTH_SESSION_KEY = "akai-auth-session";

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
  window.dispatchEvent(new Event("akai-auth-updated"));
  window.dispatchEvent(new Event("akai-account-updated"));
}

export function loadAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthSession;
    if (!parsed?.email?.includes("@")) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTH_SESSION_KEY);
  window.dispatchEvent(new Event("akai-auth-updated"));
  window.dispatchEvent(new Event("akai-account-updated"));
}

/** First part of email before @, e.g. "micco" from micco@gmail.com */
export function getEmailUsername(email: string) {
  return email.split("@")[0] || "Student";
}

export function getEmailInitial(email: string) {
  const user = getEmailUsername(email);
  return user.charAt(0).toUpperCase();
}
