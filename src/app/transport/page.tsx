import type { Metadata } from "next"
import { RoutesSection } from "@/components/RoutesSection"

export const metadata: Metadata = {
  title: "Bus Routes",
  description: "Complete directory of Mangaluru city bus routes, numbers, and key stops.",
}

export default function TransportPage() {
  return (
    <div className="pt-8">
      <RoutesSection isFullPage={true} />
    </div>
  )
}
