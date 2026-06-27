import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BASE = "http://localhost:5001/api";

export default function ForgotPassword() {
    const [step, setStep] = useState(1); // 1=email, 2=otp+newpass, 3=success
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showPass, setShowPass] = useState(false);
    const navigate = useNavigate();

    // ── STEP 1: Send OTP to email ──
    // POST /api/auth/forgot-password  { email }
    const handleSendOtp = async (e) => {
        e.preventDefault();
        setError("");
        if (!email.trim()) return setError("Please enter your email address.");
        setLoading(true);
        try {
            await axios.post(`${BASE}/auth/forgot-password`, {
                email: email.trim().toLowerCase(),
            });
            setStep(2);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Failed to send OTP. Please check your email and try again."
            );
        } finally {
            setLoading(false);
        }
    };

    // ── STEP 2: Verify OTP + set new password ──
    // POST /api/auth/reset-password  { email, otp, newPassword }
    const handleResetPassword = async (e) => {
        e.preventDefault();
        setError("");
        if (!otp.trim()) return setError("Please enter the OTP sent to your email.");
        if (newPassword.length < 6) return setError("Password must be at least 6 characters.");
        if (newPassword !== confirmPassword) return setError("Passwords do not match.");
        setLoading(true);
        try {
            await axios.post(`${BASE}/auth/reset-password`, {
                email: email.trim().toLowerCase(),
                otp: otp.trim(),
                password: newPassword,
            });
            setStep(3);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                err.response?.data?.error ||
                "Invalid or expired OTP. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="min-h-screen flex items-center justify-center px-4 py-12"
            style={{ background: "#faf8f5", fontFamily: "'Lora', serif" }}
        >
            {/* Decorative blobs */}
            <div className="fixed top-0 left-0 w-72 h-72 rounded-full pointer-events-none"
                style={{ background: "#e8d5be", opacity: 0.18, transform: "translate(-33%,-33%)" }} />
            <div className="fixed bottom-0 right-0 w-96 h-96 rounded-full pointer-events-none"
                style={{ background: "#c89b3c", opacity: 0.08, transform: "translate(33%,33%)" }} />

            <div className="w-full max-w-sm relative z-10">

                {/* ── HEADER ── */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center mb-5 mx-auto w-20 h-20 bg-white rounded-2xl shadow-lg">
                        <span style={{ fontSize: 36 }}>🔑</span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-tight mb-1" style={{ color: "#3d2b1f" }}>
                        {step === 1 && "Forgot Password"}
                        {step === 2 && "Reset Password"}
                        {step === 3 && "Password Reset!"}
                    </h1>
                    <p className="text-sm tracking-widest uppercase mb-5" style={{ color: "#9b8272" }}>
                        {step === 1 && "Enter your email to get OTP"}
                        {step === 2 && "Enter OTP & new password"}
                        {step === 3 && "You're all set"}
                    </p>
                    {/* Divider */}
                    <div className="flex items-center justify-center gap-3">
                        <div className="h-px flex-1" style={{ background: "#e8d5be" }} />
                        <div className="w-2 h-2 rounded-full" style={{ background: "#e8d5be" }} />
                        <div className="h-px flex-1" style={{ background: "#e8d5be" }} />
                    </div>
                </div>

                {/* ── CARD ── */}
                <div
                    className="bg-white rounded-3xl p-8 shadow-2xl"
                    style={{
                        border: "1px solid #ede0d0",
                        boxShadow: "0 25px 50px -12px rgba(122,88,56,0.15), 0 8px 32px rgba(122,88,56,0.08)",
                    }}
                >

                    {/* ── STEP INDICATOR ── */}
                    {step < 3 && (
                        <div className="flex items-center justify-center gap-3 mb-7">
                            {[1, 2].map((s) => (
                                <React.Fragment key={s}>
                                    <div style={{
                                        width: 28, height: 28, borderRadius: "50%",
                                        background: step >= s
                                            ? "linear-gradient(135deg,#c89b3c,#b8943a)"
                                            : "#f3ece3",
                                        border: step >= s ? "none" : "1px solid #e8d5be",
                                        display: "flex", alignItems: "center", justifyContent: "center",
                                        fontSize: 12, fontWeight: 800,
                                        color: step >= s ? "#fff" : "#c4a882",
                                        transition: "all 0.3s",
                                        boxShadow: step >= s ? "0 4px 10px rgba(200,155,60,0.3)" : "none",
                                    }}>
                                        {s}
                                    </div>
                                    {s < 2 && (
                                        <div style={{
                                            flex: 1, height: 2, borderRadius: 1,
                                            background: step > s ? "linear-gradient(90deg,#c89b3c,#b8943a)" : "#e8d5be",
                                            transition: "background 0.4s",
                                        }} />
                                    )}
                                </React.Fragment>
                            ))}
                        </div>
                    )}

                    {/* ── ERROR ── */}
                    {error && (
                        <div className="mb-5 px-4 py-3 rounded-xl text-sm text-center font-medium"
                            style={{ background: "#fff5f5", color: "#c0392b", border: "1px solid #fecaca" }}>
                            ⚠️ {error}
                        </div>
                    )}

                    {/* ══ STEP 1: EMAIL ══ */}
                    {step === 1 && (
                        <form onSubmit={handleSendOtp} className="space-y-5">
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-widest uppercase"
                                    style={{ color: "#9b8272" }}>
                                    Email Address <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="you@gjcafe.com"
                                    required
                                />
                                <p className="text-xs mt-1" style={{ color: "#b8a090" }}>
                                    We'll send a one-time password to this email.
                                </p>
                            </div>

                            <SubmitButton loading={loading} label="Send OTP →" />
                        </form>
                    )}

                    {/* ══ STEP 2: OTP + NEW PASSWORD ══ */}
                    {step === 2 && (
                        <form onSubmit={handleResetPassword} className="space-y-5">

                            {/* Email display (read-only) */}
                            <div className="px-4 py-3 rounded-xl text-sm text-center font-medium"
                                style={{ background: "#fdf8f2", border: "1px solid #e8d5be", color: "#9b8272" }}>
                                OTP sent to <span style={{ color: "#c89b3c", fontWeight: 700 }}>{email}</span>
                            </div>

                            {/* OTP */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-widest uppercase"
                                    style={{ color: "#9b8272" }}>
                                    OTP Code <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                    type="text"
                                    value={otp}
                                    onChange={e => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                    placeholder="Enter 6-digit OTP"
                                    maxLength={6}
                                    required
                                />
                            </div>

                            {/* New Password */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-widest uppercase"
                                    style={{ color: "#9b8272" }}>
                                    New Password <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <InputField
                                        type={showPass ? "text" : "password"}
                                        value={newPassword}
                                        onChange={e => setNewPassword(e.target.value)}
                                        placeholder="Min. 6 characters"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPass(p => !p)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-xs"
                                        style={{ color: "#9b8272", background: "none", border: "none", cursor: "pointer" }}
                                    >
                                        {showPass ? "Hide" : "Show"}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm Password */}
                            <div className="space-y-2">
                                <label className="block text-xs font-semibold tracking-widest uppercase"
                                    style={{ color: "#9b8272" }}>
                                    Confirm Password <span className="text-red-500">*</span>
                                </label>
                                <InputField
                                    type={showPass ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={e => setConfirmPassword(e.target.value)}
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            {/* Password strength hint */}
                            {newPassword && (
                                <div style={{ display: "flex", gap: 4 }}>
                                    {[1, 2, 3, 4].map(i => (
                                        <div key={i} style={{
                                            flex: 1, height: 3, borderRadius: 2,
                                            background: newPassword.length >= i * 2
                                                ? i <= 1 ? "#ef4444" : i <= 2 ? "#f59e0b" : i <= 3 ? "#3b82f6" : "#10b981"
                                                : "#e8d5be",
                                            transition: "background 0.3s",
                                        }} />
                                    ))}
                                </div>
                            )}

                            <SubmitButton loading={loading} label="Reset Password →" />

                            {/* Resend OTP */}
                            <p className="text-center text-xs" style={{ color: "#9b8272" }}>
                                Didn't receive the OTP?{" "}
                                <button
                                    type="button"
                                    onClick={() => { setStep(1); setError(""); setOtp(""); }}
                                    className="font-bold underline underline-offset-2"
                                    style={{ color: "#c89b3c", background: "none", border: "none", cursor: "pointer" }}
                                >
                                    Resend
                                </button>
                            </p>
                        </form>
                    )}

                    {/* ══ STEP 3: SUCCESS ══ */}
                    {step === 3 && (
                        <div className="flex flex-col items-center gap-5 py-2">
                            <div style={{
                                width: 64, height: 64, borderRadius: 18,
                                background: "linear-gradient(135deg,#d1fae5,#a7f3d0)",
                                border: "1px solid #6ee7b7",
                                display: "flex", alignItems: "center", justifyContent: "center",
                                fontSize: 30,
                            }}>✅</div>
                            <div className="text-center">
                                <p className="font-bold text-base mb-1" style={{ color: "#3d2b1f" }}>
                                    Password updated successfully!
                                </p>
                                <p className="text-sm" style={{ color: "#9b8272", lineHeight: 1.6 }}>
                                    Your password has been reset. You can now log in with your new password.
                                </p>
                            </div>
                            <button
                                onClick={() => navigate("/login")}
                                className="w-full py-4 px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:-translate-y-1"
                                style={{
                                    background: "linear-gradient(135deg,#c89b3c,#b8943a)",
                                    color: "#fff", border: "none", cursor: "pointer",
                                    boxShadow: "0 10px 30px rgba(200,155,60,0.4)",
                                    fontFamily: "inherit",
                                }}
                            >
                                Go to Login →
                            </button>
                        </div>
                    )}

                </div>

                {/* Back to login */}
                {step < 3 && (
                    <div className="text-center mt-6">
                        <button
                            onClick={() => navigate("/login")}
                            className="text-sm hover:underline transition-colors"
                            style={{ color: "#9b8272", background: "none", border: "none", cursor: "pointer", fontFamily: "inherit" }}
                        >
                            ← Back to Login
                        </button>
                    </div>
                )}

                <div className="text-center mt-6" style={{ color: "#b8a090" }}>
                    <p className="text-xs">© {new Date().getFullYear()} GJ Café</p>
                </div>

            </div>
        </div>
    );
}

// ── SHARED COMPONENTS ──
function InputField({ className = "", ...props }) {
    return (
        <input
            {...props}
            className={`w-full px-4 py-3.5 rounded-xl text-sm font-medium outline-none transition-all duration-200 ${className}`}
            style={{ background: "#faf8f5", border: "1px solid #e8d5be", color: "#3d2b1f" }}
            onFocus={e => {
                e.target.style.borderColor = "#c89b3c";
                e.target.style.boxShadow = "0 0 0 3px rgba(200,155,60,0.15)";
                e.target.style.background = "#fdfcfb";
            }}
            onBlur={e => {
                e.target.style.borderColor = "#e8d5be";
                e.target.style.boxShadow = "none";
                e.target.style.background = "#faf8f5";
            }}
        />
    );
}

function SubmitButton({ loading, label }) {
    return (
        <button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 hover:-translate-y-1 active:translate-y-0 disabled:translate-y-0 disabled:cursor-not-allowed"
            style={{
                background: loading ? "#e8d5be" : "linear-gradient(135deg,#c89b3c,#b8943a)",
                color: "#fff", border: "none", fontFamily: "inherit",
                boxShadow: loading ? "none" : "0 10px 30px rgba(200,155,60,0.4)",
                cursor: loading ? "not-allowed" : "pointer",
            }}
        >
            {loading ? (
                <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 rounded-full animate-spin"
                        style={{ borderColor: "rgba(255,255,255,0.3)", borderTopColor: "#fff" }} />
                    Please wait…
                </span>
            ) : label}
        </button>
    );
}