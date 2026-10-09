import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { api, apiErrorMessage } from "@/lib/api";
import { Cake } from "@/types";
import { formatCurrency, categoryLabel } from "@/lib/format";
import EmptyState from "@/components/EmptyState";
import WhatsAppButton from "@/components/WhatsAppButton";

export default function CakeDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cake, setCake] = useState<Cake | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    setLoading(true);
    setError(null);
    api
      .get(`/cakes/${id}`)
      .then((res) => setCake(res.data.cake))
      .catch((err) => setError(apiErrorMessage(err, "That cake couldn't be found.")))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="wrap py-14 grid md:grid-cols-2 gap-10">
        <div className="skeleton aspect-square" />
        <div className="space-y-4">
          <div className="skeleton h-4 w-24" />
          <div className="skeleton h-8 w-2/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-3/4" />
        </div>
      </div>
    );
  }

  if (error || !cake) {
    return (
      <div className="wrap py-14">
        <EmptyState title="Cake not found" description={error || undefined} actionLabel="Back to gallery" onAction={() => navigate("/gallery")} />
      </div>
    );
  }

  const images = cake.images.length ? cake.images : [];

  return (
    <div className="wrap py-14">
      <Link to="/gallery" className="text-[14px] text-berry font-semibold hover:underline">
        ← Back to gallery
      </Link>

      <div className="grid md:grid-cols-2 gap-10 mt-6">
        <div>
          <div className="aspect-square rounded-card overflow-hidden bg-blush-soft">
            {images[activeImage] ? (
              <img src={images[activeImage].url} alt={cake.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-ink-soft">No image available</div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-3 mt-4">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    i === activeImage ? "border-berry" : "border-transparent"
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <span className="eyebrow">{categoryLabel(cake.category)}</span>
          <h1 className="heading text-[30px] sm:text-[38px] mt-2">{cake.name}</h1>
          <p className="text-ink-soft mt-4 leading-relaxed">{cake.description}</p>

          <div className="mt-6 flex items-baseline gap-2">
            <span className="text-[14px] text-ink-soft">Starting at</span>
            <span className="font-serif text-[28px] text-berry font-semibold">{formatCurrency(cake.startingPrice)}</span>
          </div>

          {!cake.isAvailable && (
            <p className="mt-3 inline-block text-[13px] font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full">
              Currently unavailable — get in touch for similar designs
            </p>
          )}

          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <h3 className="text-[13.5px] font-semibold text-berry-dark uppercase tracking-wide mb-2">Flavours</h3>
              <ul className="space-y-1 text-[14.5px] text-ink-soft">
                {cake.flavours.map((f) => (
                  <li key={f}>• {f}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-[13.5px] font-semibold text-berry-dark uppercase tracking-wide mb-2">Sizes</h3>
              <ul className="space-y-1 text-[14.5px] text-ink-soft">
                {cake.sizes.map((s) => (
                  <li key={s}>• {s}</li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-9 flex gap-4 flex-wrap">
            <Link to={`/order?cakeId=${cake.id}`} className="btn btn-primary">
              Order something like this →
            </Link>
            <WhatsAppButton
              className="btn btn-ghost"
              message={`Hi! I'm interested in the "${cake.name}" cake from your gallery.`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
