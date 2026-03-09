import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "../api";

const initialRegister = {
  username: "",
  email: "",
  password: "",
  role: "user",
};

const Register = ({ onAuthSuccess }) => {
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/register", registerForm);
      setMessage(data.message + " You can now sign in.");
      setRegisterForm(initialRegister);
      setTimeout(() => navigate("/"), 1800);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page" style={{ gridTemplateColumns: "1fr 1fr" }}>
      {/* Form Side */}
      <div className="auth-form-side">
        <div className="auth-form-box animate-in">
          <div className="auth-form-header">
            <h1>
              Join the
              <br />
              sound.
            </h1>
            <p>
              Already have an account? <Link to="/">Sign in</Link>
            </p>
          </div>

          <form onSubmit={handleRegister} className="stack">
            <div className="field-group">
              <label className="field-label">Username</label>
              <input
                type="text"
                placeholder="your_username"
                required
                value={registerForm.username}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, username: e.target.value })
                }
              />
            </div>

            <div className="field-group">
              <label className="field-label">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                required
                value={registerForm.email}
                onChange={(e) =>
                  setRegisterForm({ ...registerForm, email: e.target.value })
                }
              />
            </div>

            <div className="field-group">
              <label className="field-label">Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                required
                value={registerForm.password}
                onChange={(e) =>
                  setRegisterForm({
                    ...registerForm,
                    password: e.target.value,
                  })
                }
              />
            </div>

            <div className="field-group">
              <label className="field-label">I am a…</label>
              <div className="role-select-group">
                <div className="role-option">
                  <input
                    type="radio"
                    id="role-user"
                    name="role"
                    value="user"
                    checked={registerForm.role === "user"}
                    onChange={() =>
                      setRegisterForm({ ...registerForm, role: "user" })
                    }
                  />
                  <label htmlFor="role-user">
                    <span className="role-icon">🎧</span>
                    Listener
                  </label>
                </div>
                <div className="role-option">
                  <input
                    type="radio"
                    id="role-artist"
                    name="role"
                    value="artist"
                    checked={registerForm.role === "artist"}
                    onChange={() =>
                      setRegisterForm({ ...registerForm, role: "artist" })
                    }
                  />
                  <label htmlFor="role-artist">
                    <span className="role-icon">🎤</span>
                    Artist
                  </label>
                </div>
              </div>
            </div>

            <div style={{ marginTop: "8px" }}>
              <button
                type="submit"
                className="btn-primary"
                style={{ width: "100%" }}
                disabled={loading}
              >
                {loading ? "Creating account…" : "Create Account"}
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

      {/* Visual Side */}
      <div className="auth-visual">
        <div className="auth-visual-rings" />
        <div className="auth-visual-content">
          <div className="auth-visual-logo">
            Audio<span>Stream</span>
          </div>
          <div className="auth-visual-tagline">Where sound lives</div>
          <blockquote className="auth-visual-quote">
            "One good thing about music — when it hits you, you feel no pain."
            <cite>— Bob Marley</cite>
          </blockquote>
        </div>
      </div>
    </div>
  );
};

export default Register;