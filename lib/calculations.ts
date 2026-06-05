// ── 8-qat swing skor (0-24) ──────────────────────────────────
export type EightLayerScore = {
  layers: Array<{ name: string; score: number; max: 3; note: string }>
  total:  number
  label:  'GÜCLÜ' | 'İZLƏ' | 'GÖZLƏ' | 'DEYİL'
}

export function calc8LayerScore(params: {
  price: number; sma50: number; sma200: number; prevSma200: number
  rsi: number; macdHist: number; prevMacdHist: number
  vcpScore: number   // 0/10/20 from calcVCP
  volume: number; avgVolume20: number
  daysToEarnings?: number
  distFromSupport?: number  // % above nearest support
  yearHigh: number
}): EightLayerScore {
  const { price, sma50, sma200, prevSma200, rsi, macdHist, prevMacdHist,
          vcpScore, volume, avgVolume20, daysToEarnings, yearHigh } = params

  // 1. Weinstein Stage (0-3)
  const stage = calcWeinstein(price, sma50, sma200, prevSma200)
  const s1 = stage.stage === 2 ? (stage.qualifier === 'EKSTREMİ' ? 2 : 3) : stage.stage === 1 ? 1 : 0

  // 2. VCP Pattern (0-3)
  const s2 = vcpScore >= 20 ? 3 : vcpScore >= 10 ? 2 : vcpScore > 0 ? 1 : 0

  // 3. İnstitusional İz — həcm analizi (0-3)
  const volRatio = volume / avgVolume20
  const s3 = volRatio >= 1.5 && macdHist > 0 ? 3
           : volRatio >= 1.2 ? 2
           : volRatio >= 0.9 ? 1 : 0

  // 4. Bazar/Sektor (0-3) — SPY momentum proxy
  const distSma200 = ((price - sma200) / sma200) * 100
  const s4 = distSma200 > 15 ? 3 : distSma200 > 5 ? 2 : distSma200 > 0 ? 1 : 0

  // 5. Opsion Axını (0-3) — əlçatan data yoxdur, 1 default
  const s5 = 1

  // 6. Momentum RSI+MACD (0-3)
  const rsiOk  = rsi >= 50 && rsi <= 70
  const macdOk = macdHist > 0 && macdHist > prevMacdHist
  const s6 = rsiOk && macdOk ? 3 : rsiOk || macdOk ? 2 : rsi > 40 ? 1 : 0

  // 7. Dəstək/Müqavimət (0-3)
  const distSma50 = ((price - sma50) / sma50) * 100
  const athDist   = ((yearHigh - price) / price) * 100
  const s7 = distSma50 >= 0 && distSma50 <= 8 && athDist >= 5 ? 3
           : distSma50 >= 0 && athDist >= 3 ? 2 : distSma50 >= 0 ? 1 : 0

  // 8. Katalizator/Earnings (0-3)
  const eDays = daysToEarnings ?? 99
  const s8 = eDays >= 30 ? 3 : eDays >= 14 ? 2 : eDays >= 7 ? 1 : 0

  const layers = [
    { name:'Weinstein Stage',      score:s1, max:3 as const, note: `Stage ${stage.stage} ${stage.qualifier}` },
    { name:'VCP Pattern',          score:s2, max:3 as const, note: vcpScore >= 20 ? '3 kontraksiya' : vcpScore >= 10 ? '2 kontraksiya' : 'Pattern yoxdur' },
    { name:'İnstitusional İz',     score:s3, max:3 as const, note: `Həcm ${volRatio.toFixed(1)}x ortalama` },
    { name:'Bazar/Sektor',         score:s4, max:3 as const, note: `SMA200-dən ${distSma200.toFixed(1)}% yuxarı` },
    { name:'Opsion Axını',         score:s5, max:3 as const, note: 'Data əlçatan deyil' },
    { name:'Momentum',             score:s6, max:3 as const, note: `RSI ${rsi.toFixed(0)}, MACD ${macdHist >= 0 ? '+' : ''}${macdHist.toFixed(2)}` },
    { name:'Dəstək/Müqavimət',    score:s7, max:3 as const, note: `SMA50-dən ${distSma50.toFixed(1)}%, zirvədən -${athDist.toFixed(1)}%` },
    { name:'Katalizator',          score:s8, max:3 as const, note: eDays < 99 ? `Qazanc ${eDays}g` : 'Qazanc yoxlanılmadı' },
  ]

  const total = s1+s2+s3+s4+s5+s6+s7+s8
  const label: EightLayerScore['label'] = total >= 18 ? 'GÜCLÜ' : total >= 13 ? 'İZLƏ' : total >= 8 ? 'GÖZLƏ' : 'DEYİL'
  return { layers, total, label }
}

// ── Weinstein Stage ──────────────────────────────────────────
export type StageResult = { stage: 1 | 2 | 3 | 4; qualifier: string }

export function calcWeinstein(
  price: number,
  sma50: number,
  sma200: number,
  prevSma200: number
): StageResult {
  const aboveSma200  = price   > sma200
  const aboveSma50   = price   > sma50
  const sma200Rising = sma200  > prevSma200

  if (aboveSma200 && aboveSma50 && sma200Rising) {
    const dist = ((price - sma200) / sma200) * 100
    return { stage: 2, qualifier: dist > 15 ? 'EKSTREMİ' : 'GÜCLÜ' }
  }
  if (aboveSma200 && !aboveSma50)               return { stage: 1, qualifier: 'BAZA' }
  if (aboveSma200 && aboveSma50 && !sma200Rising) return { stage: 3, qualifier: 'ZİRVƏ' }
  if (!aboveSma200) {
    const dist = ((sma200 - price) / sma200) * 100
    return { stage: 4, qualifier: dist > 8 ? 'DƏRİN' : 'DÜŞÜŞDƏ' }
  }
  return { stage: 1, qualifier: 'BELİRSİZ' }
}

// ── Mansfield RS ──────────────────────────────────────────────
export function calcMansfield(price: number, sma200: number): number {
  return ((price - sma200) / sma200) * 100
}

// ── 7 Pillars Health Score ────────────────────────────────────
export type IndexData = {
  price:    number
  sma50:    number
  sma200:   number
  prevSma200: number
  rsi:      number
  macdHist: number
}

export type PillarScores = {
  trend:     number
  momentum:  number
  breadth:   number
  earnings:  number
  sector:    number
  sentiment: number
  opex:      number
}

function clamp(val: number, min: number, max: number) {
  return Math.max(min, Math.min(max, val))
}

export function calcTrend(indices: IndexData[]): number {
  const above = indices.filter(i => i.price > i.sma50 && i.price > i.sma200)
  return Math.round((above.length / indices.length) * 100)
}

export function calcMomentum(qqq: IndexData): number {
  const rsi = qqq.rsi
  if (rsi > 80) return 25
  if (rsi > 70) return 45
  if (rsi > 60) return 72
  if (rsi > 50) return 65
  if (rsi > 40) return 40
  return 25
}

export function calcBreadth(pctAbove50dma: number, naaim: number): number {
  let score = pctAbove50dma
  if (naaim > 100) score -= 10
  if (naaim > 90)  score -= 15
  return clamp(score, 0, 100)
}

export function calcEarnings(beatRate: number, blendedGrowth: number): number {
  const beatScore   = beatRate > 80 ? 100 : beatRate > 70 ? 75 : 50
  const growthScore = blendedGrowth > 25 ? 100 : blendedGrowth > 15 ? 80
                    : blendedGrowth > 5  ? 60  : blendedGrowth > 0  ? 40 : 15
  return Math.round(beatScore * 0.4 + growthScore * 0.6)
}

export function calcSector(stage2Count: number, total: number): number {
  return Math.round((stage2Count / total) * 100)
}

export function calcSentiment(cnnFG: number, naaim: number, equityPC: number): number {
  let score = 65
  if (cnnFG > 80)       score -= 25
  else if (cnnFG > 75)  score -= 15
  else if (cnnFG < 20)  score += 20
  else if (cnnFG < 25)  score += 12
  if (naaim > 95)       score -= 15
  else if (naaim > 90)  score -= 8
  if (equityPC < 0.5)   score -= 10
  return clamp(score, 0, 100)
}

export function calcOpex(daysToNextOpex: number): number {
  if (daysToNextOpex <= 0)  return 40
  if (daysToNextOpex <= 3)  return 25
  if (daysToNextOpex <= 7)  return 40
  if (daysToNextOpex <= 14) return 60
  return 80
}

export function calcHealthScore(p: PillarScores): number {
  return Math.round(
    p.trend     * 0.20 +
    p.momentum  * 0.20 +
    p.breadth   * 0.15 +
    p.earnings  * 0.20 +
    p.sector    * 0.10 +
    p.sentiment * 0.10 +
    p.opex      * 0.05
  )
}

// ── RSI hesablaması (closes massivindən) ─────────────────────
export function calcRSI(closes: number[], period = 14): number | null {
  if (closes.length < period + 1) return null
  const recent = closes.slice(0, period + 1).reverse() // köhnədən yeniyə
  let gains = 0, losses = 0
  for (let i = 1; i < recent.length; i++) {
    const diff = recent[i] - recent[i - 1]
    if (diff > 0) gains  += diff
    else          losses -= diff
  }
  const avgGain = gains  / period
  const avgLoss = losses / period
  if (avgLoss === 0) return 100
  const rs = avgGain / avgLoss
  return Math.round((100 - 100 / (1 + rs)) * 10) / 10
}

// ── MACD histogram (closes massivindən) ───────────────────────
function ema(closes: number[], period: number): number[] {
  const k = 2 / (period + 1)
  const result: number[] = [closes[0]]
  for (let i = 1; i < closes.length; i++) {
    result.push(closes[i] * k + result[i - 1] * (1 - k))
  }
  return result
}

export function calcMACDHist(closes: number[]): { macdHist: number; prevMacdHist: number } | null {
  if (closes.length < 35) return null
  const rev    = [...closes].reverse()
  const ema12  = ema(rev, 12)
  const ema26  = ema(rev, 26)
  const macdLine = ema12.map((v, i) => v - ema26[i])
  const signal   = ema(macdLine, 9)
  const hist     = macdLine.map((v, i) => v - signal[i])
  const last     = hist.length - 1
  return {
    macdHist:     hist[last],
    prevMacdHist: hist[last - 1] ?? hist[last],
  }
}

// ── Swing Score (Texniki Analiz üçün) ────────────────────────
export type OHLCVPoint = {
  open: number; high: number; low: number; close: number; volume: number
}

export type SwingScore = {
  total: number
  scores: Record<string, number>
  decision: 'EVET' | 'İZLƏ' | 'XEYR'
}

export type StockTechnicalData = {
  price:       number
  sma20:       number
  sma50:       number
  sma200:      number
  rsi:         number
  macdHistogram:     number
  macdHistogramPrev: number
  volume:      number
  avgVolume20: number
  yearHigh:    number
  nextEarningsDays?: number
  ohlcv90:     OHLCVPoint[]
}

function splitIntoPeriods(data: OHLCVPoint[], n: number): OHLCVPoint[][] {
  const size = Math.floor(data.length / n)
  return Array.from({ length: n }, (_, i) => data.slice(i * size, (i + 1) * size))
}

export function calcVCP(ohlcv: OHLCVPoint[]): number {
  if (ohlcv.length < 8) return 0
  const periods = splitIntoPeriods(ohlcv, 4)
  const ranges = periods.map(p => ({
    range:  Math.max(...p.map(d => d.high)) - Math.min(...p.map(d => d.low)),
    avgVol: p.reduce((s, d) => s + d.volume, 0) / p.length,
  }))
  let contractions = 0
  for (let i = 1; i < ranges.length; i++) {
    if (ranges[i].range < ranges[i - 1].range && ranges[i].avgVol < ranges[i - 1].avgVol) {
      contractions++
    }
  }
  return contractions >= 3 ? 20 : contractions >= 2 ? 10 : 0
}

export function calcSwingScore(data: StockTechnicalData): SwingScore {
  const scores: Record<string, number> = {}

  const trendOk = data.sma20 > data.sma50 && data.sma50 > data.sma200
  scores.trend = trendOk ? 20
    : data.price > data.sma200 ? (data.price > data.sma50 ? 14 : 10) : 4

  scores.rsi = data.rsi >= 45 && data.rsi <= 65 ? 15
             : data.rsi >= 65 && data.rsi <= 75 ? 8
             : data.rsi > 75 ? 2 : data.rsi < 35 ? 2 : 6

  scores.macd = data.macdHistogram > 0 && data.macdHistogramPrev < data.macdHistogram ? 10
              : data.macdHistogram > 0 ? 7
              : data.macdHistogram > -0.5 ? 3 : 0

  scores.vcp = calcVCP(data.ohlcv90)

  const volRatio = data.volume / data.avgVolume20
  scores.volume = volRatio >= 0.9 && volRatio <= 1.5 ? 10
                : volRatio > 1.5 ? 6 : 4

  const extPct = ((data.price - data.sma20) / data.sma20) * 100
  scores.extension = extPct >= -2 && extPct <= 5 ? 10
                   : extPct <= 10 ? 7 : extPct <= 20 ? 4 : 0

  const daysToEarnings = data.nextEarningsDays ?? 99
  scores.earnings = daysToEarnings >= 21 ? 10 : daysToEarnings >= 14 ? 7
                  : daysToEarnings >= 7 ? 4 : 2

  const athUpside = ((data.yearHigh - data.price) / data.price) * 100
  scores.athUpside = athUpside >= 20 ? 5 : athUpside >= 10 ? 3 : athUpside >= 5 ? 2 : 0

  const total = Object.values(scores).reduce((a, b) => a + b, 0)
  const decision: SwingScore['decision'] = total >= 75 ? 'EVET' : total >= 55 ? 'İZLƏ' : 'XEYR'
  return { total, scores, decision }
}
