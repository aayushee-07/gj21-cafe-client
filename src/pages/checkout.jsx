import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../lib/apiClient";

export default function Checkout({ cartItems, clearCart }) {
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    fullName: "",
    phone: "",
    house: "",
    street: "",
    area: "",
    city: "",
    pincode: "",
    landmark: "",
    deliveryDistance: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    api.get("/coupons/active")
      .then(res => setAvailableCoupons(res.data))
      .catch(err => console.error(err));
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const numericDistance = Number(address.deliveryDistance);

  const deliveryFee =
    numericDistance <= 5 ? 20 :
      numericDistance <= 10 ? 40 : 0;

  const total = subtotal + deliveryFee;
  const finalTotal = total - discount;

  const applyCoupon = async (code) => {
    try {
      const res = await api.post("/coupons/validate", {
        code,
        orderAmount: total,
      });

      setCouponCode(code);
      setDiscount(res.data.discount);
      setCouponMessage("Coupon applied successfully 🎉");
    } catch (err) {
      setDiscount(0);
      setCouponMessage(
        err.response?.data?.message || "Invalid coupon"
      );
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setAddress({
      ...address,
      [name]: name === "deliveryDistance" ? Number(value) : value,
    });
  };

  const handlePlaceOrder = async () => {
    setError("");

    const requiredFields = [
      "fullName",
      "phone",
      "house",
      "city",
      "pincode",
      "deliveryDistance",
    ];

    for (let field of requiredFields) {
      if (!address[field] || address[field].toString().trim() === "") {
        setError("⚠️ Please fill required details");
        return;
      }
    }

    if (address.phone.length !== 10) {
      setError("⚠️ Enter valid 10 digit phone number");
      return;
    }

    if (Number(address.deliveryDistance) > 10) {
      setError("⚠️ Delivery available only within 10 KM");
      return;
    }

    setLoading(true);

    try {
      const orderItems = cartItems.map((item) => ({
        menuItem: item._id,
        quantity: item.quantity,
      }));

      const res = await api.post("/orders", {
        items: orderItems,
        deliveryAddress: address,
        paymentMethod,
        specialInstructions: instructions,
        couponCode,
      });

      // ✅ FIX: Backend returns savedOrder directly, not { order: savedOrder }
      const orderId = res.data._id;

      if (paymentMethod === "ONLINE") {
        const stripeRes = await api.post("/payment/create-checkout-session", {
          items: cartItems,
          orderId,
        });

        window.location.href = stripeRes.data.url;
        return;
      }

      clearCart();
      localStorage.removeItem("cart");
      navigate(`/order-success/${orderId}`);

    } catch (err) {
      setError(err.response?.data?.error || "Order failed ❌");
    } finally {
      setLoading(false);
    }
  };

  if (!cartItems.length) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <p className="text-stone-400 text-[15px]">Your cart is empty.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-amber-50 py-8 md:py-14 text-stone-800">
      <div className="max-w-6xl mx-auto px-4">

        {/* Heading */}
        <div className="text-center mb-8 md:mb-12">
          <p className="text-xs font-semibold tracking-[0.18em] uppercase text-[#c89b3c] mb-2">
            Almost There
          </p>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-stone-800 tracking-tight">
            🧾 Checkout
          </h1>
          <div className="w-12 h-0.5 bg-gradient-to-r from-[#c89b3c] to-[#d4a84b] mx-auto mt-4 rounded-full" />
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-start">

          {/* ── LEFT — DELIVERY FORM ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 sm:p-6">

            <h2 className="text-xs font-semibold text-[#c89b3c] tracking-wide uppercase mb-6 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-[#c89b3c] flex items-center justify-center text-xs font-bold">1</span>
              Delivery Details
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                ["fullName", "Full Name", "text", "col-span-2"],
                ["phone", "Phone Number", "text", ""],
                ["house", "House / Flat No", "text", ""],
                ["street", "Street", "text", ""],
                ["area", "Area", "text", ""],
                ["city", "City", "text", ""],
                ["pincode", "Pincode", "text", ""],
                ["deliveryDistance", "Distance from cafe (KM)", "number", ""],
                ["landmark", "Landmark (optional)", "text", "col-span-2"],
              ].map(([name, label, type, span]) => (
                <div className={`flex flex-col gap-1 ${span}`} key={name}>
                  <label className="text-xs font-medium text-stone-500 tracking-wide">
                    {label}
                    {["fullName","phone","house","city","pincode","deliveryDistance"].includes(name) && (
                      <span className="text-[#c89b3c] ml-0.5">*</span>
                    )}
                  </label>
                  <input
                    type={type}
                    name={name}
                    value={address[name]}
                    onChange={handleChange}
                    className="w-full border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl
                    text-sm text-stone-800 placeholder:text-stone-300
                    focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
                    transition-all duration-150"
                  />
                </div>
              ))}
            </div>

            {/* Payment method */}
            <div className="mt-5 flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 tracking-wide">
                Payment Method <span className="text-[#c89b3c]">*</span>
              </label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl
                text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40
                focus:border-[#c89b3c] transition-all duration-150"
              >
                <option value="COD">💵 Cash on Delivery</option>
                <option value="ONLINE">💳 Online Payment</option>
              </select>
            </div>

            {/* Special instructions */}
            <div className="mt-4 flex flex-col gap-1">
              <label className="text-xs font-medium text-stone-500 tracking-wide">
                Special Instructions
              </label>
              <textarea
                placeholder="e.g. No onions, extra sauce, ring the bell..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
                className="w-full border border-stone-200 bg-stone-50 px-3 py-2.5 rounded-xl
                text-sm text-stone-800 placeholder:text-stone-300 resize-none
                focus:outline-none focus:ring-2 focus:ring-[#c89b3c]/40 focus:border-[#c89b3c]
                transition-all duration-150"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="mt-4 bg-red-50 border border-red-200 text-red-500 text-sm
              px-4 py-3 rounded-xl">
                {error}
              </div>
            )}
          </div>

          {/* ── RIGHT — ORDER SUMMARY ── */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 sm:p-6 md:sticky md:top-24">

            <h2 className="text-xs font-semibold text-[#c89b3c] tracking-wide uppercase
            mb-6 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-100 text-[#c89b3c] flex items-center
              justify-center text-xs font-bold">2</span>
              Order Summary
            </h2>

            {/* Items list */}
            <div className="flex flex-col gap-2 mb-4">
              {cartItems.map((item) => (
                <div key={item._id} className="flex justify-between items-center text-sm">
                  <span className="text-stone-600 truncate max-w-[60%]">
                    {item.name}
                    <span className="text-stone-400 ml-1">× {item.quantity}</span>
                  </span>
                  <span className="font-semibold text-stone-700">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>

            <hr className="border-dashed border-stone-200 my-4" />

            {/* Price breakdown */}
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-stone-500">
                <span>Subtotal</span>
                <span>₹{subtotal}</span>
              </div>
              <div className="flex justify-between text-stone-500">
                <span>Delivery fee</span>
                <span className={numericDistance > 10 ? "text-red-400" : ""}>
                  {numericDistance > 10 ? "Out of range" : `₹${deliveryFee}`}
                </span>
              </div>
            </div>

            {/* ── DELIVERY FEE INFO ── */}
            <div className="mt-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex flex-col gap-1">
              <p className="text-xs font-semibold text-blue-600 mb-1">🛵 Delivery Fee Info</p>
              <div className="flex items-center justify-between text-xs text-blue-500">
                <span>Within 5 km</span>
                <span className="font-bold">₹20</span>
              </div>
              <div className="flex items-center justify-between text-xs text-blue-500">
                <span>5 km – 10 km</span>
                <span className="font-bold">₹40</span>
              </div>
              <div className="flex items-center justify-between text-xs text-red-400">
                <span>Above 10 km</span>
                <span className="font-bold">Not available</span>
              </div>
            </div>

            {/* COUPONS */}
            <div className="bg-amber-50 border border-amber-100 rounded-xl mt-5 p-4">
              <h3 className="text-xs font-semibold text-[#c89b3c] uppercase tracking-wide mb-3 flex items-center gap-1.5">
                🎁 Available Coupons
              </h3>

              {availableCoupons.length === 0 ? (
                <div className="text-center py-3">
                  <p className="text-stone-400 text-sm">😕 No coupons available</p>
                  <p className="text-xs text-stone-300 mt-1">Check back later for exciting offers!</p>
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {availableCoupons.map((coupon) => (
                    <div
                      key={coupon._id}
                      className="flex justify-between items-center gap-3 bg-white border border-stone-100
                      rounded-xl px-3 py-2.5"
                    >
                      <div className="min-w-0">
                        <p className="font-bold text-stone-800 text-sm tracking-wide truncate">{coupon.code}</p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}% off`
                            : `₹${coupon.discountValue} off`}
                        </p>
                      </div>

                      <button
                        onClick={() => applyCoupon(coupon.code)}
                        className="flex-shrink-0 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5
                        rounded-lg text-xs font-semibold transition-all duration-150
                        shadow-sm shadow-green-200 hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Apply
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Coupon message */}
            {couponMessage && (
              <p className={`text-sm mt-3 font-medium ${
                couponMessage.includes("successfully") ? "text-green-600" : "text-red-400"
              }`}>
                {couponMessage}
              </p>
            )}

            {/* Discount row */}
            {discount > 0 && (
              <div className="flex justify-between text-green-600 text-sm mt-2 font-medium">
                <span>Discount</span>
                <span>− ₹{discount}</span>
              </div>
            )}

            <hr className="border-dashed border-stone-200 my-4" />

            {/* Final total */}
            <div className="flex justify-between items-center">
              <span className="text-stone-500 text-sm font-medium">Total Payable</span>
              <span className="text-2xl font-bold text-green-600">₹{finalTotal}</span>
            </div>

            <button
              onClick={handlePlaceOrder}
              disabled={loading}
              className="w-full mt-5 bg-green-600 hover:bg-green-700 disabled:bg-green-400
              text-white py-3 rounded-xl font-semibold text-sm tracking-wide
              transition-all duration-200 shadow-md shadow-green-200
              hover:shadow-green-300 hover:-translate-y-0.5 active:translate-y-0
              disabled:cursor-not-allowed disabled:translate-y-0"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                  Placing Order...
                </span>
              ) : (
                "Place Order 🚀"
              )}
            </button>

            <p className="text-center text-xs text-stone-300 mt-3">
              🔒 Secure & encrypted checkout
            </p>

          </div>

        </div>
      </div>
    </main>
  );
}