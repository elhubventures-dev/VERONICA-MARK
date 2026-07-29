"use server";

import { revalidatePath } from "next/cache";

import { createAction } from "@/lib/actions/create-action";
import { mapOrderAddress, toAddressJson } from "@/lib/commerce/order-address";
import { toPrismaOrderStatus } from "@/lib/commerce/order-status";
import { mergeOrderNotes } from "@/lib/commerce/staff-order-detail";
import { notifyCustomerOrderStatus } from "@/lib/email/order-notifications";
import { NotFoundError } from "@/lib/errors";
import { orderRepository } from "@/lib/repositories/order.repository";
import {
  updateOrderDetailsSchema,
  updateOrderStatusSchema,
} from "@/lib/validations/order-edit";

export const updateAdminOrderStatusAction = createAction(
  "admin.orders.update_status",
  {
    schema: updateOrderStatusSchema,
    roles: ["SUPER_ADMIN"],
  },
  async (input, context) => {
    const order = await orderRepository.findByOrderNumber(input.orderNumber);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const nextStatus = toPrismaOrderStatus(input.status);
    const updated = await orderRepository.updateStatus(order.id, nextStatus, {
      note: input.note?.trim() || `Super Admin set status to ${input.status}`,
      changedBy: context?.userId,
      fromStatus: order.status,
    });

    await notifyCustomerOrderStatus(updated, nextStatus);

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${input.orderNumber}`);
    revalidatePath("/admin");

    return {
      orderNumber: updated.orderNumber,
      status: input.status,
    };
  },
);

export const updateAdminOrderDetailsAction = createAction(
  "admin.orders.update_details",
  {
    schema: updateOrderDetailsSchema,
    roles: ["SUPER_ADMIN"],
  },
  async (input) => {
    const order = await orderRepository.findByOrderNumber(input.orderNumber);
    if (!order) {
      throw new NotFoundError("Order not found");
    }

    const shippingAddress = toAddressJson({
      name: input.shippingAddress.name,
      phone: input.shippingAddress.phone,
      email: input.shippingAddress.email ?? "",
      line1: input.shippingAddress.line1,
      line2: input.shippingAddress.line2 ?? "",
      city: input.shippingAddress.city,
      state: input.shippingAddress.state ?? "",
      postalCode: input.shippingAddress.postalCode ?? "",
      country: input.shippingAddress.country,
    });

    // Keep billing in sync when it previously matched shipping (common at checkout).
    const currentShipping = mapOrderAddress(order.shippingAddress);
    const currentBilling = mapOrderAddress(order.billingAddress);
    const billingMatchedShipping =
      currentBilling.line1 === currentShipping.line1 &&
      currentBilling.city === currentShipping.city &&
      currentBilling.name === currentShipping.name;

    const updated = await orderRepository.updateDetails(order.id, {
      notes: mergeOrderNotes(order.notes, input.notes ?? ""),
      shippingAddress,
      ...(billingMatchedShipping ? { billingAddress: shippingAddress } : {}),
    });

    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${input.orderNumber}`);
    revalidatePath("/admin");

    return {
      orderNumber: updated.orderNumber,
      notes: updated.notes ?? "",
      shippingAddress: mapOrderAddress(updated.shippingAddress),
    };
  },
);
