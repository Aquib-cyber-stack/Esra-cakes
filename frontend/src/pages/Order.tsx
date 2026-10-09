import { FormEvent, useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { api, apiErrorMessage, fieldErrors } from "@/lib/api";
import ImageUploader from "@/components/ImageUploader";
import WhatsAppButton from "@/components/WhatsAppButton";

const OCCASIONS = ["Birthday", "Wedding", "Anniversary", "Baby Shower", "Corporate Event", "Just Because", "Other"];
const FLAVOURS = [
  "Chocolate Truffle",
  "Red Velvet",
  "Pistachio Rose",
  "Salted Caramel",
  "Black Forest",
  "Lemon Blueberry",
  "Vanilla Bean",
  "Other / Mix",
];
const SIZES = [
  "6-inch (8 servings)",
  "8-inch (16 servings)",
  "10-inch (24 servings)",
  "Two-tier (30+ servings)",
  "Not sure yet",
];

interface FormState {
  name: string;
  email: string;
  phone: string;
  occasion: string;
  flavour: string;
  size: string;
  requiredDate: string;
  theme: string;
  message: string;
  instructions: string;
  budget: string;
  fulfillment: "PICKUP" | "DELIVERY";
  address: string;
}

const initialState: FormState = {
  name: "",
  email: "",
  phone: "",
  occasion: "",
  flavour: "",
  size: "",
  requiredDate: "",
  theme: "",
  message: "",
  instructions: "",
  budget: "",
  fulfillment: "PICKUP",
  address: "",
};

export default function Order() {
  const [params] = useSearchParams();
  const cakeId = params.get("cakeId");

  const [form, setForm] = useState<FormState>(initialState);
  const [files, setFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [reference, setReference] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  function validateClientSide(): boolean {
    const next: Record<string, string[]> = {};
    if (!form.name.trim()) next.name = ["Please enter your name."];
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = ["Enter a valid email address."];
    if (form.phone.trim().length < 7) next.phone = ["Enter a valid phone number."];
    if (!form.occasion) next.occasion = ["Tell us the occasion."];
    if (!form.flavour) next.flavour = ["Pick a flavour."];
    if (!form.size) next.size = ["Pick a size."];
    if (!form.requiredDate) next.requiredDate = ["Pick a required date."];
    if (form.fulfillment === "DELIVERY" && form.address.trim().length < 6) {
      next.address = ["Please provide a delivery address."];
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validateClientSide()) {
      toast.error("Please fix the highlighted fields.");
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => fd.append(k, v));
      if (cakeId) fd.append("cakeId", cakeId);
      files.forEach((f) => fd.append("referenceImages", f));

      const res = await api.post("/orders", fd, { headers: { "Content-Type": "multipart/form-data" } });
      setReference(res.data.order.reference);
      toast.success("Your request has been sent!");
    } catch (err) {
      const fe = fieldErrors(err);
      if (fe) setErrors(fe);
      toast.error(apiErrorMessage(err, "Couldn't submit your order. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  if (reference) {
    return (
      <div className="wrap py-20">
        <div className="cta-block rounded-[32px] py-16 px-6 sm:px-12 text-center text-cream max-w-2xl mx-auto">
          <span className="eyebrow" style={{ color: "var(--gold)" }}>
            Request received
          </span>
          <h1 className="heading text-cream text-[30px] sm:text-[38px] mt-3 mb-4">Thank you, {form.name.split(" ")[0]}!</h1>
          <p className="text-cream/85 max-w-md mx-auto mb-2">
            Your custom cake request is in. We'll review it and send a design + quote within 24 hours.
          </p>
          <div className="inline-block bg-cream/10 border border-cream/20 rounded-xl px-6 py-3 my-6">
            <span className="text-[13px] text-cream/70 block">Your request ID</span>
            <span className="font-serif text-[24px] text-gold font-semibold tracking-wide">{reference}</span>
          </div>
          <div className="flex gap-4 justify-center flex-wrap mt-2">
            <WhatsAppButton
              className="btn"
              message={`Hi Esra Cakes! I just submitted a custom cake request — reference ${reference}. Following up to make sure it came through.`}
            >
              <span
                style={{ background: "var(--gold)", color: "var(--berry-dark)" }}
                className="px-6 py-3.5 rounded-full font-bold text-[15px] inline-flex items-center"
              >
                Confirm on WhatsApp
              </span>
            </WhatsAppButton>
            <a href="/" className="btn btn-ghost !border-cream/40 !text-cream hover:!bg-cream/10">
              Back to home
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="wrap py-14 max-w-3xl">
      <div className="section-head">
        <span className="eyebrow">Custom order</span>
        <h1 className="heading text-[32px] sm:text-[42px]">Let's design your cake.</h1>
        <p>Fill in as much detail as you can — the more we know, the closer the first draft lands.</p>
      </div>

      <form onSubmit={handleSubmit} className="card-surface p-6 sm:p-8 space-y-8" noValidate>
        {/* Contact */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-[18px] text-berry-dark font-semibold mb-1">Your details</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Full name" error={errors.name}>
              <input className={inputCls(errors.name)} value={form.name} onChange={(e) => update("name", e.target.value)} />
            </Field>
            <Field label="Phone number" error={errors.phone}>
              <input className={inputCls(errors.phone)} value={form.phone} onChange={(e) => update("phone", e.target.value)} />
            </Field>
          </div>
          <Field label="Email address" error={errors.email}>
            <input type="email" className={inputCls(errors.email)} value={form.email} onChange={(e) => update("email", e.target.value)} />
          </Field>
        </fieldset>

        {/* Cake spec */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-[18px] text-berry-dark font-semibold mb-1">The cake</legend>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Occasion" error={errors.occasion}>
              <select className={inputCls(errors.occasion)} value={form.occasion} onChange={(e) => update("occasion", e.target.value)}>
                <option value="">Select an occasion</option>
                {OCCASIONS.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
            </Field>
            <Field label="Flavour" error={errors.flavour}>
              <select className={inputCls(errors.flavour)} value={form.flavour} onChange={(e) => update("flavour", e.target.value)}>
                <option value="">Select a flavour</option>
                {FLAVOURS.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Size / servings" error={errors.size}>
              <select className={inputCls(errors.size)} value={form.size} onChange={(e) => update("size", e.target.value)}>
                <option value="">Select a size</option>
                {SIZES.map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </Field>
            <Field label="Required date" error={errors.requiredDate}>
              <input
                type="date"
                className={inputCls(errors.requiredDate)}
                value={form.requiredDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => update("requiredDate", e.target.value)}
              />
            </Field>
          </div>
          <Field label="Theme / colours (optional)">
            <input
              className={inputCls()}
              placeholder="e.g. Pastel pink and gold, floral"
              value={form.theme}
              onChange={(e) => update("theme", e.target.value)}
            />
          </Field>
          <Field label="Cake message (optional)">
            <input
              className={inputCls()}
              placeholder="e.g. Happy 30th, Aisha!"
              value={form.message}
              onChange={(e) => update("message", e.target.value)}
            />
          </Field>
          <Field label="Additional instructions (optional)">
            <textarea
              className={inputCls() + " min-h-[100px]"}
              placeholder="Allergies, dietary needs, design inspiration, anything else we should know"
              value={form.instructions}
              onChange={(e) => update("instructions", e.target.value)}
            />
          </Field>
          <ImageUploader files={files} onChange={setFiles} max={4} />
        </fieldset>

        {/* Fulfillment */}
        <fieldset className="space-y-4">
          <legend className="font-serif text-[18px] text-berry-dark font-semibold mb-1">Pickup or delivery</legend>
          <div className="flex gap-3">
            {(["PICKUP", "DELIVERY"] as const).map((opt) => (
              <button
                type="button"
                key={opt}
                onClick={() => update("fulfillment", opt)}
                className={`px-5 py-2.5 rounded-full text-[14px] font-semibold border transition-colors ${
                  form.fulfillment === opt ? "bg-berry text-paper border-berry" : "border-berry-dark/15 text-berry-dark"
                }`}
              >
                {opt === "PICKUP" ? "Pickup" : "Delivery"}
              </button>
            ))}
          </div>
          {form.fulfillment === "DELIVERY" && (
            <Field label="Delivery address" error={errors.address}>
              <textarea
                className={inputCls(errors.address) + " min-h-[80px]"}
                value={form.address}
                onChange={(e) => update("address", e.target.value)}
              />
            </Field>
          )}
          <Field label="Budget (optional)">
            <input
              type="number"
              min={0}
              className={inputCls()}
              placeholder="Approximate budget in ₹"
              value={form.budget}
              onChange={(e) => update("budget", e.target.value)}
            />
          </Field>
        </fieldset>

        <button type="submit" disabled={submitting} className={`btn btn-primary w-full justify-center ${submitting ? "btn-disabled" : ""}`}>
          {submitting ? "Submitting…" : "Submit my request"}
        </button>
      </form>
    </div>
  );
}

function inputCls(error?: string[]) {
  return `input-field ${error?.length ? "input-field-error" : ""}`;
}

function Field({ label, error, children }: { label: string; error?: string[]; children: React.ReactNode }) {
  return (
    <div>
      <label className="field-label">{label}</label>
      {children}
      {error?.[0] && <p className="field-error">{error[0]}</p>}
    </div>
  );
}
