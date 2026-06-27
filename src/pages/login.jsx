// src/pages/Login.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // 🔥 ADD THIS
    console.log("LOGIN DATA:", email, password);

    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          email: email.trim().toLowerCase(),
          password: password.trim(),
        }
      );

      console.log("RESPONSE:", res.data); // 🔥 ADD THIS

      const userData = { ...res.data.user, token: res.data.token };
      localStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      if (userData.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/profile");
      }

    } catch (err) {
      console.log("ERROR:", err.response?.data); // 🔥 ADD THIS
      setError(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#faf8f5", fontFamily: "'Lora', serif" }}>

      {/* Blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{
          background: "#e8d5be", opacity: 0.18,
          transform: "translate(-33%, -33%)"
        }} />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{
          background: "#c89b3c", opacity: 0.08,
          transform: "translate(33%, 33%)"
        }} />

      <div className="w-full max-w-sm relative">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center mb-4">
            <CoffeeCupIcon />
          </div>
          <h1 className="text-4xl font-bold tracking-tight" style={{ color: "#3d2b1f" }}>
            GJ Café
          </h1>
          <p className="mt-1 text-xs tracking-widest uppercase" style={{ color: "#9b8272" }}>
            Member Portal
          </p>
          <Divider />
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8"
          style={{
            background: "#ffffff",
            border: "1px solid #ede0d0",
            boxShadow: "0 20px 60px rgba(122,88,56,0.10), 0 4px 16px rgba(122,88,56,0.06)",
          }}>

          {error && (
            <div className="mb-5 px-4 py-3 rounded-xl text-sm text-center"
              style={{ background: "#fff5f5", color: "#c0392b", border: "1px solid #fecaca" }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">

            <Field label="Email">
  <input
    type="email"
    value={email}
    placeholder="you@example.com"
    required
    autoComplete="off"
    onChange={(e) => setEmail(e.target.value)}
    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
    style={{
      background: "#faf8f5",
      border: "1px solid #e8d5be",
      color: "#3d2b1f"
    }}
    onFocus={e => {
      e.target.style.borderColor = "#c89b3c";
      e.target.style.boxShadow = "0 0 0 3px rgba(200,155,60,0.15)";
    }}
    onBlur={e => {
      e.target.style.borderColor = "#e8d5be";
      e.target.style.boxShadow = "none";
    }}
  />
</Field>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "#9b8272" }}>Password</span>
                <span
                  onClick={() => navigate("/forgot-password")}
                  className="text-xs cursor-pointer hover:underline"
                  style={{ color: "#c89b3c" }}
                >
                  Forgot Password?
                </span>
              </div>
              <input type="password" value={password} placeholder="••••••••" required
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{ background: "#faf8f5", border: "1px solid #e8d5be", color: "#3d2b1f" }}
                onFocus={e => { e.target.style.borderColor = "#c89b3c"; e.target.style.boxShadow = "0 0 0 3px rgba(200,155,60,0.15)"; }}
                onBlur={e => { e.target.style.borderColor = "#e8d5be"; e.target.style.boxShadow = "none"; }}
              />
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-widest uppercase
              transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed"
              style={{
                background: loading ? "#e8d5be" : "#7c5c3e",
                color: "#fff",
                boxShadow: loading ? "none" : "0 4px 14px rgba(124,92,62,0.35)",
              }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>

          </form>

          <OrDivider />

          <p className="text-center text-sm" style={{ color: "#9b8272" }}>
            Don't have an account?{" "}
            <span onClick={() => navigate("/register")}
              className="font-semibold cursor-pointer underline underline-offset-4"
              style={{ color: "#7c5c3e" }}>
              Register here
            </span>
          </p>

        </div>
        <Footer />
      </div>
    </div>
  );
}

/* ── SHARED COMPONENTS ── */

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
        style={{ color: "#9b8272" }}>{label}</label>
      {children}
    </div>
  );
}

function CoffeeCupIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M8 16h24l-3 18H11L8 16z" fill="#C8A97E" stroke="#7C5C3E" strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M32 20h4a4 4 0 0 1 0 8h-4" stroke="#7C5C3E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M14 34h12" stroke="#7C5C3E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M16 11 Q17 8 16 5" stroke="#C8A97E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M20 11 Q21 8 20 5" stroke="#C8A97E" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M24 11 Q25 8 24 5" stroke="#C8A97E" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function Divider() {
  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <div className="h-px w-12" style={{ background: "#e8d5be" }} />
      <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#e8d5be" }} />
      <div className="h-px w-12" style={{ background: "#e8d5be" }} />
    </div>
  );
}

function OrDivider() {
  return (
    <div className="flex items-center gap-3 my-5">
      <div className="flex-1 h-px" style={{ background: "#ede0d0" }} />
      <span className="text-xs" style={{ color: "#b8a090" }}>or</span>
      <div className="flex-1 h-px" style={{ background: "#ede0d0" }} />
    </div>
  );
}

function Footer() {
  return (
    <p className="text-center text-xs mt-6" style={{ color: "#b8a090" }}>
      © {new Date().getFullYear()} GJ Café · Freshly brewed, every day ☕
    </p>
  );
}