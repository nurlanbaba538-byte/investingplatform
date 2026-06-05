const FRED_BASE = 'https://api.stlouisfed.org/fred/series/observations'

function apiKey() {
  return process.env.FRED_API_KEY ?? ''
}

export async function getFredLatest(seriesId: string): Promise<number | null> {
  try {
    const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey()}&file_type=json&sort_order=desc&limit=2`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const data = await res.json()
    const obs = (data.observations ?? []).filter((o: { value: string }) => o.value !== '.')
    return obs.length > 0 ? parseFloat(obs[0].value) : null
  } catch {
    return null
  }
}

export async function getFredSeries(
  seriesId: string,
  count: number = 14
): Promise<Array<{ date: string; value: string }> | null> {
  try {
    const url = `${FRED_BASE}?series_id=${seriesId}&api_key=${apiKey()}&file_type=json&sort_order=desc&limit=${count}`
    const res = await fetch(url, { next: { revalidate: 86400 } })
    if (!res.ok) return null
    const data = await res.json()
    return (data.observations ?? []).filter((o: { value: string }) => o.value !== '.') ?? null
  } catch {
    return null
  }
}

export async function calcFredYoY(seriesId: string): Promise<number | null> {
  try {
    const obs = await getFredSeries(seriesId, 14)
    if (!obs || obs.length < 13) return null
    const latest = parseFloat(obs[0].value)
    const yearAgo = parseFloat(obs[12].value)
    if (isNaN(latest) || isNaN(yearAgo) || yearAgo === 0) return null
    return ((latest / yearAgo) - 1) * 100
  } catch {
    return null
  }
}
