import { revalidatePath } from "next/cache";
import { NextRequest, NextResponse } from "next/server";

/**
 * On-demand revalidation endpoint.
 *
 * Call this from a GitHub webhook or Vercel deploy hook to
 * instantly refresh cached pages after a new repo push.
 *
 * Usage:
 *   POST /api/revalidate
 *   Headers: { "x-revalidate-token": "<REVALIDATE_SECRET>" }
 *
 * Set REVALIDATE_SECRET as an environment variable in Vercel.
 */
export async function POST(request: NextRequest) {
  const token = request.headers.get("x-revalidate-token");
  const secret = process.env.REVALIDATE_SECRET;

  // If no secret is configured, allow (dev mode). In production, require it.
  if (secret && token !== secret) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    // Revalidate the pages that display project data
    revalidatePath("/");
    revalidatePath("/projects");

    return NextResponse.json({
      revalidated: true,
      timestamp: Date.now(),
      paths: ["/", "/projects"],
    });
  } catch (err) {
    return NextResponse.json(
      { error: "Revalidation failed", detail: String(err) },
      { status: 500 }
    );
  }
}
