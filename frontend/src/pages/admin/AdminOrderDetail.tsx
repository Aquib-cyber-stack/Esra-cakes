import { FormEvent, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api, apiErrorMessage } from "@/lib/api";
import { Order, OrderStatus } from "@/types";
import { OrderStatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, statusLabel } from "@/lib/format";
import EmptyState from "@/components/EmptyState";
import WhatsAppButton from "@/components/WhatsAppButton";

const STATUS_FLOW: OrderStatus[] = [
  "PENDING",
  "REVIEWING",
  "QUOTE_SENT",
  "CONFIRMED",
  "BAKING",
  "READY",
  "COMPLETED",
];

export default function AdminOrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quote, setQuote] = useState("");
  const [note, setNote] = useState("");
  const [savingStatus, setSavingStatus] = useState(false);
  const [savingQuote, setSavingQuote] = useState(false);
  const [savingNote, setSavingNote] = useState(false);

  function load() {
    setLoading(true);
    api
      .get(`/orders/${id}`)
      .then((res) => {
        setOrder(res.data.order);
        setQuote(res.data.order.quote ? String(res.data.order.quote) : "");
      })
      .catch((err) => setError(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, [id]);

  async function updateStatus(status: OrderStatus) {
    setSavingStatus(true);
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });
      setOrder((o) => (o ? { ...o, status: res.data.order.status } : o));
      toast.success(`Status updated to ${statusLabel(status)}`);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSavingStatus(false);
    }
  }

  async function submitQuote(e: FormEvent) {
    e.preventDefault();
    if (!quote) return;
    setSavingQuote(true);
    try {
      const res = await api.patch(`/orders/${id}/quote`, { quote });
      setOrder((o) => (o ? { ...o, quote: res.data.order.quote, status: res.data.order.status } : o));
      toast.success("Quote sent to customer status.");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSavingQuote(false);
    }
  }

  async function submitNote(e: FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setSavingNote(true);
    try {
      const res = await api.post(`/orders/${id}/notes`, { note });
      setOrder((o) => (o ? { ...o, notes: [res.data.note, ...(o.notes || [])] } : o));
      setNote("");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setSavingNote(false);
    }
  }

  if (loading) return <div className="skeleton h-96" />;
  if (error || !order) return <EmptyState title="Order not found" description={error || undefined} />;

  return (
    <div>
      <Link to="/admin/orders" className="text-[13.5px] text-berry font-semibold hover:underline">
        ← Back to orders
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-3 mt-3 mb-6">
        <div>
          <h1 className="heading text-[24px]">{order.reference}</h1>
          <p className="text-[13.5px] text-ink-soft">Submitted {formatDate(order.createdAt)}</p>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      <div className="grid lg:grid-cols-[1.3fr_0.9fr] gap-6">
        <div className="space-y-6">
          <div className="card-surface p-6">
            <h2 className="font-serif text-[16px] font-semibold text-berry-dark mb-4">Customer</h2>
            <dl className="grid sm:grid-cols-3 gap-4 text-[14px]">
              <Detail label="Name" value={order.name} />
              <Detail label="Email" value={order.email} />
              <Detail label="Phone" value={order.phone} />
            </dl>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-serif text-[16px] font-semibold text-berry-dark mb-4">Cake details</h2>
            <dl className="grid sm:grid-cols-2 gap-4 text-[14px]">
              <Detail label="Occasion" value={order.occasion} />
              <Detail label="Flavour" value={order.flavour} />
              <Detail label="Size" value={order.size} />
              <Detail label="Required date" value={formatDate(order.requiredDate)} />
              <Detail label="Theme / colours" value={order.theme || "—"} />
              <Detail label="Cake message" value={order.message || "—"} />
              <Detail label="Fulfillment" value={order.fulfillment === "DELIVERY" ? "Delivery" : "Pickup"} />
              <Detail label="Budget" value={order.budget ? formatCurrency(order.budget) : "—"} />
            </dl>
            {order.address && (
              <div className="mt-4">
                <Detail label="Delivery address" value={order.address} />
              </div>
            )}
            {order.instructions && (
              <div className="mt-4">
                <Detail label="Additional instructions" value={order.instructions} />
              </div>
            )}
            {order.referenceImages.length > 0 && (
              <div className="mt-4">
                <span className="text-[12.5px] font-semibold text-ink-soft uppercase tracking-wide block mb-2">
                  Reference images
                </span>
                <div className="flex flex-wrap gap-3">
                  {order.referenceImages.map((img) => (
                    <a key={img.id} href={img.url} target="_blank" rel="noreferrer" className="w-20 h-20 rounded-lg overflow-hidden block">
                      <img src={img.url} alt="reference" className="w-full h-full object-cover" />
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="card-surface p-6">
            <h2 className="font-serif text-[16px] font-semibold text-berry-dark mb-4">Notes</h2>
            <form onSubmit={submitNote} className="flex gap-3 mb-4">
              <input
                className="input-field"
                placeholder="Add an internal note…"
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
              <button type="submit" disabled={savingNote} className="btn btn-primary !px-5 whitespace-nowrap">
                Add
              </button>
            </form>
            {(order.notes || []).length === 0 ? (
              <p className="text-[13.5px] text-ink-soft">No notes yet.</p>
            ) : (
              <ul className="space-y-3">
                {(order.notes || []).map((n) => (
                  <li key={n.id} className="text-[13.5px] border-l-2 border-gold pl-3">
                    <p className="text-ink">{n.note}</p>
                    <span className="text-ink-soft text-[12px]">
                      {n.admin?.name || "Admin"} · {formatDate(n.createdAt)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="card-surface p-6">
            <h2 className="font-serif text-[16px] font-semibold text-berry-dark mb-4">Update status</h2>
            <div className="flex flex-col gap-2">
              {STATUS_FLOW.map((s) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={savingStatus || order.status === s}
                  className={`text-left px-4 py-2.5 rounded-lg text-[13.5px] font-semibold transition-colors ${
                    order.status === s ? "bg-berry text-paper" : "bg-blush-soft text-berry-dark hover:bg-blush"
                  }`}
                >
                  {statusLabel(s)}
                </button>
              ))}
              <button
                onClick={() => updateStatus("CANCELLED")}
                disabled={savingStatus || order.status === "CANCELLED"}
                className="text-left px-4 py-2.5 rounded-lg text-[13.5px] font-semibold bg-red-50 text-red-700 hover:bg-red-100"
              >
                Cancelled
              </button>
            </div>
          </div>

          <div className="card-surface p-6">
            <h2 className="font-serif text-[16px] font-semibold text-berry-dark mb-4">Set quote</h2>
            <form onSubmit={submitQuote} className="flex gap-3">
              <input
                type="number"
                min={0}
                className="input-field"
                placeholder="Amount in ₹"
                value={quote}
                onChange={(e) => setQuote(e.target.value)}
              />
              <button type="submit" disabled={savingQuote} className="btn btn-primary !px-5 whitespace-nowrap">
                Send
              </button>
            </form>
            {order.quote && (
              <p className="text-[13px] text-ink-soft mt-2">Current quote: {formatCurrency(order.quote)}</p>
            )}
          </div>

          <WhatsAppButton
            className="btn btn-primary w-full justify-center"
            message={`Hi ${order.name}, this is Esra Cakes regarding your order ${order.reference}.`}
          />
        </div>
      </div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-[12px] font-semibold text-ink-soft uppercase tracking-wide">{label}</dt>
      <dd className="text-ink mt-0.5">{value}</dd>
    </div>
  );
}
