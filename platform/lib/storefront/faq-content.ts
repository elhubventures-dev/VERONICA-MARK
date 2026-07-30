import { storefrontContact } from "@/lib/storefront/contact";

export type FaqEntry = {
  id: string;
  question: string;
  answer: string;
};

export type FaqCategory = {
  id: string;
  title: string;
  description: string;
  items: FaqEntry[];
};

/**
 * Storefront FAQ copy — aligned with shipping rates, tax, FX, and client services.
 */
export const faqCategories: FaqCategory[] = [
  {
    id: "shopping",
    title: "Shopping & authenticity",
    description: "How we curate and source every piece in the edit.",
    items: [
      {
        id: "authentic",
        question: "Are your fragrances authentic?",
        answer:
          "Yes. VERONICA MARK is a managed-brand marketplace — we work with approved brand partners and established distribution channels. Every product is thoughtfully sourced so you can purchase with confidence.",
      },
      {
        id: "what-we-sell",
        question: "What does VERONICA MARK sell?",
        answer:
          "We launch with a carefully curated perfume edit, with fashion, accessories, beauty, watches and lifestyle collections to follow. Rather than endless listings, we select fewer, finer pieces for craftsmanship and lasting presence.",
      },
      {
        id: "prices-tax",
        question: "Do prices include tax?",
        answer:
          "Yes. All displayed product prices include tax. You will not see a separate tax line added on top at bag or checkout.",
      },
      {
        id: "currency",
        question: "What currency will I see?",
        answer:
          "Visitors in Nigeria see prices in Nigerian Naira (₦). Visitors outside Nigeria see USD at our fixed display rate of $1 = ₦1,500. Checkout charges are processed in NGN via Paystack.",
      },
      {
        id: "samples",
        question: "Do you offer samples or discovery sets?",
        answer:
          "Availability varies by house and season. When discovery options are offered, they appear in the collection alongside full bottles. For personal recommendations, write to client services.",
      },
    ],
  },
  {
    id: "orders",
    title: "Orders & payment",
    description: "Placing an order, paying securely, and order updates.",
    items: [
      {
        id: "guest-checkout",
        question: "Do I need an account to order?",
        answer:
          "No. Guest checkout is available. You may create an account later to track orders, invoices, wishlist and rewards in one place.",
      },
      {
        id: "payment",
        question: "Which payment methods do you accept?",
        answer:
          "Checkout is secured through Paystack. You are never asked to enter card details on VERONICA MARK pages themselves — payment is completed on Paystack’s encrypted flow.",
      },
      {
        id: "order-confirm",
        question: "How do I know my order was placed?",
        answer:
          "You will receive an order confirmation by email with your order reference. Keep that reference for tracking and any follow-up with client services.",
      },
      {
        id: "change-order",
        question: "Can I change or cancel an order?",
        answer:
          "Contact us as soon as possible with your order reference. Once an order is packed or dispatched, changes may no longer be possible — we will advise the best next step.",
      },
      {
        id: "invoice",
        question: "Can I get an invoice?",
        answer:
          "Yes. Invoices are available from your order confirmation and, when signed in, from your account. Guests can also open the invoice link from their confirmation email.",
      },
    ],
  },
  {
    id: "shipping",
    title: "Shipping & delivery",
    description: "Rates, timelines and where we dispatch from.",
    items: [
      {
        id: "hub",
        question: "Where do you ship from?",
        answer:
          "Orders are fulfilled from our hubs at 115 Woji Road, GRA Phase 3, Port Harcourt 500001, Rivers, Nigeria, and Abuja-FCT.",
      },
      {
        id: "nigeria-rates",
        question: "What are your shipping rates in Nigeria?",
        answer:
          "Intra-city drop within Rivers (Port Harcourt) or Abuja-FCT: ₦3,500 (typically 1–2 business days). Interstate to other Nigerian states: ₦8,000 (typically 3–5 business days). Express courier nationwide: ₦10,000 (typically 1–2 business days). Available options are shown at checkout based on your address.",
      },
      {
        id: "international",
        question: "Do you ship internationally?",
        answer:
          "Yes. Outside Nigeria, international shipping is $50 USD (converted to NGN for Paystack at our fixed rate). Typical delivery is 5–10 business days, depending on destination and customs.",
      },
      {
        id: "when-arrive",
        question: "When will my order arrive?",
        answer:
          "Estimated delivery timing is shown at checkout for your selected method and included in your dispatch confirmation. You can also track progress with your order reference.",
      },
      {
        id: "track",
        question: "How do I track my order?",
        answer:
          `Use Track order on the site with your order reference and email, or open the tracking link from your dispatch email. For further help, call or WhatsApp ${storefrontContact.phone} or email ${storefrontContact.email}.`,
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & exchanges",
    description: "Eligibility and how to start a return.",
    items: [
      {
        id: "return-fragrance",
        question: "Can I return a fragrance?",
        answer:
          "Unopened products in original condition may be eligible for return under our terms. Please contact client services before sending any item so we can guide you.",
      },
      {
        id: "opened",
        question: "What if I have opened the bottle?",
        answer:
          "Opened fragrances are generally not eligible for return for hygiene and authenticity reasons, except where required by applicable law or if the item arrived damaged or incorrect.",
      },
      {
        id: "wrong-item",
        question: "What if my order arrives damaged or incorrect?",
        answer:
          "Contact us within a reasonable time with your order reference and photos if helpful. We will arrange a replacement or another suitable resolution.",
      },
      {
        id: "exchange",
        question: "Can I exchange for a different fragrance?",
        answer:
          "Exchanges depend on stock and eligibility. Reach out with your order reference and preferred alternative — our team will confirm what is possible.",
      },
    ],
  },
  {
    id: "account",
    title: "Account, rewards & promotions",
    description: "Wishlist, opening edit and staying in touch.",
    items: [
      {
        id: "wishlist",
        question: "How does the wishlist work?",
        answer:
          "Save fragrances to your wishlist while browsing. Signed-in clients keep their list across devices; guests may keep a local list for the current browser session.",
      },
      {
        id: "flash-sale",
        question: "What is the Private Launch Page?",
        answer:
          "Our August Grand Launch flash sale — Shop 20% Off All Items with Code: VMA5AUG - Valid from 1st - 15th August 2026. Visit the Flash Sales page for the live countdown and eligible pieces.",
      },
      {
        id: "coupons",
        question: "How do I apply a coupon?",
        answer:
          "Enter your code in the bag or at checkout. For the launch, use VMA5AUG for 20% off eligible items. Valid codes apply automatically; expired or incompatible codes will show a clear message.",
      },
      {
        id: "newsletter",
        question: "How do I hear about new arrivals?",
        answer:
          "Join the private list from the homepage newsletter, or follow launches on www.veronicamark.com. We share curated arrivals and house notes — never spam.",
      },
    ],
  },
  {
    id: "support",
    title: "Client services",
    description: "How to reach us when you need a personal response.",
    items: [
      {
        id: "contact",
        question: "How do I contact VERONICA MARK?",
        answer: `Call or WhatsApp ${storefrontContact.phone}, email ${storefrontContact.email}, or visit us at ${storefrontContact.addressLine}. You can also use the forms on our Contact page. ${storefrontContact.responseNote} Visit ${storefrontContact.websiteLabel} for the full storefront.`,
      },
      {
        id: "hours",
        question: "When are you available?",
        answer:
          "Client services typically respond on business days. Messages received outside those hours are answered in turn on the next business day.",
      },
      {
        id: "advice",
        question: "Can you help me choose a fragrance?",
        answer:
          "Yes. Tell us the occasion, notes you enjoy, and whether you prefer eau de parfum or cologne — write via Contact or email and we will suggest pieces from the current edit.",
      },
    ],
  },
];
