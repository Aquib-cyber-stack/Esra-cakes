import { Link } from "react-router-dom";
import { Cake } from "@/types";
import { formatCurrency, categoryLabel } from "@/lib/format";

export default function CakeCard({ cake }: { cake: Cake }) {
  const primary = cake.images.find((i) => i.isPrimary) || cake.images[0];

  return (
    <Link
      to={`/gallery/${cake.slug || cake.id}`}
      className="card-surface group overflow-hidden block transition-transform duration-300 hover:-translate-y-1.5 hover:shadow-lg"
    >
      <div className="aspect-[4/3] overflow-hidden bg-blush-soft">
        {primary ? (
          <img
            src={primary.url}
            alt={cake.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-ink-soft text-sm">No image</div>
        )}
      </div>
      <div className="p-5">
        <span className="eyebrow">{categoryLabel(cake.category)}</span>
        <h3 className="font-serif text-[19px] font-semibold text-berry-dark mt-1">{cake.name}</h3>
        <div className="flex items-center justify-between mt-3">
          <span className="text-[14px] text-ink-soft">From</span>
          <span className="font-serif text-[18px] text-berry font-semibold">
            {formatCurrency(cake.startingPrice)}
          </span>
        </div>
        {!cake.isAvailable && (
          <span className="inline-block mt-3 text-[12px] font-semibold text-red-600 bg-red-50 px-2.5 py-1 rounded-full">
            Currently unavailable
          </span>
        )}
      </div>
    </Link>
  );
}
