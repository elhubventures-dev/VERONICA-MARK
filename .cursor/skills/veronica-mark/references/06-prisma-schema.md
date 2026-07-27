# Volume 6 — Production Prisma Schema (Volume V)

Sources: VERONICA_MARK_Volume_V_Part_I/II/III.docx, VERONICA_MARK_Volume_V_Final_Production_Schema.docx

This is the actual Prisma code drafted so far (Parts I–IV are all present). It is **excerpted/illustrative**, not the complete production schema — the Final Production Schema doc estimates the real thing at **70–100 models, 25+ enums, hundreds of relations/indexes**. Treat everything below as a starting skeleton to extend, not a finished schema. Always cross-check field names here against references/05-database-overview.md before adding new models, and reuse existing model/enum names rather than inventing near-duplicates.

## ⚠️ Known Discrepancy: OrderStatus enum
- SRS/UX docs (references/01, 02) describe an **11-state** flow: Pending, Confirmed, Paid, Processing, Packed, Shipped, Out for Delivery, Delivered, Completed, Cancelled, Refund Requested, Refunded.
- The Prisma code below (Part II) only implements a **7-state** enum: PENDING, CONFIRMED, PAID, PROCESSING, SHIPPED, DELIVERED, CANCELLED, REFUNDED — missing PACKED, OUT_FOR_DELIVERY, COMPLETED, and REFUND_REQUESTED as distinct states.
- **Do not silently pick one.** If a task touches order status, point this out and ask whether to extend the enum to match the SRS or keep the simplified version.

## Merge Plan (from Final Production Schema doc)
The full `schema.prisma` is meant to combine Parts I–IV in this order:
1. Generator & Datasource
2. Shared Enums
3. Identity & RBAC
4. Brands & Categories
5. Products & Variants
6. Inventory
7. Cart & Checkout
8. Orders & Payments
9. Shipping & Tax
10. Marketing
11. Customer Engagement
12. CMS
13. Analytics
14. System Administration

## Production Checklist (apply to every model you write for this project)
- [ ] UUID primary keys (`@id @default(uuid())`)
- [ ] Neon PostgreSQL as datasource
- [ ] `Decimal` with explicit `@db.Decimal(12,2)` for money (not Float/Int)
- [ ] Composite indexes on common query patterns
- [ ] Explicit foreign keys with `@relation`
- [ ] Cascade rules (`onDelete: Cascade`) where child rows are meaningless without the parent
- [ ] Soft-delete (`deletedAt DateTime?`) where the SRS calls for it (Users, Products, Brands — not immutable ledgers like AuditLog/WalletTransaction)
- [ ] `@updatedAt` timestamps
- [ ] Migration-ready — validate with `npx prisma format && npx prisma validate` before considering a schema change done

Recommended file layout:
```
prisma/
  schema.prisma
  seed.ts
  migrations/
lib/
  prisma.ts
```

---

## Part I — Core Models & Enums

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum UserRole {
  SUPER_ADMIN
  BRAND_MANAGER
  CUSTOMER
}

enum ProductStatus {
  DRAFT
  SCHEDULED
  PUBLISHED
  OUT_OF_STOCK
  ARCHIVED
}

enum Currency {
  NGN
  USD
  GBP
  EUR
}

model User {
  id                 String   @id @default(uuid())
  email              String   @unique
  passwordHash       String?
  firstName          String
  lastName           String
  phone              String?
  avatar             String?
  role               UserRole
  preferredCurrency  Currency @default(NGN)
  emailVerified      Boolean  @default(false)
  createdAt          DateTime @default(now())
  updatedAt          DateTime @updatedAt
  deletedAt          DateTime?

  customerProfile    CustomerProfile?
  brandProfile       BrandManagerProfile?
}

model CustomerProfile {
  id             String @id @default(uuid())
  userId         String @unique
  rewardBalance  Decimal @db.Decimal(12,2)
  walletBalance  Decimal @db.Decimal(12,2)

  user User @relation(fields:[userId], references:[id])
}

model Brand {
  id          String @id @default(uuid())
  name        String
  slug        String @unique
  description String?
  createdAt   DateTime @default(now())

  products Product[]
}

model Category {
  id        String @id @default(uuid())
  name      String
  slug      String @unique
  parentId  String?
  parent    Category? @relation("CategoryTree", fields:[parentId], references:[id])
  children  Category[] @relation("CategoryTree")
  products  Product[]
}

model Product {
  id          String @id @default(uuid())
  brandId     String
  categoryId  String
  name        String
  slug        String @unique
  sku         String @unique
  status      ProductStatus

  brand     Brand @relation(fields:[brandId], references:[id])
  category  Category @relation(fields:[categoryId], references:[id])
  variants  ProductVariant[]

  @@index([brandId,status])
  @@index([categoryId,status])
}

model ProductVariant {
  id          String @id @default(uuid())
  productId   String
  sku         String @unique
  price       Decimal @db.Decimal(12,2)
  salePrice   Decimal? @db.Decimal(12,2)
  stock       Int

  product Product @relation(fields:[productId], references:[id])
}

model BrandManagerProfile {
  id       String @id @default(uuid())
  userId   String @unique
  brandId  String

  user  User  @relation(fields:[userId], references:[id])
  brand Brand @relation(fields:[brandId], references:[id])
}
```

> Note: `UserRole` here omits `GUEST` (present in the Volume I narrative enum). Guests are unauthenticated by definition, so this is likely intentional — but confirm before assuming.

---

## Part II — Commerce Models

```prisma
enum OrderStatus {
  PENDING
  CONFIRMED
  PAID
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
  REFUNDED
}

enum PaymentStatus {
  PENDING
  AUTHORIZED
  PAID
  FAILED
  REFUNDED
}

model Address {
  id          String   @id @default(uuid())
  customerId  String
  fullName    String
  phone       String
  country     String
  state       String
  city        String
  address1    String
  address2    String?
  postalCode  String?
  isDefault   Boolean @default(false)

  customer CustomerProfile @relation(fields:[customerId], references:[id])
}

model Cart {
  id          String   @id @default(uuid())
  customerId  String?  @unique
  sessionId   String?  @unique
  items       CartItem[]
  createdAt   DateTime @default(now())
}

model CartItem {
  id          String @id @default(uuid())
  cartId      String
  variantId   String
  quantity    Int

  cart Cart @relation(fields:[cartId], references:[id], onDelete:Cascade)
  variant ProductVariant @relation(fields:[variantId], references:[id])
}

model Inventory {
  id            String @id @default(uuid())
  variantId     String @unique
  available     Int
  reserved      Int
  reorderLevel  Int

  variant ProductVariant @relation(fields:[variantId], references:[id])
}

model Order {
  id            String @id @default(uuid())
  orderNumber   String @unique
  customerId    String
  status        OrderStatus
  subtotal      Decimal @db.Decimal(12,2)
  tax           Decimal @db.Decimal(12,2)
  shippingFee   Decimal @db.Decimal(12,2)
  total         Decimal @db.Decimal(12,2)
  items         OrderItem[]
  payment       Payment?

  @@index([customerId,status])
}

model OrderItem {
  id          String @id @default(uuid())
  orderId     String
  variantId   String
  quantity    Int
  unitPrice   Decimal @db.Decimal(12,2)

  order Order @relation(fields:[orderId], references:[id], onDelete:Cascade)
  variant ProductVariant @relation(fields:[variantId], references:[id])
}

model Payment {
  id          String @id @default(uuid())
  orderId     String @unique
  provider    String
  reference   String @unique
  status      PaymentStatus
  amount      Decimal @db.Decimal(12,2)

  order Order @relation(fields:[orderId], references:[id])
}

model Shipping {
  id            String @id @default(uuid())
  orderId       String @unique
  provider      String
  trackingNo    String?
  status        String
  estimatedDate DateTime?

  order Order @relation(fields:[orderId], references:[id])
}

model TaxRule {
  id         String @id @default(uuid())
  country    String
  region     String?
  rate       Decimal @db.Decimal(5,2)
}

model ReturnRequest {
  id          String @id @default(uuid())
  orderId     String
  reason      String
  status      String

  order Order @relation(fields:[orderId], references:[id])
}
```

---

## Part III — Marketing Models

```prisma
enum PromotionType {
  PERCENTAGE
  FIXED_AMOUNT
  FREE_SHIPPING
  BUY_X_GET_Y
}

enum NotificationChannel {
  EMAIL
  PUSH
  IN_APP
}

model Promotion {
  id          String   @id @default(uuid())
  name        String
  type        PromotionType
  value       Decimal  @db.Decimal(12,2)
  startsAt    DateTime
  endsAt      DateTime
  active      Boolean  @default(true)

  coupons     Coupon[]
}

model Coupon {
  id            String   @id @default(uuid())
  code          String   @unique
  promotionId   String
  usageLimit    Int?
  usedCount     Int      @default(0)
  expiresAt     DateTime?

  promotion Promotion @relation(fields:[promotionId], references:[id])
}

model FlashSale {
  id          String   @id @default(uuid())
  name        String
  startsAt    DateTime
  endsAt      DateTime
  active      Boolean @default(false)
}

model RewardAccount {
  id            String @id @default(uuid())
  customerId    String @unique
  balance       Int @default(0)

  transactions RewardTransaction[]
}

model RewardTransaction {
  id          String @id @default(uuid())
  accountId   String
  points      Int
  reason      String
  createdAt   DateTime @default(now())

  account RewardAccount @relation(fields:[accountId], references:[id], onDelete:Cascade)
}

model Wallet {
  id          String @id @default(uuid())
  customerId  String @unique
  balance     Decimal @db.Decimal(12,2)

  transactions WalletTransaction[]
}

model WalletTransaction {
  id         String @id @default(uuid())
  walletId   String
  amount     Decimal @db.Decimal(12,2)
  type       String
  createdAt  DateTime @default(now())

  wallet Wallet @relation(fields:[walletId], references:[id], onDelete:Cascade)
}

model Referral {
  id             String @id @default(uuid())
  code           String @unique
  ownerCustomerId String
  successfulReferrals Int @default(0)
}

model Wishlist {
  id          String @id @default(uuid())
  customerId  String
  items       WishlistItem[]
}

model WishlistItem {
  id          String @id @default(uuid())
  wishlistId  String
  productId   String

  wishlist Wishlist @relation(fields:[wishlistId], references:[id], onDelete:Cascade)
  product Product @relation(fields:[productId], references:[id])
}

model Review {
  id          String @id @default(uuid())
  productId   String
  customerId  String
  rating      Int
  title       String?
  content     String?
  verifiedPurchase Boolean @default(false)

  product Product @relation(fields:[productId], references:[id])
}

model Notification {
  id          String @id @default(uuid())
  customerId  String
  channel     NotificationChannel
  title       String
  message     String
  read        Boolean @default(false)
  createdAt   DateTime @default(now())
}

model RecentlyViewed {
  id          String @id @default(uuid())
  customerId  String
  productId   String
  viewedAt    DateTime @default(now())

  @@index([customerId, viewedAt])
}

model ProductComparison {
  id          String @id @default(uuid())
  customerId  String
  createdAt   DateTime @default(now())
}
```

---

## Part IV — Administration Models

```prisma
enum PermissionScope {
  READ
  WRITE
  DELETE
  MANAGE
}

model Role {
  id          String @id @default(uuid())
  name        String @unique
  description String?
  permissions RolePermission[]
}

model Permission {
  id       String @id @default(uuid())
  resource String
  scope    PermissionScope
  roles    RolePermission[]
}

model RolePermission {
  roleId       String
  permissionId String

  role       Role @relation(fields:[roleId], references:[id], onDelete:Cascade)
  permission Permission @relation(fields:[permissionId], references:[id], onDelete:Cascade)

  @@id([roleId, permissionId])
}

model AuditLog {
  id         String   @id @default(uuid())
  actorId    String
  action     String
  resource   String
  recordId   String?
  ipAddress  String?
  userAgent  String?
  createdAt  DateTime @default(now())

  @@index([actorId, createdAt])
}

model CMSPage {
  id        String @id @default(uuid())
  slug      String @unique
  title     String
  content   String
  published Boolean @default(false)
}

model MediaAsset {
  id       String @id @default(uuid())
  fileName String
  url      String
  mimeType String
  size     Int
}

model FeatureFlag {
  id          String @id @default(uuid())
  key         String @unique
  enabled     Boolean @default(false)
  environment String
}

model Localization {
  id        String @id @default(uuid())
  locale    String
  namespace String
  key       String
  value     String

  @@unique([locale, namespace, key])
}

model SystemSetting {
  id           String @id @default(uuid())
  settingKey   String @unique
  settingValue String
}

model AnalyticsEvent {
  id         String   @id @default(uuid())
  eventName  String
  customerId String?
  metadata   Json?
  createdAt  DateTime @default(now())

  @@index([eventName, createdAt])
}

model Report {
  id          String @id @default(uuid())
  reportType  String
  generatedBy String
  fileUrl     String?
  createdAt   DateTime @default(now())
}

model WebhookLog {
  id          String @id @default(uuid())
  provider    String
  endpoint    String
  statusCode  Int
  payload     Json
  deliveredAt DateTime?
}

model BackgroundJob {
  id          String @id @default(uuid())
  jobType     String
  status      String
  attempts    Int @default(0)
  scheduledAt DateTime
  completedAt DateTime?
}
```

**Enterprise coverage claimed by this part:** RBAC, Permission Management, Audit Logging, CMS, Media Library, Feature Flags, Localization, Global System Settings, Analytics Events, Reports, Webhook Logging, Background Job Processing.

### New discrepancies introduced by Part IV (flag before building on these)
- **RBAC lives here, not in Part I.** The Volume I narrative (references/05) describes `Role`/`Permission`/`UserRole`/`RolePermission` as core-architecture tables, and Part I's own Prisma code (above) never defines or imports `Role`/`Permission`. Part IV now supplies `Role`, `Permission`, `RolePermission` — but there's no `@relation` wiring these back to `User`, and no join table analogous to the narrative's `UserRole` (user-to-role assignment). Until that's added, `User.role` (the enum field from Part I) and this new `Role`/`Permission` system are two parallel, unconnected RBAC mechanisms. Point this out before implementing permission checks — ask whether `User.role` should be replaced by a `Role` relation, or whether the granular `Role`/`Permission` system is additive (e.g. for finer Brand Manager scoping) on top of the coarse enum.
- **Permission model shape differs from the narrative.** Volume I's narrative describes dot-notation permission strings like `products.create`, `orders.update`. The actual `Permission` model instead uses a `resource` string + a `PermissionScope` enum (`READ`/`WRITE`/`DELETE`/`MANAGE`). Use the actual model shape when writing code; treat the narrative's dot-notation examples as illustrative only.
- **CMS is thinner than the narrative.** Volume IV narrative mentions `CMSPage`, `CMSSection`, and `MediaAsset`. Only `CMSPage` and `MediaAsset` exist in code — there is no `CMSSection`. If a task needs page-section composition (e.g. a homepage builder with reorderable blocks), that model doesn't exist yet and needs to be designed.
- **No dedicated `EmailTemplate`/`NotificationTemplate` models.** The narrative describes versioned, localizable, previewable templates for admin-authored notifications; Part IV has no such table (only the customer-facing `Notification` model exists, in Part III). If asked to build admin template management, this needs to be designed fresh.
- **`AuditLog` is slimmer than the narrative.** Narrative calls for previous/new values and an "outcome" field for full before/after diffing; the actual model only has actor/action/resource/recordId/ip/userAgent/createdAt — no value-diff fields. Flag this if a task needs before/after audit diffing.

---

## Validation commands
```bash
npx prisma format
npx prisma validate
npx prisma migrate dev
npx prisma generate
```
