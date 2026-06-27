import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/apiClient";

// ── STATUS CONFIG ──
const STATUS_CFG = {
  assigned: { label: "Assigned", color: "#2563eb", bg: "#eff6ff", border: "#bfdbfe", icon: "📋" },
  pickup: { label: "Pickup", color: "#7c3aed", bg: "#f5f3ff", border: "#ddd6fe", icon: "📦" },
  intransit: { label: "In Transit", color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: "🚚" },
  delivered: { label: "Delivered", color: "#059669", bg: "#ecfdf5", border: "#a7f3d0", icon: "✅" },
  cancelled: { label: "Cancelled", color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: "❌" },
};

const FILTER_TABS = [
  { key: "all", label: "All" },
  { key: "assigned", label: "Assigned" },
  { key: "pickup", label: "Pickup" },
  { key: "intransit", label: "In Transit" },
  { key: "delivered", label: "Delivered" },
  { key: "cancelled", label: "Cancelled" },
];

// ── One-step-forward action per status ──
const NEXT_ACTION = {
  assigned: { status: "pickup", label: "Mark Picked Up", icon: "📦" },
  pickup: { status: "intransit", label: "Mark Out for Delivery", icon: "🚚" },
  intransit: { status: "delivered", label: "Mark Delivered", icon: "✅" },
};

function getDeliveryUser() {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u.token && u.role === "delivery" ? u : null;
  } catch { return null; }
}

export default function MyDeliveries() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);
  const navigate = useNavigate();

  // ── AUTH ──
  useEffect(() => {
    if (!getDeliveryUser()) navigate("/login", { replace: true });
  }, [navigate]);

  // ── TOAST ──
  const showToast = (msg, type = "success") => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ msg, type });
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  };
  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current); }, []);

  // ── FETCH orders ──
  const fetchOrders = useCallback(async () => {
    const u = getDeliveryUser();
    if (!u) return;
    setLoading(true);
    try {
      const res = await api.get("/delivery/orders", {
        headers: { Authorization: `Bearer ${u.token}` },
      });
      setOrders(res.data.orders || res.data.data || res.data || []);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      } else showToast("Failed to load deliveries.", "error");
    } finally { setLoading(false); }
  }, [navigate]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  // ── UPDATE STATUS ──
  const handleUpdateStatus = async (orderId, newStatus) => {
    const u = getDeliveryUser();
    setUpdating(orderId);
    try {
      await api.put(
        `/delivery/orders/${orderId}/status`,
        { deliveryStatus: newStatus },
        {
          headers: {
            Authorization: `Bearer ${u.token}`,
          },
        }
      );
      // ✅ update deliveryStatus (not status) to match filter logic
      setOrders(prev => prev.map(o =>
        o._id === orderId ? { ...o, deliveryStatus: newStatus } : o
      ));
      if (selectedOrder?._id === orderId)
        setSelectedOrder(prev => ({ ...prev, deliveryStatus: newStatus }));
      showToast(newStatus === "delivered" ? "🎉 Order delivered!" : `Status updated to ${STATUS_CFG[newStatus]?.label}`);
    } catch (err) {
      showToast(err.response?.data?.message || "Failed to update status.", "error");
    } finally { setUpdating(null); }
  };

  // ── FILTER + SEARCH ──
  // ✅ Fixed: use o.deliveryStatus everywhere
  const filtered = orders.filter((o) => {
    const status = o.deliveryStatus || "assigned";
    const matchFilter = filter === "all" || status === filter;
    const q = search.toLowerCase().trim();
    if (!q) return matchFilter;
    const id = (o._id || "").slice(-6).toLowerCase();
    const name = (o.deliveryAddress?.fullName || o.user?.name || "").toLowerCase();
    const phone = (o.deliveryAddress?.phone || o.user?.phone || "").toLowerCase();
    return matchFilter && (id.includes(q) || name.includes(q) || phone.includes(q));
  });

  // ── STATS ── ✅ use deliveryStatus
  const stats = {
    total: orders.length,
    assigned: orders.filter(o => o.deliveryStatus === "assigned").length,
    pickup: orders.filter(o => o.deliveryStatus === "pickup").length,
    transit: orders.filter(o => o.deliveryStatus === "intransit").length,
    delivered: orders.filter(o => o.deliveryStatus === "delivered").length,
    cancelled: orders.filter(o => o.deliveryStatus === "cancelled").length,
  };

  // ── helper ──
  const getCustomerName = (o) => o.deliveryAddress?.fullName || o.user?.name || "—";
  const getCustomerPhone = (o) => o.deliveryAddress?.phone || o.user?.phone || "—";

  return (
    <div style={{ minHeight: "100vh", background: "#f5f0e8", fontFamily: "'Lora','Georgia',serif", color: "#1f2937" }}>

      {/* TOAST */}
      {toast && (
        <div style={{
          position: "fixed", top: 20, right: 20, zIndex: 9999,
          background: toast.type === "error" ? "#fff1f1" : "#f0fdf4",
          color: toast.type === "error" ? "#b91c1c" : "#15803d",
          border: `1px solid ${toast.type === "error" ? "#fca5a5" : "#86efac"}`,
          padding: "12px 20px", borderRadius: 12, fontSize: 14, fontWeight: 600,
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          animation: "slideIn .3s cubic-bezier(.22,1,.36,1)",
        }}>{toast.msg}</div>
      )}

      {/* VIEW MODAL */}
      {selectedOrder && (
        <ViewModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={handleUpdateStatus}
          updating={updating === selectedOrder._id}
        />
      )}

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 20px 60px" }}>

        {/* ── HEADER ── */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 12, color: "#9ca3af", letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 6, fontFamily: "sans-serif" }}>
            Delivery Partner
          </div>
          <h1 style={{ fontSize: 28, fontWeight: 800, color: "#111827", margin: 0, letterSpacing: "-0.5px", display: "flex", alignItems: "center", gap: 10 }}>
            🚚 My Deliveries
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", margin: "6px 0 0" }}>
            View and manage all deliveries assigned to you
          </p>
        </div>

        {/* ── STATS ── */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 12, marginBottom: 24 }}>
          {[
            { label: "Total", value: stats.total, icon: "📦", accent: "#2563eb", bg: "#eff6ff", border: "#bfdbfe" },
            { label: "Delivered", value: stats.delivered, icon: "✅", accent: "#059669", bg: "#ecfdf5", border: "#a7f3d0" },
            { label: "In Transit", value: stats.transit, icon: "🚚", accent: "#d97706", bg: "#fffbeb", border: "#fde68a" },
            { label: "Cancelled", value: stats.cancelled, icon: "❌", accent: "#dc2626", bg: "#fef2f2", border: "#fecaca" },
          ].map(s => (
            <div key={s.label} style={{
              background: "#fff", border: `1px solid ${s.border}`,
              borderRadius: 16, padding: "16px 18px",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}>
              <div style={{ fontSize: 22, marginBottom: 8 }}>{s.icon}</div>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.accent, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "#9ca3af", marginTop: 4, textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "sans-serif" }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* ── SEARCH ── */}
        <div style={{ position: "relative", marginBottom: 16, maxWidth: 380 }}>
          <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#9ca3af", pointerEvents: "none" }}>🔍</span>
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by Order ID, Customer or Phone..."
            style={{
              width: "100%", padding: "11px 14px 11px 40px",
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 12, color: "#111827", fontSize: 14,
              fontFamily: "inherit", outline: "none", boxSizing: "border-box",
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onFocus={e => { e.target.style.borderColor = "#c89b3c"; e.target.style.boxShadow = "0 0 0 3px rgba(200,155,60,0.15)"; }}
            onBlur={e => { e.target.style.borderColor = "#e5e7eb"; e.target.style.boxShadow = "0 1px 3px rgba(0,0,0,0.06)"; }}
          />
        </div>

        {/* ── FILTER TABS ── ✅ Fixed count: use deliveryStatus */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {FILTER_TABS.map(tab => {
            const count = tab.key === "all"
              ? orders.length
              : orders.filter(o => o.deliveryStatus === tab.key).length;
            return (
              <button key={tab.key} onClick={() => setFilter(tab.key)} style={{
                padding: "7px 16px", borderRadius: 10,
                border: filter === tab.key ? "1px solid #c89b3c" : "1px solid #e5e7eb",
                background: filter === tab.key ? "#fdf6e9" : "#fff",
                color: filter === tab.key ? "#c89b3c" : "#6b7280",
                fontSize: 13, fontWeight: 700, cursor: "pointer",
                fontFamily: "inherit", transition: "all 0.15s",
              }}>
                {tab.label}
                <span style={{
                  marginLeft: 6, fontSize: 11, padding: "1px 7px", borderRadius: 5,
                  background: filter === tab.key ? "#f5e6c8" : "#f3f4f6",
                  color: filter === tab.key ? "#92400e" : "#9ca3af",
                  fontWeight: 800,
                }}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── CONTENT ── */}
        {loading ? (
          <LoadingSkeleton />
        ) : filtered.length === 0 ? (
          <EmptyState search={search} filter={filter} />
        ) : (
          <>
            {/* Desktop Table */}
            <div className="desktop-table" style={{
              background: "#fff", border: "1px solid #e5e7eb",
              borderRadius: 18, overflow: "hidden",
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            }}>
              {/* Head */}
              <div style={{
                display: "grid",
                gridTemplateColumns: "0.7fr 1.4fr 1fr 1.8fr 0.8fr 0.8fr 1fr 0.8fr 0.6fr",
                padding: "12px 20px", background: "#f9fafb",
                borderBottom: "1px solid #e5e7eb",
              }}>
                {["Order ID", "Customer", "Phone", "Address", "Items", "Amount", "Status", "Date", "View"].map(h => (
                  <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.07em", textTransform: "uppercase", fontFamily: "sans-serif" }}>{h}</div>
                ))}
              </div>

              {/* Rows */}
              {filtered.map((order, idx) => {
                // ✅ use deliveryStatus for cfg lookup
                const status = order.deliveryStatus || "assigned";
                const cfg = STATUS_CFG[status] || STATUS_CFG.assigned;
                const address = order.deliveryAddress || {};
                const items = order.items || order.orderItems || [];
                const total = order.finalTotal || order.totalPrice || order.total || 0;
                const name = getCustomerName(order);
                const phone = getCustomerPhone(order);
                const shortId = order._id?.slice(-6).toUpperCase();
                const date = order.createdAt
                  ? new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" })
                  : "—";
                const addrStr = [address.area, address.city].filter(Boolean).join(", ") || "—";

                return (
                  <div key={order._id} style={{
                    display: "grid",
                    gridTemplateColumns: "0.7fr 1.4fr 1fr 1.8fr 0.8fr 0.8fr 1fr 0.8fr 0.6fr",
                    padding: "14px 20px",
                    borderBottom: idx < filtered.length - 1 ? "1px solid #f3f4f6" : "none",
                    alignItems: "center", transition: "background 0.15s",
                    animation: `fadeUp .3s ease ${Math.min(idx, 8) * .04}s both`,
                  }}
                    onMouseEnter={e => e.currentTarget.style.background = "#fdf8f0"}
                    onMouseLeave={e => e.currentTarget.style.background = "#fff"}
                  >
                    <div style={{ fontFamily: "monospace", fontSize: 12, fontWeight: 700, color: "#374151" }}>#{shortId}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: "#111827", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</div>
                    <div><a href={`tel:${phone}`} style={{ fontSize: 12, color: "#2563eb", fontWeight: 600, textDecoration: "none" }}>{phone}</a></div>
                    <div style={{ fontSize: 12, color: "#6b7280", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{addrStr}</div>
                    <div style={{ fontSize: 13, color: "#374151", fontWeight: 600 }}>{items.length} item{items.length !== 1 ? "s" : ""}</div>
                    <div style={{ fontSize: 13, fontWeight: 800, color: "#c89b3c" }}>₹{Number(total).toFixed(0)}</div>
                    <div>
                      <span style={{
                        fontSize: 11, fontWeight: 700, padding: "3px 10px",
                        borderRadius: 7, textTransform: "uppercase", letterSpacing: "0.05em",
                        background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                        display: "inline-flex", alignItems: "center", gap: 4, fontFamily: "sans-serif",
                      }}>
                        {cfg.icon} {cfg.label}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#9ca3af", fontFamily: "sans-serif" }}>{date}</div>
                    <div>
                      <button
                        onClick={() => setSelectedOrder(order)}
                        style={{
                          padding: "6px 14px", borderRadius: 8,
                          background: "linear-gradient(135deg,#c89b3c,#b88a2f)",
                          border: "none", color: "#fff",
                          fontSize: 12, fontWeight: 700, cursor: "pointer",
                          fontFamily: "inherit",
                          boxShadow: "0 3px 8px rgba(200,155,60,0.3)",
                        }}
                      >View</button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Mobile Cards */}
            <div className="mobile-cards" style={{ display: "none", flexDirection: "column", gap: 10 }}>
              {filtered.map((order, idx) => {
                const status = order.deliveryStatus || "assigned";
                const cfg = STATUS_CFG[status] || STATUS_CFG.assigned;
                const name = getCustomerName(order);
                const phone = getCustomerPhone(order);
                const total = order.finalTotal || order.totalPrice || 0;
                return (
                  <div key={order._id} style={{
                    background: "#fff", border: "1px solid #e5e7eb",
                    borderRadius: 14, padding: "14px 16px",
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    animation: `fadeUp .3s ease ${idx * .05}s both`,
                  }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: "#111827", marginBottom: 2 }}>{name}</div>
                      <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 4 }}>{phone}</div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                        <span style={{ fontSize: 14, fontWeight: 800, color: "#c89b3c" }}>₹{Number(total).toFixed(0)}</span>
                        <span style={{
                          fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 5,
                          background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.border}`,
                          textTransform: "uppercase", letterSpacing: "0.05em",
                        }}>{cfg.icon} {cfg.label}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      style={{
                        padding: "8px 16px", borderRadius: 9,
                        background: "linear-gradient(135deg,#c89b3c,#b88a2f)",
                        border: "none", color: "#fff",
                        fontSize: 12, fontWeight: 700, cursor: "pointer",
                        fontFamily: "inherit", flexShrink: 0,
                        boxShadow: "0 3px 8px rgba(200,155,60,0.3)",
                      }}
                    >View</button>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      <style>{`
        @keyframes slideIn { from{transform:translateX(40px);opacity:0} to{transform:translateX(0);opacity:1} }
        @keyframes fadeUp  { from{transform:translateY(10px);opacity:0} to{transform:translateY(0);opacity:1} }
        @keyframes spin    { to{transform:rotate(360deg)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:.45} }
        @media(max-width:768px){
          .desktop-table{display:none!important}
          .mobile-cards{display:flex!important}
        }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────
// VIEW MODAL
// ─────────────────────────────────────
function ViewModal({ order, onClose, onUpdateStatus, updating }) {
  const address = order.deliveryAddress || {};
  const items = order.items || order.orderItems || [];
  const total = order.finalTotal || order.totalPrice || order.total || 0;
  const name = address.fullName || order.user?.name || "—";
  const phone = address.phone || order.user?.phone || "—";

  // ✅ use deliveryStatus
  const status = order.deliveryStatus || "assigned";
  const cfg = STATUS_CFG[status] || STATUS_CFG.assigned;
  const next = NEXT_ACTION[status];

  const fullAddress = [
    address.house, address.street, address.area,
    address.city, address.pincode, address.landmark,
  ].filter(Boolean).join(", ");

  const mapsUrl = `https://maps.google.com/?q=${encodeURIComponent(fullAddress || name)}`;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 9998,
      background: "rgba(0,0,0,0.45)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: "#fff", borderRadius: 22, width: "100%", maxWidth: 560,
        maxHeight: "90vh", overflowY: "auto",
        boxShadow: "0 24px 64px rgba(0,0,0,0.18)",
        border: "1px solid #e5e7eb",
        animation: "scaleIn .25s cubic-bezier(.22,1,.36,1)",
      }}>

        {/* Header */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "18px 24px", borderBottom: "1px solid #f3f4f6",
          background: "linear-gradient(135deg,#fdf6e9,#f5e6c8)",
        }}>
          <div>
            <div style={{ fontSize: 11, color: "#9ca3af", fontFamily: "sans-serif", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Order Details</div>
            <div style={{ fontSize: 17, fontWeight: 800, color: "#111827", fontFamily: "monospace" }}>
              #{order._id?.slice(-6).toUpperCase()}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: "5px 12px",
              borderRadius: 8, background: cfg.bg, color: cfg.color,
              border: `1px solid ${cfg.border}`,
              textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "sans-serif",
            }}>{cfg.icon} {cfg.label}</span>
            <button onClick={onClose} style={{
              width: 32, height: 32, borderRadius: 8,
              background: "#f3f4f6", border: "none",
              color: "#6b7280", cursor: "pointer", fontSize: 16,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>✕</button>
          </div>
        </div>

        <div style={{ padding: "20px 24px", display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Customer */}
          <Section title="👤 Customer Details" bg="#eff6ff" border="#bfdbfe">
            <InfoRow label="Name" value={name} />
            <InfoRow label="Phone" value={<a href={`tel:${phone}`} style={{ color: "#2563eb", fontWeight: 700, textDecoration: "none" }}>{phone}</a>} />
          </Section>

          {/* Address */}
          <Section title="📍 Delivery Address" bg="#f0fdf4" border="#a7f3d0">
            {address.house && <InfoRow label="House" value={address.house} />}
            {address.street && <InfoRow label="Street" value={address.street} />}
            {address.area && <InfoRow label="Area" value={address.area} />}
            {address.city && <InfoRow label="City" value={address.city} />}
            {address.pincode && <InfoRow label="Pincode" value={address.pincode} />}
            {address.landmark && <InfoRow label="Landmark" value={address.landmark} />}
            {!fullAddress && <div style={{ fontSize: 13, color: "#9ca3af" }}>No address provided</div>}
          </Section>

          {/* Items */}
          <Section title="🧾 Order Details" bg="#fafafa" border="#e5e7eb">
            {items.length > 0 ? (
              <>
                {items.map((item, i) => {
                  const iname = item.name || item.menuItem?.name || `Item ${i + 1}`;
                  const qty = item.quantity || 1;
                  const price = item.price || item.menuItem?.price || 0;
                  return (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: i < items.length - 1 ? "1px solid #f3f4f6" : "none" }}>
                      <span style={{ fontSize: 13, color: "#374151" }}>
                        <span style={{ background: "#f5e6c8", color: "#92400e", fontSize: 11, fontWeight: 800, padding: "1px 6px", borderRadius: 4, marginRight: 6 }}>×{qty}</span>
                        {iname}
                      </span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>₹{(price * qty).toFixed(0)}</span>
                    </div>
                  );
                })}
                <div style={{ borderTop: "1px dashed #e5e7eb", marginTop: 8, paddingTop: 8 }}>
                  <InfoRow label="Subtotal" value={`₹${order.subtotal || 0}`} />
                  <InfoRow label="Delivery Fee" value={`₹${order.deliveryFee || 0}`} />
                  {order.discount > 0 && <InfoRow label="Discount" value={`− ₹${order.discount}`} accent="#059669" />}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, paddingTop: 4, borderTop: "1px solid #e5e7eb" }}>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#374151" }}>Final Total</span>
                    <span style={{ fontSize: 16, fontWeight: 800, color: "#c89b3c" }}>₹{Number(total).toFixed(0)}</span>
                  </div>
                </div>
              </>
            ) : <div style={{ fontSize: 13, color: "#9ca3af" }}>No items found</div>}
          </Section>

          {/* Payment */}
          <Section title="💳 Payment Details" bg="#fffbeb" border="#fde68a">
            <InfoRow label="Method" value={(order.paymentMethod || "—").toUpperCase()} />
            <InfoRow label="Status" value={order.paymentStatus || "—"} accent={order.paymentStatus === "paid" ? "#059669" : "#d97706"} />
          </Section>

          {/* Delivery info */}
          <Section title="🚚 Delivery Details" bg="#f5f3ff" border="#ddd6fe">
            <InfoRow label="Status" value={cfg.label} accent={cfg.color} />
            {order.estimatedDeliveryTime && (
              <InfoRow label="Est. Delivery" value={new Date(order.estimatedDeliveryTime).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })} />
            )}
            {order.specialInstructions && <InfoRow label="Instructions" value={order.specialInstructions} />}
            {/* ✅ Show cancel reason if cancelled */}
            {status === "cancelled" && order.cancelReason && (
              <InfoRow label="Cancel Reason" value={order.cancelReason} accent="#dc2626" />
            )}
          </Section>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <a href={`tel:${phone}`} style={{
              flex: 1, minWidth: 120, padding: "11px", borderRadius: 11,
              background: "#eff6ff", border: "1px solid #bfdbfe",
              color: "#2563eb", fontSize: 13, fontWeight: 700,
              textAlign: "center", textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>📞 Call Customer</a>
            <a href={mapsUrl} target="_blank" rel="noreferrer" style={{
              flex: 1, minWidth: 120, padding: "11px", borderRadius: 11,
              background: "#f0fdf4", border: "1px solid #a7f3d0",
              color: "#059669", fontSize: 13, fontWeight: 700,
              textAlign: "center", textDecoration: "none",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}>🗺️ Open Maps</a>
          </div>

          {/* Next status CTA */}
          {next && (
            <button
              onClick={() => onUpdateStatus(order._id, next.status)}
              disabled={updating}
              style={{
                width: "100%", padding: "14px", borderRadius: 13,
                border: "none", cursor: updating ? "not-allowed" : "pointer",
                background: updating ? "#e5e7eb" : "linear-gradient(135deg,#c89b3c,#b88a2f)",
                color: updating ? "#9ca3af" : "#fff",
                fontSize: 14, fontWeight: 800, fontFamily: "inherit",
                boxShadow: updating ? "none" : "0 6px 20px rgba(200,155,60,0.35)",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                transition: "all 0.2s",
              }}
            >
              {updating ? <><Spinner size={16} /> Updating…</> : <>{next.icon} {next.label}</>}
            </button>
          )}

          {status === "delivered" && (
            <div style={{ padding: "13px", borderRadius: 12, textAlign: "center", background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#059669", fontSize: 14, fontWeight: 700 }}>
              ✅ Order Successfully Delivered
            </div>
          )}
          {status === "cancelled" && (
            <div style={{ padding: "13px", borderRadius: 12, textAlign: "center", background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626", fontSize: 14, fontWeight: 700 }}>
              ❌ This Order Was Cancelled
            </div>
          )}

          <button onClick={onClose} style={{
            width: "100%", padding: "12px", borderRadius: 11,
            background: "#f9fafb", border: "1px solid #e5e7eb",
            color: "#6b7280", fontSize: 13, fontWeight: 600,
            cursor: "pointer", fontFamily: "inherit",
          }}>Close</button>

        </div>
      </div>
      <style>{`@keyframes scaleIn{from{transform:scale(.94);opacity:0}to{transform:scale(1);opacity:1}}`}</style>
    </div>
  );
}

// ── helpers ──
function Section({ title, bg, border, children }) {
  return (
    <div style={{ background: bg, border: `1px solid ${border}`, borderRadius: 14, padding: "14px 16px" }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: "#9ca3af", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 10, fontFamily: "sans-serif" }}>{title}</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>{children}</div>
    </div>
  );
}

function InfoRow({ label, value, accent }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8 }}>
      <span style={{ fontSize: 11, color: "#9ca3af", textTransform: "uppercase", letterSpacing: "0.05em", flexShrink: 0, fontFamily: "sans-serif" }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: accent || "#374151", textAlign: "right" }}>{value}</span>
    </div>
  );
}

function Spinner({ size = 18 }) {
  return (
    <span style={{
      width: size, height: size, display: "inline-block",
      border: "2px solid rgba(255,255,255,0.3)", borderTopColor: "#fff",
      borderRadius: "50%", animation: "spin .7s linear infinite",
    }} />
  );
}

function LoadingSkeleton() {
  return (
    <div style={{ background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, overflow: "hidden" }}>
      <div style={{ display: "grid", gridTemplateColumns: "0.7fr 1.4fr 1fr 1.8fr 0.8fr 0.8fr 1fr 0.8fr 0.6fr", padding: "12px 20px", background: "#f9fafb", borderBottom: "1px solid #e5e7eb" }}>
        {["Order ID", "Customer", "Phone", "Address", "Items", "Amount", "Status", "Date", "View"].map(h => (
          <div key={h} style={{ fontSize: 11, fontWeight: 700, color: "#d1d5db", letterSpacing: "0.07em", textTransform: "uppercase" }}>{h}</div>
        ))}
      </div>
      {[...Array(4)].map((_, i) => (
        <div key={i} style={{
          display: "grid", gridTemplateColumns: "0.7fr 1.4fr 1fr 1.8fr 0.8fr 0.8fr 1fr 0.8fr 0.6fr",
          padding: "16px 20px", borderBottom: i < 3 ? "1px solid #f3f4f6" : "none",
          alignItems: "center", animation: "pulse 1.5s ease infinite", animationDelay: `${i * .1}s`,
        }}>
          {[48, 100, 80, 120, 40, 50, 72, 50, 44].map((w, j) => (
            <div key={j} style={{ width: w, height: j === 6 ? 22 : j === 8 ? 28 : 12, background: "#f3f4f6", borderRadius: j === 6 || j === 8 ? 7 : 4 }} />
          ))}
        </div>
      ))}
    </div>
  );
}

// ✅ Fixed typo: fil0ter → filter
function EmptyState({ search, filter }) {
  return (
    <div style={{ textAlign: "center", padding: "64px 20px", background: "#fff", border: "1px solid #e5e7eb", borderRadius: 18, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
      <div style={{ fontSize: 52, marginBottom: 14 }}>🚚</div>
      <div style={{ fontSize: 18, fontWeight: 700, color: "#111827", marginBottom: 8 }}>No deliveries found</div>
      <div style={{ fontSize: 14, color: "#6b7280", maxWidth: 280, margin: "0 auto", lineHeight: 1.6 }}>
        {search
          ? `No results for "${search}".`
          : filter !== "all"
            ? `No ${filter.replaceAll("_", " ")} orders.`
            : "You have no assigned deliveries yet."}
      </div>
    </div>
  );
}