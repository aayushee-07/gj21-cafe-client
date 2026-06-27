// src/pages/adminmessages.jsx
import { useEffect, useState } from "react";
import api from "../lib/apiClient";
import {
  MapPin, Phone, Mail, Clock, Instagram,
  Save, CheckCircle, AlertCircle, Settings,
  MessageSquare, User, Trash2, RefreshCw,
  Inbox, ChevronDown, ChevronUp,
} from "lucide-react";

const defaultContact = {
  address: "",
  phone1: "",
  phone2: "",
  email: "",
  hoursOpen: "",
  hoursClose: "",
  instagram: "",
  mondayToSunday: true,
};

// Convert "HH:MM" (24h) → "H:MM AM/PM"
const to12h = (t) => {
  if (!t) return "";
  const [hStr, mStr] = t.split(":");
  let h = parseInt(hStr, 10);
  const m = mStr || "00";
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${h}:${m} ${ampm}`;
};

export default function AdminMessages() {
  const [tab, setTab] = useState("settings");

  // Contact Settings
  const [form, setForm]             = useState(defaultContact);
  const [loadingContact, setLoadingContact] = useState(true);
  const [saving, setSaving]         = useState(false);
  const [status, setStatus]         = useState(null);

  // Customer Messages
  const [messages, setMessages]       = useState([]);
  const [loadingMsgs, setLoadingMsgs] = useState(true);
  const [filterName, setFilterName]   = useState("");
  const [filterEmail, setFilterEmail] = useState("");
  const [expandedId, setExpandedId]   = useState(null);
  const [deleteModal, setDeleteModal] = useState(null);

  useEffect(() => {
    fetchContact();
    fetchMessages();
  }, []);

  const fetchContact = async () => {
    try {
      const res = await api.get("/contact/admin/settings");
      if (res.data) setForm({ ...defaultContact, ...res.data });
    } catch (err) {
      console.error("Failed to load contact info:", err);
    } finally {
      setLoadingContact(false);
    }
  };

  const fetchMessages = async () => {
    setLoadingMsgs(true);
    try {
      const res = await api.get("/contact");
      setMessages(res.data || []);
    } catch (err) {
      console.error("Failed to fetch messages:", err);
    } finally {
      setLoadingMsgs(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    try {
      await api.put("/contact/admin/settings", form);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    } finally {
      setSaving(false);
      setTimeout(() => setStatus(null), 3000);
    }
  };

  const deleteMessage = async (id) => {
    try {
      await api.delete(`/contact/${id}`);
      setMessages((prev) => prev.filter((m) => m._id !== id));
      setDeleteModal(null);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  // ✅ Separate name + email filters
  const filtered = messages.filter((m) => {
    const nameMatch  = m.name?.toLowerCase().includes(filterName.toLowerCase());
    const emailMatch = m.email?.toLowerCase().includes(filterEmail.toLowerCase());
    return nameMatch && emailMatch;
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "—";
    const d = new Date(dateStr);
    return (
      d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) +
      " · " +
      d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })
    );
  };

  const inputClass = `w-full px-4 py-2.5 rounded-xl text-sm text-stone-800
    bg-stone-50 border border-stone-200 outline-none
    focus:border-[#c89b3c] focus:ring-2 focus:ring-[#c89b3c]/20 transition-all`;

  return (
    <div>

      {/* Heading */}
      <div className="mb-6">
        <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">Admin Panel</p>
        <h1 className="text-2xl md:text-3xl font-bold text-stone-800 tracking-tight">📞 Contact & Messages</h1>
        <p className="text-stone-400 text-sm mt-1">Manage your café's contact info and view messages from customers.</p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-2xl w-fit mb-7">
        <button
          onClick={() => setTab("settings")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            ${tab === "settings" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
        >
          <Settings size={14} /> Contact Settings
        </button>
        <button
          onClick={() => setTab("messages")}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
            ${tab === "messages" ? "bg-white text-stone-800 shadow-sm" : "text-stone-500 hover:text-stone-700"}`}
        >
          <MessageSquare size={14} /> Customer Messages
          {messages.length > 0 && (
            <span className="bg-[#c89b3c] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
              {messages.length}
            </span>
          )}
        </button>
      </div>

      {/* ══════════════════════════════
           TAB 1 — CONTACT SETTINGS
      ══════════════════════════════ */}
      {tab === "settings" && (
        <>
          {loadingContact ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-[#c89b3c] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : (
            <>
              <div className="grid lg:grid-cols-2 gap-6">

                {/* Left — fields */}
                <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col gap-5">
                  <div className="flex items-center gap-2 mb-1">
                    <Settings size={15} className="text-[#c89b3c]" />
                    <h2 className="text-sm font-bold text-stone-700 uppercase tracking-widest">Contact Info</h2>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
                      <MapPin size={12} className="text-[#c89b3c]" /> Address
                    </label>
                    <textarea name="address" value={form.address} onChange={handleChange} rows={2}
                      placeholder="NH 48, Chikhli, Opp. Majigam Na Raja, Navsari, Gujarat"
                      className={`${inputClass} resize-none`} />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
                        <Phone size={12} className="text-[#c89b3c]" /> Phone 1
                      </label>
                      <input type="tel" name="phone1" value={form.phone1} onChange={handleChange}
                        placeholder="+91 7567397729" className={inputClass} />
                    </div>
                    <div>
                      <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
                        <Phone size={12} className="text-[#c89b3c]" /> Phone 2
                      </label>
                      <input type="tel" name="phone2" value={form.phone2} onChange={handleChange}
                        placeholder="+91 7096512988" className={inputClass} />
                    </div>
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
                      <Mail size={12} className="text-[#c89b3c]" /> Email
                    </label>
                    <input type="email" name="email" value={form.email} onChange={handleChange}
                      placeholder="gj21cafe@gmail.com" className={inputClass} />
                  </div>

                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5">
                      <Instagram size={12} className="text-[#c89b3c]" /> Instagram Handle
                    </label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-stone-400 font-medium">@</span>
                      <input type="text" name="instagram"
                        value={form.instagram?.replace("@", "")}
                        onChange={(e) => setForm((p) => ({ ...p, instagram: e.target.value }))}
                        placeholder="gj21cafe" className={inputClass} />
                    </div>
                  </div>
                </div>

                {/* Right — hours + live preview */}
                <div className="flex flex-col gap-6">

                  <div className="bg-white rounded-2xl border border-stone-200 shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Clock size={15} className="text-[#c89b3c]" />
                      <h2 className="text-sm font-bold text-stone-700 uppercase tracking-widest">Opening Hours</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <div>
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Opens At</label>
                        <input type="time" name="hoursOpen" value={form.hoursOpen} onChange={handleChange} className={inputClass} />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1.5 block">Closes At</label>
                        <input type="time" name="hoursClose" value={form.hoursClose} onChange={handleChange} className={inputClass} />
                      </div>
                    </div>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input type="checkbox" name="mondayToSunday" checked={form.mondayToSunday}
                        onChange={handleChange} className="w-4 h-4 accent-[#c89b3c] rounded" />
                      <span className="text-sm text-stone-600 font-medium">Open Monday to Sunday</span>
                    </label>
                  </div>

                  {/* ✅ Live preview — uses to12h() to show proper AM/PM */}
                  <div className="bg-amber-50 border border-amber-100 rounded-2xl p-6">
                    <p className="text-xs font-bold text-[#c89b3c] uppercase tracking-widest mb-4">Live Preview</p>

                    {/* Empty state */}
                    {!form.address && !form.phone1 && !form.email && !form.hoursOpen && !form.instagram && (
                      <p className="text-xs text-stone-400 italic">Fill in the fields on the left to see a preview here.</p>
                    )}

                    <div className="flex flex-col gap-3 text-sm">
                      {form.address && (
                        <div className="flex gap-2 items-start">
                          <div className="w-7 h-7 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                            <MapPin size={13} className="text-[#c89b3c]" />
                          </div>
                          <p className="text-stone-600 leading-snug pt-0.5">{form.address}</p>
                        </div>
                      )}
                      {(form.phone1 || form.phone2) && (
                        <div className="flex gap-2 items-center">
                          <div className="w-7 h-7 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                            <Phone size={13} className="text-pink-500" />
                          </div>
                          <p className="text-stone-600">{[form.phone1, form.phone2].filter(Boolean).join(" · ")}</p>
                        </div>
                      )}
                      {form.email && (
                        <div className="flex gap-2 items-center">
                          <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                            <Mail size={13} className="text-blue-500" />
                          </div>
                          <p className="text-stone-600">{form.email}</p>
                        </div>
                      )}
                      {(form.hoursOpen || form.hoursClose) && (
                        <div className="flex gap-2 items-center">
                          <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                            <Clock size={13} className="text-green-500" />
                          </div>
                          {/* ✅ to12h converts "14:00" → "2:00 PM" correctly */}
                          <p className="text-stone-600">
                            {form.mondayToSunday ? "Mon — Sun" : "Selected days"} · {to12h(form.hoursOpen)} — {to12h(form.hoursClose)}
                          </p>
                        </div>
                      )}
                      {form.instagram && (
                        <div className="flex gap-2 items-center">
                          <div className="w-7 h-7 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                            <Instagram size={13} className="text-purple-500" />
                          </div>
                          <p className="text-[#c89b3c] font-medium">@{form.instagram.replace("@", "")}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Save */}
              <div className="flex items-center gap-4 mt-6">
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 bg-[#c89b3c] hover:bg-[#b88a2f] disabled:bg-[#c89b3c]/60 text-white px-8 py-3 rounded-xl text-sm font-semibold shadow-md shadow-amber-200 hover:-translate-y-0.5 disabled:cursor-not-allowed transition-all">
                  <Save size={15} />
                  {saving ? "Saving…" : "Save Changes"}
                </button>
                {status === "success" && (
                  <div className="flex items-center gap-2 text-green-600 text-sm font-semibold">
                    <CheckCircle size={16} /> Saved successfully!
                  </div>
                )}
                {status === "error" && (
                  <div className="flex items-center gap-2 text-red-500 text-sm font-semibold">
                    <AlertCircle size={16} /> Failed to save. Try again.
                  </div>
                )}
              </div>
            </>
          )}
        </>
      )}

      {/* ══════════════════════════════
           TAB 2 — CUSTOMER MESSAGES
      ══════════════════════════════ */}
      {tab === "messages" && (
        <>
          {/* ✅ Separate Name + Email filter inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-5">
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Filter by name…"
                value={filterName}
                onChange={(e) => setFilterName(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 outline-none focus:border-[#c89b3c] focus:ring-2 focus:ring-[#c89b3c]/20 transition-all"
              />
            </div>
            <div className="relative">
              <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
              <input
                type="text"
                placeholder="Filter by email…"
                value={filterEmail}
                onChange={(e) => setFilterEmail(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-200 rounded-xl text-sm text-stone-700 outline-none focus:border-[#c89b3c] focus:ring-2 focus:ring-[#c89b3c]/20 transition-all"
              />
            </div>
          </div>

          {/* Refresh + count */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-xs text-stone-400 font-medium">
              Showing <span className="text-stone-600 font-semibold">{filtered.length}</span> of {messages.length} messages
            </p>
            <button onClick={fetchMessages}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-xl text-sm font-semibold text-stone-500 hover:text-stone-800 hover:border-stone-300 shadow-sm transition-all">
              <RefreshCw size={13} className={loadingMsgs ? "animate-spin" : ""} /> Refresh
            </button>
          </div>

          {/* Loading */}
          {loadingMsgs && (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-4 border-[#c89b3c] border-t-transparent rounded-full animate-spin" />
            </div>
          )}

          {/* Empty */}
          {!loadingMsgs && filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center h-48 bg-white rounded-2xl border border-stone-200 text-center">
              <Inbox size={32} className="text-stone-300 mb-3" />
              <p className="text-stone-400 font-semibold text-sm">
                {filterName || filterEmail ? "No messages match your filters." : "No messages yet."}
              </p>
              <p className="text-stone-300 text-xs mt-1">Messages from the contact form will appear here.</p>
            </div>
          )}

          {/* Message cards */}
          {!loadingMsgs && filtered.length > 0 && (
            <div className="flex flex-col gap-3">
              {filtered.map((msg) => {
                const isExpanded = expandedId === msg._id;
                return (
                  <div key={msg._id} className="bg-white border border-stone-200 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">

                    {/* Header row */}
                    <div className="flex items-center gap-4 px-5 py-4 cursor-pointer"
                      onClick={() => setExpandedId(isExpanded ? null : msg._id)}>
                      <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-sm font-bold text-[#c89b3c] flex-shrink-0">
                        {msg.name?.charAt(0).toUpperCase() || "?"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-stone-800 truncate">{msg.name || "Unknown"}</p>
                        <p className="text-xs text-stone-400 truncate">{msg.email || "—"}</p>
                      </div>
                      <p className="hidden md:block flex-1 text-xs text-stone-400 truncate max-w-xs">
                        {msg.message || "—"}
                      </p>
                      <div className="hidden sm:flex items-center gap-1 text-xs text-stone-400 flex-shrink-0">
                        <Clock size={11} />{formatDate(msg.createdAt)}
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button onClick={(e) => { e.stopPropagation(); setDeleteModal(msg._id); }}
                          className="p-1.5 rounded-lg text-stone-300 hover:text-red-500 hover:bg-red-50 transition-all">
                          <Trash2 size={14} />
                        </button>
                        {isExpanded
                          ? <ChevronUp size={16} className="text-stone-400" />
                          : <ChevronDown size={16} className="text-stone-400" />}
                      </div>
                    </div>

                    {/* Expanded body */}
                    {isExpanded && (
                      <div className="border-t border-stone-100 px-5 py-4 bg-stone-50">
                        <div className="grid sm:grid-cols-3 gap-4 mb-4">
                          <div className="flex items-center gap-2">
                            <User size={13} className="text-[#c89b3c]" />
                            <div>
                              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Name</p>
                              <p className="text-sm text-stone-700 font-medium">{msg.name || "—"}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Mail size={13} className="text-[#c89b3c]" />
                            <div>
                              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Email</p>
                              <a href={`mailto:${msg.email}`} className="text-sm text-[#c89b3c] hover:underline font-medium">
                                {msg.email || "—"}
                              </a>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock size={13} className="text-[#c89b3c]" />
                            <div>
                              <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide">Received</p>
                              <p className="text-sm text-stone-700 font-medium">{formatDate(msg.createdAt)}</p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-white border border-stone-200 rounded-xl px-4 py-3">
                          <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wide mb-1.5 flex items-center gap-1">
                            <MessageSquare size={11} /> Message
                          </p>
                          <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">{msg.message || "—"}</p>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}

      {/* Delete modal */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl border border-stone-100 shadow-2xl w-full max-w-sm p-7">
            <div className="w-12 h-12 rounded-2xl bg-red-100 flex items-center justify-center mx-auto mb-4">
              <Trash2 size={20} className="text-red-500" />
            </div>
            <h2 className="text-lg font-bold text-stone-800 text-center mb-1">Delete Message</h2>
            <p className="text-sm text-stone-400 text-center mb-6">Are you sure? This cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteModal(null)}
                className="flex-1 py-2.5 border border-stone-200 rounded-xl text-stone-500 text-sm font-semibold hover:bg-stone-100 transition-all">
                Cancel
              </button>
              <button onClick={() => deleteMessage(deleteModal)}
                className="flex-1 py-2.5 bg-red-500 hover:bg-red-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-red-200 transition-all">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}