import type { CSSProperties, ReactNode } from "react";

/** A decorative Android-style phone frame. `color` tints the screen via the --app CSS variable. */
export function Phone({ children, color = "#5cc8b8", className = "" }: { children: ReactNode; color?: string; className?: string }) {
  return (
    <div className={`phone ${className}`} style={{ "--app": color } as CSSProperties}>
      <div className="phone-screen">
        <div className="phone-status" aria-hidden="true">
          <span>9:41</span>
          <span className="phone-camera" />
          <span className="phone-icons"><i /><i /><i /></span>
        </div>
        {children}
        <div className="phone-gesture" aria-hidden="true" />
      </div>
    </div>
  );
}
