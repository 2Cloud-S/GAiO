"use client";

import { useEffect, useState, useEffectEvent } from "react";
import {
  readSessionFlag,
  viewedStorageKey,
  writeSessionFlag,
} from "@/lib/post-engagement";

export type PostViewsProps = {
  postId: string;
  initialViews?: number;
  persist?: boolean;
};

function formatViews(n: number) {
  if (n >= 1000) return `${Math.round(n / 100) / 10}k`;
  return String(n);
}

export function PostViews({
  postId,
  initialViews = 0,
  persist = true,
}: PostViewsProps) {
  const [views, setViews] = useState(initialViews);

  const recordView = useEffectEvent(async () => {
    if (!persist) return;
    const key = viewedStorageKey(postId);
    if (readSessionFlag(key)) return;
    writeSessionFlag(key, true);

    try {
      const res = await fetch(`/api/posts/${encodeURIComponent(postId)}/view`, {
        method: "POST",
      });
      if (!res.ok) return;
      const data = (await res.json()) as { views?: number };
      if (typeof data.views === "number") setViews(data.views);
    } catch {
      /* silent — display still shows SSR count */
    }
  });

  useEffect(() => {
    void recordView();
  }, [postId, recordView]);

  return (
    <p className="meta post-stat-line" aria-live="polite">
      {formatViews(views)} {views === 1 ? "view" : "views"}
    </p>
  );
}
