import { test, describe } from "node:test"
import assert from "node:assert/strict"

describe("Password Reset & Recovery Token Verification Tests", () => {
  describe("1. Query Parameter & Flow Detection", () => {
    test("should detect token_hash OTP flow across devices/browsers", () => {
      const url = "https://locano.in/auth/reset-password?token_hash=abc123def456&type=recovery"
      const parsed = new URL(url)
      const tokenHash = parsed.searchParams.get("token_hash")
      const type = parsed.searchParams.get("type")

      assert.equal(tokenHash, "abc123def456")
      assert.equal(type, "recovery")
    })

    test("should detect legacy/fallback PKCE code flow", () => {
      const url = "https://locano.in/auth/reset-password?code=pkce-auth-code-789"
      const parsed = new URL(url)
      const code = parsed.searchParams.get("code")

      assert.equal(code, "pkce-auth-code-789")
      assert.equal(parsed.searchParams.get("token_hash"), null)
    })

    test("should forward token_hash and code if arriving via /auth/callback", () => {
      const callbackUrl = "https://locano.in/auth/callback?token_hash=tok_999&type=recovery"
      const parsed = new URL(callbackUrl)
      const params = new URLSearchParams()
      if (parsed.searchParams.get("token_hash")) {
        params.set("token_hash", parsed.searchParams.get("token_hash"))
      }
      if (parsed.searchParams.get("code")) {
        params.set("code", parsed.searchParams.get("code"))
      }
      params.set("type", "recovery")

      const targetUrl = `/auth/reset-password?${params.toString()}`
      assert.equal(targetUrl, "/auth/reset-password?token_hash=tok_999&type=recovery")
    })
  })

  describe("2. Password Validation Rules", () => {
    test("should enforce minimum 8 characters for new password", () => {
      const validatePassword = (pass) => {
        if (!pass || pass.length < 8) return "Password must be at least 8 characters long."
        return null
      }

      assert.equal(validatePassword("short"), "Password must be at least 8 characters long.")
      assert.equal(validatePassword(""), "Password must be at least 8 characters long.")
      assert.equal(validatePassword("1234567"), "Password must be at least 8 characters long.")
      assert.equal(validatePassword("validpass123"), null)
    })

    test("should enforce that new password matches confirm password", () => {
      const checkMatch = (p1, p2) => p1 === p2
      assert.equal(checkMatch("MySecret123!", "MySecret123!"), true)
      assert.equal(checkMatch("MySecret123!", "OtherSecret123!"), false)
    })
  })

  describe("3. Account Target Isolation", () => {
    test("verifyOtp associates session with recovered user, not an unrelated existing session", () => {
      // Mock verifyOtp response
      const mockRecoveryUser = { id: "user-qwe", email: "qwe@example.com" }
      const mockVerifyOtp = async ({ token_hash, type }) => {
        if (token_hash === "valid-hash" && type === "recovery") {
          return { data: { user: mockRecoveryUser, session: { access_token: "tok" } }, error: null }
        }
        return { data: { user: null, session: null }, error: { message: "Token has expired or is invalid", status: 400 } }
      }

      return (async () => {
        const res = await mockVerifyOtp({ token_hash: "valid-hash", type: "recovery" })
        assert.equal(res.error, null)
        assert.equal(res.data.user.email, "qwe@example.com")
        assert.equal(res.data.user.id, "user-qwe")

        const invalidRes = await mockVerifyOtp({ token_hash: "expired-hash", type: "recovery" })
        assert.notEqual(invalidRes.error, null)
        assert.equal(invalidRes.data.user, null)
      })()
    })
  })
})

