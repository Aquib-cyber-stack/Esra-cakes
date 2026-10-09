import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiErrorMessage } from "@/lib/api";
import { ContactMessage } from "@/types";
import { formatDate } from "@/lib/format";
import EmptyState from "@/components/EmptyState";
import ConfirmDialog from "@/components/ConfirmDialog";

export default function AdminMessages() {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [unreadOnly, setUnreadOnly] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);

  function load() {
    setLoading(true);
    api
      .get("/contact", { params: { unreadOnly: unreadOnly || undefined } })
      .then((res) => setMessages(res.data.messages))
      .catch((err) => toast.error(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, [unreadOnly]);

  async function markRead(id: string) {
    try {
      const res = await api.patch(`/contact/${id}/read`);
      setMessages((ms) => ms.map((m) => (m.id === id ? res.data.message : m)));
    } catch (err) {
      toast.error(apiErrorMessage(err));
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/contact/${deleteTarget.id}`);
      setMessages((ms) => ms.filter((m) => m.id !== deleteTarget.id));
      toast.success("Message deleted");
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading text-[26px]">Messages</h1>
        <label className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
          <input type="checkbox" checked={unreadOnly} onChange={(e) => setUnreadOnly(e.target.checked)} />
          Unread only
        </label>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-20" />
          ))}
        </div>
      ) : messages.length === 0 ? (
        <EmptyState title="No messages" description="Contact form submissions will appear here." />
      ) : (
        <div className="space-y-3">
          {messages.map((m) => (
            <div key={m.id} className={`card-surface p-5 ${!m.isRead ? "border-l-4 border-l-berry" : ""}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-ink">{m.name}</span>
                    {!m.isRead && <span className="text-[11px] font-bold text-berry bg-blush-soft px-2 py-0.5 rounded-full">NEW</span>}
                  </div>
                  <span className="text-[12.5px] text-ink-soft">{m.email}{m.phone ? ` · ${m.phone}` : ""}</span>
                  {m.subject && <p className="text-[13.5px] font-semibold text-berry-dark mt-1.5">{m.subject}</p>}
                  <p className="text-[14px] text-ink-soft mt-1 max-w-xl">{m.message}</p>
                  <span className="text-[12px] text-ink-soft/70 mt-1 block">{formatDate(m.createdAt)}</span>
                </div>
                <div className="flex gap-3">
                  {!m.isRead && (
                    <button onClick={() => markRead(m.id)} className="text-[13px] font-semibold text-berry hover:underline">
                      Mark read
                    </button>
                  )}
                  <button onClick={() => setDeleteTarget(m)} className="text-[13px] font-semibold text-red-600 hover:underline">
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
        title="Delete this message?"
        description="This action can't be undone."
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
