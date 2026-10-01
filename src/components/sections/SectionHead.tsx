interface Props { id: string; index: string; kicker: string; title: string; intro?: string }

/** Section heading: a technical index tag, a display title and an optional intro. */
export function SectionHead({ id, index, kicker, title, intro }: Props) {
  return (
    <header className="section-head reveal">
      <p className="kicker"><span>{index}</span>{kicker}</p>
      <h2 id={id}>{title}</h2>
      {intro && <p className="section-intro">{intro}</p>}
    </header>
  );
}
