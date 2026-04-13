import type { CSSProperties, ReactNode } from "react";

export type PreTextProps = {
  children: ReactNode;
  lines: number;
  lineHeightPx: number;
  className?: string;
  style?: CSSProperties;
};

/**
 * CSS line-clamp placeholder for a rough vertical budget (no `@chenglou/pretext`).
 * For DOM-free multiline measurement aligned with real typography, use
 * `chrono-virtual/pretext` (`PretextBodyBlock`, `useBodyTextBlockLayout`, etc.).
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
