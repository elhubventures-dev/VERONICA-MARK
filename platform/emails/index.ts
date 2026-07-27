export { emailDefaults, emailTokens } from "@/emails/tokens";
export {
  EMAIL_TEMPLATE_KEYS,
  type EmailAudience,
  type EmailChannel,
  type EmailContent,
  type EmailMeta,
  type EmailTemplateKey,
  type EmailVarsMap,
  type RenderedEmail,
} from "@/emails/types";
export {
  emailTemplateMeta,
  isEmailTemplateKey,
  listEmailTemplates,
  renderEmail,
} from "@/emails/render";
export { emailPreviewSamples } from "@/emails/preview-samples";
export { buildPlainTextEmail, type EmailTemplateProps } from "@/emails/templates";

