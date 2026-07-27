/**
 * Domain services encapsulate business rules and orchestrate repositories.
 * Keep Prisma queries out of Server Actions and Route Handlers — call services instead.
 */
export abstract class DomainService {
  protected assertPositiveQuantity(quantity: number): void {
    if (!Number.isInteger(quantity) || quantity < 1) {
      throw new Error("Quantity must be a positive integer");
    }
  }
}
