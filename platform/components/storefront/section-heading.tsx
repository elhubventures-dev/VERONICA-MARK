import { cn } from "@/lib/utils";

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  return (
    <div className={cn("mb-8 max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow ? (
        <p className="mb-3 text-xs font-semibold tracking-[0.2em] text-primary uppercase">{eyebrow}</p>
      ) : null}
      <h2 className="text-3xl text-balance sm:text-4xl">{title}</h2>
      {description ? (
        <p className="mt-3 text-base leading-7 text-muted-foreground">{description}</p>
      ) : null}
    </div>
  );
}
