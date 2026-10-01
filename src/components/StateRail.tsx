import { useEffect, useState } from "react";
import { envById } from "../engine/environments";
import type { EnvId } from "../engine/environments";
import { subscribeEnv } from "../engine/ThemeController";

/** Desktop-only indicator of which environment ("state") the page is in, with overall progress. */
export function StateRail() {
  const [state, setState] = useState<{ active: number; order: EnvId[] }>({ active: 0, order: [] });
  useEffect(() => subscribeEnv((active, order) => setState({ active, order: [...order] })), []);

  const jump = (i: number) => {
    const el = document.querySelectorAll<HTMLElement>("[data-env]")[i];
    el?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="state-rail" aria-label="Page environments">
      <span className="state-track" aria-hidden="true"><i /></span>
      <ol>
        {state.order.map((id, i) => (
          <li key={id}>
            <button type="button" onClick={() => jump(i)} aria-current={state.active === i ? "true" : undefined}>
              <span className="state-label">{String(i).padStart(2, "0")} {envById(id).label}</span>
              <span className="state-dot" aria-hidden="true" />
            </button>
          </li>
        ))}
      </ol>
    </nav>
  );
}
