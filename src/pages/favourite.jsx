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

          <div className="text-7xl mb-6 drop-shadow-sm">💔</div>

          <h2 className="text-3xl md:text-4xl font-bold mb-3 text-stone-800 tracking-tight">
            No Favorites Yet
          </h2>

          <p className="text-stone-400 mb-8 max-w-sm text-[15px] leading-relaxed">
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

      {/* CONTENT */}
      <div className="flex-grow max-w-7xl mx-auto px-6 py-14 w-full">

        {/* Heading */}
        <div className="text-center mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-2">
            Your Collection
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
            ❤️ Your Favorites
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] mx-auto mt-4 rounded-full" />
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-7">

          {favorites.map((item) => (
            <article
              key={item._id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-100
              shadow-sm hover:shadow-xl hover:-translate-y-1.5
              transition-all duration-300 flex flex-col group"
            >

              {/* IMAGE */}
              <div className="relative overflow-hidden">
                <img
                src={`${SERVER_URL}${item.image}`}
                  alt={item.name}
                  className="w-full h-52 object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {/* Heart */}
                <button
                  onClick={() => toggleFavorite(item)}
                  className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm
                  text-red-500 rounded-full shadow-md flex items-center justify-center
                  hover:bg-red-50 hover:scale-110 transition-all duration-200"
                >
                  <FaHeart className="text-sm" />
                </button>
              </div>

              {/* CONTENT */}
              <div className="p-4 flex flex-col flex-grow">

                <h3 className="text-[15px] font-semibold text-stone-800 mb-1 leading-snug">
                  {item.name}
                </h3>

                <p className="text-stone-400 text-xs mb-4 leading-relaxed">
                  Delicious & freshly prepared
                </p>

                {/* PRICE + BUTTON */}
                <div className="mt-auto flex items-center justify-between gap-3">

                  <span className="font-bold text-[#c89b3c] text-xl leading-none">
                    ₹{item.price}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-[#c89b3c] hover:bg-[#b88a2f]
                    text-white text-xs font-semibold rounded-xl
                    shadow-md shadow-amber-200 hover:shadow-amber-300
                    hover:-translate-y-0.5 active:translate-y-0
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
