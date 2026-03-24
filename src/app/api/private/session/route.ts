import { NextRequest, NextResponse } from "next/server";
import { getAccessTokenFromRequest, validateSupabaseAccessToken } from "@/lib/serverAuth";

export async function GET(request: NextRequest) {
  const token = getAccessTokenFromRequest(request);

  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const validation = await validateSupabaseAccessToken(token);
  if (!validation.valid) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    ok: true,
    userId: validation.user?.id ?? null,
    email: validation.user?.email ?? null,
  });
}
