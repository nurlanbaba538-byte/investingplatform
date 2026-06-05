import { getQuote, getHistoricalPrices } from '@/lib/fmp'
import {
  calcWeinstein, calcMansfield,
  calcTrend, calcMomentum, calcBreadth, calcEarnings,
  calcSector, calcSentiment, calcOpex, calcHealthScore,
  calcRSI, calcMACDHist,
  type IndexData,
} from '@/lib/calculations'
import { MANUAL_DATA } from '@/lib/manualData'

const INDEX_TICKERS  = ['SPY', 'RSP', 'QQQ', 'QQQE', 'DIA', 'IWM']
const SECTOR_TICKERS = ['SMH', 'IGV', 'XBI', 'XLE', 'XLF', 'ITB']
const RS_TICKERS     = ['XLK','XLF','XLE','XLV','XLY','XLP','XLI','XLB','XLC','XLU','XLRE']
const ALL_TICKERS    = [...new Set([...INDEX_TICKERS, ...SECTOR_TICKERS, ...RS_TICKERS])]

function settled<T>(r: PromiseSettledResult<T>): T | null {
  return r.status === 'fulfilled' ? r.value : null
}

async function fetchTicker(ticker: string) {
  const [quoteRes, histRes] = await Promise.allSettled([
    getQuote(ticker),
    getHistoricalPrices(ticker, 260),
  ])

  const q    = settled(quoteRes)
  const hist = settled(histRes)

  if (!q) return null

  // SMA50 + SMA200: quote-dan birbaşa
  const sma50   = q.priceAvg50  ?? null
  const sma200  = q.priceAvg200 ?? null

  // prevSma200: 5 gün əvvəlki qiymət üzərindən approximate
  let prevSma200: number | null = null
  if (hist && hist.length >= 206) {
    const old200 = hist.slice(5, 205)
    prevSma200 = old200.reduce((s, d) => s + d.close, 0) / old200.length
  } else if (sma200) {
    prevSma200 = sma200 * 0.999 // yox olduqda negligible diff
  }

  // RSI + MACD: historical close-lardan
  const closes  = hist ? hist.map(d => d.close) : []
  const rsi     = closes.length >= 15 ? calcRSI(closes, 14) : null
  const macdRes = closes.length >= 35 ? calcMACDHist(closes) : null

  return {
    ticker,
    price:        q.price,
    change:       q.change,
    changePct:    q.changePercentage,
    sma50,
    sma200,
    prevSma200,
    rsi,
    macdHist:     macdRes?.macdHist      ?? null,
    prevMacdHist: macdRes?.prevMacdHist  ?? null,
    yearHigh:     q.yearHigh,
  }
}

export async function GET() {
  // Bütün tikkerləri paralel çək
  const fetchResults = await Promise.allSettled(
    ALL_TICKERS.map(t => fetchTicker(t))
  )

  const dataMap: Record<string, Awaited<ReturnType<typeof fetchTicker>>> = {}
  ALL_TICKERS.forEach((t, i) => {
    dataMap[t] = settled(fetchResults[i]) ?? null
  })

  // ── İndeks kartları ────────────────────────────────────────
  const indices = INDEX_TICKERS.map(ticker => {
    const d = dataMap[ticker]
    if (!d || d.sma200 == null || d.prevSma200 == null) return null
    const { stage, qualifier } = calcWeinstein(d.price, d.sma50 ?? d.price, d.sma200, d.prevSma200)
    return {
      ticker,
      price:      d.price,
      change:     d.change,
      changePct:  d.changePct,
      sma50:      d.sma50,
      sma200:     d.sma200,
      rsi:        d.rsi,
      macdHist:   d.macdHist,
      yearHigh:   d.yearHigh,
      stage,
      stageQual:  qualifier,
    }
  })

  // ── Sektor cədvəli ─────────────────────────────────────────
  const sectors = SECTOR_TICKERS.map(ticker => {
    const d = dataMap[ticker]
    if (!d || d.sma200 == null || d.prevSma200 == null) return null
    const { stage } = calcWeinstein(d.price, d.sma50 ?? d.price, d.sma200, d.prevSma200)
    return {
      ticker,
      price:     d.price,
      changePct: d.changePct,
      sma50pct:  d.sma50 != null ? ((d.price - d.sma50) / d.sma50) * 100 : null,
      sma200pct: ((d.price - d.sma200) / d.sma200) * 100,
      stage,
    }
  })

  // ── Mansfield RS sıralaması ────────────────────────────────
  const sectorRS = RS_TICKERS
    .map(ticker => {
      const d = dataMap[ticker]
      if (!d || d.sma200 == null) return null
      return { ticker, mansfield: calcMansfield(d.price, d.sma200), dailyPct: d.changePct }
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => b.mansfield - a.mansfield)

  // ── 7 Pillər + Sağlamlıq skoru ────────────────────────────
  const indexDataArr: IndexData[] = INDEX_TICKERS
    .map(t => {
      const d = dataMap[t]
      if (!d || d.sma200 == null || d.prevSma200 == null) return null
      return {
        price:       d.price,
        sma50:       d.sma50 ?? d.price,
        sma200:      d.sma200,
        prevSma200:  d.prevSma200,
        rsi:         d.rsi ?? 50,
        macdHist:    d.macdHist ?? 0,
      }
    })
    .filter((x): x is IndexData => x !== null)

  const { breadthPctAbove50dma, naaim, cnnFearGreed, cboe, earnings, opexDates } = MANUAL_DATA

  const qqqIdx = indexDataArr[INDEX_TICKERS.indexOf('QQQ')]
  const stage2Sectors = SECTOR_TICKERS.filter(t => {
    const d = dataMap[t]
    if (!d || d.sma200 == null || d.prevSma200 == null) return false
    return calcWeinstein(d.price, d.sma50 ?? d.price, d.sma200, d.prevSma200).stage === 2
  }).length

  const today = new Date(); today.setHours(0,0,0,0)
  const opexDays = (() => {
    const upcoming = opexDates.map(d => new Date(d)).filter(d => d >= today).sort((a,b) => a.getTime()-b.getTime())
    if (!upcoming.length) return 99
    return Math.ceil((upcoming[0].getTime() - today.getTime()) / 86400000)
  })()

  const pillars = indexDataArr.length >= 1 ? {
    trend:     calcTrend(indexDataArr),
    momentum:  qqqIdx ? calcMomentum(qqqIdx) : 50,
    breadth:   calcBreadth(breadthPctAbove50dma, naaim),
    earnings:  calcEarnings(earnings.beatRate, earnings.blendedGrowth),
    sector:    calcSector(stage2Sectors, SECTOR_TICKERS.length),
    sentiment: calcSentiment(cnnFearGreed, naaim, cboe.equityPC),
    opex:      calcOpex(opexDays),
  } : null

  const healthScore = pillars ? calcHealthScore(pillars) : null

  return Response.json({
    timestamp: new Date().toISOString(),
    indices,
    sectors,
    sectorRS,
    pillars,
    healthScore,
    opexDays,
  })
}
