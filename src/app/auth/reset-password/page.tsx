"use client"

import React, { useState, useEffect, useRef, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import {
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
  LogIn,
  Mail,
} from "lucide-react"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"
import { updateUserPassword } from "@/lib/supabase/auth"

type EmailOtpType =
  | "recovery"
  | "signup"
  | "invite"
  | "magiclink"
  | "email_change"
  | "email"

function ResetPasswordContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [isCheckingLink, setIsCheckingLink] = useState(true)
  const [hasValidSession, setHasValidSession] = useState(false)
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [authError, setAuthError] = useState<string | null>(null)

  // Form states
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [isSuccess, setIsSuccess] = useState(false)
  const [countdown, setCountdown] = useState<number | null>(null)

  // Prevent duplicate token verification on re-renders or React Strict Mode
  const verificationRanRef = useRef(false)

  useEffect(() => {
    let isMounted = true

    const verifyRecoverySession = async () => {
      // 1. Check for error parameters in URL (e.g. Supabase redirect errors)
      const errorParam =
        searchParams.get("error_description") || searchParams.get("error")
      if (errorParam) {
        if (isMounted) {
          const isExpired =
            errorParam.toLowerCase().includes("expired") ||
            errorParam.toLowerCase().includes("invalid") ||
            errorParam.toLowerCase().includes("access_denied")
          setAuthError(
            isExpired
              ? "This password reset link has expired or has already been used. Please request a new one."
              : errorParam
          )
          setIsCheckingLink(false)
        }
        return
      }

      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        if (isMounted) {
          setAuthError("Database connection is currently unavailable.")
          setIsCheckingLink(false)
        }
        return
      }

      // Avoid verifying the single-use token multiple times
      if (verificationRanRef.current) return
      verificationRanRef.current = true

      const tokenHash = searchParams.get("token_hash")
      const typeParam = searchParams.get("type") as EmailOtpType | null
      const code = searchParams.get("code")

      // -----------------------------------------------------------------------
      // 2. Primary Method: Supabase Token Hash OTP Verification
      // Works across any device, browser, or email client (Gmail in-app webview)
      // -----------------------------------------------------------------------
      if (tokenHash) {
        try {
          const otpType: EmailOtpType = typeParam || "recovery"
          const { data, error } = await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: otpType,
          })

          if (error) {
            if (isMounted) {
              const msg = error.message.toLowerCase()
              const isExpired =
                msg.includes("expired") ||
                msg.includes("invalid") ||
                error.status === 400 ||
                error.status === 401
              setAuthError(
                isExpired
                  ? "This password reset link has expired or has already been used. Please request a new one."
                  : error.message
              )
              setHasValidSession(false)
              setIsCheckingLink(false)
            }
            return
          }

          const verifiedUser = data?.user || data?.session?.user
          if (verifiedUser && isMounted) {
            setHasValidSession(true)
            setUserEmail(verifiedUser.email || null)
            setAuthError(null)
            setIsCheckingLink(false)
            return
          }

          // Fallback: verify active user session if data.user was nested
          const { data: activeUserData } = await supabase.auth.getUser()
          if (activeUserData?.user && isMounted) {
            setHasValidSession(true)
            setUserEmail(activeUserData.user.email || null)
            setAuthError(null)
            setIsCheckingLink(false)
            return
          }
        } catch (err: unknown) {
          if (isMounted) {
            const msg =
              err instanceof Error
                ? err.message
                : "Failed to verify password reset token."
            setAuthError(msg)
            setHasValidSession(false)
            setIsCheckingLink(false)
          }
          return
        }
      }

      // -----------------------------------------------------------------------
      // 3. Fallback Method: PKCE Code Exchange
      // Supported if the link was generated with default PKCE flow (?code=...)
      // -----------------------------------------------------------------------
      if (code) {
        try {
          const { data, error } = await supabase.auth.exchangeCodeForSession(code)
          if (error) {
            if (isMounted) {
              setAuthError(
                "This password reset link could not be verified in this browser. If you opened this link on a different device or in an email app, please request a new link or open it in the original browser."
              )
              setHasValidSession(false)
              setIsCheckingLink(false)
            }
            return
          }

          const codeUser = data?.user || data?.session?.user
          if (codeUser && isMounted) {
            setHasValidSession(true)
            setUserEmail(codeUser.email || null)
            setAuthError(null)
            setIsCheckingLink(false)
            return
          }

          const { data: activeCodeUserData } = await supabase.auth.getUser()
          if (activeCodeUserData?.user && isMounted) {
            setHasValidSession(true)
            setUserEmail(activeCodeUserData.user.email || null)
            setAuthError(null)
            setIsCheckingLink(false)
            return
          }
        } catch (err: unknown) {
          if (isMounted) {
            const msg =
              err instanceof Error
                ? err.message
                : "Failed to verify recovery code."
            setAuthError(msg)
            setHasValidSession(false)
            setIsCheckingLink(false)
          }
          return
        }
      }

      // -----------------------------------------------------------------------
      // 4. Hash Fragment Fallback (#access_token=...&type=recovery)
      // -----------------------------------------------------------------------
      if (
        typeof window !== "undefined" &&
        window.location.hash &&
        window.location.hash.includes("type=recovery")
      ) {
        // Supabase client automatically processes the hash fragment and fires onAuthStateChange
        const hashTimer = setTimeout(() => {
          if (isMounted && !hasValidSession) {
            setAuthError(
              "This password reset link has expired or is invalid. Please request a new one."
            )
            setIsCheckingLink(false)
          }
        }, 3000)

        return () => clearTimeout(hashTimer)
      }

      // -----------------------------------------------------------------------
      // 5. No valid recovery parameters found in URL
      // -----------------------------------------------------------------------
      if (isMounted) {
        setAuthError(
          "No password reset token was detected in this link. Please request a new password reset from the sign-in page."
        )
        setHasValidSession(false)
        setIsCheckingLink(false)
      }
    }

    verifyRecoverySession()

    // -------------------------------------------------------------------------
    // 6. Listen for PASSWORD_RECOVERY auth state changes
    // Only accepts authoritative recovery events to prevent misattributing sessions
    // -------------------------------------------------------------------------
    const supabase = getSupabaseBrowserClient()
    const { data: authListener } = supabase?.auth.onAuthStateChange(
      (event, session) => {
        if (event === "PASSWORD_RECOVERY") {
          if (isMounted) {
            setHasValidSession(true)
            if (session?.user?.email) setUserEmail(session.user.email)
            setAuthError(null)
            setIsCheckingLink(false)
          }
        }
      }
    ) ?? { data: { subscription: { unsubscribe: () => {} } } }

    return () => {
      isMounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [searchParams, hasValidSession])

  // Handle countdown redirect after success
  useEffect(() => {
    if (countdown === null) return
    if (countdown <= 0) {
      router.push("/login")
      return
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => (prev !== null ? prev - 1 : null))
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setFormError("")

    if (newPassword.length < 8) {
      setFormError("Password must be at least 8 characters long.")
      return
    }

    if (newPassword !== confirmPassword) {
      setFormError("Passwords do not match.")
      return
    }

    setIsSubmitting(true)

    try {
      const res = await updateUserPassword(newPassword)
      if (res.success) {
        setIsSuccess(true)
        setCountdown(3)
      } else {
        setFormError(res.message)
      }
    } catch (err: unknown) {
      const msg =
        err instanceof Error ? err.message : "Failed to update password."
      setFormError(msg)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#f4f8fc] pt-32 pb-24 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center">
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-2xl locano-card">
        {/* BRAND BADGE */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-[#1f6fe5] mb-2.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>LOCANO SECURITY</span>
          </div>
          <h1 className="text-2xl font-bold text-[#10233f]">
            {isSuccess ? "Password Updated" : "Set New Password"}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            {isSuccess
              ? "Your account password has been successfully reset."
              : "Choose a new strong password for your LOCANO account."}
          </p>
          {userEmail && (
            <div className="mt-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50/80 border border-blue-100 text-[#1f6fe5] text-xs font-semibold">
                <Mail className="w-3 h-3" />
                <span>{userEmail}</span>
              </span>
            </div>
          )}
        </div>

        {/* LOADING STATE */}
        {isCheckingLink && (
          <div className="py-8 space-y-3 text-center">
            <div className="w-10 h-10 border-4 border-[#1f6fe5] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-xs font-semibold text-slate-500">
              Verifying your password reset link...
            </p>
          </div>
        )}

        {/* ERROR / EXPIRED LINK STATE */}
        {!isCheckingLink && (authError || !hasValidSession) && !isSuccess && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto ring-8 ring-amber-50/50">
              <AlertCircle className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h2 className="text-lg font-bold text-[#10233f]">
                Reset Link Expired or Invalid
              </h2>
              <p className="text-xs text-slate-500 leading-relaxed max-w-xs mx-auto">
                {authError ||
                  "This password reset link has expired or has already been used. Please request a new one from the sign-in page."}
              </p>
            </div>

            <div className="pt-2">
              <Link
                href="/login"
                className="w-full py-3 rounded-full bg-[#10233f] text-white text-xs sm:text-sm font-bold hover:bg-[#1f6fe5] transition-colors shadow-sm inline-flex items-center justify-center gap-2"
              >
                <LogIn className="w-4 h-4" />
                <span>Return to Sign In</span>
              </Link>
            </div>
          </div>
        )}

        {/* SUCCESS STATE */}
        {isSuccess && (
          <div className="space-y-4 text-center">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto ring-8 ring-emerald-50/50">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs text-left space-y-1">
              <p className="font-bold">Password Reset Complete</p>
              <p className="text-emerald-800 leading-relaxed text-[11px]">
                Your password has been successfully updated.
                {countdown !== null && (
                  <span className="block mt-1 font-semibold text-emerald-900">
                    Redirecting to sign in in {countdown}s...
                  </span>
                )}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="w-full py-3 rounded-full bg-[#1f6fe5] text-white font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>Sign In with New Password</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* RESET PASSWORD FORM */}
        {!isCheckingLink && hasValidSession && !isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {formError && (
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 flex items-center gap-2 text-xs text-red-600">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            {/* New Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                New Password <span className="text-slate-400 font-normal">(min. 8 characters)</span>
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1f6fe5]"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Confirm New Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 rounded-2xl border border-slate-200 text-xs sm:text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#1f6fe5]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full mt-2 py-3 rounded-full bg-[#1f6fe5] text-white font-bold text-xs sm:text-sm hover:bg-blue-600 transition-colors shadow-md shadow-blue-500/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <span>Updating Password...</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Update Password</span>
                </>
              )}
            </button>

            {/* Cancel / Back Link */}
            <div className="text-center pt-2">
              <Link
                href="/login"
                className="text-xs text-slate-500 hover:text-[#1f6fe5] font-medium transition-colors"
              >
                Back to Sign In
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f8fc] pt-32 pb-24 px-4 flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-[#1f6fe5] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  )
}
