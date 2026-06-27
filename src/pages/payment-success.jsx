import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../lib/apiClient";
import { FaCheckCircle } from "react-icons/fa";

export default function PaymentSuccess() {
  const [order, setOrder] = useState(null);
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const orderId = params.get("orderId");

  useEffect(() => {
    const updatePayment = async () => {
      try {
        await api.put(`/orders/mark-paid/${orderId}`);
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data);
        localStorage.removeItem("cart");
      } catch (err) {
        console.log(err);
      }
    };

    if (orderId) updatePayment();
  }, [orderId]);

  /* ================= LOADING ================= */
  if (!order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-amber-50">
        <div className="w-11 h-11 border-4 border-amber-200 border-t-green-500 rounded-full animate-spin" />
        <p className="text-stone-400 text-sm tracking-wide">Processing your order…</p>
      </div>
    );
  }

  /* ================= UI ================= */
  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-14">

      <div className="w-full max-w-md">

        {/* ── SUCCESS HEADER ── */}
        <div className="text-center mb-7">

          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-100 to-emerald-200
          flex items-center justify-center mx-auto mb-5 shadow-lg shadow-green-200/50">
            <FaCheckCircle className="text-4xl text-green-600" />
          </div>

          <h1 className="text-2xl font-bold text-stone-800 tracking-tight mb-1">
            Payment Successful 🎉
          </h1>
          <p className="text-stone-400 text-sm">
            Your order has been placed successfully!
          </p>

        </div>

        {/* ── CARD ── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-lg p-6">

          {/* ORDER INFO */}
          <div className="flex flex-col gap-3 mb-5">

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400 font-medium">Order ID</span>
              <span className="text-stone-700 font-semibold text-xs text-right max-w-[55%] break-all">
                {order._id}
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400 font-medium">Payment Method</span>
              <span className="text-stone-700 font-semibold">Online</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400 font-medium">Status</span>
              <span className="bg-green-100 text-green-700 text-[11px] font-bold
              px-3 py-1 rounded-full tracking-wide">
                PAID
              </span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-stone-400 font-medium">Total Amount</span>
              <span className="text-green-600 font-bold text-xl">
                ₹{order.finalTotal}
              </span>
            </div>

          </div>

          {/* DIVIDER */}
          <hr className="border-dashed border-stone-200 my-5" />

          {/* ITEMS */}
          <div>
            <p className="text-sm font-semibold text-stone-700 mb-3">
              🧾 Order Items
            </p>
            <div className="flex flex-col">
              {order.items.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center py-2.5
                  border-b border-stone-50 last:border-none text-sm"
                >
                  <span className="text-stone-600">{item.menuItem.name}</span>
                  <span className="bg-stone-100 text-stone-500 text-xs font-semibold
                  px-2.5 py-0.5 rounded-full">
                    × {item.quantity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="mt-6 flex flex-col gap-3">

            {/* REORDER */}
            <button
              onClick={() => {
                const newCart = order.items.map((item) => ({
                  _id: item.menuItem._id,
                  name: item.menuItem.name,
                  price: item.menuItem.price,
                  image: item.menuItem.image,
                  quantity: item.quantity,
                }));
                localStorage.setItem("cart", JSON.stringify(newCart));
                navigate("/cart");
              }}
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white
              rounded-xl font-semibold text-sm tracking-wide
              shadow-md shadow-green-200 hover:shadow-green-300
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Reorder 🔁
            </button>

            {/* TRACK */}
            <button
              onClick={() => navigate(`/track-order/${order._id}`)}
              className="w-full py-3 bg-[#c89b3c] hover:bg-[#b88a2f] text-white
              rounded-xl font-semibold text-sm tracking-wide
              shadow-md shadow-amber-200 hover:shadow-amber-300
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Track Order 📦
            </button>

            {/* HOME */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-600
              rounded-xl font-semibold text-sm tracking-wide
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}