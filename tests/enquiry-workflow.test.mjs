import test from "node:test"
import assert from "node:assert/strict"

// Mock Supabase & State Logic for Enquiry Workflow
class MockStorage {
  constructor() {
    this.store = new Map()
  }
  getItem(key) {
    return this.store.get(key) || null
  }
  setItem(key, value) {
    this.store.set(key, String(value))
  }
  removeItem(key) {
    this.store.delete(key)
  }
  clear() {
    this.store.clear()
  }
}

class MockSupabaseClient {
  constructor({ user = null, profile = null, insertError = null } = {}) {
    this.currentUser = user
    this.currentProfile = profile
    this.insertError = insertError
    this.insertedNotifications = []
  }

  get auth() {
    return {
      getUser: async () => ({
        data: { user: this.currentUser },
        error: null,
      }),
    }
  }

  from(table) {
    if (table === "profiles") {
      return {
        select: () => ({
          eq: (field, val) => ({
            single: async () => {
              if (this.currentProfile && (!val || this.currentProfile.id === val)) {
                return { data: this.currentProfile, error: null }
              }
              return { data: null, error: new Error("Profile not found") }
            },
          }),
        }),
      }
    }

    if (table === "admin_notifications") {
      return {
        insert: async (payload) => {
          if (this.insertError) {
            return { data: null, error: this.insertError }
          }
          this.insertedNotifications.push(payload)
          return { data: payload, error: null }
        },
      }
    }

    throw new Error(`Unexpected table: ${table}`)
  }
}

// Logic Runner simulating EnquiryPreviewButton behaviors
class EnquiryWorkflowRunner {
  constructor({ supabase, sessionStorage, listingId = "pg-101", listingName = "Green Villa PG", category = "accommodation" }) {
    this.supabase = supabase
    this.sessionStorage = sessionStorage
    this.listingId = listingId
    this.listingName = listingName
    this.category = category

    this.isSubmitting = false
    this.hasSubmitted = false
    this.modalState = "idle"
    this.isOpen = false
    this.errorMsg = ""
    this.contactInfo = ""
    this.redirectUrl = null
  }

  async executeSubmission(user) {
    this.isSubmitting = true
    this.errorMsg = ""

    try {
      let studentName = (user.user_metadata?.full_name || "").trim()
      let studentPhone = (user.user_metadata?.phone || "").trim()
      const studentEmail = (user.email || "").trim().toLowerCase()

      try {
        const { data: profile } = await this.supabase
          .from("profiles")
          .select("full_name, phone")
          .eq("id", user.id)
          .single()

        if (profile) {
          if (profile.full_name && !studentName) studentName = String(profile.full_name).trim()
          if (profile.phone && !studentPhone) studentPhone = String(profile.phone).trim()
        }
      } catch {
        // Silently continue
      }

      const cleanName = studentName
      const cleanPhone = studentPhone
      const cleanEmail = studentEmail
      const isMess = this.category === "mess"

      const contactSnippet =
        [cleanPhone || null, cleanEmail || null].filter(Boolean).join(", ") || "No contact info provided"

      const { error } = await this.supabase.from("admin_notifications").insert({
        notification_type: "enquiry_created",
        user_id: user.id,
        listing_id: this.listingId ?? null,
        title: isMess ? `Mess Enquiry — ${this.listingName}` : `Accommodation Enquiry — ${this.listingName}`,
        message: `${cleanName || "A student"} (${contactSnippet}) expressed interest in "${this.listingName}" (${this.category}).`,
        metadata: {
          student_name: cleanName,
          student_phone: cleanPhone,
          student_email: cleanEmail,
          phone: cleanPhone,
          email: cleanEmail,
          listing_name: this.listingName,
          listing_id: this.listingId ?? null,
          category: this.category,
        },
      })

      if (error) {
        this.errorMsg = error.message || "Failed to submit enquiry. Please try again."
        this.modalState = "error"
        this.isOpen = true
        return false
      }

      this.contactInfo = cleanPhone || cleanEmail || "your registered account"
      this.hasSubmitted = true
      this.modalState = "success"
      this.isOpen = true
      return true
    } finally {
      this.isSubmitting = false
    }
  }

  async handleEnquireClick(currentPath = `/accommodation/${this.listingId}`) {
    if (this.isSubmitting) return false
    if (this.hasSubmitted) {
      this.modalState = "success"
      this.isOpen = true
      return true
    }

    this.isSubmitting = true
    this.errorMsg = ""

    const { data: { user } } = await this.supabase.auth.getUser()

    if (!user) {
      this.sessionStorage.setItem(
        "locano_pending_enquiry",
        JSON.stringify({
          action: "enquire",
          listingId: this.listingId,
          listingName: this.listingName,
          category: this.category,
          returnUrl: currentPath,
          createdAt: Date.now(),
        })
      )
      this.redirectUrl = `/login?next=${encodeURIComponent(currentPath)}&action=enquire&listingId=${encodeURIComponent(this.listingId)}&category=${this.category}`
      this.isSubmitting = false
      return false
    }

    return await this.executeSubmission(user)
  }

  async checkPendingEnquiryOnMount() {
    const stored = this.sessionStorage.getItem("locano_pending_enquiry")
    if (!stored) return false

    const pending = JSON.parse(stored)
    const matchesListing =
      pending?.action === "enquire" &&
      (pending.listingId === this.listingId || !pending.listingId)

    const isFresh =
      typeof pending.createdAt === "number" &&
      Date.now() - pending.createdAt < 30 * 60 * 1000

    if (matchesListing && isFresh) {
      // Immediate removal to prevent duplicate submission
      this.sessionStorage.removeItem("locano_pending_enquiry")

      const { data: { user } } = await this.supabase.auth.getUser()
      if (user) {
        return await this.executeSubmission(user)
      }
    }
    return false
  }
}

test("LOCANO Enquiry Workflow - Authenticated vs Unauthenticated", async (t) => {
  await t.test("1. Authenticated Student: Immediate submission with no enquiry form", async () => {
    const supabase = new MockSupabaseClient({
      user: {
        id: "usr_student_01",
        email: "rahul@example.com",
        user_metadata: { full_name: "Rahul Sharma", phone: "+91 98451 11223" },
      },
      profile: {
        id: "usr_student_01",
        full_name: "Rahul Sharma",
        phone: "+91 98451 11223",
      },
    })
    const sessionStorage = new MockStorage()

    const runner = new EnquiryWorkflowRunner({
      supabase,
      sessionStorage,
      listingId: "pg-ocean-view",
      listingName: "Ocean View PG",
      category: "accommodation",
    })

    const submitted = await runner.handleEnquireClick()

    assert.equal(submitted, true, "Should return true on successful submission")
    assert.equal(runner.modalState, "success", "Modal state should be success")
    assert.equal(runner.isOpen, true, "Success modal should be open")
    assert.equal(runner.hasSubmitted, true, "hasSubmitted flag should be true")
    assert.equal(runner.contactInfo, "+91 98451 11223")

    // Verify admin_notifications insert payload
    assert.equal(supabase.insertedNotifications.length, 1)
    const notif = supabase.insertedNotifications[0]
    assert.equal(notif.notification_type, "enquiry_created")
    assert.equal(notif.user_id, "usr_student_01")
    assert.equal(notif.listing_id, "pg-ocean-view")
    assert.equal(notif.title, "Accommodation Enquiry — Ocean View PG")
    assert.equal(notif.metadata.student_name, "Rahul Sharma")
    assert.equal(notif.metadata.student_phone, "+91 98451 11223")
    assert.equal(notif.metadata.student_email, "rahul@example.com")
    assert.equal(notif.metadata.category, "accommodation")
  })

  await t.test("2. Food & Mess Enquiry: Authenticated submission uses Mess Enquiry title and category", async () => {
    const supabase = new MockSupabaseClient({
      user: {
        id: "usr_student_02",
        email: "ananya@example.com",
      },
      profile: {
        id: "usr_student_02",
        full_name: "Ananya Rao",
        phone: "+91 99887 66554",
      },
    })
    const sessionStorage = new MockStorage()

    const runner = new EnquiryWorkflowRunner({
      supabase,
      sessionStorage,
      listingId: "mess-udupi-delight",
      listingName: "Udupi Delight Mess",
      category: "mess",
    })

    await runner.handleEnquireClick()

    assert.equal(runner.modalState, "success")
    assert.equal(supabase.insertedNotifications.length, 1)
    const notif = supabase.insertedNotifications[0]
    assert.equal(notif.title, "Mess Enquiry — Udupi Delight Mess")
    assert.equal(notif.metadata.category, "mess")
    assert.equal(notif.metadata.listing_name, "Udupi Delight Mess")
    assert.equal(notif.metadata.student_name, "Ananya Rao")
    assert.equal(notif.metadata.phone, "+91 99887 66554")
  })

  await t.test("3. Unauthenticated User: Redirects to /login preserving listing ID and enquiry action", async () => {
    const supabase = new MockSupabaseClient({ user: null })
    const sessionStorage = new MockStorage()

    const runner = new EnquiryWorkflowRunner({
      supabase,
      sessionStorage,
      listingId: "pg-comfort-stay",
      listingName: "Comfort Stay PG",
      category: "accommodation",
    })

    const submitted = await runner.handleEnquireClick("/accommodation/pg-comfort-stay")

    assert.equal(submitted, false, "Should not submit when unauthenticated")
    assert.equal(runner.isOpen, false, "Modal should remain closed")
    assert.equal(supabase.insertedNotifications.length, 0, "No notification should be inserted")

    // Check redirection URL
    assert.ok(runner.redirectUrl.startsWith("/login?next="))
    assert.ok(runner.redirectUrl.includes("action=enquire"))
    assert.ok(runner.redirectUrl.includes("listingId=pg-comfort-stay"))
    assert.ok(runner.redirectUrl.includes("category=accommodation"))

    // Check sessionStorage preserved pending enquiry
    const stored = JSON.parse(sessionStorage.getItem("locano_pending_enquiry"))
    assert.equal(stored.action, "enquire")
    assert.equal(stored.listingId, "pg-comfort-stay")
    assert.equal(stored.listingName, "Comfort Stay PG")
    assert.equal(stored.category, "accommodation")
    assert.equal(stored.returnUrl, "/accommodation/pg-comfort-stay")
  })

  await t.test("4. Post-Authentication Resumption: Automatically submits enquiry on return", async () => {
    const supabase = new MockSupabaseClient({
      user: {
        id: "usr_student_03",
        email: "priya@example.com",
        user_metadata: { full_name: "Priya Hegde", phone: "+91 91234 56789" },
      },
    })
    const sessionStorage = new MockStorage()

    // Simulate stored pending enquiry from previous redirect
    sessionStorage.setItem(
      "locano_pending_enquiry",
      JSON.stringify({
        action: "enquire",
        listingId: "pg-comfort-stay",
        listingName: "Comfort Stay PG",
        category: "accommodation",
        returnUrl: "/accommodation/pg-comfort-stay",
        createdAt: Date.now(),
      })
    )

    const runner = new EnquiryWorkflowRunner({
      supabase,
      sessionStorage,
      listingId: "pg-comfort-stay",
      listingName: "Comfort Stay PG",
      category: "accommodation",
    })

    const resumed = await runner.checkPendingEnquiryOnMount()

    assert.equal(resumed, true, "Should automatically resume and submit enquiry")
    assert.equal(runner.modalState, "success", "Should immediately show success popup")
    assert.equal(runner.isOpen, true, "Success popup should be opened automatically")
    assert.equal(supabase.insertedNotifications.length, 1, "Enquiry notification should be inserted")

    // Critical: sessionStorage item must be cleared immediately to prevent duplicates on reload
    assert.equal(sessionStorage.getItem("locano_pending_enquiry"), null, "Pending enquiry token must be wiped after consumption")

    // Re-running checkPendingEnquiryOnMount must NOT submit again
    const secondCheck = await runner.checkPendingEnquiryOnMount()
    assert.equal(secondCheck, false, "Second mount or refresh must not duplicate submission")
    assert.equal(supabase.insertedNotifications.length, 1, "Notification count must remain exactly 1")
  })

  await t.test("5. Duplicate Prevention: In-flight and post-submission duplicate protection", async () => {
    const supabase = new MockSupabaseClient({
      user: {
        id: "usr_student_04",
        email: "karthik@example.com",
      },
    })
    const sessionStorage = new MockStorage()

    const runner = new EnquiryWorkflowRunner({
      supabase,
      sessionStorage,
      listingId: "pg-silver-oak",
      listingName: "Silver Oak PG",
    })

    // First click
    const firstSubmit = await runner.handleEnquireClick()
    assert.equal(firstSubmit, true)
    assert.equal(supabase.insertedNotifications.length, 1)

    // Second click after successful submission
    const secondSubmit = await runner.handleEnquireClick()
    assert.equal(secondSubmit, true)
    // Notification count should STILL be 1 (no duplicate insertion!)
    assert.equal(supabase.insertedNotifications.length, 1, "Should not insert duplicate notification on re-click")
    assert.equal(runner.modalState, "success")
    assert.equal(runner.isOpen, true)
  })

  await t.test("6. Error Handling: Failed insertion displays error and never displays success", async () => {
    const supabase = new MockSupabaseClient({
      user: {
        id: "usr_student_05",
        email: "test@example.com",
      },
      insertError: new Error("Network connection dropped"),
    })
    const sessionStorage = new MockStorage()

    const runner = new EnquiryWorkflowRunner({
      supabase,
      sessionStorage,
      listingId: "pg-palm-grove",
      listingName: "Palm Grove PG",
    })

    const result = await runner.handleEnquireClick()

    assert.equal(result, false, "Submission should fail")
    assert.equal(runner.modalState, "error", "Modal state must be 'error'")
    assert.notEqual(runner.modalState, "success", "Must never show success when error occurs")
    assert.equal(runner.isOpen, true, "Modal should open to display error")
    assert.equal(runner.errorMsg, "Network connection dropped")
    assert.equal(runner.hasSubmitted, false, "hasSubmitted must remain false on failure")
  })
})

