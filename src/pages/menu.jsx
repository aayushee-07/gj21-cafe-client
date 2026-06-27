import { useEffect, useState } from "react";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import api from "../lib/apiClient";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Link } from "react-router-dom";
const SERVER_URL = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

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
  const fetchMenu = async () => {
    try {
      const res = await api.get("/menu");
      setItems(res.data || []);
    } catch (err) {
      console.error("❌ Error fetching menu:", err);
    } finally {
      setLoading(false);
    }
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

      <div className="w-full px-6 md:px-10 py-8">

        {/* ── PAGE HEADING ── */}
        <div className="relative flex items-center justify-center mb-6">

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

        {/* ── SEARCH + SORT — search left, sort far right ── */}
        <div className="flex items-center justify-between gap-4 mb-6">

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

        {/* ── CATEGORY TABS ── */}
        <div className="flex flex-wrap gap-2 mb-10">
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
          <p className="text-xs text-stone-400 font-medium mb-5">
            Showing <span className="text-stone-600 font-semibold">{filteredItems.length}</span> items
            {selectedCategory !== "All" && (
              <span> in <span className="text-[#c89b3c] font-semibold">{selectedCategory}</span></span>
            )}
          </p>
        )}

        {/* ── MENU GRID ── */}
        {filteredItems.length === 0 ? (
          <div className="w-full flex flex-col items-center justify-center py-24 gap-3">
            <div className="text-5xl">❌</div>
            <p className="text-stone-400 font-semibold text-base">No items found</p>
            <p className="text-stone-300 text-sm">Try a different search or category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {filteredItems.map((item) => {
              const isFav = favorites?.some((fav) => fav._id === item._id);

              return (
                <article
                  key={item._id}
                  className="bg-white rounded-2xl border border-stone-100 shadow-sm
                  hover:shadow-lg hover:-translate-y-1 transition-all duration-300
                  flex flex-col overflow-hidden group"
                >

                  {/* IMAGE */}
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={`${SERVER_URL}${item.image}`}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Out of stock overlay */}
                    {!item.isAvailable && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <span className="text-white font-bold text-sm bg-black/60 px-3 py-1 rounded-full">
                          Out of Stock
                        </span>
                      </div>
                    )}

                    {/* Favorite button on image */}
                    {!isAdmin && (
                      <button
                        onClick={() => toggleFavorite(item)}
                        className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center
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
                  <div className="p-4 flex flex-col flex-grow">

                    <h3 className="text-[15px] font-bold text-stone-800 mb-1 leading-snug line-clamp-1">
                      {item.name}
                    </h3>

                    <p className="text-stone-400 text-xs mb-3 line-clamp-2 leading-relaxed flex-grow">
                      {item.description || "Delicious item from our menu."}
                    </p>

                    {/* Price + Add */}
                    <div className="flex items-center justify-between gap-2 mt-auto pt-2.5 border-t border-stone-100">

                      <span className="text-[#c89b3c] font-bold text-base">
                        ₹{item.price}
                      </span>

                      {!isAdmin && item.isAvailable ? (
                        <button
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-1.5 px-3.5 py-2 bg-[#c89b3c]
                          hover:bg-[#b88a2f] text-white text-xs font-semibold rounded-xl
                          shadow-sm shadow-amber-200 hover:shadow-amber-300
                          hover:-translate-y-0.5 active:translate-y-0 transition-all duration-150"
                        >
                          <FaShoppingCart className="text-[10px]" /> Add
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 py-1.5 bg-stone-100 text-stone-400 text-xs
                          font-semibold rounded-xl cursor-not-allowed"
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
    </main>
  );
}