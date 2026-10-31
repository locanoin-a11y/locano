import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "LOCANO – Settling Made Simple",
    short_name: "LOCANO",
    description:
      "Find PG accommodations, student mess & food services, bus routes and transport in Mangaluru.",
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#10233f",
    icons: [
      {
        src: "/locano-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  }
}

