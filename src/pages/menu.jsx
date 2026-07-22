import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import axios from "axios";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";

export default function Menu({
  user,
  addToCart,
  favorites,
  toggleFavorite,
  cartItems,
}) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState("");

  /* ===============================
     FETCH MENU (AUTO REFRESH ENABLED)
  =============================== */
  const fetchMenu = () => {
    axios
    api.get("/menu")
      .then((res) => setItems(res.data || []))
      .catch((err) => console.error("❌ Error fetching menu:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchMenu();
    const interval = setInterval(fetchMenu, 5000);
    const handleVisibility = () => {
      if (document.visibilityState === "visible") fetchMenu();
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, []);

  /* ===============================
     FILTERING + SORTING
  =============================== */
  const categories = ["All", ...new Set(items.map((item) => item.category))];

  let filteredItems =
    selectedCategory === "All"
      ? items
      : items.filter((item) => item.category === selectedCategory);

  if (searchTerm.trim()) {
    filteredItems = filteredItems.filter((item) =>
      item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }

  if (sortOption === "low-high") filteredItems.sort((a, b) => a.price - b.price);
  else if (sortOption === "high-low") filteredItems.sort((a, b) => b.price - a.price);
  else if (sortOption === "a-z") filteredItems.sort((a, b) => a.name.localeCompare(b.name));
  else if (sortOption === "z-a") filteredItems.sort((a, b) => b.name.localeCompare(a.name));

  const totalCartCount = cartItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;
  const isAdmin = user?.role === "admin";

  /* ===============================
     LOADING STATES
  =============================== */
  if (loading)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-amber-50">
        <div className="w-10 h-10 border-4 border-amber-200 border-t-[#c89b3c] rounded-full animate-spin" />
        <p className="text-stone-400 text-sm">Loading menu...</p>
      </div>
    );

  if (!items.length)
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-3 bg-amber-50">
        <div className="text-5xl">🍽️</div>
        <p className="text-stone-500 font-semibold">No menu items found.</p>
      </div>
    );

  /* ===============================
     UI STARTS
  =============================== */
  return (
    <main className="bg-amber-50 min-h-screen">
      <ToastContainer transition={Slide} position="top-center" />

      {/* ═════════════════════════════════════════════════════════
          MOBILE HEADER (Zomato/Swiggy style compact bar)
          Hidden on sm+ — desktop heading is unchanged below.
      ═════════════════════════════════════════════════════════ */}
      <div className="sm:hidden sticky top-0 z-40 bg-amber-50/95 backdrop-blur-md border-b border-stone-200/70">
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.16em] uppercase text-[#c89b3c] mb-0.5">
              GJ 21 Cafe
            </p>
            <h1 className="text-xl font-bold text-stone-800 tracking-tight leading-none">
              🍽️ Our Menu
            </h1>
          </div>

          {!isAdmin && (
            <div className="flex items-center gap-1.5">
              <Link
                to="/favorites"
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-rose-500 active:scale-95 transition-transform"
              >
                <FaHeart className="text-base" />
                {(favorites?.length || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>
              <Link
                to="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-full bg-white shadow-sm text-[#c89b3c] active:scale-95 transition-transform"
              >
                <FaShoppingCart className="text-base" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-[#c89b3c] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            </div>
          )}
        </div>

        {/* Search — mobile */}
        <div className="px-4 pb-3">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <input
                type="search"
                placeholder="Search for dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-4 pr-4 py-2.5 border border-stone-200 bg-white rounded-full text-sm
                text-stone-800 placeholder:text-stone-400 shadow-sm
                focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
                transition-all duration-150"
              />
            </div>

            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="shrink-0 w-[92px] px-2 py-2.5 border border-stone-200 bg-white rounded-full text-xs
              text-stone-600 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
              focus:border-[#c89b3c] transition-all duration-150"
            >
              <option value="">Sort</option>
              <option value="low-high">Price ↑</option>
              <option value="high-low">Price ↓</option>
              <option value="a-z">Name A-Z</option>
              <option value="z-a">Name Z-A</option>
            </select>
          </div>
        </div>

        {/* Category chips — horizontal scroll */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar px-4 pb-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`shrink-0 whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-150 capitalize
                ${selectedCategory === cat
                  ? "bg-[#c89b3c] text-white border-[#c89b3c] shadow-sm shadow-amber-200"
                  : "bg-white text-stone-500 border-stone-200"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full px-4 sm:px-6 md:px-10 py-4 sm:py-8">

        {/* ── PAGE HEADING (desktop only) ── */}
        <div className="relative hidden sm:flex items-center justify-center mb-6">

          <div className="text-center">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-2">
              GJ 21 Cafe
            </p>
            <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
              🍽️ Our Menu
            </h1>
            <div className="w-12 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] mx-auto mt-3 rounded-full" />
          </div>

          {/* Fav + Cart — absolute right */}
          {!isAdmin && (
          <div className="absolute right-0 flex items-center gap-4">
            <Link
              to="/favorites"
              className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition"
            >
              <FaHeart className="text-2xl" />
              <span className="font-bold text-base">{favorites?.length || 0}</span>
            </Link>
            <Link
              to="/cart"
              className="flex items-center gap-2 text-[#c89b3c] hover:text-[#b88a2f] transition"
            >
              <FaShoppingCart className="text-2xl" />
              <span className="font-bold text-base">{totalCartCount}</span>
            </Link>
          </div>
          )}

        </div>

        {/* ── SEARCH + SORT (desktop only) — search left, sort far right ── */}
        <div className="hidden sm:flex items-center justify-between gap-4 mb-6">

          <input
            type="search"
            placeholder="Search items..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-[48%] px-4 py-2.5 border border-stone-200 bg-white rounded-xl text-sm
            text-stone-800 placeholder:text-stone-400
            focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
            transition-all duration-150"
          />

          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
            className="px-4 py-2.5 border border-stone-200 bg-white rounded-xl text-sm
            text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
            focus:border-[#c89b3c] transition-all duration-150 w-44"
          >
            <option value="">Sort By</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
            <option value="a-z">Name: A — Z</option>
            <option value="z-a">Name: Z — A</option>
          </select>

        </div>

        {/* ── CATEGORY TABS (desktop only) ── */}
        <div className="hidden sm:flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-150 capitalize
                ${selectedCategory === cat
                  ? "bg-[#c89b3c] text-white border-[#c89b3c] shadow-md shadow-amber-200"
                  : "bg-white text-stone-500 border-stone-200 hover:border-[#c89b3c] hover:text-[#c89b3c]"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── ITEMS COUNT ── */}
        {filteredItems.length > 0 && (
          <p className="text-xs text-stone-400 font-medium mb-3 sm:mb-5 pt-3 sm:pt-0">
            Showing <span className="text-stone-600 font-semibold">{filteredItems.length}</span> items
            {selectedCategory !== "All" && (
              <span> in <span className="text-[#c89b3c] font-semibold">{selectedCategory}</span></span>
            )}
          </p>
        )}

        {/* ── MENU LIST / GRID ── */}
        {filteredItems.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-24 gap-3">
            <div className="text-5xl">❌</div>
            <p className="text-stone-400 font-semibold text-base">No items found</p>
            <p className="text-stone-300 text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3 sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 sm:gap-5">
            {filteredItems.map((item) => {
              const isFav = favorites?.some((fav) => fav._id === item._id);

              return (
                <article
                  key={item._id}
                  className="bg-white rounded-2xl border border-stone-100 shadow-sm
                  hover:shadow-lg sm:hover:-translate-y-1 transition-all duration-300
                  flex flex-row-reverse sm:flex-col overflow-hidden group
                  p-2.5 gap-3 sm:p-0 sm:gap-0"
                >

                  {/* IMAGE */}
                  <div className="relative w-24 h-24 shrink-0 rounded-xl overflow-hidden
                    sm:w-full sm:h-auto sm:aspect-square sm:shrink sm:rounded-none">
                    <img
                src={`${import.meta.env.VITE_API_URL.replace("/api", "")}${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Out of stock overlay */}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-[10px] sm:text-sm bg-black/60 px-2 sm:px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Favorite button on image */}
                    {!isAdmin && (
                    <button
                      onClick={() => toggleFavorite(item)}
                      className={`absolute top-1.5 right-1.5 sm:top-2.5 sm:right-2.5 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center
                      justify-center shadow-md transition-all duration-150 hover:scale-110
                      ${isFav
                        ? "bg-rose-500 text-white"
                        : "bg-white/90 backdrop-blur-sm text-stone-400 hover:text-rose-500"
                      }`}
                    >
                      {isFav ? <FaHeart className="text-xs" /> : <FaRegHeart className="text-xs" />}
                    </button>
                    )}
                  </div>
                  

                  {/* BODY */}
                  <div className="flex-1 min-w-0 flex flex-col justify-center sm:justify-start sm:flex-grow sm:p-4">

                    <h3 className="text-sm sm:text-[15px] font-bold text-stone-800 mb-0.5 sm:mb-1 leading-snug line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-stone-400 text-xs mb-2 sm:mb-3 line-clamp-1 sm:line-clamp-2 leading-relaxed sm:flex-grow">
                      {item.description || "Delicious item from our menu."}
                    </p>

                    {/* Price + Add */}
                    <div className="flex items-center justify-between gap-2 mt-auto sm:pt-2.5 sm:border-t sm:border-stone-100">

                      <span className="text-[#c89b3c] font-bold text-sm sm:text-base">
                        ₹{item.price}
                      </span>

                      {!isAdmin && item.isAvailable ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-[#c89b3c]
                          hover:bg-[#b88a2f] text-white text-xs font-semibold rounded-full sm:rounded-xl
                          shadow-sm shadow-amber-200 hover:shadow-amber-300
                          sm:hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                        >
                          <FaShoppingCart className="text-[10px]" /> Add
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 bg-stone-100 text-stone-400 text-xs
                          font-semibold rounded-full sm:rounded-xl cursor-not-allowed"
                        >
                          Unavailable
                        </button>
                      )}

                    </div>
                  </div>

                </article>
              );
            })}
          </div>
        )}

      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  );
}