import { Link } from "react-router-dom";
import { useCartStore } from "../store/cartStore.js";

export default function Cart() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const clear = useCartStore((s) => s.clear);

  // Derived values, never stored
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  if (items.length === 0) {
    return (
      <section>
        <h1>Your cart</h1>
        <p>Your cart is empty.</p>
        <Link to="/products">Back to products</Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Your cart</h1>
      <ul className="cart-list">
        {items.map((i) => (
          <li key={i.id}>
            <span className="cart-title">{i.title}</span>
            <span>${i.price}</span>
            <button type="button" onClick={() => setQuantity(i.id, i.quantity - 1)}>
              −
            </button>
            <span>{i.quantity}</span>
            <button type="button" onClick={() => setQuantity(i.id, i.quantity + 1)}>
              +
            </button>
            <button type="button" onClick={() => removeItem(i.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <p className="total">Total: ${total.toFixed(2)}</p>
      <button type="button" onClick={clear}>
        Clear cart
      </button>
    </section>
  );
}
