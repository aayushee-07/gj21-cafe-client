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
    <section className="relative bg-[#150d0a] text-white min-h-[calc(100vh-73px)] lg:h-[calc(100vh-73px)] flex flex-col justify-between overflow-hidden">

      {/* ── MAIN CONTENT ── */}
      <div className="relative flex-1 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-14 py-10 sm:py-12 md:py-14 lg:py-0 w-full grid md:grid-cols-2 items-center gap-10 md:gap-8 lg:gap-16">

        {/* ── LEFT TEXT ── */}
        <div className="flex flex-col gap-5 sm:gap-6 z-10">

          {/* Eyebrow badge */}
          <div className="inline-flex flex-wrap items-center gap-2.5 w-fit max-w-full bg-white/[0.04] border border-white/10 text-[#c89b3c]/90 px-4 py-2 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.18em] uppercase">
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
            <div className="w-10 h-[2px] bg-[#c89b3c]/60 rounded-full" />
          </div>

          {/* Subtitle */}
          <p className="text-white/55 text-sm sm:text-[15px] leading-[1.85] max-w-[300px] sm:max-w-[420px]">
            Where every sip tells a story ☕✨<br />
            Experience the perfect blend of taste, comfort, and vibes.
          </p>

          {/* Buttons */}
          <div className="flex gap-3">
            <Link
              to="/menu"
              className="group relative w-[150px] text-center overflow-hidden bg-[#c89b3c] hover:bg-[#b88a2f] text-white font-bold px-6 py-3.5 sm:py-3 rounded-2xl text-sm tracking-wide transition-all duration-300"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Order Now
                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </span>
            </Link>

            <Link
              to="/about"
              className="w-[150px] text-center border border-white/15 hover:border-white/30 text-white/65 hover:text-white px-6 py-3.5 sm:py-3 rounded-2xl text-sm hover:bg-white/[0.06] tracking-wide transition-all duration-300"
            >
              About Us
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap items-stretch gap-y-3 gap-x-0 pt-1">
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

        {/* ── RIGHT LOGO ── */}
        <div className="relative flex items-center justify-center md:justify-end z-10 pt-4 pb-6 md:py-0">
          {/* Subtle radial highlight behind the logo only */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(circle at center, rgba(200,155,60,0.12) 0%, transparent 65%)",
            }}
          />
          <img
            src={cafeImage}
            alt="GJ 21 Cafe Logo"
            className="relative w-60 sm:w-80 md:w-[420px] lg:w-[500px] xl:w-[560px] max-w-full h-auto object-contain mix-blend-screen"
          />
        </div>
      </div>

      {/* ── BOTTOM MARQUEE ── */}
      <div className="relative border-t border-white/[0.07] py-3 overflow-hidden flex-shrink-0 z-10">
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