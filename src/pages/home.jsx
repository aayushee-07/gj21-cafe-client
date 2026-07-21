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
    <section className="relative bg-[#120a08] text-white min-h-[calc(100vh-73px)] lg:h-[calc(100vh-73px)] flex flex-col justify-between overflow-hidden">

      {/* ── DECORATIVE BACKGROUND ORBS ── */}
      <div
        className="hero-orb absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,155,60,0.14) 0%, transparent 70%)" }}
      />
      <div
        className="hero-orb delay-400 absolute -bottom-24 -right-24 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,155,60,0.10) 0%, transparent 70%)" }}
      />
      {/* Fine grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.035]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />
      {/* Warm top gradient */}
      <div className="absolute top-0 left-0 right-0 h-56 bg-gradient-to-b from-[#c89b3c]/10 to-transparent pointer-events-none" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

      {/* ── MAIN CONTENT ── */}
      <div className="relative flex-1 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-14 py-8 sm:py-12 md:py-14 lg:py-0 w-full grid md:grid-cols-2 items-center gap-8 sm:gap-10 md:gap-8 lg:gap-16">

        {/* ── LEFT TEXT ── */}
        <div className="flex flex-col gap-5 sm:gap-7 z-10">

          {/* Eyebrow badge */}
          <div className="hero-fade-up delay-100 inline-flex flex-wrap items-center gap-2.5 w-fit max-w-full bg-[#c89b3c]/10 border border-[#c89b3c]/25 text-[#e8c46a] px-4 py-2 rounded-full text-[10px] sm:text-xs font-semibold tracking-[0.16em] sm:tracking-[0.2em] uppercase backdrop-blur-md shadow-[0_1px_0_rgba(255,255,255,0.04)_inset]">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c89b3c] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c89b3c]" />
            </span>
            <span>Now Open · 2 PM – 2 AM</span>
          </div>

          {/* Heading */}
          <div className="hero-fade-up delay-200 flex flex-col gap-1.5">
            <p className="text-white/40 text-xs sm:text-sm font-medium tracking-[0.22em] uppercase">
              Welcome to
            </p>
            <h1 className="text-[36px] xs:text-4xl sm:text-5xl md:text-[54px] lg:text-[64px] xl:text-[70px] font-extrabold leading-[1.04] tracking-tight">
              <span className="text-shimmer">GJ 21</span>
              <span className="text-white"> Cafe</span>
            </h1>
          </div>

          {/* Divider */}
          <div className="hero-fade-up delay-200 flex items-center gap-3">
            <div className="w-12 h-[2px] bg-gradient-to-r from-[#c89b3c] to-[#c89b3c]/10 rounded-full" />
            <div className="w-1.5 h-1.5 rounded-full bg-[#c89b3c]/40" />
          </div>

          {/* Subtitle */}
          <p className="hero-fade-up delay-300 text-white/60 text-sm sm:text-[15px] leading-[1.8] sm:leading-[1.9] max-w-[300px] sm:max-w-[420px] font-light">
            Where every sip tells a story ☕✨<br />
            Experience the perfect blend of taste, comfort, and vibes.
          </p>

          {/* Buttons */}
          <div className="hero-fade-up delay-400 flex flex-col xs:flex-row gap-3.5">
            <Link
              to="/menu"
              className="group relative w-full xs:w-auto text-center overflow-hidden bg-[#c89b3c] hover:bg-[#d4a94a] text-[#1a1008] font-bold px-8 py-3.5 sm:py-3.5 rounded-2xl text-sm tracking-wide transition-all duration-300 hover:-translate-y-[3px] shadow-[0_4px_16px_rgba(200,155,60,0.28)] hover:shadow-[0_12px_32px_rgba(200,155,60,0.5)] active:translate-y-0 active:shadow-[0_4px_12px_rgba(200,155,60,0.3)]"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Order Now
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </span>
            </Link>

            <Link
              to="/about"
              className="w-full xs:w-auto text-center border border-white/15 hover:border-[#c89b3c]/50 text-white/70 hover:text-white px-8 py-3.5 sm:py-3.5 rounded-2xl text-sm hover:bg-white/[0.06] tracking-wide transition-all duration-300 hover:-translate-y-[3px] backdrop-blur-sm"
            >
              About Us
            </Link>
          </div>

          {/* Stats */}
          <div className="hero-fade-up delay-500 grid grid-cols-3 gap-3 sm:flex sm:items-stretch sm:gap-0 pt-2">
            {stats.map(({ num, label, icon }, idx) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col gap-1 sm:px-6 sm:first:pl-0 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-2xl font-extrabold text-[#c89b3c] leading-none tracking-tight">{num}</span>
                    <span className="text-sm sm:text-base leading-none">{icon}</span>
                  </div>
                  <p className="text-[9px] sm:text-[11px] text-white/40 font-medium tracking-tight sm:tracking-[0.14em] uppercase truncate">
                    {label}
                  </p>
                </div>
                {idx < stats.length - 1 && (
                  <div className="hidden sm:block w-px h-9 bg-gradient-to-b from-transparent via-white/15 to-transparent self-center mx-0" />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT LOGO ── */}
        <div className="hero-fade-in delay-300 flex items-center justify-center md:justify-end z-10 pt-2 pb-4 md:py-0">
          <div className="hero-float relative">
            {/* Glow ring behind the logo */}
            <div
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(200,155,60,0.22) 0%, transparent 65%)",
                transform: "scale(1.2)",
              }}
            />
            {/* Soft ground shadow for depth */}
            <div
              className="absolute left-1/2 -translate-x-1/2 bottom-[-6%] w-[70%] h-6 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(ellipse, rgba(0,0,0,0.35) 0%, transparent 75%)" }}
            />
            <img
              src={cafeImage}
              alt="GJ 21 Cafe Logo"
              className="relative w-36 xs:w-44 sm:w-64 md:w-[380px] lg:w-[460px] xl:w-[520px] max-w-full h-auto object-contain mix-blend-screen"
              style={{ filter: "contrast(1.1) saturate(1.05) drop-shadow(0 0 56px rgba(200,155,60,0.3))" }}
            />
          </div>
        </div>
      </div>

      {/* ── BOTTOM MARQUEE ── */}
      <div className="relative border-t border-white/[0.08] bg-white/[0.03] py-2.5 sm:py-3 overflow-hidden flex-shrink-0 z-10">
        <div className="flex gap-8 sm:gap-14 animate-marquee whitespace-nowrap w-max">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-white/45 hover:text-[#c89b3c]/80 transition-colors duration-300 text-[9px] sm:text-xs font-semibold tracking-[0.18em] sm:tracking-[0.22em] uppercase"
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