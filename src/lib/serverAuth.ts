import type { NextRequest } from "next/server";

const ACCESS_TOKEN_COOKIE = "oebook-access-token";

const getSupabaseAuthConfig = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    "";

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return { supabaseUrl, supabaseKey };
};

export const getAccessTokenFromRequest = (request: NextRequest) => {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    return authHeader.slice("Bearer ".length).trim();
  }

  const cookieToken = request.cookies.get(ACCESS_TOKEN_COOKIE)?.value;
  return cookieToken?.trim() || null;
};

export const validateSupabaseAccessToken = async (token: string) => {
  const authConfig = getSupabaseAuthConfig();
  if (!authConfig) {
    return { valid: false as const, reason: "missing_env" as const };
  }

  const { supabaseUrl, supabaseKey } = authConfig;
  const response = await fetch(`${supabaseUrl}/auth/v1/user`, {
    method: "GET",
    headers: {
      apikey: supabaseKey,
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    return { valid: false as const, reason: "invalid_token" as const };
  }

  const user = await response.json();
  return { valid: true as const, user };
};

export const ACCESS_TOKEN_COOKIE_NAME = ACCESS_TOKEN_COOKIE;
