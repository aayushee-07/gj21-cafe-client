import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../lib/apiClient";

// ✅ FIX: accept addToCart prop from App.jsx
export default function OrderSuccess({ setCartItems, addToCart }) {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder]       = useState(null);
  const [loading, setLoading]   = useState(true);
  const [reordering, setReordering] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        setOrder(res.data);
      } catch (err) {
        console.error("Order fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  // ✅ FIX: use addToCart prop to add items via API
  // not localStorage — so Cart.jsx reflects them immediately
  const handleOrderAgain = async () => {
    if (!order) return;
    if (!addToCart) {
      // fallback: setCartItems if addToCart not passed
      const reorderedItems = order.items.map((item) => ({
        _id:      item.menuItem._id,
        name:     item.menuItem.name,
        price:    item.menuItem.price,
        quantity: item.quantity,
        image:    item.menuItem.image || "",
      }));
      setCartItems(reorderedItems);
      navigate("/cart");
      return;
    }

    setReordering(true);
    try {
      for (const item of order.items) {
        const menuItem = item.menuItem;
        if (!menuItem?._id) continue;
        for (let i = 0; i < item.quantity; i++) {
          await addToCart({
            _id:      menuItem._id,
            name:     menuItem.name,
            price:    menuItem.price,
            image:    menuItem.image || "",
            category: menuItem.category || "",
          });
        }
      }
      navigate("/cart");
    } catch (err) {
      console.error("Reorder error:", err);
    } finally {
      setReordering(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-amber-50">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-[#c89b3c] rounded-full animate-spin" />
        <p className="text-stone-400 text-sm">Loading order details...</p>
      </div>
    );

  if (!order)
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-stone-400 text-[15px]">No order found.</p>
      </div>
    );

  return (
    <main className="min-h-screen flex items-center justify-center bg-amber-50 px-4 py-14">

      <div className="bg-white rounded-3xl border border-stone-100 shadow-lg w-full max-w-md overflow-hidden">

        {/* TOP BANNER */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-100 px-8 pt-10 pb-8 text-center border-b border-green-100">
          <div className="w-20 h-20 rounded-full bg-white shadow-md flex items-center justify-center mx-auto mb-5 text-4xl">
            🎉
          </div>
          <h1 className="text-2xl font-bold text-stone-800 tracking-tight mb-1">Order Placed!</h1>
          <p className="text-green-600 font-semibold text-sm">
            Your order is confirmed & being prepared
          </p>
          <div className="inline-flex items-center gap-1.5 mt-4 bg-white border border-green-200
          text-stone-500 text-xs font-medium px-4 py-1.5 rounded-full">
            <span>Order ID:</span>
            <span className="text-stone-800 font-bold">#{order._id.slice(-6)}</span>
          </div>
        </div>

        {/* BODY */}
        <div className="px-6 py-6 flex flex-col gap-5">

          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center bg-stone-50 rounded-2xl px-3 py-4 border border-stone-100">
              <span className="text-xs text-stone-400 mb-1">Total Paid</span>
              <span className="text-green-600 font-bold text-base leading-tight">
                ₹{order.finalTotal || order.totalPrice}
              </span>
            </div>
            <div className="flex flex-col items-center bg-stone-50 rounded-2xl px-3 py-4 border border-stone-100">
              <span className="text-xs text-stone-400 mb-1">Payment</span>
              <span className="text-stone-700 font-semibold text-xs text-center leading-tight">
                {order.paymentMethod}
              </span>
            </div>
            <div className="flex flex-col items-center bg-stone-50 rounded-2xl px-3 py-4 border border-stone-100">
              <span className="text-xs text-stone-400 mb-1">Status</span>
              <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                {order.status}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-stone-600">
              <span className="text-base">⏱</span>
              <span className="font-medium">Estimated Delivery</span>
            </div>
            <span className="text-[#c89b3c] font-bold text-sm">
              {order.estimatedDeliveryTime
                ? new Date(order.estimatedDeliveryTime).toLocaleTimeString()
                : "30–40 mins"}
            </span>
          </div>

          {order.discount > 0 && (
            <div className="flex items-center justify-between bg-green-50 border border-green-100 rounded-2xl px-4 py-3">
              <span className="text-sm text-stone-600 font-medium">🎁 Discount Applied</span>
              <span className="text-green-600 font-bold text-sm">− ₹{order.discount}</span>
            </div>
          )}

          <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4">
            <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-3">
              📍 Delivering To
            </p>
            <p className="text-stone-800 font-semibold text-sm">{order.deliveryAddress.fullName}</p>
            <p className="text-stone-400 text-xs mt-1 leading-relaxed">
              {order.deliveryAddress.house}, {order.deliveryAddress.street}<br />
              {order.deliveryAddress.area}, {order.deliveryAddress.city}<br />
              {order.deliveryAddress.pincode}
            </p>
          </div>

          <div className="border-t border-dashed border-stone-200 pt-4">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-3">
              🧾 Items Ordered
            </p>
            <div className="flex flex-col gap-1.5">
              {order.items.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <span className="text-stone-600">
                    {item.menuItem.name}
                    <span className="text-stone-400 ml-1">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-stone-700">
                    ₹{item.menuItem.price * item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3 pt-1">

            <button onClick={() => navigate(`/track-order/${order._id}`)}
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl
              font-semibold text-sm tracking-wide transition-all duration-200
              shadow-md shadow-green-200 hover:-translate-y-0.5 active:translate-y-0">
              🚚 Track Order
            </button>

            <button onClick={() => navigate("/orders")}
              className="w-full bg-[#c89b3c] hover:bg-[#b88a2f] text-white py-3 rounded-xl
              font-semibold text-sm tracking-wide transition-all duration-200
              shadow-md shadow-amber-200 hover:-translate-y-0.5 active:translate-y-0">
              📦 View My Orders
            </button>

            {/* ✅ FIX: reorder uses addToCart API */}
            <button
              onClick={handleOrderAgain}
              disabled={reordering}
              className="w-full bg-stone-100 hover:bg-stone-200 text-stone-700 py-3 rounded-xl
              font-semibold text-sm tracking-wide transition-all duration-200
              hover:-translate-y-0.5 active:translate-y-0
              disabled:opacity-50 disabled:cursor-not-allowed">
              {reordering ? "Adding to cart…" : "🔁 Order Again"}
            </button>

          </div>

        </div>
      </div>

    </main>
  );
}