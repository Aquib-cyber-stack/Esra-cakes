import { OrderStatus, ReviewStatus } from "@/types";
import { statusLabel } from "@/lib/format";

const ORDER_STYLES: Record<OrderStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  REVIEWING: "bg-sky-100 text-sky-800",
  QUOTE_SENT: "bg-indigo-100 text-indigo-800",
  CONFIRMED: "bg-emerald-100 text-emerald-800",
  BAKING: "bg-orange-100 text-orange-800",
  READY: "bg-teal-100 text-teal-800",
  COMPLETED: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const REVIEW_STYLES: Record<ReviewStatus, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

export function OrderStatusBadge({ status }: { status: OrderStatus }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[12.5px] font-semibold ${ORDER_STYLES[status]}`}>
      {statusLabel(status)}
    </span>
  );
}

export function ReviewStatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-[12.5px] font-semibold ${REVIEW_STYLES[status]}`}>
      {statusLabel(status)}
    </span>
  );
}
