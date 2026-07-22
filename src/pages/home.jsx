import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { FaStar, FaTrophy } from "react-icons/fa";
import { GiForkKnifeSpoon } from "react-icons/gi";
import cafeImage from "/cafelogo1.png";

const stats = [
  { num: "4.6+", label: "Star Rating", icon: <FaStar className="text-[#c89b3c] text-base" /> },
  { num: "2+",   label: "Years Open",  icon: <FaTrophy className="text-[#c89b3c] text-base" /> },
  { num: "50+",  label: "Menu Items",  icon: <GiForkKnifeSpoon className="text-[#c89b3c] text-base" /> },
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
    <section className="relative bg-[#120a08] text-white h-auto flex flex-col overflow-hidden md:h-[calc(100vh-73px)] md:justify-between">

      {/* ── DECORATIVE BACKGROUND ORBS ── */}
      <div
        className="hero-orb absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,155,60,0.13) 0%, transparent 70%)" }}
      />
      <div
        className="hero-orb delay-400 absolute -bottom-24 -right-24 w-[360px] h-[360px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(200,155,60,0.09) 0%, transparent 70%)" }}
      />
      {/* Fine grain overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />
      {/* Warm top gradient */}
      <div className="absolute top-0 left-0 right-0 h-48 bg-gradient-to-b from-[#c89b3c]/8 to-transparent pointer-events-none" />
      {/* Bottom vignette */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

      {/* ── MAIN CONTENT ── */}
      <div className="relative w-full md:flex-1 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-14 pt-3 pb-2 md:py-0 grid grid-cols-1 md:grid-cols-2 items-center gap-4 sm:gap-5 md:gap-8 lg:gap-16 min-h-0">

        {/* ── LOGO — order-1 on mobile (right after navbar), order-2/right column on desktop ── */}
        <div className="hero-fade-in delay-300 order-1 md:order-2 relative flex items-center justify-center md:justify-end z-10">
          {/* Subtle radial glow behind the logo only */}
          <div
            className="absolute pointer-events-none"
            style={{
              width: "80%",
              height: "80%",
              background: "radial-gradient(circle, rgba(200,155,60,0.22) 0%, transparent 70%)",
            }}
          />
          <img
            src={cafeImage}
            alt="GJ 21 Cafe Logo"
            className="hero-float relative w-[210px] xs:w-[230px] sm:w-[260px] md:w-[380px] lg:w-[460px] xl:w-[520px] max-w-full h-auto object-contain"
          />
        </div>

        {/* ── LEFT TEXT — order-2 on mobile (below logo), order-1/left column on desktop ── */}
        <div className="order-2 md:order-1 flex flex-col items-center text-center md:items-start md:text-left gap-4 sm:gap-5 z-10">

          {/* Eyebrow badge */}
          <div className="hero-fade-up delay-100 inline-flex flex-wrap items-center justify-center gap-2.5 w-fit max-w-full bg-[#c89b3c]/10 border border-[#c89b3c]/20 !text-[#c89b3c] px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase backdrop-blur-sm">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#c89b3c] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#c89b3c]" />
            </span>
            <span>Now Open · 2 PM – 2 AM</span>
          </div>

          {/* Heading */}
          <div className="hero-fade-up delay-200 flex flex-col gap-1 items-center md:items-start">
            <p className="!text-white/40 text-xs sm:text-base font-medium tracking-[0.08em] uppercase">
              Welcome to
            </p>
            <h1 className="text-[36px] xs:text-[40px] sm:text-5xl md:text-[52px] lg:text-[62px] xl:text-[68px] font-extrabold leading-[1.08] tracking-tight">
              <span className="text-shimmer">GJ 21</span>
              <span className="!text-white"> Cafe</span>
            </h1>
          </div>

          {/* Divider */}
          <div className="hero-fade-up delay-200 flex items-center gap-3">
            <div className="w-10 h-[2px] bg-gradient-to-r from-[#c89b3c] to-[#c89b3c]/20 rounded-full" />
            <div className="w-2 h-[2px] bg-[#c89b3c]/20 rounded-full" />
          </div>

          {/* Subtitle */}
          <p className="hero-fade-up delay-300 !text-white/55 text-sm sm:text-[15px] leading-[1.75] max-w-[280px] xs:max-w-[300px] sm:max-w-[420px]">
            Where every sip tells a story ☕✨<br />
            Experience the perfect blend of taste, comfort, and vibes.
          </p>

          {/* Buttons — equal width, centered as a group */}
          <div className="hero-fade-up delay-400 grid grid-cols-2 sm:flex sm:flex-wrap gap-3 w-full max-w-xs sm:max-w-none sm:w-auto mx-auto sm:mx-0">
            <Link
              to="/menu"
              className="group relative text-center overflow-hidden bg-[#c89b3c] hover:bg-[#b88a2f] !text-white font-bold px-4 sm:px-7 py-3 sm:py-3 rounded-2xl text-sm tracking-wide transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(200,155,60,0.45)] active:translate-y-0"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Order Now
                <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </Link>

            <Link
              to="/about"
              className="text-center border border-white/15 hover:border-[#c89b3c]/40 !text-white/65 hover:!text-white px-4 sm:px-7 py-3 sm:py-3 rounded-2xl text-sm hover:bg-white/[0.06] tracking-wide transition-all duration-300 hover:-translate-y-1 backdrop-blur-sm"
            >
              About Us
            </Link>
          </div>

          {/* Stats — equal spacing, centered */}
          <div className="hero-fade-up delay-500 flex items-stretch justify-center md:justify-start gap-x-0 mx-auto md:mx-0">
            {stats.map(({ num, label, icon }, idx) => (
              <div key={label} className="flex items-center">
                <div className="flex flex-col items-center md:items-start gap-0.5 px-4 sm:px-5 first:pl-0 min-w-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-2xl font-extrabold text-[#c89b3c] leading-none">{num}</span>
                    <span className="leading-none">{icon}</span>
                  </div>
                  <p className="text-[9px] sm:text-[11px] !text-white/35 font-medium tracking-widest uppercase whitespace-nowrap mt-1">
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
      </div>

      {/* ── BOTTOM MARQUEE — hugs directly below stats, seamless infinite scroll ── */}
      <div className="relative border-t border-white/[0.07] bg-white/[0.03] py-2.5 sm:py-3 overflow-hidden flex-shrink-0 z-10">
        <div className="flex animate-marquee whitespace-nowrap w-max will-change-transform">
          {[...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="!text-white/50 text-[9px] sm:text-xs font-semibold tracking-[0.15em] sm:tracking-[0.2em] uppercase mr-8 sm:mr-14"
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