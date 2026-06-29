"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { isAdminEmail } from "@/features/auth/lib/seed-admin"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase/supabase"
import { FiEye, FiEyeOff, FiArrowLeft, FiMail, FiLock } from "react-icons/fi"

export default function LoginPage() {
  const router = useRouter()

  const [formData, setFormData] = useState({ email: "", password: "", remember: false })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (!isSupabaseConfigured()) {
        setError("Authentication service is not configured.")
        return
      }

      const supabase = getSupabaseClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (signInError) {
        setError("Invalid email or password. Please try again.")
        return
      }

      if (data.user && !isAdminEmail(data.user.email)) {
        setError("Access denied. Only admins can access this dashboard.")
        await supabase.auth.signOut()
        return
      }

      router.push("/dashboard")
    } catch {
      setError("Something went wrong. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* ── Left panel (decorative) ── */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center relative overflow-hidden"
        style={{ background: "linear-gradient(135deg, #fc8703 0%, #f59e0b 100%)" }}
      >
        <style>{`
          @keyframes slideUp {
            0%   { opacity: 0; transform: translateY(40px); }
            100% { opacity: 1; transform: translateY(0); }
          }
          .slide-up {
            opacity: 0;
            animation: slideUp 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards;
          }
          .delay-100 { animation-delay: 0.1s; }
          .delay-200 { animation-delay: 0.2s; }
          .delay-350 { animation-delay: 0.35s; }
          .delay-500 { animation-delay: 0.5s; }
          .delay-650 { animation-delay: 0.65s; }
          .delay-800 { animation-delay: 0.8s; }
        `}</style>

        {/* Abstract circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/10" />
        <div className="absolute -bottom-32 -right-32 w-[30rem] h-[30rem] rounded-full bg-white/10" />
        <div className="absolute top-1/3 left-1/2 w-64 h-64 rounded-full bg-white/5" />

        {/* Logo + tagline */}
        <div className="relative z-10 text-center px-12">
          <img
            src="/logo.png"
            alt="Lakshyadeep Logo"
            className="mx-auto h-20 w-auto mb-6 drop-shadow-lg slide-up delay-100"
          />
          <h1 className="text-4xl font-extrabold text-white leading-tight mb-4 slide-up delay-200">
            Lakshyadeep
          </h1>
          <p className="text-white/80 text-lg leading-relaxed max-w-sm slide-up delay-350">
            Empowering youth for sustainable community development across Nepal.
          </p>

          {/* Stats strip */}
          <div className="mt-10 grid grid-cols-3 gap-6">
            {[
              { value: "10K+", label: "Lives Touched", delay: "delay-500" },
              { value: "50+",  label: "Projects",      delay: "delay-650" },
              { value: "15+",  label: "Years",         delay: "delay-800" },
            ].map(s => (
              <div
                key={s.label}
                className={`bg-white/20 rounded-xl py-3 px-2 slide-up ${s.delay}`}
              >
                <p className="text-2xl font-extrabold text-white">{s.value}</p>
                <p className="text-xs text-white/70 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right panel (form) ── */}
      <div className="flex flex-1 flex-col items-center justify-center bg-gray-50 px-6 py-12">
        <div className="w-full max-w-md">

          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-brand transition-colors mb-8"
          >
            <FiArrowLeft size={15} />
            Back to website
          </Link>

          {/* Heading */}
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-gray-900">Enter Your Admin Credentials</h2>
            {/* <p className="mt-2 text-sm text-gray-500">Welcome back — enter your credentials below.</p>
            <div className="mt-3 h-1 w-12 rounded-full" style={{ backgroundColor: "#fc8703" }} /> */}
          </div>

          {/* Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <form onSubmit={handleSubmit} className="space-y-5">

              {/* Error */}
              {error && (
                <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Email Address
                </label>
                <div className="relative">
                  <FiMail
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email address"
                    className="w-full pl-9 pr-4 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-orange-100 transition"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Password
                </label>
                <div className="relative">
                  <FiLock
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                  />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-9 pr-10 py-3 border border-gray-200 rounded-xl text-sm placeholder-gray-400 outline-none focus:border-brand focus:ring-2 focus:ring-orange-100 transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                  </button>
                </div>
              </div>

              {/* Remember + Forgot */}
              {/* <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    id="remember"
                    name="remember"
                    type="checkbox"
                    checked={formData.remember}
                    onChange={handleInputChange}
                    className="h-4 w-4 rounded border-gray-300 accent-brand"
                  />
                  <span className="text-sm text-gray-600">Remember me</span>
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-brand hover:text-orange-600 transition-colors"
                >
                  Forgot Password?
                </Link>
              </div> */}

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-200 active:scale-[0.98] relative"
                style={{ background: "linear-gradient(135deg, #fc8703, #f59e0b)" }}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-1.5 py-1">
                    <style>{`
                      @keyframes fast-dot-bounce {
                        0%, 80%, 100% { transform: translateY(0); opacity: 0.5; }
                        40% { transform: translateY(-5px); opacity: 1; }
                      }
                      .loading-dot {
                        width: 6px;
                        height: 6px;
                        background-color: white;
                        border-radius: 50%;
                        animation: fast-dot-bounce 0.6s infinite ease-in-out;
                      }
                      .loading-dot:nth-child(2) { animation-delay: 0.1s; }
                      .loading-dot:nth-child(3) { animation-delay: 0.2s; }
                    `}</style>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                  </div>
                ) : (
                  "Login"
                )}
              </button>

            </form>
          </div>

          {/* Footer note */}
          <p className="mt-6 text-center text-xs text-gray-400">
            This portal is restricted to authorised administrators only.
          </p>
        </div>
      </div>
    </div>
  )
}
