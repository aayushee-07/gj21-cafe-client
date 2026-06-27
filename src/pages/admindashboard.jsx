import React, { useEffect, useState, useRef } from "react";
import api from "../lib/apiClient";
import { Link } from "react-router-dom";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Package, Clock, ChefHat, TrendingUp, Star,
  ClipboardList, Utensils, MessageSquare, ArrowRight
} from "lucide-react";

// ── STATUS STYLE ──
const getStatusStyle = (status) => {
  switch (status?.toLowerCase()) {
    case "pending": return "bg-yellow-100 text-yellow-700";
    case "confirmed": return "bg-blue-100 text-blue-700";
    case "preparing": return "bg-purple-100 text-purple-700";
    case "assigned": return "bg-cyan-100 text-cyan-700";
    case "pickup":
    case "pickedup": return "bg-indigo-100 text-indigo-700";
    case "intransit": return "bg-orange-100 text-orange-700";
    case "delivered": return "bg-green-100 text-green-700";
    case "cancelled": return "bg-red-100 text-red-700";
    default: return "bg-stone-100 text-stone-500";
  }
};

export default function AdminDashboard() {
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({});
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [cancelReason, setCancelReason] = useState("");
  const previousCount = useRef(0);

  useEffect(() => {
    fetchDashboard();
  }, []);

  const fetchDashboard = async () => {
    try {
      const [orderRes, statsRes, deliveryRes] = await Promise.all([
        api.get("/admin/orders?limit=5"),
        api.get("/admin/stats"),
        api.get("/admin/delivery-boy"),
      ]);

      setDeliveryBoys(
        deliveryRes.data.filter((boy) => boy.isActive)
      );
      const orderData = orderRes.data.orders;
      if (orderData.length > previousCount.current && previousCount.current !== 0) {
        new Audio("https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg").play();
      }
      previousCount.current = orderData.length;
      setOrders(orderData.slice(0, 5));
      setStats(statsRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id, status) => {
    if (status === "cancelled") {
      setCancelOrderId(id);
      return;
    }
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      fetchDashboard();
    } catch (err) {
      console.error("updateStatus error:", err);
    }
  };

  const confirmCancel = async () => {
    try {
      await api.put(`/admin/orders/${cancelOrderId}/cancel`, { reason: cancelReason });
      setCancelOrderId(null);
      setCancelReason("");
      fetchDashboard();
    } catch (err) {
      console.error("cancel error:", err);
      alert(err.response?.data?.message || "Failed to cancel order.");
    }
  };
  const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
    try {
      await api.put(`/admin/orders/${orderId}/assign`, {
        deliveryBoyId,
      });

      fetchDashboard(); // refresh table
    } catch (err) {
      console.error(err);
      alert(
        err.response?.data?.message ||
        "Failed to assign delivery boy"
      );
    }
  };
  // ── STAT CARDS ──
  const statCards = [
    { title: "Total Orders", value: stats.totalOrders || 0, icon: Package, bg: "bg-blue-50", iconColor: "text-blue-500", valColor: "text-blue-600", border: "border-blue-100" },
    { title: "Pending", value: stats.pending || 0, icon: Clock, bg: "bg-yellow-50", iconColor: "text-yellow-500", valColor: "text-yellow-600", border: "border-yellow-100" },
    { title: "Preparing", value: stats.preparing || 0, icon: ChefHat, bg: "bg-purple-50", iconColor: "text-purple-500", valColor: "text-purple-600", border: "border-purple-100" },
    { title: "Revenue", value: `₹${stats.revenue || 0}`, icon: TrendingUp, bg: "bg-green-50", iconColor: "text-green-500", valColor: "text-green-600", border: "border-green-100" },
    { title: "Avg Rating", value: `${stats.avgRating || 0} ⭐`, icon: Star, bg: "bg-amber-50", iconColor: "text-amber-500", valColor: "text-amber-600", border: "border-amber-100", sub: `${stats.totalReviews || 0} reviews` },
  ];

  // ── QUICK LINKS ──
  const quickLinks = [
    { to: "/admin/orders", icon: ClipboardList, label: "Manage Orders", desc: "View & update order statuses", bg: "bg-blue-50", iconColor: "text-blue-500", border: "border-blue-100" },
    { to: "/admin/menu", icon: Utensils, label: "Manage Menu", desc: "Add, edit or remove items", bg: "bg-amber-50", iconColor: "text-[#c89b3c]", border: "border-amber-100" },
    { to: "/admin/feedback", icon: MessageSquare, label: "Customer Feedback", desc: "Read reviews & ratings", bg: "bg-purple-50", iconColor: "text-purple-500", border: "border-purple-100" },
  ];

  return (
    <div className="min-h-screen">

      {/* ── PAGE HEADING ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
          👑 GJ 21 Cafe Dashboard
        </h1>
        <p className="text-stone-400 text-sm mt-1">Welcome back! Here's what's happening today.</p>
      </div>

      {/* ── STATS GRID ── */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        {statCards.map(({ title, value, icon: Icon, bg, iconColor, valColor, border, sub }) => (
          <div key={title} className={`${bg} border ${border} rounded-2xl p-5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">{title}</p>
              <div className={`${iconColor} opacity-60`}><Icon size={16} /></div>
            </div>
            <p className={`text-2xl font-bold ${valColor} leading-tight`}>{value}</p>
            {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="mb-8">
        <h2 className="text-sm font-bold text-stone-700 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {quickLinks.map(({ to, icon: Icon, label, desc, bg, iconColor, border }) => (
            <Link key={to} to={to}
              className={`${bg} border ${border} rounded-2xl p-5 flex items-center gap-4
              hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group`}
            >
              <div className={`w-11 h-11 rounded-xl bg-white border ${border} shadow-sm
                flex items-center justify-center flex-shrink-0
                group-hover:scale-110 transition-transform duration-200`}>
                <Icon size={18} className={iconColor} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-stone-800">{label}</p>
                <p className="text-xs text-stone-400 mt-0.5">{desc}</p>
              </div>
              <ArrowRight size={16} className="text-stone-300 group-hover:text-stone-500 transition-colors flex-shrink-0" />
            </Link>
          ))}
        </div>
      </div>

      {/* ── RECENT ORDERS ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
          <div>
            <h2 className="text-sm font-bold text-stone-700">Recent Orders</h2>
            <p className="text-xs text-stone-400 mt-0.5">Latest incoming orders</p>
          </div>
          <Link to="/admin/orders"
            className="flex items-center gap-1 text-xs font-semibold text-[#c89b3c] hover:text-[#b88a2f] transition-colors">
            View All <ArrowRight size={13} />
          </Link>
        </div>

        {/* ── INLINE RECENT ORDERS TABLE (same as AdminOrders) ── */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                {[
                  "Order",
                  "Customer",
                  "Total",
                  "Order Status",
                  "Delivery Status",
                  "Update Status",
                  "Assign Delivery",
                  "View",
                ].map((h) => (
                  <th key={h} className="px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-stone-400 text-sm">
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order._id} className="hover:bg-stone-50 transition-colors duration-100">

                    <td className="px-5 py-4 font-mono text-xs font-bold text-stone-600">
                      #{order._id.slice(-6).toUpperCase()}
                    </td>

                    <td className="px-5 py-4 text-stone-700 font-medium text-sm">
                      {order.deliveryAddress?.fullName || order.user?.name || "—"}
                    </td>

                    <td className="px-5 py-4 font-bold text-stone-800">
                      ₹{order.totalPrice || order.finalTotal || 0}
                    </td>

                    {/* Order Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${getStatusStyle(order.status)}`}>
                        {order.status?.replaceAll("_", " ")}
                      </span>
                    </td>

                    {/* Delivery Status */}
                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${getStatusStyle(order.deliveryStatus || "assigned")}`}>
                        {(order.deliveryStatus || "assigned").replaceAll("_", " ")}
                      </span>
                    </td>

                    {/* Update Status dropdown */}
                    <td className="px-5 py-4">
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order._id, e.target.value)}
                        className="border border-stone-200 bg-white text-stone-700 text-xs
                        px-2 py-1.5 rounded-lg focus:outline-none focus:ring-2
                        focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="assigned">Assigned</option>
                        <option value="cancelled">Cancel Order</option>
                      </select>
                    </td>

                    <td className="px-5 py-4">
                      <select
                        value={order.assignedDeliveryBoy?._id || ""}
                        onChange={(e) =>
                          assignDeliveryBoy(order._id, e.target.value)
                        }
                        className="border border-stone-200 bg-white text-stone-700 text-xs
  px-2 py-1.5 rounded-lg focus:outline-none"
                      >
                        <option value="">
                          Not Assigned
                        </option>

                        {deliveryBoys
                          .filter((boy) => boy.isActive)
                          .map((boy) => (
                            <option key={boy._id} value={boy._id}>
                              {boy.name}
                            </option>
                          ))}
                      </select>
                    </td>

                    {/* View */}
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="px-3 py-1.5 bg-[#c89b3c] hover:bg-[#b88a2f] text-white
                        text-xs font-semibold rounded-lg transition-all duration-150
                        hover:-translate-y-0.5 active:translate-y-0"
                      >
                        View
                      </button>
                    </td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ══ VIEW ORDER MODAL ══ */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <p className="text-xs text-stone-400 font-medium">Order Details</p>
                <p className="font-bold text-stone-800">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
              </div>
              <button onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-all">
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Customer */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4">
                <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mb-2">Customer</p>
                <p className="font-bold text-stone-800 text-sm">👤 {selectedOrder.deliveryAddress?.fullName || selectedOrder.user?.name || "—"}</p>
                <p className="text-xs text-stone-500 mt-1">📧 {selectedOrder.user?.email || "—"}</p>
                <p className="text-xs text-green-600 font-semibold mt-1">📞 {selectedOrder.deliveryAddress?.phone || "—"}</p>
              </div>

              {/* Address */}
              <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">📍 Delivery Address</p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {[
                    selectedOrder.deliveryAddress?.house,
                    selectedOrder.deliveryAddress?.street,
                    selectedOrder.deliveryAddress?.area,
                    selectedOrder.deliveryAddress?.city,
                    selectedOrder.deliveryAddress?.pincode,
                    selectedOrder.deliveryAddress?.landmark,
                  ].filter(Boolean).join(", ") || "No address provided"}
                </p>
              </div>

              {/* Delivery Partner + Payment */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-purple-50 border border-purple-100 rounded-2xl px-4 py-4">
                  <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-widest mb-2">Delivery Partner</p>
                  <p className="font-bold text-stone-800">{selectedOrder.assignedDeliveryBoy?.name || "Not Assigned"}</p>
                  <p className="text-xs text-stone-500 mt-0.5">{selectedOrder.assignedDeliveryBoy?.phone || ""}</p>
                  <span className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${getStatusStyle(selectedOrder.deliveryStatus || "assigned")}`}>
                    {(selectedOrder.deliveryStatus || "assigned").replaceAll("_", " ")}
                  </span>
                </div>
                <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-4 flex flex-col justify-between">
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-2">Payment</p>
                  <p className="text-sm font-bold text-stone-700 capitalize">{selectedOrder.paymentMethod || "—"}</p>
                  <span className={`inline-block mt-2 text-[11px] font-bold px-3 py-1 rounded-full capitalize w-fit
                    ${selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                    {selectedOrder.paymentStatus || "—"}
                  </span>
                </div>
              </div>

              {/* Items */}
              <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">🧾 Items Ordered</p>
                <div className="flex flex-col gap-2">
                  {(selectedOrder.items || []).map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-stone-600">{item.menuItem?.name || item.name || `Item ${i + 1}`}</span>
                      <span className="bg-stone-200 text-stone-600 text-xs font-semibold px-2 py-0.5 rounded-full">× {item.quantity || 1}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>₹{selectedOrder.subtotal || 0}</span></div>
                <div className="flex justify-between text-stone-500"><span>Delivery Fee</span><span>₹{selectedOrder.deliveryFee || 0}</span></div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>− ₹{selectedOrder.discount}</span></div>
                )}
                <hr className="border-dashed border-stone-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-700">Final Total</span>
                  <span className="text-green-600 font-bold text-lg">₹{selectedOrder.finalTotal || selectedOrder.totalPrice || 0}</span>
                </div>
              </div>

              {/* Est. delivery */}
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm">
                <span className="text-stone-500">⏱ Est. Delivery: </span>
                <span className="font-semibold text-stone-700">
                  {new Date(new Date(selectedOrder.createdAt).getTime() + 45 * 60000).toLocaleString("en-IN")}
                </span>
              </div>

              <button onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold text-sm tracking-wide transition-all">
                Close
              </button>

            </div>
          </div>
        </div>
      )}

      {/* ══ CANCEL ORDER MODAL ══ */}
      {cancelOrderId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-md p-7">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <X size={20} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-stone-800 text-center mb-1">Cancel Order</h2>
            <p className="text-sm text-stone-400 text-center mb-5">Please provide a reason for cancellation.</p>
            <textarea
              className="w-full border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl
              text-sm text-stone-800 placeholder:text-stone-300 resize-none focus:outline-none
              focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all mb-4"
              rows={3}
              placeholder="Enter cancellation reason..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />
            <div className="flex gap-3">
              <button onClick={() => { setCancelOrderId(null); setCancelReason(""); }}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-500 text-sm font-semibold hover:bg-stone-100 transition-all">
                Close
              </button>
              <button onClick={confirmCancel}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-red-200 transition-all">
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}