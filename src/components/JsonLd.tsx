/**
 * JSON-LD structured data for LOCANO pages.
 * Renders invisible <script type="application/ld+json"> in the <head>
 * to help search engines understand page content.
 */

export function OrganizationJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "LOCANO",
    url: "https://locano.in",
    logo: "https://locano.in/locano-logo.png",
    description:
      "LOCANO helps students find PG accommodations, mess food services, and bus transport in Mangaluru.",
    sameAs: [],
    areaServed: {
      "@type": "City",
      name: "Mangaluru",
      alternateName: "Mangalore",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function WebsiteJsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "LOCANO",
    url: "https://locano.in",
    description:
      "Find PG accommodations, student mess & food services, bus routes and transport in Mangaluru.",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://locano.in/accommodation?search={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}

export function LocalBusinessJsonLd({
  name,
  description,
  address,
  area,
  image,
  url,
}: {
  name: string
  description: string
  address: string
  area: string
  image?: string
  url: string
}) {
  const data = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name,
    description,
    address: {
      "@type": "PostalAddress",
      streetAddress: address,
      addressLocality: area,
      addressRegion: "Karnataka",
      addressCountry: "IN",
    },
    url,
    ...(image ? { image } : {}),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  )
}
