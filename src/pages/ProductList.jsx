import { useSearchParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { fetchProducts } from "../api/productsApi.js";
import ProductCard from "../components/ProductCard.jsx";

export default function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  const q = searchParams.get("q") ?? "";
  const category = searchParams.get("category") ?? "";

  const { loading, error, data: products } = useFetch(
    (signal) => fetchProducts(signal),
    []
  );

  // Update ONE parameter while keeping the others
  function updateParam(key, value) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true }
    );
  }

  if (loading) return <p>Loading products...</p>;
  if (error) return <p className="error">Error: {error.message}</p>;

  // Derived during render, not stored in state
  const categories = [...new Set(products.map((p) => p.category))].sort();
  const needle = q.trim().toLowerCase();
  const filtered = products.filter(
    (p) =>
      (!category || p.category === category) &&
      p.title.toLowerCase().includes(needle)
  );

  return (
    <section>
      <h1>Products</h1>
      <div className="filters">
        <input
          type="text"
          placeholder="Search by title..."
          value={q}
          onChange={(e) => updateParam("q", e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => updateParam("category", e.target.value)}
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p>No products match your filters.</p>
      ) : (
        <div className="grid">
          {filtered.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}
