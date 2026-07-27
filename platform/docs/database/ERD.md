# Entity Relationship Diagram — Core Commerce

Stage 3 core entities. See `prisma/schema.prisma` for the full ~80–95 model production schema.

```mermaid
erDiagram
    User ||--o| CustomerProfile : has
    User ||--o| BrandManagerProfile : manages
    User ||--o{ UserRoleAssignment : assigned
    Role ||--o{ UserRoleAssignment : grants
    Role ||--o{ RolePermission : includes
    Permission ||--o{ RolePermission : defines

    Brand ||--o{ Product : owns
    Brand ||--o{ BrandManagerProfile : managed_by
    Category ||--o{ Product : categorizes
    Category ||--o{ Category : parent_of

    Product ||--o{ ProductVariant : has
    Product ||--o{ ProductMedia : displays
    Product ||--o| ProductSEO : optimizes
    ProductVariant ||--o| Inventory : tracks
    Inventory ||--o{ InventoryMovement : logs

    CustomerProfile ||--o| Cart : owns
    Cart ||--o{ CartItem : contains
    ProductVariant ||--o{ CartItem : referenced_by

    CustomerProfile ||--o{ Order : places
    Order ||--o{ OrderItem : contains
    Order ||--o{ OrderStatusHistory : tracks
    ProductVariant ||--o{ OrderItem : sold_as
    Order ||--o| Payment : paid_via
    Payment ||--o{ PaymentEvent : emits
    Order ||--o| ShippingShipment : shipped_via

    Promotion ||--o{ Coupon : issues
    Coupon ||--o{ CouponUsage : redeemed
    Order }o--o| Coupon : may_apply

    CustomerProfile ||--o| Wallet : holds
    Wallet ||--o{ WalletTransaction : ledger

    Product ||--o{ Review : receives
    CustomerProfile ||--o{ Review : writes

    User ||--o{ AuditLog : actor

    User {
        uuid id PK
        string email UK
        enum role
        datetime deletedAt
    }

    Brand {
        uuid id PK
        string slug UK
        enum status
        datetime deletedAt
    }

    Product {
        uuid id PK
        string slug UK
        enum status
        datetime publishedAt
        datetime deletedAt
    }

    ProductVariant {
        uuid id PK
        string sku UK
        decimal price
        decimal salePrice
    }

    Inventory {
        uuid id PK
        int available
        int reserved
        int reorderLevel
    }

    Cart {
        uuid id PK
        uuid customerId UK
        string sessionId UK
    }

    Order {
        uuid id PK
        string orderNumber UK
        enum status
        decimal subtotal
        decimal tax
        decimal shippingFee
        decimal discount
        decimal total
    }

    Payment {
        uuid id PK
        string reference UK
        enum status
        decimal amount
    }

    Promotion {
        uuid id PK
        enum type
        decimal value
        datetime startsAt
        datetime endsAt
        enum status
    }
```

## Order status flow (SRS 11+ states)

```
PENDING → CONFIRMED → PAID → PROCESSING → PACKED → SHIPPED
    → OUT_FOR_DELIVERY → DELIVERED → COMPLETED

CANCELLED ← (from early states)
REFUND_REQUESTED → REFUNDED
```

Status transitions are recorded in `OrderStatusHistory` (immutable append).

## Inventory flow

```
available ──reserve──▶ reserved ──commit──▶ (sold, movement logged)
    ▲                      │
    └──── release ─────────┘
```

All quantity changes create an `InventoryMovement` row inside the same transaction.
