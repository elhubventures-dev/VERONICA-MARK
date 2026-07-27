import type { SidebarSection } from "@/components/navigation/sidebar";

export const adminNavSections: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/admin", label: "Global dashboard", matchSubpaths: false },
      { href: "/admin/analytics", label: "Analytics", matchSubpaths: true },
      { href: "/admin/reports", label: "Reports", matchSubpaths: true },
    ],
  },
  {
    title: "Marketplace",
    items: [
      { href: "/admin/brands", label: "Brand management", matchSubpaths: true },
      { href: "/admin/customers", label: "Customer management", matchSubpaths: true },
      { href: "/admin/orders", label: "Order management", matchSubpaths: true },
      { href: "/admin/payments", label: "Payments", matchSubpaths: true },
      { href: "/admin/shipping", label: "Shipping", matchSubpaths: true },
    ],
  },
  {
    title: "Marketing",
    items: [
      { href: "/admin/marketing", label: "Marketing hub", matchSubpaths: true },
      { href: "/admin/marketing/promotions", label: "Promotions", matchSubpaths: true },
      { href: "/admin/marketing/flash-sales", label: "Flash sales", matchSubpaths: true },
      { href: "/admin/marketing/abandoned-cart", label: "Abandoned cart", matchSubpaths: true },
    ],
  },
  {
    title: "Content & growth",
    items: [
      { href: "/admin/cms", label: "CMS", matchSubpaths: true },
      { href: "/admin/email-templates", label: "Email templates", matchSubpaths: true },
      { href: "/admin/localization", label: "Localization", matchSubpaths: true },
      { href: "/admin/feature-flags", label: "Feature flags", matchSubpaths: true },
    ],
  },
  {
    title: "Trust & access",
    items: [
      { href: "/admin/fraud", label: "Fraud monitoring", matchSubpaths: true },
      { href: "/admin/security", label: "Security center", matchSubpaths: true },
      { href: "/admin/users", label: "User management", matchSubpaths: true },
      { href: "/admin/permissions", label: "Permissions", matchSubpaths: true },
    ],
  },
  {
    title: "Platform",
    items: [
      { href: "/admin/audit-logs", label: "Audit logs", matchSubpaths: true },
      { href: "/admin/logs", label: "System logs", matchSubpaths: true },
      { href: "/admin/settings", label: "System settings", matchSubpaths: true },
    ],
  },
];
