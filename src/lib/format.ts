export function formatMinutes(minutes: number) {
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const rest = minutes % 60
  return rest ? `${hours} hr ${rest} min` : `${hours} hr`
}

export function formatKm(km: number) {
  if (km < 1) return `${Math.round(km * 1000)} m`
  return `${km.toFixed(km < 10 ? 1 : 0)} km`
}

export function formatMeters(meters: number) {
  if (meters < 1000) {
    return `${Math.max(10, Math.round(meters / 10) * 10)} m`
  }
  return `${(meters / 1000).toFixed(1)} km`
}

export function indicativeFare(km: number) {
  const raw = 8 + km * 1.6
  return Math.max(10, Math.round(raw / 2) * 2)
}

export function formatInr(amount: number) {
  return `₹${amount}`
}