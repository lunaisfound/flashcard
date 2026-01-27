import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
      } else {
        navigate("/login");
      }
    } catch (err) {
      console.error(err);
      setError("Something went wrong.");
    }
  }

  return (
    <div
      style={{
        backgroundColor: "#fff6e5",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <form onSubmit={handleSubmit} style={formStyle}>
        <h1 style={titleStyle}>Join Lulu's FlashCard</h1>

        <label style={labelStyle}>Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          style={inputStyle}
        />

        <label style={labelStyle}>Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Create a password"
          style={inputStyle}
        />

        {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

        <button type="submit" style={submitBtnStyle}>
          Create Account
        </button>

        <button
          type="button"
          onClick={() => navigate("/login")}
          style={switchBtnStyle}
        >
          Already have an account? Sign In
        </button>
      </form>
    </div>
  );
}

const formStyle = {
  backgroundColor: "#ffefd5",
  borderRadius: "20px",
  padding: "40px 30px",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
  width: "100%",
  maxWidth: "400px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const titleStyle = {
  fontFamily: "cursive",
  fontSize: "2rem",
  color: "#5f5df9",
  marginBottom: "25px",
};

const labelStyle = {
  alignSelf: "flex-start",
  fontWeight: "bold",
  marginTop: "10px",
  color: "#e67e22",
};

const inputStyle = {
  width: "100%",
  padding: "10px",
  marginTop: "5px",
  marginBottom: "10px",
  borderRadius: "6px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};

const submitBtnStyle = {
  width: "100%",
  backgroundColor: "#5f5df9",
  color: "#fff",
  fontWeight: "bold",
  padding: "12px",
  border: "none",
  borderRadius: "6px",
  marginTop: "10px",
  cursor: "pointer",
};

const switchBtnStyle = {
  backgroundColor: "transparent",
  color: "#5f5df9",
  border: "none",
  fontSize: "0.9rem",
  marginTop: "15px",
  cursor: "pointer",
  textDecoration: "underline",
};
