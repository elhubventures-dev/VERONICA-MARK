# Database Models — Vol 5/6 Production Schema

Complete inventory of model groups in `prisma/schema.prisma`. Count target: **~80–95 models**, **25+ enums**.

## 1. Auth (4)

| Model | Purpose |
|-------|---------|
| `Account` | Auth.js OAuth/credential provider link |
| `Session` | Auth.js session tokens |
| `VerificationToken` | Email verification tokens |
| `PasswordResetToken` | Password reset flow |

## 2. Identity (5)

| Model | Purpose |
|-------|---------|
| `User` | Core identity, coarse `UserRole` enum |
| `UserPreference` | Theme, language, notification prefs |
| `CustomerProfile` | Customer commerce profile |
| `BrandManagerProfile` | Brand manager ↔ brand assignment |
| `SuperAdminProfile` | Platform admin profile extension |

## 3. RBAC (4)

| Model | Purpose |
|-------|---------|
| `Role` | Named role (SUPER_ADMIN, BRAND_MANAGER, CUSTOMER) |
| `Permission` | Resource + `PermissionScope` |
| `RolePermission` | Role ↔ permission join |
| `UserRoleAssignment` | User ↔ role join (additive to `User.role`) |

## 4. Brands (2)

| Model | Purpose |
|-------|---------|
| `Brand` | Managed house brands (not vendors) |
| `BrandSocialLink` | Social media links per brand |

## 5. Categories (2)

| Model | Purpose |
|-------|---------|
| `Category` | Nested category tree |
| `CategoryTranslation` | i18n category names |

## 6. Products (10)

| Model | Purpose |
|-------|---------|
| `Product` | Catalog product |
| `ProductVariant` | SKU, price, size |
| `ProductMedia` | Images/video |
| `ProductSEO` | Meta tags, canonical URL |
| `ProductTranslation` | i18n product copy |
| `ProductAttribute` | Attribute definitions |
| `ProductAttributeValue` | Attribute values per product |
| `Tag` | Product tags |
| `ProductTag` | Product ↔ tag join |

## 7. Inventory (3)

| Model | Purpose |
|-------|---------|
| `Inventory` | Available/reserved counts per variant |
| `InventoryMovement` | **Immutable** stock ledger |
| `StockReservation` | Checkout reservation tracking |

## 8. Cart (2)

| Model | Purpose |
|-------|---------|
| `Cart` | Customer or guest session cart |
| `CartItem` | Line items |

## 9. Address (1)

| Model | Purpose |
|-------|---------|
| `Address` | Billing/shipping addresses |

## 10. Orders (4)

| Model | Purpose |
|-------|---------|
| `Order` | Order header with totals |
| `OrderItem` | Line items with snapshot pricing |
| `OrderStatusHistory` | **Immutable** status audit trail |
| `OrderNote` | Internal/customer notes |

## 11. Payments (2)

| Model | Purpose |
|-------|---------|
| `Payment` | Paystack/SquadCo payment record |
| `PaymentEvent` | **Immutable** webhook/event log |

## 12. Shipping (3)

| Model | Purpose |
|-------|---------|
| `ShippingShipment` | Shipment per order |
| `ShippingRule` | Zone-based shipping fees |
| `ShipmentTrackingEvent` | Tracking updates |

## 13. Tax (1)

| Model | Purpose |
|-------|---------|
| `TaxRule` | Country/region tax rates |

## 14. Returns (3)

| Model | Purpose |
|-------|---------|
| `ReturnRequest` | Return initiation |
| `ReturnItem` | Items being returned |
| `Refund` | Refund record |

## 15. Marketing (8)

| Model | Purpose |
|-------|---------|
| `Promotion` | Discount rules |
| `PromotionBrand` | Brand targeting |
| `PromotionCategory` | Category targeting |
| `PromotionProduct` | Product targeting |
| `Coupon` | Coupon codes |
| `CouponUsage` | **Immutable** redemption log |
| `FlashSale` | Time-boxed sales |
| `FlashSaleItem` | Flash sale product entries |

## 16. Loyalty (3)

| Model | Purpose |
|-------|---------|
| `RewardAccount` | Points balance |
| `RewardTransaction` | **Immutable** points ledger |
| `RewardRule` | Earning/redemption rules |

## 17. Wallet (2)

| Model | Purpose |
|-------|---------|
| `Wallet` | Customer wallet balance |
| `WalletTransaction` | **Immutable** wallet ledger |

## 18. Referrals (3)

| Model | Purpose |
|-------|---------|
| `ReferralCode` | Referral codes |
| `ReferralInvitation` | Invitations sent |
| `ReferralReward` | Rewards earned |

## 19. Engagement (7)

| Model | Purpose |
|-------|---------|
| `Wishlist` | Customer wishlists |
| `WishlistItem` | Wishlist products |
| `Review` | Product reviews |
| `ReviewMedia` | Review attachments |
| `ReviewHelpfulVote` | Helpful votes |
| `ComparisonList` | Product comparisons |
| `ComparisonItem` | Compared products |
| `RecentlyViewed` | Browse history |

## 20. Notifications (3)

| Model | Purpose |
|-------|---------|
| `Notification` | In-app/email/push notifications |
| `NotificationPreference` | Channel preferences |
| `NotificationTemplate` | Template definitions |

## 21. CMS (4)

| Model | Purpose |
|-------|---------|
| `CMSPage` | Static pages |
| `CMSSection` | Page sections |
| `MediaAsset` | Uploaded media registry |
| `EmailTemplate` | Transactional email templates |

## 22. Admin & Analytics (12)

| Model | Purpose |
|-------|---------|
| `AuditLog` | **Immutable** admin action log |
| `FeatureFlag` | Feature toggles |
| `Localization` | i18n string store |
| `SystemSetting` | Key-value platform settings |
| `AnalyticsEvent` | Product analytics events |
| `Report` | Generated reports |
| `WebhookLog` | **Immutable** webhook delivery log |
| `BackgroundJob` | Async job queue |
| `AbandonedCart` | Cart recovery tracking |
| `SupportTicket` | Customer support |
| `SupportTicketMessage` | Ticket thread |
| `ExchangeRate` | Multi-currency rates |
| `ApiUsageLog` | API rate/usage tracking |
| `ScheduledTaskRun` | Cron job execution log |

## Key enums

| Enum | Values (summary) |
|------|------------------|
| `UserRole` | SUPER_ADMIN, BRAND_MANAGER, CUSTOMER |
| `OrderStatus` | PENDING … REFUNDED (11+ SRS states) |
| `ProductStatus` | DRAFT, SCHEDULED, PUBLISHED, OUT_OF_STOCK, ARCHIVED |
| `PaymentStatus` | PENDING, AUTHORIZED, PAID, FAILED, REFUNDED |
| `PromotionType` | PERCENTAGE, FIXED_AMOUNT, FREE_SHIPPING, BUY_X_GET_Y |
| `InventoryMovementType` | ADJUSTMENT, RESERVATION, RELEASE, SALE, RETURN, … |
| `Currency` | NGN, USD, GBP, EUR |
