// src/pages/Profile.jsx
import { useNavigate } from "react-router-dom";

export default function Profile({ user, setUser }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
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

          {/* Avatar */}
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4
            text-white text-2xl font-extrabold"
            style={{
              background: "#7c5c3e",
              boxShadow: "0 6px 20px rgba(124,92,62,0.30)",
            }}>
            {user?.name?.charAt(0)?.toUpperCase() || "?"}
          </div>

          <h1 className="text-3xl font-bold tracking-tight" style={{ color: "#3d2b1f" }}>
            {user?.name}
          </h1>
          <p className="mt-1 text-sm" style={{ color: "#9b8272" }}>
            {user?.email}
          </p>
          <Divider />
        </div>

        {/* Info card */}
        <div className="rounded-3xl p-8 mb-4"
          style={{
            background: "#ffffff",
            border: "1px solid #ede0d0",
            boxShadow: "0 20px 60px rgba(122,88,56,0.10), 0 4px 16px rgba(122,88,56,0.06)",
          }}>

          <p className="text-xs font-semibold tracking-widest uppercase mb-5"
            style={{ color: "#9b8272" }}>
            Account Details
          </p>

          {/* Info rows */}
          <div className="space-y-3 mb-6">
            {[
              { label: "Full Name", value: user?.name },
              { label: "Email", value: user?.email },
              {
                label: "Role",
                value:
                  user?.role === "admin"
                    ? "👑 Admin"
                    : user?.role === "delivery"
                      ? "🚚 Delivery Boy"
                      : "👤 Customer",
                highlight: true,
              },
            ].map(({ label, value, highlight }) => (
              <div key={label} className="flex items-center justify-between py-2.5"
                style={{ borderBottom: "1px solid #f5ede4" }}>
                <span className="text-xs font-semibold tracking-widest uppercase"
                  style={{ color: "#9b8272" }}>{label}</span>
                <span className={`text-sm font-semibold ${highlight ? "px-3 py-1 rounded-full text-xs" : ""}`}
                  style={highlight
                    ? { background: "#fef3e2", color: "#7c5c3e", border: "1px solid #e8d5be" }
                    : { color: "#3d2b1f" }}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col gap-3">

            {user?.role === "customer" && (
              <button
                onClick={() => navigate("/orders")}
                className="w-full py-3 rounded-xl font-semibold text-sm tracking-widest uppercase
    transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "#faf8f5",
                  border: "1px solid #e8d5be",
                  color: "#7c5c3e",
                }}
              >
                📦 My Orders
              </button>
            )}
            {user?.role === "admin" && (
              <button onClick={() => navigate("/admin")}
                className="w-full py-3 rounded-xl font-semibold text-sm tracking-widest uppercase
                transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "#7c5c3e",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(124,92,62,0.35)",
                }}>
                👑 Admin Panel
              </button>
            )}
            {user?.role === "delivery" && (
              <button
                onClick={() => navigate("/delivery")}
                className="w-full py-3 rounded-xl font-semibold text-sm tracking-widest uppercase
    transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "#7c5c3e",
                  color: "#fff",
                  boxShadow: "0 4px 14px rgba(124,92,62,0.35)",
                }}
              >
                🚚 Delivery Dashboard
              </button>
            )}

            <button onClick={handleLogout}
              className="w-full py-3 rounded-xl font-semibold text-sm tracking-widest uppercase
              transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: "#fff5f5",
                border: "1px solid #fecaca",
                color: "#c0392b",
              }}>
              Logout
            </button>

          </div>

        </div>

        <Footer />
      </div>
    </div>
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

function Footer() {
  return (
    <p className="text-center text-xs mt-6" style={{ color: "#b8a090" }}>
      © {new Date().getFullYear()} GJ Café · Freshly brewed, every day ☕
    </p>
  );
}