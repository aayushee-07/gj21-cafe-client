// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/apiClient";

export default function Register({ setUser }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError]   = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await api.post("/auth/register", form);
      const userData = { ...res.data.user, token: res.data.token };
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    background: "#faf8f5",
    border: "1px solid #e8d5be",
    color: "#3d2b1f",
  };
  const onFocus = (e) => {
    e.target.style.borderColor = "#c89b3c";
    e.target.style.boxShadow = "0 0 0 3px rgba(200,155,60,0.15)";
  };
  const onBlur = (e) => {
    e.target.style.borderColor = "#e8d5be";
    e.target.style.boxShadow = "none";
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "#faf8f5", fontFamily: "'Lora', serif" }}>

      {/* Blobs */}
      <div className="fixed top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
        style={{ background: "#e8d5be", opacity: 0.18, transform: "translate(-33%, -33%)" }} />
      <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
        style={{ background: "#c89b3c", opacity: 0.08, transform: "translate(33%, 33%)" }} />

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
            Create Account
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

            {[
              { label: "Full Name",       key: "name",     type: "text",     placeholder: "e.g. Rahul Patel" },
              { label: "Email Address",   key: "email",    type: "email",    placeholder: "you@example.com" },
              { label: "Password",        key: "password", type: "password", placeholder: "Min. 6 characters" },
            ].map(({ label, key, type, placeholder }) => (
              <div key={key}>
                <label className="block text-xs font-semibold tracking-widest uppercase mb-2"
                  style={{ color: "#9b8272" }}>{label}</label>
                <input
                  type={type}
                  placeholder={placeholder}
                  value={form[key]}
                  required
                  onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={onFocus}
                  onBlur={onBlur}
                />
              </div>
            ))}

            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-widest uppercase
              transition-all duration-200 hover:-translate-y-0.5 disabled:translate-y-0 disabled:cursor-not-allowed"
              style={{
                background: loading ? "#e8d5be" : "#7c5c3e",
                color: "#fff",
                boxShadow: loading ? "none" : "0 4px 14px rgba(124,92,62,0.35)",
              }}>
              {loading ? "Creating account…" : "Create Account"}
            </button>

          </form>

          <OrDivider />

          <p className="text-center text-sm" style={{ color: "#9b8272" }}>
            Already have an account?{" "}
            <span onClick={() => navigate("/login")}
              className="font-semibold cursor-pointer underline underline-offset-4"
              style={{ color: "#7c5c3e" }}>
              Sign in here
            </span>
          </p>

        </div>
        <Footer />
      </div>
    </div>
  );
}

function CoffeeCupIcon() {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <path d="M8 16h24l-3 18H11L8 16z" fill="#C8A97E" stroke="#7C5C3E" strokeWidth="1.5" strokeLinejoin="round"/>
      <path d="M32 20h4a4 4 0 0 1 0 8h-4" stroke="#7C5C3E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M14 34h12" stroke="#7C5C3E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M16 11 Q17 8 16 5" stroke="#C8A97E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M20 11 Q21 8 20 5" stroke="#C8A97E" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M24 11 Q25 8 24 5" stroke="#C8A97E" strokeWidth="1.5" strokeLinecap="round"/>
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