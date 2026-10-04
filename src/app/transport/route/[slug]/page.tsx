import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { parseRouteSlug } from "@/lib/bus-service"
import { resultCards } from "@/lib/search-results"
import { RouteResultsClient } from "@/components/RouteResultsClient"
import { ArrowLeft } from "lucide-react"

interface RoutePageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({ params }: RoutePageProps): Promise<Metadata> {
  const { slug } = await params
  const parsed = parseRouteSlug(slug)
  if (!parsed) return { title: "Bus Route Search" }
  return {
    title: `${parsed.from.name} to ${parsed.to.name} Bus Routes`,
    description: `Direct city buses, alternative connections, fares and travel times from ${parsed.from.name} to ${parsed.to.name} in Mangaluru.`,
  }
}

export default async function RouteResultsPage({ params }: RoutePageProps) {
  const { slug } = await params
  const parsed = parseRouteSlug(slug)

  if (!parsed) {
    notFound()
  }

  const { from, to } = parsed
  const cards = resultCards(from.id, to.id)

  return (
    <div className="min-h-screen bg-[#f4f8fc] pt-28 pb-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        {/* BACK TO ROUTES */}
        <div className="mb-6">
          <Link
            href="/transport"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#1f6fe5] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Bus Routes</span>
          </Link>
        </div>

        <RouteResultsClient from={from} to={to} initialCards={cards} />
      </div>
    </div>
  )
}
