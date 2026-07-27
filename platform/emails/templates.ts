export type EmailTemplateProps = {
  previewText: string;
  heading: string;
  body: string;
  ctaLabel?: string;
  ctaHref?: string;
};

/**
 * Transactional email templates will render from this module (Phase 3+).
 * Keep copy localization-ready for EN/FR/AR/ES/HA/IG/YO.
 */
export function buildPlainTextEmail(props: EmailTemplateProps): string {
  const lines = [props.heading, "", props.body];
  if (props.ctaLabel && props.ctaHref) {
    lines.push("", `${props.ctaLabel}: ${props.ctaHref}`);
  }
  return lines.join("\n");
}
