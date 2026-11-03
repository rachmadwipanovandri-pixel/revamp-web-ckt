/** Emphasize existing closing words without rewriting or splitting their text. */
export function HighlightedText({ text }: { text: string }) {
  const words = [...text.matchAll(/\S+/g)];
  const count = words.length > 7 ? 3 : 2;
  const splitAt = words[Math.max(0, words.length - count)]?.index ?? 0;
  return <>{text.slice(0, splitAt)}<span className="headline-highlight">{text.slice(splitAt)}</span></>;
}
