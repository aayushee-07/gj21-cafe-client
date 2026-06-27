import React, { useState } from "react";
import api from "../lib/apiClient";
import { X } from "lucide-react";

export default function RecentOrders({ orders, fetchOrders }) {

  const [selectedOrder, setSelectedOrder] = useState(null);
  const [filter, setFilter] = useState("all");
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOrderId, setCancelOrderId] = useState(null);

  const updateStatus = async (id, status) => {
    if (status === "cancelled") {
      setCancelOrderId(id);
      return;
    }
    await api.put(`/admin/orders/${id}/status`, { status });
    fetchOrders();
  };

  const filteredOrders = (
    filter === "all" ? orders : orders.filter(o => o.status === filter)
  ).slice(0, 5);

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":        return "bg-yellow-100 text-yellow-700";
      case "confirmed":      return "bg-blue-100 text-blue-700";
      case "preparing":      return "bg-purple-100 text-purple-700";
      case "out_for_delivery": return "bg-orange-100 text-orange-700";
      case "delivered":      return "bg-green-100 text-green-700";
      case "cancelled":      return "bg-red-100 text-red-500";
      default:               return "bg-stone-100 text-stone-500";
    }
  };

  return (
    <div>

      {/* ── FILTER ── */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        {["all","pending","confirmed","preparing","out_for_delivery","delivered","cancelled"].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold capitalize transition-all duration-150
              ${filter === s
                ? "bg-[#c89b3c] text-white shadow-sm shadow-amber-200"
                : "bg-stone-100 text-stone-500 hover:bg-stone-200"
              }`}
          >
            {s.replaceAll("_", " ")}
          </button>
        ))}
      </div>

      {/* ── TABLE ── */}
      {filteredOrders.length === 0 ? (
        <div className="text-center py-10 text-stone-400 text-sm">
          No orders found
        </div>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-stone-100">
          <table className="w-full text-sm text-left">

            <thead>
              <tr className="bg-stone-50 border-b border-stone-100">
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest">Order</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest">Customer</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest">Total</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest">Update</th>
                <th className="px-4 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest">View</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-50">
              {filteredOrders.map((order) => (
                <tr key={order._id} className="hover:bg-stone-50 transition-colors duration-100">

                  <td className="px-4 py-3 font-mono text-xs font-bold text-stone-600">
                    #{order._id.slice(-6)}
                  </td>

                  <td className="px-4 py-3 text-stone-700 font-medium text-sm">
                    {order.deliveryAddress?.fullName}
                  </td>

                  <td className="px-4 py-3 font-bold text-stone-800">
                    ₹{order.totalPrice}
                  </td>

                  <td className="px-4 py-3">
                    <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize
                      ${getStatusStyle(order.status)}`}>
                      {order.status.replaceAll("_", " ")}
                    </span>
                  </td>

                  <td className="px-4 py-3">
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
                      <option value="out_for_delivery">Out for Delivery</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancel Order</option>
                    </select>
                  </td>

                  <td className="px-4 py-3">
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
              ))}
            </tbody>

          </table>
        </div>
      )}

      {/* ── ORDER DETAIL MODAL ── */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center
        items-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl
          w-full max-w-lg max-h-[90vh] overflow-y-auto">

            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <p className="text-xs text-stone-400 font-medium">Order Details</p>
                <p className="font-bold text-stone-800">
                  #{selectedOrder._id.slice(-6)}
                </p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200
                flex items-center justify-center text-stone-500 transition-all"
              >
                <X size={15} />
              </button>
            </div>

            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Customer info */}
              <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4">
                <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mb-2">
                  Customer
                </p>
                <p className="font-bold text-stone-800 text-sm">
                  👤 {selectedOrder.deliveryAddress?.fullName}
                </p>
                <p className="text-xs text-stone-500 mt-1">
                  📧 {selectedOrder.user?.email}
                </p>
                <p className="text-xs text-green-600 font-semibold mt-1">
                  📞 {selectedOrder.deliveryAddress?.phone}
                </p>
              </div>

              {/* Delivery address */}
              <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">
                  📍 Delivery Address
                </p>
                <p className="text-sm text-stone-600 leading-relaxed">
                  {[
                    selectedOrder.deliveryAddress?.house,
                    selectedOrder.deliveryAddress?.street,
                    selectedOrder.deliveryAddress?.area,
                    selectedOrder.deliveryAddress?.city,
                    selectedOrder.deliveryAddress?.pincode,
                    selectedOrder.deliveryAddress?.landmark,
                  ].filter(Boolean).join(", ")}
                </p>
              </div>

              {/* Payment info */}
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3
              flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-1">
                    Payment
                  </p>
                  <p className="text-sm font-bold text-stone-700">
                    {selectedOrder.paymentMethod}
                  </p>
                </div>
                <span className={`text-[11px] font-bold px-3 py-1 rounded-full
                  ${selectedOrder.paymentStatus === "paid"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-500"}`}>
                  {selectedOrder.paymentStatus}
                </span>
              </div>

              {/* Items */}
              <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-3">
                  🧾 Items Ordered
                </p>
                <div className="flex flex-col gap-2">
                  {selectedOrder.items.map((item, i) => (
                    <div key={i} className="flex justify-between items-center text-sm">
                      <span className="text-stone-600">{item.menuItem?.name}</span>
                      <span className="bg-stone-200 text-stone-600 text-xs font-semibold
                      px-2 py-0.5 rounded-full">
                        × {item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill */}
              <div className="flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span><span>₹{selectedOrder.subtotal}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery</span><span>₹{selectedOrder.deliveryFee}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount</span><span>− ₹{selectedOrder.discount}</span>
                  </div>
                )}
                <hr className="border-dashed border-stone-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-700">Final Total</span>
                  <span className="text-green-600 font-bold text-lg">
                    ₹{selectedOrder.finalTotal || selectedOrder.totalPrice}
                  </span>
                </div>
              </div>

              {/* Est. delivery */}
              <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm">
                <span className="text-stone-500">⏱ Est. Delivery: </span>
                <span className="font-semibold text-stone-700">
                  {new Date(
                    new Date(selectedOrder.createdAt).getTime() + 45 * 60000
                  ).toLocaleString("en-IN")}
                </span>
              </div>

              {/* Close button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="w-full py-3 bg-stone-800 hover:bg-stone-900 text-white
                rounded-xl font-semibold text-sm tracking-wide transition-all duration-150"
              >
                Close
              </button>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}