import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { getWriteClient, isWriteConfigured } from "@/sanity/lib/write-client";

type Params = { params: Promise<{ id: string }> };

function likedCookieName(postId: string) {
  return `gaio_liked_${postId.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 80)}`;
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  if (!id || id.startsWith("sample-")) {
    return NextResponse.json(
      { error: "Likes are only available for Sanity posts." },
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

  let action: "like" | "unlike" = "like";
  try {
    const body = (await request.json()) as { action?: string };
    if (body.action === "unlike") action = "unlike";
  } catch {
    /* default like */
  }

  const cookieName = likedCookieName(id);
  const alreadyLiked = request.headers
    .get("cookie")
    ?.split(";")
    .some((c) => c.trim().startsWith(`${cookieName}=1`));

  if (action === "like" && alreadyLiked) {
    const doc = await client.fetch<{ likes?: number } | null>(
      `*[_type == "post" && _id == $id][0]{ likes }`,
      { id },
    );
    return NextResponse.json({ likes: doc?.likes ?? 0, liked: true });
  }

  if (action === "unlike" && !alreadyLiked) {
    const doc = await client.fetch<{ likes?: number } | null>(
      `*[_type == "post" && _id == $id][0]{ likes }`,
      { id },
    );
    return NextResponse.json({ likes: doc?.likes ?? 0, liked: false });
  }

  const exists = await client.fetch<string | null>(
    `*[_type == "post" && _id == $id][0]._id`,
    { id },
  );
  if (!exists) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const patch = client.patch(id).setIfMissing({ likes: 0 });
  const patched =
    action === "like"
      ? await patch.inc({ likes: 1 }).commit<{ likes?: number }>()
      : await patch.dec({ likes: 1 }).commit<{ likes?: number }>();

  let likes = patched.likes ?? 0;
  if (likes < 0) {
    await client.patch(id).set({ likes: 0 }).commit();
    likes = 0;
  }

  revalidateTag("sanity-post", "max");
  revalidatePath("/blog");
  revalidatePath("/");

  const response = NextResponse.json({
    likes,
    liked: action === "like",
  });

  const maxAge = 60 * 60 * 24 * 365;
  if (action === "like") {
    response.cookies.set(cookieName, "1", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge,
      secure: process.env.NODE_ENV === "production",
    });
  } else {
    response.cookies.set(cookieName, "", {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: 0,
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}
