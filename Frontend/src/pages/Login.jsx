import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

const initialLogin = {
  identity: "",
  password: "",
};

const Login = ({ onAuthSuccess }) => {
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const payload = {
        password: loginForm.password,
      };

      if (loginForm.identity.includes("@")) {
        payload.email = loginForm.identity;
      } else {
        payload.username = loginForm.identity;
      }

      const { data } = await api.post("/api/auth/login", payload);

      onAuthSuccess(data.user);
      setMessage(data.message);
      setLoginForm(initialLogin);
      navigate("/library");
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Visual Side */}
      <div className="auth-visual">
        <div className="auth-visual-rings" />
        <div className="auth-visual-content">
          <div className="auth-visual-logo">
            Audio<span>Stream</span>
          </div>
          <div className="auth-visual-tagline">Where sound lives</div>
          <blockquote className="auth-visual-quote">
            "Music gives a soul to the universe, wings to the mind, flight to
            the imagination, and life to everything."
            <cite>— Plato</cite>
          </blockquote>
        </div>
      </div>

      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-box animate-in">
          <div className="auth-form-header">
            <h1>
              Welcome
              <br />
              back.
            </h1>
            <p>
              Don't have an account?{" "}
              <Link to="/register">Create one free</Link>
            </p>
          </div>

          <form onSubmit={handleLogin} className="stack">
            <div className="field-group">
              <label className="field-label">Username or Email</label>
              <input
                type="text"
                placeholder="e.g. john_doe or john@mail.com"
                required
                value={loginForm.identity}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, identity: e.target.value })
                }
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Your password"
                required
                value={loginForm.password}
                onChange={(e) =>
                  setLoginForm({ ...loginForm, password: e.target.value })
                }
              />
            </div>

            <div style={{ marginTop: "8px" }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Signing in…" : "Sign In"}
              </button>
            </div>
          </form>

          {message && (
            <p className="message success" style={{ marginTop: "16px" }}>
              ✓ {message}
            </p>
          )}
          {error && (
            <p className="message error" style={{ marginTop: "16px" }}>
              ✕ {error}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;