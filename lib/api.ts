import { loadAuthSession } from "@/lib/auth-session";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ??
  "http://localhost:4000";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit & { auth?: boolean } = {}
): Promise<T> {
  const { auth = true, headers, ...rest } = options;
  const session = auth ? loadAuthSession() : null;

  const res = await fetch(`${API_BASE}${path}`, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      ...(session?.email ? { "X-User-Email": session.email } : {}),
      ...headers,
    },
  });

  if (res.status === 204) {
    return undefined as T;
  }

  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message =
      typeof body?.error === "string"
        ? body.error
        : `Request failed (${res.status})`;
    throw new ApiError(message, res.status, body);
  }

  return body as T;
}

export type ApiUser = {
  id: string;
  email: string;
  name: string | null;
  about: string;
  profileImage: string | null;
};

export async function registerUser(input: {
  email: string;
  password: string;
  name?: string;
}) {
  return apiFetch<{ user: ApiUser }>("/api/auth/register", {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
}

export async function loginUser(input: { email: string; password: string }) {
  return apiFetch<{ user: ApiUser }>("/api/auth/login", {
    method: "POST",
    auth: false,
    body: JSON.stringify(input),
  });
}
