import { storefrontContact } from "@/lib/storefront/contact";

export type LegalSection = {
  id: string;
  title: string;
  paragraphs: string[];
};

export const LEGAL_LAST_UPDATED = "26 July 2026";

export const termsSections: LegalSection[] = [
  {
    id: "agreement",
    title: "Agreement to these terms",
    paragraphs: [
      "These Terms of Use (“Terms”) govern your access to and use of the VERONICA MARK website, storefront and related services (the “Services”), operated from Nigeria and serving clients worldwide.",
      `By browsing, creating an account or placing an order, you agree to these Terms. If you do not agree, please do not use the Services. For questions, contact ${storefrontContact.email}.`,
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility & accounts",
    paragraphs: [
      "You must be able to form a binding contract under applicable law to place an order. You are responsible for accurate account details and for keeping your password confidential.",
      "Guest checkout is available. Creating an account lets you track orders, invoices, wishlist and related features. You must not misuse another person’s account or credentials.",
    ],
  },
  {
    id: "orders",
    title: "Orders, pricing & availability",
    paragraphs: [
      "An order is accepted when we issue confirmation. Until then, we may decline or correct an order for reasons including availability, pricing error, suspected fraud or shipping restrictions.",
      "Product prices displayed on the storefront include tax. Currency presentation may vary by region (Nigerian Naira for visitors in Nigeria; USD display outside Nigeria at our published fixed rate). Checkout charges are processed in NGN via our payment provider.",
      "Images and descriptions are for presentation; slight variations in packaging or batch presentation may occur. We aim for accuracy but do not guarantee that every screen display matches physical goods exactly.",
    ],
  },
  {
    id: "payment",
    title: "Payment",
    paragraphs: [
      "Payment is processed securely through Paystack (and any other providers we enable). VERONICA MARK does not store full card details on its own servers.",
      "By submitting payment, you confirm that you are authorised to use the selected payment method. Orders may be held or cancelled if payment cannot be completed or is flagged for review.",
    ],
  },
  {
    id: "shipping",
    title: "Shipping & delivery",
    paragraphs: [
      "Orders are fulfilled from our hub in Port Harcourt, Rivers State, Nigeria. Available shipping methods and fees are shown at checkout and depend on destination.",
      "Within Nigeria: intra-city drop in Rivers (Port Harcourt), interstate shipping to other states, and express courier options apply as listed at checkout. Outside Nigeria, international shipping is offered at the rate shown at checkout.",
      "Delivery estimates are indicative and start after dispatch. Delays may occur due to carriers, customs, weather or events beyond our reasonable control. Risk of loss typically passes on delivery according to the carrier’s practices and applicable law.",
    ],
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    paragraphs: [
      "Eligible unopened products in original condition may be returned in accordance with instructions from client services. Contact us before sending any item.",
      "Opened fragrances are generally not eligible for return for hygiene and authenticity reasons, except where required by law or if goods arrive damaged, defective or incorrect.",
      "Approved returns may be refunded to the original payment method after inspection. Shipping costs for returns are handled as advised by client services for each case.",
    ],
  },
  {
    id: "promotions",
    title: "Promotions & opening edit",
    paragraphs: [
      "Coupons, flash sales (including the Private Opening Edit) and other promotions are subject to stated dates, eligibility, stock and any usage limits. We may modify or end a promotion where necessary for operational or legal reasons.",
      "Promotional pricing applies only to eligible items during the live window and cannot normally be combined unless we expressly say otherwise.",
    ],
  },
  {
    id: "conduct",
    title: "Acceptable use",
    paragraphs: [
      "You agree not to misuse the Services — including attempts to disrupt the site, scrape content at scale without permission, submit false information, or infringe intellectual property or privacy rights.",
      "We may suspend or terminate access where we reasonably believe these Terms have been violated or where required to protect clients, brands or the platform.",
    ],
  },
  {
    id: "ip",
    title: "Intellectual property",
    paragraphs: [
      "Content, branding, product imagery and trade marks on the Services belong to VERONICA MARK or their respective owners. You may not copy, redistribute or exploit them for commercial purposes without prior written consent.",
      "Brand partner names and marks remain the property of those brands and are used in connection with authorised curated offerings.",
    ],
  },
  {
    id: "liability",
    title: "Limitation of liability",
    paragraphs: [
      "To the fullest extent permitted by law, VERONICA MARK is not liable for indirect, incidental or consequential losses arising from use of the Services or from delayed or failed delivery beyond our reasonable control.",
      "Nothing in these Terms excludes liability that cannot be excluded under applicable law, including for fraud or for death or personal injury caused by negligence where such exclusion is prohibited.",
    ],
  },
  {
    id: "law",
    title: "Governing law",
    paragraphs: [
      "These Terms are governed by the laws of the Federal Republic of Nigeria, without regard to conflict-of-law principles, except where mandatory consumer protections in your place of residence require otherwise.",
      "If any provision is held unenforceable, the remaining provisions continue in effect.",
    ],
  },
  {
    id: "changes",
    title: "Changes to these Terms",
    paragraphs: [
      "We may update these Terms from time to time. The “Last updated” date at the top of this page will change when we do. Continued use of the Services after changes take effect constitutes acceptance of the revised Terms where permitted by law.",
    ],
  },
  {
    id: "contact-terms",
    title: "Contact",
    paragraphs: [
      `For questions about these Terms or an order, email ${storefrontContact.email} or use the Contact page on ${storefrontContact.websiteLabel}. ${storefrontContact.responseNote}`,
    ],
  },
];

export const privacySections: LegalSection[] = [
  {
    id: "intro",
    title: "Our commitment",
    paragraphs: [
      "VERONICA MARK (“we”, “us”) respects your privacy. This Privacy Policy explains what personal information we collect, how we use it, and the choices available to you when you use our storefront and related services.",
      `For privacy requests, contact ${storefrontContact.email}.`,
    ],
  },
  {
    id: "collect",
    title: "Information we collect",
    paragraphs: [
      "Account and profile details such as name, email address and password when you register.",
      "Order and fulfilment details including shipping address, phone number, items purchased, payment status and order history.",
      "Payment-related information processed by our payment providers (for example Paystack). We do not store full card numbers on VERONICA MARK servers.",
      "Communications you send via contact forms, email or client services, including order references and messages.",
      "Technical and usage data such as device type, browser, approximate location derived from IP (including country for currency display), and pages visited, to operate and improve the site.",
    ],
  },
  {
    id: "use",
    title: "How we use information",
    paragraphs: [
      "To process orders, payments, shipping, returns and invoices.",
      "To provide account features such as wishlist, order tracking and preferences.",
      "To respond to enquiries and provide client services.",
      "To detect and prevent fraud, abuse and security incidents.",
      "To send transactional messages (order and delivery updates). Marketing messages are sent only where appropriate consent or legitimate interest applies and you can opt out.",
      "To comply with legal obligations and enforce our Terms.",
    ],
  },
  {
    id: "share",
    title: "How we share information",
    paragraphs: [
      "We share personal information only as needed with trusted processors who help us operate the Services — for example payment providers, shipping carriers, email delivery, hosting and analytics — under appropriate safeguards.",
      "Brand partners may receive information required to fulfil or support orders for their products, limited to what is necessary.",
      "We may disclose information if required by law, regulation or legal process, or to protect the rights, safety and integrity of VERONICA MARK, our clients or others.",
      "We do not sell your personal information.",
    ],
  },
  {
    id: "cookies",
    title: "Cookies & similar technologies",
    paragraphs: [
      "We use cookies and similar technologies for essential site functions (such as session, cart and security), preferences, and to understand how the storefront is used so we can improve it.",
      "You can control cookies through your browser settings. Disabling certain cookies may affect checkout, sign-in or other features.",
    ],
  },
  {
    id: "retention",
    title: "Retention",
    paragraphs: [
      "We retain personal information for as long as needed to provide the Services, meet legal and accounting requirements, resolve disputes and enforce agreements. Retention periods vary by data type and purpose.",
    ],
  },
  {
    id: "security",
    title: "Security",
    paragraphs: [
      "We apply administrative, technical and organisational measures designed to protect personal information. No method of transmission or storage is completely secure; we work to reduce risk and respond appropriately to incidents.",
    ],
  },
  {
    id: "international",
    title: "International transfers",
    paragraphs: [
      "VERONICA MARK is based in Nigeria and serves clients internationally. Your information may be processed in Nigeria and in other countries where our providers operate. Where required, we use appropriate safeguards for cross-border transfers.",
    ],
  },
  {
    id: "rights",
    title: "Your choices & rights",
    paragraphs: [
      "Depending on applicable law, you may have rights to access, correct, update, delete or restrict certain personal information, or to object to certain processing and to withdraw consent where processing is consent-based.",
      `To exercise these rights, email ${storefrontContact.email} with sufficient detail for us to verify and respond. You may also unsubscribe from marketing emails using the link in those messages.`,
      "You can update some account details by signing in to your account settings.",
    ],
  },
  {
    id: "children",
    title: "Children",
    paragraphs: [
      "The Services are not directed to children. We do not knowingly collect personal information from children below the age required by applicable law. If you believe we have done so, contact us and we will take appropriate steps.",
    ],
  },
  {
    id: "changes-privacy",
    title: "Changes to this policy",
    paragraphs: [
      "We may update this Privacy Policy periodically. The “Last updated” date will change when we do. Where changes are material, we may provide additional notice through the site or email where appropriate.",
    ],
  },
  {
    id: "contact-privacy",
    title: "Contact",
    paragraphs: [
      `Privacy enquiries: ${storefrontContact.email}. Website: ${storefrontContact.websiteLabel}. ${storefrontContact.responseNote}`,
    ],
  },
];
