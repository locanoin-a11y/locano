import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "PG & Accommodation in Mangaluru",
  description:
    "Browse verified PG accommodations, hostels and paying guest rooms for students in Mangaluru. Filter by area, gender, budget and amenities.",
  openGraph: {
    title: "PG & Accommodation in Mangaluru · LOCANO",
    description:
      "Browse verified PG accommodations, hostels and paying guest rooms for students in Mangaluru.",
    url: "https://locano.in/accommodation",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PG & Accommodation in Mangaluru · LOCANO",
    description:
      "Browse verified PG accommodations in Mangaluru — filter by area, gender, budget.",
  },
  alternates: {
    canonical: "https://locano.in/accommodation",
  },
}

export default function AccommodationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
