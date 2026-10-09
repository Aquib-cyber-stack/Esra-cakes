import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiErrorMessage } from "@/lib/api";
import { DashboardStats, Order } from "@/types";
import StatCard from "@/components/StatCard";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate } from "@/lib/format";
import EmptyState from "@/components/EmptyState";

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recent, setRecent] = useState<Order[]>([]);
  const [upcoming, setUpcoming] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api
      .get("/orders/dashboard/stats")
      .then((res) => {
        setStats(res.data.stats);
        setRecent(res.data.recentOrders);
        setUpcoming(res.data.upcomingOrders);
      })
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="heading text-[26px] mb-6">Dashboard</h1>

      {error && <EmptyState title="Couldn't load dashboard" description={error} />}

      {loading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
      ) : (
        stats && (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <StatCard label="Total Orders" value={stats.totalOrders} />
            <StatCard label="Pending Requests" value={stats.pendingRequests} accent="gold" />
            <StatCard label="Confirmed" value={stats.confirmedOrders} accent="pistachio" />
            <StatCard label="Completed" value={stats.completedOrders} />
            <StatCard label="Revenue" value={formatCurrency(stats.revenue)} hint="from completed orders" />
          </div>
        )
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="card-surface p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-serif text-[17px] font-semibold text-berry-dark">Recent orders</h2>
            <Link to="/admin/orders" className="text-[13px] text-berry font-semibold hover:underline">
              View all
            </Link>
          </div>
          {recent.length === 0 && !loading ? (
            <p className="text-[13.5px] text-ink-soft">No orders yet.</p>
          ) : (
            <ul className="space-y-3">
              {recent.map((o) => (
                <li key={o.id}>
                  <Link to={`/admin/orders/${o.id}`} className="flex items-center justify-between hover:bg-blush-soft/50 rounded-lg p-2 -m-2">
                    <div>
                      <div className="text-[14px] font-medium text-ink">{o.name}</div>
                      <div className="text-[12.5px] text-ink-soft">{o.reference} · {formatDate(o.createdAt)}</div>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="card-surface p-5">
          <h2 className="font-serif text-[17px] font-semibold text-berry-dark mb-4">Upcoming orders</h2>
          {upcoming.length === 0 && !loading ? (
            <p className="text-[13.5px] text-ink-soft">Nothing scheduled yet.</p>
          ) : (
            <ul className="space-y-3">
              {upcoming.map((o) => (
                <li key={o.id}>
                  <Link to={`/admin/orders/${o.id}`} className="flex items-center justify-between hover:bg-blush-soft/50 rounded-lg p-2 -m-2">
                    <div>
                      <div className="text-[14px] font-medium text-ink">{o.name}</div>
                      <div className="text-[12.5px] text-ink-soft">{o.occasion} · needed {formatDate(o.requiredDate)}</div>
                    </div>
                    <OrderStatusBadge status={o.status} />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
