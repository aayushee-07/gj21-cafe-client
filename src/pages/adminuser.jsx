import { useState, useEffect } from "react";
import api from "../lib/apiClient";
import { FiUsers, FiSearch, FiRefreshCw, FiShield, FiUser, FiMail, FiCalendar, FiPhone } from "react-icons/fi";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 10;

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/users");

      console.log("USERS FROM API:", res.data);

      setUsers(res.data);
      setFiltered(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    let result = [...users];

    if (roleFilter === "admin") {
      result = result.filter((u) => u.role === "admin");
    }

    if (roleFilter === "customer") {
      result = result.filter(
        (u) => u.role === "customer" || u.role === "user"
      );
    }

    if (roleFilter === "delivery") {
      result = result.filter((u) => u.role === "delivery");
    }

    if (search.trim()) {
      const q = search.toLowerCase();

      result = result.filter(
        (u) =>
          u.name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.phone?.toLowerCase().includes(q)
      );
    }

    setFiltered(result);
    setCurrentPage(1); // ✅ add this
  }, [search, roleFilter, users]);

  const totalUsers = users.length;
  const totalAdmins = users.filter((u) => u.role === "admin").length;
  const totalNormal = users.filter((u) => u.role === "customer").length;
  const totalDelivery = users.filter((u) => u.role === "delivery").length;
  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const totalPages = Math.ceil(filtered.length / usersPerPage);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;

  const currentUsers = filtered.slice(
    indexOfFirstUser,
    indexOfLastUser
  );

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-6 font-sans">

      {/* ── HEADER ── */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-800 flex items-center gap-3">
          <FiUsers className="text-[#c89b3c]" />
          User Management
        </h1>
        <p className="text-stone-500 mt-1 text-sm">All registered users of GJ 21 Cafe</p>
      </div>

      {/* ── STAT CARDS ── */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Total Users", value: totalUsers, color: "bg-blue-50   text-blue-600", border: "border-blue-200" },
          { label: "Admins", value: totalAdmins, color: "bg-amber-50  text-[#c89b3c]", border: "border-amber-200" },
          { label: "Customers", value: totalNormal, color: "bg-green-50  text-green-600", border: "border-green-200" },
          {
            label: "Delivery Boys",
            value: totalDelivery,
            color: "bg-purple-50 text-purple-600",
            border: "border-purple-200",
          }
        ].map(({ label, value, color, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-5 flex items-center gap-4 shadow-sm`}>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl font-bold ${color}`}>
              {value}
            </div>
            <span className="text-stone-600 font-medium">{label}</span>
          </div>
        ))}
      </div>

      {/* ── FILTERS ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-700 focus:outline-none focus:border-[#c89b3c] transition"
          />
        </div>

        <div className="flex items-center gap-3">
          {/* Role Filter */}
          <div className="flex gap-2">
            {["all", "admin", "customer", "delivery"].map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200
                  ${roleFilter === r
                    ? "bg-[#c89b3c] text-white shadow-sm"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                  }`}

              >
                {
                  r === "all"
                    ? "All"
                    : r === "admin"
                      ? "Admins"
                      : r === "customer"
                        ? "Customers"
                        : "Delivery Boys"
                }
              </button>
            ))}
          </div>

          {/* Refresh */}
          <button
            onClick={fetchUsers}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-100 text-stone-600 hover:bg-stone-200 text-sm font-medium transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── TABLE ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

        {loading ? (
          <div className="flex items-center justify-center py-20 text-stone-400">
            <FiRefreshCw className="animate-spin mr-2" /> Loading users...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-20 text-red-500">
            ⚠️ {error}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-stone-400">
            No users found.
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {["#", "Name", "Email", "Phone", "Role", "Joined"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {currentUsers.map((u, i) => (
                    <tr key={u._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4 text-stone-400 font-mono text-xs">
                        {indexOfFirstUser + i + 1}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#c89b3c]/10 flex items-center justify-center text-[#c89b3c] font-bold text-sm">
                            {u.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-stone-800">{u.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-stone-600">{u.email || "—"}</td>
                      <td className="px-5 py-4 text-stone-600">{u.phone || "—"}</td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold
      ${u.role === "admin"
                              ? "bg-amber-100 text-[#c89b3c]"
                              : u.role === "delivery"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-green-100 text-green-700"
                            }`}
                        >
                          {u.role === "admin"
                            ? "Admin"
                            : u.role === "delivery"
                              ? "Delivery"
                              : "Customer"}
                        </span>

                      </td>
                      <td className="px-5 py-4 text-stone-500 text-xs">{formatDate(u.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-stone-100">
              {currentUsers.map((u) => (
                <div key={u._id} className="p-4 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-full bg-[#c89b3c]/10 flex items-center justify-center text-[#c89b3c] font-bold text-lg flex-shrink-0">
                    {u.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-semibold text-stone-800 truncate">{u.name || "—"}</span>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold flex-shrink-0
                        ${u.role === "admin" ? "bg-amber-100 text-[#c89b3c]" : "bg-green-100 text-green-700"}`}>
                        {u.role === "admin" ? <FiShield /> : <FiUser />}
                        {u.role === "admin" ? "Admin" : "Customer"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-stone-500 text-xs mb-0.5">
                      <FiMail className="flex-shrink-0" /> <span className="truncate">{u.email || "—"}</span>
                    </div>
                    {u.phone && (
                      <div className="flex items-center gap-1 text-stone-500 text-xs mb-0.5">
                        <FiPhone className="flex-shrink-0" /> {u.phone}
                      </div>
                    )}
                    <div className="flex items-center gap-1 text-stone-400 text-xs">
                      <FiCalendar className="flex-shrink-0" /> Joined {formatDate(u.createdAt)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
              <p className="text-xs text-stone-400">
                Showing page{" "}
                <span className="font-semibold text-stone-600">{currentPage}</span> of{" "}
                <span className="font-semibold text-stone-600">{totalPages}</span>
              </p>

              <div className="flex items-center gap-2">

                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200
      bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-40
      disabled:cursor-not-allowed transition-all"
                >
                  <ChevronLeft size={15} />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <button
                    key={p}
                    onClick={() => setCurrentPage(p)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all duration-150
          ${currentPage === p
                        ? "bg-[#c89b3c] text-white shadow-sm"
                        : "border border-stone-200 bg-white text-stone-500 hover:bg-stone-100"
                      }`}
                  >
                    {p}
                  </button>
                ))}

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200
      bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-40
      disabled:cursor-not-allowed transition-all"
                >
                  <ChevronRight size={15} />
                </button>

              </div>
            </div>

            {/* Footer count */}
            <div className="px-5 py-3 border-t border-stone-100 bg-stone-50 text-xs text-stone-400">
              Showing {filtered.length} of {users.length} users
            </div>
          </>
        )}
      </div>
    </div>
  );
}