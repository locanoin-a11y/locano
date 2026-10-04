export type LatLng = { lat: number; lng: number }

const EARTH_KM = 6371

function toRad(degrees: number) {
  return (degrees * Math.PI) / 180
}

/** Where `point` falls on the straight line from `start` to `end`. `t` is 0 at the start and 1 at the end. */
export function segmentOffset(point: LatLng, start: LatLng, end: LatLng) {
  const lat0 = (((start.lat + end.lat) / 2) * Math.PI) / 180
  const kx = Math.cos(lat0) * 111.32
  const ky = 110.57
  const px = (point.lng - start.lng) * kx
  const py = (point.lat - start.lat) * ky
  const bx = (end.lng - start.lng) * kx
  const by = (end.lat - start.lat) * ky
  const len2 = bx * bx + by * by
  if (len2 < 1e-8) return { t: 0, km: haversineKm(point, start) }
  const raw = (px * bx + py * by) / len2
  const t = Math.max(0, Math.min(1, raw))
  const foot = {
    lat: start.lat + (end.lat - start.lat) * t,
    lng: start.lng + (end.lng - start.lng) * t,
  }
  return { t, km: haversineKm(point, foot) }
}

export function haversineKm(a: LatLng, b: LatLng) {
  const dLat = toRad(b.lat - a.lat)
  const dLng = toRad(b.lng - a.lng)
  const lat1 = toRad(a.lat)
  const lat2 = toRad(b.lat)
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2
  return 2 * EARTH_KM * Math.asin(Math.min(1, Math.sqrt(h)))
}

const ROAD_FACTOR = 1.2
const SPEED_KMH = 20
const DWELL_MIN = 0.6

export function rideBetween(points: LatLng[]) {
  let crowKm = 0
  for (let i = 1; i < points.length; i++) {
    crowKm += haversineKm(points[i - 1], points[i])
  }
  const distanceKm = Math.round(crowKm * ROAD_FACTOR * 10) / 10
  const moving = (distanceKm / SPEED_KMH) * 60
  const dwell = Math.max(0, points.length - 2) * DWELL_MIN
  const minutes = Math.max(points.length > 1 ? 4 : 0, Math.round(moving + dwell))
  return { distanceKm, minutes }
}