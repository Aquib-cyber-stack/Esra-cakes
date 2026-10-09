import { Link } from "react-router-dom";
import { Order } from "@/types";
import { formatCurrency, formatDate } from "@/lib/format";
import { OrderStatusBadge } from "./StatusBadge";
import EmptyState from "./EmptyState";

interface Props {
  orders: Order[];
  loading: boolean;
}

export default function OrderTable({ orders, loading }: Props) {
  if (loading) {
    return (
      <div className="card-surface overflow-hidden">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton h-14 rounded-none border-b border-berry-dark/5 last:border-0 m-0" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return <EmptyState title="No orders found" description="Try adjusting your search or status filter." />;
  }

  return (
    <div className="card-surface overflow-x-auto">
      <table className="w-full text-left text-[14px] min-w-[720px]">
        <thead>
          <tr className="border-b border-berry-dark/10 text-ink-soft text-[12.5px] uppercase tracking-wide">
            <th className="px-5 py-3.5 font-semibold">Reference</th>
            <th className="px-5 py-3.5 font-semibold">Customer</th>
            <th className="px-5 py-3.5 font-semibold">Occasion</th>
            <th className="px-5 py-3.5 font-semibold">Required date</th>
            <th className="px-5 py-3.5 font-semibold">Quote</th>
            <th className="px-5 py-3.5 font-semibold">Status</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id} className="border-b border-berry-dark/5 last:border-0 hover:bg-blush-soft/40">
              <td className="px-5 py-3.5">
                <Link to={`/admin/orders/${o.id}`} className="font-semibold text-berry hover:underline">
                  {o.reference}
                </Link>
              </td>
              <td className="px-5 py-3.5">
                <div className="font-medium text-ink">{o.name}</div>
                <div className="text-ink-soft text-[12.5px]">{o.email}</div>
              </td>
              <td className="px-5 py-3.5 text-ink-soft">{o.occasion}</td>
              <td className="px-5 py-3.5 text-ink-soft">{formatDate(o.requiredDate)}</td>
              <td className="px-5 py-3.5 text-ink-soft">{o.quote ? formatCurrency(o.quote) : "—"}</td>
              <td className="px-5 py-3.5">
                <OrderStatusBadge status={o.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
