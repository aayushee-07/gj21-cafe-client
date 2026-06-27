import { useState, useEffect } from "react";
import { FaMapMarkerAlt, FaPhoneAlt, FaEnvelope, FaClock, FaInstagram } from "react-icons/fa";
import api from "../lib/apiClient";

export default function Contact() {

  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [showToast, setShowToast] = useState(false);
  const [settings, setSettings] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.email || !form.message) {
      setShowToast("error");
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    try {
      const res = await api.post("/contact", {
        name: form.name.trim(),
        email: form.email.trim().toLowerCase(),
        message: form.message.trim(),
      });

      setShowToast("success");
      setForm({ name: "", email: "", message: "" });

    } catch (err) {
      console.error("ERROR:", err.response?.data || err.message);
      setShowToast("error");
    }

    setTimeout(() => setShowToast(false), 3000);
  };

  const formatTime = (time) => {
    if (!time) return "";

    const [hours, minutes] = time.split(":");
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);

    return date.toLocaleTimeString("en-IN", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const res = await api.get("/contact/settings");
        setSettings(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadSettings();
  }, []);
  const contactItems = [
    {
      icon: <FaMapMarkerAlt />,
      bg: "bg-amber-100",
      color: "text-[#c89b3c]",
      label: "Address",
      value: settings?.address || "",
    },
    {
      icon: <FaPhoneAlt />,
      bg: "bg-rose-100",
      color: "text-rose-500",
      label: "Phone",
      value: `${settings?.phone1 || ""} · ${settings?.phone2 || ""}`,
    },
    {
      icon: <FaEnvelope />,
      bg: "bg-blue-100",
      color: "text-blue-500",
      label: "Email",
      value: settings?.email || "iushie0407@gmail.com",
    },
    {
      icon: <FaClock />,
      bg: "bg-green-100",
      color: "text-green-600",
      label: "Hours",
      value: `Every day · ${formatTime(settings?.hoursOpen)} — ${formatTime(settings?.hoursClose)}`,
    },
    {
      icon: <FaInstagram />,
      bg: "bg-purple-100",
      color: "text-purple-500",
      label: "Instagram",
      value: settings?.instagram || "@gj21cafe",
      link: settings?.instagram
        ? `https://instagram.com/${settings.instagram.replace("@", "")}`
        : "",
    },
  ];
  return (
    <main className="bg-[#faf8f5] min-h-screen text-stone-800">

      {/* ── TOAST ── */}
      {showToast && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
          <div className={`px-6 py-3 rounded-2xl shadow-xl text-sm font-semibold border
            ${showToast === "success"
              ? "bg-green-50 border-green-200 text-green-700"
              : "bg-red-50 border-red-200 text-red-600"}`}>
            {showToast === "success"
              ? "✅ Message sent successfully!"
              : "⚠️ Please fill all fields"}
          </div>
        </div>
      )}

      {/* ── HEADING ── */}
      <section className="text-center pt-14 pb-10 px-6">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-2">
          We'd Love to Hear From You
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
          Contact <span className="text-[#c89b3c]">Us</span>
        </h1>
        <div className="w-12 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] mx-auto mt-4 rounded-full" />
        <p className="text-stone-400 text-[15px] mt-4 max-w-md mx-auto leading-relaxed">
          Visit GJ 21 Cafe, connect with us on Instagram, or send us a message anytime.
        </p>
      </section>

      {/* ── MAIN GRID ── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid lg:grid-cols-2 gap-8 items-start">

          {/* ── LEFT — CONTACT INFO ── */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">

            <h2 className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-6
            flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold">📍</span>
              Get in Touch
            </h2>

            <div className="flex flex-col gap-5">
              {contactItems.map(({ icon, bg, color, label, value, link }, i) => (
                <div key={i} className="flex items-start gap-4 group">
                  <div className={`${bg} ${color} w-10 h-10 rounded-2xl flex items-center justify-center
                  flex-shrink-0 text-sm group-hover:scale-110 transition-transform duration-200`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-0.5">
                      {label}
                    </p>
                    {label === "Email" ? (
                      <a
                        href={`mailto:${value}`}
                        className="text-blue-600 hover:underline text-sm"
                      >
                        {value}
                      </a>
                    ) : link ? (
                      <a
                        href={link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-[#c89b3c] hover:underline text-sm"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-stone-600 text-sm leading-snug">
                        {value}
                      </p>
                    )}

                  </div>
                </div>

              ))}
            </div>

            <hr className="border-dashed border-stone-200 my-7" />

            <div className="bg-[#faf8f5] border border-amber-100 rounded-2xl px-5 py-4">
              <p className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-3">
                ⏰ We Are Open
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-stone-500">Mon — Sun</span>
                <span className="font-bold text-stone-800">
                  {formatTime(settings?.hoursOpen)} — {formatTime(settings?.hoursClose)}
                </span>
              </div>
              <div className="mt-3 h-1.5 w-full bg-stone-100 rounded-full overflow-hidden">
                <div className="h-full bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] rounded-full w-[58%]" />
              </div>
              <p className="text-[11px] text-stone-400 mt-1.5">Open 12 hours a day</p>
            </div>

          </div>

          {/* ── RIGHT — FORM ── */}
          <div className="bg-white rounded-3xl border border-stone-100 shadow-sm p-8">

            <h2 className="text-xs font-semibold text-[#c89b3c] uppercase tracking-widest mb-6
            flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center text-[10px] font-bold">✉️</span>
              Send a Message
            </h2>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-400 tracking-wide">
                  Your Name <span className="text-[#c89b3c]">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Rahul Patel"
                  className="w-full border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl
                  text-sm text-stone-800 placeholder:text-stone-300
                  focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
                  transition-all duration-150"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-400 tracking-wide">
                  Email Address <span className="text-[#c89b3c]">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="e.g. rahul@gmail.com"
                  className="w-full border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl
                  text-sm text-stone-800 placeholder:text-stone-300
                  focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
                  transition-all duration-150"
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-stone-400 tracking-wide">
                  Message <span className="text-[#c89b3c]">*</span>
                </label>
                <textarea
                  rows="5"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full border border-stone-200 bg-stone-50 px-4 py-3 rounded-xl
                  text-sm text-stone-800 placeholder:text-stone-300 resize-none
                  focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
                  transition-all duration-150"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#c89b3c] hover:bg-[#b88a2f] text-white py-3 rounded-xl
                font-semibold text-sm tracking-wide transition-all duration-200
                shadow-md shadow-amber-200 hover:shadow-amber-300
                hover:-translate-y-0.5 active:translate-y-0 mt-2"
              >
                Send Message →
              </button>

              <p className="text-center text-xs text-stone-300 mt-1">
                We'll get back to you within 24 hours
              </p>

            </form>
          </div>

        </div>
      </section>

      {/* ── MAP ── */}
      <section className="max-w-6xl mx-auto px-4 pb-14">
        <div className="rounded-3xl overflow-hidden border border-stone-100 shadow-sm">
          <div className="bg-white px-6 py-4 border-b border-stone-100 flex items-center gap-2">
            <div className="w-7 h-7 rounded-xl bg-amber-100 flex items-center justify-center text-xs">
              📍
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-800">GJ 21 Cafe</p>
              <p className="text-xs text-stone-400">NH 48, Chikhli, Navsari, Gujarat</p>
            </div>
          </div>
          <iframe
            title="GJ 21 Cafe Location"
            src="https://www.google.com/maps?q=GJ+21+Cafe+Majigam+Navsari&output=embed"
            className="w-full h-[380px]"
          />
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#4a3330] text-white py-6 text-center">
        <p className="text-sm font-semibold">
          GJ <span className="text-[#c89b3c]">21</span> Cafe
        </p>
        <p className="text-xs text-white/40 mt-1">
          © {new Date().getFullYear()} GJ 21 Cafe. All Rights Reserved.
        </p>
      </footer>

    </main>
  );
}
