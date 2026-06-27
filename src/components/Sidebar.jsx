// src/components/Sidebar.jsx
import { Link, useLocation } from "react-router-dom";
import { Users } from "lucide-react";
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
} from "lucide-react";

const navLinks = [
  { label: "Dashboard",    icon: LayoutDashboard, path: "/admin",               exact: true },
  { label: "Orders",       icon: ShoppingBag,     path: "/admin/orders" },
  { label: "Menu",         icon: UtensilsCrossed, path: "/admin/menu" },
  { label: "Feedback",     icon: MessageSquare,   path: "/admin/feedback" },
  { label: "Coupons",      icon: Ticket,          path: "/admin/coupons" },
  { label: "Analytics",    icon: TrendingUp,      path: "/admin/analytics" },
  { label: "Transactions", icon: CreditCard,      path: "/admin/transactions" },
  { label: "Users",         icon: Users,          path: "/admin/users" }
];

export default function Sidebar() {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const isActive = (path, exact) =>
    exact ? location.pathname === path : location.pathname.startsWith(path);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <aside className="w-64 min-h-screen bg-[#2C1A0E] flex flex-col flex-shrink-0">

      {/* Logo */}
      <div className="px-6 py-5 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[#C17754] rounded-xl flex items-center justify-center flex-shrink-0 shadow-md">
            <span className="text-white font-bold text-sm">GJ</span>
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-white tracking-wide">
              GJ <span className="text-[#C17754]">21</span> Cafe
            </p>
            <p className="text-[10px] text-white/40 tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-3 py-5 flex flex-col gap-1">
        <p className="text-[10px] font-semibold text-white/30 tracking-widest uppercase px-3 mb-2">
          Management
        </p>

        {navLinks.map(({ label, icon: Icon, path, exact }) => {
          const active = isActive(path, exact);
          return (
            <Link
              key={path}
              to={path}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200
                ${active
                  ? "bg-[#C17754] text-white shadow-md shadow-[#C17754]/30"
                  : "text-white/60 hover:bg-white/8 hover:text-white"
                }`}
            >
              <Icon size={16} className={active ? "text-white" : "text-white/50"} />
              {label}
            </Link>
          );
        })}

        <div className="my-3 h-px bg-white/10" />

        <p className="text-[10px] font-semibold text-white/30 tracking-widest uppercase px-3 mb-2">
          Site
        </p>

        <Link
          to="/"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:bg-white/8 hover:text-white transition-all duration-200"
        >
          <Globe size={16} className="text-white/50" />
          Back to Website
        </Link>
      </nav>

      {/* User + logout at bottom */}
      <div className="px-3 py-4 border-t border-white/10">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-white/5 mb-2">
          <div className="w-8 h-8 rounded-full bg-[#C17754] flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
            {user?.name?.charAt(0).toUpperCase() || "A"}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{user?.name || "Admin"}</p>
            <p className="text-[10px] text-white/40 truncate">{user?.email || ""}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/50 hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut size={15} />
          Sign Out
        </button>
      </div>

    </aside>
  );
}