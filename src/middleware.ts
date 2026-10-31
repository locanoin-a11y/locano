import { NextRequest, NextResponse } from "next/server"
import { createServerClient } from "@supabase/ssr"

/**
 * locano-web middleware — runs on the Edge before every request.
 *
 * Responsibilities:
 *  1. Refresh Supabase session cookies on every request (keeps the
 *     JWT alive and consistent between Server Components and API routes).
 *  2. Protect /admin/* — only users with role = "admin" may access it;
 *     everyone else is redirected to /login.
 *  3. All other routes are public (accommodation, transport, mess, etc.)
 *     and pass through freely.
 */
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    // Supabase not configured — block admin, allow everything else.
    if (req.nextUrl.pathname.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/login", req.url))
    }
    return res
  }

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll()
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          res.cookies.set(name, value, options)
        })
      },
    },
  })

  // Refresh session — must call getUser() not getSession() so the
  // server validates the JWT signature rather than trusting the cookie.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // Protect /admin — only verified admins may enter.
  if (req.nextUrl.pathname.startsWith("/admin")) {
    if (!user) {
      return NextResponse.redirect(new URL("/login", req.url))
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single()

    if (profile?.role !== "admin") {
      await supabase.auth.signOut()
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all paths except Next.js internals and static assets.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}

