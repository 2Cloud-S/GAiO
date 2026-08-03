import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import type { PublicComment } from "@/lib/comments";
import { getClient } from "@/sanity/lib/client";
import { commentsByPostQuery } from "@/sanity/lib/queries";
import { getWriteClient, isWriteConfigured } from "@/sanity/lib/write-client";

type Params = { params: Promise<{ id: string }> };

export type { PublicComment };

export async function GET(_request: Request, { params }: Params) {
  const { id } = await params;
  const client = getClient();
  if (!client || id.startsWith("sample-")) {
    return NextResponse.json({ comments: [] as PublicComment[] });
  }

  try {
    const comments = await client.fetch<PublicComment[]>(
      commentsByPostQuery,
      { postId: id },
      { next: { revalidate: 30, tags: ["sanity-comment", `sanity-comment-${id}`] } },
    );
    return NextResponse.json({ comments: comments ?? [] });
  } catch (error) {
    console.error("[comments] fetch failed", error);
    return NextResponse.json({ comments: [] as PublicComment[] });
  }
}

export async function POST(request: Request, { params }: Params) {
  const { id } = await params;
  if (!id || id.startsWith("sample-")) {
    return NextResponse.json(
      { error: "Comments require a published Sanity post." },
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

  let payload: { name?: string; email?: string; body?: string };
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const name = payload.name?.trim() ?? "";
  const email = payload.email?.trim() ?? "";
  const body = payload.body?.trim() ?? "";

  if (name.length < 1 || name.length > 80) {
    return NextResponse.json(
      { error: "Name is required (max 80 characters)." },
      { status: 400 },
    );
  }
  if (body.length < 2 || body.length > 2000) {
    return NextResponse.json(
      { error: "Comment must be between 2 and 2000 characters." },
      { status: 400 },
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Email looks invalid." }, { status: 400 });
  }

  const post = await client.fetch<{ _id: string; slug?: string } | null>(
    `*[_type == "post" && _id == $id][0]{ _id, "slug": slug.current }`,
    { id },
  );
  if (!post) {
    return NextResponse.json({ error: "Post not found." }, { status: 404 });
  }

  const createdAt = new Date().toISOString();
  const doc = await client.create({
    _type: "comment",
    name,
    ...(email ? { email } : {}),
    body,
    createdAt,
    approved: true,
    post: { _type: "reference", _ref: id },
  });

  await client
    .patch(id)
    .setIfMissing({ comments: 0 })
    .inc({ comments: 1 })
    .commit();

  revalidateTag("sanity-post", "max");
  revalidateTag("sanity-comment", "max");
  revalidateTag(`sanity-comment-${id}`, "max");
  revalidatePath("/blog");
  revalidatePath("/");
  if (post.slug) revalidatePath(`/blog/${post.slug}`);

  const comment: PublicComment = {
    _id: doc._id,
    name,
    body,
    createdAt,
  };

  return NextResponse.json({ comment }, { status: 201 });
}
