"use client"

import React, { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { AlertCircle, X, Send, CheckCircle2, Loader2 } from "lucide-react"
import { getSupabaseBrowserClient, isSupabaseConfigured } from "@/lib/supabase/client"

interface EnquiryPreviewButtonProps {
  listingName: string
  listingId?: string
  category?: "accommodation" | "mess"
  buttonText?: string
}

type ModalState = "idle" | "submitting" | "success" | "error"

export function EnquiryPreviewButton({
  listingName,
  listingId,
  category = "accommodation",
  buttonText,
}: EnquiryPreviewButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [modalState, setModalState] = useState<ModalState>("idle")
  const [errorMsg, setErrorMsg] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasSubmitted, setHasSubmitted] = useState(false)
  const [contactInfo, setContactInfo] = useState("")

  const router = useRouter()
  const resumeAttemptedRef = useRef(false)
  const isMess = category === "mess"
  const defaultButtonLabel = isMess ? "Register Interest" : "I'm Interested"

  // Core submission executor using authenticated user's account details
  const executeSubmission = useCallback(
    async (user: {
      id: string
      email?: string | null
      user_metadata?: Record<string, unknown>
    }) => {
    setIsSubmitting(true)
    setErrorMsg("")

    try {
      if (!isSupabaseConfigured()) {
        await new Promise((r) => setTimeout(r, 600))
        setContactInfo(user.email || "your registered contact")
        setHasSubmitted(true)
        setModalState("success")
        setIsOpen(true)
        return
      }

      const supabase = getSupabaseBrowserClient()
      if (!supabase) {
        setContactInfo(user.email || "your registered contact")
        setHasSubmitted(true)
        setModalState("success")
        setIsOpen(true)
        return
      }

      let studentName = ((user.user_metadata?.full_name as string) || "").trim()
      let studentPhone = ((user.user_metadata?.phone as string) || "").trim()
      const studentEmail = (user.email || "").trim().toLowerCase()

      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single()

        if (profile) {
          if (profile.full_name && !studentName) studentName = String(profile.full_name).trim()
          if (profile.phone && !studentPhone) studentPhone = String(profile.phone).trim()
        }
      } catch {
        // Silently continue with metadata if profile lookup fails
      }

      const cleanName = studentName
      const cleanPhone = studentPhone
      const cleanEmail = studentEmail

      const contactSnippet =
        [cleanPhone || null, cleanEmail || null].filter(Boolean).join(", ") || "No contact info provided"

      const { error } = await supabase.from("admin_notifications").insert({
        notification_type: "enquiry_created",
        user_id: user.id,
        listing_id: listingId ?? null,
        title: isMess ? `Mess Enquiry — ${listingName}` : `Accommodation Enquiry — ${listingName}`,
        message: `${cleanName || "A student"} (${contactSnippet}) expressed interest in "${listingName}" (${category}).`,
        metadata: {
          student_name: cleanName,
          student_phone: cleanPhone,
          student_email: cleanEmail,
          phone: cleanPhone,
          email: cleanEmail,
          listing_name: listingName,
          listing_id: listingId ?? null,
          category,
        },
      })

      if (error) {
        console.error("Enquiry notification error:", error.message)
        setErrorMsg(error.message || "Something went wrong. Please try again.")
        setModalState("error")
        setIsOpen(true)
        return
      }

      setContactInfo(cleanPhone || cleanEmail || "your registered account")
      setHasSubmitted(true)
      setModalState("success")
      setIsOpen(true)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
      console.error("Enquiry submission unexpected error:", err)
      setErrorMsg(message)
      setModalState("error")
      setIsOpen(true)
    } finally {
      setIsSubmitting(false)
    }
  }, [category, isMess, listingId, listingName])

  // Automatic resumption on mount if returning from login with a pending enquiry
  useEffect(() => {
    if (typeof window === "undefined" || resumeAttemptedRef.current) return

    const checkPendingEnquiry = async () => {
      let stored: string | null = null
      try {
        stored = sessionStorage.getItem("locano_pending_enquiry")
      } catch {
        return
      }

      if (!stored) return

      try {
        const pending = JSON.parse(stored)
        const matchesListing =
          pending?.action === "enquire" &&
          (pending.listingId === (listingId ?? "") || !pending.listingId)

        // Expire after 30 minutes
        const isFresh =
          typeof pending.createdAt === "number" &&
          Date.now() - pending.createdAt < 30 * 60 * 1000

        if (matchesListing && isFresh) {
          // Immediately mark attempted and remove from sessionStorage to prevent duplicate submission
          resumeAttemptedRef.current = true
          sessionStorage.removeItem("locano_pending_enquiry")

          if (!isSupabaseConfigured()) return

          const supabase = getSupabaseBrowserClient()
          if (!supabase) return

          const {
            data: { user },
          } = await supabase.auth.getUser()

          if (user) {
            // User is authenticated! Automatically submit the enquiry
            await executeSubmission(user)
          }
        }
      } catch (err) {
        console.error("Error resuming pending enquiry:", err)
        try {
          sessionStorage.removeItem("locano_pending_enquiry")
        } catch {
          // Ignore
        }
      }
    }

    checkPendingEnquiry()
  }, [executeSubmission, listingId])

  // Handle user clicking "Enquire" / "I'm Interested" / "Register Interest"
  const handleEnquireClick = async () => {
    // Prevent accidental duplicate submission
    if (isSubmitting) return

    // If already submitted in this session, re-show confirmation
    if (hasSubmitted) {
      setModalState("success")
      setIsOpen(true)
      return
    }

    setIsSubmitting(true)
    setErrorMsg("")

    // Demo/offline mode without Supabase
    if (!isSupabaseConfigured()) {
      await new Promise((r) => setTimeout(r, 500))
      setContactInfo("demo@locano.in")
      setHasSubmitted(true)
      setModalState("success")
      setIsOpen(true)
      setIsSubmitting(false)
      return
    }

    const supabase = getSupabaseBrowserClient()
    if (!supabase) {
      setContactInfo("your registered contact")
      setHasSubmitted(true)
      setModalState("success")
      setIsOpen(true)
      setIsSubmitting(false)
      return
    }

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        // User is not authenticated -> redirect to sign in page
        // Preserve original listing ID, listing type, return URL, and action
        if (typeof window !== "undefined") {
          const returnUrl = window.location.pathname + window.location.search
          try {
            sessionStorage.setItem(
              "locano_pending_enquiry",
              JSON.stringify({
                action: "enquire",
                listingId: listingId ?? "",
                listingName,
                category,
                returnUrl,
                createdAt: Date.now(),
              })
            )
          } catch (e) {
            console.error("Failed to save pending enquiry to sessionStorage", e)
          }

          const loginUrl = `/login?next=${encodeURIComponent(returnUrl)}&action=enquire&listingId=${encodeURIComponent(listingId || "")}&category=${category}`
          router.push(loginUrl)
        }
        return
      }

      // User is authenticated -> submit directly
      await executeSubmission(user)
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong. Please try again."
      console.error("Error during enquiry auth check:", err)
      setErrorMsg(message)
      setModalState("error")
      setIsOpen(true)
      setIsSubmitting(false)
    }
  }

  function handleClose() {
    setIsOpen(false)
    setTimeout(() => {
      if (modalState === "error") {
        setModalState("idle")
        setErrorMsg("")
      }
    }, 300)
  }

  return (
    <>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={handleEnquireClick}
        className="w-full py-3.5 px-6 rounded-full bg-[#1f6fe5] hover:bg-blue-600 text-white font-bold text-sm transition-all shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 group cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Submitting Enquiry…</span>
          </>
        ) : (
          <>
            <Send className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            <span>{buttonText || defaultButtonLabel}</span>
          </>
        )}
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div
            className="relative w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 shadow-2xl border border-slate-100 locano-card"
            onClick={(e) => e.stopPropagation()}
          >
            {modalState !== "submitting" && (
              <button
                onClick={handleClose}
                className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            {/* SUCCESS STATE */}
            {modalState === "success" && (
              <div className="text-center py-4 space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                    <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#10233f]">Enquiry Sent!</h3>
                  <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                    We&apos;ve registered your interest for{" "}
                    <span className="font-semibold text-slate-700">{listingName}</span>.
                    {contactInfo ? (
                      <>
                        {" "}The team will contact you at{" "}
                        <span className="font-semibold text-slate-700">{contactInfo}</span> shortly.
                      </>
                    ) : (
                      <> The team will contact you shortly.</>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-full bg-[#10233f] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            )}

            {/* ERROR STATE */}
            {modalState === "error" && (
              <div className="text-center py-4 space-y-4">
                <div className="flex justify-center">
                  <div className="w-14 h-14 rounded-full bg-red-50 border border-red-200 flex items-center justify-center">
                    <AlertCircle className="w-7 h-7 text-red-600" />
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-[#10233f]">Submission Failed</h3>
                  <p className="text-sm text-red-600 mt-2 leading-relaxed">
                    {errorMsg || "Something went wrong. Please try again."}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleClose}
                  className="w-full py-2.5 rounded-full bg-[#10233f] text-white text-xs font-semibold hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
