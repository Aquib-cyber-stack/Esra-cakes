import { FormEvent, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { api, apiErrorMessage } from "@/lib/api";
import { Cake, CakeCategory } from "@/types";
import { formatCurrency, categoryLabel } from "@/lib/format";
import ConfirmDialog from "@/components/ConfirmDialog";
import EmptyState from "@/components/EmptyState";

const CATEGORIES: CakeCategory[] = ["BIRTHDAY", "WEDDING", "ANNIVERSARY", "KIDS", "CORPORATE", "CUSTOM"];

interface CakeFormState {
  name: string;
  description: string;
  category: CakeCategory;
  flavours: string;
  sizes: string;
  startingPrice: string;
  isAvailable: boolean;
  isFeatured: boolean;
}

const emptyForm: CakeFormState = {
  name: "",
  description: "",
  category: "BIRTHDAY",
  flavours: "",
  sizes: "",
  startingPrice: "",
  isAvailable: true,
  isFeatured: false,
};

export default function AdminCakes() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Cake | null>(null);
  const [form, setForm] = useState<CakeFormState>(emptyForm);
  const [saving, setSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [deleteTarget, setDeleteTarget] = useState<Cake | null>(null);

  function load() {
    setLoading(true);
    api
      .get("/cakes")
      .then((res) => setCakes(res.data.cakes))
      .catch((err) => toast.error(apiErrorMessage(err)))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setImageFiles([]);
    setModalOpen(true);
  }

  function openEdit(cake: Cake) {
    setEditing(cake);
    setForm({
      name: cake.name,
      description: cake.description,
      category: cake.category,
      flavours: cake.flavours.join(", "),
      sizes: cake.sizes.join(", "),
      startingPrice: String(cake.startingPrice),
      isAvailable: cake.isAvailable,
      isFeatured: cake.isFeatured,
    });
    setImageFiles([]);
    setModalOpen(true);
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        description: form.description,
        category: form.category,
        flavours: form.flavours.split(",").map((s) => s.trim()).filter(Boolean),
        sizes: form.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        startingPrice: Number(form.startingPrice),
        isAvailable: form.isAvailable,
        isFeatured: form.isFeatured,
      };

      let cakeId = editing?.id;
      if (editing) {
        await api.patch(`/cakes/${editing.id}`, payload);
      } else {
        const res = await api.post("/cakes", payload);
        cakeId = res.data.cake.id;
      }

      if (imageFiles.length && cakeId) {
        const fd = new FormData();
        imageFiles.forEach((f) => fd.append("images", f));
        await api.post(`/cakes/${cakeId}/images`, fd, { headers: { "Content-Type": "multipart/form-data" } });
      }

      toast.success(editing ? "Cake updated" : "Cake added");
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(apiErrorMessage(err, "Couldn't save this cake."));
    } finally {
      setSaving(false);
    }
  }

  async function confirmDelete() {
    if (!deleteTarget) return;
    try {
      await api.delete(`/cakes/${deleteTarget.id}`);
      toast.success("Cake deleted");
      setCakes((c) => c.filter((k) => k.id !== deleteTarget.id));
    } catch (err) {
      toast.error(apiErrorMessage(err));
    } finally {
      setDeleteTarget(null);
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="heading text-[26px]">Cakes</h1>
        <button onClick={openCreate} className="btn btn-primary">
          + Add cake
        </button>
      </div>

      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton h-56" />
          ))}
        </div>
      ) : cakes.length === 0 ? (
        <EmptyState title="No cakes yet" description="Add your first cake to populate the gallery." actionLabel="Add cake" onAction={openCreate} />
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cakes.map((cake) => {
            const primary = cake.images.find((i) => i.isPrimary) || cake.images[0];
            return (
              <div key={cake.id} className="card-surface overflow-hidden">
                <div className="aspect-[4/3] bg-blush-soft">
                  {primary && <img src={primary.url} alt={cake.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-4">
                  <span className="eyebrow">{categoryLabel(cake.category)}</span>
                  <h3 className="font-serif text-[16px] font-semibold text-berry-dark mt-1">{cake.name}</h3>
                  <div className="flex items-center justify-between mt-2 text-[13.5px]">
                    <span className="text-berry font-semibold">{formatCurrency(cake.startingPrice)}</span>
                    <div className="flex gap-2">
                      {cake.isFeatured && <span className="text-gold">★ Featured</span>}
                      {!cake.isAvailable && <span className="text-red-600">Unavailable</span>}
                    </div>
                  </div>
                  <div className="flex gap-3 mt-3">
                    <button onClick={() => openEdit(cake)} className="text-[13px] font-semibold text-berry hover:underline">
                      Edit
                    </button>
                    <button onClick={() => setDeleteTarget(cake)} className="text-[13px] font-semibold text-red-600 hover:underline">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[100] bg-ink/40 flex items-center justify-center p-4 overflow-y-auto" onClick={() => setModalOpen(false)}>
          <div className="bg-paper rounded-2xl p-6 sm:p-8 w-full max-w-lg my-8" onClick={(e) => e.stopPropagation()}>
            <h2 className="font-serif text-xl text-berry-dark font-semibold mb-5">{editing ? "Edit cake" : "Add cake"}</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="field-label">Name</label>
                <input required className="input-field" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Description</label>
                <textarea required className="input-field min-h-[80px]" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Category</label>
                  <select className="input-field" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value as CakeCategory }))}>
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {categoryLabel(c)}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label">Starting price (₹)</label>
                  <input required type="number" min={0} className="input-field" value={form.startingPrice} onChange={(e) => setForm((f) => ({ ...f, startingPrice: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="field-label">Flavours (comma-separated)</label>
                <input required className="input-field" value={form.flavours} onChange={(e) => setForm((f) => ({ ...f, flavours: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Sizes (comma-separated)</label>
                <input required className="input-field" value={form.sizes} onChange={(e) => setForm((f) => ({ ...f, sizes: e.target.value }))} />
              </div>
              <div>
                <label className="field-label">Images</label>
                <input type="file" accept="image/*" multiple onChange={(e) => setImageFiles(Array.from(e.target.files || []))} className="text-[13.5px]" />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                  <input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm((f) => ({ ...f, isAvailable: e.target.checked }))} />
                  Available
                </label>
                <label className="flex items-center gap-2 text-[13.5px] font-medium text-ink">
                  <input type="checkbox" checked={form.isFeatured} onChange={(e) => setForm((f) => ({ ...f, isFeatured: e.target.checked }))} />
                  Featured
                </label>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModalOpen(false)} className="btn btn-ghost !py-2 !px-5 text-[14px]">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className={`btn btn-primary !py-2 !px-5 text-[14px] ${saving ? "btn-disabled" : ""}`}>
                  {saving ? "Saving…" : "Save cake"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!deleteTarget}
        title="Delete this cake?"
        description={`"${deleteTarget?.name}" will be permanently removed from the gallery.`}
        confirmLabel="Delete"
        danger
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
