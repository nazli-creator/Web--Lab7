import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCartStore } from "../store/cartStore.js";

export default function NavBar({ theme, onToggleTheme }) {
  const { user, dispatch } = useAuth();
  // Selector returns a primitive, so NavBar only re-renders when the count changes
  const count = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );

  const linkClass = ({ isActive }) => (isActive ? "nav-link active" : "nav-link");

  return (
    <nav className="navbar">
      <span className="brand">Mini Shop</span>
      <div className="nav-links">
        <NavLink to="/" end className={linkClass}>
          Home
        </NavLink>
        <NavLink to="/products" className={linkClass}>
          Products
        </NavLink>
        <NavLink to="/cart" className={linkClass}>
          Cart ({count})
        </NavLink>
      </div>
      <div className="nav-right">
        <button type="button" onClick={onToggleTheme}>
          {theme === "dark" ? "Light mode" : "Dark mode"}
        </button>
        {user ? (
          <>
            <span className="username">{user.username}</span>
            <button type="button" onClick={() => dispatch({ type: "LOGGED_OUT" })}>
              Logout
            </button>
          </>
        ) : (
          <NavLink to="/login" className={linkClass}>
            Login
          </NavLink>
        )}
      </div>
    </nav>
  );
}
