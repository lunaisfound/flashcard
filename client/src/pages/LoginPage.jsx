import LoginForm from "../components/LoginForm";

export default function LoginPage() {
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
      <LoginForm />
    </div>
  );
}
