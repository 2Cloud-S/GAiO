import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getWriteClient, isWriteConfigured } from "@/sanity/lib/write-client";

type Params = { params: Promise<{ id: string }> };

function viewedCookieName(postId: string) {
  return `gaio_viewed_${postId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80)}`;
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  if (!id || id.startsWith("sample-")) {
    return NextResponse.json(
      { error: "Views are only available for Sanity posts." },
      { status: 400 },
    );
  }

  if (!isWriteConfigured()) {
    return NextResponse.json(
      {
        error:
          "SANITY_API_WRITE_TOKEN is not configured. Add it on Vercel / .env.local.",
      },
      { status: 503 },
    );
  }

  const client = getWriteClient();
  if (!client) {
    return NextResponse.json({ error: "Write client unavailable." }, { status: 503 });
  }

  const cookieName = viewedCookieName(id);
  const alreadyViewed = request.headers
    .get("cookie")
    ?.split(";")
    .some((c) => c.trim().startsWith(`${cookieName}=`));

  const current = await client.fetch<{ views?: number; slug?: string } | null>(
    `*[_type == "post" && _id == $id][0]{ views, "slug": slug.current }`,
    { id },
  );

  if (!current) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  if (alreadyViewed) {
    return NextResponse.json({
      views: current.views ?? 0,
      counted: false,
    });
  }

  const patched = await client
    .patch(id)
    .setIfMissing({ views: 0 })
    .inc({ views: 1 })
    .commit<{ views?: number }>();

  revalidateTag("sanity-post", "max");
  revalidatePath("/blog");
  revalidatePath("/");
  if (current.slug) revalidatePath(`/blog/${current.slug}`);

  const response = NextResponse.json({
    views: patched.views ?? (current.views ?? 0) + 1,
    counted: true,
  });

  // Session-ish window: 12 hours — refresh within window won't re-count.
  response.cookies.set(cookieName, "1", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 12,
    secure: process.env.NODE_ENV === "production",
  });

  return response;
}
