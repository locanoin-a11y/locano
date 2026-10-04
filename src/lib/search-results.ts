import { findRoutes, getStop, nearestStops, type Journey } from "@/lib/bus-service"

export type ResultCard = {
  id: string
  busId: string
  number: string
  fleet: number | null
  reversed: boolean
  minutes: number
  fromId: string
  toId: string
  fromName: string
  toName: string
  via: string[]
  nearby: boolean
  alongRoad: boolean
}

function viaNames(names: string[]) {
  if (names.length <= 4) return names
  const mid = Math.floor(names.length / 2)
  return [names[0], names[Math.max(1, Math.floor(mid / 2))], names[mid], names[names.length - 1]]
}

function toCard(journey: Journey, nearby: boolean): ResultCard {
  return {
    id: `${journey.bus.id}:${journey.from.id}:${journey.to.id}`,
    busId: journey.bus.id,
    number: journey.bus.number,
    fleet: journey.bus.fleet,
    reversed: journey.reversed,
    minutes: journey.minutes,
    fromId: journey.from.id,
    toId: journey.to.id,
    fromName: journey.from.name,
    toName: journey.to.name,
    via: viaNames(journey.stops.map((stop) => stop.name)),
    nearby,
    alongRoad: journey.alongRoad,
  }
}

function nearbyJourneys(fromId: string, toId: string) {
  const from = getStop(fromId)
  const to = getStop(toId)
  if (!from || !to) return []
  const around = (id: string, lat: number, lng: number) =>
    nearestStops(lat, lng, 5)
      .map((item) => item.stop.id)
      .filter((stopId) => stopId !== id)
      .slice(0, 2)
  const fromNear = around(from.id, from.lat, from.lng)
  const toNear = around(to.id, to.lat, to.lng)
  const pairs = [
    ...toNear.map((id) => [from.id, id] as const),
    ...fromNear.map((id) => [id, to.id] as const),
  ]
  const seen = new Set<string>()
  const journeys: Journey[] = []
  for (const [start, end] of pairs) {
    if (start === end) continue
    for (const journey of findRoutes(start, end)) {
      const key = `${journey.bus.id}:${journey.from.id}:${journey.to.id}`
      if (seen.has(key)) continue
      seen.add(key)
      journeys.push(journey)
    }
  }
  return journeys
}

export function resultCards(fromId: string, toId: string) {
  const exact = findRoutes(fromId, toId).map((journey) => toCard(journey, false))
  const exactKeys = new Set(exact.map((card) => card.id))
  const nearby = nearbyJourneys(fromId, toId)
    .map((journey) => toCard(journey, true))
    .filter((card) => !exactKeys.has(card.id))
  return [...exact, ...nearby]
}