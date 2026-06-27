import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  FiTruck, FiPackage, FiCheckCircle, FiClock,
  FiRefreshCw, FiMapPin, FiChevronDown, FiList, FiEye,
  FiPhone, FiNavigation
} from "react-icons/fi";
import { X, AlertTriangle } from "lucide-react";
import api from "../lib/apiClient";

const STATUS_OPTIONS = ["assigned", "pickup", "intransit", "delivered", "cancelled"];

const STATUS_STYLE = {
  assigned:  "bg-blue-100 text-blue-700",
  pickup:    "bg-purple-100 text-purple-700",
  intransit: "bg-amber-100 text-[#c89b3c]",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};

const STATUS_LABEL = {
  assigned:  "Assigned",
  pickup:    "Pickup",
  intransit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export default function DeliveryDashboard({ user }) {
  const [orders, setOrders]               = useState([]);
  const [loading, setLoading]             = useState(true);
  const [error, setError]                 = useState(null);
  const [updating, setUpdating]           = useState(null);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Cancel modal state
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason]   = useState("");
  const [cancelling, setCancelling]       = useState(false);

  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/delivery/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    // If cancelling — open cancel modal instead
    if (newStatus === "cancelled") {
      setCancelOrderId(orderId);
      setCancelReason("");
      return;
    }
    setUpdating(orderId);
    try {
      await api.put(`/delivery/orders/${orderId}/status`, {
        deliveryStatus: newStatus.toLowerCase(),
      });
      setOrders((prev) =>
        prev.map((o) => o._id === orderId ? { ...o, deliveryStatus: newStatus } : o)
      );
      setSelectedOrder((prev) =>
        prev?._id === orderId ? { ...prev, deliveryStatus: newStatus } : prev
      );
    } catch (err) {
      alert(err.response?.data?.message || "Status update failed");
    } finally {
      setUpdating(null);
    }
  };

  // ── Confirm cancel with reason sent to customer ──
  const confirmCancel = async () => {
    if (!cancelReason.trim()) {
      alert("Please enter a cancellation reason");
      return;
    }
    setCancelling(true);
    try {
      await api.put(`/delivery/orders/${cancelOrderId}/status`, {
        deliveryStatus: "cancelled",
        cancelReason: cancelReason.trim(),   // backend saves & sends to customer
      });
      setOrders((prev) =>
        prev.map((o) =>
          o._id === cancelOrderId
            ? { ...o, deliveryStatus: "cancelled", cancelReason: cancelReason.trim() }
            : o
        )
      );
      setSelectedOrder((prev) =>
        prev?._id === cancelOrderId
          ? { ...prev, deliveryStatus: "cancelled", cancelReason: cancelReason.trim() }
          : prev
      );
      setCancelOrderId(null);
      setCancelReason("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    } finally {
      setCancelling(false);
    }
  };

  // ── Open Google Maps with delivery address ──
  const openInMaps = (address) => {
    if (!address) return;
    const query = [
      address.house,
      address.street,
      address.area,
      address.city,
      address.pincode,
    ].filter(Boolean).join(", ");
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
    window.open(url, "_blank");
  };

  // ── Call customer ──
  const callCustomer = (phone) => {
    if (!phone) return alert("No phone number available");
    window.location.href = `tel:${phone}`;
  };

  // ── Stats ──
  const assigned  = orders.filter((o) => o.deliveryStatus === "assigned").length;
  const inTransit = orders.filter((o) => o.deliveryStatus === "intransit").length;
  const delivered = orders.filter((o) => o.deliveryStatus === "delivered").length;

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  // ── Get correct customer name (avoid duplication) ──
  const getCustomerName  = (order) => order.deliveryAddress?.fullName || order.user?.name || "—";
  const getCustomerPhone = (order) => order.deliveryAddress?.phone || order.user?.phone || null;

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-4 md:p-8">

      {/* ── HEADER ── */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 flex items-center gap-3">
            <FiTruck className="text-[#c89b3c]" />
            Delivery Dashboard
          </h1>
          <p className="text-stone-500 mt-1 text-sm">
            Welcome back,{" "}
            <span className="text-[#c89b3c] font-semibold">{user?.name || "Delivery Boy"}</span>
          </p>
        </div>
        <button
          onClick={fetchOrders}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-medium shadow-sm transition"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: "Assigned Orders",   value: assigned,  icon: <FiPackage />,     bg: "bg-blue-50",  text: "text-blue-600",  border: "border-blue-200"  },
          { label: "In Transit Orders", value: inTransit, icon: <FiTruck />,       bg: "bg-amber-50", text: "text-[#c89b3c]", border: "border-amber-200" },
          { label: "Delivered Orders",  value: delivered, icon: <FiCheckCircle />, bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
        ].map(({ label, value, icon, bg, text, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-5 shadow-sm flex items-center gap-4`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${bg} ${text}`}>
              {icon}
            </div>
            <div>
              <p className={`text-2xl font-bold ${text}`}>{value}</p>
              <p className="text-stone-500 text-sm">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── QUICK ACTIONS ── */}
      <div className="mb-8">
        <h2 className="text-base font-semibold text-stone-700 mb-3">Quick Actions</h2>
        <div className="flex flex-wrap gap-3">
          <Link
            to="/delivery/orders"
            className="flex items-center gap-2 px-5 py-2.5 bg-[#c89b3c] hover:bg-[#b88a2f] text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5"
          >
            <FiList /> My Deliveries
          </Link>
        </div>
      </div>

      {/* ── ORDERS SECTION ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800 flex items-center gap-2">
            <FiPackage className="text-[#c89b3c]" /> Assigned Orders
          </h2>
          <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">
            {orders.length} total
          </span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-400 gap-2">
            <FiRefreshCw className="animate-spin" /> Loading orders...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-red-500">⚠️ {error}</div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-stone-400 gap-3">
            <FiTruck className="text-4xl text-stone-300" />
            <p className="font-medium">No orders assigned yet</p>
            <p className="text-xs text-stone-400">Your assigned deliveries will appear here</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {["Order ID", "Customer", "Address", "Items", "Total", "Date", "Status", "Update", "View"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {orders.map((order) => (
                    <tr key={order._id} className="hover:bg-stone-50 transition-colors">

                      <td className="px-5 py-4 font-mono text-xs text-stone-500">
                        #{order._id?.slice(-6).toUpperCase()}
                      </td>

                      {/* ✅ Fixed: show correct unique customer name */}
                      <td className="px-5 py-4">
                        <p className="font-medium text-stone-800">{getCustomerName(order)}</p>
                        <p className="text-xs text-stone-400">{getCustomerPhone(order) || ""}</p>
                      </td>

                      <td className="px-5 py-4">
                        <div className="flex items-start gap-1 text-stone-600 max-w-[180px]">
                          <FiMapPin className="text-[#c89b3c] mt-0.5 flex-shrink-0" />
                          <span className="text-xs leading-snug line-clamp-2">
                            {[
                              order.deliveryAddress?.house,
                              order.deliveryAddress?.street,
                              order.deliveryAddress?.area,
                              order.deliveryAddress?.city,
                            ].filter(Boolean).join(", ") || "—"}
                          </span>
                        </div>
                      </td>

                      <td className="px-5 py-4 text-stone-600">{order.items?.length || 0} items</td>

                      <td className="px-5 py-4 font-semibold text-stone-800">₹{order.totalPrice || 0}</td>

                      <td className="px-5 py-4 text-xs text-stone-500">{formatDate(order.createdAt)}</td>

                      <td className="px-5 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[order.deliveryStatus] || "bg-stone-100 text-stone-600"}`}>
                          {STATUS_LABEL[order.deliveryStatus] || "Assigned"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <div className="relative">
                          <select
                            value={order.deliveryStatus || "assigned"}
                            onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            disabled={updating === order._id || order.deliveryStatus === "delivered" || order.deliveryStatus === "cancelled"}
                            className="appearance-none pl-3 pr-8 py-2 rounded-xl border border-stone-200 text-xs font-medium text-stone-700 bg-white focus:outline-none focus:border-[#c89b3c] transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            {STATUS_OPTIONS.map((s) => (
                              <option key={s} value={s}>{STATUS_LABEL[s]}</option>
                            ))}
                          </select>
                          <FiChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none text-xs" />
                        </div>
                      </td>

                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="flex items-center gap-1.5 px-3 py-2 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-xs font-semibold transition-all"
                        >
                          <FiEye /> View
                        </button>
                      </td>

                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-stone-100">
              {orders.map((order) => (
                <div key={order._id} className="p-4 space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      {/* ✅ Fixed customer name */}
                      <p className="font-semibold text-stone-800">{getCustomerName(order)}</p>
                      <p className="font-mono text-xs text-stone-400">#{order._id?.slice(-6).toUpperCase()}</p>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${STATUS_STYLE[order.deliveryStatus] || "bg-stone-100 text-stone-600"}`}>
                      {STATUS_LABEL[order.deliveryStatus] || "Assigned"}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 text-stone-600 text-xs">
                    <FiMapPin className="text-[#c89b3c] mt-0.5 flex-shrink-0" />
                    {[order.deliveryAddress?.house, order.deliveryAddress?.street, order.deliveryAddress?.city].filter(Boolean).join(", ") || "No address"}
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-500">{order.items?.length || 0} items · ₹{order.totalPrice || 0}</span>
                    <span className="text-xs text-stone-400">{formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <select
                        value={order.deliveryStatus || "assigned"}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updating === order._id || order.deliveryStatus === "delivered" || order.deliveryStatus === "cancelled"}
                        className="w-full appearance-none pl-3 pr-8 py-2.5 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 bg-stone-50 focus:outline-none focus:border-[#c89b3c] transition cursor-pointer disabled:opacity-40"
                      >
                        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                      </select>
                      <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                    </div>
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="flex items-center gap-1.5 px-4 py-2.5 bg-stone-800 hover:bg-stone-900 text-white rounded-xl text-sm font-semibold transition-all flex-shrink-0"
                    >
                      <FiEye /> View
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="px-5 py-3 border-t border-stone-100 bg-stone-50 text-xs text-stone-400">
              Showing {orders.length} assigned order{orders.length !== 1 ? "s" : ""}
            </div>
          </>
        )}
      </div>

      {/* ── STATUS GUIDE ── */}
      <div className="mt-8 bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
        <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
          <FiClock className="text-[#c89b3c]" /> Status Guide
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {STATUS_OPTIONS.map((s) => (
            <div key={s} className={`px-3 py-2.5 rounded-xl text-xs font-semibold text-center ${STATUS_STYLE[s]}`}>
              {STATUS_LABEL[s]}
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-400 mt-3">Use the dropdown in each order row to update the delivery status in real time.</p>
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
              <button onClick={() => setSelectedOrder(null)} className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition">
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">

              {/* ✅ Customer — with Call + Maps buttons */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4">
                <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mb-2">Customer</p>
                <p className="font-bold text-stone-800 text-sm">
                  👤 {getCustomerName(selectedOrder)}
                </p>
                <p className="text-xs text-stone-500 mt-1">📧 {selectedOrder.user?.email || "—"}</p>
                <p className="text-xs text-green-600 font-semibold mt-1">
                  📞 {getCustomerPhone(selectedOrder) || "—"}
                </p>

                {/* ✅ Action buttons: Call + Open in Maps */}
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => callCustomer(getCustomerPhone(selectedOrder))}
                    className="flex items-center gap-1.5 px-3 py-2 bg-green-500 hover:bg-green-600 text-white rounded-xl text-xs font-semibold transition-all flex-1 justify-center"
                  >
                    <FiPhone /> Call Customer
                  </button>
                  <button
                    onClick={() => openInMaps(selectedOrder.deliveryAddress)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-xs font-semibold transition-all flex-1 justify-center"
                  >
                    <FiNavigation /> Open in Maps
                  </button>
                </div>
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

              {/* Payment */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-1">Payment</p>
                  <p className="text-sm font-bold text-stone-700 capitalize">{selectedOrder.paymentMethod || "—"}</p>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full capitalize
                  ${selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                  {selectedOrder.paymentStatus || "—"}
                </span>
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

              {/* ✅ Show cancel reason if cancelled */}
              {selectedOrder.deliveryStatus === "cancelled" && selectedOrder.cancelReason && (
                <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 text-sm">
                  <p className="text-[10px] font-semibold text-red-400 uppercase tracking-widest mb-1">Cancellation Reason</p>
                  <p className="text-stone-700 font-medium">{selectedOrder.cancelReason}</p>
                  <p className="text-xs text-stone-400 mt-1">This reason was sent to the customer.</p>
                </div>
              )}

              {/* Status update — disabled if delivered/cancelled */}
              {selectedOrder.deliveryStatus !== "delivered" && selectedOrder.deliveryStatus !== "cancelled" && (
                <div>
                  <p className="text-xs text-stone-400 font-semibold uppercase tracking-widest mb-2">Update Status</p>
                  <div className="relative">
                    <select
                      value={selectedOrder.deliveryStatus || "assigned"}
                      onChange={(e) => handleStatusChange(selectedOrder._id, e.target.value)}
                      disabled={updating === selectedOrder._id}
                      className="w-full appearance-none pl-4 pr-8 py-3 rounded-xl border border-stone-200 text-sm font-medium text-stone-700 bg-stone-50 focus:outline-none focus:border-[#c89b3c] transition cursor-pointer disabled:opacity-50"
                    >
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}
                    </select>
                    <FiChevronDown className="absolute right-3 bottom-3.5 text-stone-400 pointer-events-none" />
                  </div>
                </div>
              )}

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold text-sm tracking-wide transition-all"
              >
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
              <AlertTriangle size={22} className="text-red-500" />
            </div>

            <h2 className="text-lg font-bold text-stone-800 text-center mb-1">Cancel Order</h2>
            <p className="text-sm text-stone-400 text-center mb-1">
              Please provide a reason for cancellation.
            </p>
            {/* ✅ Clearly tell delivery boy this goes to customer */}
            <p className="text-xs text-red-400 text-center font-medium mb-5">
              ⚠️ This reason will be sent to the customer.
            </p>

            <textarea
              className="w-full border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm text-stone-800 placeholder:text-stone-300 resize-none focus:outline-none focus:ring-2 focus:ring-red-300 focus:border-red-400 transition-all mb-4"
              rows={3}
              placeholder="e.g. Address not found, Customer not reachable..."
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
            />

            <div className="flex gap-3">
              <button
                onClick={() => { setCancelOrderId(null); setCancelReason(""); }}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-500 text-sm font-semibold hover:bg-stone-100 transition-all"
              >
                Go Back
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelling || !cancelReason.trim()}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-red-200 transition-all disabled:opacity-50"
              >
                {cancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}