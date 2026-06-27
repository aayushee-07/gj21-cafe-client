import { Link, useNavigate } from "react-router-dom";
import { FaHeart, FaShoppingCart, FaBars, FaTimes } from "react-icons/fa";
import { useState } from "react";

export default function Navbar({ user, setUser, cartItems, favorites }) {
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  };

  const totalCartCount = cartItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  // ✅ Safely read role — handles "admin", "Admin", "ADMIN", nested objects
  const rawRole =
    user?.role ||
    user?.user?.role ||
    (() => {
      try {
        const stored = localStorage.getItem("user");
        if (stored) {
          const parsed = JSON.parse(stored);
          return parsed?.role || parsed?.user?.role || "";
        }
      } catch {
        return "";
      }
      return "";
    })();

  const isAdmin = String(rawRole).toLowerCase() === "admin";
  const isDelivery = String(rawRole).toLowerCase() === "delivery";

  return (
    <nav className="bg-white/80 backdrop-blur-md text-stone-800 px-6 md:px-10 py-4 sticky top-0 z-50 shadow-sm border-b border-stone-200">

      <div className="max-w-7xl mx-auto flex justify-between items-center">

        {/* ── LOGO ── */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 bg-[#c89b3c] rounded-full flex items-center justify-center shadow-md group-hover:shadow-lg transition-all duration-300 group-hover:scale-105">
            <span className="text-white font-bold text-sm">GJ</span>
          </div>
          <span className="text-xl md:text-2xl font-bold tracking-wide">
            GJ <span className="text-[#c89b3c]">21</span>{" "}
            <span className="text-stone-700">Cafe</span>
          </span>
        </Link>

        {/* ── DESKTOP MENU ── */}
        <ul className="hidden md:flex items-center gap-1 text-sm font-medium">

          {/* Admin sees: Home, About, Menu — NO Orders */}
          {(
            isDelivery
              ? [
                { label: "Dashboard", to: "/delivery" },
                { label: "My Deliveries", to: "/delivery/orders" },
              ]
              : [
                { label: "Home", to: "/" },
                { label: "About", to: "/about" },
                { label: "Menu", to: "/menu" },
                ...(!isAdmin && user
                  ? [{ label: "Orders", to: "/orders" }]
                  : []),
              ]
          ).map(({ label, to }) => (
            <li key={to}>
              <Link
                to={to}
                className="px-4 py-2.5 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all duration-200 font-medium"
              >
                {label}
              </Link>
            </li>
          ))}
          {/* Favorites + Cart — HIDDEN for admin */}
          {!isAdmin && !isDelivery && (
            <>
              <li className="w-px h-6 bg-stone-200 mx-3" />

              <li>
                <Link
                  to="/favorites"
                  className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50/80 transition-all duration-200"
                >
                  <FaHeart className="text-base" />
                  {(favorites?.length || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {favorites.length}
                    </span>
                  )}
                </Link>
              </li>

              <li>
                <Link
                  to="/cart"
                  className="relative flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-[#c89b3c] hover:text-[#b88a2f] hover:bg-amber-50/80 transition-all duration-200"
                >
                  <FaShoppingCart className="text-base" />
                  {totalCartCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#c89b3c] text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                      {totalCartCount}
                    </span>
                  )}
                </Link>
              </li>
            </>
          )}

          <li className="w-px h-6 bg-stone-200 mx-3" />

          {/* AUTH */}
          {!user ? (
            <li>
              <Link
                to="/login"
                className="px-6 py-2.5 bg-[#c89b3c] text-white rounded-xl text-sm font-semibold hover:bg-[#b88a2f] transition-all duration-200 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
              >
                Login
              </Link>
            </li>
          ) : (
            <div className="flex items-center gap-3">
              <span className="text-[#c89b3c] font-semibold text-sm px-2">
                Hi, {user.name}
              </span>

              <button
                onClick={handleLogout}
                className="px-5 py-2.5 border-2 border-stone-200 rounded-xl text-stone-600 hover:border-stone-300 hover:bg-stone-50 text-sm font-semibold transition-all duration-200"
              >
                Logout
              </button>

              {isAdmin && (
                <Link
                  to="/admin"
                  className="px-5 py-2.5 bg-[#c89b3c] hover:bg-[#b88a2f] text-white rounded-xl text-sm font-bold tracking-wide shadow-md hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
                >
                  Admin
                </Link>
              )}
              {isDelivery && (
                <Link
                  to="/delivery"
                  className="px-5 py-2.5 bg-[#c89b3c] hover:bg-[#b88a2f] text-white rounded-xl text-sm font-bold tracking-wide shadow-md"
                >
                  Delivery
                </Link>
              )}
            </div>
          )}
        </ul>

        {/* ── MOBILE RIGHT ICONS — Favorites + Cart HIDDEN for admin ── */}
        <div className="md:hidden flex items-center gap-2">
          {!isAdmin && (
            <>
              <Link
                to="/favorites"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-stone-50 text-red-500 hover:bg-red-50 transition-all duration-200"
              >
                <FaHeart className="text-sm" />
                {(favorites?.length || 0) > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Link>

              <Link
                to="/cart"
                className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 text-[#c89b3c] hover:bg-amber-100 transition-all duration-200"
              >
                <FaShoppingCart className="text-sm" />
                {totalCartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#c89b3c] text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                    {totalCartCount}
                  </span>
                )}
              </Link>
            </>
          )}

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex items-center justify-center w-10 h-10 rounded-xl bg-stone-50 text-stone-700 hover:bg-stone-100 transition-all duration-200"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* ── MOBILE MENU DROPDOWN ── */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-lg border-b border-stone-200 shadow-lg py-4 px-6 animate-slideDown">
          <ul className="flex flex-col gap-2">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Menu", to: "/menu" },
              ...(!isAdmin && user ? [{ label: "Orders", to: "/orders" }] : []),
            ].map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-50 transition-all duration-200 font-medium"
                >
                  {label}
                </Link>
              </li>
            ))}

            <li className="h-px bg-stone-200 my-2" />

            {!user ? (
              <li>
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 bg-[#c89b3c] text-white rounded-xl text-center font-semibold hover:bg-[#b88a2f] transition-all duration-200"
                >
                  Login
                </Link>
              </li>
            ) : (
              <>
                <li className="px-4 py-2 text-[#c89b3c] font-semibold">
                  Hi, {user.name}
                </li>
                <li>
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl text-stone-600 hover:bg-stone-50 font-semibold transition-all duration-200"
                  >
                    Logout
                  </button>
                </li>
                {isAdmin && (
                  <li>
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="block px-4 py-3 bg-[#c89b3c] text-white rounded-xl text-center font-bold hover:bg-[#b88a2f] transition-all duration-200"
                    >
                      Admin Panel
                    </Link>
                  </li>
                )}
              </>
            )}
          </ul>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </nav>
  );
}