const CATEGORIES = [
  { value: "ALL", label: "All" },
  { value: "BIRTHDAY", label: "Birthday" },
  { value: "WEDDING", label: "Wedding" },
  { value: "ANNIVERSARY", label: "Anniversary" },
  { value: "KIDS", label: "Kids" },
  { value: "CORPORATE", label: "Corporate" },
  { value: "CUSTOM", label: "Custom" },
];

interface Props {
  category: string;
  onCategoryChange: (c: string) => void;
  search: string;
  onSearchChange: (s: string) => void;
}

export default function FilterBar({ category, onCategoryChange, search, onSearchChange }: Props) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-10">
      <div className="flex flex-wrap gap-2.5">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => onCategoryChange(c.value)}
            className={`px-4 py-2 rounded-full text-[13.5px] font-semibold border transition-colors ${
              category === c.value
                ? "bg-berry text-paper border-berry"
                : "bg-paper text-berry-dark border-berry-dark/15 hover:border-berry"
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      <div className="relative md:ml-auto w-full md:w-72">
        <input
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search cakes or flavours…"
          className="input-field pl-10"
        />
        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-soft">⌕</span>
      </div>
    </div>
  );
}
