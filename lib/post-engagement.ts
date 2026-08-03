/** Client-side keys so anonymous visitors don't double-count likes/views. */

export function likedStorageKey(postId: string) {
  return `gaio-liked:${postId}`;
}

export function dislikedStorageKey(postId: string) {
  return `gaio-disliked:${postId}`;
}

export function viewedStorageKey(postId: string) {
  return `gaio-viewed:${postId}`;
}

export function readFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeFlag(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.localStorage.setItem(key, "1");
    else window.localStorage.removeItem(key);
  } catch {
    /* private mode / quota */
  }
}

export function readSessionFlag(key: string): boolean {
  if (typeof window === "undefined") return false;
  try {
    return window.sessionStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

export function writeSessionFlag(key: string, value: boolean) {
  if (typeof window === "undefined") return;
  try {
    if (value) window.sessionStorage.setItem(key, "1");
    else window.sessionStorage.removeItem(key);
  } catch {
    /* private mode / quota */
  }
}
