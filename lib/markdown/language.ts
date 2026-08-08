const LANGUAGE_ALIASES: Record<string, string> = {
  ts: "typescript",
  tsx: "tsx",
  js: "javascript",
  jsx: "jsx",
  py: "python",
  rb: "ruby",
  sh: "bash",
  shell: "bash",
  zsh: "bash",
  yml: "yaml",
  md: "markdown",
  golang: "go",
  plaintext: "text",
  txt: "text",
  docker: "dockerfile",
};

/** Map fence labels (```ts, ```go) to highlight.js language ids. */
export function normalizeLanguage(lang?: string): string {
  if (!lang?.trim()) return "text";
  const key = lang.trim().toLowerCase();
  return LANGUAGE_ALIASES[key] ?? key;
}
