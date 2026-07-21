import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

/**
 * On-demand revalidation webhook.
 *
 * The Blog CMS pings this route on publish / unpublish / delete so the blog
 * pages rebuild in seconds instead of waiting for the hourly ISR window.
 *
 * Secured by a shared secret (BLOG_REVALIDATE_SECRET). The CMS sends the same
 * value it has in FRONTEND_REVALIDATE_SECRET.
 */
export async function POST(req: NextRequest) {
  let body: { secret?: string; slug?: string } = {};
  try {
    body = await req.json();
  } catch {
    // allow empty body
  }

  const expected = process.env.BLOG_REVALIDATE_SECRET;
  if (!expected || body.secret !== expected) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  // Always refresh the listing; refresh the specific article when provided.
  revalidatePath("/blog");
  if (body.slug) {
    revalidatePath(`/blog/${body.slug}`);
  }

  return NextResponse.json({ revalidated: true, slug: body.slug ?? null, now: Date.now() });
}
