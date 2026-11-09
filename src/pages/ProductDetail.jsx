import { Link, useNavigate, useParams } from "react-router-dom";
import { useFetch } from "../hooks/useFetch.js";
import { fetchProduct } from "../api/productsApi.js";
import { useCartStore } from "../store/cartStore.js";

export default function ProductDetail() {
  const { id } = useParams(); // always a string
  const navigate = useNavigate();
  const addItem = useCartStore((s) => s.addItem);

  const { loading, error, data: product } = useFetch(
    (signal) => fetchProduct(id, signal),
    [id]
  );

  const nextId = Number(id) + 1; // string -> number needed for arithmetic

  if (loading) return <p>Loading product...</p>;

  if (error) {
    return (
      <section>
        <p className="error">
          {error.status === 404
            ? "Product not found."
            : `Error: ${error.message}`}
        </p>
        <button type="button" onClick={() => navigate("/products")}>
          Back
        </button>
      </section>
    );
  }

  return (
    <section className="detail">
      <img src={product.thumbnail} alt={product.title} />
      <div>
        <h1>{product.title}</h1>
        <p className="category">{product.category}</p>
        <p>{product.description}</p>
        <p className="price">${product.price}</p>
        <button type="button" onClick={() => addItem(product)}>
          Add to cart
        </button>{" "}
        <button type="button" onClick={() => navigate("/products")}>
          Back
        </button>{" "}
        <Link to={`/products/${nextId}`}>Next product →</Link>
      </div>
    </section>
  );
}
