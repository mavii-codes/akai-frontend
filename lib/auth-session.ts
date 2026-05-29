export type AuthSession = {
  email: string;
  name?: string;
};

export function saveAuthSession(session: AuthSession) {
  void session;
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event("akai-auth-updated"));
  window.dispatchEvent(new Event("akai-account-updated"));
}

export function loadAuthSession(): AuthSession | null {
  return null;
}

export function clearAuthSession() {
  if (typeof window === "undefined") return;
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
