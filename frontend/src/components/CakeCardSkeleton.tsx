export default function CakeCardSkeleton() {
  return (
    <div className="card-surface overflow-hidden">
      <div className="aspect-[4/3] skeleton rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton h-3 w-20" />
        <div className="skeleton h-5 w-3/4" />
        <div className="skeleton h-4 w-1/3" />
      </div>
    </div>
  );
}
