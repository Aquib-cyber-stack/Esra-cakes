interface Props {
  label: string;
  value: string | number;
  hint?: string;
  accent?: "berry" | "gold" | "pistachio";
}

const ACCENTS: Record<string, string> = {
  berry: "text-berry",
  gold: "text-gold",
  pistachio: "text-pistachio",
};

export default function StatCard({ label, value, hint, accent = "berry" }: Props) {
  return (
    <div className="card-surface p-5">
      <span className="text-[13px] font-semibold text-ink-soft uppercase tracking-wide">{label}</span>
      <div className={`font-serif text-[30px] mt-1 ${ACCENTS[accent]}`}>{value}</div>
      {hint && <span className="text-[12.5px] text-ink-soft">{hint}</span>}
    </div>
  );
}
