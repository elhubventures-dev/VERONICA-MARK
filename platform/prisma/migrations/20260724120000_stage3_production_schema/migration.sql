-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('SUPER_ADMIN', 'BRAND_MANAGER', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'PUBLISHED', 'OUT_OF_STOCK', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "InventoryStatus" AS ENUM ('IN_STOCK', 'LOW_STOCK', 'OUT_OF_STOCK', 'PREORDER', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "Currency" AS ENUM ('NGN', 'USD', 'GBP', 'EUR');

-- CreateEnum
CREATE TYPE "Theme" AS ENUM ('LIGHT', 'DARK', 'SYSTEM');

-- CreateEnum
CREATE TYPE "LanguageCode" AS ENUM ('EN', 'FR', 'DE', 'ES', 'IT', 'PT', 'NL');

-- CreateEnum
CREATE TYPE "OrderStatus" AS ENUM ('PENDING', 'CONFIRMED', 'PAID', 'PROCESSING', 'PACKED', 'SHIPPED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'COMPLETED', 'CANCELLED', 'REFUND_REQUESTED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'AUTHORIZED', 'PAID', 'FAILED', 'CANCELLED', 'PARTIALLY_REFUNDED', 'REFUNDED');

-- CreateEnum
CREATE TYPE "PaymentProvider" AS ENUM ('PAYSTACK', 'SQUADCO');

-- CreateEnum
CREATE TYPE "ShippingProvider" AS ENUM ('DHL', 'FEDEX', 'UPS', 'LOCAL_COURIER', 'MANUAL');

-- CreateEnum
CREATE TYPE "ShippingStatus" AS ENUM ('PENDING', 'LABEL_CREATED', 'PICKED_UP', 'IN_TRANSIT', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION', 'RETURNED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "PromotionType" AS ENUM ('PERCENTAGE', 'FIXED_AMOUNT', 'FREE_SHIPPING', 'BUY_X_GET_Y');

-- CreateEnum
CREATE TYPE "PromotionStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'PAUSED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'PAUSED', 'EXPIRED', 'EXHAUSTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('EMAIL', 'PUSH', 'IN_APP', 'SMS');

-- CreateEnum
CREATE TYPE "PermissionScope" AS ENUM ('READ', 'WRITE', 'DELETE', 'MANAGE');

-- CreateEnum
CREATE TYPE "BrandStatus" AS ENUM ('PENDING', 'ACTIVE', 'SUSPENDED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "AddressType" AS ENUM ('BILLING', 'SHIPPING');

-- CreateEnum
CREATE TYPE "ReturnStatus" AS ENUM ('REQUESTED', 'APPROVED', 'REJECTED', 'IN_TRANSIT', 'RECEIVED', 'INSPECTED', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "RefundStatus" AS ENUM ('PENDING', 'PROCESSING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReviewModerationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FLAGGED');

-- CreateEnum
CREATE TYPE "InventoryMovementType" AS ENUM ('RECEIPT', 'SALE', 'RETURN', 'RESERVATION', 'RELEASE', 'ADJUSTMENT', 'DAMAGE', 'TRANSFER_IN', 'TRANSFER_OUT');

-- CreateEnum
CREATE TYPE "WalletTransactionType" AS ENUM ('CREDIT', 'DEBIT', 'REFUND', 'ADJUSTMENT', 'EXPIRY');

-- CreateEnum
CREATE TYPE "RewardTransactionType" AS ENUM ('EARN', 'REDEEM', 'ADJUSTMENT', 'EXPIRY', 'REVERSAL');

-- CreateEnum
CREATE TYPE "BackgroundJobStatus" AS ENUM ('PENDING', 'RUNNING', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReportFormat" AS ENUM ('CSV', 'XLSX', 'PDF', 'JSON');

-- CreateEnum
CREATE TYPE "FeatureFlagEnvironment" AS ENUM ('DEVELOPMENT', 'STAGING', 'PRODUCTION');

-- CreateEnum
CREATE TYPE "TaxType" AS ENUM ('VAT', 'SALES_TAX', 'GST', 'DUTY');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('IMAGE', 'VIDEO', 'DOCUMENT');

-- CreateEnum
CREATE TYPE "CMSSectionType" AS ENUM ('HERO', 'RICH_TEXT', 'IMAGE', 'VIDEO', 'PRODUCT_GRID', 'BRAND_GRID', 'TESTIMONIALS', 'FAQ', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SupportTicketStatus" AS ENUM ('OPEN', 'IN_PROGRESS', 'WAITING_FOR_CUSTOMER', 'RESOLVED', 'CLOSED');

-- CreateEnum
CREATE TYPE "SupportTicketPriority" AS ENUM ('LOW', 'NORMAL', 'HIGH', 'URGENT');

-- CreateEnum
CREATE TYPE "StockReservationStatus" AS ENUM ('ACTIVE', 'CONSUMED', 'RELEASED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "ReferralInvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReferralRewardStatus" AS ENUM ('PENDING', 'APPROVED', 'PAID', 'REVERSED');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('QUEUED', 'GENERATING', 'READY', 'FAILED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "WebhookStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED', 'IGNORED');

-- CreateEnum
CREATE TYPE "OrderNoteVisibility" AS ENUM ('INTERNAL', 'CUSTOMER');

-- CreateEnum
CREATE TYPE "FlashSaleStatus" AS ENUM ('DRAFT', 'SCHEDULED', 'ACTIVE', 'ENDED', 'CANCELLED');

-- CreateTable
CREATE TABLE "Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationToken" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PasswordResetToken" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PasswordResetToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" TIMESTAMP(3),
    "passwordHash" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "phone" TEXT,
    "image" TEXT,
    "avatar" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'CUSTOMER',
    "preferredCurrency" "Currency" NOT NULL DEFAULT 'NGN',
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "theme" "Theme" NOT NULL DEFAULT 'SYSTEM',
    "language" "LanguageCode" NOT NULL DEFAULT 'EN',
    "currency" "Currency" NOT NULL DEFAULT 'NGN',
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "marketingConsent" BOOLEAN NOT NULL DEFAULT false,
    "analyticsConsent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CustomerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "dateOfBirth" TIMESTAMP(3),
    "gender" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CustomerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandManagerProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "title" TEXT,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BrandManagerProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SuperAdminProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SuperAdminProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isSystem" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "scope" "PermissionScope" NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "permissionId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRoleAssignment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "roleId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "UserRoleAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Brand" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "logo" TEXT,
    "banner" TEXT,
    "country" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "status" "BrandStatus" NOT NULL DEFAULT 'PENDING',
    "contactEmail" TEXT,
    "contactPhone" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Brand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BrandSocialLink" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "BrandSocialLink_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "image" TEXT,
    "parentId" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CategoryTranslation" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "language" "LanguageCode" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CategoryTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Product" (
    "id" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "barcode" TEXT,
    "shortDescription" TEXT,
    "description" TEXT,
    "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT',
    "visible" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "newArrival" BOOLEAN NOT NULL DEFAULT false,
    "bestSeller" BOOLEAN NOT NULL DEFAULT false,
    "preorderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Product_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductVariant" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "sku" TEXT NOT NULL,
    "barcode" TEXT,
    "price" DECIMAL(12,2) NOT NULL,
    "salePrice" DECIMAL(12,2),
    "weightGrams" INTEGER,
    "sizeLabel" TEXT,
    "colorLabel" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductVariant_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductMedia" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "altText" TEXT,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductSEO" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "canonicalUrl" TEXT,
    "keywords" TEXT[],
    "structuredData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductSEO_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTranslation" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "language" "LanguageCode" NOT NULL,
    "name" TEXT NOT NULL,
    "shortDescription" TEXT,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductTranslation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttribute" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductAttribute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductAttributeValue" (
    "id" TEXT NOT NULL,
    "attributeId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ProductAttributeValue_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductTag" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductTag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Inventory" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "available" INTEGER NOT NULL DEFAULT 0,
    "reserved" INTEGER NOT NULL DEFAULT 0,
    "incoming" INTEGER NOT NULL DEFAULT 0,
    "reorderLevel" INTEGER NOT NULL DEFAULT 5,
    "status" "InventoryStatus" NOT NULL DEFAULT 'OUT_OF_STOCK',
    "preorderEnabled" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Inventory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InventoryMovement" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "actorId" TEXT,
    "type" "InventoryMovementType" NOT NULL,
    "quantity" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "referenceType" TEXT,
    "referenceId" TEXT,
    "reason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "InventoryMovement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "StockReservation" (
    "id" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "customerId" TEXT,
    "cartItemId" TEXT,
    "orderItemId" TEXT,
    "quantity" INTEGER NOT NULL,
    "status" "StockReservationStatus" NOT NULL DEFAULT 'ACTIVE',
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "StockReservation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cart" (
    "id" TEXT NOT NULL,
    "customerId" TEXT,
    "sessionId" TEXT,
    "currency" "Currency" NOT NULL DEFAULT 'NGN',
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Cart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CartItem" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CartItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Address" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "type" "AddressType" NOT NULL,
    "fullName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "company" TEXT,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "state" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "address1" TEXT NOT NULL,
    "address2" TEXT,
    "postalCode" TEXT,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Order" (
    "id" TEXT NOT NULL,
    "orderNumber" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "couponId" TEXT,
    "currency" "Currency" NOT NULL,
    "subtotal" DECIMAL(12,2) NOT NULL,
    "tax" DECIMAL(12,2) NOT NULL,
    "shippingFee" DECIMAL(12,2) NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "total" DECIMAL(12,2) NOT NULL,
    "status" "OrderStatus" NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "billingAddress" JSONB NOT NULL,
    "shippingAddress" JSONB NOT NULL,
    "placedAt" TIMESTAMP(3),
    "cancelledAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Order_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderItem" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "variantId" TEXT NOT NULL,
    "productName" TEXT NOT NULL,
    "variantName" TEXT,
    "sku" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "unitPrice" DECIMAL(12,2) NOT NULL,
    "compareAtPrice" DECIMAL(12,2),
    "taxAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "discountAmount" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "lineTotal" DECIMAL(12,2) NOT NULL,
    "preorderEstimatedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrderItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderStatusHistory" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "changedBy" TEXT,
    "fromStatus" "OrderStatus",
    "toStatus" "OrderStatus" NOT NULL,
    "comment" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OrderStatusHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrderNote" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "authorId" TEXT,
    "visibility" "OrderNoteVisibility" NOT NULL DEFAULT 'INTERNAL',
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrderNote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "PaymentProvider" NOT NULL,
    "reference" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "authorizationCode" TEXT,
    "providerCustomerId" TEXT,
    "paidAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentEvent" (
    "id" TEXT NOT NULL,
    "paymentId" TEXT,
    "provider" "PaymentProvider" NOT NULL,
    "providerEventId" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "signature" TEXT,
    "status" "WebhookStatus" NOT NULL DEFAULT 'RECEIVED',
    "errorMessage" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingShipment" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "provider" "ShippingProvider" NOT NULL,
    "providerShipmentId" TEXT,
    "trackingNumber" TEXT,
    "status" "ShippingStatus" NOT NULL DEFAULT 'PENDING',
    "shippingMethod" TEXT,
    "cost" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "estimatedDeliveryAt" TIMESTAMP(3),
    "shippedAt" TIMESTAMP(3),
    "deliveredAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ShippingShipment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShippingRule" (
    "id" TEXT NOT NULL,
    "brandId" TEXT,
    "name" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "minOrderAmount" DECIMAL(12,2),
    "maxOrderAmount" DECIMAL(12,2),
    "minWeightGrams" INTEGER,
    "maxWeightGrams" INTEGER,
    "fee" DECIMAL(12,2) NOT NULL,
    "freeAboveAmount" DECIMAL(12,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ShippingRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ShipmentTrackingEvent" (
    "id" TEXT NOT NULL,
    "shipmentId" TEXT NOT NULL,
    "status" "ShippingStatus" NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "occurredAt" TIMESTAMP(3) NOT NULL,
    "payload" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ShipmentTrackingEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TaxRule" (
    "id" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "region" TEXT,
    "taxType" "TaxType" NOT NULL,
    "name" TEXT NOT NULL,
    "rate" DECIMAL(7,4) NOT NULL,
    "inclusive" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "effectiveFrom" TIMESTAMP(3) NOT NULL,
    "effectiveTo" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "TaxRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnRequest" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "returnNumber" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "details" TEXT,
    "status" "ReturnStatus" NOT NULL DEFAULT 'REQUESTED',
    "requestedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "approvedAt" TIMESTAMP(3),
    "receivedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReturnRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReturnItem" (
    "id" TEXT NOT NULL,
    "returnRequestId" TEXT NOT NULL,
    "orderItemId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "condition" TEXT,
    "resolution" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReturnItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Refund" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "paymentId" TEXT,
    "returnRequestId" TEXT,
    "reference" TEXT NOT NULL,
    "status" "RefundStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2) NOT NULL,
    "currency" "Currency" NOT NULL,
    "reason" TEXT NOT NULL,
    "providerReference" TEXT,
    "processedAt" TIMESTAMP(3),
    "failureReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Refund_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Promotion" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "PromotionType" NOT NULL,
    "value" DECIMAL(12,2) NOT NULL,
    "minimumOrderAmount" DECIMAL(12,2),
    "maximumDiscount" DECIMAL(12,2),
    "buyQuantity" INTEGER,
    "getQuantity" INTEGER,
    "priority" INTEGER NOT NULL DEFAULT 0,
    "stackable" BOOLEAN NOT NULL DEFAULT false,
    "usageLimit" INTEGER,
    "usageLimitPerCustomer" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "status" "PromotionStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionBrand" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "brandId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionBrand_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionCategory" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionProduct" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionProduct_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupon" (
    "id" TEXT NOT NULL,
    "promotionId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
    "usageLimit" INTEGER,
    "usageLimitPerCustomer" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "startsAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CouponUsage" (
    "id" TEXT NOT NULL,
    "couponId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "discount" DECIMAL(12,2) NOT NULL,
    "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashSale" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "FlashSaleStatus" NOT NULL DEFAULT 'DRAFT',
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FlashSale_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FlashSaleItem" (
    "id" TEXT NOT NULL,
    "flashSaleId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "variantId" TEXT,
    "salePrice" DECIMAL(12,2) NOT NULL,
    "quantityLimit" INTEGER,
    "soldCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FlashSaleItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardAccount" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "balance" INTEGER NOT NULL DEFAULT 0,
    "lifetimeEarned" INTEGER NOT NULL DEFAULT 0,
    "lifetimeRedeemed" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RewardAccount_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardTransaction" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" "RewardTransactionType" NOT NULL,
    "points" INTEGER NOT NULL,
    "balanceAfter" INTEGER NOT NULL,
    "reason" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RewardTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RewardRule" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "points" INTEGER NOT NULL,
    "multiplier" DECIMAL(8,4),
    "minimumSpend" DECIMAL(12,2),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "startsAt" TIMESTAMP(3),
    "endsAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RewardRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wallet" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "currency" "Currency" NOT NULL,
    "balance" DECIMAL(12,2) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Wallet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WalletTransaction" (
    "id" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "orderId" TEXT,
    "type" "WalletTransactionType" NOT NULL,
    "amount" DECIMAL(12,2) NOT NULL,
    "balanceAfter" DECIMAL(12,2) NOT NULL,
    "reference" TEXT NOT NULL,
    "description" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WalletTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralCode" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "usageLimit" INTEGER,
    "usedCount" INTEGER NOT NULL DEFAULT 0,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReferralCode_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralInvitation" (
    "id" TEXT NOT NULL,
    "referralCodeId" TEXT NOT NULL,
    "inviteeCustomerId" TEXT,
    "email" TEXT NOT NULL,
    "status" "ReferralInvitationStatus" NOT NULL DEFAULT 'PENDING',
    "acceptedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReferralInvitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReferralReward" (
    "id" TEXT NOT NULL,
    "invitationId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "orderId" TEXT,
    "status" "ReferralRewardStatus" NOT NULL DEFAULT 'PENDING',
    "amount" DECIMAL(12,2),
    "points" INTEGER,
    "currency" "Currency",
    "awardedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ReferralReward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Wishlist" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'My Wishlist',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "shareToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Wishlist_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WishlistItem" (
    "id" TEXT NOT NULL,
    "wishlistId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "WishlistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Review" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "rating" INTEGER NOT NULL,
    "title" TEXT,
    "content" TEXT,
    "verifiedPurchase" BOOLEAN NOT NULL DEFAULT false,
    "moderationStatus" "ReviewModerationStatus" NOT NULL DEFAULT 'PENDING',
    "moderatedAt" TIMESTAMP(3),
    "helpfulCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Review_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewMedia" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "type" "MediaType" NOT NULL DEFAULT 'IMAGE',
    "url" TEXT NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ReviewMedia_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewHelpfulVote" (
    "id" TEXT NOT NULL,
    "reviewId" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "helpful" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewHelpfulVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonList" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Comparison',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ComparisonList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ComparisonItem" (
    "id" TEXT NOT NULL,
    "comparisonListId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "ComparisonItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RecentlyViewed" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "viewedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "RecentlyViewed_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "actionUrl" TEXT,
    "metadata" JSONB,
    "readAt" TIMESTAMP(3),
    "sentAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreference" (
    "id" TEXT NOT NULL,
    "customerId" TEXT NOT NULL,
    "emailEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "smsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "orderUpdates" BOOLEAN NOT NULL DEFAULT true,
    "promotions" BOOLEAN NOT NULL DEFAULT true,
    "loyalty" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationTemplate" (
    "id" TEXT NOT NULL,
    "updatedBy" TEXT,
    "key" TEXT NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "language" "LanguageCode" NOT NULL DEFAULT 'EN',
    "subject" TEXT,
    "body" TEXT NOT NULL,
    "variables" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "NotificationTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CMSPage" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "language" "LanguageCode" NOT NULL DEFAULT 'EN',
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CMSPage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CMSSection" (
    "id" TEXT NOT NULL,
    "pageId" TEXT NOT NULL,
    "type" "CMSSectionType" NOT NULL,
    "name" TEXT,
    "content" JSONB NOT NULL,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "visible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CMSSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MediaAsset" (
    "id" TEXT NOT NULL,
    "uploadedBy" TEXT,
    "type" "MediaType" NOT NULL,
    "fileName" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "width" INTEGER,
    "height" INTEGER,
    "altText" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "MediaAsset_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailTemplate" (
    "id" TEXT NOT NULL,
    "updatedBy" TEXT,
    "key" TEXT NOT NULL,
    "language" "LanguageCode" NOT NULL DEFAULT 'EN',
    "subject" TEXT NOT NULL,
    "htmlBody" TEXT NOT NULL,
    "textBody" TEXT,
    "variables" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "EmailTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "resource" TEXT NOT NULL,
    "recordId" TEXT,
    "previousValues" JSONB,
    "newValues" JSONB,
    "outcome" TEXT NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "requestId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureFlag" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "environment" "FeatureFlagEnvironment" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "description" TEXT,
    "rules" JSONB,
    "rollout" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "FeatureFlag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Localization" (
    "id" TEXT NOT NULL,
    "language" "LanguageCode" NOT NULL,
    "namespace" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Localization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SystemSetting" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "description" TEXT,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SystemSetting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalyticsEvent" (
    "id" TEXT NOT NULL,
    "productId" TEXT,
    "eventName" TEXT NOT NULL,
    "customerId" TEXT,
    "sessionId" TEXT,
    "source" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalyticsEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "generatedBy" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "format" "ReportFormat" NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'QUEUED',
    "parameters" JSONB,
    "fileUrl" TEXT,
    "errorMessage" TEXT,
    "expiresAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WebhookLog" (
    "id" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "eventId" TEXT,
    "eventType" TEXT NOT NULL,
    "endpoint" TEXT,
    "status" "WebhookStatus" NOT NULL DEFAULT 'RECEIVED',
    "statusCode" INTEGER,
    "requestHeaders" JSONB,
    "payload" JSONB NOT NULL,
    "responseBody" JSONB,
    "errorMessage" TEXT,
    "processedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WebhookLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackgroundJob" (
    "id" TEXT NOT NULL,
    "jobType" TEXT NOT NULL,
    "queue" TEXT NOT NULL DEFAULT 'default',
    "status" "BackgroundJobStatus" NOT NULL DEFAULT 'PENDING',
    "payload" JSONB,
    "result" JSONB,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 3,
    "scheduledAt" TIMESTAMP(3) NOT NULL,
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BackgroundJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AbandonedCart" (
    "id" TEXT NOT NULL,
    "cartId" TEXT NOT NULL,
    "customerId" TEXT,
    "email" TEXT,
    "abandonedAt" TIMESTAMP(3) NOT NULL,
    "recoveredAt" TIMESTAMP(3),
    "reminderCount" INTEGER NOT NULL DEFAULT 0,
    "lastReminderAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "AbandonedCart_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicket" (
    "id" TEXT NOT NULL,
    "requesterId" TEXT NOT NULL,
    "ticketNumber" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" "SupportTicketStatus" NOT NULL DEFAULT 'OPEN',
    "priority" "SupportTicketPriority" NOT NULL DEFAULT 'NORMAL',
    "category" TEXT,
    "assignedTo" TEXT,
    "resolvedAt" TIMESTAMP(3),
    "closedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SupportTicket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SupportTicketMessage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "authorId" TEXT,
    "message" TEXT NOT NULL,
    "attachments" JSONB,
    "internal" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "SupportTicketMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ExchangeRate" (
    "id" TEXT NOT NULL,
    "baseCurrency" "Currency" NOT NULL,
    "quoteCurrency" "Currency" NOT NULL,
    "rate" DECIMAL(18,8) NOT NULL,
    "effectiveAt" TIMESTAMP(3) NOT NULL,
    "source" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ExchangeRate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiUsageLog" (
    "id" TEXT NOT NULL,
    "apiKeyId" TEXT,
    "userId" TEXT,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "durationMs" INTEGER NOT NULL,
    "requestId" TEXT,
    "ipAddress" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiUsageLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ScheduledTaskRun" (
    "id" TEXT NOT NULL,
    "triggeredBy" TEXT,
    "taskName" TEXT NOT NULL,
    "schedule" TEXT,
    "status" "BackgroundJobStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMP(3),
    "completedAt" TIMESTAMP(3),
    "result" JSONB,
    "errorMessage" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ScheduledTaskRun_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Account_userId_idx" ON "Account"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "Session"("sessionToken");

-- CreateIndex
CREATE INDEX "Session_userId_expires_idx" ON "Session"("userId", "expires");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "VerificationToken"("token");

-- CreateIndex
CREATE INDEX "VerificationToken_expires_idx" ON "VerificationToken"("expires");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "PasswordResetToken_tokenHash_key" ON "PasswordResetToken"("tokenHash");

-- CreateIndex
CREATE INDEX "PasswordResetToken_userId_expiresAt_idx" ON "PasswordResetToken"("userId", "expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_deletedAt_idx" ON "User"("role", "deletedAt");

-- CreateIndex
CREATE INDEX "User_emailVerified_idx" ON "User"("emailVerified");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "UserPreference"("userId");

-- CreateIndex
CREATE INDEX "UserPreference_language_currency_idx" ON "UserPreference"("language", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "CustomerProfile_userId_key" ON "CustomerProfile"("userId");

-- CreateIndex
CREATE INDEX "CustomerProfile_deletedAt_createdAt_idx" ON "CustomerProfile"("deletedAt", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "BrandManagerProfile_userId_key" ON "BrandManagerProfile"("userId");

-- CreateIndex
CREATE INDEX "BrandManagerProfile_brandId_deletedAt_idx" ON "BrandManagerProfile"("brandId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SuperAdminProfile_userId_key" ON "SuperAdminProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "Role_deletedAt_isSystem_idx" ON "Role"("deletedAt", "isSystem");

-- CreateIndex
CREATE INDEX "Permission_deletedAt_idx" ON "Permission"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_resource_scope_key" ON "Permission"("resource", "scope");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserRoleAssignment_roleId_deletedAt_idx" ON "UserRoleAssignment"("roleId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "UserRoleAssignment_userId_roleId_key" ON "UserRoleAssignment"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Brand_slug_key" ON "Brand"("slug");

-- CreateIndex
CREATE INDEX "Brand_status_featured_deletedAt_idx" ON "Brand"("status", "featured", "deletedAt");

-- CreateIndex
CREATE INDEX "Brand_country_status_idx" ON "Brand"("country", "status");

-- CreateIndex
CREATE INDEX "BrandSocialLink_brandId_sortOrder_deletedAt_idx" ON "BrandSocialLink"("brandId", "sortOrder", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "BrandSocialLink_brandId_platform_key" ON "BrandSocialLink"("brandId", "platform");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_parentId_sortOrder_deletedAt_idx" ON "Category"("parentId", "sortOrder", "deletedAt");

-- CreateIndex
CREATE INDEX "Category_featured_deletedAt_idx" ON "Category"("featured", "deletedAt");

-- CreateIndex
CREATE INDEX "CategoryTranslation_language_deletedAt_idx" ON "CategoryTranslation"("language", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CategoryTranslation_categoryId_language_key" ON "CategoryTranslation"("categoryId", "language");

-- CreateIndex
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Product_barcode_key" ON "Product"("barcode");

-- CreateIndex
CREATE INDEX "Product_brandId_status_deletedAt_idx" ON "Product"("brandId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "Product_categoryId_status_deletedAt_idx" ON "Product"("categoryId", "status", "deletedAt");

-- CreateIndex
CREATE INDEX "Product_visible_featured_publishedAt_idx" ON "Product"("visible", "featured", "publishedAt");

-- CreateIndex
CREATE INDEX "Product_newArrival_bestSeller_deletedAt_idx" ON "Product"("newArrival", "bestSeller", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_sku_key" ON "ProductVariant"("sku");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_barcode_key" ON "ProductVariant"("barcode");

-- CreateIndex
CREATE INDEX "ProductVariant_productId_active_deletedAt_idx" ON "ProductVariant"("productId", "active", "deletedAt");

-- CreateIndex
CREATE INDEX "ProductVariant_price_salePrice_idx" ON "ProductVariant"("price", "salePrice");

-- CreateIndex
CREATE INDEX "ProductMedia_productId_sortOrder_deletedAt_idx" ON "ProductMedia"("productId", "sortOrder", "deletedAt");

-- CreateIndex
CREATE INDEX "ProductMedia_uploadedBy_idx" ON "ProductMedia"("uploadedBy");

-- CreateIndex
CREATE UNIQUE INDEX "ProductSEO_productId_key" ON "ProductSEO"("productId");

-- CreateIndex
CREATE INDEX "ProductTranslation_language_deletedAt_idx" ON "ProductTranslation"("language", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTranslation_productId_language_key" ON "ProductTranslation"("productId", "language");

-- CreateIndex
CREATE INDEX "ProductAttribute_productId_sortOrder_deletedAt_idx" ON "ProductAttribute"("productId", "sortOrder", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttribute_productId_name_key" ON "ProductAttribute"("productId", "name");

-- CreateIndex
CREATE INDEX "ProductAttributeValue_variantId_deletedAt_idx" ON "ProductAttributeValue"("variantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ProductAttributeValue_attributeId_variantId_key" ON "ProductAttributeValue"("attributeId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_slug_key" ON "Tag"("slug");

-- CreateIndex
CREATE INDEX "Tag_deletedAt_idx" ON "Tag"("deletedAt");

-- CreateIndex
CREATE INDEX "ProductTag_tagId_idx" ON "ProductTag"("tagId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductTag_productId_tagId_key" ON "ProductTag"("productId", "tagId");

-- CreateIndex
CREATE UNIQUE INDEX "Inventory_variantId_key" ON "Inventory"("variantId");

-- CreateIndex
CREATE INDEX "Inventory_status_available_idx" ON "Inventory"("status", "available");

-- CreateIndex
CREATE INDEX "Inventory_preorderEnabled_deletedAt_idx" ON "Inventory"("preorderEnabled", "deletedAt");

-- CreateIndex
CREATE INDEX "InventoryMovement_variantId_createdAt_idx" ON "InventoryMovement"("variantId", "createdAt");

-- CreateIndex
CREATE INDEX "InventoryMovement_referenceType_referenceId_idx" ON "InventoryMovement"("referenceType", "referenceId");

-- CreateIndex
CREATE INDEX "InventoryMovement_type_createdAt_idx" ON "InventoryMovement"("type", "createdAt");

-- CreateIndex
CREATE INDEX "StockReservation_variantId_status_expiresAt_idx" ON "StockReservation"("variantId", "status", "expiresAt");

-- CreateIndex
CREATE INDEX "StockReservation_customerId_status_idx" ON "StockReservation"("customerId", "status");

-- CreateIndex
CREATE INDEX "StockReservation_cartItemId_idx" ON "StockReservation"("cartItemId");

-- CreateIndex
CREATE INDEX "StockReservation_orderItemId_idx" ON "StockReservation"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Cart_sessionId_key" ON "Cart"("sessionId");

-- CreateIndex
CREATE INDEX "Cart_customerId_deletedAt_idx" ON "Cart"("customerId", "deletedAt");

-- CreateIndex
CREATE INDEX "Cart_expiresAt_idx" ON "Cart"("expiresAt");

-- CreateIndex
CREATE INDEX "CartItem_variantId_deletedAt_idx" ON "CartItem"("variantId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "CartItem_cartId_variantId_key" ON "CartItem"("cartId", "variantId");

-- CreateIndex
CREATE INDEX "Address_customerId_type_isDefault_deletedAt_idx" ON "Address"("customerId", "type", "isDefault", "deletedAt");

-- CreateIndex
CREATE INDEX "Address_country_state_city_idx" ON "Address"("country", "state", "city");

-- CreateIndex
CREATE UNIQUE INDEX "Order_orderNumber_key" ON "Order"("orderNumber");

-- CreateIndex
CREATE INDEX "Order_customerId_status_createdAt_idx" ON "Order"("customerId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "Order_status_createdAt_idx" ON "Order"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Order_couponId_idx" ON "Order"("couponId");

-- CreateIndex
CREATE INDEX "Order_deletedAt_idx" ON "Order"("deletedAt");

-- CreateIndex
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");

-- CreateIndex
CREATE INDEX "OrderItem_variantId_idx" ON "OrderItem"("variantId");

-- CreateIndex
CREATE INDEX "OrderStatusHistory_orderId_createdAt_idx" ON "OrderStatusHistory"("orderId", "createdAt");

-- CreateIndex
CREATE INDEX "OrderStatusHistory_changedBy_createdAt_idx" ON "OrderStatusHistory"("changedBy", "createdAt");

-- CreateIndex
CREATE INDEX "OrderNote_orderId_visibility_createdAt_idx" ON "OrderNote"("orderId", "visibility", "createdAt");

-- CreateIndex
CREATE INDEX "OrderNote_authorId_idx" ON "OrderNote"("authorId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_reference_key" ON "Payment"("reference");

-- CreateIndex
CREATE INDEX "Payment_orderId_status_idx" ON "Payment"("orderId", "status");

-- CreateIndex
CREATE INDEX "Payment_provider_status_createdAt_idx" ON "Payment"("provider", "status", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentEvent_paymentId_createdAt_idx" ON "PaymentEvent"("paymentId", "createdAt");

-- CreateIndex
CREATE INDEX "PaymentEvent_status_createdAt_idx" ON "PaymentEvent"("status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentEvent_provider_providerEventId_key" ON "PaymentEvent"("provider", "providerEventId");

-- CreateIndex
CREATE UNIQUE INDEX "ShippingShipment_trackingNumber_key" ON "ShippingShipment"("trackingNumber");

-- CreateIndex
CREATE INDEX "ShippingShipment_orderId_status_idx" ON "ShippingShipment"("orderId", "status");

-- CreateIndex
CREATE INDEX "ShippingShipment_provider_status_createdAt_idx" ON "ShippingShipment"("provider", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ShippingRule_country_region_active_priority_idx" ON "ShippingRule"("country", "region", "active", "priority");

-- CreateIndex
CREATE INDEX "ShippingRule_brandId_active_deletedAt_idx" ON "ShippingRule"("brandId", "active", "deletedAt");

-- CreateIndex
CREATE INDEX "ShipmentTrackingEvent_shipmentId_occurredAt_idx" ON "ShipmentTrackingEvent"("shipmentId", "occurredAt");

-- CreateIndex
CREATE INDEX "ShipmentTrackingEvent_status_occurredAt_idx" ON "ShipmentTrackingEvent"("status", "occurredAt");

-- CreateIndex
CREATE INDEX "TaxRule_country_region_taxType_active_idx" ON "TaxRule"("country", "region", "taxType", "active");

-- CreateIndex
CREATE INDEX "TaxRule_effectiveFrom_effectiveTo_idx" ON "TaxRule"("effectiveFrom", "effectiveTo");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnRequest_returnNumber_key" ON "ReturnRequest"("returnNumber");

-- CreateIndex
CREATE INDEX "ReturnRequest_orderId_status_idx" ON "ReturnRequest"("orderId", "status");

-- CreateIndex
CREATE INDEX "ReturnRequest_customerId_status_requestedAt_idx" ON "ReturnRequest"("customerId", "status", "requestedAt");

-- CreateIndex
CREATE INDEX "ReturnItem_orderItemId_idx" ON "ReturnItem"("orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "ReturnItem_returnRequestId_orderItemId_key" ON "ReturnItem"("returnRequestId", "orderItemId");

-- CreateIndex
CREATE UNIQUE INDEX "Refund_reference_key" ON "Refund"("reference");

-- CreateIndex
CREATE INDEX "Refund_orderId_status_idx" ON "Refund"("orderId", "status");

-- CreateIndex
CREATE INDEX "Refund_paymentId_idx" ON "Refund"("paymentId");

-- CreateIndex
CREATE INDEX "Refund_returnRequestId_idx" ON "Refund"("returnRequestId");

-- CreateIndex
CREATE INDEX "Promotion_status_startsAt_endsAt_idx" ON "Promotion"("status", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Promotion_priority_stackable_deletedAt_idx" ON "Promotion"("priority", "stackable", "deletedAt");

-- CreateIndex
CREATE INDEX "PromotionBrand_brandId_idx" ON "PromotionBrand"("brandId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionBrand_promotionId_brandId_key" ON "PromotionBrand"("promotionId", "brandId");

-- CreateIndex
CREATE INDEX "PromotionCategory_categoryId_idx" ON "PromotionCategory"("categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionCategory_promotionId_categoryId_key" ON "PromotionCategory"("promotionId", "categoryId");

-- CreateIndex
CREATE INDEX "PromotionProduct_productId_idx" ON "PromotionProduct"("productId");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionProduct_promotionId_productId_key" ON "PromotionProduct"("promotionId", "productId");

-- CreateIndex
CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");

-- CreateIndex
CREATE INDEX "Coupon_promotionId_status_idx" ON "Coupon"("promotionId", "status");

-- CreateIndex
CREATE INDEX "Coupon_status_startsAt_expiresAt_idx" ON "Coupon"("status", "startsAt", "expiresAt");

-- CreateIndex
CREATE INDEX "CouponUsage_customerId_couponId_usedAt_idx" ON "CouponUsage"("customerId", "couponId", "usedAt");

-- CreateIndex
CREATE INDEX "CouponUsage_orderId_idx" ON "CouponUsage"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "CouponUsage_couponId_orderId_key" ON "CouponUsage"("couponId", "orderId");

-- CreateIndex
CREATE INDEX "FlashSale_status_startsAt_endsAt_idx" ON "FlashSale"("status", "startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "FlashSaleItem_productId_idx" ON "FlashSaleItem"("productId");

-- CreateIndex
CREATE INDEX "FlashSaleItem_variantId_idx" ON "FlashSaleItem"("variantId");

-- CreateIndex
CREATE UNIQUE INDEX "FlashSaleItem_flashSaleId_productId_variantId_key" ON "FlashSaleItem"("flashSaleId", "productId", "variantId");

-- CreateIndex
CREATE UNIQUE INDEX "RewardAccount_customerId_key" ON "RewardAccount"("customerId");

-- CreateIndex
CREATE INDEX "RewardAccount_balance_deletedAt_idx" ON "RewardAccount"("balance", "deletedAt");

-- CreateIndex
CREATE INDEX "RewardTransaction_accountId_createdAt_idx" ON "RewardTransaction"("accountId", "createdAt");

-- CreateIndex
CREATE INDEX "RewardTransaction_orderId_idx" ON "RewardTransaction"("orderId");

-- CreateIndex
CREATE INDEX "RewardTransaction_type_expiresAt_idx" ON "RewardTransaction"("type", "expiresAt");

-- CreateIndex
CREATE INDEX "RewardRule_eventType_active_idx" ON "RewardRule"("eventType", "active");

-- CreateIndex
CREATE INDEX "RewardRule_startsAt_endsAt_idx" ON "RewardRule"("startsAt", "endsAt");

-- CreateIndex
CREATE INDEX "Wallet_currency_deletedAt_idx" ON "Wallet"("currency", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Wallet_customerId_currency_key" ON "Wallet"("customerId", "currency");

-- CreateIndex
CREATE UNIQUE INDEX "WalletTransaction_reference_key" ON "WalletTransaction"("reference");

-- CreateIndex
CREATE INDEX "WalletTransaction_walletId_createdAt_idx" ON "WalletTransaction"("walletId", "createdAt");

-- CreateIndex
CREATE INDEX "WalletTransaction_orderId_idx" ON "WalletTransaction"("orderId");

-- CreateIndex
CREATE INDEX "WalletTransaction_type_createdAt_idx" ON "WalletTransaction"("type", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralCode_code_key" ON "ReferralCode"("code");

-- CreateIndex
CREATE INDEX "ReferralCode_customerId_active_deletedAt_idx" ON "ReferralCode"("customerId", "active", "deletedAt");

-- CreateIndex
CREATE INDEX "ReferralInvitation_email_status_idx" ON "ReferralInvitation"("email", "status");

-- CreateIndex
CREATE INDEX "ReferralInvitation_inviteeCustomerId_idx" ON "ReferralInvitation"("inviteeCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "ReferralInvitation_referralCodeId_email_key" ON "ReferralInvitation"("referralCodeId", "email");

-- CreateIndex
CREATE INDEX "ReferralReward_customerId_status_createdAt_idx" ON "ReferralReward"("customerId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ReferralReward_invitationId_idx" ON "ReferralReward"("invitationId");

-- CreateIndex
CREATE INDEX "ReferralReward_orderId_idx" ON "ReferralReward"("orderId");

-- CreateIndex
CREATE UNIQUE INDEX "Wishlist_shareToken_key" ON "Wishlist"("shareToken");

-- CreateIndex
CREATE INDEX "Wishlist_customerId_isDefault_deletedAt_idx" ON "Wishlist"("customerId", "isDefault", "deletedAt");

-- CreateIndex
CREATE INDEX "WishlistItem_productId_deletedAt_idx" ON "WishlistItem"("productId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "WishlistItem_wishlistId_productId_key" ON "WishlistItem"("wishlistId", "productId");

-- CreateIndex
CREATE INDEX "Review_productId_moderationStatus_createdAt_idx" ON "Review"("productId", "moderationStatus", "createdAt");

-- CreateIndex
CREATE INDEX "Review_customerId_deletedAt_idx" ON "Review"("customerId", "deletedAt");

-- CreateIndex
CREATE INDEX "Review_rating_moderationStatus_idx" ON "Review"("rating", "moderationStatus");

-- CreateIndex
CREATE UNIQUE INDEX "Review_productId_customerId_key" ON "Review"("productId", "customerId");

-- CreateIndex
CREATE INDEX "ReviewMedia_reviewId_sortOrder_deletedAt_idx" ON "ReviewMedia"("reviewId", "sortOrder", "deletedAt");

-- CreateIndex
CREATE INDEX "ReviewHelpfulVote_customerId_idx" ON "ReviewHelpfulVote"("customerId");

-- CreateIndex
CREATE UNIQUE INDEX "ReviewHelpfulVote_reviewId_customerId_key" ON "ReviewHelpfulVote"("reviewId", "customerId");

-- CreateIndex
CREATE INDEX "ComparisonList_customerId_deletedAt_idx" ON "ComparisonList"("customerId", "deletedAt");

-- CreateIndex
CREATE INDEX "ComparisonItem_productId_deletedAt_idx" ON "ComparisonItem"("productId", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "ComparisonItem_comparisonListId_productId_key" ON "ComparisonItem"("comparisonListId", "productId");

-- CreateIndex
CREATE INDEX "RecentlyViewed_customerId_viewedAt_idx" ON "RecentlyViewed"("customerId", "viewedAt");

-- CreateIndex
CREATE INDEX "RecentlyViewed_productId_viewedAt_idx" ON "RecentlyViewed"("productId", "viewedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RecentlyViewed_customerId_productId_key" ON "RecentlyViewed"("customerId", "productId");

-- CreateIndex
CREATE INDEX "Notification_customerId_readAt_createdAt_idx" ON "Notification"("customerId", "readAt", "createdAt");

-- CreateIndex
CREATE INDEX "Notification_channel_sentAt_idx" ON "Notification"("channel", "sentAt");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreference_customerId_key" ON "NotificationPreference"("customerId");

-- CreateIndex
CREATE INDEX "NotificationTemplate_channel_active_deletedAt_idx" ON "NotificationTemplate"("channel", "active", "deletedAt");

-- CreateIndex
CREATE INDEX "NotificationTemplate_updatedBy_idx" ON "NotificationTemplate"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationTemplate_key_channel_language_key" ON "NotificationTemplate"("key", "channel", "language");

-- CreateIndex
CREATE UNIQUE INDEX "CMSPage_slug_key" ON "CMSPage"("slug");

-- CreateIndex
CREATE INDEX "CMSPage_language_published_publishedAt_idx" ON "CMSPage"("language", "published", "publishedAt");

-- CreateIndex
CREATE INDEX "CMSPage_deletedAt_idx" ON "CMSPage"("deletedAt");

-- CreateIndex
CREATE INDEX "CMSSection_pageId_sortOrder_visible_deletedAt_idx" ON "CMSSection"("pageId", "sortOrder", "visible", "deletedAt");

-- CreateIndex
CREATE INDEX "MediaAsset_type_createdAt_idx" ON "MediaAsset"("type", "createdAt");

-- CreateIndex
CREATE INDEX "MediaAsset_uploadedBy_deletedAt_idx" ON "MediaAsset"("uploadedBy", "deletedAt");

-- CreateIndex
CREATE INDEX "EmailTemplate_active_deletedAt_idx" ON "EmailTemplate"("active", "deletedAt");

-- CreateIndex
CREATE INDEX "EmailTemplate_updatedBy_idx" ON "EmailTemplate"("updatedBy");

-- CreateIndex
CREATE UNIQUE INDEX "EmailTemplate_key_language_key" ON "EmailTemplate"("key", "language");

-- CreateIndex
CREATE INDEX "AuditLog_actorId_createdAt_idx" ON "AuditLog"("actorId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_resource_recordId_createdAt_idx" ON "AuditLog"("resource", "recordId", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_outcome_createdAt_idx" ON "AuditLog"("outcome", "createdAt");

-- CreateIndex
CREATE INDEX "AuditLog_requestId_idx" ON "AuditLog"("requestId");

-- CreateIndex
CREATE INDEX "FeatureFlag_environment_enabled_deletedAt_idx" ON "FeatureFlag"("environment", "enabled", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureFlag_key_environment_key" ON "FeatureFlag"("key", "environment");

-- CreateIndex
CREATE INDEX "Localization_namespace_language_deletedAt_idx" ON "Localization"("namespace", "language", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Localization_language_namespace_key_key" ON "Localization"("language", "namespace", "key");

-- CreateIndex
CREATE UNIQUE INDEX "SystemSetting_key_key" ON "SystemSetting"("key");

-- CreateIndex
CREATE INDEX "SystemSetting_isPublic_deletedAt_idx" ON "SystemSetting"("isPublic", "deletedAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_eventName_occurredAt_idx" ON "AnalyticsEvent"("eventName", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_customerId_occurredAt_idx" ON "AnalyticsEvent"("customerId", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_productId_occurredAt_idx" ON "AnalyticsEvent"("productId", "occurredAt");

-- CreateIndex
CREATE INDEX "AnalyticsEvent_sessionId_occurredAt_idx" ON "AnalyticsEvent"("sessionId", "occurredAt");

-- CreateIndex
CREATE INDEX "Report_generatedBy_createdAt_idx" ON "Report"("generatedBy", "createdAt");

-- CreateIndex
CREATE INDEX "Report_type_status_createdAt_idx" ON "Report"("type", "status", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookLog_provider_status_createdAt_idx" ON "WebhookLog"("provider", "status", "createdAt");

-- CreateIndex
CREATE INDEX "WebhookLog_eventType_createdAt_idx" ON "WebhookLog"("eventType", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WebhookLog_provider_eventId_key" ON "WebhookLog"("provider", "eventId");

-- CreateIndex
CREATE INDEX "BackgroundJob_queue_status_scheduledAt_idx" ON "BackgroundJob"("queue", "status", "scheduledAt");

-- CreateIndex
CREATE INDEX "BackgroundJob_jobType_status_createdAt_idx" ON "BackgroundJob"("jobType", "status", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AbandonedCart_cartId_key" ON "AbandonedCart"("cartId");

-- CreateIndex
CREATE INDEX "AbandonedCart_customerId_recoveredAt_idx" ON "AbandonedCart"("customerId", "recoveredAt");

-- CreateIndex
CREATE INDEX "AbandonedCart_abandonedAt_recoveredAt_deletedAt_idx" ON "AbandonedCart"("abandonedAt", "recoveredAt", "deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "SupportTicket_ticketNumber_key" ON "SupportTicket"("ticketNumber");

-- CreateIndex
CREATE INDEX "SupportTicket_requesterId_status_createdAt_idx" ON "SupportTicket"("requesterId", "status", "createdAt");

-- CreateIndex
CREATE INDEX "SupportTicket_status_priority_updatedAt_idx" ON "SupportTicket"("status", "priority", "updatedAt");

-- CreateIndex
CREATE INDEX "SupportTicket_assignedTo_status_idx" ON "SupportTicket"("assignedTo", "status");

-- CreateIndex
CREATE INDEX "SupportTicketMessage_ticketId_createdAt_idx" ON "SupportTicketMessage"("ticketId", "createdAt");

-- CreateIndex
CREATE INDEX "SupportTicketMessage_authorId_idx" ON "SupportTicketMessage"("authorId");

-- CreateIndex
CREATE INDEX "ExchangeRate_baseCurrency_quoteCurrency_effectiveAt_idx" ON "ExchangeRate"("baseCurrency", "quoteCurrency", "effectiveAt");

-- CreateIndex
CREATE UNIQUE INDEX "ExchangeRate_baseCurrency_quoteCurrency_effectiveAt_key" ON "ExchangeRate"("baseCurrency", "quoteCurrency", "effectiveAt");

-- CreateIndex
CREATE INDEX "ApiUsageLog_endpoint_createdAt_idx" ON "ApiUsageLog"("endpoint", "createdAt");

-- CreateIndex
CREATE INDEX "ApiUsageLog_userId_createdAt_idx" ON "ApiUsageLog"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "ApiUsageLog_apiKeyId_createdAt_idx" ON "ApiUsageLog"("apiKeyId", "createdAt");

-- CreateIndex
CREATE INDEX "ApiUsageLog_statusCode_createdAt_idx" ON "ApiUsageLog"("statusCode", "createdAt");

-- CreateIndex
CREATE INDEX "ScheduledTaskRun_taskName_status_createdAt_idx" ON "ScheduledTaskRun"("taskName", "status", "createdAt");

-- CreateIndex
CREATE INDEX "ScheduledTaskRun_triggeredBy_createdAt_idx" ON "ScheduledTaskRun"("triggeredBy", "createdAt");

-- AddForeignKey
ALTER TABLE "Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PasswordResetToken" ADD CONSTRAINT "PasswordResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CustomerProfile" ADD CONSTRAINT "CustomerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandManagerProfile" ADD CONSTRAINT "BrandManagerProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandManagerProfile" ADD CONSTRAINT "BrandManagerProfile_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SuperAdminProfile" ADD CONSTRAINT "SuperAdminProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRoleAssignment" ADD CONSTRAINT "UserRoleAssignment_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BrandSocialLink" ADD CONSTRAINT "BrandSocialLink_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CategoryTranslation" ADD CONSTRAINT "CategoryTranslation_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Product" ADD CONSTRAINT "Product_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductVariant" ADD CONSTRAINT "ProductVariant_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMedia" ADD CONSTRAINT "ProductMedia_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductMedia" ADD CONSTRAINT "ProductMedia_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductSEO" ADD CONSTRAINT "ProductSEO_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTranslation" ADD CONSTRAINT "ProductTranslation_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttribute" ADD CONSTRAINT "ProductAttribute_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_attributeId_fkey" FOREIGN KEY ("attributeId") REFERENCES "ProductAttribute"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductAttributeValue" ADD CONSTRAINT "ProductAttributeValue_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProductTag" ADD CONSTRAINT "ProductTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Inventory" ADD CONSTRAINT "Inventory_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryMovement" ADD CONSTRAINT "InventoryMovement_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StockReservation" ADD CONSTRAINT "StockReservation_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Cart" ADD CONSTRAINT "Cart_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CartItem" ADD CONSTRAINT "CartItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Address" ADD CONSTRAINT "Address_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderItem" ADD CONSTRAINT "OrderItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderStatusHistory" ADD CONSTRAINT "OrderStatusHistory_changedBy_fkey" FOREIGN KEY ("changedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderNote" ADD CONSTRAINT "OrderNote_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrderNote" ADD CONSTRAINT "OrderNote_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentEvent" ADD CONSTRAINT "PaymentEvent_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingShipment" ADD CONSTRAINT "ShippingShipment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShippingRule" ADD CONSTRAINT "ShippingRule_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ShipmentTrackingEvent" ADD CONSTRAINT "ShipmentTrackingEvent_shipmentId_fkey" FOREIGN KEY ("shipmentId") REFERENCES "ShippingShipment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnRequest" ADD CONSTRAINT "ReturnRequest_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "ReturnRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReturnItem" ADD CONSTRAINT "ReturnItem_orderItemId_fkey" FOREIGN KEY ("orderItemId") REFERENCES "OrderItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_paymentId_fkey" FOREIGN KEY ("paymentId") REFERENCES "Payment"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Refund" ADD CONSTRAINT "Refund_returnRequestId_fkey" FOREIGN KEY ("returnRequestId") REFERENCES "ReturnRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionBrand" ADD CONSTRAINT "PromotionBrand_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionBrand" ADD CONSTRAINT "PromotionBrand_brandId_fkey" FOREIGN KEY ("brandId") REFERENCES "Brand"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionCategory" ADD CONSTRAINT "PromotionCategory_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionCategory" ADD CONSTRAINT "PromotionCategory_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProduct" ADD CONSTRAINT "PromotionProduct_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupon" ADD CONSTRAINT "Coupon_promotionId_fkey" FOREIGN KEY ("promotionId") REFERENCES "Promotion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashSaleItem" ADD CONSTRAINT "FlashSaleItem_flashSaleId_fkey" FOREIGN KEY ("flashSaleId") REFERENCES "FlashSale"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashSaleItem" ADD CONSTRAINT "FlashSaleItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FlashSaleItem" ADD CONSTRAINT "FlashSaleItem_variantId_fkey" FOREIGN KEY ("variantId") REFERENCES "ProductVariant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardAccount" ADD CONSTRAINT "RewardAccount_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardTransaction" ADD CONSTRAINT "RewardTransaction_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "RewardAccount"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RewardTransaction" ADD CONSTRAINT "RewardTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wallet" ADD CONSTRAINT "Wallet_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WalletTransaction" ADD CONSTRAINT "WalletTransaction_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralCode" ADD CONSTRAINT "ReferralCode_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralInvitation" ADD CONSTRAINT "ReferralInvitation_referralCodeId_fkey" FOREIGN KEY ("referralCodeId") REFERENCES "ReferralCode"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralInvitation" ADD CONSTRAINT "ReferralInvitation_inviteeCustomerId_fkey" FOREIGN KEY ("inviteeCustomerId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_invitationId_fkey" FOREIGN KEY ("invitationId") REFERENCES "ReferralInvitation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReferralReward" ADD CONSTRAINT "ReferralReward_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Wishlist" ADD CONSTRAINT "Wishlist_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_wishlistId_fkey" FOREIGN KEY ("wishlistId") REFERENCES "Wishlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WishlistItem" ADD CONSTRAINT "WishlistItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewMedia" ADD CONSTRAINT "ReviewMedia_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHelpfulVote" ADD CONSTRAINT "ReviewHelpfulVote_reviewId_fkey" FOREIGN KEY ("reviewId") REFERENCES "Review"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewHelpfulVote" ADD CONSTRAINT "ReviewHelpfulVote_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonList" ADD CONSTRAINT "ComparisonList_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonItem" ADD CONSTRAINT "ComparisonItem_comparisonListId_fkey" FOREIGN KEY ("comparisonListId") REFERENCES "ComparisonList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ComparisonItem" ADD CONSTRAINT "ComparisonItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RecentlyViewed" ADD CONSTRAINT "RecentlyViewed_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreference" ADD CONSTRAINT "NotificationPreference_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationTemplate" ADD CONSTRAINT "NotificationTemplate_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CMSSection" ADD CONSTRAINT "CMSSection_pageId_fkey" FOREIGN KEY ("pageId") REFERENCES "CMSPage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_uploadedBy_fkey" FOREIGN KEY ("uploadedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailTemplate" ADD CONSTRAINT "EmailTemplate_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditLog" ADD CONSTRAINT "AuditLog_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalyticsEvent" ADD CONSTRAINT "AnalyticsEvent_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_generatedBy_fkey" FOREIGN KEY ("generatedBy") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbandonedCart" ADD CONSTRAINT "AbandonedCart_cartId_fkey" FOREIGN KEY ("cartId") REFERENCES "Cart"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AbandonedCart" ADD CONSTRAINT "AbandonedCart_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "CustomerProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicket" ADD CONSTRAINT "SupportTicket_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicketMessage" ADD CONSTRAINT "SupportTicketMessage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "SupportTicket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SupportTicketMessage" ADD CONSTRAINT "SupportTicketMessage_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ScheduledTaskRun" ADD CONSTRAINT "ScheduledTaskRun_triggeredBy_fkey" FOREIGN KEY ("triggeredBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

