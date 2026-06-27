import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { Plus, Trash2, ToggleLeft, ToggleRight, X, Tag } from "lucide-react";

export default function AdminCoupons() {

  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showList, setShowList] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCouponId, setSelectedCouponId] = useState(null);

  // Filters
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSearch, setFilterSearch] = useState("");
  const [filterStart, setFilterStart] = useState("");
  const [filterEnd, setFilterEnd] = useState("");

  const [form, setForm] = useState({
    code: "",
    discountType: "percentage",
    discountValue: "",
    minOrderAmount: "",
    startDate: "",
    expiryDate: "",
  });

  /* ===============================
     FETCH COUPONS
  =============================== */
  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await api.get("/coupons");
      setCoupons(res.data);
    } catch (err) {
      console.error("Fetch coupon error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchCoupons(); }, []);

  /* ===============================
     CREATE COUPON
  =============================== */
  const handleSubmit = async () => {
    try {
      await api.post("/coupons", form);
      setForm({
        code: "",
        discountType: "percentage",
        discountValue: "",
        minOrderAmount: "",
        startDate: "",
        expiryDate: "",
      });
      fetchCoupons();
    } catch (err) {
      console.error(err.response?.data?.message || "Error creating coupon");
    }
  };

  /* ===============================
     TOGGLE ACTIVE
  =============================== */
  const toggleCoupon = async (id) => {
    await api.put(`/coupons/${id}/toggle`);
    fetchCoupons();
  };

  /* ===============================
     DELETE COUPON
  =============================== */
  const openDeleteModal = (id) => {
    setSelectedCouponId(id);
    setDeleteModal(true);
  };

  const confirmDelete = async () => {
    await api.delete(`/coupons/${selectedCouponId}`);
    setDeleteModal(false);
    setSelectedCouponId(null);
    fetchCoupons();
  };

  /* ===============================
     FILTERED COUPONS
  =============================== */
  const filteredCoupons = coupons.filter(c => {
    const matchStatus =
      filterStatus === "all" ? true :
      filterStatus === "active" ? c.isActive :
      !c.isActive;

    const matchSearch = filterSearch.trim() === "" ||
      c.code.toLowerCase().includes(filterSearch.toLowerCase());

    const matchStart = filterStart === "" ||
      new Date(c.startDate) >= new Date(filterStart);

    const matchEnd = filterEnd === "" ||
      new Date(c.expiryDate) <= new Date(filterEnd);

    return matchStatus && matchSearch && matchStart && matchEnd;
  });

  /* ═══════════════════════════════════
      PAGE 1 — CREATE COUPON
  ═══════════════════════════════════ */
  if (!showList) {
    return (
      <div className="min-h-screen flex items-start justify-center pt-8">
        <div className="w-full max-w-xl">

          <div className="mb-6">
            <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">
              Admin Panel
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
              🎟️ Create Coupon
            </h1>
            <p className="text-stone-400 text-sm mt-1">
              Fill in the details to create a new discount coupon.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-7">
            <div className="flex flex-col gap-5">

              {/* Code */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-500 tracking-wide">
                  Coupon Code <span className="text-[#c89b3c]">*</span>
                </label>
                <input
                  placeholder="e.g. SAVE20"
                  value={form.code}
                  onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                  text-stone-800 placeholder:text-stone-300 font-mono tracking-widest
                  focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
                  transition-all uppercase"
                />
              </div>

              {/* Discount type + value */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-stone-500 tracking-wide">
                    Discount Type <span className="text-[#c89b3c]">*</span>
                  </label>
                  <select
                    value={form.discountType}
                    onChange={(e) => setForm({ ...form, discountType: e.target.value })}
                    className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                    text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
                    focus:border-[#c89b3c] transition-all"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat (₹)</option>
                  </select>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-stone-500 tracking-wide">
                    Discount Value <span className="text-[#c89b3c]">*</span>
                  </label>
                  <input
                    type="number"
                    placeholder={form.discountType === "percentage" ? "e.g. 20" : "e.g. 50"}
                    value={form.discountValue}
                    onChange={(e) => setForm({ ...form, discountValue: e.target.value })}
                    className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                    text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2
                    focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
                  />
                </div>
              </div>

              {/* Min order */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-500 tracking-wide">
                  Minimum Order Amount (₹)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 200"
                  value={form.minOrderAmount}
                  onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })}
                  className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                  text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2
                  focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
                />
              </div>

              {/* Start + Expiry dates */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-stone-500 tracking-wide">
                    Start Date <span className="text-[#c89b3c]">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.startDate}
                    onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                    text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
                    focus:border-[#c89b3c] transition-all"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-xs font-medium text-stone-500 tracking-wide">
                    Expiry Date <span className="text-[#c89b3c]">*</span>
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate}
                    onChange={(e) => setForm({ ...form, expiryDate: e.target.value })}
                    className="border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl text-sm
                    text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
                    focus:border-[#c89b3c] transition-all"
                  />
                </div>
              </div>

            </div>

            {/* Buttons */}
            <div className="flex items-center gap-3 mt-7 pt-6 border-t border-stone-100">
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
                px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-green-200
                hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <Plus size={16} /> Create Coupon
              </button>
              <button
                onClick={() => setShowList(true)}
                className="flex items-center gap-2 bg-[#c89b3c] hover:bg-[#b88a2f] text-white
                px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-amber-200
                hover:-translate-y-0.5 active:translate-y-0 transition-all"
              >
                <Tag size={15} /> View Coupons →
              </button>
            </div>

          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════
      PAGE 2 — COUPONS LIST
  ═══════════════════════════════════ */
  return (
    <div className="min-h-screen">

      {/* Heading */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">
            Admin Panel
          </p>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
            🎟️ Coupon Management
          </h1>
          <p className="text-stone-400 text-sm mt-1">
            {coupons.length} total coupons
          </p>
        </div>
        <button
          onClick={() => setShowList(false)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white
          px-5 py-2.5 rounded-xl text-sm font-semibold shadow-md shadow-green-200
          hover:-translate-y-0.5 active:translate-y-0 transition-all"
        >
          <Plus size={15} /> Create Coupon
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-6">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          🔍 Filter Coupons
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

          {/* Search by code */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-400 tracking-wide">Search Code</label>
            <input
              type="text"
              placeholder="e.g. SAVE20"
              value={filterSearch}
              onChange={(e) => setFilterSearch(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
              text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2
              focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
            />
          </div>

          {/* Status filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-400 tracking-wide">Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
              text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
              focus:border-[#c89b3c] transition-all"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Start date filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-400 tracking-wide">From Date</label>
            <input
              type="date"
              value={filterStart}
              onChange={(e) => setFilterStart(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
              text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
              focus:border-[#c89b3c] transition-all"
            />
          </div>

          {/* End date filter */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-400 tracking-wide">To Date</label>
            <input
              type="date"
              value={filterEnd}
              onChange={(e) => setFilterEnd(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
              text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
              focus:border-[#c89b3c] transition-all"
            />
          </div>

        </div>
      </div>

      {/* Coupons Table */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">

        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <p className="text-sm font-bold text-stone-700">
            All Coupons
            <span className="ml-2 bg-stone-100 text-stone-500 text-xs font-semibold
            px-2 py-0.5 rounded-full">{filteredCoupons.length}</span>
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-16">
            <div className="w-8 h-8 border-4 border-amber-200 border-t-[#c89b3c] rounded-full animate-spin" />
            <p className="text-stone-400 text-sm">Loading coupons...</p>
          </div>
        ) : filteredCoupons.length === 0 ? (
          <div className="text-center py-16 text-stone-400 text-sm">
            No coupons found
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">

              <thead>
                <tr className="bg-stone-50 border-b border-stone-100">
                  {["Code","Type","Value","Min Order","Start","Expiry","Status","Actions"].map(h => (
                    <th key={h} className="px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-stone-50">
                {filteredCoupons.map((c) => (
                  <tr key={c._id} className="hover:bg-stone-50 transition-colors duration-100">

                    <td className="px-5 py-4">
                      <span className="font-mono font-bold text-stone-800 tracking-widest text-xs
                      bg-stone-100 px-2.5 py-1 rounded-lg">
                        {c.code}
                      </span>
                    </td>

                    <td className="px-5 py-4 capitalize text-stone-600 text-xs font-medium">
                      {c.discountType}
                    </td>

                    <td className="px-5 py-4 font-bold text-[#c89b3c]">
                      {c.discountType === "percentage"
                        ? `${c.discountValue}%`
                        : `₹${c.discountValue}`}
                    </td>

                    <td className="px-5 py-4 text-stone-600 text-sm">
                      ₹{c.minOrderAmount}
                    </td>

                    <td className="px-5 py-4 text-stone-500 text-xs whitespace-nowrap">
                      {c.startDate ? new Date(c.startDate).toLocaleDateString("en-IN") : "—"}
                    </td>

                    <td className="px-5 py-4 text-stone-500 text-xs whitespace-nowrap">
                      {new Date(c.expiryDate).toLocaleDateString("en-IN")}
                    </td>

                    <td className="px-5 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold
                        ${c.isActive
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-500"}`}>
                        {c.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleCoupon(c._id)}
                          className={`flex items-center gap-1 px-3 py-1.5 text-xs font-semibold
                          rounded-lg border transition-all
                          ${c.isActive
                            ? "bg-orange-50 border-orange-200 text-orange-600 hover:bg-orange-100"
                            : "bg-green-50 border-green-200 text-green-600 hover:bg-green-100"
                          }`}
                        >
                          {c.isActive
                            ? <><ToggleLeft size={12} /> Disable</>
                            : <><ToggleRight size={12} /> Enable</>
                          }
                        </button>

                        <button
                          onClick={() => openDeleteModal(c._id)}
                          className="flex items-center gap-1 px-3 py-1.5 bg-red-50
                          border border-red-200 text-red-500 text-xs font-semibold
                          rounded-lg hover:bg-red-100 transition-all"
                        >
                          <Trash2 size={11} /> Delete
                        </button>
                      </div>
                    </td>

                  </tr>
                ))}
              </tbody>

            </table>
          </div>
        )}

      </div>

      {/* DELETE MODAL */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center
        justify-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-sm p-7">

            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center
            justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>

            <h2 className="text-lg font-bold text-stone-800 text-center mb-1">
              Delete Coupon
            </h2>
            <p className="text-sm text-stone-400 text-center mb-6">
              Are you sure? This action cannot be undone.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => { setDeleteModal(false); setSelectedCouponId(null); }}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-500
                text-sm font-semibold hover:bg-stone-100 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white
                rounded-xl text-sm font-semibold shadow-md shadow-red-200 transition-all"
              >
                Delete
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}