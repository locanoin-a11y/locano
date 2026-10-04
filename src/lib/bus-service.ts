import { buses, type Bus } from "@/data/buses"
import { stopById, stops, type Stop } from "@/data/stops"
import { haversineKm, rideBetween, segmentOffset } from "@/lib/geo"

export type Journey = {
  bus: Bus
  from: Stop
  to: Stop
  stops: Stop[]
  minutes: number
  distanceKm: number
  reversed: boolean
  /** A searched place sits on the road between chart stops, but the chart did not name it. */
  alongRoad: boolean
  passed: string[]
}

export type StopMatch = {
  status: "empty" | "none" | "match" | "ambiguous"
  stop?: Stop
  suggestions: Stop[]
}

for (const bus of buses) {
  const seen = new Set<string>()
  for (const id of bus.stops) {
    if (!stopById.has(id)) {
      throw new Error(`Bus ${bus.number} references unknown stop "${id}"`)
    }
    if (seen.has(id)) {
      throw new Error(`Bus ${bus.number} lists "${id}" twice`)
    }
    seen.add(id)
  }
  if (bus.stops.length < 2) {
    throw new Error(`Bus ${bus.number} needs at least two stops`)
  }
}

function normalize(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
}

function scoreStop(stop: Stop, query: string) {
  const name = normalize(stop.name)
  const id = normalize(stop.id.replace(/-/g, " "))
  const fields = [name, id, ...stop.aliases.map(normalize)]
  if (fields.some((field) => field === query)) return 100
  if (fields.some((field) => field.startsWith(query))) return 86
  const tokens = query.split(" ")
  if (
    tokens.length > 1 &&
    tokens.every((token) => fields.some((field) => field.includes(token)))
  ) {
    return 74
  }
  if (fields.some((field) => field.includes(query))) return 64
  return 0
}

export function searchStops(query: string, limit = 8) {
  const normalized = normalize(query)
  if (!normalized) return []
  // One letter means "places that start with this", such as v → Valencia, Valachil.
  const minimumScore = normalized.length === 1 ? 86 : 1
  return stops
    .map((stop) => ({ stop, score: scoreStop(stop, normalized) }))
    .filter((entry) => entry.score >= minimumScore)
    .sort((a, b) => b.score - a.score || a.stop.name.localeCompare(b.stop.name))
    .slice(0, limit)
    .map((entry) => entry.stop)
}

export function resolveStop(query: string): StopMatch {
  const normalized = normalize(query)
  if (!normalized) return { status: "empty", suggestions: [] }

  const ranked = stops
    .map((stop) => ({ stop, score: scoreStop(stop, normalized) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score || a.stop.name.localeCompare(b.stop.name))

  if (ranked.length === 0 || ranked[0].score < 50) {
    return { status: "none", suggestions: ranked.slice(0, 5).map((entry) => entry.stop) }
  }

  const [top, second] = ranked
  const exactAndUnique = top.score >= 100 && (!second || second.score < 100)
  const clearLeader = top.score >= 80 && (!second || top.score - second.score >= 20)
  if (exactAndUnique || clearLeader) {
    return { status: "match", stop: top.stop, suggestions: [] }
  }

  const suggestions = ranked
    .filter((entry) => entry.score >= top.score - 15 && entry.score >= 50)
    .slice(0, 5)
    .map((entry) => entry.stop)

  if (suggestions.length === 1) {
    return { status: "match", stop: suggestions[0], suggestions: [] }
  }

  return { status: "ambiguous", suggestions }
}

export function getStop(id: string) {
  return stopById.get(id)
}

export function getAllStops() {
  return [...stops].sort((a, b) => a.name.localeCompare(b.name))
}

export function compareBusNumbers(a: string, b: string) {
  const parse = (value: string) => {
    const match = value.match(/^(\d+)(.*)$/i)
    if (!match) return { n: Number.MAX_SAFE_INTEGER, rest: value }
    return { n: Number(match[1]), rest: match[2] }
  }
  const left = parse(a)
  const right = parse(b)
  if (left.n !== right.n) return left.n - right.n
  return left.rest.localeCompare(right.rest)
}

export function getAllBuses() {
  return [...buses].sort((a, b) => compareBusNumbers(a.number, b.number))
}

export function getBus(numberOrId: string) {
  const key = numberOrId.trim().toLowerCase().replace(/\s+/g, "")
  const byId = buses.find((bus) => bus.id === key)
  if (byId) return byId
  const byNumber = buses.filter((bus) => bus.number.toLowerCase() === key)
  return byNumber.length === 1 ? byNumber[0] : undefined
}

export function normalizeBusQuery(value: string) {
  return value.trim().toUpperCase().replace(/\s+/g, "")
}

export function busesWithNumber(query: string) {
  const key = normalizeBusQuery(query)
  if (!key) return []
  return buses
    .filter((bus) => bus.number.toUpperCase() === key)
    .sort((a, b) => a.id.localeCompare(b.id))
}

export function busRouteLabel(bus: Bus) {
  const from = stopById.get(bus.stops[0])?.name ?? ""
  const to = stopById.get(bus.stops[bus.stops.length - 1])?.name ?? ""
  return `${from} → ${to}`
}

export function stopNames(ids: string[]) {
  return ids.map((id) => stopById.get(id)?.name ?? id)
}

export function redirectedRoads(bus: Bus) {
  const roads = busesWithNumber(bus.number)
  if (roads.length < 2) return []
  const mine = new Set(bus.stops)
  return roads
    .filter((other) => other.id !== bus.id)
    .map((other) => {
      const theirs = new Set(other.stops)
      return {
        bus: other,
        onlyHere: stopNames(bus.stops.filter((id) => !theirs.has(id))),
        onlyThere: stopNames(other.stops.filter((id) => !mine.has(id))),
      }
    })
}

export function matchBuses(query: string) {
  const key = normalizeBusQuery(query)
  if (!key) return []
  const exact = busesWithNumber(key)
  if (exact.length > 0) return exact
  return buses
    .filter((bus) => bus.number.toUpperCase().startsWith(key))
    .sort((a, b) => compareBusNumbers(a.number, b.number))
}

function stopsFromIds(ids: string[]) {
  return ids.map((id) => {
    const stop = stopById.get(id)
    if (!stop) throw new Error(`Missing stop ${id}`)
    return stop
  })
}

function toJourney(
  bus: Bus,
  orderedIds: string[],
  reversed: boolean,
  alongRoad = false,
  passed: string[] = [],
): Journey {
  const ordered = stopsFromIds(orderedIds)
  const ride = rideBetween(ordered)
  return {
    bus,
    from: ordered[0],
    to: ordered[ordered.length - 1],
    stops: ordered,
    minutes: ride.minutes,
    distanceKm: ride.distanceKm,
    reversed,
    alongRoad,
    passed,
  }
}

export function fullJourney(bus: Bus) {
  return toJourney(bus, bus.stops, false)
}

/** Smaller places within this distance of the road still count, even when the chart skipped them. */
const CORRIDOR_KM = 0.35

function placement(bus: Bus, stopId: string) {
  const named = bus.stops.indexOf(stopId)
  if (named !== -1) return { index: named, named: true }
  const stop = stopById.get(stopId)
  if (!stop) return null
  let best: { index: number; km: number } | null = null
  for (let i = 0; i < bus.stops.length - 1; i++) {
    const start = stopById.get(bus.stops[i])
    const end = stopById.get(bus.stops[i + 1])
    if (!start || !end) continue
    const { t, km } = segmentOffset(stop, start, end)
    if (t <= 0.05 || t >= 0.95 || km > CORRIDOR_KM) continue
    if (!best || km < best.km) best = { index: i + t, km }
  }
  return best ? { index: best.index, named: false } : null
}

export function segmentJourney(bus: Bus, fromId: string, toId: string) {
  const fromPlace = placement(bus, fromId)
  const toPlace = placement(bus, toId)
  if (!fromPlace || !toPlace) return null
  if (Math.abs(fromPlace.index - toPlace.index) < 0.2) return null
  const reversed = fromPlace.index > toPlace.index
  const lo = Math.min(fromPlace.index, toPlace.index)
  const hi = Math.max(fromPlace.index, toPlace.index)
  const start = Math.floor(lo)
  const end = Math.min(bus.stops.length - 1, Math.ceil(hi))
  const ids = bus.stops.slice(start, end + 1)
  const passed: string[] = []
  for (const extra of [
    { id: fromId, index: fromPlace.index, named: fromPlace.named },
    { id: toId, index: toPlace.index, named: toPlace.named },
  ]) {
    if (extra.named || ids.includes(extra.id)) continue
    let at = ids.length
    for (let i = 0; i < ids.length; i++) {
      if (start + i > extra.index) {
        at = i
        break
      }
    }
    ids.splice(at, 0, extra.id)
    passed.push(extra.id)
  }
  if (reversed) ids.reverse()
  if (ids.length < 2 || ids[0] === ids[ids.length - 1]) return null
  return toJourney(bus, ids, reversed, passed.length > 0, passed)
}

export function findRoutes(fromId: string, toId: string) {
  if (fromId === toId) return []
  const journeys: Journey[] = []
  for (const bus of buses) {
    const journey = segmentJourney(bus, fromId, toId)
    if (journey) journeys.push(journey)
  }
  return journeys.sort(
    (a, b) =>
      Number(a.alongRoad) - Number(b.alongRoad) ||
      a.minutes - b.minutes ||
      a.stops.length - b.stops.length ||
      compareBusNumbers(a.bus.number, b.bus.number),
  )
}

export function busesThroughStop(stopId: string) {
  return buses
    .filter((bus) => bus.stops.includes(stopId))
    .sort((a, b) => compareBusNumbers(a.number, b.number))
}

export function routeSlug(fromId: string, toId: string) {
  return `${fromId}-to-${toId}`
}

export function parseRouteSlug(slug: string) {
  const marker = "-to-"
  const index = slug.indexOf(marker)
  if (index <= 0) return null
  const from = stopById.get(slug.slice(0, index))
  const to = stopById.get(slug.slice(index + marker.length))
  if (!from || !to || from.id === to.id) return null
  return { from, to }
}

export function nearestStops(lat: number, lng: number, count = 3) {
  return stops
    .map((stop) => ({
      stop,
      meters: haversineKm({ lat, lng }, stop) * 1000,
    }))
    .sort((a, b) => a.meters - b.meters)
    .slice(0, count)
}

export function busEndpoints(bus: Bus) {
  const origin = stopById.get(bus.stops[0])
  const destination = stopById.get(bus.stops[bus.stops.length - 1])
  if (!origin || !destination) {
    throw new Error(`Bus ${bus.number} is missing an endpoint`)
  }
  return { origin, destination }
}

export function osmDirectionsUrl(from: Stop, to: Stop) {
  return `https://www.openstreetmap.org/directions?engine=fossgis_osrm_car&route=${from.lat}%2C${from.lng}%3B${to.lat}%2C${to.lng}`
}