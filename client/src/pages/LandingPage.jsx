import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        background: "#f0f4f8",
      }}
    >
      <h1>Welcome to Lulu's FlashCard 🧠</h1>
      <p>Study smarter with spaced repetition.</p>

      <div style={{ marginTop: "20px" }}>
        <Link
          to="/login"
          style={{
            marginRight: "10px",
            padding: "10px 20px",
            background: "#0077ff",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Log In
        </Link>

        <Link
          to="/signup"
          style={{
            padding: "10px 20px",
            background: "#28a745",
            color: "white",
            textDecoration: "none",
            borderRadius: "6px",
          }}
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
}
