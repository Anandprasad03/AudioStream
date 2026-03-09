import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

const Navbar = ({ user, onLogoutLocal }) => {
  const navigate = useNavigate();

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
    <nav className="navbar">
      <div className="nav-wrapper">
        <h2 className="logo">AudioStream</h2>

        <ul className="nav-links">
          <li>
            <Link to="/">Auth</Link>
          </li>
          <li>
            <Link to="/library">Library</Link>
          </li>

          {user?.role === "artist" ? (
            <li>
              <Link to="/artist">Artist Studio</Link>
            </li>
          ) : null}

          {user ? (
            <li className="muted">
              {user.username} ({user.role})
            </li>
          ) : null}

          {user ? (
            <li>
              <button
                type="button"
                className="link-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </li>
          ) : null}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;