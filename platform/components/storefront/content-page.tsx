import { Reveal } from "@/components/storefront/reveal";

type ContentSection = { title: string; body: string };

export function ContentPage({
  eyebrow,
  title,
  introduction,
  sections,
  hideHeader = false,
}: {
  eyebrow: string;
  title: string;
  introduction: string;
  sections: ContentSection[];
  /** When a PageBanner already supplies the title block */
  hideHeader?: boolean;
}) {
  return (
    <article className="px-5 py-16 sm:px-8 sm:py-24">
      <div className="mx-auto max-w-3xl text-center">
        {!hideHeader ? (
          <Reveal>
            <p className="text-xs font-semibold tracking-[0.2em] text-primary uppercase">{eyebrow}</p>
            <h1 className="mt-4 text-5xl text-balance sm:text-6xl">{title}</h1>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">{introduction}</p>
          </Reveal>
        ) : null}
        <div
          className={
            hideHeader
              ? "space-y-10 text-left"
              : "mt-14 space-y-10 border-t border-border pt-10 text-left"
          }
        >
          {sections.map((section, index) => (
            <Reveal key={section.title} delay={index * 0.06} variant="zoom">
              <section className="text-center">
                <h2 className="text-2xl">{section.title}</h2>
                <p className="mt-3 leading-7 text-muted-foreground">{section.body}</p>
              </section>
            </Reveal>
          ))}
        </div>
      </div>
    </article>
  );
}
