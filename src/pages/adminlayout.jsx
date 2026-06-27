// src/pages/adminlayout.jsx
import { Outlet, Link, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { FaBars, FaTimes } from "react-icons/fa";
import {
  LayoutDashboard,
  ShoppingBag,
  UtensilsCrossed,
  MessageSquare,
  Ticket,
  TrendingUp,
  CreditCard,
  Globe,
  LogOut,
  Users,
  Truck,
} from "lucide-react";

// ── Sidebar nav links (matches your screenshot exactly) ──────────────
const sidebarLinks = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/admin", exact: true },
  { label: "Orders", icon: ShoppingBag, path: "/admin/orders" },
  { label: "Menu", icon: UtensilsCrossed, path: "/admin/menu" },
  { label: "Coupons", icon: Ticket, path: "/admin/coupons" },
  { label: "Transactions", icon: CreditCard, path: "/admin/transactions" },
  { label: "Analytics", icon: TrendingUp, path: "/admin/analytics" },
  { label: "Messages", icon: MessageSquare, path: "/admin/messages" },
  { label: "Feedback", icon: MessageSquare, path: "/admin/feedback" },
  { label: "Users", icon: Users, path: "/admin/users" },
  {
    label: "Delivery Management",
    icon: Truck,
    path: "/admin/delivery",
  },
];

export default function AdminLayout({ user, setUser, cartItems, favorites }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobileSideOpen, setMobileSideOpen] = useState(false);

  const totalCartCount = cartItems?.reduce((sum, i) => sum + i.quantity, 0) || 0;

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  useEffect(() => {
    const prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBodyOverflow;
    };
  }, []);

  return (
    <div className="h-screen flex flex-col bg-[#F5EFE6] overflow-hidden">
      {/* ════════════════════════════════════════════
           NAVBAR  (exact copy of your navbar.jsx)
      ════════════════════════════════════════════ */}
      <nav className="bg-[#FDF8F3]/95 backdrop-blur-md text-[#5D4037] px-6 md:px-10 py-4 sticky top-0 z-50 shadow-sm border-b border-[#5D4037]/10 flex-shrink-0">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-[#5D4037] rounded-full flex items-center justify-center shadow-md group-hover:scale-105 transition-all duration-300">
              <span className="text-[#FDF8F3] font-bold text-sm">GJ</span>
            </div>
            <span className="text-xl md:text-2xl font-bold tracking-wide">
              GJ <span className="text-[#C17754]">21</span>{" "}
              <span className="text-[#5D4037]/80">Cafe</span>
            </span>
          </Link>

          {/* Desktop links */}
          <ul className="hidden md:flex items-center gap-1 text-sm font-medium">
            {[
              { label: "Home", to: "/" },
              { label: "About", to: "/about" },
              { label: "Menu", to: "/menu" },
            ].map(({ label, to }) => (
              <li key={to}>
                <Link
                  to={to}
                  className="px-4 py-2.5 rounded-xl text-[#5D4037]/70 hover:text-[#5D4037] hover:bg-[#5D4037]/5 transition-all duration-200 font-medium"
                >
                  {label}
                </Link>
              </li>
            ))}

            <li className="flex items-center gap-3">
              <span className="text-[#C17754] font-semibold text-sm px-2">
                Hi, {user?.name}
              </span>
              <button
                onClick={handleLogout}
                className="px-5 py-2.5 border-2 border-[#5D4037]/20 rounded-xl text-[#5D4037]/70 hover:border-[#5D4037]/40 hover:bg-[#5D4037]/5 text-sm font-semibold transition-all duration-200"
              >
                Logout
              </button>
            </li>
          </ul>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#5D4037]/5 text-[#5D4037]"
            >
              {mobileNavOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>

        {/* Mobile nav dropdown */}
        {mobileNavOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#FDF8F3]/98 backdrop-blur-lg border-b border-[#5D4037]/10 shadow-lg py-4 px-6 z-50">
            <ul className="flex flex-col gap-2">
              {[
                { label: "Home", to: "/" },
                { label: "About", to: "/about" },
                { label: "Menu", to: "/menu" },
              ].map(({ label, to }) => (
                <li key={to}>
                  <Link
                    to={to}
                    onClick={() => setMobileNavOpen(false)}
                    className="block px-4 py-3 rounded-xl text-[#5D4037]/80 hover:bg-[#5D4037]/5 font-medium"
                  >
                    {label}
                  </Link>
                </li>
              ))}
              <li className="h-px bg-[#5D4037]/10 my-1" />
              <li className="px-4 py-2 text-[#C17754] font-semibold">
                Hi, {user?.name}
              </li>
              <li>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileNavOpen(false);
                  }}
                  className="w-full px-4 py-3 border-2 border-[#5D4037]/20 rounded-xl text-[#5D4037]/70 hover:bg-[#5D4037]/5 font-semibold transition-all"
                >
                  Logout
                </button>
              </li>
            </ul>
          </div>
        )}
      </nav>

      {/* ════════════════════════════════════════════
           SIDEBAR + PAGE CONTENT
      ════════════════════════════════════════════ */}
      <div className="flex flex-1 min-h-0 overflow-hidden">
        {/* ── DESKTOP SIDEBAR (fixed, full height below navbar) ── */}
        <aside className="hidden lg:flex w-64 bg-[#1a1009] flex-col flex-shrink-0 h-full overflow-hidden">
          {/* Brand */}
          <div className="px-5 py-5 border-b border-white/10 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-[#c89b3c] rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-white font-bold text-sm">G</span>
              </div>
              <div className="leading-tight">
                <p className="text-sm font-bold text-white">GJ 21 Cafe</p>
                <p className="text-[10px] text-white/40 tracking-widest uppercase">
                  Admin Panel
                </p>
              </div>
            </div>
          </div>

          {/* Nav */}
          <nav className="flex-1 min-h-0 px-3 py-4 flex flex-col gap-0.5 overflow-y-auto overflow-x-hidden">
            <p className="text-[10px] font-semibold text-white/30 tracking-widest uppercase px-3 mb-3">
              Navigation
            </p>
            {sidebarLinks.map(({ label, icon: Icon, path, exact }) => {
              const active = isActive(path, exact);
              return (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150
                    ${
                      active
                        ? "bg-[#c89b3c] text-white"
                        : "text-white/55 hover:bg-white/6 hover:text-white"
                    }`}
                >
                  <Icon size={16} strokeWidth={1.5} />
                  {label}
                  {active && <span className="ml-auto text-white/60 text-xs">›</span>}
                </Link>
              );
            })}

            <div className="my-3 h-px bg-white/8" />

            <p className="text-[10px] font-semibold text-white/30 tracking-widest uppercase px-3 mb-2">
              External
            </p>
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-white/55 hover:bg-white/6 hover:text-white transition-all duration-150"
            >
              <span className="flex items-center gap-3">
                <Globe size={16} strokeWidth={1.5} />
                Visit Website
              </span>
              <span className="text-white/30 text-xs">↗</span>
            </a>
          </nav>

          {/* Bottom — system status + copyright */}
          <div className="px-5 py-4 border-t border-white/8 flex-shrink-0">
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-xs text-white/40 font-medium">System Online</span>
            </div>
            <p className="text-[10px] text-white/20">© 2026 GJ 21 Cafe</p>
          </div>
        </aside>

        {/* ── MOBILE SIDEBAR OVERLAY ── */}
        {mobileSideOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={() => setMobileSideOpen(false)}
            />
            <aside className="relative z-10 w-64 bg-[#1a1009] flex flex-col min-h-full">
              <div className="px-5 py-5 border-b border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 bg-[#c89b3c] rounded-full flex items-center justify-center">
                    <span className="text-white font-bold text-sm">G</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-white">GJ 21 Cafe</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest">
                      Admin Panel
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setMobileSideOpen(false)}
                  className="text-white/40 hover:text-white"
                >
                  <FaTimes size={14} />
                </button>
              </div>

              <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
                <p className="text-[10px] font-semibold text-white/30 tracking-widest uppercase px-3 mb-3">
                  Navigation
                </p>
                {sidebarLinks.map(({ label, icon: Icon, path, exact }) => {
                  const active = isActive(path, exact);
                  return (
                    <Link
                      key={path}
                      to={path}
                      onClick={() => setMobileSideOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                        ${
                          active
                            ? "bg-[#c89b3c] text-white"
                            : "text-white/55 hover:bg-white/6 hover:text-white"
                        }`}
                    >
                      <Icon size={16} strokeWidth={1.5} />
                      {label}
                      {active && <span className="ml-auto text-white/60 text-xs">›</span>}
                    </Link>
                  );
                })}

                <div className="my-3 h-px bg-white/8" />

                <p className="text-[10px] font-semibold text-white/30 tracking-widest uppercase px-3 mb-2">
                  External
                </p>
                <Link
                  to="/"
                  className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-white/55 hover:bg-white/6 hover:text-white transition-all"
                >
                  <span className="flex items-center gap-3">
                    <Globe size={16} strokeWidth={1.5} />
                    Visit Website
                  </span>
                  <span className="text-white/30 text-xs">↗</span>
                </Link>
              </nav>

              {/* ✅ Logout in mobile sidebar */}
              <div className="px-3 py-4 border-t border-white/8">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all"
                >
                  <LogOut size={15} /> Sign Out
                </button>
                <div className="flex items-center gap-2 mt-3">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <span className="text-xs text-white/40">System Online</span>
                </div>
                <p className="text-[10px] text-white/20 mt-1">© 2026 GJ 21 Cafe</p>
              </div>
            </aside>
          </div>
        )}

        {/* Mobile bottom bar */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#1a1009] border-t border-white/10 px-6 py-3 flex justify-between items-center">
          <button
            onClick={() => setMobileSideOpen(true)}
            className="flex items-center gap-2 text-white/70 text-sm font-semibold"
          >
            <FaBars size={15} /> Admin Menu
          </button>
          <span className="text-[#c89b3c] text-xs font-bold tracking-widest uppercase">
            GJ 21 Cafe
          </span>
        </div>

        {/* ── PAGE CONTENT ── */}
       <main className="admin-scroll flex-1 min-h-0 min-w-0 px-4 sm:px-6 lg:px-8 py-8 pb-20 lg:pb-8 overflow-y-auto overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}