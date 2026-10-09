import { Cake } from "@/types";
import CakeCard from "./CakeCard";
import CakeCardSkeleton from "./CakeCardSkeleton";
import EmptyState from "./EmptyState";

interface Props {
  cakes: Cake[];
  loading: boolean;
  error?: string | null;
  onRetry?: () => void;
}

export default function CakeGrid({ cakes, loading, error, onRetry }: Props) {
  if (error) {
    return (
      <EmptyState
        title="We couldn't load the gallery"
        description={error}
        actionLabel={onRetry ? "Try again" : undefined}
        onAction={onRetry}
      />
    );
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <CakeCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (cakes.length === 0) {
    return (
      <EmptyState
        title="No cakes match your search"
        description="Try a different category or search term — or tell us what you're picturing and we'll build it from scratch."
      />
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {cakes.map((cake) => (
        <CakeCard key={cake.id} cake={cake} />
      ))}
    </div>
  );
}
