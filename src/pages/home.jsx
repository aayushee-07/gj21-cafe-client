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
    <section className="relative flex h-[calc(100vh-73px)] flex-col overflow-hidden bg-[#24110d] text-white">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.028)_0%,rgba(0,0,0,0)_44%),linear-gradient(to_bottom,rgba(255,255,255,0.01),transparent_18%,transparent_82%,rgba(0,0,0,0.22))]" />

      <div className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col px-5 sm:px-6 lg:px-8">
        <div className="flex h-[73px] shrink-0 items-center justify-between bg-[#ddd8d3] px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#d0a33a] text-[14px] font-extrabold tracking-wide text-white">
              GJ
            </div>
            <div className="flex items-baseline gap-2 text-[30px] font-extrabold tracking-[-0.04em] text-[#2d2622]">
              <span>GJ</span>
              <span className="text-[#d0a33a]">21</span>
              <span>Cafe</span>
            </div>
          </div>

          <div className="hidden items-center gap-10 md:flex">
            <nav className="flex items-center gap-10 text-[18px] font-medium text-[#5d564f]">
              <a href="#home" className="transition hover:text-[#2b1a16]">
                Home
              </a>
              <a href="#about" className="transition hover:text-[#2b1a16]">
                About
              </a>
              <a href="#menu" className="transition hover:text-[#2b1a16]">
                Menu
              </a>
            </nav>

            <div className="h-8 w-px bg-white/70" />

            <button className="text-[22px] leading-none text-[#ef4444]">♥</button>
            <button className="text-[22px] leading-none text-[#d0a33a]">🛒</button>

            <div className="h-8 w-px bg-white/70" />

            <button className="h-[44px] rounded-[14px] bg-[#d0a33a] px-8 text-[17px] font-semibold text-white shadow-[0_6px_18px_rgba(0,0,0,0.12)] transition hover:bg-[#bd912a]">
              Login
            </button>
          </div>

          <button className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-white/60 text-[#2b1a16] md:hidden">
            ☰
          </button>
        </div>

        <div className="grid flex-1 grid-cols-1 items-center lg:grid-cols-[45%_55%]">
          <div className="flex flex-col justify-center px-2 py-8 sm:px-4 lg:px-0 lg:py-0">
            <div className="inline-flex w-fit items-center gap-2.5 rounded-full border border-[#c89b3c]/20 bg-[#c89b3c]/10 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#c89b3c]/90 sm:text-xs">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#c89b3c] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#c89b3c]" />
              </span>
              <span>Now Open · 2 PM – 2 AM</span>
            </div>

            <div className="mt-6">
              <p className="text-[18px] font-medium tracking-[0.03em] text-white/55 sm:text-[19px]">
                Welcome to
              </p>
              <h1 className="mt-2 max-w-[620px] text-[46px] font-extrabold leading-[0.94] tracking-[-0.05em] sm:text-[60px] md:text-[72px] lg:text-[90px]">
                <span className="text-[#d0a33a]">GJ 21</span>{" "}
                <span className="text-white">Cafe</span>
              </h1>
            </div>

            <div className="mt-8 h-[2px] w-14 bg-[#b58a2f]" />

            <p className="mt-7 max-w-[430px] text-[19px] leading-[1.6] text-white/55 sm:text-[21px]">
              Where every sip tells a story ☕ ✨
              <br />
              Experience the perfect blend of taste,
              <br />
              comfort, and vibes.
            </p>

            <div className="mt-8 flex flex-nowrap gap-3">
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

            <div className="mt-10 flex items-start">
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
              className="relative w-[420px] max-w-full object-contain sm:w-[520px] md:w-[620px] lg:w-[760px] xl:w-[840px]"
            />
          </div>
        </div>
      </div>

      <div className="relative z-10 shrink-0 border-t border-white/10 bg-[#24110d]">
        <div className="mx-auto flex max-w-[1440px] items-center gap-8 overflow-x-hidden px-4 py-3 text-[14px] font-semibold tracking-[0.08em] text-white/68 sm:px-6 lg:px-8">
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