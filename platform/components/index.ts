/**
 * VERONICA MARK component library — public barrel exports.
 * Import from `@/components` or `@/components/<module>` for tree-shaking.
 */

// UI primitives (shadcn/ui + brand extensions)
export * from "./ui/accordion";
export * from "./ui/alert";
export * from "./ui/alert-dialog";
export * from "./ui/aspect-ratio";
export * from "./ui/avatar";
export * from "./ui/badge";
export * from "./ui/breadcrumb";
export * from "./ui/button";
export * from "./ui/button-group";
export * from "./ui/calendar";
export * from "./ui/card";
export * from "./ui/checkbox";
export * from "./ui/collapsible";
export * from "./ui/command";
export * from "./ui/dialog";
export * from "./ui/drawer";
export * from "./ui/dropdown-menu";
export * from "./ui/hover-card";
export * from "./ui/icon-button";
export * from "./ui/input";
export * from "./ui/input-otp";
export * from "./ui/kbd";
export * from "./ui/label";
export * from "./ui/pagination";
export * from "./ui/popover";
export * from "./ui/progress";
export * from "./ui/radio-group";
export * from "./ui/scroll-area";
export * from "./ui/select";
export * from "./ui/separator";
export * from "./ui/sheet";
export * from "./ui/skeleton";
export * from "./ui/slider";
export * from "./ui/sonner";
export * from "./ui/spinner";
export * from "./ui/status-dot";
export * from "./ui/switch";
export * from "./ui/table";
export * from "./ui/tabs";
export * from "./ui/textarea";
export * from "./ui/toggle";
export * from "./ui/toggle-group";
export * from "./ui/tooltip";
export * from "./ui/typography";
export * from "./ui/visually-hidden";

// Layout
export * from "./layout/app-shell";
export * from "./layout/container";
export * from "./layout/grid";
export * from "./layout/page-header";
export * from "./layout/responsive-grid";
export * from "./layout/section";
export * from "./layout/site-footer";
export * from "./layout/site-header";
export * from "./layout/stack";
export * from "./layout/theme-toggle";

// Navigation
export {
  CommandPalette,
  type CommandPaletteProps,
  type CommandItem as PaletteCommandItem,
} from "./navigation/command-palette";
export * from "./navigation/mega-menu";
export * from "./navigation/mobile-nav";
export * from "./navigation/nav-link";
export * from "./navigation/navbar";
export * from "./navigation/pagination-nav";
export * from "./navigation/sidebar";
export * from "./navigation/stepper";

// Commerce
export * from "./commerce/add-to-cart-button";
export * from "./commerce/address-card";
export * from "./commerce/cart-drawer";
export * from "./commerce/cart-item";
export * from "./commerce/cart-summary";
export * from "./commerce/checkout-steps";
export * from "./commerce/checkout-summary";
export * from "./commerce/coupon-input";
export * from "./commerce/empty-cart";
export * from "./commerce/mini-cart";
export * from "./commerce/order-card";
export * from "./commerce/order-status-badge";
export * from "./commerce/order-timeline";
export * from "./commerce/payment-method-card";
export * from "./commerce/price";
export * from "./commerce/product-badge";
export * from "./commerce/product-card";
export * from "./commerce/product-gallery";
export * from "./commerce/quantity-selector";
export * from "./commerce/shipping-estimator";
export * from "./commerce/variant-selector";
export * from "./commerce/wishlist-button";

// Dashboard
export * from "./dashboard/activity-feed";
export * from "./dashboard/analytics-card";
export * from "./dashboard/chart-widget";
export * from "./dashboard/conversion-funnel";
export * from "./dashboard/dashboard-header";
export * from "./dashboard/date-range-picker";
export * from "./dashboard/kpi-card";
export * from "./dashboard/metric-sparkline";
export * from "./dashboard/progress-ring";
export * from "./dashboard/revenue-widget";
export * from "./dashboard/stat-widget";
export * from "./dashboard/traffic-widget";

// Charts
export * from "./charts/area-chart";
export * from "./charts/bar-chart";
export * from "./charts/chart-container";
export * from "./charts/donut-chart";
export * from "./charts/line-chart";
export * from "./charts/pie-chart";

// CMS
export * from "./cms/banner-block";
export * from "./cms/cms-block";
export * from "./cms/content-section";
export * from "./cms/faq-accordion";
export * from "./cms/hero-block";
export * from "./cms/media-block";
export * from "./cms/promo-banner";
export * from "./cms/rich-text";

// Search & filters
export * from "./search/active-filters";
export * from "./search/faceted-filter";
export * from "./search/filter-chip";
export * from "./search/filter-panel";
export * from "./search/price-range-filter";
export * from "./search/search-bar";
export * from "./search/search-empty";
export * from "./search/search-results";
export * from "./search/sort-select";

// Media
export * from "./media/avatar-upload";
export * from "./media/dropzone";
export * from "./media/file-upload";
export * from "./media/image-thumbnail";
export * from "./media/media-gallery";
export * from "./media/media-lightbox";

// Profile
export * from "./profile/address-form";
export * from "./profile/notification-preferences";
export * from "./profile/preference-toggles";
export * from "./profile/profile-form";
export * from "./profile/profile-header";
export * from "./profile/security-settings";

// Data display & feedback
export * from "./data/confirm-action";
export * from "./data/data-grid";
export * from "./data/data-table";
export * from "./data/empty-state";
export * from "./data/error-state";
export * from "./data/loading-state";

// Forms
export * from "./forms/currency-input";
export * from "./forms/fieldset";
export * from "./forms/form";
export * from "./forms/form-section";
export * from "./forms/number-input";
export * from "./forms/password-input";
export * from "./forms/phone-input";
export * from "./forms/search-input";
