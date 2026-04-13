import type { CSSProperties, ReactNode } from "react";

export type PreTextProps = {
  children: ReactNode;
  lines: number;
  lineHeightPx: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * Fixed-line text block so the vertical budget is known before rich content
 * (images, embeds) resolves. Pair with `lines * lineHeightPx` in height math.
 */
export function PreText({ children, lines, lineHeightPx, className, style }: PreTextProps) {
  const height = lines * lineHeightPx;
  return (
    <div
      className={className}
      style={{
        height,
        lineHeight: `${lineHeightPx}px`,
        overflow: "hidden",
        display: "-webkit-box",
        WebkitBoxOrient: "vertical",
        WebkitLineClamp: lines,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
