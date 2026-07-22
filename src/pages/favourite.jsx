import React from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { Link } from "react-router-dom";
const SERVER_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api"
).replace("/api", "");
export default function Favorites({ favorites, toggleFavorite, addToCart }) {

  // EMPTY STATE
  if (!favorites || favorites.length === 0)
    return (
      <div className="min-h-screen flex flex-col bg-amber-50">

        {/* CONTENT */}
        <div className="flex flex-col items-center justify-center flex-grow px-6 text-center">

          <div className="text-6xl sm:text-7xl mb-6 drop-shadow-sm">💔</div>

          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 text-stone-800 tracking-tight">
            No Favorites Yet
          </h2>

          <p className="text-stone-400 mb-8 max-w-sm text-sm sm:text-[15px] leading-relaxed">
            Looks like you haven't added anything yet.
            Explore our menu and find your favorite drinks & snacks!
          </p>

          <Link
            to="/menu"
            className="bg-[#c89b3c] hover:bg-[#b88a2f] text-white px-8 py-3.5 rounded-2xl
            font-semibold text-sm tracking-wide transition-all duration-200
            shadow-lg shadow-amber-200 hover:shadow-amber-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            🍹 Explore Menu
          </Link>

        </div>

        {/* FOOTER */}
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
      <div className="sm:hidden sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-stone-200/70 px-4 pt-4 pb-3">
        <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#c89b3c] mb-0.5">
          Your Collection
        </p>
        <h1 className="text-xl font-bold text-stone-800 tracking-tight leading-none">
          ❤️ Your Favorites
        </h1>
      </div>

      {/* CONTENT */}
      <div className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-14 w-full">

        {/* Heading (desktop only) */}
        <div className="hidden sm:block text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-2">
            Your Collection
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
            ❤️ Your Favorites
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] mx-auto mt-4 rounded-full" />
        </div>

        {/* ── ITEM COUNT (mobile only) ── */}
        <p className="sm:hidden text-xs text-stone-400 font-medium mb-3">
          <span className="text-stone-600 font-semibold">{favorites.length}</span>{" "}
          {favorites.length === 1 ? "item" : "items"} saved
        </p>

        {/* LIST / GRID */}
        <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 sm:gap-7">

          {favorites.map((item) => (
            <article
              key={item._id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-100
              shadow-sm hover:shadow-xl sm:hover:-translate-y-1.5
              transition-all duration-300
              flex flex-row-reverse sm:flex-col group
              p-2.5 gap-3 sm:p-0 sm:gap-0"
            >

              {/* IMAGE */}
              <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden
                sm:w-full sm:h-auto sm:shrink sm:rounded-none">
                <img
                  src={`${SERVER_URL}${item.image}`}
                  alt={item.name}
                  className="w-full h-full sm:h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Heart */}
                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-1.5 right-1.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-9 sm:h-9 bg-white/90 backdrop-blur-sm
                  text-red-500 rounded-full shadow-md flex items-center justify-center
                  hover:bg-red-50 hover:scale-110 transition-all duration-200"
                >
                  <FaHeart className="text-xs sm:text-sm" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="flex-1 min-w-0 flex flex-col justify-center sm:justify-start sm:flex-grow sm:p-4">

                <h3 className="text-sm sm:text-[15px] font-semibold text-stone-800 mb-0.5 sm:mb-1 leading-snug line-clamp-1">
                  {item.name}
                </h3>

                <p className="text-stone-400 text-xs mb-2 sm:mb-4 leading-relaxed line-clamp-1 sm:line-clamp-none">
                  Delicious & freshly prepared
                </p>

                {/* PRICE + BUTTON */}
                <div className="mt-auto flex items-center justify-between gap-3">

                  <span className="font-bold text-[#c89b3c] text-base sm:text-xl leading-none">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-[#c89b3c] hover:bg-[#b88a2f]
                    text-white text-xs font-semibold rounded-full sm:rounded-xl
                    shadow-sm sm:shadow-md shadow-amber-200 hover:shadow-amber-300
                    sm:hover:-translate-y-0.5 active:translate-y-0
                    transition-all duration-200"
                  >
                    <FaShoppingCart className="text-xs" /> Add
                  </button>

                </div>

              </div>

            </article>
          ))}

        </div>
      </div>

      {/* FOOTER */}
      <footer className="bg-[#4a3330] text-white/70 text-center py-5 text-sm tracking-wide mt-auto">
        © 2026 GJ 21 Cafe. All Rights Reserved.
      </footer>

    </main>
  );
}