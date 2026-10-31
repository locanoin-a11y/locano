import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Student Mess & Food Services in Mangaluru",
  description:
    "Find affordable student mess and food services in Mangaluru. Compare meal plans, pricing, timings and dietary options near your college.",
  openGraph: {
    title: "Student Mess & Food Services in Mangaluru · LOCANO",
    description:
      "Find affordable student mess and food services in Mangaluru. Compare meal plans and pricing.",
    url: "https://locano.in/mess",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Student Mess & Food Services in Mangaluru · LOCANO",
    description:
      "Compare student mess meal plans, pricing and timings in Mangaluru.",
  },
  alternates: {
    canonical: "https://locano.in/mess",
  },
}

export default function MessLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}

