"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ChevronRight, AlertCircle } from "lucide-react"

export default function LoginPage() {
  const [step, setStep] = useState<"phone" | "otp">("phone")
  const [phoneNumber, setPhoneNumber] = useState("")
  const [rememberMe, setRememberMe] = useState(false)
  const [otp, setOtp] = useState(["", "", "", "", ""])
  const [timeLeft, setTimeLeft] = useState(58)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (step !== "otp") return

    if (timeLeft <= 0) return

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [step, timeLeft])

  const handleContinuePhone = () => {
    if (phoneNumber.trim()) {
      setStep("otp")
      setTimeLeft(58)
      setError(null)
    }
  }

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) return

    const newOtp = [...otp]
    newOtp[index] = value

    setOtp(newOtp)

    if (error) setError(null)

    if (value && index < 4) {
      const nextInput = document.getElementById(`otp-${index + 1}`)
      nextInput?.focus()
    }
  }

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`)
      prevInput?.focus()
    }
  }

  const handleContinueOtp = () => {
    const otpCode = otp.join("")
    if (otpCode.length === 5) {
      if (otpCode !== "123456") {
        setError("رمز OTP غير صحيح. يرجى المحاولة مرة أخرى")
      } else {
        console.log("OTP verified:", otpCode)
        setError(null)
      }
    }
  }

  const handleResendOtp = () => {
    setTimeLeft(58)
    setOtp(["", "", "", "", ""])
    setError(null)
  }

  const handleBack = () => {
    if (step === "otp") {
      setStep("phone")
      setOtp(["", "", "", "", ""])
      setError(null)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header with back button */}
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded">
          <ChevronRight className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col justify-start px-6 py-8 max-w-md mx-auto w-full">
        {step === "phone" ? (
          <>
            {/* Phone Login Step */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-3 leading-tight">
                سجل الدخول برقم عماتل
                <br />
                الخاص بك
              </h1>
              <p className="text-gray-600 text-sm">أدخل رقما صحيحا تسجيل الدخول</p>
            </div>

            {/* Form */}
            <div className="space-y-6">
              {/* Phone number label */}
              <div>
                <label className="block text-gray-600 text-sm mb-2">رقم الهاتف</label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder=""
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent"
                />
              </div>

              {/* Forgot password and remember me */}
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="remember"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-5 h-5 border border-gray-300 rounded cursor-pointer"
                  />
                  <label htmlFor="remember" className="mr-2 text-gray-700 text-sm cursor-pointer">
                    تذكرني
                  </label>
                </div>
                <a href="#" className="text-orange-500 text-sm font-medium hover:text-orange-600">
                  نسيت كلمة المرور؟
                </a>
              </div>

              {/* Large empty space for spacing */}
              <div className="h-32"></div>

              {/* Continue button */}
              <button
                onClick={handleContinuePhone}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-3 px-4 rounded-lg transition-colors"
              >
                استمرار
              </button>
            </div>
          </>
        ) : (
          <>
            {/* OTP Verification Step */}
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">أدخل الـ OTP</h1>
              <p className="text-gray-600 text-sm mb-2">رمز مرور لمرة واحدة</p>
              <p className="text-gray-500 text-xs">أرسلنا إليك رمز OTP عبر الهاتف</p>
            </div>

            {/* OTP Input Fields */}
            <div className="space-y-8">
              <div className="flex justify-center gap-3">
                {otp.map((value, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={value}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className={`w-12 h-14 text-center text-2xl font-semibold border-b-2 focus:outline-none bg-transparent transition-colors ${
                      error ? "border-red-500 focus:border-red-500" : "border-gray-300 focus:border-orange-400"
                    }`}
                  />
                ))}
              </div>

              {error && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              {/* Resend OTP timer */}
              <div className="flex justify-end">
                {timeLeft > 0 ? (
                  <p className="text-gray-500 text-sm">
                    إعادة إرسال OTP بعد {String(timeLeft).padStart(2, "0")}:{String(timeLeft % 60).padStart(2, "0")}
                  </p>
                ) : (
                  <button
                    onClick={handleResendOtp}
                    className="text-orange-500 text-sm font-medium hover:text-orange-600"
                  >
                    إعادة إرسال OTP
                  </button>
                )}
              </div>

              {/* Large empty space for spacing */}
              <div className="h-20"></div>

              {/* Continue button */}
              <button
                onClick={handleContinueOtp}
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-600 font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50"
                disabled={otp.some((digit) => !digit)}
              >
                استمرار
              </button>
            </div>
          </>
        )}
      </div>

      {/* Bottom divider */}
      <div className="border-t border-gray-200"></div>
    </div>
  )
}
