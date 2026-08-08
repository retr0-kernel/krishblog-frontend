/** Images are hosted in a public GitHub repo — not on the blog backend. */
export const IMAGES_REPO_GITHUB =
    process.env.NEXT_PUBLIC_IMAGES_REPO_URL ?? "https://github.com/retr0-kernel/krishblog-images";

export const IMAGES_RAW_BASE =
    process.env.NEXT_PUBLIC_IMAGES_REPO_RAW_BASE ??
    "https://raw.githubusercontent.com/retr0-kernel/krishblog-images/main/";

/** Turn a repo-relative path or full URL into a usable image URL. */
export function resolveImageUrl(input: string): string {
    const trimmed = input.trim();
    if (!trimmed) return "";
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    return IMAGES_RAW_BASE + trimmed.replace(/^\/+/, "");
}

/** Show repo-relative path in the admin when the URL points at the images repo. */
export function imageRepoPath(url: string): string {
    if (url.startsWith(IMAGES_RAW_BASE)) return url.slice(IMAGES_RAW_BASE.length);
    return url;
}

export function imagesRepoMarkdown(path: string, alt = "image"): string {
    return `![${alt}](${resolveImageUrl(path)})`;
}
