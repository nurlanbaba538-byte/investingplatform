const FMP_BASE = 'https://financialmodelingprep.com/stable'

function apiKey() {
  return process.env.FMP_API_KEY ?? ''
}

function daysAgo(n: number): string {
  const d = new Date()
  d.setDate(d.getDate() - n)
  return d.toISOString().split('T')[0]
}

export type QuoteData = {
  symbol: string
  price: number
  changePercentage: number
  change: number
  yearHigh: number
  yearLow: number
  priceAvg50: number
  priceAvg200: number
  volume?: number
}

// Tək tikker — pulsuz planda işləyir
export async function getQuote(ticker: string): Promise<QuoteData | null> {
  try {
    const res = await fetch(
      `${FMP_BASE}/quote?symbol=${ticker}&apikey=${apiKey()}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    if (!Array.isArray(data) || data.length === 0) return null
    return data[0] as QuoteData
  } catch {
    return null
  }
}

// Çoxlu tikker — hər birini tək-tək çəkir (batch premium tələb edir)
export async function getQuotes(tickers: string[]): Promise<Record<string, QuoteData> | null> {
  try {
    const results = await Promise.allSettled(tickers.map(t => getQuote(t)))
    const map: Record<string, QuoteData> = {}
    results.forEach((r, i) => {
      if (r.status === 'fulfilled' && r.value) map[tickers[i]] = r.value
    })
    return Object.keys(map).length > 0 ? map : null
  } catch {
    return null
  }
}

export async function getHistoricalPrices(ticker: string, days = 250): Promise<Array<{
  date: string
  open: number
  high: number
  low: number
  close: number
  volume: number
}> | null> {
  try {
    const from = daysAgo(days)
    const res = await fetch(
      `${FMP_BASE}/historical-price-eod/full?symbol=${ticker}&from=${from}&apikey=${apiKey()}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}

export async function getTechnical(
  ticker: string,
  type: 'sma' | 'rsi' | 'macd',
  period?: number
): Promise<Array<Record<string, number>> | null> {
  try {
    const from = daysAgo(40)
    const periodParam = period ? `&period=${period}` : ''
    const res = await fetch(
      `${FMP_BASE}/technical_indicator/daily/${ticker}?type=${type}${periodParam}&from=${from}&apikey=${apiKey()}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) && data.length > 0 ? data : null
  } catch {
    return null
  }
}

export async function getEconCalendar(from: string, to: string): Promise<Array<{
  date: string
  country: string
  event: string
  actual: number | null
  estimate: number | null
  previous: number | null
  impact: string
}> | null> {
  try {
    const res = await fetch(
      `${FMP_BASE}/economic-calendar?from=${from}&to=${to}&apikey=${apiKey()}`,
      { next: { revalidate: 3600 } }
    )
    if (!res.ok) return null
    const data = await res.json()
    return Array.isArray(data) ? data : null
  } catch {
    return null
  }
}
