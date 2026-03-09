import { Link, useNavigate, useLocation } from "react-router-dom";
import { api } from "../api";

const Navbar = ({ user, onLogoutLocal }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Hide topbar on auth pages entirely
  const authPaths = ["/", "/register"];
  if (authPaths.includes(location.pathname)) return null;

  const handleLogout = async () => {
    try {
      await api.post("/api/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      onLogoutLocal();
      navigate("/");
    }
  };

  return (
    <nav className="topbar">
      <div className="topbar-inner">
        <Link to="/library" className="topbar-logo">
          Audio<span>Stream</span>
        </Link>

        <ul className="topbar-nav">
          <li>
            <Link
              to="/library"
              className={location.pathname === "/library" ? "active" : ""}
            >
              Library
            </Link>
          </li>
          {user?.role === "artist" && (
            <li>
              <Link
                to="/artist"
                className={location.pathname === "/artist" ? "active" : ""}
              >
                Studio
              </Link>
            </li>
          )}
        </ul>

        <div className="topbar-right">
          {user && (
            <div className="topbar-user-badge">
              {user.username}
              <span className="role-pill">{user.role}</span>
            </div>
          )}
          {user && (
            <button
              type="button"
              className="btn-logout"
              onClick={handleLogout}
            >
              Sign out
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;