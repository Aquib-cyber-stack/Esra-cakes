interface Props {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel?: string;
  danger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = "Confirm",
  danger,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-ink/40 flex items-center justify-center p-4" onClick={onCancel}>
      <div
        className="bg-paper rounded-2xl p-6 max-w-sm w-full shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="font-serif text-lg text-berry-dark font-semibold">{title}</h3>
        {description && <p className="text-[14px] text-ink-soft mt-2">{description}</p>}
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onCancel} className="btn btn-ghost !py-2 !px-5 text-[14px]">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className={`btn !py-2 !px-5 text-[14px] ${danger ? "!bg-red-600 text-white hover:!bg-red-700" : "btn-primary"}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
