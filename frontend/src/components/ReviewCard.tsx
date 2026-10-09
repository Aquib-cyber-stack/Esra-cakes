import { Review } from "@/types";
import { formatDate } from "@/lib/format";

export default function ReviewCard({ review }: { review: Review }) {
  return (
    <div className="card-surface p-6">
      <div className="flex items-center gap-1 text-gold mb-3" aria-label={`${review.rating} out of 5 stars`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i}>{i < review.rating ? "★" : "☆"}</span>
        ))}
      </div>
      <p className="font-serif italic text-[17px] text-berry-dark leading-relaxed">"{review.message}"</p>
      <div className="mt-4 text-[13.5px] text-ink-soft">
        <span className="font-semibold text-ink">{review.name}</span>
        {review.occasion && <span> · {review.occasion}</span>}
        <span> · {formatDate(review.createdAt)}</span>
      </div>
    </div>
  );
}
