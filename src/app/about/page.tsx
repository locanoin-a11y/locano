import type { Metadata } from "next"
import { AboutSection } from "@/components/AboutSection"

export const metadata: Metadata = {
  title: "About",
  description: "Learn about LOCANO — settling made simple for students in Mangaluru.",
}

export default function AboutPage() {
  return (
    <div className="pt-16">
      <AboutSection />
    </div>
  )
}
