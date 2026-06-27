// src/components/AdminHeader.jsx
import { useNavigate } from "react-router-dom";
import { Bell, Menu } from "lucide-react";

export default function AdminHeader({ title, subtitle }) {
  const user = JSON.parse(localStorage.getItem("user")) || null;

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <div className="flex items-center justify-between mb-8">

      {/* Left — title */}
      <div>
        <p className="text-xs font-semibold text-[#C17754] uppercase tracking-widest mb-0.5">
          {greeting}, {user?.name?.split(" ")[0] || "Admin"} 👋
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-stone-400 text-sm mt-1">{subtitle}</p>
        )}
      </div>

      {/* Right — date + bell */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:block text-right">
          <p className="text-xs font-semibold text-stone-500">
            {new Date().toLocaleDateString("en-IN", { weekday: "long" })}
          </p>
          <p className="text-xs text-stone-400">
            {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
          </p>
        </div>

        <div className="relative">
          <button className="w-9 h-9 rounded-xl bg-white border border-stone-200 flex items-center justify-center text-stone-400 hover:text-stone-600 hover:border-stone-300 transition-all shadow-sm">
            <Bell size={15} />
          </button>
          {/* notification dot */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#C17754] rounded-full border-2 border-[#F5EFE6]" />
        </div>
      </div>

    </div>
  );
}