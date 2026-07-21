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
    <section className="relative flex min-h-[calc(100vh-73px)] flex-col justify-between overflow-hidden bg-[#1a0d0a] text-white">
      <div
        className="pointer-events-none absolute -left-40 -top-40 h-[520px] w-[520px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,155,60,0.12) 0%, transparent 68%)",
        }}
      />
      <div
        className="pointer-events-none absolute -bottom-40 -right-32 h-[420px] w-[420px] rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(200,155,60,0.08) 0%, transparent 70%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\'/%3E%3C/svg%3E")',
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 items-center gap-8 px-5 py-10 sm:px-8 md:px-12 lg:grid-cols-2 lg:gap-10 lg:px-14 lg:py-0">
        <div className="z-10 flex flex-col justify-center gap-5">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-[#c89b3c]/20 bg-[#c89b3c]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c89b3c]/90 backdrop-blur-sm sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c89b3c] opacity-70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c89b3c]" />
            </span>
            <span>Now Open · 2 PM – 2 AM</span>
          </div>

          <div className="flex flex-col gap-1">
            <p className="text-sm font-medium uppercase tracking-[0.08em] text-white/45 sm:text-base">
              Welcome to
            </p>
            <h1 className="max-w-[620px] text-[44px] font-extrabold leading-[0.95] tracking-[-0.04em] sm:text-[58px] md:text-[72px] lg:text-[86px]">
              <span className="text-[#d0a33a]">GJ 21</span>{" "}
              <span className="text-white">Cafe</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-[2px] w-14 rounded-full bg-[#b48a2f]" />
          </div>

          <p className="max-w-[430px] text-[18px] leading-[1.6] text-white/55 sm:text-[20px] md:text-[22px]">
            Where every sip tells a story ☕ ✨
            <br />
            Experience the perfect blend of taste,
            <br />
            comfort, and vibes.
          </p>

          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <Link
              to="/menu"
              className="inline-flex h-[56px] min-w-[168px] items-center justify-center rounded-[14px] bg-[#d0a33a] px-8 text-[18px] font-bold text-white shadow-[0_12px_28px_rgba(0,0,0,0.18)] transition hover:bg-[#bd912a]"
            >
              Order Now →
            </Link>

            <Link
              to="/about"
              className="inline-flex h-[56px] min-w-[136px] items-center justify-center rounded-[14px] border border-white/12 bg-transparent px-8 text-[18px] font-medium text-white/70 transition hover:bg-white/5 hover:text-white"
            >
              About Us
            </Link>
          </div>

          <div className="flex flex-wrap items-stretch gap-x-0 gap-y-3 pt-2">
            {stats.map(({ num, label }, idx) => (
              <div key={label} className="flex items-center">
                <div className="min-w-0 px-4 first:pl-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-[28px] font-extrabold leading-none text-[#d0a33a]">
                      {num}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-nowrap text-[12px] font-medium text-white/40">
                    {label}
                  </p>
                </div>
                {idx < stats.length - 1 && <div className="mx-2 h-8 w-px bg-white/10" />}
              </div>
            ))}
          </div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative">
            <div
              className="pointer-events-none absolute inset-0 rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(200,155,60,0.15) 0%, transparent 68%)",
                transform: "scale(1.15)",
              }}
            />
            <img
              src={cafeImage}
              alt="GJ 21 Cafe Logo"
              className="relative w-[300px] max-w-full object-contain mix-blend-screen sm:w-[420px] md:w-[520px] lg:w-[640px] xl:w-[720px]"
              style={{
                filter: "contrast(1.08) drop-shadow(0 0 48px rgba(200,155,60,0.22))",
              }}
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 border-t border-white/[0.07] bg-[#24110d] py-3 overflow-hidden">
        <div className="flex w-max gap-10 whitespace-nowrap px-4 sm:gap-14">
          {[...marqueeItems, ...marqueeItems].map((item, i) => (
            <span
              key={i}
              className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/50 sm:text-xs"
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