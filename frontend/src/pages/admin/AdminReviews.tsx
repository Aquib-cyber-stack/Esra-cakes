import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiErrorMessage } from "@/lib/api";
import { Review } from "@/types";
import { ReviewStatusBadge } from "@/components/StatusBadge";
import { formatDate } from "@/lib/format";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";

const FILTERS = ["ALL", "PENDING", "APPROVED", "REJECTED"];

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [deleteTarget, setDeleteTarget] = useState<Review | null>(null);

  function load() {
    setLoading(true);
    api
      .get("/reviews/admin/all", { params: { status: filter } })
      .then((res) => setReviews(res.data.reviews))
      .catch((err) => toast.error(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, [filter]);

  async function setStatus(id: string, status: "APPROVED" | "REJECTED") {
    try {
      const res = await api.patch(`/reviews/${id}/status`, { status });
      setReviews((rs) => rs.map((r) => (r.id === id ? res.data.review : r)));
      toast.success(`Review ${status.toLowerCase()}`);
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function toggleFeatured(id: string) {
    try {
      const res = await api.patch(`/reviews/${id}/feature`);
      setReviews((rs) => rs.map((r) => (r.id === id ? res.data.review : r)));
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/reviews/${deleteTarget.id}`);
      setReviews((rs) => rs.filter((r) => r.id !== deleteTarget.id));
      toast.success("Review deleted");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <h1 className="heading text-[26px] mb-6">Reviews</h1>

      <div className="flex gap-2 mb-6">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-[13px] font-semibold border ${
              filter === f ? "bg-berry text-paper border-berry" : "border-berry-dark/15 text-berry-dark"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-24" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <EmptyState title="No reviews here" description="Reviews submitted by customers will show up in this list." />
      ) : (
        <div className="space-y-4">
          {reviews.map((r) => (
            <div key={r.id} className="card-surface p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{r.name}</span>
                    <span className="text-gold text-[13px]">{"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}</span>
                    <ReviewStatusBadge status={r.status} />
                    {r.isFeatured && <span className="text-[12px] text-gold font-semibold">★ Featured</span>}
                  </div>
                  <p className="text-[14.5px] text-ink-soft mt-2 max-w-xl">{r.message}</p>
                  <span className="text-[12.5px] text-ink-soft/70 mt-1 block">
                    {r.occasion ? `${r.occasion} · ` : ""}
                    {formatDate(r.createdAt)}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {r.status !== "APPROVED" && (
                    <button onClick={() => setStatus(r.id, "APPROVED")} className="text-[13px] font-semibold text-emerald-700 hover:underline">
                      Approve
                    </button>
                  )}
                  {r.status !== "REJECTED" && (
                    <button onClick={() => setStatus(r.id, "REJECTED")} className="text-[13px] font-semibold text-red-600 hover:underline">
                      Reject
                    </button>
                  )}
                  <button onClick={() => toggleFeatured(r.id)} className="text-[13px] font-semibold text-gold hover:underline">
                    {r.isFeatured ? "Unfeature" : "Feature"}
                  </button>
                  <button onClick={() => setDeleteTarget(r)} className="text-[13px] font-semibold text-ink-soft hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this review?"
        description="This action can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
