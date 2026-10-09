import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiErrorMessage } from "@/lib/api";
import { Order } from "@/types";
import OrderTable from "@/components/OrderTable";

const STATUSES = [
  "ALL",
  "PENDING",
  "REVIEWING",
  "QUOTE_SENT",
  "CONFIRMED",
  "BAKING",
  "READY",
  "COMPLETED",
  "CANCELLED",
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState("ALL");
  const [search, setSearch] = useState("");

  useEffect(() => {
    setLoading(true);
    const timeout = setTimeout(() => {
      api
        .get("/orders", { params: { status, search: search || undefined } })
        .then((res) => setOrders(res.data.orders))
        .catch((err) => toast.error(apiErrorMessage(err)))
        .finally(() => setLoading(false));
    }, 250);
    return () => clearTimeout(timeout);
  }, [status, search]);

  return (
    <div>
      <h1 className="heading text-[26px] mb-6">Orders</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex flex-wrap gap-2">
          {STATUSES.map((s) => (
            <button
              key={s}
              onClick={() => setStatus(s)}
              className={`px-3.5 py-1.5 rounded-full text-[12.5px] font-semibold border transition-colors ${
                status === s ? "bg-berry text-paper border-berry" : "bg-paper text-berry-dark border-berry-dark/15"
              }`}
            >
              {s.replaceAll("_", " ")}
            </button>
          ))}
        </div>
        <input
          className="input-field md:ml-auto md:w-64"
          placeholder="Search name, email, reference…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <OrderTable orders={orders} loading={loading} />
    </div>
  );
}
