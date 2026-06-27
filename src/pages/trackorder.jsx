import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/apiClient";


const STATUS_STEPS = [
  "pending",
  "confirmed",
  "preparing",
  "assigned",
  "pickup",
  "intransit",
  "delivered",
];

const STEP_META = {
  pending: {
    icon: "📝",
    label: "Order Placed",
    color: "bg-yellow-400",
    ring: "ring-yellow-200",
    text: "text-yellow-600",
  },

  confirmed: {
    icon: "✅",
    label: "Confirmed",
    color: "bg-blue-500",
    ring: "ring-blue-200",
    text: "text-blue-600",
  },

  preparing: {
    icon: "👨‍🍳",
    label: "Preparing",
    color: "bg-purple-500",
    ring: "ring-purple-200",
    text: "text-purple-600",
  },

  assigned: {
    icon: "👨‍💼",
    label: "Assigned",
    color: "bg-cyan-500",
    ring: "ring-cyan-200",
    text: "text-cyan-600",
  },

  pickup: {
    icon: "📦",
    label: "Picked Up",
    color: "bg-indigo-500",
    ring: "ring-indigo-200",
    text: "text-indigo-600",
  },

  intransit: {
    icon: "🛵",
    label: "In Transit",
    color: "bg-orange-500",
    ring: "ring-orange-200",
    text: "text-orange-600",
  },

  delivered: {
    icon: "🎉",
    label: "Delivered",
    color: "bg-green-500",
    ring: "ring-green-200",
    text: "text-green-600",
  },
};

const STATUS_MSG = {
  pending: {
    title: "Order Received!",
    sub: "We got your order and will confirm it shortly.",
  },

  confirmed: {
    title: "Order Confirmed!",
    sub: "Your order has been confirmed and is queued for preparation.",
  },

  preparing: {
    title: "Preparing Your Food 👨‍🍳",
    sub: "Our chefs are preparing your order with care.",
  },

  assigned: {
    title: "Delivery Partner Assigned 🛵",
    sub: "A delivery partner has been assigned to your order.",
  },

  pickup: {
    title: "Order Picked Up 📦",
    sub: "Your delivery partner has picked up your order.",
  },

  intransit: {
    title: "On The Way 🚚",
    sub: "Your order is on the way and will arrive soon.",
  },

  delivered: {
    title: "Delivered Successfully 🎉",
    sub: "Enjoy your meal and don't forget to rate your order.",
  },

  cancelled: {
    title: "Order Cancelled",
    sub: "This order has been cancelled.",
  },
};

export default function TrackOrder() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastTick, setLastTick] = useState(new Date());
  const intervalRef = useRef(null);

  const fetchOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data);
      setLastTick(new Date());
    } catch (err) {
      console.error("Track error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    intervalRef.current = setInterval(fetchOrder, 5000);
    return () => clearInterval(intervalRef.current);
  }, [id]);

  // ── LOADING ──
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-amber-50">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-[#c89b3c] rounded-full animate-spin" />
        <p className="text-stone-400 text-sm">Loading order details…</p>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-amber-50">
        <div className="text-5xl">❌</div>
        <p className="text-stone-500 font-semibold">Order not found</p>
        <button
          onClick={() => navigate("/orders")}
          className="px-5 py-2 bg-[#c89b3c] text-white rounded-xl text-sm font-semibold"
        >
          Back to Orders
        </button>
      </div>
    );

  // ── DERIVED STATE ──
  const isCancelled = order.status === "cancelled";
  const isDelivered = order.status === "delivered";
  const trackingStatus =
    order.deliveryStatus === "delivered"
      ? "delivered"
      : order.deliveryStatus === "intransit"
        ? "intransit"
        : order.deliveryStatus === "pickup"
          ? "pickup"
          : order.status;

  const currentStep = isCancelled
    ? -1
    : STATUS_STEPS.indexOf(trackingStatus);
  const progressPct = currentStep <= 0 ? 0 : (currentStep / (STATUS_STEPS.length - 1)) * 100;

  // Admin cancel detection
  const cancelReason =
    order.cancellationReason ||
    order.cancelReason ||
    order.cancelNote ||
    order.reason ||
    null;
  const cancelledByAdmin =
    isCancelled && (
      order.cancelledBy === "admin" ||
      order.cancelledBy === "Admin" ||
      order.cancelledByAdmin === true ||
      (!!cancelReason && order.cancelledBy !== "customer" && order.cancelledBy !== "user")
    );

  // Delivery partner info
  const partner = order.assignedDeliveryBoy || order.deliveryBoy || order.deliveryPartner || null;

  // Status meta for display
  const meta =
    isCancelled
      ? {
        icon: "🚫",
        label: "Cancelled",
        color: "bg-red-400",
        ring: "ring-red-200",
        text: "text-red-500",
      }
      : STEP_META[trackingStatus] || STEP_META.pending;

  const msg = STATUS_MSG[trackingStatus] || STATUS_MSG.pending;

  return (
    <main className="min-h-screen bg-amber-50 py-14 px-4">
      <div className="max-w-2xl mx-auto">

        {/* ── PAGE HEADING ── */}
        <div className="text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-2">
            Live Updates
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
            🚚 Track Your Order
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] mx-auto mt-4 rounded-full" />
        </div>

        <div className="bg-white rounded-3xl border border-stone-100 shadow-lg overflow-hidden">

          {/* ── ORDER META BANNER ── */}
          <div className="bg-gradient-to-br from-stone-50 to-amber-50 border-b border-stone-100 px-6 py-5
          flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">

            <div>
              <p className="text-xs text-stone-400 font-medium mb-1">Order ID</p>
              <p className="text-stone-800 font-bold tracking-wide font-mono">
                #{order._id.slice(-6).toUpperCase()}
              </p>
            </div>

            <div className="text-left sm:text-center">
              <p className="text-xs text-stone-400 font-medium mb-1">Status</p>
              <span className={`inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1 rounded-full capitalize ${meta.color}`}>
                <span>{meta.icon}</span>
                <span>{order.status.replaceAll("_", " ")}</span>
              </span>
            </div>
            <div className="text-left sm:text-center">
              <p className="text-xs text-stone-400 font-medium mb-1">
                Delivery Status
              </p>

              <span
                className="inline-flex items-center gap-1.5 text-white text-xs font-bold px-3 py-1 rounded-full bg-indigo-500 capitalize"
              >
                {(order.deliveryStatus || "not assigned").replaceAll("_", " ")}
              </span>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-xs text-stone-400 font-medium mb-1">⏱ Est. Delivery</p>
              <p className="text-[#c89b3c] font-bold text-sm">
                {order.estimatedDeliveryTime
                  ? new Date(order.estimatedDeliveryTime).toLocaleTimeString("en-IN", {
                    hour: "2-digit", minute: "2-digit",
                  })
                  : isDelivered ? "Delivered ✓" : "30–40 mins"}
              </p>
            </div>
          </div>

          <div className="px-6 py-7 flex flex-col gap-6">

            {/* ── CANCELLED STATE ── */}
            {isCancelled ? (
              <div className="flex flex-col items-center gap-4 py-4">

                <div className="w-16 h-16 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center text-3xl">
                  🚫
                </div>

                {cancelledByAdmin ? (
                  <div className="w-full bg-red-50 border border-red-200 rounded-2xl px-5 py-4 text-center">
                    <p className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-1">
                      🏪 Cancelled by Restaurant
                    </p>
                    {cancelReason ? (
                      <p className="text-sm text-red-700 font-medium leading-relaxed">
                        "{cancelReason}"
                      </p>
                    ) : (
                      <p className="text-sm text-red-400 italic">No reason provided.</p>
                    )}
                  </div>
                ) : (
                  <div className="w-full bg-stone-50 border border-stone-200 rounded-2xl px-5 py-4 text-center">
                    <p className="text-sm font-semibold text-stone-600">You cancelled this order.</p>
                  </div>
                )}

                <button
                  onClick={() => navigate("/orders")}
                  className="px-6 py-2.5 bg-[#c89b3c] hover:bg-[#b88a2f] text-white
                  rounded-xl text-sm font-semibold transition-all"
                >
                  Back to Orders
                </button>
              </div>

            ) : (
              <>
                {/* ── PROGRESS TRACKER ── */}
                <div className="relative flex justify-between items-start">

                  {/* BG line */}
                  <div className="absolute top-5 left-0 w-full h-1 bg-stone-100 z-0 rounded-full" />

                  {/* Progress fill */}
                  <div
                    className="absolute top-5 left-0 h-1 bg-green-400 z-0 rounded-full transition-all duration-700"
                    style={{ width: `${progressPct}%` }}
                  />

                  {STATUS_STEPS.map((step, index) => {
                    const m = STEP_META[step];
                    const isDone = index < currentStep;
                    const isNow = index === currentStep;
                    return (
                      <div key={step} className="relative z-10 flex flex-col items-center flex-1 gap-2">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg
                          shadow-sm transition-all duration-300 border-2
                          ${isDone
                            ? "bg-green-500 border-green-400 text-white"
                            : isNow
                              ? `${m.color} border-transparent text-white scale-110 shadow-md ring-4 ${m.ring}`
                              : "bg-white border-stone-200 text-stone-300"
                          }`}
                        >
                          {isDone ? "✓" : m.icon}
                        </div>
                        <p className={`text-[10px] md:text-xs font-semibold capitalize text-center leading-tight transition-all
                          ${isDone ? "text-green-600" : isNow ? "text-stone-800" : "text-stone-300"}`}
                        >
                          {m.label}
                        </p>
                      </div>
                    );
                  })}
                </div>

                {/* ── STATUS MESSAGE ── */}
                <div className={`flex items-start gap-3 rounded-2xl px-5 py-4 border
                  ${isDelivered
                    ? "bg-green-50 border-green-100"
                    : "bg-amber-50 border-amber-100"
                  }`}>
                  <span className="text-2xl shrink-0">{meta.icon}</span>
                  <div>
                    <p className="font-bold text-stone-800 text-sm mb-0.5">{msg.title}</p>
                    <p className="text-xs text-stone-500 leading-relaxed">{msg.sub}</p>
                  </div>
                </div>

                {/* ── DELIVERY PARTNER CARD ── */}
                {partner && (
                  <div className="bg-indigo-50 border border-indigo-100 rounded-2xl px-5 py-4">
                    <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mb-3">
                      🛵 Your Delivery Partner
                    </p>
                    <div className="flex items-center gap-4">
                      {/* Avatar */}
                      <div className="w-12 h-12 rounded-xl bg-indigo-100 border border-indigo-200
                      flex items-center justify-center text-xl font-black text-indigo-500 shrink-0">
                        {(partner.name || "D")[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-stone-800 text-sm">{partner.name || "Partner"}</p>
                        {(partner.phone || partner.mobile) && (
                          <a
                            href={`tel:${partner.phone || partner.mobile}`}
                            className="inline-flex items-center gap-1.5 mt-1 text-xs font-semibold
                            text-indigo-600 hover:text-indigo-800 transition-colors"
                          >
                            📞 {partner.phone || partner.mobile}
                          </a>
                        )}
                      </div>
                      {/* Call button */}
                      {(partner.phone || partner.mobile) && (
                        <a
                          href={`tel:${partner.phone || partner.mobile}`}
                          className="w-10 h-10 rounded-xl bg-indigo-500 hover:bg-indigo-600
                          flex items-center justify-center text-white text-lg transition-all shrink-0"
                          title="Call delivery partner"
                        >
                          📲
                        </a>
                      )}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── ORDER ITEMS ── */}
            <div className="bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                🧾 Order Items
              </h3>
              <div className="flex flex-col gap-2">
                {order.items.map((item, i) => (
                  <div key={item._id || i} className="flex justify-between items-center text-sm">
                    <span className="text-stone-600">
                      {item.menuItem?.name || item.name || `Item ${i + 1}`}
                      <span className="text-stone-400 ml-1">× {item.quantity}</span>
                    </span>
                    <span className="font-semibold text-stone-800">
                      ₹{(item.menuItem?.price || item.price || 0) * item.quantity}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* ── BILL DETAILS ── */}
            <div className="bg-stone-50 border border-stone-100 rounded-2xl px-5 py-4">
              <h3 className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
                💰 Bill Details
              </h3>
              <div className="flex flex-col gap-2.5 text-sm">
                <div className="flex justify-between text-stone-500">
                  <span>Subtotal</span>
                  <span>₹{order.subtotal || 0}</span>
                </div>
                <div className="flex justify-between text-stone-500">
                  <span>Delivery Fee</span>
                  <span>₹{order.deliveryFee || 0}</span>
                </div>
                {order.discount > 0 && (
                  <div className="flex justify-between text-green-600 font-medium">
                    <span>Discount {order.couponCode && `(${order.couponCode})`}</span>
                    <span>− ₹{order.discount}</span>
                  </div>
                )}
                <hr className="border-dashed border-stone-200 my-1" />
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-stone-700">Total Paid</span>
                  <span className="text-green-600 font-bold text-lg">
                    ₹{order.finalTotal || order.totalPrice || 0}
                  </span>
                </div>
                {/* Payment method */}
                <div className="flex justify-between items-center pt-1">
                  <span className="text-xs text-stone-400">Payment</span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full capitalize
                    ${order.paymentStatus === "paid"
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"}`}>
                    {order.paymentMethod || "—"} • {order.paymentStatus || "—"}
                  </span>
                </div>
              </div>
            </div>

            {/* ── LIVE REFRESH INDICATOR ── */}
            {!isCancelled && (
              <div className="flex items-center justify-center gap-2 text-xs text-stone-400">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Auto-refreshing every 5 seconds
              </div>
            )}

          </div>
        </div>
      </div>
    </main>
  );
}