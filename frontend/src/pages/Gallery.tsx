import { useEffect, useState } from "react";
import { api, apiErrorMessage } from "@/lib/api";
import { Cake } from "@/types";
import FilterBar from "@/components/FilterBar";
import CakeGrid from "@/components/CakeGrid";

export default function Gallery() {
  const [cakes, setCakes] = useState<Cake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState("ALL");
  const [search, setSearch] = useState("");

  function load() {
    setLoading(true);
    setError(null);
    api
      .get("/cakes", { params: { category, search: search || undefined } })
      .then((res) => setCakes(res.data.cakes))
      .catch((err) => setError(apiErrorMessage(err, "Couldn't load the gallery right now.")))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    const timeout = setTimeout(load, 250); // debounce search
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [category, search]);

  return (
    <div className="wrap py-14">
      <div className="section-head">
        <span className="eyebrow">Our work</span>
        <h1 className="heading text-[32px] sm:text-[42px]">The cake gallery.</h1>
        <p>Browse past designs by occasion, or search for a flavour you're craving.</p>
      </div>

      <FilterBar category={category} onCategoryChange={setCategory} search={search} onSearchChange={setSearch} />

      <CakeGrid cakes={cakes} loading={loading} error={error} onRetry={load} />
    </div>
  );
}
