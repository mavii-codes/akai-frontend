export type AuthSession = {
  email: string;
  name?: string;
};

const STORAGE_KEY = "akai-auth-session";

export function saveAuthSession(session: AuthSession) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  } catch {
    // ignore storage errors
  }
  document.cookie = "accessToken=local-session; path=/; max-age=604800; SameSite=Lax";
  window.dispatchEvent(new Event("akai-auth-updated"));
  window.dispatchEvent(new Event("akai-account-updated"));
}

export function loadAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as AuthSession;
  } catch {
    return null;
  }
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore storage errors
  }
  document.cookie = "accessToken=; path=/; max-age=0; SameSite=Lax";
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
