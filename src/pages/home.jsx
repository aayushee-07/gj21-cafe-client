import { Link } from "react-router-dom";
import cafeImage from "/cafelogo1.png";

function Home() {
  return (
    <section className="relative bg-[#1a0e0c] text-white min-h-screen md:h-[88vh] flex flex-col overflow-x-hidden">
      {/* ── SUBTLE BACKGROUND — no glow, just a soft vignette ── */}
      <div className="absolute inset-0 bg-radial-[ellipse_at_center] from-[#2e1a12]/60 to-[#1a0e0c] pointer-events-none" />

      {/* Very faint warm tint top */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-b from-[#c89b3c]/5 to-transparent pointer-events-none" />

      {/* ── MAIN CONTENT — fills remaining height ── */}
      <div className="relative flex-1 max-w-7xl mx-auto px-4 md:px-10 w-full grid md:grid-cols-2 items-center gap-6 py-10 md:py-0">
        {/* ── LEFT TEXT ── */}
        <div className="flex flex-col gap-5">
          {/* Eyebrow badge */}
          <div className="inline-flex items-center gap-2 w-fit bg-white/5 border border-white/10 text-white/50 px-4 py-1 rounded-full text-xs font-semibold tracking-[0.15em] uppercase">
            <span className="w-1.5 h-1.5 rounded-full bg-[#c89b3c]" />
            Now Open · 2 PM to 2 AM
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[60px] font-extrabold leading-[1.1] tracking-tight">
            Welcome to
            <br />
            <span className="text-[#c89b3c]">GJ 21</span>{" "}
            <span className="text-white">Cafe</span>
          </h1>

          {/* Divider */}
          <div className="w-12 h-px bg-[#c89b3c]/50 rounded-full" />

          {/* Subtitle */}
          <p className="text-white/50 text-base md:text-base leading-relaxed max-w-sm">
            Where every sip tells a story ☕✨<br />
            Experience the perfect blend of taste, comfort, and vibes.
          </p>

          {/* Buttons */}
          <div className="flex gap-3 flex-wrap">
            <Link
              to="/menu"
              className="bg-[#c89b3c] hover:bg-[#b88a2f] text-white font-bold px-6 py-2.5 rounded-xl text-sm tracking-wide transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
            >
              Order Now →
            </Link>

            <Link
              to="/about"
              className="border border-white/15 hover:border-white/30 text-white/60 hover:text-white px-6 py-2.5 rounded-xl text-sm hover:bg-white/5 tracking-wide transition-all duration-200"
            >
              About Us
            </Link>
          </div>

          {/* Stats */}
          <div className="flex gap-4 sm:gap-6 pt-1">
            {[
              ["4.6+", "Star Rating"],
              ["2+", "Years Open"],
              ["50+", "Menu Items"],
            ].map(([num, label]) => (
              <div key={label}>
                <p className="text-lg font-extrabold text-[#c89b3c]">{num}</p>
                <p className="text-[11px] text-white/30 font-medium tracking-wide mt-0.5">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT LOGO ── */}
        <div className="flex items-center justify-center md:justify-end">
          <img
            src={cafeImage}
            alt="GJ 21 Cafe Logo"
            className="w-48 sm:w-64 md:w-[440px] lg:w-[520px] max-w-full object-contain mix-blend-screen"
            style={{ filter: "contrast(1.05)" }}
          />
        </div>
      </div>

      {/* ── BOTTOM MARQUEE ── */}
      <div className="relative border-t border-white/10 bg-white/5 py-2 overflow-hidden flex-shrink-0">
        <div className="flex gap-12 animate-marquee whitespace-nowrap w-max">
          {[
            "☕ Premium Coffee",
            "🍽️ Fresh Food",
            "✨ Cozy Vibes",
            "🎵 Good Music",
            "📍 Chikhli, Navsari",
            "⏰ Open till 2 AM",
            "⭐ 4.6 Rated",
            "🚚 Home Delivery",
            "☕ Premium Coffee",
            "🍽️ Fresh Food",
            "✨ Cozy Vibes",
            "🎵 Good Music",
            "📍 Chikhli, Navsari",
            "⏰ Open till 2 AM",
            "⭐ 4.6 Rated",
            "🚚 Home Delivery",
          ].map((item, i) => (
            <span
              key={i}
              className="text-white/70 text-xs font-semibold tracking-widest uppercase"
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