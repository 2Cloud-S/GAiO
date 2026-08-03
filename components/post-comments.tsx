"use client";

import { FormEvent, useState } from "react";
import type { PublicComment } from "@/lib/comments";

export type PostCommentsProps = {
  postId: string;
  initialComments?: PublicComment[];
  persist?: boolean;
};

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export function PostComments({
  postId,
  initialComments = [],
  persist = true,
}: PostCommentsProps) {
  const [comments, setComments] = useState(initialComments);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [body, setBody] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!persist) {
      setError("Comments are available on published CMS posts.");
      return;
    }

    setPending(true);
    setError(null);
    setSuccess(false);

    try {
      const res = await fetch(
        `/api/posts/${encodeURIComponent(postId)}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email: email || undefined, body }),
        },
      );
      const data = (await res.json()) as {
        comment?: PublicComment;
        error?: string;
      };
      if (!res.ok || !data.comment) {
        setError(data.error || "Could not post comment.");
        return;
      }
      setComments((list) => [data.comment!, ...list]);
      setBody("");
      setSuccess(true);
    } catch {
      setError("Could not reach the server.");
    } finally {
      setPending(false);
    }
  };

  return (
    <section className="post-comments" aria-labelledby="post-comments-heading">
      <div className="post-comments-head">
        <p className="eyebrow">Discussion</p>
        <h2 id="post-comments-heading" className="display section-title">
          Leave a signal.
        </h2>
        <p className="lede post-comments-lede">
          Short notes welcome. Approved comments show here after submit.
        </p>
      </div>

      <form className="post-comment-form" onSubmit={(e) => void onSubmit(e)} noValidate>
        <div className="post-comment-grid">
          <label htmlFor="comment-name">
            Name
            <input
              id="comment-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              maxLength={80}
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={pending}
            />
          </label>
          <label htmlFor="comment-email">
            Email <span className="optional">(optional)</span>
            <input
              id="comment-email"
              name="email"
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={pending}
            />
          </label>
        </div>
        <label htmlFor="comment-body">
          Comment
          <textarea
            id="comment-body"
            name="body"
            required
            minLength={2}
            maxLength={2000}
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={pending}
            placeholder="What stood out — or what would you challenge?"
          />
        </label>
        <div className="post-comment-actions">
          <button
            type="submit"
            className="button button-primary"
            disabled={pending || !name.trim() || body.trim().length < 2}
          >
            {pending ? "Sending…" : "Post comment"}
          </button>
          {success ? (
            <p className="post-comment-status" role="status">
              Posted.
            </p>
          ) : null}
          {error ? (
            <p className="post-comment-status is-error" role="alert">
              {error}
            </p>
          ) : null}
        </div>
      </form>

      <div className="post-comment-list">
        <p className="meta">
          {comments.length} {comments.length === 1 ? "comment" : "comments"}
        </p>
        {comments.length === 0 ? (
          <p className="post-comment-empty">No comments yet. Start the thread.</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment._id}>
                <div className="post-comment-meta">
                  <strong>{comment.name}</strong>
                  {comment.createdAt ? (
                    <time dateTime={comment.createdAt}>
                      {formatDate(comment.createdAt)}
                    </time>
                  ) : null}
                </div>
                <p>{comment.body}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
