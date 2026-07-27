/**
 * @deprecated Prefer `renderEmail` from `@/emails` for branded templates.
 * Kept for backwards compatibility with early plain-text helpers.
 */
export type EmailTemplateProps = {
  previewText: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
};

export function buildPlainTextEmail(props: EmailTemplateProps): string {
  const lines = [props.heading, "", props.body];
  if (props.ctaLabel && props.ctaHref) {
    lines.push("", `${props.ctaLabel}: ${props.ctaHref}`);
  }
  return lines.join("\n");
}
