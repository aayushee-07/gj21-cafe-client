import { useState, useEffect } from "react";
import { FiNavigation } from "react-icons/fi";
import {
  FiTruck, FiUsers, FiCheckCircle, FiXCircle, FiPackage,
  FiSearch, FiRefreshCw, FiEye, FiEdit2, FiTrash2,
  FiToggleLeft, FiToggleRight, FiPhone,
  FiMail, FiCalendar, FiAlertTriangle, FiStar, FiClock,
  FiPlusCircle, FiChevronDown, FiUserPlus
} from "react-icons/fi";
import { X } from "lucide-react";
import api from "../lib/apiClient";

const STATUS_STYLE = {
  assigned: "bg-blue-100 text-blue-700",
  pickup: "bg-purple-100 text-purple-700",
  intransit: "bg-amber-100 text-[#c89b3c]",
  delivered: "bg-green-100 text-green-700",
  cancelled: "bg-red-100 text-red-600",
};
const STATUS_LABEL = {
  assigned: "Assigned",
  pickup: "Pickup",
  intransit: "In Transit",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

const STATUS_OPTIONS = [
  "assigned",
  "pickup",
  "intransit",
  "delivered",
  "cancelled",
];

export default function AdminDeliveryManagement() {
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formError, setFormError] = useState("");
  const [addError, setAddError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updating, setUpdating] = useState(null);
  const [modalItemPage, setModalItemPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [ordersPage, setOrdersPage] = useState(1);
  const ordersPerPage = 10;

  // Modals
  const [viewModal, setViewModal] = useState(null);
  const [editModal, setEditModal] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);
  const [addModal, setAddModal] = useState(false);
  const [assignModal, setAssignModal] = useState(false);

  // Forms
  const [editForm, setEditForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [addForm, setAddForm] = useState({ name: "", email: "", phone: "", password: "" });
  const [assignForm, setAssignForm] = useState({ orderId: "", deliveryBoyId: "" });

  // Loading states
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [adding, setAdding] = useState(false);
  const [assigning, setAssigning] = useState(false);
  const [togglingId, setTogglingId] = useState(null);

  // Unassigned orders for assign modal
  const [unassignedOrders, setUnassignedOrders] = useState([]);

  // ── Fetch delivery boys ──
  const fetchDeliveryBoys = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/admin/delivery-boy");
      setDeliveryBoys(res.data || []);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch delivery boys");
    } finally {
      setLoading(false);
    }
  };

  // ── Fetch recent assigned orders ──
  const fetchRecentOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get("/admin/delivery-orders/recent");
      setRecentOrders(res.data.orders || []);
    } catch {
      setRecentOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  };

  // ── Fetch unassigned orders ──
  const fetchUnassignedOrders = async () => {
    try {
      const res = await api.get("/admin/orders/unassigned");
      setUnassignedOrders(res.data.orders || res.data || []);
    } catch {
      setUnassignedOrders([]);
    }
  };

  useEffect(() => {
    fetchDeliveryBoys();
    fetchRecentOrders();
  }, []);

  // ── Filter ──
  const filtered = deliveryBoys.filter((b) => {
    const matchSearch =
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.toLowerCase().includes(search.toLowerCase());
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "active" && b.isActive !== false) ||
      (statusFilter === "inactive" && b.isActive === false);
    return matchSearch && matchStatus;
  });
  const totalPages = Math.ceil(filtered.length / itemsPerPage);

  const currentUsers = filtered.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalOrderPages = Math.ceil(
    recentOrders.length / ordersPerPage
  );

  const currentOrders = recentOrders.slice(
    (ordersPage - 1) * ordersPerPage,
    ordersPage * ordersPerPage
  );

  // ── Stats ──
  const totalBoys = deliveryBoys.length;
  const totalAssigned = deliveryBoys.reduce((s, b) => s + (b.assigned || 0), 0);
  const totalDelivered = deliveryBoys.reduce((s, b) => s + (b.delivered || 0), 0);
  const totalCancelled = deliveryBoys.reduce((s, b) => s + (b.cancelled || 0), 0);
  // ✅ Fixed: use inTransit (capital T) to match backend field
  const totalTransit = deliveryBoys.reduce((s, b) => s + (b.inTransit || b.intransit || b.transit || 0), 0);

  const totalDeliveries = totalDelivered + totalCancelled;
  const successRate = totalDeliveries > 0
    ? ((totalDelivered / totalDeliveries) * 100).toFixed(1)
    : "0.0";

  // ── Toggle active ──
  const handleToggleActive = async (boy) => {
    setTogglingId(boy._id);
    try {
      await api.patch(`/admin/delivery-boy/${boy._id}/toggle-active`);
      setDeliveryBoys((prev) =>
        prev.map((b) => b._id === boy._id ? { ...b, isActive: !b.isActive } : b)
      );
    } catch (err) {
      alert(err.response?.data?.error || "Toggle failed");
    } finally {
      setTogglingId(null);
    }
  };

  // ── Edit ──
  const openEdit = (boy) => {
    setEditForm({ name: boy.name || "", email: boy.email || "", phone: boy.phone || "", });
    setEditModal(boy);
  };
  const handleEdit = async () => {
    setSaving(true);
    try {
      const payload = { name: editForm.name, email: editForm.email, phone: editForm.phone };
      if (editForm.password) payload.password = editForm.password;
      await api.put(`/admin/delivery-boy/${editModal._id}`, payload);
      setDeliveryBoys((prev) =>
        prev.map((b) => b._id === editModal._id ? { ...b, ...payload } : b)
      );
      setEditModal(null);
    } catch (err) {
      alert(err.response?.data?.error || "Update failed");
    } finally {
      setSaving(false);
    }
  };

  // ── Delete ──
  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/admin/delivery-boy/${deleteModal._id}`);
      setDeliveryBoys((prev) => prev.filter((b) => b._id !== deleteModal._id));
      setDeleteModal(null);
    } catch (err) {
      alert(err.response?.data?.error || "Delete failed");
    } finally {
      setDeleting(false);
    }
  };

  // ── Add Delivery Boy ──
  const openAdd = () => {
    setFormError("");
    setAddForm({
      name: "",
      email: "",
      phone: "",
    });
    setAddModal(true);
  };
  const handleAdd = async () => {
    setAddError("");

    if (!addForm.name.trim()) {
      setAddError("Full Name is required.");
      return;
    }

    if (!addForm.email.trim()) {
      setAddError("Email is required.");
      return;
    }

    if (!addForm.phone.trim()) {
      setAddError("Phone Number is required.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(addForm.email)) {
      setAddError("Please enter a valid email address.");
      return;
    }

    if (!/^\d{10}$/.test(addForm.phone)) {
      setAddError("Phone number must be 10 digits.");
      return;
    }

    setAdding(true);

    try {
      const res = await api.post("/admin/delivery-boy", {
        ...addForm,
        role: "delivery",
      });

      setDeliveryBoys((prev) => [
        res.data.deliveryBoy || res.data,
        ...prev,
      ]);

      setAddModal(false);

      setAddForm({
        name: "",
        email: "",
        phone: "",
        password: "",
      });

    } catch (err) {
      setAddError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add delivery boy."
      );
    } finally {
      setAdding(false);
    }
  };

  const getCustomerName = (order) =>
    order.user?.name ||
    order.deliveryAddress?.fullName ||
    "N/A";

  const getCustomerPhone = (order) =>
    order.deliveryAddress?.phone ||
    order.phone ||
    "N/A";

  const callCustomer = (phone) => {
    if (phone) {
      window.location.href = `tel:${phone}`;
    }
  };

  const openInMaps = (address) => {
    const query = [
      address?.house,
      address?.street,
      address?.area,
      address?.city,
      address?.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    window.open(
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`,
      "_blank"
    );
  };
  // ── Assign Order ──
  const openAssign = async () => {
    await fetchUnassignedOrders();
    setAssignForm({ orderId: "", deliveryBoyId: "" });
    setAssignModal(true);
  };
  const handleAssign = async () => {
    if (!assignForm.orderId || !assignForm.deliveryBoyId) {
      alert("Please select both an order and a delivery boy");
      return;
    }
    setAssigning(true);
    try {
      await api.post("/admin/delivery-boy/assign", {
        orderId: assignForm.orderId,
        deliveryBoyId: assignForm.deliveryBoyId,
      });
      setAssignModal(false);
      fetchRecentOrders();
      fetchDeliveryBoys();
    } catch (err) {
      setFormError(
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Failed to add delivery boy"
      );

    } finally {
      setAssigning(false);
    }
  };

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

  const getSuccessRate = (boy) => {
    const total = (boy.delivered || 0) + (boy.cancelled || 0);
    return total > 0 ? (((boy.delivered || 0) / total) * 100).toFixed(1) : "0.0";
  };
  useEffect(() => {
    setCurrentPage(1);
  }, [search, statusFilter]);

  useEffect(() => {
    setOrdersPage(1);
  }, [recentOrders]);

  return (
    <div className="min-h-screen bg-[#f5f0e8] p-4 md:p-8">

      {/* ── HEADER ── */}
      <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-stone-800 flex items-center gap-3">
            <FiTruck className="text-[#c89b3c]" />
            Delivery Management
          </h1>
          <p className="text-stone-500 mt-1 text-sm">Manage delivery boys, assignments and performance</p>
        </div>

        {/* ✅ Action buttons */}
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={openAdd}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#c89b3c] hover:bg-[#b88a2f] text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <FiUserPlus /> Add Delivery Boy
          </button>
          <button
            onClick={openAssign}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-sm font-semibold shadow-md hover:shadow-lg transition-all hover:-translate-y-0.5"
          >
            <FiPlusCircle /> Assign Order
          </button>
          <button
            onClick={() => { fetchDeliveryBoys(); fetchRecentOrders(); }}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white border border-stone-200 text-stone-600 hover:bg-stone-50 text-sm font-medium shadow-sm transition"
          >
            <FiRefreshCw className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── STATS CARDS ── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-8">
        {[
          { label: "Delivery Boys", value: totalBoys, icon: <FiUsers />, bg: "bg-stone-50", text: "text-stone-700", border: "border-stone-200" },
          { label: "Assigned", value: totalAssigned, icon: <FiPackage />, bg: "bg-blue-50", text: "text-blue-600", border: "border-blue-200" },
          { label: "In Transit", value: totalTransit, icon: <FiTruck />, bg: "bg-amber-50", text: "text-[#c89b3c]", border: "border-amber-200" },
          { label: "Delivered", value: totalDelivered, icon: <FiCheckCircle />, bg: "bg-green-50", text: "text-green-600", border: "border-green-200" },
          { label: "Cancelled", value: totalCancelled, icon: <FiXCircle />, bg: "bg-red-50", text: "text-red-500", border: "border-red-200" },
        ].map(({ label, value, icon, bg, text, border }) => (
          <div key={label} className={`bg-white rounded-2xl border ${border} p-4 shadow-sm flex items-center gap-3`}>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${bg} ${text} flex-shrink-0`}>
              {icon}
            </div>
            <div>
              <p className={`text-xl font-bold ${text}`}>{value}</p>
              <p className="text-stone-500 text-xs">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── SEARCH + FILTER ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-4 mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, email, phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-700 focus:outline-none focus:border-[#c89b3c] transition"
          />
        </div>
        <div className="flex gap-2">
          {["all", "active", "inactive"].map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all
                ${statusFilter === f ? "bg-[#c89b3c] text-white shadow-sm" : "bg-stone-100 text-stone-600 hover:bg-stone-200"}`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* ── DELIVERY BOYS TABLE ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800 flex items-center gap-2">
            <FiUsers className="text-[#c89b3c]" /> Delivery Boys
          </h2>
          <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{filtered.length} shown</span>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-400 gap-2">
            <FiRefreshCw className="animate-spin" /> Loading...
          </div>
        ) : error ? (
          <div className="flex items-center justify-center py-16 text-red-500">⚠️ {error}</div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-stone-400 gap-3">
            <FiUsers className="text-4xl text-stone-300" />
            <p className="font-medium">No delivery boys found</p>
            <button onClick={openAdd} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#c89b3c] text-white text-sm font-semibold transition mt-1">
              <FiUserPlus /> Add First Delivery Boy
            </button>
          </div>

        ) : (
          <>
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
                <p className="text-xs text-stone-400">
                  Showing page{" "}
                  <span className="font-semibold text-stone-600">
                    {currentPage}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-stone-600">
                    {totalPages}
                  </span>
                </p>

                <div className="flex items-center gap-2">

                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(currentPage - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200
        bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-40"
                  >
                    {"<"}
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold
            ${currentPage === p
                          ? "bg-[#c89b3c] text-white"
                          : "border border-stone-200 bg-white text-stone-500"
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(currentPage + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200
        bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-40"
                  >
                    {">"}
                  </button>

                </div>
              </div>
            )}
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {["#", "Name", "Email", "Phone", "Assigned", "In Transit", "Delivered", "Cancelled", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {currentUsers.map((boy, i) => (
                    <tr key={boy._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-4 py-4 text-stone-400 text-xs">{(currentPage - 1) * itemsPerPage + i + 1}</td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-[#c89b3c]/10 flex items-center justify-center text-[#c89b3c] font-bold text-sm flex-shrink-0">
                            {boy.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-stone-800">{boy.name || "—"}</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-stone-600 text-xs">{boy.email || "—"}</td>
                      <td className="px-4 py-4 text-stone-600 text-xs">{boy.phone || "—"}</td>
                      <td className="px-4 py-4 text-center font-semibold text-blue-600">{boy.assigned || 0}</td>
                      {/* ✅ Fixed In Transit column */}
                      <td className="px-4 py-4 text-center font-semibold text-amber-600">{boy.inTransit || boy.intransit || boy.transit || 0}</td>
                      <td className="px-4 py-4 text-center font-semibold text-green-600">{boy.delivered || 0}</td>
                      <td className="px-4 py-4 text-center font-semibold text-red-500">{boy.cancelled || 0}</td>
                      <td className="px-4 py-4">
                        <button
                          onClick={() => handleToggleActive(boy)}
                          disabled={togglingId === boy._id}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all disabled:opacity-50
                            ${boy.isActive !== false ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-600 hover:bg-red-200"}`}
                        >
                          {boy.isActive !== false ? <FiToggleRight className="text-base" /> : <FiToggleLeft className="text-base" />}
                          {boy.isActive !== false ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button onClick={() => setViewModal(boy)} className="p-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-600 transition" title="View"><FiEye /></button>
                          <button onClick={() => openEdit(boy)} className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-[#c89b3c] transition" title="Edit"><FiEdit2 /></button>
                          <button onClick={() => setDeleteModal(boy)} className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-500 transition" title="Delete"><FiTrash2 /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden divide-y divide-stone-100">
              {currentUsers.map((boy) => (
                <div key={boy._id} className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-[#c89b3c]/10 flex items-center justify-center text-[#c89b3c] font-bold">
                        {boy.name?.charAt(0)?.toUpperCase() || "?"}
                      </div>
                      <div>
                        <p className="font-semibold text-stone-800">{boy.name}</p>
                        <p className="text-xs text-stone-400">{boy.email}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleActive(boy)}
                      disabled={togglingId === boy._id}
                      className={`px-3 py-1 rounded-xl text-xs font-semibold
                        ${boy.isActive !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}
                    >
                      {boy.isActive !== false ? "Active" : "Inactive"}
                    </button>
                  </div>
                  {/* ✅ 4 stats on mobile */}
                  <div className="grid grid-cols-4 gap-2 text-center">
                    <div className="bg-blue-50 rounded-xl py-2"><p className="text-sm font-bold text-blue-600">{boy.assigned || 0}</p><p className="text-[9px] text-stone-500">Assigned</p></div>
                    <div className="bg-amber-50 rounded-xl py-2"><p className="text-sm font-bold text-amber-600">{boy.inTransit || boy.intransit || 0}</p><p className="text-[9px] text-stone-500">Transit</p></div>
                    <div className="bg-green-50 rounded-xl py-2"><p className="text-sm font-bold text-green-600">{boy.delivered || 0}</p><p className="text-[9px] text-stone-500">Delivered</p></div>
                    <div className="bg-red-50 rounded-xl py-2"><p className="text-sm font-bold text-red-500">{boy.cancelled || 0}</p><p className="text-[9px] text-stone-500">Cancelled</p></div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => setViewModal(boy)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-stone-100 text-stone-600 text-sm font-medium"><FiEye /> View</button>
                    <button onClick={() => openEdit(boy)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-amber-50 text-[#c89b3c] text-sm font-medium"><FiEdit2 /> Edit</button>
                    <button onClick={() => setDeleteModal(boy)} className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-red-50 text-red-500 text-sm font-medium"><FiTrash2 /> Delete</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* ── RECENT ASSIGNED ORDERS ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden mb-8">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <h2 className="font-semibold text-stone-800 flex items-center gap-2">
            <FiPackage className="text-[#c89b3c]" /> Recent Assigned Orders
          </h2>
          <span className="text-xs text-stone-400 bg-stone-100 px-3 py-1 rounded-full">{recentOrders.length} orders</span>
        </div>
        {ordersLoading ? (
          <div className="flex items-center justify-center py-12 text-stone-400 gap-2">
            <FiRefreshCw className="animate-spin" /> Loading orders...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="flex items-center justify-center py-12 text-stone-400">No recent orders</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-200">
                  <tr>
                    {["Order ID", "Customer", "Amount", "Delivery Boy", "Status", "Date", "View"].map((h) => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {currentOrders.map((order) => (
                    <tr key={order._id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-4 font-mono text-xs text-stone-500">#{order._id?.slice(-6).toUpperCase()}</td>
                      <td className="px-5 py-4 font-medium text-stone-800">{order.user?.name || order.deliveryAddress?.fullName || "—"}</td>
                      <td className="px-5 py-4 font-semibold text-stone-800">₹{order.totalPrice || 0}</td>
                      <td className="px-5 py-4 text-stone-600">{order.assignedDeliveryBoy?.name || "—"}</td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[order.deliveryStatus] || "bg-stone-100 text-stone-600"}`}>
                          {STATUS_LABEL[order.deliveryStatus] || order.deliveryStatus || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-stone-500">{formatDate(order.createdAt)}</td>
                      <td className="px-5 py-4">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="px-3 py-1.5 bg-[#c89b3c] hover:bg-[#b88a2f] text-white
                          text-xs font-semibold rounded-lg transition-all duration-150
                          hover:-translate-y-0.5 active:translate-y-0"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ── ORDERS PAGINATION ── */}
            {totalOrderPages > 1 && (
              <div className="flex items-center justify-between px-6 py-4 border-t border-stone-100">
                <p className="text-xs text-stone-400">
                  Showing{" "}
                  <span className="font-semibold text-stone-600">
                    {(ordersPage - 1) * ordersPerPage + 1}–{Math.min(ordersPage * ordersPerPage, recentOrders.length)}
                  </span>{" "}
                  of{" "}
                  <span className="font-semibold text-stone-600">{recentOrders.length}</span>{" "}
                  orders
                </p>

                <div className="flex items-center gap-2">
                  {/* Prev */}
                  <button
                    disabled={ordersPage === 1}
                    onClick={() => setOrdersPage((p) => p - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200
                      bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    {"<"}
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalOrderPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setOrdersPage(p)}
                      className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition
                        ${ordersPage === p
                          ? "bg-[#c89b3c] text-white shadow-sm"
                          : "border border-stone-200 bg-white text-stone-500 hover:bg-stone-100"
                        }`}
                    >
                      {p}
                    </button>
                  ))}

                  {/* Next */}
                  <button
                    disabled={ordersPage === totalOrderPages}
                    onClick={() => setOrdersPage((p) => p + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-lg border border-stone-200
                      bg-white text-stone-500 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    {">"}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      {selectedOrder && (() => {
        // Local state or calculation for item pagination inside the modal
        // Note: For a stateless modal block, we slice the array based on a 10-item limit.
        const itemsLimit = 10;
        const itemsArray = selectedOrder.items || [];
        const totalItemPages = Math.ceil(itemsArray.length / itemsLimit);

        // To handle state cleanly inside a JSX block without modifying parent component state declarations,
        // we can use a parent state for modal item pagination, OR if you don't want to create new useState variables 
        // in your main component, we can bind it. However, the best practice is to declare:
        // const [modalItemPage, setModalItemPage] = useState(1); at the top of your parent component file.
        // Assuming you declare 'modalItemPage' and 'setModalItemPage' at the top, here is the implementation:

        const currentPage = typeof modalItemPage !== 'undefined' ? modalItemPage : 1;
        const setPage = typeof setModalItemPage !== 'undefined' ? setModalItemPage : () => { };

        const indexOfLastItem = currentPage * itemsLimit;
        const indexOfFirstItem = indexOfLastItem - itemsLimit;
        const currentItems = itemsArray.slice(indexOfFirstItem, indexOfLastItem);

        return (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
            <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">

              <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
                <div>
                  <p className="text-xs text-stone-400 font-medium">Order Details</p>
                  <p className="font-bold text-stone-800">#{selectedOrder._id.slice(-6).toUpperCase()}</p>
                </div>
                <button onClick={() => { setSelectedOrder(null); if (typeof setModalItemPage !== 'undefined') setModalItemPage(1); }}
                  className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition-all">
                  <X size={15} />
                </button>
              </div>

              <div className="px-6 py-5 flex flex-col gap-4">

                {/* Customer */}
                <div className="bg-blue-50 border border-blue-100 rounded-2xl px-4 py-4">
                  <p className="text-[10px] font-semibold text-blue-400 uppercase tracking-widest mb-2">Customer</p>
                  <p className="font-bold text-stone-800 text-sm">👤 {selectedOrder.deliveryAddress?.fullName || selectedOrder.user?.name || "—"}</p>
                  <p className="text-xs text-stone-500 mt-1">📧 {selectedOrder.user?.email || "—"}</p>
                  <p className="text-xs text-green-600 font-semibold mt-1">📞 {selectedOrder.deliveryAddress?.phone || "—"}</p>
                </div>

                {/* Address */}
                <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4">
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">📍 Delivery Address</p>
                  <p className="text-sm text-stone-600 leading-relaxed">
                    {[
                      selectedOrder.deliveryAddress?.house,
                      selectedOrder.deliveryAddress?.street,
                      selectedOrder.deliveryAddress?.area,
                      selectedOrder.deliveryAddress?.city,
                      selectedOrder.deliveryAddress?.pincode,
                      selectedOrder.deliveryAddress?.landmark,
                    ].filter(Boolean).join(", ") || "No address provided"}
                  </p>
                </div>

                {/* Delivery Partner + Payment */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="bg-purple-50 border border-purple-100 rounded-2xl px-4 py-4">
                    <p className="text-[10px] font-semibold text-purple-500 uppercase tracking-widest mb-2">Delivery Partner</p>
                    <p className="font-bold text-stone-800">{selectedOrder.assignedDeliveryBoy?.name || "Not Assigned"}</p>
                    <p className="text-xs text-stone-500 mt-0.5">{selectedOrder.assignedDeliveryBoy?.phone || ""}</p>
                    <span
                      className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-bold capitalize ${STATUS_STYLE[selectedOrder.deliveryStatus] || "bg-stone-100 text-stone-600"
                        }`}
                    >
                      {(selectedOrder.deliveryStatus || "assigned").replaceAll("_", " ")}
                    </span>
                  </div>
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-4 flex flex-col justify-between">
                    <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-2">Payment</p>
                    <p className="text-sm font-bold text-stone-700 capitalize">{selectedOrder.paymentMethod || "—"}</p>
                    <span className={`inline-block mt-2 text-[11px] font-bold px-3 py-1 rounded-full capitalize w-fit
                ${selectedOrder.paymentStatus === "paid" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-500"}`}>
                      {selectedOrder.paymentStatus || "—"}
                    </span>
                  </div>
                </div>

                {/* Items Container with Pagination */}
                <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4">
                  <div className="flex justify-between items-center mb-3">
                    <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest">🧾 Items Ordered ({itemsArray.length})</p>
                    {totalItemPages > 1 && (
                      <span className="text-[10px] font-medium text-stone-400 bg-stone-200 px-2 py-0.5 rounded-full">
                        Page {currentPage} of {totalItemPages}
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 min-h-[40px]">
                    {currentItems.map((item, i) => (
                      <div key={i} className="flex justify-between items-center text-sm border-b border-stone-100/60 pb-1 last:border-0 last:pb-0">
                        <span className="text-stone-600">{item.menuItem?.name || item.name || `Item ${indexOfFirstItem + i + 1}`}</span>
                        <span className="bg-stone-200 text-stone-600 text-xs font-semibold px-2 py-0.5 rounded-full">× {item.quantity || 1}</span>
                      </div>
                    ))}
                  </div>

                  {/* Pagination Controls for Items */}
                  {totalItemPages > 1 && (
                    <div className="flex justify-end gap-1.5 mt-4 pt-3 border-t border-stone-200/60">
                      <button
                        disabled={currentPage === 1}
                        onClick={() => setPage(currentPage - 1)}
                        className="px-2 py-1 rounded-lg border border-stone-200 bg-white text-stone-500 text-xs hover:bg-stone-100 disabled:opacity-40 transition"
                      >
                        Prev
                      </button>
                      {Array.from({ length: totalItemPages }, (_, i) => i + 1).map((p) => (
                        <button
                          key={p}
                          onClick={() => setPage(p)}
                          className={`w-6 h-6 flex items-center justify-center rounded-lg text-xs font-semibold transition
                      ${currentPage === p ? "bg-[#c89b3c] text-white" : "border border-stone-200 bg-white text-stone-500 hover:bg-stone-100"}`}
                        >
                          {p}
                        </button>
                      ))}
                      <button
                        disabled={currentPage === totalItemPages}
                        onClick={() => setPage(currentPage + 1)}
                        className="px-2 py-1 rounded-lg border border-stone-200 bg-white text-stone-500 text-xs hover:bg-stone-100 disabled:opacity-40 transition"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>

                {/* Totals */}
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>₹{selectedOrder.subtotal || 0}</span></div>
                  <div className="flex justify-between text-stone-500"><span>Delivery Fee</span><span>₹{selectedOrder.deliveryFee || 0}</span></div>
                  {selectedOrder.discount > 0 && (
                    <div className="flex justify-between text-green-600 font-medium"><span>Discount</span><span>− ₹{selectedOrder.discount}</span></div>
                  )}
                  <hr className="border-dashed border-stone-200 my-1" />
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-700">Final Total</span>
                    <span className="text-green-600 font-bold text-lg">₹{selectedOrder.finalTotal || selectedOrder.totalPrice || 0}</span>
                  </div>
                </div>

                {/* Est. delivery */}
                <div className="bg-green-50 border border-green-100 rounded-xl px-4 py-3 text-sm">
                  <span className="text-stone-500">⏱ Est. Delivery: </span>
                  <span className="font-semibold text-stone-700">
                    {new Date(new Date(selectedOrder.createdAt).getTime() + 45 * 60000).toLocaleString("en-IN")}
                  </span>
                </div>

                <button onClick={() => { setSelectedOrder(null); if (typeof setModalItemPage !== 'undefined') setModalItemPage(1); }}
                  className="w-full py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold text-sm tracking-wide transition-all">
                  Close
                </button>

              </div>
            </div>
          </div>
        );
      })()}
      {/* ── PERFORMANCE METRICS ── */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 mb-8">
        <h2 className="font-semibold text-stone-800 mb-5 flex items-center gap-2">
          <FiStar className="text-[#c89b3c]" /> Delivery Performance Metrics
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: "Total Deliveries", value: totalDeliveries, icon: <FiTruck />, color: "text-stone-700", bg: "bg-stone-100" },
            { label: "Delivered Orders", value: totalDelivered, icon: <FiCheckCircle />, color: "text-green-600", bg: "bg-green-50" },
            { label: "Cancelled Orders", value: totalCancelled, icon: <FiXCircle />, color: "text-red-500", bg: "bg-red-50" },
            { label: "Success Rate", value: `${successRate}%`, icon: <FiStar />, color: "text-[#c89b3c]", bg: "bg-amber-50" },
            { label: "Avg. Delivery Time", value: "~45 min", icon: <FiClock />, color: "text-blue-600", bg: "bg-blue-50" },
          ].map(({ label, value, icon, color, bg }) => (
            <div key={label} className={`${bg} rounded-2xl p-4 flex flex-col items-center justify-center text-center gap-2`}>
              <div className={`text-2xl ${color}`}>{icon}</div>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              <p className="text-xs text-stone-500 font-medium">{label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ══ ADD DELIVERY BOY MODAL ══ */}
      {addModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <p className="text-xs text-stone-400 font-medium">New Delivery Boy</p>
                <p className="font-bold text-stone-800">Add Delivery Boy</p>
              </div>
              <button onClick={() => setAddModal(false)} className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition">
                <X size={15} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="bg-amber-50 border border-amber-100 rounded-xl px-4 py-3 text-xs text-amber-700 font-medium">
                📧 A login email will be sent automatically to the delivery boy after account creation.
              </div>
              {addError && (
                <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600">
                  {addError}
                </div>
              )}
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Enter full name" },
                { label: "Email", key: "email", type: "email", placeholder: "Enter email address" },
                { label: "Phone", key: "phone", type: "tel", placeholder: "Enter phone number" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={addForm[key]}
                    onChange={(e) => setAddForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-700 focus:outline-none focus:border-[#c89b3c] transition bg-stone-50"
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button onClick={() => setAddModal(false)} className="flex-1 py-3 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold text-sm hover:bg-stone-50 transition">
                  Cancel
                </button>
                <button
                  onClick={handleAdd}
                  disabled={adding}
                  className="flex-1 py-3 bg-[#c89b3c] hover:bg-[#b88a2f] text-white rounded-xl font-semibold text-sm shadow-md transition disabled:opacity-50"
                >
                  {adding ? "Creating..." : "Create Account"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ ASSIGN ORDER MODAL ══ */}
      {assignModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <p className="text-xs text-stone-400 font-medium">Assign Delivery</p>
                <p className="font-bold text-stone-800">Assign Order to Delivery Boy</p>
              </div>
              <button onClick={() => setAssignModal(false)} className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition">
                <X size={15} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">

              {/* Select Order */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Select Order</label>
                <div className="relative">
                  <div className="max-h-60 overflow-y-auto border border-stone-200 rounded-xl bg-stone-50">
                    {unassignedOrders
                      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                      .map((order) => (
                        <div
                          key={order._id}
                          onClick={() =>
                            setAssignForm((f) => ({
                              ...f,
                              orderId: order._id,
                            }))
                          }
                          className={`p-3 cursor-pointer border-b transition hover:bg-stone-100
        ${assignForm.orderId === order._id
                              ? "bg-amber-50 border-l-4 border-l-[#c89b3c]"
                              : ""
                            }`}
                        >
                          <div className="font-semibold text-sm">
                            #{order._id.slice(-6).toUpperCase()}
                          </div>

                          <div className="text-sm text-stone-600">
                            {order.deliveryAddress?.fullName}
                          </div>

                          <div className="text-xs text-stone-500">
                            ₹{order.totalPrice}
                          </div>
                        </div>
                      ))}
                  </div>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
                {unassignedOrders.length === 0 && (
                  <p className="text-xs text-stone-400 mt-1">No unassigned orders available</p>
                )}
              </div>

              {/* Select Delivery Boy */}
              <div>
                <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">Select Delivery Boy</label>
                <div className="relative">
                  <select
                    value={assignForm.deliveryBoyId}
                    onChange={(e) => setAssignForm((f) => ({ ...f, deliveryBoyId: e.target.value }))}
                    className="w-full appearance-none pl-4 pr-8 py-3 rounded-xl border border-stone-200 text-sm text-stone-700 bg-stone-50 focus:outline-none focus:border-[#c89b3c] transition cursor-pointer"
                  >
                    <option value="">-- Select a delivery boy --</option>
                    {deliveryBoys
                      .filter((b) => b.isActive !== false)
                      .map((boy) => (
                        <option key={boy._id} value={boy._id}>
                          {boy.name} · {boy.phone || boy.email}
                        </option>
                      ))}
                  </select>
                  <FiChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
                </div>
                <p className="text-xs text-stone-400 mt-1">Only active delivery boys are shown</p>
              </div>

              {/* Preview */}
              {assignForm.orderId && assignForm.deliveryBoyId && (() => {
                const order = unassignedOrders.find((o) => o._id === assignForm.orderId);
                const boy = deliveryBoys.find((b) => b._id === assignForm.deliveryBoyId);
                return (
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 text-sm">
                    <p className="text-[10px] font-semibold text-amber-500 uppercase tracking-widest mb-2">Assignment Preview</p>
                    <p className="text-stone-700">
                      Order <span className="font-bold">#{order?._id?.slice(-6).toUpperCase()}</span> → <span className="font-bold">{boy?.name}</span>
                    </p>
                    <p className="text-xs text-amber-600 mt-1">📧 Email notification will be sent to {boy?.email}</p>
                  </div>
                );
              })()}

              <div className="flex gap-3 mt-2">
                <button onClick={() => setAssignModal(false)} className="flex-1 py-3 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold text-sm hover:bg-stone-50 transition">
                  Cancel
                </button>
                <button
                  onClick={handleAssign}
                  disabled={assigning || !assignForm.orderId || !assignForm.deliveryBoyId}
                  className="flex-1 py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold text-sm shadow-md transition disabled:opacity-50"
                >
                  {assigning ? "Assigning..." : "Assign Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ VIEW MODAL ══ */}
      {viewModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <p className="text-xs text-stone-400 font-medium">Delivery Boy Details</p>
                <p className="font-bold text-stone-800">{viewModal.name}</p>
              </div>
              <button onClick={() => setViewModal(null)} className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition">
                <X size={15} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-2xl bg-[#c89b3c]/10 flex items-center justify-center text-[#c89b3c] font-bold text-2xl">
                  {viewModal.name?.charAt(0)?.toUpperCase()}
                </div>
                <div>
                  <p className="text-xl font-bold text-stone-800">{viewModal.name}</p>
                  <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold mt-1
                    ${viewModal.isActive !== false ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {viewModal.isActive !== false ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
              <div className="bg-stone-50 border border-stone-100 rounded-2xl px-4 py-4 space-y-2">
                <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest mb-2">Contact Info</p>
                <div className="flex items-center gap-2 text-sm text-stone-600"><FiMail className="text-[#c89b3c]" /> {viewModal.email || "—"}</div>
                <div className="flex items-center gap-2 text-sm text-stone-600"><FiPhone className="text-[#c89b3c]" /> {viewModal.phone || "—"}</div>
                <div className="flex items-center gap-2 text-sm text-stone-600"><FiCalendar className="text-[#c89b3c]" /> Joined {formatDate(viewModal.createdAt)}</div>
              </div>
              <div className="grid grid-cols-4 gap-3">
                <div className="bg-blue-50 rounded-2xl p-3 text-center">
                  <p className="text-xl font-bold text-blue-600">{viewModal.assigned || 0}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Assigned</p>
                </div>
                <div className="bg-amber-50 rounded-2xl p-3 text-center">
                  <p className="text-xl font-bold text-amber-600">{viewModal.inTransit || viewModal.intransit || 0}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Transit</p>
                </div>
                <div className="bg-green-50 rounded-2xl p-3 text-center">
                  <p className="text-xl font-bold text-green-600">{viewModal.delivered || 0}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Delivered</p>
                </div>
                <div className="bg-red-50 rounded-2xl p-3 text-center">
                  <p className="text-xl font-bold text-red-500">{viewModal.cancelled || 0}</p>
                  <p className="text-[10px] text-stone-500 mt-1">Cancelled</p>
                </div>
              </div>
              <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm font-medium text-stone-700">
                  <FiStar className="text-[#c89b3c]" /> Success Rate
                </div>
                <span className="text-xl font-bold text-[#c89b3c]">{getSuccessRate(viewModal)}%</span>
              </div>
              <button onClick={() => setViewModal(null)} className="w-full py-3 bg-stone-800 hover:bg-stone-900 text-white rounded-xl font-semibold text-sm transition">
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ EDIT MODAL ══ */}
      {editModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-100">
              <div>
                <p className="text-xs text-stone-400 font-medium">Edit Delivery Boy</p>
                <p className="font-bold text-stone-800">{editModal.name}</p>
              </div>
              <button onClick={() => setEditModal(null)} className="w-8 h-8 rounded-xl bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-500 transition">
                <X size={15} />
              </button>
            </div>
            <div className="px-6 py-5 flex flex-col gap-4">
              {[
                { label: "Full Name", key: "name", type: "text", placeholder: "Enter full name" },
                { label: "Email", key: "email", type: "email", placeholder: "Enter email" },
                { label: "Phone", key: "phone", type: "tel", placeholder: "Enter phone number" },
                { label: "New Password", key: "password", type: "password", placeholder: "Leave blank to keep" },
              ].map(({ label, key, type, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1.5">{label}</label>
                  <input
                    type={type}
                    value={editForm[key]}
                    onChange={(e) => setEditForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 rounded-xl border border-stone-200 text-sm text-stone-700 focus:outline-none focus:border-[#c89b3c] transition bg-stone-50"
                  />
                </div>
              ))}
              <div className="flex gap-3 mt-2">
                <button onClick={() => setEditModal(null)} className="flex-1 py-3 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold text-sm hover:bg-stone-50 transition">Cancel</button>
                <button onClick={handleEdit} disabled={saving} className="flex-1 py-3 bg-[#c89b3c] hover:bg-[#b88a2f] text-white rounded-xl font-semibold text-sm shadow-md transition disabled:opacity-50">
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ══ DELETE MODAL ══ */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-sm p-6 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-red-100 flex items-center justify-center text-red-500 text-2xl">
              <FiAlertTriangle />
            </div>
            <div>
              <p className="font-bold text-stone-800 text-lg">Delete Delivery Boy?</p>
              <p className="text-stone-500 text-sm mt-1">
                Are you sure you want to permanently delete <span className="font-semibold text-stone-700">{deleteModal.name}</span>? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3 w-full mt-2">
              <button onClick={() => setDeleteModal(null)} className="flex-1 py-3 border-2 border-stone-200 rounded-xl text-stone-600 font-semibold text-sm hover:bg-stone-50 transition">Cancel</button>
              <button onClick={handleDelete} disabled={deleting} className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold text-sm shadow-md transition disabled:opacity-50">
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}