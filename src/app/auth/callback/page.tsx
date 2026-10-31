"use client"

import { useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { getSupabaseBrowserClient } from "@/lib/supabase/client"

type EmailOtpType =
  | "recovery"
  | "signup"
  | "invite"
  | "magiclink"
  | "email_change"
  | "email"

function CallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    const handleAuth = async () => {
      const code = searchParams.get("code")
      const next = searchParams.get("next")
      const type = searchParams.get("type")
      const tokenHash = searchParams.get("token_hash")
      const supabase = getSupabaseBrowserClient()

      // If this is a password recovery link landing on callback, forward directly
      // to /auth/reset-password with all token parameters intact
      if (type === "recovery") {
        const params = new URLSearchParams()
        if (tokenHash) params.set("token_hash", tokenHash)
        if (code) params.set("code", code)
        params.set("type", "recovery")
        router.replace(`/auth/reset-password?${params.toString()}`)
        return
      }

      if (code && supabase) {
        try {
          await supabase.auth.exchangeCodeForSession(code)
        } catch {
          // If code exchange fails or was already exchanged, continue
        }
      }

      if (tokenHash && supabase && type) {
        try {
          await supabase.auth.verifyOtp({
            token_hash: tokenHash,
            type: type as EmailOtpType,
          })
        } catch {
          // If verifyOtp fails or was already exchanged, continue
        }
      }

      if (next) {
        router.replace(next)
        return
      }

      // Preserve any query params and redirect to /auth/confirmed
      const queryString = searchParams.toString()
      const target = queryString ? `/auth/confirmed?${queryString}` : "/auth/confirmed"
      router.replace(target)
    }

    handleAuth()
  }, [router, searchParams])

  return (
    <div className="min-h-screen bg-[#f4f8fc] pt-32 pb-24 px-4 flex flex-col justify-center items-center">
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl p-8 border border-slate-100 shadow-xl text-center">
        <div className="w-10 h-10 border-4 border-[#1f6fe5] border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs font-semibold text-slate-500 mt-3">
          Verifying authentication...
        </p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#f4f8fc] pt-32 pb-24 px-4 flex flex-col justify-center items-center">
          <div className="w-10 h-10 border-4 border-[#1f6fe5] border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  )
}
