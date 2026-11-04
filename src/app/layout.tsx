import type { Metadata } from "next"
import { Outfit, Fraunces } from "next/font/google"
import Script from "next/script"
import "./globals.css"
import { ModalProvider } from "@/context/ModalContext"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { SearchModal } from "@/components/SearchModal"
import { AccountModal } from "@/components/AccountModal"
import { WhatsAppBubble } from "@/components/WhatsAppBubble"
import { OrganizationJsonLd, WebsiteJsonLd } from "@/components/JsonLd"

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
})

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL("https://locano.in"),
  title: {
    default: "LOCANO – Settling Made Simple | PG, Mess & Transport in Mangaluru",
    template: "%s · LOCANO",
  },
  description:
    "Find PG accommodations, student mess & food services, bus routes and transport in Mangaluru. LOCANO makes settling in a new city simple for students.",
  keywords: [
    "Mangaluru PG",
    "Mangalore PG",
    "student accommodation Mangaluru",
    "mess food Mangaluru",
    "bus routes Mangalore",
    "paying guest Mangalore",
    "student mess near me",
    "PG near Sahyadri College",
    "PG near Yenepoya",
    "LOCANO",
  ],
  authors: [{ name: "LOCANO", url: "https://locano.in" }],
  creator: "LOCANO",
  publisher: "LOCANO",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://locano.in",
    siteName: "LOCANO",
    title: "LOCANO – Settling Made Simple | PG, Mess & Transport in Mangaluru",
    description:
      "Find PG accommodations, student mess & food services, bus routes and transport in Mangaluru. LOCANO makes settling in a new city simple.",
    images: [
      {
        url: "/locano-logo.png",
        width: 512,
        height: 512,
        alt: "LOCANO Logo",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "LOCANO – Settling Made Simple",
    description:
      "PG, Mess & Transport in Mangaluru — everything a student needs to settle in.",
    images: ["/locano-logo.png"],
  },
  alternates: {
    canonical: "https://locano.in",
  },
  category: "Education",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${outfit.variable} ${fraunces.variable}`}>
      <body className="min-h-screen flex flex-col bg-white text-[#10233f] font-sans antialiased">
        {/* Google Analytics 4 — G-WR6VYTKB4N */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WR6VYTKB4N"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-WR6VYTKB4N');
          `}
        </Script>
        <OrganizationJsonLd />
        <WebsiteJsonLd />
        <ModalProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <SearchModal />
          <AccountModal />
          <WhatsAppBubble />
        </ModalProvider>
      </body>
    </html>
  )
}
