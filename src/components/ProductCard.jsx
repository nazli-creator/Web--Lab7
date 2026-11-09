import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore.js";

export default function ProductCard({ product }) {
  // Only the action is selected, so the card does not re-render on cart changes
  const addItem = useCartStore((s) => s.addItem);

  return (
    <div className="card">
      <img src={product.thumbnail} alt={product.title} />
      <h3>
        <Link to={`/products/${product.id}`}>{product.title}</Link>
      </h3>
      <p className="category">{product.category}</p>
      <p className="price">${product.price}</p>
      <button type="button" onClick={() => addItem(product)}>
        Add to cart
      </button>
    </div>
  );
}
