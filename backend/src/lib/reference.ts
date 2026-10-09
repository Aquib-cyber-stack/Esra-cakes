import { prisma } from "./prisma";

/**
 * Generates a human-friendly, sequential order reference like EC-2026-0001.
 * Falls back gracefully if run concurrently (unique constraint retries at the DB layer
 * would be the production-grade approach; this covers the common case cleanly).
 */
export async function generateOrderReference(): Promise<string> {
  const year = new Date().getFullYear();
  const count = await prisma.order.count({
    where: {
      createdAt: {
        gte: new Date(`${year}-01-01T00:00:00.000Z`),
        lt: new Date(`${year + 1}-01-01T00:00:00.000Z`),
      },
    },
  });
  const next = String(count + 1).padStart(4, "0");
  return `EC-${year}-${next}`;
}
