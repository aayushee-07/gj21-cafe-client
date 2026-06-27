import React, { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminOrders() {

  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("all");
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [selectedDeliveryBoy, setSelectedDeliveryBoy] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  // ✅ FIX 1: depend on BOTH page AND filter
  useEffect(() => {
    fetchOrders();
    fetchDeliveryBoys();
  }, [page, filter]);

  // ✅ FIX 2: send status to backend so ALL pending orders come back paginated
  const fetchOrders = async () => {
    try {
      const statusParam = filter !== "all" ? `&status=${filter}` : "";
      const res = await api.get(`/admin/orders?page=${page}&limit=10${statusParam}`);
      setOrders(res.data.orders || []);
      setTotalPages(res.data.totalPages || 1);
    } catch (err) {
      console.error("fetchOrders error:", err);
    }
  };
  const fetchDeliveryBoys = async () => {
    try {
      const res = await api.get("/admin/delivery-boy");

      setDeliveryBoys(
        res.data.filter((boy) => boy.isActive)
      );

    } catch (err) {
      console.error("Failed to fetch delivery boys", err);
    }
  };

  // ✅ FIX 3: reset to page 1 when filter changes
  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setPage(1);
  };

  const updateStatus = async (id, status) => {
    if (status === "cancelled") {
      setCancelOrderId(id);
      return;
    }
    try {
      await api.put(`/admin/orders/${id}/status`, { status });
      fetchOrders();
    } catch (err) {
      console.error("updateStatus error:", err);
    }
  };

  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "preparing":
        return "bg-purple-100 text-purple-700";

      case "assigned":
        return "bg-cyan-100 text-cyan-700";

      case "pickup":
      case "pickedup":
        return "bg-indigo-100 text-indigo-700";

      case "intransit":
        return "bg-orange-100 text-orange-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-700";

      default:
        return "bg-stone-100 text-stone-500";
    }
  };
  const statusFilters = [
    "all",
    "pending",
    "confirmed",
    "preparing",
    "assigned",
    "cancelled"
  ]
  const assignDeliveryBoy = async (orderId, deliveryBoyId) => {
    try {
      await api.put(
        `/admin/orders/${orderId}/assign`,
        { deliveryBoyId }
      );

      fetchOrders();
    } catch (err) {
      console.error("Assign error:", err);
    }
  };
  return (
    <div className="min-h-screen">

      {/* ── HEADING ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
          📦 Orders
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Manage, update and assign delivery partners to orders
        </p>
      </div>

      {/* ── FILTER PILLS ── */}
      <div className="flex flex-wrap gap-2 mb-6">
        {statusFilters.map((s) => (
          <button
            key={s}
            // ✅ FIX 3: use handleFilterChange not setFilter directly
            onClick={() => handleFilterChange(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-150
              ${filter === s
                ? "bg-[#c89b3c] text-white shadow-sm shadow-amber-200"
                : "bg-white border border-stone-200 text-stone-500 hover:border-[#c89b3c] hover:text-[#c89b3c]"
              }`}
          >
            {s.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <p className="text-sm font-bold text-stone-700">
            {filter === "all"
              ? "All Orders"
              : <span className="capitalize">{filter.replaceAll("_", " ")} Orders</span>
            }
            {/* ✅ shows count of current page results */}
            <span className="ml-2 bg-stone-100 text-stone-500 text-xs font-semibold px-2 py-0.5 rounded-full">
              {orders.length}
            </span>
          </p>
          <p className="text-xs text-stone-400">Page {page} of {totalPages}</p>
        </div>

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
                    No {filter !== "all" ? filter.replaceAll("_", " ") : ""} orders found.
                  </td>
                </tr>
              ) : (
                // ✅ FIX: use `orders` directly — no client-side filter needed
                // backend already returns only the filtered orders
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

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize ${getStatusStyle(order.status)}`}>
                        {order.status.replaceAll("_", " ")}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <span
                        className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize
    ${getStatusStyle(order.deliveryStatus || "assigned")}`}
                      >
                        {(order.deliveryStatus || "assigned").replaceAll("_", " ")}
                      </span>
                    </td>

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
                      <div className="flex flex-col gap-2">

                        <span className="text-xs font-medium text-stone-700">
                          {order.assignedDeliveryBoy?.name || "Not Assigned"}
                        </span>

                        <select
                          value={order.assignedDeliveryBoy?._id || ""}
                          onChange={(e) =>
                            assignDeliveryBoy(order._id, e.target.value)
                          }
                          className="border border-stone-200 bg-white text-stone-700 text-xs px-2 py-1.5 rounded-lg"
                        >
                          <option value="">Select</option>

                          {deliveryBoys
                            .filter((boy) => boy.isActive)
                            .map((boy) => (
                              <option key={boy._id} value={boy._id}>
                                {boy.name}
                              </option>
                            ))}
                        </select>

                      </div>
                    </td>

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

        {/* ── PAGINATION ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
          <p className="text-xs text-stone-400">
            Showing page{" "}
            <span className="font-semibold text-stone-600">{page}</span> of{" "}
            <span className="font-semibold text-stone-600">{totalPages}</span>
          </p>
          <div className="flex items-center gap-2">

            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200
              bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-40
              disabled:cursor-not-allowed transition-all"
            >
              <ChevronLeft size={15} />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150
                  ${page === p
                    ? "bg-[#c89b3c] text-white shadow-sm"
                    : "border border-stone-200 bg-white text-stone-500 hover:bg-stone-100"
                  }`}
              >
                {p}
              </button>
            ))}

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200
              bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-40
              disabled:cursor-not-allowed transition-all"
            >
              <ChevronRight size={15} />
            </button>

          </div>
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
              <button
                onClick={async () => {
                  try {
                    await api.put(`/admin/orders/${cancelOrderId}/cancel`, { reason: cancelReason });
                    setCancelOrderId(null);
                    setCancelReason("");
                    fetchOrders();
                  } catch (err) {
                    console.error("cancel error:", err);
                    alert(err.response?.data?.message || "Failed to cancel order.");
                  }
                }}
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