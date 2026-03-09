import { useState } from "react";
import { api } from "../api";

const initialRegister = {
  username: "",
  email: "",
  password: "",
  role: "user",
};

const initialLogin = {
  identity: "",
  password: "",
};

const Auth = ({ onAuthSuccess }) => {
  const [registerForm, setRegisterForm] = useState(initialRegister);
  const [loginForm, setLoginForm] = useState(initialLogin);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // REGISTER
  const handleRegister = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const { data } = await api.post("/api/auth/register", registerForm);

      setMessage(data.message);
      setRegisterForm(initialRegister);
    } catch (err) {
      setError(err?.response?.data?.message || "Registration failed");
    }
  };

  // LOGIN
  const handleLogin = async (event) => {
    event.preventDefault();
    setMessage("");
    setError("");

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
    } catch (err) {
      setError(err?.response?.data?.message || "Login failed");
    }
  };

  return (
    <section className="page">
      <div className="grid-two">
        {/* Register */}
        <div className="card">
          <h2>Register</h2>
          <form onSubmit={handleRegister} className="stack">
            <input
              type="text"
              placeholder="Username"
              required
              value={registerForm.username}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, username: e.target.value })
              }
            />
            <input
              type="email"
              placeholder="Email"
              required
              value={registerForm.email}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, email: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={registerForm.password}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, password: e.target.value })
              }
            />
            <select
              value={registerForm.role}
              onChange={(e) =>
                setRegisterForm({ ...registerForm, role: e.target.value })
              }
            >
              <option value="user">User</option>
              <option value="artist">Artist</option>
            </select>
            <button type="submit">Register</button>
          </form>
        </div>

        {/* Login */}
        <div className="card">
          <h2>Login</h2>
          <form onSubmit={handleLogin} className="stack">
            <input
              type="text"
              placeholder="Username or Email"
              required
              value={loginForm.identity}
              onChange={(e) =>
                setLoginForm({ ...loginForm, identity: e.target.value })
              }
            />
            <input
              type="password"
              placeholder="Password"
              required
              value={loginForm.password}
              onChange={(e) =>
                setLoginForm({ ...loginForm, password: e.target.value })
              }
            />
            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      {message && <p className="message success">{message}</p>}
      {error && <p className="message error">{error}</p>}
    </section>
  );
};

export default Auth;