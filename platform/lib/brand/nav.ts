import type { SidebarSection } from "@/components/navigation/sidebar";

export const brandNavSections: SidebarSection[] = [
  {
    title: "Overview",
    items: [
      { href: "/brand", label: "Dashboard", matchSubpaths: false },
      { href: "/brand/analytics", label: "Analytics", matchSubpaths: true },
      { href: "/brand/reports", label: "Reports", matchSubpaths: true },
      { href: "/brand/activity", label: "Activity logs", matchSubpaths: true },
    ],
  },
  {
    title: "Catalog",
    items: [
      { href: "/brand/products", label: "Products", matchSubpaths: true },
      { href: "/brand/inventory", label: "Inventory", matchSubpaths: true },
      { href: "/brand/media", label: "Media library", matchSubpaths: true },
    ],
  },
  {
    title: "Commerce",
    items: [
      { href: "/brand/orders", label: "Orders", matchSubpaths: true },
      { href: "/brand/customers", label: "Customers", matchSubpaths: true },
      { href: "/brand/coupons", label: "Coupons", matchSubpaths: true },
      { href: "/brand/flash-sales", label: "Flash sales", matchSubpaths: true },
    ],
  },
  {
    title: "Workspace",
    items: [
      { href: "/brand/profile", label: "Profile", matchSubpaths: true },
      { href: "/brand/settings", label: "Settings", matchSubpaths: true },
    ],
  },
];
