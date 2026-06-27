import React, { useEffect, useState } from "react";
import api from "../lib/apiClient";

export default function AdminFeedback() {

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [filterReview, setFilterReview] = useState("all");

  useEffect(() => {
    fetchFeedback();
  }, []);

  const fetchFeedback = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/orders?page=1&limit=50");
      const rated = res.data.orders.filter(o => o.rating > 0);
      setOrders(rated);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // ── FILTER LOGIC ──
  const filteredOrders = orders.filter(o => {
    const matchRating = filterRating === "all" || o.rating === Number(filterRating);
    const matchName   = filterName.trim() === "" ||
      o.deliveryAddress?.fullName?.toLowerCase().includes(filterName.toLowerCase());
    const matchReview =
      filterReview === "all" ? true :
      filterReview === "with" ? !!o.review :
      !o.review;
    return matchRating && matchName && matchReview;
  });

  // ── SUMMARY ──
  const avgRating = orders.length
    ? (orders.reduce((s, o) => s + o.rating, 0) / orders.length).toFixed(1)
    : 0;
  const ratingCounts = [5,4,3,2,1].map(r => ({
    star: r,
    count: orders.filter(o => o.rating === r).length,
    pct: orders.length ? Math.round((orders.filter(o => o.rating === r).length / orders.length) * 100) : 0,
  }));

  const starColor = (rating) => {
    if (rating >= 4) return "text-green-600 bg-green-50 border-green-100";
    if (rating === 3) return "text-yellow-600 bg-yellow-50 border-yellow-100";
    return "text-red-500 bg-red-50 border-red-100";
  };

  return (
    <div className="min-h-screen">

      {/* ── HEADING ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
          ⭐ Customer Feedback
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          {orders.length} reviews from customers
        </p>
      </div>

      {/* ── SUMMARY CARDS ── */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">

        {/* Avg rating */}
        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5 flex items-center gap-4">
          <div className="text-4xl font-extrabold text-[#c89b3c] leading-none">
            {avgRating}
          </div>
          <div>
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-1">
              Avg Rating
            </p>
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-base ${s <= Math.round(avgRating) ? "text-[#c89b3c]" : "text-stone-200"}`}>★</span>
              ))}
            </div>
          </div>
        </div>

        {/* Total reviews */}
        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
            Total Reviews
          </p>
          <p className="text-3xl font-bold text-blue-600">{orders.length}</p>
        </div>

        {/* 5 star count */}
        <div className="bg-green-50 border border-green-100 rounded-2xl p-5">
          <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
            5 Star Reviews
          </p>
          <p className="text-3xl font-bold text-green-600">
            {orders.filter(o => o.rating === 5).length}
          </p>
        </div>

      </div>

      {/* ── RATING DISTRIBUTION ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-8">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          Rating Distribution
        </p>
        <div className="flex flex-col gap-2.5">
          {ratingCounts.map(({ star, count, pct }) => (
            <div key={star} className="flex items-center gap-3 text-sm">
              <span className="text-xs font-semibold text-stone-500 w-6 text-right">{star}</span>
              <span className="text-[#c89b3c] text-sm">★</span>
              <div className="flex-1 h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#c89b3c] rounded-full transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-stone-400 w-8">{count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── FILTERS ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-6">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          🔍 Filter Reviews
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Search by name */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-400 tracking-wide">
              Customer Name
            </label>
            <input
              type="text"
              placeholder="Search by name..."
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
              text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2
              focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all"
            />
          </div>

          {/* Filter by rating */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-400 tracking-wide">
              Star Rating
            </label>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
              text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
              focus:border-[#c89b3c] transition-all"
            >
              <option value="all">All Ratings</option>
              <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
              <option value="4">⭐⭐⭐⭐ 4 Stars</option>
              <option value="3">⭐⭐⭐ 3 Stars</option>
              <option value="2">⭐⭐ 2 Stars</option>
              <option value="1">⭐ 1 Star</option>
            </select>
          </div>

          {/* Filter by review text */}
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-stone-400 tracking-wide">
              Review Text
            </label>
            <select
              value={filterReview}
              onChange={(e) => setFilterReview(e.target.value)}
              className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
              text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
              focus:border-[#c89b3c] transition-all"
            >
              <option value="all">All</option>
              <option value="with">With Review</option>
              <option value="without">Without Review</option>
            </select>
          </div>

        </div>
      </div>

      {/* ── RESULTS COUNT ── */}
      {!loading && (
        <p className="text-xs text-stone-400 font-medium mb-5">
          Showing <span className="text-stone-600 font-semibold">{filteredOrders.length}</span> reviews
        </p>
      )}

      {/* ── LOADING ── */}
      {loading && (
        <div className="flex flex-col items-center justify-center gap-3 py-20">
          <div className="w-10 h-10 border-4 border-amber-200 border-t-[#c89b3c] rounded-full animate-spin" />
          <p className="text-stone-400 text-sm">Loading feedback...</p>
        </div>
      )}

      {/* ── EMPTY ── */}
      {!loading && filteredOrders.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="text-5xl">😶</div>
          <p className="text-stone-500 font-semibold">No feedback found</p>
          <p className="text-stone-300 text-sm">Try adjusting your filters</p>
        </div>
      )}

      {/* ── FEEDBACK CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredOrders.map(order => (
          <div
            key={order._id}
            className={`bg-white rounded-2xl border shadow-sm p-5
            hover:shadow-md transition-all duration-200
            ${order.rating <= 2 ? "border-red-200 bg-red-50/40" : "border-stone-100"}`}
          >

            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">

              <div className="flex items-center gap-3">
                {/* Avatar */}
                <div className="w-10 h-10 rounded-xl bg-[#c89b3c]/10 border border-amber-200
                flex items-center justify-center text-sm font-bold text-[#c89b3c] flex-shrink-0">
                  {order.deliveryAddress?.fullName?.charAt(0)?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-bold text-stone-800 text-sm leading-tight">
                    {order.deliveryAddress?.fullName}
                  </p>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Order #{order._id.slice(-6)}
                  </p>
                </div>
              </div>

              {/* Star rating badge */}
              <div className={`flex items-center gap-1 px-3 py-1.5 rounded-xl border text-xs font-bold
                ${starColor(order.rating)}`}>
                <span>{order.rating}</span>
                <span>★</span>
              </div>

            </div>

            {/* Star row */}
            <div className="flex gap-0.5 mb-3">
              {[1,2,3,4,5].map(s => (
                <span key={s} className={`text-base ${s <= order.rating ? "text-[#c89b3c]" : "text-stone-200"}`}>
                  ★
                </span>
              ))}
            </div>

            {/* Review text */}
            {order.review ? (
              <div className="bg-stone-50 border border-stone-100 rounded-xl px-4 py-3">
                <p className="text-stone-600 text-sm leading-relaxed italic">
                  "{order.review}"
                </p>
              </div>
            ) : (
              <p className="text-stone-300 text-xs italic">No written review</p>
            )}

          </div>
        ))}
      </div>

    </div>
  );
}