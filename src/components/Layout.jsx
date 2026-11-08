import { Outlet } from "react-router-dom";
import NavBar from "./NavBar.jsx";
import { useLocalStorage } from "../hooks/useLocalStorage.js";

export default function Layout() {
  const [theme, setTheme] = useLocalStorage("theme", "light");
  const safeTheme = theme === "dark" ? "dark" : "light";

  function toggleTheme() {
    setTheme(safeTheme === "dark" ? "light" : "dark");
  }

  return (
    <div className={`app ${safeTheme}`}>
      <NavBar theme={safeTheme} onToggleTheme={toggleTheme} />
      <main className="content">
        <Outlet />
      </main>
      <footer className="footer">
        <p>© 2026 Mini Shop — React Router, Context, Zustand demo</p>
      </footer>
    </div>
  );
}
