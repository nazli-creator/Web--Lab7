import { Link } from "react-router-dom";

export default function Home() {
  return (
    <section>
      <h1>Welcome to Mini Shop</h1>
      <p>Browse our catalogue, filter it, and share the filtered view by link.</p>
      <Link to="/products">View products</Link>
    </section>
  );
}
