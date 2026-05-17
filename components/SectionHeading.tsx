export function SectionHeading({
  eyebrow,
  title,
  summary
}: {
  eyebrow: string;
  title: string;
  summary: string;
}) {
  return (
    <div className="max-w-3xl">
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="section-title mt-3 text-3xl font-semibold md:text-5xl">{title}</h2>
      <p className="section-summary mt-4 text-base leading-7 md:text-lg">{summary}</p>
    </div>
  );
}
