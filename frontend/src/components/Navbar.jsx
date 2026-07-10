import { Link, NavLink, useNavigate } from "react-router-dom";
import { Sun, Moon, Terminal, LogOut, ShieldCheck } from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

const navLink = ({ isActive }) =>
  `px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
    isActive ? "text-ink dark:text-paper bg-accent/15" : "text-slate-400 hover:text-slate-800 dark:hover:text-slate-100"
  }`;

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-paper-line dark:border-ink-line bg-paper/80 dark:bg-ink/80 backdrop-blur">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-display font-semibold text-lg">
          <Terminal size={20} className="text-accent" />
          Prepline
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-1">
            <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>
            <NavLink to="/interview/new" className={navLink}>New Interview</NavLink>
            <NavLink to="/history" className={navLink}>History</NavLink>
            {user.role === "admin" && (
              <NavLink to="/admin" className={navLink}>
                <span className="inline-flex items-center gap-1"><ShieldCheck size={14}/> Admin</span>
              </NavLink>
            )}
          </nav>
        )}

        <div className="flex items-center gap-3">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg hover:bg-paper-soft dark:hover:bg-ink-line transition-colors"
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>

          {user ? (
            <div className="flex items-center gap-3">
              <img
                src={user.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${user.name}`}
                alt={user.name}
                className="w-8 h-8 rounded-full border border-paper-line dark:border-ink-line"
              />
              <button
                onClick={async () => { await logout(); navigate("/"); }}
                className="p-2 rounded-lg hover:bg-paper-soft dark:hover:bg-ink-line transition-colors"
                aria-label="Log out"
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-primary !px-4 !py-2 text-sm">Sign in</Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
