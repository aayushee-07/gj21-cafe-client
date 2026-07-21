import { Link } from "react-router-dom";
import cafeImage from "/cafelogo1.png";

const stats = [
  { num: "4.6+", label: "Star Rating", icon: "⭐" },
  { num: "2+", label: "Years Open", icon: "🏆" },
  { num: "50+", label: "Menu Items", icon: "🍽️" },
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
    <section className="relative flex min-h-[calc(100vh-73px)] flex-col justify-between overflow-hidden bg-[#24110d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.025)_0%,rgba(0,0,0,0)_42%),linear-gradient(to_bottom,rgba(255,255,255,0.02),transparent_15%,transparent_85%,rgba(0,0,0,0.22))]" />

      <div className="relative mx-auto flex w-full max-w-7xl flex-1 grid-cols-1 items-center gap-10 px-5 py-10 sm:px-8 md:px-12 lg:grid lg:grid-cols-[45%_55%] lg:px-14 lg:py-0">
        <div className="flex flex-col gap-5 sm:gap-6 z-10">
          <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[#c89b3c]/20 bg-[#c89b3c]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c89b3c]/90 backdrop-blur-sm sm:text-xs">
            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c89b3c] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c89b3c]" />
            </span>
            <span>Now Open · 2 PM – 2 AM</span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-[18px] font-medium tracking-[0.03em] text-white/55 sm:text-[19px]">
              Welcome to
            </p>
            <h1 className="max-w-[620px] text-[46px] font-extrabold leading-[0.94] tracking-[-0.05em] sm:text-[60px] md:text-[72px] lg:text-[90px]">
              <span className="text-[#d0a33a]">GJ 21</span>{" "}
              <span className="text-white">Cafe</span>
            </h1>
          </div>

          <div className="h-[2px] w-14 bg-[#b58a2f]" />

          <p className="max-w-[430px] text-[19px] leading-[1.6] text-white/55 sm:text-[21px]">
            Where every sip tells a story ☕ ✨
            <br />
            Experience the perfect blend of taste,
            <br />
            comfort, and vibes.
          </p>

          <div className="flex flex-nowrap gap-3">
            <Link
              to="/menu"
              className="inline-flex h-[56px] w-[168px] items-center justify-center rounded-[14px] bg-[#d0a33a] text-[18px] font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition hover:bg-[#bd912a]"
            >
              Order Now →
            </Link>
            <Link
              to="/about"
              className="inline-flex h-[56px] w-[136px] items-center justify-center rounded-[14px] border border-white/12 text-[18px] font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              About Us
            </Link>
          </div>

          <div className="mt-2 flex items-start">
            {stats.map((item, idx) => (
              <div key={item.label} className="flex items-start">
                <div className="pr-8 sm:pr-10">
                  <div className="text-[28px] font-extrabold leading-none tracking-[-0.04em] text-[#d0a33a]">
                    {item.num}
                  </div>
                  <div className="mt-2 text-[15px] font-medium text-white/42">
                    {item.label}
                  </div>
                </div>
                {idx < stats.length - 1 && <div className="mr-8 h-10 w-px bg-white/10 sm:mr-10" />}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <img
            src={cafeImage}
            alt="GJ 21 Cafe Logo"
            className="relative w-[420px] max-w-full object-contain sm:w-[520px] md:w-[620px] lg:w-[760px] xl:w-[820px]"
          />
        </div>
      </div>

      <div className="relative border-t border-white/10 bg-[#24110d]">
        <div className="mx-auto flex max-w-7xl items-center gap-8 overflow-x-auto px-4 py-3 text-[14px] font-semibold tracking-[0.08em] text-white/68 sm:px-6 lg:px-8">
          {marqueeItems.map((item) => (
            <span key={item} className="whitespace-nowrap">
              {item}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Home;