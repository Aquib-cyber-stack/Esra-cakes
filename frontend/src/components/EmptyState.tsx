interface Props {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
}

export default function EmptyState({ title, description, actionLabel, onAction, icon }: Props) {
  return (
    <div className="card-surface text-center py-16 px-8">
      <div className="text-4xl mb-4">{icon || "🎂"}</div>
      <h3 className="font-serif text-xl text-berry-dark font-semibold">{title}</h3>
      {description && <p className="text-ink-soft mt-2 max-w-md mx-auto">{description}</p>}
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn btn-ghost mt-6">
          {actionLabel}
        </button>
      )}
    </div>
  );
}
