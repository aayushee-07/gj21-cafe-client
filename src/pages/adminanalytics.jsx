import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  BarChart, Bar, ResponsiveContainer,
} from "recharts";

export default function AdminAnalytics() {

  const [data, setData] = useState([]);
  const [range, setRange] = useState("7");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      let url = `/admin/analytics?range=${range}`;
      if (range === "custom" && startDate && endDate) {
        url = `/admin/analytics?startDate=${startDate}&endDate=${endDate}`;
      }
      const res = await api.get(url);
      setData(res.data || []);
    } catch (err) {
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAnalytics(); }, [range]);

  // Summary stats from data
  const totalOrders  = data.reduce((s, d) => s + (d.orders || 0), 0);
  const totalRevenue = data.reduce((s, d) => s + (d.revenue || 0), 0);
  const avgOrders    = data.length ? (totalOrders / data.length).toFixed(1) : 0;
  const avgRevenue   = data.length ? (totalRevenue / data.length).toFixed(0) : 0;

  const rangePills = [
    { label: "7 Days",  value: "7"  },
    { label: "30 Days", value: "30" },
    { label: "90 Days", value: "90" },
    { label: "Custom",  value: "custom" },
  ];

  // Custom tooltip
  const CustomTooltip = ({ active, payload, label, prefix = "" }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border border-stone-200 rounded-xl shadow-lg px-4 py-3 text-sm">
          <p className="text-stone-400 text-xs mb-1">{label}</p>
          <p className="font-bold text-stone-800">
            {prefix}{payload[0].value?.toLocaleString()}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen">

      {/* ── HEADING ── */}
      <div className="mb-8">
        <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">
          Admin Panel
        </p>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">
          📊 Analytics Dashboard
        </h1>
        <p className="text-stone-400 text-sm mt-1">
          Track your cafe's orders and revenue over time
        </p>
      </div>

      {/* ── FILTER BAR ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-5 mb-8">
        <p className="text-xs font-semibold text-stone-400 uppercase tracking-widest mb-4">
          Date Range
        </p>
        <div className="flex flex-wrap items-center gap-3">

          {rangePills.map(({ label, value }) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-150
                ${range === value
                  ? "bg-[#c89b3c] text-white shadow-sm shadow-amber-200"
                  : "bg-stone-100 text-stone-500 hover:bg-stone-200"
                }`}
            >
              {label}
            </button>
          ))}

          {range === "custom" && (
            <>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border border-stone-200 bg-stone-50 px-3 py-2 rounded-xl text-sm
                text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
                focus:border-[#c89b3c] transition-all"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border border-stone-200 bg-stone-50 px-3 py-2 rounded-xl text-sm
                text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
                focus:border-[#c89b3c] transition-all"
              />
              <button
                onClick={fetchAnalytics}
                className="px-5 py-2 bg-[#c89b3c] hover:bg-[#b88a2f] text-white text-xs
                font-semibold rounded-xl shadow-sm shadow-amber-200 transition-all
                hover:-translate-y-0.5 active:translate-y-0"
              >
                Apply
              </button>
            </>
          )}

        </div>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center gap-3 py-24">
          <div className="w-10 h-10 border-4 border-amber-200 border-t-[#c89b3c] rounded-full animate-spin" />
          <p className="text-stone-400 text-sm">Loading analytics...</p>
        </div>

      ) : (
        <>

          {/* ── SUMMARY STAT CARDS ── */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

            {[
              { label: "Total Orders",   value: totalOrders,          color: "text-blue-600",  bg: "bg-blue-50",   border: "border-blue-100" },
              { label: "Total Revenue",  value: `₹${totalRevenue.toLocaleString()}`, color: "text-green-600", bg: "bg-green-50", border: "border-green-100" },
              { label: "Avg Orders/Day", value: avgOrders,            color: "text-purple-600", bg: "bg-purple-50", border: "border-purple-100" },
              { label: "Avg Revenue/Day",value: `₹${Number(avgRevenue).toLocaleString()}`, color: "text-[#c89b3c]", bg: "bg-amber-50", border: "border-amber-100" },
            ].map(({ label, value, color, bg, border }) => (
              <div key={label}
                className={`${bg} border ${border} rounded-2xl p-5
                hover:shadow-md transition-all duration-200 hover:-translate-y-0.5`}>
                <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide mb-2">
                  {label}
                </p>
                <p className={`text-2xl font-bold ${color}`}>{value}</p>
              </div>
            ))}

          </div>

          {/* ── ORDERS LINE CHART ── */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-stone-700">Orders Per Day</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Daily order count over selected period
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="w-3 h-0.5 bg-blue-500 inline-block rounded" />
                Orders
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1ece6" />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 11, fill: "#a8a29e" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a8a29e" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip />} />
                <Line
                  type="monotone"
                  dataKey="orders"
                  stroke="#3b82f6"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: "#3b82f6", strokeWidth: 0 }}
                  activeDot={{ r: 6, fill: "#3b82f6" }}
                />
              </LineChart>
            </ResponsiveContainer>

          </div>

          {/* ── REVENUE BAR CHART ── */}
          <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">

            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-sm font-bold text-stone-700">Revenue Per Day</h2>
                <p className="text-xs text-stone-400 mt-0.5">
                  Daily revenue (₹) over selected period
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-stone-400">
                <span className="w-3 h-3 bg-green-500 inline-block rounded" />
                Revenue
              </div>
            </div>

            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1ece6" />
                <XAxis
                  dataKey="_id"
                  tick={{ fontSize: 11, fill: "#a8a29e" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: "#a8a29e" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip content={<CustomTooltip prefix="₹" />} />
                <Bar
                  dataKey="revenue"
                  fill="#22c55e"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={48}
                />
              </BarChart>
            </ResponsiveContainer>

          </div>

        </>
      )}

    </div>
  );
}