import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const text = await res.text(); // fallback if not JSON
        try {
          const data = JSON.parse(text);
          setError(data.error || "Login failed");
        } catch {
          setError(text || "Login failed");
        }
      } else {
        const data = await res.json();
        console.log("Logged in:", data);
        navigate("/app");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Something went wrong");
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <h2>Login</h2>

      <label>
        Email:
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </label>

      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </label>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <button type="submit">Log In</button>

      <button
        type="button"
        onClick={() => navigate("/signup")}
        style={{ marginTop: "10px" }}
      >
        Don't have an account? Sign Up
      </button>
    </form>
  );
}
