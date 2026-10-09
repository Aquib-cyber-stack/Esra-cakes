import { FormEvent, useState } from "react";
import toast from "react-hot-toast";
import { api, apiErrorMessage, fieldErrors } from "@/lib/api";
import { useSiteConfig } from "@/context/SiteConfigContext";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function Contact() {
  const { businessHours } = useSiteConfig();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      await api.post("/contact", form);
      setSent(true);
      toast.success("Message sent — we'll get back to you soon.");
    } catch (err) {
      const fe = fieldErrors(err);
      if (fe) setErrors(fe);
      toast.error(apiErrorMessage(err, "Couldn't send your message. Please try again."));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="wrap py-14">
      <div className="section-head">
        <span className="eyebrow">Get in touch</span>
        <h1 className="heading text-[32px] sm:text-[42px]">Let's talk about your cake.</h1>
        <p>Questions, custom requests, or just want to say hi — we usually reply within a few hours.</p>
      </div>

      <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10">
        <div className="space-y-5">
          <div className="card-surface p-6">
            <h3 className="font-serif text-[17px] font-semibold text-berry-dark mb-3">WhatsApp</h3>
            <p className="text-[14px] text-ink-soft mb-4">Fastest way to reach us — usually a reply within the hour.</p>
            <WhatsAppButton className="btn btn-primary !py-2.5 !px-5 text-[14px]" />
          </div>
          <div className="card-surface p-6">
            <h3 className="font-serif text-[17px] font-semibold text-berry-dark mb-3">Email</h3>
            <a href="mailto:hello@esracakes.com" className="text-[14.5px] text-berry font-semibold hover:underline">
              hello@esracakes.com
            </a>
          </div>
          <div className="card-surface p-6">
            <h3 className="font-serif text-[17px] font-semibold text-berry-dark mb-3">Business hours</h3>
            <ul className="text-[14px] text-ink-soft space-y-1.5">
              <li className="flex justify-between"><span>Mon – Fri</span><span>{businessHours.weekdays}</span></li>
              <li className="flex justify-between"><span>Saturday</span><span>{businessHours.saturday}</span></li>
              <li className="flex justify-between"><span>Sunday</span><span>{businessHours.sunday}</span></li>
            </ul>
          </div>
          <div className="card-surface p-6">
            <h3 className="font-serif text-[17px] font-semibold text-berry-dark mb-3">Location</h3>
            <p className="text-[14px] text-ink-soft mb-3">Mumbai, Maharashtra — pickup available by appointment.</p>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                title="Esra Cakes location"
                className="w-full h-full border-0"
                loading="lazy"
                src="https://www.google.com/maps?q=Mumbai,Maharashtra&output=embed"
              />
            </div>
          </div>
        </div>

        <div className="card-surface p-6 sm:p-8">
          {sent ? (
            <div className="text-center py-10">
              <div className="text-4xl mb-4">✅</div>
              <h3 className="font-serif text-xl text-berry-dark font-semibold">Message sent</h3>
              <p className="text-ink-soft mt-2">Thanks for reaching out — we'll be in touch shortly.</p>
              <button onClick={() => setSent(false)} className="btn btn-ghost mt-6">
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="field-label">Name</label>
                  <input
                    className={`input-field ${errors.name ? "input-field-error" : ""}`}
                    value={form.name}
                    onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  />
                  {errors.name?.[0] && <p className="field-error">{errors.name[0]}</p>}
                </div>
                <div>
                  <label className="field-label">Phone (optional)</label>
                  <input
                    className="input-field"
                    value={form.phone}
                    onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  />
                </div>
              </div>
              <div>
                <label className="field-label">Email</label>
                <input
                  type="email"
                  className={`input-field ${errors.email ? "input-field-error" : ""}`}
                  value={form.email}
                  onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                />
                {errors.email?.[0] && <p className="field-error">{errors.email[0]}</p>}
              </div>
              <div>
                <label className="field-label">Subject (optional)</label>
                <input
                  className="input-field"
                  value={form.subject}
                  onChange={(e) => setForm((f) => ({ ...f, subject: e.target.value }))}
                />
              </div>
              <div>
                <label className="field-label">Message</label>
                <textarea
                  className={`input-field min-h-[140px] ${errors.message ? "input-field-error" : ""}`}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                />
                {errors.message?.[0] && <p className="field-error">{errors.message[0]}</p>}
              </div>
              <button type="submit" disabled={submitting} className={`btn btn-primary w-full justify-center ${submitting ? "btn-disabled" : ""}`}>
                {submitting ? "Sending…" : "Send message"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
