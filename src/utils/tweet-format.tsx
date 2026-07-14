import type { ReactNode } from "react";

/** Split tweet text into plain / hashtag / mention / url segments for X-style rendering. */
export function formatTweetText(text: string): ReactNode[] {
  if (!text) return [];

  // URL | hashtag | mention
  const pattern = /(https?:\/\/[^\s]+)|(#[\w_]+)|(@[\w]+)/g;
  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = pattern.exec(text)) !== null) {
    const token = match[0];
    const index = match.index;

    if (lastIndex < index) {
      nodes.push(
        <span key={`t-${key++}`}>{text.slice(lastIndex, index)}</span>
      );
    }

    if (match[1]) {
      const display =
        token.length > 36 ? `${token.slice(0, 33)}…` : token;
      nodes.push(
        <span key={`u-${key++}`} className="text-[#1d9bf0] hover:underline">
          {display}
        </span>
      );
    } else {
      nodes.push(
        <span key={`h-${key++}`} className="text-[#1d9bf0] hover:underline">
          {token}
        </span>
      );
    }

    lastIndex = index + token.length;
  }

  if (lastIndex < text.length) {
    nodes.push(<span key={`t-${key++}`}>{text.slice(lastIndex)}</span>);
  }

  return nodes;
}

export function weightedTweetLength(text: string): number {
  // Approximate X counting: URLs count as 23 chars
  return text
    .replace(/https?:\/\/[^\s]+/g, "x".repeat(23))
    .length;
}
