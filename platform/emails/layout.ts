import { emailDefaults, emailTokens } from "@/emails/tokens";
import type { DetailRow, EmailContent, OrderLineVar } from "@/emails/types";

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

export function greet(name?: string): string {
  const trimmed = name?.trim();
  return trimmed ? `Dear ${trimmed},` : "Dear client,";
}

function detailRowsHtml(rows: DetailRow[]): string {
  if (!rows.length) return "";
  const cells = rows
    .map(
      (row) => `
      <tr>
        <td style="padding:8px 0;font-family:${emailTokens.fontSans};font-size:13px;letter-spacing:0.04em;text-transform:uppercase;color:${emailTokens.muted};width:38%;vertical-align:top;">
          ${escapeHtml(row.label)}
        </td>
        <td style="padding:8px 0;font-family:${emailTokens.fontSans};font-size:15px;color:${emailTokens.charcoal};vertical-align:top;">
          ${escapeHtml(row.value)}
        </td>
      </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0 8px;border-top:1px solid ${emailTokens.border};border-bottom:1px solid ${emailTokens.border};">
      ${cells}
    </table>`;
}

function itemsHtml(items: OrderLineVar[]): string {
  if (!items.length) return "";
  const rows = items
    .map(
      (item) => `
      <tr>
        <td style="padding:10px 0;font-family:${emailTokens.fontSans};font-size:15px;color:${emailTokens.charcoal};border-bottom:1px solid ${emailTokens.border};">
          ${escapeHtml(item.name)}
          <div style="margin-top:2px;font-size:13px;color:${emailTokens.muted};">Qty ${item.quantity}</div>
        </td>
        <td align="right" style="padding:10px 0;font-family:${emailTokens.fontSans};font-size:15px;color:${emailTokens.charcoal};border-bottom:1px solid ${emailTokens.border};white-space:nowrap;">
          ${item.priceLabel ? escapeHtml(item.priceLabel) : ""}
        </td>
      </tr>`,
    )
    .join("");

  return `
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin:8px 0 16px;">
      <tr>
        <td colspan="2" style="padding:0 0 8px;font-family:${emailTokens.fontSans};font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:${emailTokens.primary};">
          Your selection
        </td>
      </tr>
      ${rows}
    </table>`;
}

function ctaHtml(label: string, href: string): string {
  return `
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:28px 0 8px;">
      <tr>
        <td align="center" bgcolor="${emailTokens.primary}" style="border-radius:2px;">
          <a href="${escapeHtml(href)}" style="display:inline-block;padding:14px 28px;font-family:${emailTokens.fontSans};font-size:14px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;color:${emailTokens.primaryForeground};">
            ${escapeHtml(label)}
          </a>
        </td>
      </tr>
    </table>`;
}

function paragraphsHtml(paragraphs: string[]): string {
  return paragraphs
    .map(
      (p) => `
      <p style="margin:0 0 16px;font-family:${emailTokens.fontSans};font-size:16px;line-height:1.65;color:${emailTokens.charcoal};">
        ${escapeHtml(p)}
      </p>`,
    )
    .join("");
}

/**
 * Luxury transactional shell: plum header, cream canvas, gold hairline, charcoal body.
 */
export function renderEmailShell(content: EmailContent): string {
  const preview = escapeHtml(content.previewText);
  const heading = escapeHtml(content.heading);
  const eyebrow = content.eyebrow
    ? `<p style="margin:0 0 10px;font-family:${emailTokens.fontSans};font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:${emailTokens.primary};">${escapeHtml(content.eyebrow)}</p>`
    : "";
  const secondary = content.secondaryNote
    ? `<p style="margin:20px 0 0;font-family:${emailTokens.fontSans};font-size:13px;line-height:1.6;color:${emailTokens.muted};">${escapeHtml(content.secondaryNote)}</p>`
    : "";
  const unsubscribe = content.unsubscribeUrl
    ? `<p style="margin:16px 0 0;font-family:${emailTokens.fontSans};font-size:12px;line-height:1.5;color:${emailTokens.muted};">
         Prefer fewer messages? <a href="${escapeHtml(content.unsubscribeUrl)}" style="color:${emailTokens.primary};text-decoration:underline;">Update email preferences</a>
       </p>`
    : "";

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>${heading}</title>
  <!--[if mso]>
  <style type="text/css">
    body, table, td { font-family: Arial, sans-serif !important; }
  </style>
  <![endif]-->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Playfair+Display:wght@500;600&display=swap" rel="stylesheet" />
</head>
<body style="margin:0;padding:0;background-color:${emailTokens.cream};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;mso-hide:all;">
    ${preview}
  </div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${emailTokens.cream};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background-color:${emailTokens.white};border:1px solid ${emailTokens.border};">
          <tr>
            <td style="background:linear-gradient(160deg, ${emailTokens.brandDeep} 0%, ${emailTokens.brandField} 55%, ${emailTokens.primary} 100%);padding:28px 32px;text-align:center;">
              <p style="margin:0;font-family:${emailTokens.fontDisplay};font-size:22px;letter-spacing:0.12em;text-transform:uppercase;color:${emailTokens.accent};">
                ${escapeHtml(emailDefaults.brandName)}
              </p>
              <p style="margin:10px 0 0;font-family:${emailTokens.fontSans};font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#E8DFD0;">
                ${escapeHtml(emailDefaults.tagline)}
              </p>
            </td>
          </tr>
          <tr>
            <td style="height:3px;background-color:${emailTokens.accent};font-size:0;line-height:0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding:36px 32px 28px;">
              ${eyebrow}
              <h1 style="margin:0 0 20px;font-family:${emailTokens.fontDisplay};font-size:28px;font-weight:600;line-height:1.25;color:${emailTokens.charcoal};">
                ${heading}
              </h1>
              ${paragraphsHtml(content.paragraphs)}
              ${content.details ? detailRowsHtml(content.details) : ""}
              ${content.items ? itemsHtml(content.items) : ""}
              ${content.cta ? ctaHtml(content.cta.label, content.cta.href) : ""}
              ${secondary}
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 32px;border-top:1px solid ${emailTokens.border};background-color:${emailTokens.cream};">
              <p style="margin:0;font-family:${emailTokens.fontSans};font-size:13px;line-height:1.6;color:${emailTokens.muted};">
                Client services · <a href="mailto:${escapeHtml(emailDefaults.supportEmail)}" style="color:${emailTokens.primary};text-decoration:none;">${escapeHtml(emailDefaults.supportEmail)}</a><br />
                <a href="${escapeHtml(emailDefaults.websiteUrl)}" style="color:${emailTokens.primary};text-decoration:none;">${escapeHtml(emailDefaults.websiteLabel)}</a>
              </p>
              <p style="margin:14px 0 0;font-family:${emailTokens.fontSans};font-size:12px;line-height:1.5;color:${emailTokens.muted};">
                ${escapeHtml(emailDefaults.brandName)} · Port Harcourt, Rivers State, Nigeria
              </p>
              ${unsubscribe}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function renderPlainText(content: EmailContent): string {
  const lines: string[] = [
    emailDefaults.brandName,
    emailDefaults.tagline,
    "",
    content.heading,
    "",
    ...content.paragraphs,
  ];

  if (content.details?.length) {
    lines.push("");
    for (const row of content.details) {
      lines.push(`${row.label}: ${row.value}`);
    }
  }

  if (content.items?.length) {
    lines.push("", "Your selection:");
    for (const item of content.items) {
      const price = item.priceLabel ? ` — ${item.priceLabel}` : "";
      lines.push(`- ${item.name} × ${item.quantity}${price}`);
    }
  }

  if (content.cta) {
    lines.push("", `${content.cta.label}: ${content.cta.href}`);
  }

  if (content.secondaryNote) {
    lines.push("", content.secondaryNote);
  }

  lines.push(
    "",
    `Client services: ${emailDefaults.supportEmail}`,
    emailDefaults.websiteLabel,
  );

  if (content.unsubscribeUrl) {
    lines.push("", `Email preferences: ${content.unsubscribeUrl}`);
  }

  return lines.join("\n");
}

export function resolveAppUrl(appUrl?: string): string {
  return (appUrl || emailDefaults.appUrl).replace(/\/$/, "");
}

export function resolveSupportEmail(supportEmail?: string): string {
  return supportEmail || emailDefaults.supportEmail;
}
