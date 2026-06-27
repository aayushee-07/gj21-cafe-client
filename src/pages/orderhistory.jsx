import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/apiClient";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const CANCEL_WINDOW_MINUTES = 20;

function getCancelStatus(order) {
  if (order.status !== "pending") return { canCancel: false, minutesLeft: 0, secondsLeft: 0 };
  const elapsed = (Date.now() - new Date(order.createdAt).getTime()) / 1000;
  const windowSec = CANCEL_WINDOW_MINUTES * 60;
  const remaining = windowSec - elapsed;
  if (remaining <= 0) return { canCancel: false, minutesLeft: 0, secondsLeft: 0 };
  return {
    canCancel: true,
    minutesLeft: Math.floor(remaining / 60),
    secondsLeft: Math.floor(remaining % 60),
  };
}

// ✅ FIX: accept addToCart prop from App.jsx
export default function OrderHistory({ addToCart }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reordering, setReordering] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState("");
  const [cancelConfirm, setCancelConfirm] = useState(null);
  const [tick, setTick] = useState(0);
  const navigate = useNavigate();
  const tickRef = useRef(null);

  useEffect(() => {
    tickRef.current = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(tickRef.current);
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get("/orders");
      setOrders(res.data);
    } catch {
      toast.error("Failed to fetch orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const groupedOrders = orders.reduce((acc, order) => {
    const date = new Date(order.createdAt).toDateString();
    if (!acc[date]) acc[date] = [];
    acc[date].push(order);
    return acc;
  }, {});

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";

      case "confirmed":
        return "bg-blue-100 text-blue-700";

      case "preparing":
        return "bg-purple-100 text-purple-700";

      case "assigned":
        return "bg-cyan-100 text-cyan-700";

      case "pickedup":
        return "bg-indigo-100 text-indigo-700";

      case "intransit":
        return "bg-blue-100 text-blue-700";

      case "delivered":
        return "bg-green-100 text-green-700";

      case "cancelled":
        return "bg-red-100 text-red-500";

      default:
        return "bg-stone-100 text-stone-500";
    }
  };

  const handleCancel = async (id) => {
    const order = orders.find((o) => o._id === id);
    if (!order) return;
    const { canCancel } = getCancelStatus(order);
    if (!canCancel) {
      setCancelConfirm(null);
      toast.error("Cancellation window has expired.");
      return;
    }
    try {
      await api.put(`/orders/${id}/cancel`);
      toast.success("Order cancelled successfully.");
      setCancelConfirm(null);
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not cancel order.");
      setCancelConfirm(null);
    }
  };

  const openRatingModal = (id) => { setSelectedOrderId(id); setRatingModal(true); };

  const submitRating = async () => {
    if (!rating) return toast.error("Please select a rating ⭐");
    try {
      await api.put(`/orders/${selectedOrderId}/rate`, { rating, review });
      toast.success("Thanks for your feedback!");
      setRatingModal(false);
      setRating(0);
      setReview("");
      fetchOrders();
    } catch {
      toast.error("Failed to submit rating.");
    }
  };

  // ✅ FIX: use addToCart prop to add each item via API
  // This updates both the backend cart AND the App.jsx state
  // so Cart.jsx shows the items immediately
  const handleReorder = async (order) => {
    if (!addToCart) {
      toast.error("Please login to reorder");
      return;
    }
    if (reordering) return;
    setReordering(true);
    try {
      for (const item of order.items) {
        const menuItem = item.menuItem;
        if (!menuItem?._id) continue;
        // Call addToCart once per quantity
        for (let i = 0; i < item.quantity; i++) {
          await addToCart({
            _id: menuItem._id,
            name: menuItem.name,
            price: menuItem.price,
            image: menuItem.image || "",
            category: menuItem.category || "",
          });
        }
      }
      toast.success("Items added to cart! 🛒");
      navigate("/cart");
    } catch (err) {
      console.error("Reorder error:", err);
      toast.error("Failed to reorder. Please try again.");
    } finally {
      setReordering(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-amber-50">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-[#c89b3c] rounded-full animate-spin" />
        <p className="text-stone-400 text-sm">Loading your orders…</p>
      </div>
    );

  if (!orders.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-amber-50">
        <div className="text-6xl">📭</div>
        <p className="text-stone-500 font-semibold text-lg">No orders yet</p>
        <p className="text-stone-400 text-sm">Your order history will appear here</p>
      </div>
    );

  return (
    <main className="min-h-screen bg-amber-50 py-14">
      <ToastContainer position="top-center" />

      <div className="max-w-3xl mx-auto px-4">

        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-2">
            Your Orders
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
            📜 Order History
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] mx-auto mt-4 rounded-full" />
        </div>

        <div className="flex flex-col gap-10">
          {Object.entries(groupedOrders).map(([date, dayOrders]) => (
            <div key={date}>

              <div className="flex items-center gap-3 mb-4">
                <div className="h-px flex-1 bg-stone-200" />
                <span className="text-xs font-semibold text-stone-400 uppercase tracking-widest whitespace-nowrap">
                  📅 {date}
                </span>
                <div className="h-px flex-1 bg-stone-200" />
              </div>

              <div className="flex flex-col gap-4">
                {dayOrders.map((order) => {
                  const { canCancel, minutesLeft, secondsLeft } = getCancelStatus(order);
                  const cancelReason =
                    order.cancellationReason || order.cancelReason ||
                    order.cancelNote || order.reason || null;

                  const cancelledByAdmin =
                    order.status === "cancelled" && (
                      order.cancelledBy === "admin" ||
                      order.cancelledBy === "Admin" ||
                      order.cancelledByAdmin === true ||
                      (!!cancelReason && order.cancelledBy !== "customer" && order.cancelledBy !== "user")
                    );

                  return (
                    <div key={order._id}
                      className="bg-white rounded-2xl border border-stone-100 shadow-sm
                      hover:shadow-md transition-all duration-200 overflow-hidden">

                      <div className="flex items-center justify-between px-5 py-4 border-b border-stone-100">
                        <div>
                          <p className="font-bold text-stone-800 text-sm tracking-wide">
                            Order #{order._id.slice(-6).toUpperCase()}
                          </p>
                          <p className="text-xs text-stone-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <span
                            className={`px-3 py-1 text-[11px] rounded-full font-bold capitalize ${getStatusColor(
                              order.deliveryStatus === "delivered"
                                ? "delivered"
                                : order.deliveryStatus === "intransit"
                                  ? "intransit"
                                  : order.deliveryStatus === "pickup"
                                    ? "pickedup"
                                    : order.status
                            )}`}
                          >
                            {order.deliveryStatus === "delivered"
                              ? "Delivered"
                              : order.deliveryStatus === "intransit"
                                ? "In Transit"
                                : order.deliveryStatus === "pickup"
                                  ? "Picked Up"
                                  : order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                          </span>
                        </div>
                      </div>

                      <div className="px-5 py-4 flex flex-col gap-4">

                        {order.status === "cancelled" && cancelledByAdmin && (
                          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3.5">
                            <span className="text-lg shrink-0 mt-0.5">🏪</span>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                                Cancelled by Restaurant
                              </p>
                              {cancelReason
                                ? <p className="text-sm text-red-700 font-medium leading-relaxed break-words">"{cancelReason}"</p>
                                : <p className="text-sm text-red-400 italic">No reason provided.</p>
                              }
                            </div>
                          </div>
                        )}

                        {order.status === "cancelled" && !cancelledByAdmin && (
                          <div className="flex items-center gap-2.5 bg-stone-50 border border-stone-200 rounded-xl px-4 py-3">
                            <span className="text-base shrink-0">🚫</span>
                            <div>
                              <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-0.5">You Cancelled</p>
                              <p className="text-xs text-stone-400">This order was cancelled by you.</p>
                            </div>
                          </div>
                        )}

                        <div className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3 flex flex-col gap-1.5">
                          {order.items.map((it) => (
                            <div key={it._id} className="flex justify-between items-center text-sm">
                              <span className="text-stone-600">
                                {it.menuItem?.name}
                                <span className="text-stone-400 ml-1">× {it.quantity}</span>
                              </span>
                              <span className="font-semibold text-stone-700">
                                ₹{it.menuItem?.price * it.quantity}
                              </span>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-col gap-1.5 text-sm">
                          <div className="flex justify-between text-stone-400">
                            <span>Subtotal</span><span>₹{order.subtotal}</span>
                          </div>
                          <div className="flex justify-between text-stone-400">
                            <span>Delivery</span><span>₹{order.deliveryFee}</span>
                          </div>
                          {order.discount > 0 && (
                            <div className="flex justify-between text-green-600 font-medium">
                              <span>Discount</span><span>− ₹{order.discount}</span>
                            </div>
                          )}
                          <div className="flex justify-between font-bold text-stone-800 text-base pt-1 border-t border-dashed border-stone-200">
                            <span>Total</span>
                            <span className="text-green-600">₹{order.finalTotal || order.totalPrice}</span>
                          </div>
                        </div>

                        {order.rating && (
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <span key={s} className={`text-lg ${s <= order.rating ? "text-yellow-400" : "text-stone-200"}`}>★</span>
                            ))}
                            <span className="text-xs text-stone-400 ml-1">Your rating</span>
                          </div>
                        )}

                        {order.status === "pending" && (
                          <div className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-semibold
                            ${canCancel
                              ? "bg-amber-50 border border-amber-100 text-amber-700"
                              : "bg-red-50 border border-red-100 text-red-500"}`}>
                            {canCancel ? (
                              <><span>⏱</span><span>Cancel window closes in <span className="font-black tabular-nums">{minutesLeft}:{String(secondsLeft).padStart(2, "0")}</span></span></>
                            ) : (
                              <><span>🔒</span><span>Cancellation window expired</span></>
                            )}
                          </div>
                        )}

                        <div className="flex flex-wrap gap-2 justify-end pt-1">

                          {order.status === "pending" && canCancel && (
                            <button onClick={() => setCancelConfirm(order._id)}
                              className="px-4 py-1.5 text-xs font-semibold rounded-xl border border-red-200
                              text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500 transition-all duration-150">
                              Cancel
                            </button>
                          )}

                          {(order.deliveryStatus === "delivered" || order.status === "delivered") &&
                            !order.rating && (
                              <button onClick={() => openRatingModal(order._id)}
                                className="px-4 py-1.5 text-xs font-semibold rounded-xl
                              bg-yellow-50 text-yellow-600 border border-yellow-200
                              hover:bg-yellow-500 hover:text-white hover:border-yellow-500 transition-all duration-150">
                                ⭐ Rate
                              </button>
                            )}

                          {/* ✅ FIX: reorder now calls addToCart API, not localStorage */}
                          <button
                            onClick={() => handleReorder(order)}
                            disabled={reordering}
                            className="px-4 py-1.5 text-xs font-semibold rounded-xl
                            bg-[#c89b3c] hover:bg-[#b88a2f] text-white
                            shadow-sm shadow-amber-200 transition-all duration-150
                            disabled:opacity-50 disabled:cursor-not-allowed">
                            {reordering ? "Adding…" : "🔁 Reorder"}
                          </button>

                          {order.status !== "cancelled" && (
                            <button onClick={() => navigate(`/track-order/${order._id}`)}
                              className="px-4 py-1.5 text-xs font-semibold rounded-xl
                              bg-green-600 hover:bg-green-700 text-white
                              shadow-sm shadow-green-200 transition-all duration-150">
                              🚚 Track
                            </button>
                          )}

                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* CANCEL MODAL */}
      {cancelConfirm && (() => {
        const order = orders.find((o) => o._id === cancelConfirm);
        const { canCancel, minutesLeft, secondsLeft } = order ? getCancelStatus(order) : {};
        return (
          <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
            <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-sm p-7">
              <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🚫</span>
              </div>
              <h2 className="text-lg font-bold text-stone-800 text-center mb-1">Cancel Order?</h2>
              <p className="text-sm text-stone-400 text-center mb-5 leading-relaxed">
                This action cannot be undone.
              </p>
              {canCancel ? (
                <div className="flex items-center justify-center gap-1.5 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 mb-5 text-xs font-semibold text-amber-700">
                  <span>⏱</span>
                  <span>Time remaining: <span className="font-black tabular-nums">{minutesLeft}:{String(secondsLeft).padStart(2, "0")}</span></span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1.5 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-5 text-xs font-semibold text-red-500">
                  <span>🔒</span><span>Cancellation window has just expired.</span>
                </div>
              )}
              <div className="flex gap-3">
                <button onClick={() => setCancelConfirm(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-500 text-sm font-semibold hover:bg-stone-100 transition-all">
                  Keep Order
                </button>
                <button onClick={() => handleCancel(cancelConfirm)} disabled={!canCancel}
                  className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600
                  disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed
                  text-white text-sm font-semibold shadow-md shadow-red-200 transition-all">
                  Yes, Cancel
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* RATING MODAL */}
      {ratingModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-sm p-7">
            <h2 className="text-lg font-bold text-stone-800 text-center mb-1">Rate Your Order</h2>
            <p className="text-xs text-stone-400 text-center mb-6">How was your experience?</p>
            <div className="flex justify-center gap-2 mb-5">
              {[1, 2, 3, 4, 5].map((s) => (
                <span key={s} onClick={() => setRating(s)}
                  className={`text-4xl cursor-pointer transition-all hover:scale-110 ${s <= rating ? "text-yellow-400" : "text-stone-200"}`}>
                  ★
                </span>
              ))}
            </div>
            <textarea
              placeholder="Share your experience (optional)..."
              value={review}
              onChange={(e) => setReview(e.target.value)}
              rows={3}
              className="w-full border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl
              text-sm text-stone-700 placeholder:text-stone-300 resize-none
              focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
              transition-all mb-4"
            />
            <div className="flex gap-3">
              <button onClick={() => { setRatingModal(false); setRating(0); setReview(""); }}
                className="flex-1 py-2.5 rounded-xl border border-stone-200 text-stone-500 text-sm font-semibold hover:bg-stone-100 transition-all">
                Cancel
              </button>
              <button onClick={submitRating}
                className="flex-1 py-2.5 rounded-xl bg-green-600 hover:bg-green-700
                text-white text-sm font-semibold shadow-md shadow-green-200 transition-all">
                Submit ✓
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}