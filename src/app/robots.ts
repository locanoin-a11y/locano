import type { MetadataRoute } from "next"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/admin/",
          "/api/",
          "/auth/",
          "/login",
          "/signup",
          "/pg-owner/",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/login", "/signup", "/pg-owner/"],
      },
      {
        userAgent: "Bingbot",
        allow: "/",
        disallow: ["/admin/", "/api/", "/auth/", "/login", "/signup", "/pg-owner/"],
      },
    ],
    sitemap: "https://locano.in/sitemap.xml",
    host: "https://locano.in",
  }
}
