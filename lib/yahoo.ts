const YAHOO_BASE = 'https://query1.finance.yahoo.com/v8/finance/chart'

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
  'Accept': 'application/json',
}

export type YahooQuote = {
  symbol:    string
  price:     number
  prevClose: number
  changePct: number
  change:    number
}

async function fetchYahoo(symbol: string): Promise<YahooQuote | null> {
  try {
    const encoded = encodeURIComponent(symbol)
    const res = await fetch(
      `${YAHOO_BASE}/${encoded}?interval=1d&range=1d`,
      { headers: HEADERS, next: { revalidate: 900 } } // 15 dəq cache
    )
    if (!res.ok) return null
    const data = await res.json()
    const meta = data?.chart?.result?.[0]?.meta
    if (!meta?.regularMarketPrice) return null

    const price     = meta.regularMarketPrice as number
    const prevClose = (meta.chartPreviousClose ?? meta.previousClose ?? price) as number
    const changePct = prevClose ? ((price / prevClose) - 1) * 100 : 0

    return { symbol, price, prevClose, changePct, change: price - prevClose }
  } catch {
    return null
  }
}

export type MarketSnapshot = {
  sp500:   YahooQuote | null
  nasdaq:  YahooQuote | null
  dow:     YahooQuote | null
  vix:     YahooQuote | null
  wti:     YahooQuote | null
  brent:   YahooQuote | null
  gold:    YahooQuote | null
  bitcoin: YahooQuote | null
}

export async function getMarketSnapshot(): Promise<MarketSnapshot> {
  const [sp500, nasdaq, dow, vix, wti, brent, gold, bitcoin] =
    await Promise.all([
      fetchYahoo('^GSPC'),
      fetchYahoo('^IXIC'),
      fetchYahoo('^DJI'),
      fetchYahoo('^VIX'),
      fetchYahoo('CL=F'),
      fetchYahoo('BZ=F'),
      fetchYahoo('GC=F'),
      fetchYahoo('BTC-USD'),
    ])

  return { sp500, nasdaq, dow, vix, wti, brent, gold, bitcoin }
}
