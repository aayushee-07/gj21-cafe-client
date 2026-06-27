import React, { useEffect, useState } from "react";
import api from "../lib/apiClient";
import { CreditCard, Banknote, TrendingUp, Clock, RefreshCw } from "lucide-react";

export default function AdminTransactions() {

  const [activeTab, setActiveTab] = useState("orders");

  // ── DB ORDERS ──
  const [allOrders, setAllOrders]       = useState([]); // full list, never changes
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [filterMethod, setFilterMethod]   = useState("all");
  const [filterPayStatus, setFilterPayStatus] = useState("all");
  const [filterSearch, setFilterSearch]   = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  // ── STRIPE ──
  const [stripePayments, setStripePayments] = useState([]);
  const [stripeLoading, setStripeLoading]   = useState(false);
  const [stripeSummary, setStripeSummary]   = useState({
    all: 0, succeeded: 0, refunded: 0, disputed: 0, failed: 0
  });
  const [stripeFilter, setStripeFilter] = useState("all");

  useEffect(() => { fetchOrders(); }, []);
  useEffect(() => { if (activeTab === "stripe") fetchStripe(); }, [activeTab]);

  // ✅ fetch all orders once with high limit — filter client-side
  const fetchOrders = async () => {
    try {
      setOrdersLoading(true);
      const res = await api.get("/admin/orders?limit=1000&page=1");
      setAllOrders(res.data.orders || []);
    } catch (err) { console.error(err); }
    finally { setOrdersLoading(false); }
  };

  const fetchStripe = async () => {
    try {
      setStripeLoading(true);
      const res = await api.get("/payment/stripe-transactions");
      const payments = res.data || [];
      setStripePayments(payments);
      setStripeSummary({
        all:       payments.length,
        succeeded: payments.filter(p => p.status === "succeeded" && !p.refunded).length,
        refunded:  payments.filter(p => p.refunded).length,
        disputed:  payments.filter(p => p.dispute).length,
        failed:    payments.filter(p => p.status === "failed").length,
      });
    } catch (err) { console.error(err); }
    finally { setStripeLoading(false); }
  };

  // ✅ ALL 3 FILTERS work together on full dataset
  const filtered = allOrders.filter(o => {
    // Filter 1 — Payment Method
    const matchMethod =
      filterMethod === "all" ? true :
      filterMethod === "ONLINE" ? o.paymentMethod === "ONLINE" :
      o.paymentMethod === "COD";

    // Filter 2 — Payment Status (paid / unpaid / failed)
    const matchPayStatus =
      filterPayStatus === "all"    ? true :
      filterPayStatus === "paid"   ? o.paymentStatus === "paid" :
      filterPayStatus === "failed" ? o.paymentStatus === "failed" :
      filterPayStatus === "unpaid" ? (o.paymentStatus !== "paid" && o.paymentStatus !== "failed") :
      true;

    // Filter 3 — Search by order ID or customer name
    const matchSearch =
      filterSearch.trim() === "" ? true :
      o._id.slice(-6).toLowerCase().includes(filterSearch.toLowerCase()) ||
      o.deliveryAddress?.fullName?.toLowerCase().includes(filterSearch.toLowerCase());

    return matchMethod && matchPayStatus && matchSearch;
  });

  // reset to page 1 whenever filter changes
  const setMethodFilter = (v) => { setFilterMethod(v); setPage(1); };
  const setPayFilter    = (v) => { setFilterPayStatus(v); setPage(1); };
  const setSearch       = (v) => { setFilterSearch(v); setPage(1); };

  const totalPages = Math.ceil(filtered.length / PER_PAGE);
  const paginated  = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const filteredStripe = stripePayments.filter(p => {
    if (stripeFilter === "all")       return true;
    if (stripeFilter === "succeeded") return p.status === "succeeded" && !p.refunded;
    if (stripeFilter === "refunded")  return p.refunded;
    if (stripeFilter === "failed")    return p.status === "failed";
    return true;
  });

  // Summary always from full dataset
  const totalRevenue = allOrders.filter(o => o.paymentStatus === "paid")
    .reduce((s, o) => s + (o.finalTotal || o.totalPrice || 0), 0);
  const onlineCount  = allOrders.filter(o => o.paymentMethod === "ONLINE").length;
  const codCount     = allOrders.filter(o => o.paymentMethod === "COD").length;
  const pendingCount = allOrders.filter(o => o.paymentStatus === "pending").length;

  const payStatusStyle = (s) => ({
    paid:    "bg-green-100 text-green-700",
    pending: "bg-yellow-100 text-yellow-700",
    failed:  "bg-red-100 text-red-500",
  }[s] || "bg-stone-100 text-stone-500");

  const orderStatusStyle = (s) => ({
    delivered:        "bg-green-100 text-green-700",
    cancelled:        "bg-red-100 text-red-500",
    out_for_delivery: "bg-orange-100 text-orange-700",
    preparing:        "bg-purple-100 text-purple-700",
    confirmed:        "bg-blue-100 text-blue-700",
    pending:          "bg-yellow-100 text-yellow-700",
  }[s] || "bg-stone-100 text-stone-500");

  const stripeStatusStyle = (p) => {
    if (p.refunded)               return "bg-orange-100 text-orange-700";
    if (p.status === "succeeded") return "bg-green-100 text-green-700";
    if (p.status === "failed")    return "bg-red-100 text-red-500";
    return "bg-stone-100 text-stone-500";
  };

  const stripeStatusLabel = (p) => {
    if (p.refunded)               return "Refunded";
    if (p.status === "succeeded") return "Succeeded ✓";
    if (p.status === "failed")    return "Failed";
    return p.status;
  };

  return (
    <div className="min-h-screen">

      {/* Heading */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">💳 Transactions</h1>
        <p className="text-stone-400 text-sm mt-1">All payment records — COD, Online & Stripe</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Revenue", value: `₹${totalRevenue.toLocaleString()}`, color: "text-green-600", bg: "bg-green-50 border-green-100",   icon: <TrendingUp size={14} className="text-green-500" /> },
          { label: "Online",  value: onlineCount,  color: "text-blue-600",   bg: "bg-blue-50 border-blue-100",     icon: <CreditCard size={14} className="text-blue-400" /> },
          { label: "COD",     value: codCount,     color: "text-stone-700",  bg: "bg-stone-50 border-stone-100",   icon: <Banknote size={14} className="text-stone-400" /> },
          { label: "Pending", value: pendingCount, color: "text-yellow-600", bg: "bg-yellow-50 border-yellow-100", icon: <Clock size={14} className="text-yellow-500" /> },
        ].map(({ label, value, color, bg, icon }) => (
          <div key={label} className={`${bg} border rounded-2xl p-5`}>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">{label}</p>
              {icon}
            </div>
            <p className={`text-2xl font-bold ${color}`}>{value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 bg-white border border-stone-200
        rounded-2xl p-1.5 w-fit shadow-sm">
        {[
          { key: "orders", label: "📦 All Orders" },
          { key: "stripe", label: "💳 Stripe Payments" },
        ].map(({ key, label }) => (
          <button key={key} onClick={() => setActiveTab(key)}
            className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150
              ${activeTab === key
                ? "bg-[#c89b3c] text-white shadow-sm shadow-amber-200"
                : "text-stone-500 hover:text-stone-700"
              }`}>
            {label}
          </button>
        ))}
      </div>

      {/* ══ TAB 1 — ORDERS ══ */}
      {activeTab === "orders" && (
        <div>

          {/* ✅ 3 working filters */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-6">
            <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">🔍 Filter</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

              {/* Search */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-400">Search Order / Name</label>
                <input type="text" placeholder="Order ID or customer name..."
                  value={filterSearch}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
                  text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2
                  focus:ring-[#c89b3c]/40 focus:border-[#c89b3c] transition-all" />
              </div>

              {/* ✅ Payment Method */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-400">Payment Method</label>
                <select value={filterMethod} onChange={(e) => setMethodFilter(e.target.value)}
                  className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
                  text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
                  focus:border-[#c89b3c] transition-all">
                  <option value="all">All Methods</option>
                  <option value="ONLINE">💳 Online (Stripe)</option>
                  <option value="COD">💵 Cash on Delivery</option>
                </select>
              </div>

              {/* ✅ Payment Status */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-400">Payment Status</label>
                <select value={filterPayStatus} onChange={(e) => setPayFilter(e.target.value)}
                  className="border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl text-sm
                  text-stone-600 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
                  focus:border-[#c89b3c] transition-all">
                  <option value="all">All Status</option>
                  <option value="paid">✅ Paid</option>
                  <option value="unpaid">❌ Unpaid / Pending</option>
                  <option value="failed">⚠️ Failed</option>
                </select>
              </div>

            </div>

            {/* Active filter tags + clear */}
            {(filterMethod !== "all" || filterPayStatus !== "all" || filterSearch) && (
              <div className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-stone-100">
                <span className="text-xs text-stone-400 font-medium">Active:</span>
                {filterMethod !== "all" && (
                  <span className="flex items-center gap-1 bg-blue-50 border border-blue-200 text-blue-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    {filterMethod === "ONLINE" ? "💳 Online" : "💵 COD"}
                    <button onClick={() => setMethodFilter("all")} className="ml-1 hover:text-blue-900">×</button>
                  </span>
                )}
                {filterPayStatus !== "all" && (
                  <span className="flex items-center gap-1 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-2.5 py-1 rounded-lg capitalize">
                    {filterPayStatus === "unpaid" ? "Unpaid / Pending" : filterPayStatus}
                    <button onClick={() => setPayFilter("all")} className="ml-1 hover:text-amber-900">×</button>
                  </span>
                )}
                {filterSearch && (
                  <span className="flex items-center gap-1 bg-stone-100 border border-stone-200 text-stone-600 text-xs font-semibold px-2.5 py-1 rounded-lg">
                    "{filterSearch}"
                    <button onClick={() => setSearch("")} className="ml-1 hover:text-stone-900">×</button>
                  </span>
                )}
                <button
                  onClick={() => { setMethodFilter("all"); setPayFilter("all"); setSearch(""); }}
                  className="text-xs text-red-400 hover:text-red-600 font-semibold underline ml-1">
                  Clear all
                </button>
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex justify-between items-center">
              <p className="text-sm font-bold text-stone-700">
                Transactions
                <span className="ml-2 bg-stone-100 text-stone-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {filtered.length}
                </span>
              </p>
              <p className="text-xs text-stone-400">Page {page} of {totalPages || 1}</p>
            </div>

            {ordersLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="w-9 h-9 border-4 border-amber-200 border-t-[#c89b3c] rounded-full animate-spin" />
                <p className="text-stone-400 text-sm">Loading...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-3">
                <div className="text-4xl">🔍</div>
                <p className="text-stone-500 font-semibold text-sm">No orders match your filters</p>
                <button
                  onClick={() => { setMethodFilter("all"); setPayFilter("all"); setSearch(""); }}
                  className="text-xs text-[#c89b3c] font-semibold hover:underline">
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      {["Order","Customer","Amount","Method","Payment","Status","Date"].map(h => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {paginated.map(order => (
                      <tr key={order._id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4">
                          <span className="font-mono font-bold text-stone-700 text-xs bg-stone-100 px-2 py-1 rounded-lg">
                            #{order._id.slice(-6)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <p className="font-medium text-stone-700">{order.deliveryAddress?.fullName}</p>
                          <p className="text-xs text-stone-400">{order.deliveryAddress?.phone}</p>
                        </td>
                        <td className="px-5 py-4 font-bold text-stone-800">
                          ₹{order.finalTotal || order.totalPrice}
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold
                            ${order.paymentMethod === "ONLINE" ? "bg-blue-100 text-blue-700" : "bg-stone-100 text-stone-600"}`}>
                            {order.paymentMethod === "ONLINE" ? "💳 Online" : "💵 COD"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize
                            ${payStatusStyle(order.paymentStatus)}`}>
                            {order.paymentStatus || "pending"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold capitalize
                            ${orderStatusStyle(order.status)}`}>
                            {order.status?.replaceAll("_"," ")}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-stone-500 text-xs whitespace-nowrap">
                          {new Date(order.createdAt).toLocaleString("en-IN",{
                            day:"2-digit", month:"short", year:"numeric",
                            hour:"2-digit", minute:"2-digit"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
                <p className="text-xs text-stone-400">
                  {(page-1)*PER_PAGE+1}–{Math.min(page*PER_PAGE, filtered.length)} of {filtered.length}
                </p>
                <div className="flex items-center gap-1.5">
                  <button disabled={page===1} onClick={() => setPage(p=>p-1)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-500
                    text-xs font-semibold hover:bg-stone-100 disabled:opacity-40 transition-all">
                    ← Prev
                  </button>
                  {Array.from({length: Math.min(totalPages, 5)}, (_, i) => i + 1).map(p => (
                    <button key={p} onClick={() => setPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all
                        ${page===p ? "bg-[#c89b3c] text-white" : "border border-stone-200 bg-white text-stone-500 hover:bg-stone-100"}`}>
                      {p}
                    </button>
                  ))}
                  <button disabled={page===totalPages} onClick={() => setPage(p=>p+1)}
                    className="px-3 py-1.5 rounded-lg border border-stone-200 bg-white text-stone-500
                    text-xs font-semibold hover:bg-stone-100 disabled:opacity-40 transition-all">
                    Next →
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ══ TAB 2 — STRIPE ══ */}
      {activeTab === "stripe" && (
        <div>
          <div className="flex flex-wrap items-center gap-3 mb-6">
            {[
              { key: "all",       label: "All",       count: stripeSummary.all },
              { key: "succeeded", label: "Succeeded", count: stripeSummary.succeeded },
              { key: "refunded",  label: "Refunded",  count: stripeSummary.refunded },
              { key: "disputed",  label: "Disputed",  count: stripeSummary.disputed },
              { key: "failed",    label: "Failed",    count: stripeSummary.failed },
            ].map(({ key, label, count }) => (
              <button key={key} onClick={() => setStripeFilter(key)}
                className={`px-5 py-2.5 rounded-xl border text-sm font-semibold
                transition-all duration-150 flex items-center gap-2
                ${stripeFilter === key
                  ? "bg-[#c89b3c] text-white border-[#c89b3c] shadow-sm shadow-amber-200"
                  : "bg-white border-stone-200 text-stone-600 hover:bg-stone-50"
                }`}>
                {label}
                <span className={`text-xs font-bold ${stripeFilter === key ? "text-white/80" : "text-stone-400"}`}>
                  {count}
                </span>
              </button>
            ))}
            <button onClick={fetchStripe}
              className="ml-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl border
              border-stone-200 bg-white text-stone-500 text-sm font-semibold
              hover:bg-stone-100 transition-all">
              <RefreshCw size={13} /> Refresh
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <p className="text-sm font-bold text-stone-700">
                Stripe Payments
                <span className="ml-2 bg-stone-100 text-stone-500 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {filteredStripe.length}
                </span>
              </p>
              <div className="flex items-center gap-2 bg-indigo-50 border border-indigo-100 rounded-xl px-3 py-1.5">
                <div className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
                <span className="text-xs font-semibold text-indigo-600">Live from Stripe</span>
              </div>
            </div>

            {stripeLoading ? (
              <div className="flex flex-col items-center justify-center gap-3 py-16">
                <div className="w-9 h-9 border-4 border-indigo-200 border-t-indigo-500 rounded-full animate-spin" />
                <p className="text-stone-400 text-sm">Fetching from Stripe...</p>
              </div>
            ) : filteredStripe.length === 0 ? (
              <div className="text-center py-16 text-stone-400 text-sm">No Stripe payments found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="bg-stone-50 border-b border-stone-100">
                      {["Amount","Currency","Payment Method","Description","Customer","Status","Date"].map(h => (
                        <th key={h} className="px-5 py-3 text-xs font-semibold text-stone-400 uppercase tracking-widest whitespace-nowrap">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {filteredStripe.map(payment => (
                      <tr key={payment.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-5 py-4 font-bold text-stone-800">₹{(payment.amount/100).toLocaleString()}</td>
                        <td className="px-5 py-4 text-xs font-semibold text-stone-500 uppercase">{payment.currency}</td>
                        <td className="px-5 py-4">
                          {payment.payment_method_details?.card ? (
                            <div className="flex items-center gap-2">
                              <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                                {payment.payment_method_details.card.brand}
                              </span>
                              <span className="text-stone-500 text-xs font-mono">•••• {payment.payment_method_details.card.last4}</span>
                            </div>
                          ) : <span className="text-stone-400 text-xs">—</span>}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-stone-500 text-xs font-mono truncate max-w-[140px] block">
                            {payment.description || payment.id?.slice(0,22)+"..."}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-stone-600 text-xs">
                            {payment.billing_details?.email || payment.receipt_email || "—"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${stripeStatusStyle(payment)}`}>
                            {stripeStatusLabel(payment)}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-stone-500 text-xs whitespace-nowrap">
                          {new Date(payment.created*1000).toLocaleString("en-IN",{
                            day:"2-digit", month:"short", year:"numeric",
                            hour:"2-digit", minute:"2-digit"
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

    </div>
  );
}