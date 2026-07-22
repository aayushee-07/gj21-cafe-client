import React from "react";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaMinus, FaTrash } from "react-icons/fa";
const SERVER_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
).replace("/api", "");

export default function Cart({
  cartItems,
  addToCart,
  removeFromCart,
  clearCart,
}) {
  const navigate = useNavigate();

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // EMPTY CART
  if (!cartItems.length)
    return (
      <div className="min-h-screen flex flex-col bg-amber-50">

        <div className="flex flex-col items-center justify-center flex-grow text-center px-6">

          <div className="text-6xl sm:text-7xl mb-6 drop-shadow-sm">🛒</div>

          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800 tracking-tight mb-2">
            Your cart is empty
          </h2>

          <p className="text-stone-400 text-sm sm:text-[15px] mb-8 max-w-xs leading-relaxed">
            Looks like you haven't added anything yet. Let's fix that!
          </p>

          <button
            onClick={() => navigate("/menu")}
            className="bg-[#c89b3c] hover:bg-[#b88a2f] text-white px-8 py-3.5 rounded-2xl
            font-semibold text-sm tracking-wide transition-all duration-200
            shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            🍹 Explore Menu
          </button>

        </div>

        <footer className="bg-[#4a3330] text-white/70 text-center py-5 text-sm tracking-wide mt-auto">
          © 2026 GJ 21 Cafe. All Rights Reserved.
        </footer>
      </div>
    );

  return (
    <main className="min-h-screen flex flex-col bg-amber-50">

      {/* ═════════════════════════════════════════════════════════
          MOBILE HEADER (Zomato/Swiggy style compact bar)
          Hidden on sm+ — desktop heading is unchanged below.
      ═════════════════════════════════════════════════════════ */}
      <div className="sm:hidden sticky top-0 z-30 bg-amber-50/95 backdrop-blur-md border-b border-stone-200/70 px-4 py-3 flex items-center justify-between">
        <div>
          <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#c89b3c] mb-0.5">
            Review Order
          </p>
          <h1 className="text-xl font-bold text-stone-800 tracking-tight leading-none">
            🛒 Your Cart
          </h1>
        </div>
        <button
          onClick={clearCart}
          className="flex items-center gap-1 text-xs font-semibold text-red-400 hover:text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-50 active:scale-95 transition-all duration-150"
        >
          <FaTrash className="text-[10px]" /> Clear
        </button>
      </div>

      <div className="flex-grow max-w-3xl mx-auto px-4 py-4 sm:py-14 w-full pb-28 sm:pb-14">

        {/* Heading (desktop only) */}
        <div className="hidden sm:block text-center mb-10">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-2">
            Review Order
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
            🛒 Your Cart
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] mx-auto mt-4 rounded-full" />
        </div>

        {/* ── ITEM COUNT (mobile only) ── */}
        <p className="sm:hidden text-xs text-stone-400 font-medium mb-3">
          <span className="text-stone-600 font-semibold">{cartItems.length}</span>{" "}
          {cartItems.length === 1 ? "item" : "items"} in your cart
        </p>

        {/* ITEMS */}
        <div className="flex flex-col gap-2.5 sm:gap-4">

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-3 sm:gap-4 bg-white px-3 py-2.5 sm:px-4 sm:py-3 rounded-xl sm:rounded-2xl
              border border-stone-100 shadow-sm hover:shadow-md transition-all duration-200 group"
            >

              {/* IMAGE */}
              <img
                src={`${SERVER_URL}${item.image}`}
                alt={item.name}
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl flex-shrink-0
                group-hover:scale-105 transition-transform duration-300"
              />

              {/* NAME + PRICE */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm sm:text-[15px] font-semibold text-stone-800 truncate leading-snug">
                  {item.name}
                </h3>
                <p className="text-[#c89b3c] font-bold text-xs sm:text-sm mt-0.5">
                  ₹{item.price}
                </p>
                <p className="text-stone-400 text-[11px] sm:text-xs mt-0.5">
                  Subtotal: ₹{item.price * item.quantity}
                </p>
              </div>

              {/* CONTROLS */}
              <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 flex-shrink-0">

                <div className="flex items-center gap-1.5 sm:gap-2">
                  <button
                    onClick={() => addToCart(item, true)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-stone-100
                    hover:bg-stone-200 text-stone-600 rounded-lg transition-all duration-150
                    hover:scale-110 active:scale-95"
                  >
                    <FaMinus className="text-[10px] sm:text-xs" />
                  </button>

                  <span className="font-bold text-stone-800 text-sm sm:text-base w-5 sm:w-6 text-center tabular-nums">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center bg-[#c89b3c]
                    hover:bg-[#b88a2f] text-white rounded-lg transition-all duration-150
                    hover:scale-110 active:scale-95 shadow-sm shadow-amber-200"
                  >
                    <FaPlus className="text-[10px] sm:text-xs" />
                  </button>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="hidden sm:flex w-8 h-8 items-center justify-center bg-red-50
                  hover:bg-red-500 text-red-400 hover:text-white rounded-lg
                  transition-all duration-200 hover:scale-110 active:scale-95 ml-1"
                >
                  <FaTrash className="text-xs" />
                </button>

              </div>

            </div>
          ))}

        </div>

        {/* TOTAL SECTION (desktop only) */}
        <div className="hidden sm:block mt-6 bg-white rounded-2xl border border-stone-100 shadow-sm p-5">

          {/* Summary rows */}
          <div className="flex justify-between items-center text-sm text-stone-400 mb-2">
            <span>Items ({cartItems.length})</span>
            <span>₹{totalPrice}</span>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">

            <span className="text-2xl font-bold text-stone-800">
              Total:{" "}
              <span className="text-[#c89b3c]">₹{totalPrice}</span>
            </span>

            <div className="flex gap-3 w-full sm:w-auto">

              <button
                onClick={clearCart}
                className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-red-200
                text-red-400 hover:bg-red-500 hover:text-white hover:border-red-500
                text-sm font-semibold transition-all duration-200"
              >
                Clear Cart
              </button>

              <button
                onClick={() => navigate("/checkout")}
                className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white
                px-6 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                shadow-md shadow-green-200 hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                Checkout →
              </button>

            </div>

          </div>

        </div>

      </div>

      {/* ═════════════════════════════════════════════════════════
          MOBILE STICKY CHECKOUT BAR (Zomato/Swiggy style)
          Hidden on sm+ — desktop uses the total card above instead.
      ═════════════════════════════════════════════════════════ */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)] px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[10px] text-stone-400 font-medium">
              {cartItems.length} {cartItems.length === 1 ? "item" : "items"}
            </p>
            <p className="text-lg font-bold text-stone-800 leading-tight">
              ₹{totalPrice}
            </p>
          </div>
          <button
            onClick={() => navigate("/checkout")}
            className="flex-1 max-w-[220px] bg-green-600 hover:bg-green-700 text-white
            px-6 py-3 rounded-xl text-sm font-bold tracking-wide transition-all duration-200
            shadow-md shadow-green-200 active:scale-95"
          >
            Checkout →
          </button>
        </div>
      </div>

      {/* FOOTER (desktop only — mobile has the sticky checkout bar instead) */}
      <footer className="hidden sm:block bg-[#4a3330] text-white/70 text-center py-5 text-sm tracking-wide mt-auto">
        © 2026 GJ 21 Cafe. All Rights Reserved.
      </footer>

    </main>
  );
}