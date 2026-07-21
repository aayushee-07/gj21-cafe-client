import { Link } from "react-router-dom";
import cafeImage from "/cafelogo1.png";

const stats = [
  { num: "4.6+", label: "Star Rating", icon: "⭐" },
  { num: "2+",   label: "Years Open",  icon: "🏆" },
  { num: "50+",  label: "Menu Items",  icon: "🍽️" },
];

const marqueeItems = [
  "☕ Premium Coffee",
  "🍽️ Fresh Food",
  "✨ Cozy Vibes",
  "🎵 Good Music",
  "📍 Chikhli, Navsari",
  "⏰ Open till 2 AM",
  "⭐ 4.6 Rated",
  "🚚 Home Delivery",
];

function Home() {
  return (
    <section className="relative bg-[#1a0f0c] text-white h-[calc(100vh-73px)] flex flex-col justify-between overflow-hidden">

      {/* ── Soft vignette only, no orbs/gradients/glow ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ boxShadow: "inset 0 0 140px 30px rgba(0,0,0,0.4)" }}
      />

      {/* ── MAIN CONTENT ── */}
      <div className="relative flex-1 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-14 w-full grid md:grid-cols-[45%_55%] items-center gap-8 md:gap-8 lg:gap-16 min-h-0">

        {/* ── LEFT TEXT (~45%) ── */}
        <div className="flex flex-col gap-4 sm:gap-5 z-10">

          {/* Eyebrow badge */}
          <div className="inline-flex flex-wrap items-center gap-2.5 w-fit max-w-full bg-[#c89b3c]/10 border border-[#c89b3c]/20 text-[#c89b3c]/90 px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c89b3c]" />
            </span>
            <span>Now Open · 2 PM – 2 AM</span>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <p className="text-white/40 text-sm sm:text-base font-medium tracking-[0.08em] uppercase">
              Welcome to
            </p>
            <h1 className="text-4xl sm:text-5xl md:text-[52px] lg:text-[62px] xl:text-[68px] font-extrabold leading-[1.05] tracking-tight">
              <span className="text-[#c89b3c]">GJ 21</span>
              <span className="text-white"> Cafe</span>
            </h1>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-[2px] bg-gradient-to-r from-[#c89b3c] to-[#c89b3c]/20 rounded-full" />
            <div className="w-2 h-[2px] bg-[#c89b3c]/20 rounded-full" />
          </div>

          {/* Subtitle */}
          <p className="text-white/55 text-sm sm:text-[15px] leading-[1.8] max-w-[300px] sm:max-w-[420px]">
            Where every sip tells a story ☕✨<br />
            Experience the perfect blend of taste, comfort, and vibes.
          </p>

          {/* Buttons — fixed width, side by side, equal height */}
          <div className="flex gap-3">
            <Link
              to="/menu"
              className="w-[160px] h-[48px] flex items-center justify-center bg-[#c89b3c] hover:bg-[#b88a2f] text-white font-bold rounded-2xl text-sm tracking-wide transition-colors duration-300"
            >
              Order Now →
            </Link>

            <Link
              to="/about"
              className="w-[160px] h-[48px] flex items-center justify-center border border-white/15 hover:border-[#c89b3c]/40 text-white/65 hover:text-white rounded-2xl text-sm hover:bg-white/[0.06] tracking-wide transition-colors duration-300"
            >
              About Us
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-stretch gap-y-2 gap-x-0">
            {stats.map(({ num, label, icon }, idx) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col gap-0.5 px-4 sm:px-5 first:pl-0 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-xl sm:text-2xl font-extrabold text-[#c89b3c] leading-none">{num}</span>
                    <span className="text-base leading-none">{icon}</span>
                  </div>
                  <p className="text-[10px] sm:text-[11px] text-white/35 font-medium tracking-widest uppercase whitespace-nowrap mt-1">
                    {label}
                  </p>
                </div>
                {idx < stats.length - 1 && (
                  <div className="w-px h-8 bg-white/10 self-center mx-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT LOGO (~55%) — bare image, no wrapper effects ── */}
        <div className="flex items-center justify-center md:justify-end z-10">
          <img
            src={cafeImage}
            alt="GJ 21 Cafe Logo"
            className="w-52 sm:w-72 md:w-[380px] lg:w-[460px] xl:w-[520px] max-w-full h-auto object-contain"
          />
        </div>
      </div>

      {/* ── BOTTOM MARQUEE ── */}
      <div className="relative border-t border-white/[0.07] py-3 overflow-hidden flex-shrink-0 z-10 h-12">
        <div className="flex gap-10 sm:gap-14 animate-marquee whitespace-nowrap w-max">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-white/50 text-[10px] sm:text-xs font-semibold tracking-[0.2em] uppercase"
            >
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;