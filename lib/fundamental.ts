// ── Tip çeviriciləri ─────────────────────────────────────────
const NULL_VALS = new Set(['nm', '-', 'nan', 'n/a', '', 'n.a.', '—', 'null'])

export function pct(s: string | null | undefined): number | null {
  if (s == null) return null
  const clean = s.trim().replace('%', '').replace(',', '.')
  if (NULL_VALS.has(clean.toLowerCase())) return null
  const v = parseFloat(clean)
  return isNaN(v) ? null : v / 100
}

export function fl(s: string | null | undefined): number | null {
  if (s == null) return null
  const clean = s.trim().replace(/,/g, '').replace('%', '')
  if (NULL_VALS.has(clean.toLowerCase())) return null
  const v = parseFloat(clean)
  return isNaN(v) ? null : v
}

// ── Sütun axtarışı ───────────────────────────────────────────
export function findHeaderRow(rows: string[][]): number {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i].map(c => (c ?? '').toString().trim())
    if (row.every(c => c === '')) continue
    const hasName   = row.some(c => c.includes('Name') || c.toLowerCase().includes('name'))
    const hasTicker = row.some(c =>
      c.includes('Full Ticker') || c.toLowerCase() === 'ticker' || c.toLowerCase() === 'symbol'
    )
    if (hasName && hasTicker) return i
  }
  return -1
}

export function buildColMap(headerRow: string[]): Record<string, number> {
  const map: Record<string, number> = {}
  headerRow.forEach((cell, i) => {
    map[cell.trim()] = i
  })
  return map
}

// ── Metrik oxumaları ─────────────────────────────────────────
export type RawMetrics = {
  name:     string
  ticker:   string
  GM:       number | null
  ROE:      number | null
  ROIC:     number | null
  FCF_M:    number | null
  FCF_Y:    number | null
  RevGr:    number | null
  Rev5:     number | null
  EPS5:     number | null
  CR:       number | null
  DE:       number | null
  IntCov:   number | null
  AltZ:     number | null
  PEG:      number | null
  EVEBITDA: number | null
  PS_Rel:   number | null
  FairVal:  number | null
  Analyst:  number | null
  RSI:      number | null
  Return6M: number | null
  Beta:     number | null
}

// investing.com Pro sütun adları → bizim dəyişənlər
const COL_MAP: Record<keyof Omit<RawMetrics, 'name' | 'ticker'>, string[]> = {
  GM:       ['Gross Profit Margin', 'Gross Margin'],
  ROE:      ['Return on Equity', 'ROE'],
  ROIC:     ['Return on Invested Capital', 'ROIC'],
  FCF_M:    ['Levered Free Cash Flow Margin', 'FCF Margin'],
  FCF_Y:    ['Free Cash Flow Yield', 'FCF Yield'],
  RevGr:    ['Revenue Growth', 'Revenue Growth (YoY)'],
  Rev5:     ['Revenue CAGR (5y)', 'Revenue CAGR 5Y'],
  EPS5:     ['EPS Forecast CAGR (5y)', 'EPS CAGR 5Y'],
  CR:       ['Current Ratio'],
  DE:       ['Debt / Equity', 'D/E Ratio'],
  IntCov:   ['Interest Coverage Ratio', 'Interest Coverage'],
  AltZ:     ['Altman Z-Score'],
  PEG:      ['PEG Ratio Fwd', 'PEG Ratio'],
  EVEBITDA: ['EV / EBITDA', 'EV/EBITDA'],
  PS_Rel:   ['P/S % of 3 Year Avg P/S', 'P/S Relative'],
  FairVal:  ['Fair Value Upside', 'Upside to Fair Value'],
  Analyst:  ['Upside (Analyst Target)', 'Analyst Upside'],
  RSI:      ['Relative Strength Index (14d)', 'RSI (14)'],
  Return6M: ['6 Month Price Total Return', '6M Return'],
  Beta:     ['Beta (5 Year)', 'Beta'],
}

function getVal(row: string[], colMap: Record<string, number>, keys: string[]): string | null {
  for (const key of keys) {
    const idx = colMap[key]
    if (idx !== undefined && idx < row.length) {
      const v = (row[idx] ?? '').toString().trim()
      if (v !== '') return v
    }
  }
  return null
}

export function parseRow(row: string[], colMap: Record<string, number>): RawMetrics {
  const g = (keys: string[]) => getVal(row, colMap, keys)

  return {
    name:     g(['Name']) ?? '',
    ticker:   g(['Full Ticker', 'Ticker', 'Symbol']) ?? '',
    GM:       pct(g(COL_MAP.GM)),
    ROE:      pct(g(COL_MAP.ROE)),
    ROIC:     pct(g(COL_MAP.ROIC)),
    FCF_M:    pct(g(COL_MAP.FCF_M)),
    FCF_Y:    pct(g(COL_MAP.FCF_Y)),
    RevGr:    pct(g(COL_MAP.RevGr)),
    Rev5:     pct(g(COL_MAP.Rev5)),
    EPS5:     pct(g(COL_MAP.EPS5)),
    CR:       fl(g(COL_MAP.CR)),
    DE:       fl(g(COL_MAP.DE)),
    IntCov:   fl(g(COL_MAP.IntCov)),
    AltZ:     fl(g(COL_MAP.AltZ)),
    PEG:      fl(g(COL_MAP.PEG)),
    EVEBITDA: fl(g(COL_MAP.EVEBITDA)),
    PS_Rel:   pct(g(COL_MAP.PS_Rel)),
    FairVal:  pct(g(COL_MAP.FairVal)),
    Analyst:  pct(g(COL_MAP.Analyst)),
    RSI:      fl(g(COL_MAP.RSI)),
    Return6M: pct(g(COL_MAP.Return6M)),
    Beta:     fl(g(COL_MAP.Beta)),
  }
}

// ── Scoring ──────────────────────────────────────────────────
export type ScoredStock = RawMetrics & {
  total:      number
  blockA:     number
  blockB:     number
  blockC:     number
  blockD:     number
  blockE:     number
  riskLabel:  RiskLabel
  redFlags:   string[]
}

export function scoring(m: RawMetrics): ScoredStock {
  const { GM, ROE, ROIC, FCF_M, FCF_Y, RevGr, Rev5, EPS5,
          CR, DE, IntCov, AltZ, PEG, EVEBITDA, PS_Rel,
          FairVal, Analyst, RSI, Return6M, Beta } = m

  // BLOK A — Keyfiyyət (40 bal)
  const s_GM    = GM    == null ? 0 : GM    > 0.60 ? 10 : GM    > 0.40 ? 7 : GM    > 0.25 ? 4 : GM    > 0.15 ? 1 : 0
  const s_ROE   = ROE   == null ? 0 : ROE   > 0.30 ? 10 : ROE   > 0.20 ? 7 : ROE   > 0.10 ? 4 : ROE   > 0    ? 1 : 0
  const s_ROIC  = ROIC  == null ? 0 : ROIC  > 0.25 ? 12 : ROIC  > 0.15 ? 9 : ROIC  > 0.08 ? 5 : ROIC  > 0    ? 1 : 0
  const s_FCF_M = FCF_M == null ? 0 : FCF_M > 0.25 ? 8  : FCF_M > 0.15 ? 6 : FCF_M > 0.05 ? 3 : FCF_M > 0    ? 1 : 0

  // BLOK B — Böyümə/Dəyər (35 bal)
  const s_FCF_Y = FCF_Y == null ? 0 : FCF_Y > 0.06 ? 10 : FCF_Y > 0.03 ? 7 : FCF_Y > 0.01 ? 4 : FCF_Y > 0 ? 1 : 0
  const s_RevGr = RevGr == null ? 0 : RevGr > 0.40 ? 8  : RevGr > 0.20 ? 6 : RevGr > 0.08 ? 3 : RevGr >= 0 ? 1 : 0
  const s_Rev5  = Rev5  == null ? 0 : Rev5  > 0.25 ? 7  : Rev5  > 0.15 ? 5 : Rev5  > 0.08 ? 2 : Rev5  >= 0 ? 1 : 0
  const s_EPS5  = EPS5  == null ? 0 : EPS5  > 0.35 ? 10 : EPS5  > 0.20 ? 7 : EPS5  > 0.10 ? 4 : EPS5  >= 0 ? 1 : 0

  // BLOK C — Sağlamlıq (30 bal)
  const s_CR    = CR    == null ? 0 : CR    > 2.5  ? 6  : CR    > 1.5  ? 5 : CR    > 1.0  ? 3 : CR    > 0.8 ? 1 : 0
  const s_DE    = DE    == null ? 0 : DE    < 0.10 ? 6  : DE    < 0.30 ? 5 : DE    < 0.60 ? 3 : DE    < 1.0 ? 1 : 0
  const s_IntCov= IntCov== null ? 0 : IntCov> 15   ? 10 : IntCov> 8    ? 8 : IntCov> 3    ? 5 : IntCov> 1.5 ? 2 : 0
  const s_AltZ  = AltZ  == null ? 0 : AltZ  > 5    ? 8  : AltZ  > 3    ? 6 : AltZ  > 2.6  ? 4 : AltZ  > 1.8 ? 2 : 0

  // BLOK D — Dəyərləmə (30 bal)
  const s_PEG     = PEG     == null ? 5 : (PEG > 0 && PEG < 0.8) ? 10 : PEG < 1.2 ? 7 : PEG < 2.0 ? 4 : PEG < 3.0 ? 2 : 0
  const s_EVEB    = EVEBITDA== null ? 0 : (EVEBITDA > 0 && EVEBITDA < 12) ? 10 : EVEBITDA < 20 ? 7 : EVEBITDA < 30 ? 4 : EVEBITDA < 50 ? 1 : 0
  const s_PS_Rel  = PS_Rel  == null ? 0 : PS_Rel < -0.20 ? 10 : PS_Rel < 0 ? 7 : PS_Rel < 0.20 ? 4 : PS_Rel < 0.50 ? 1 : 0

  // BLOK E — Katalist/Bazar (15 bal)
  const s_FairVal = FairVal == null ? 0 : FairVal > 0.30 ? 5 : FairVal > 0.10 ? 3 : FairVal > 0 ? 1 : 0
  const s_Analyst = Analyst == null ? 0 : Analyst > 0.30 ? 5 : Analyst > 0.15 ? 4 : Analyst > 0.05 ? 2 : 0
  const s_RSI     = RSI     == null ? 0 : (RSI > 30 && RSI < 50) ? 5 : RSI <= 65 ? 4 : RSI <= 70 ? 2 : 0

  const blockA = s_GM + s_ROE + s_ROIC + s_FCF_M
  const blockB = s_FCF_Y + s_RevGr + s_Rev5 + s_EPS5
  const blockC = s_CR + s_DE + s_IntCov + s_AltZ
  const blockD = s_PEG + s_EVEB + s_PS_Rel
  const blockE = s_FairVal + s_Analyst + s_RSI
  const total  = blockA + blockB + blockC + blockD + blockE

  const riskLabel = getRiskLabel(total, Beta, AltZ, IntCov, GM, RevGr)
  const redFlags  = getRedFlags(m)

  return { ...m, total, blockA, blockB, blockC, blockD, blockE, riskLabel, redFlags }
}

// ── Risk profili ─────────────────────────────────────────────
export type RiskLabel = 'KONSERVATİV' | 'BALANCED' | 'HIGH_RISK' | 'ÇIXART'

export function getRiskLabel(
  total: number,
  beta:   number | null,
  altZ:   number | null,
  intCov: number | null,
  gm:     number | null,
  revGr:  number | null
): RiskLabel {
  if ((gm != null && gm < 0) ||
      (revGr != null && revGr < 0 && altZ != null && altZ < 1.8) ||
      (intCov != null && intCov < 1.5))
    return 'ÇIXART'

  if ((beta == null || beta < 1.5) && total > 90 &&
      (altZ == null || altZ > 2.6) && (intCov == null || intCov > 5))
    return 'KONSERVATİV'

  if ((beta == null || beta <= 2.0) && total > 85 && (revGr == null || revGr > 0.15))
    return 'BALANCED'

  if (total > 70)
    return 'HIGH_RISK'

  return 'ÇIXART'
}

// ── Red flags ────────────────────────────────────────────────
export function getRedFlags(m: RawMetrics): string[] {
  const flags: string[] = []
  if (m.GM    != null && m.GM    < 0)          flags.push('Əsas biznes zərər edir (GM mənfi)')
  if (m.RevGr != null && m.RevGr < 0)          flags.push('Satışlar azalır (RevGr mənfi)')
  if (m.IntCov!= null && m.IntCov < 1.5)       flags.push('Faizlərini ödəyə bilmir (IntCov < 1.5)')
  if (m.AltZ  != null && m.AltZ  < 1.8)        flags.push('Bankrutluq zonası (Altman Z < 1.8)')
  if (m.RSI   != null && m.RSI   > 75)         flags.push('Həddindən artıq alınmış — giriş üçün gözlə (RSI > 75)')
  if (m.Return6M != null && m.Return6M < -0.40) flags.push('Ciddi qiymət zəifliyi (6M < -40%)')
  if (m.ROIC  != null && m.ROIC  < 0)          flags.push('Kapital məhv edir (ROIC mənfi)')
  if (m.FCF_Y != null && m.FCF_Y < 0)          flags.push('Şirkət pul yox, pul yeyir (FCF_Y mənfi)')
  return flags
}

// ── CSV/XLSX sətir massivini parse et ────────────────────────
export function parseScoredStocks(rows: string[][]): ScoredStock[] {
  const headerIdx = findHeaderRow(rows)
  if (headerIdx === -1) return []

  const colMap = buildColMap(rows[headerIdx])
  const results: ScoredStock[] = []

  for (let i = headerIdx + 1; i < rows.length; i++) {
    const row = rows[i]
    if (!row || row.every(c => !c)) continue
    const metrics = parseRow(row, colMap)
    if (!metrics.ticker && !metrics.name) continue
    results.push(scoring(metrics))
  }

  return results.sort((a, b) => b.total - a.total)
}
