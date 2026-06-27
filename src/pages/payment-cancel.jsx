import { useNavigate } from "react-router-dom";

export default function PaymentCancel() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-amber-50 flex items-center justify-center px-4 py-14">

      <div className="w-full max-w-md">

        {/* ── HEADER ── */}
        <div className="text-center mb-7">

          {/* Icon ring */}
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-100 to-rose-200
          flex items-center justify-center mx-auto mb-5 shadow-lg shadow-red-200/50">
            <span className="text-4xl">❌</span>
          </div>

          <h1 className="text-2xl font-bold text-stone-800 tracking-tight mb-1">
            Payment Cancelled
          </h1>
          <p className="text-stone-400 text-sm">
            Your payment was not completed. No charges were made.
          </p>

        </div>

        {/* ── CARD ── */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-lg p-6">

          {/* Info box */}
          <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-4 mb-6">
            <p className="text-xs font-semibold text-red-500 uppercase tracking-widest mb-2">
              What happened?
            </p>
            <ul className="flex flex-col gap-1.5 text-sm text-stone-500">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                Your payment was cancelled or declined
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                Your cart items are still saved
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                You can retry or choose Cash on Delivery
              </li>
            </ul>
          </div>

          {/* BUTTONS */}
          <div className="flex flex-col gap-3">

            {/* RETRY */}
            <button
              onClick={() => navigate("/checkout")}
              className="w-full py-3 bg-[#c89b3c] hover:bg-[#b88a2f] text-white
              rounded-xl font-semibold text-sm tracking-wide
              shadow-md shadow-amber-200 hover:shadow-amber-300
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              🔄 Try Again
            </button>

            {/* CART */}
            <button
              onClick={() => navigate("/cart")}
              className="w-full py-3 bg-stone-800 hover:bg-stone-900 text-white
              rounded-xl font-semibold text-sm tracking-wide
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              🛒 Back to Cart
            </button>

            {/* HOME */}
            <button
              onClick={() => navigate("/")}
              className="w-full py-3 bg-stone-100 hover:bg-stone-200 text-stone-600
              rounded-xl font-semibold text-sm tracking-wide
              hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200"
            >
              Back to Home
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}