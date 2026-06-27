import img1 from "/gj21night.jpeg";
import img2 from "/gj21seating.jpeg";
import img3 from "/gj21cafeday2.jpeg";
import img4 from "/gj21cafeday1.jpeg";
import img9 from "/gj21seating2.jpeg";
import img5 from "/gj21kitchen.png";
import img6 from "/gj21evening.png";
import img7 from "/gj21bouquet.png";
import img8 from "/gj21delivery.png";

import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();

  return (
    <main className="bg-amber-50 text-stone-800 min-h-screen">
      {/* ══════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════ */}
      <section className="relative h-screen xl:h-[88vh] flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <img
          src={img2}
          alt="GJ 21 Cafe"
          className="absolute inset-0 w-full h-full object-cover object-center scale-105"
        />

        {/* Layered overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/30 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />

        {/* Hero content */}
        <div className="relative text-center px-6 xl:px-5 max-w-3xl xl:max-w-2xl w-full">
          {/* Eyebrow */}
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-[#c89b3c] mb-5 xl:mb-4">
            Welcome to
          </p>

          {/* Main title */}
          <h1 className="text-5xl md:text-7xl xl:text-6xl font-extrabold text-white mb-6 xl:mb-5 leading-tight tracking-tight drop-shadow-2xl">
            GJ <span className="text-[#c89b3c]">21</span> Cafe
          </h1>

          {/* Thin gold divider */}
          <div className="w-16 h-0.5 bg-gradient-to-r from-transparent via-[#c89b3c] to-transparent mx-auto mb-6 xl:mb-5" />

          <p className="text-white/80 text-lg md:text-xl xl:text-lg leading-relaxed mb-10 xl:mb-8 max-w-xl xl:max-w-lg mx-auto">
            A modern hangout spot built with passion — serving coffee, comfort,
            and unforgettable moments in every sip ☕✨
          </p>

          <div className="flex justify-center gap-4 xl:gap-3 flex-wrap">
            <button
              onClick={() => navigate("/menu")}
              className="bg-[#c89b3c] hover:bg-[#b88a2f] text-white px-8 py-3.5 xl:px-7 xl:py-3 rounded-2xl
              font-semibold text-sm tracking-wide transition-all duration-300
              shadow-lg shadow-amber-900/30 hover:shadow-amber-700/40 hover:-translate-y-0.5 active:translate-y-0"
            >
              Explore Menu
            </button>

            <button
              onClick={() => navigate("/contact")}
              className="px-8 py-3.5 xl:px-7 xl:py-3 rounded-2xl font-semibold text-sm tracking-wide
              bg-white/10 backdrop-blur-sm border border-white/30 text-white
              hover:bg-white hover:text-stone-800 transition-all duration-300
              hover:-translate-y-0.5 active:translate-y-0"
            >
              Contact Us
            </button>
          </div>
        </div>

        {/* Bottom fade into page */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-amber-50 to-transparent" />
      </section>

      {/* ══════════════════════════════════════
          STORY SECTION
      ══════════════════════════════════════ */}
      <section className="py-28 xl:py-24">
        <div className="max-w-6xl xl:max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 xl:gap-12 items-center">
          {/* TEXT SIDE */}
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-3 xl:mb-2">
              Who We Are
            </p>
            <h2 className="text-4xl md:text-5xl xl:text-4xl font-bold text-stone-800 tracking-tight mb-2 leading-tight">
              Our Story
            </h2>
            <div className="w-10 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] rounded-full mb-8 xl:mb-6" />

            <p className="text-stone-500 leading-relaxed mb-10 xl:mb-8 text-[15px] xl:max-w-[26rem]">
              GJ 21 Cafe was founded in 2024 in Chikhli, Navsari.
              We created a space where people can relax, enjoy great food,
              and experience a cozy atmosphere. From coffee lovers to food explorers,
              everyone finds their vibe here.
            </p>

            {/* INFO CARDS — 2x2 grid */}
            <div className="grid grid-cols-2 gap-4 xl:gap-3">
              {[
                ["📍", "Location", "NH 48, Chikhli, Navsari, Gujarat"],
                ["📅", "Founded", "2024"],
                ["⭐", "Rating", "4.6+ Stars"],
                ["⏰", "Hours", "2 PM — 2 AM"],
              ].map(([icon, title, value], i) => (
                <div
                  key={i}
                  className="bg-white border border-stone-100 rounded-2xl xl:rounded-xl p-5 xl:p-4
                  shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1"
                >
                  <span className="text-2xl mb-2 block">{icon}</span>
                  <h3 className="text-[11px] font-semibold text-[#c89b3c] uppercase tracking-widest mb-1">
                    {title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-snug">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* IMAGE SIDE — stacked with offset */}
          <div className="relative h-[480px] xl:h-[420px] hidden md:block">
            <img
              src={img4}
              alt="Cafe day"
              className="absolute top-0 left-0 w-[65%] xl:w-[58%] h-[55%] xl:h-[52%] object-cover rounded-3xl
              shadow-xl border-4 border-white"
            />
            <img
              src={img1}
              alt="Cafe night"
              className="absolute bottom-0 right-0 w-[65%] xl:w-[58%] h-[55%] xl:h-[52%] object-cover rounded-3xl
              shadow-xl border-4 border-white"
            />
            {/* floating gold accent */}
            <div className="absolute top-[45%] left-[30%] xl:top-[46%] xl:left-[31%] w-16 h-16 xl:w-14 xl:h-14 rounded-full bg-[#c89b3c]/20
            border-2 border-[#c89b3c]/30 backdrop-blur-sm" />
          </div>

          {/* Mobile: simple side-by-side */}
          <div className="grid grid-cols-2 gap-4 md:hidden">
            <img src={img4} alt="Cafe day" className="rounded-2xl shadow-md object-cover h-44 w-full" />
            <img src={img1} alt="Cafe night" className="rounded-2xl shadow-md object-cover h-44 w-full" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FEATURES SECTION
      ══════════════════════════════════════ */}
      <section className="bg-white border-y border-stone-100 py-20 xl:py-16">
        <div className="max-w-5xl xl:max-w-4xl mx-auto px-6">
          <div className="text-center mb-14 xl:mb-10">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-3">
              Why Choose Us
            </p>
            <h2 className="text-3xl md:text-4xl xl:text-3xl font-bold text-stone-800 tracking-tight">
              What Makes Us Special
            </h2>
            <div className="w-10 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] rounded-full mx-auto mt-4" />
          </div>

          <div className="grid md:grid-cols-3 gap-6 xl:gap-5">
            {[
              ["☕", "Premium Coffee", "Crafted with the finest beans, roasted to perfection for every cup."],
              ["🍽️", "Delicious Food", "Fresh, flavourful meals made with care — from snacks to full plates."],
              ["✨", "Cozy Vibes", "A warm, relaxed space where you can unwind, work, or catch up."],
            ].map(([icon, title, desc], i) => (
              <div
                key={i}
                className="group bg-amber-50 border border-stone-100 rounded-3xl xl:rounded-2xl p-8 xl:p-6 text-center
                hover:bg-white hover:shadow-lg hover:-translate-y-2 transition-all duration-300"
              >
                <div className="w-14 h-14 xl:w-12 xl:h-12 rounded-2xl bg-white border border-stone-100 shadow-sm
                flex items-center justify-center text-3xl xl:text-2xl mx-auto mb-5 xl:mb-4
                group-hover:shadow-md group-hover:scale-110 transition-all duration-300">
                  {icon}
                </div>
                <h3 className="text-base xl:text-sm font-bold text-stone-800 mb-2">{title}</h3>
                <p className="text-stone-400 text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          GALLERY SECTION
      ══════════════════════════════════════ */}
      <section className="pt-16 pb-10 xl:pt-12 xl:pb-8">
        <div className="max-w-6xl xl:max-w-5xl mx-auto px-6">
          <div className="text-center mb-14 xl:mb-10">
            <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-3">
              Captured Moments
            </p>
            <h2 className="text-3xl md:text-4xl xl:text-3xl font-bold text-stone-800 tracking-tight">
              Our <span className="text-[#c89b3c]">Gallery</span>
            </h2>
            <div className="w-10 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] rounded-full mx-auto mt-4" />
          </div>

          {/* Gallery — uniform 4:3 ratio, 3-col grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 xl:gap-4">
            {[img1, img2, img9, img4, img3, img5, img6, img7, img8].map((img, i) => (
              <div
                key={i}
                className="rounded-2xl overflow-hidden shadow-md
                hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 group
                aspect-[4/3] relative"
              >
                <img
                  src={img}
                  alt={`GJ 21 Cafe ${i + 1}`}
                  className="absolute inset-0 w-full h-full object-cover
                  group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════
          CTA STRIP
      ══════════════════════════════════════ */}
      <section className="bg-[#4a3330] py-12 xl:py-10 px-6 text-center">
        <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-3">
          Come Visit Us
        </p>
        <h2 className="text-3xl md:text-4xl xl:text-3xl font-bold text-white tracking-tight mb-3">
          Ready for a great experience?
        </h2>
        <p className="text-white/50 text-sm mb-7 max-w-xs mx-auto leading-relaxed">
          Open every day from 2&nbsp;PM&nbsp;to&nbsp;2&nbsp;AM. Walk in or order online.
        </p>
        <div className="flex justify-center gap-4 xl:gap-3 flex-wrap">
          <button
            onClick={() => navigate("/menu")}
            className="bg-[#c89b3c] hover:bg-[#b88a2f] text-white px-8 py-3.5 xl:px-7 xl:py-3 rounded-2xl
            font-semibold text-sm tracking-wide transition-all duration-300
            shadow-lg shadow-black/20 hover:-translate-y-0.5 active:translate-y-0"
          >
            Order Now
          </button>
          <button
            onClick={() => navigate("/contact")}
            className="px-8 py-3.5 xl:px-7 xl:py-3 rounded-2xl font-semibold text-sm tracking-wide
            border border-white/20 text-white/80 hover:bg-white/10
            transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
          >
            Get Directions
          </button>
        </div>
      </section>

      {/* ══════════════════════════════════════
          FOOTER
      ══════════════════════════════════════ */}
      <footer className="bg-[#3a2825] text-white py-6 xl:py-5">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <h2 className="text-lg font-bold mb-1">
            GJ <span className="text-[#c89b3c]">21</span> Cafe
          </h2>
          <p className="text-xs text-white/30">
            © {new Date().getFullYear()} GJ 21 Cafe. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}