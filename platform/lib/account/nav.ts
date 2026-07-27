import type { SidebarSection } from "@/components/navigation/sidebar";

export const accountNavSections: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/account", label: "Dashboard", matchSubpaths: false },
      { href: "/account/analytics", label: "Analytics", matchSubpaths: true },
      { href: "/account/notifications", label: "Notifications", matchSubpaths: true },
    ],
  },
  {
    title: "Shopping",
    items: [
      { href: "/account/orders", label: "Orders", matchSubpaths: true },
      { href: "/account/invoices", label: "Invoices", matchSubpaths: true },
      { href: "/account/wishlist", label: "Wishlist", matchSubpaths: true },
      { href: "/account/returns", label: "Returns", matchSubpaths: true },
    ],
  },
  {
    title: "Benefits",
    items: [
      { href: "/account/rewards", label: "Rewards", matchSubpaths: true },
      { href: "/account/wallet", label: "Wallet", matchSubpaths: true },
      { href: "/account/coupons", label: "Coupons", matchSubpaths: true },
      { href: "/account/referral", label: "Referral", matchSubpaths: true },
    ],
  },
  {
    title: "Account",
    items: [
      { href: "/account/profile", label: "Profile", matchSubpaths: true },
      { href: "/account/addresses", label: "Addresses", matchSubpaths: true },
      { href: "/account/security", label: "Security", matchSubpaths: true },
      { href: "/account/settings", label: "Settings", matchSubpaths: true },
    ],
  },
];
