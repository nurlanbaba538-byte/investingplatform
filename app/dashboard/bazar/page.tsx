import SectionHeader  from '@/components/ui/SectionHeader'
import ErrorBanner    from '@/components/ui/ErrorBanner'
import HealthGauge    from '@/components/bazar/HealthGauge'
import PillarRow      from '@/components/bazar/PillarRow'
import ThemeCards     from '@/components/bazar/ThemeCards'
import IndexCards     from '@/components/bazar/IndexCards'
import SectorTable    from '@/components/bazar/SectorTable'
import BreadthPanel   from '@/components/bazar/BreadthPanel'
import EarningsPanel  from '@/components/bazar/EarningsPanel'
import RiskOnOff      from '@/components/bazar/RiskOnOff'
import SentimentPanel from '@/components/bazar/SentimentPanel'
import { MANUAL_DATA } from '@/lib/manualData'

// ── Static mock fallbacks ─────────────────────────────────────
const MOCK_INDICES = [
  { ticker:'SPY',  name:'SPDR S&P 500',          price:562.45, change:-3.94, changePct:-0.70, sma50:530.12, sma200:510.87, rsi:65.2, macdHist:0.34,  yearHigh:613.23, stage:2 as const, stageQual:'GÜCLÜ',    action:'Trend möhkəmdir.' },
  { ticker:'RSP',  name:'Invesco S&P 500 Equal',  price:175.30, change:-1.22, changePct:-0.69, sma50:164.50, sma200:158.20, rsi:63.8, macdHist:0.21,  yearHigh:185.10, stage:2 as const, stageQual:'GÜCLÜ',    action:'Geniş bazar sağlam.' },
  { ticker:'QQQ',  name:'Invesco Nasdaq 100',     price:471.20, change:-4.21, changePct:-0.89, sma50:434.10, sma200:408.60, rsi:77.3, macdHist:0.58,  yearHigh:503.50, stage:2 as const, stageQual:'EKSTREMİ', action:'RSI 77 — 20-30% qapat.' },
  { ticker:'QQQE', name:'Direxion NASDAQ-100 EW', price:93.40,  change:-0.84, changePct:-0.89, sma50:86.20,  sma200:81.40,  rsi:79.8, macdHist:0.44,  yearHigh:99.80,  stage:2 as const, stageQual:'EKSTREMİ', action:'Kəs və gözlə.' },
  { ticker:'DIA',  name:'SPDR Dow Jones',         price:414.50, change:-5.09, changePct:-1.21, sma50:395.30, sma200:385.70, rsi:58.4, macdHist:0.12,  yearHigh:450.20, stage:2 as const, stageQual:'GÜCLÜ',    action:'Baza sağlam.' },
  { ticker:'IWM',  name:'iShares Russell 2000',   price:198.30, change:-1.39, changePct:-0.70, sma50:195.10, sma200:190.40, rsi:52.1, macdHist:0.08,  yearHigh:228.60, stage:1 as const, stageQual:'BAZA',     action:'Stage 1/2 keçid — gözlə.' },
]

const SECTOR_NAMES: Record<string, string> = {
  SMH:'VanEck Yarıiletkenler', IGV:'iShares Proqram', XBI:'SPDR Biotexnologiya',
  XLE:'SPDR Enerji', XLF:'SPDR Maliyyə', ITB:'iShares Tikinti',
  XLK:'Texnologiya', XLY:'İstehlak Discr.', XLP:'İstehlak Staples',
  XLV:'Sağlamlıq', XLI:'Sənaye', XLB:'Materiallar', XLC:'Kommunikasiya',
  XLU:'Kommunal', XLRE:'Daşınmaz Əmlak',
}

const MOCK_SECTORS = [
  { ticker:'SMH', name:SECTOR_NAMES.SMH, price:237.80, changePct:0.90,  sma50pct:29.2,  sma200pct:62.8,  stage:2 as const, signal:'AL' },
  { ticker:'IGV', name:SECTOR_NAMES.IGV, price:100.20, changePct:-4.33, sma50pct:15.5,  sma200pct:1.4,   stage:2 as const, signal:'QADAĞAN' },
  { ticker:'XBI', name:SECTOR_NAMES.XBI, price:88.40,  changePct:-0.45, sma50pct:-2.1,  sma200pct:-8.4,  stage:4 as const, signal:'QADAĞAN' },
  { ticker:'XLE', name:SECTOR_NAMES.XLE, price:94.30,  changePct:1.35,  sma50pct:8.4,   sma200pct:18.2,  stage:2 as const, signal:'TUT' },
  { ticker:'XLF', name:SECTOR_NAMES.XLF, price:44.80,  changePct:-0.50, sma50pct:5.2,   sma200pct:12.1,  stage:2 as const, signal:'TUT' },
  { ticker:'ITB', name:SECTOR_NAMES.ITB, price:88.10,  changePct:-1.20, sma50pct:-1.8,  sma200pct:3.4,   stage:1 as const, signal:'GÖZLƏ' },
]

const MOCK_SECTOR_RS = [
  { ticker:'XLK', name:SECTOR_NAMES.XLK, mansfield:22.4,  dailyPct:-1.20 },
  { ticker:'XLE', name:SECTOR_NAMES.XLE, mansfield:18.2,  dailyPct:1.35  },
  { ticker:'XLF', name:SECTOR_NAMES.XLF, mansfield:12.1,  dailyPct:-0.50 },
  { ticker:'XLI', name:SECTOR_NAMES.XLI, mansfield:8.4,   dailyPct:-0.31 },
  { ticker:'XLY', name:SECTOR_NAMES.XLY, mansfield:6.2,   dailyPct:-0.88 },
  { ticker:'XLC', name:SECTOR_NAMES.XLC, mansfield:5.8,   dailyPct:-0.72 },
  { ticker:'XLB', name:SECTOR_NAMES.XLB, mansfield:2.1,   dailyPct:0.18  },
  { ticker:'XLP', name:SECTOR_NAMES.XLP, mansfield:-1.4,  dailyPct:-0.22 },
  { ticker:'XLV', name:SECTOR_NAMES.XLV, mansfield:-3.2,  dailyPct:-0.44 },
  { ticker:'XLRE',name:SECTOR_NAMES.XLRE,mansfield:-8.7,  dailyPct:-1.10 },
  { ticker:'XLU', name:SECTOR_NAMES.XLU, mansfield:-11.3, dailyPct:-0.65 },
]

const MOCK_PILLARS = [
  { label:'TREND',    score:82, note:'SPY/QQQ/DIA SMA üstündə' },
  { label:'MOMENT',   score:62, note:'QQQ RSI 77 — alınmış' },
  { label:'GENİŞLİK', score:50, note:'S&P 52% >50GHO' },
  { label:'QAZANC',   score:92, note:'Beat rate 84%, +28.6%' },
  { label:'SEKTOR',   score:65, note:'7/11 sektor Stage 2' },
  { label:'SENTMENT', score:55, note:'NAAIM 98 — kontrarian' },
  { label:'OPEX',     score: 0, note:'Opex günü — T-0' },
]

const RATIOS = [
  { label:'XLK/XLP (Tech vs Staples)',      value:'3.82',  signal:'on'      as const },
  { label:'SMH/SPY (Yarıiletken vs S&P)',   value:'0.422', signal:'on'      as const },
  { label:'HYG/TLT (HY vs Uzun Xəzinə)',   value:'0.531', signal:'neutral' as const },
  { label:'GLD (Qızıl)',                    value:'Stage 2, SMA üstündə', signal:'off' as const },
  { label:'XLY/XLP (Discret. vs Staples)', value:'2.14',  signal:'on'      as const },
  { label:'SPHB/SPLV (Yüksək β / Aşağı β)',value:'—',    signal:'neutral' as const },
]

const VIX_TERMS = [
  { label:'VIX9D', value:14.82 },
  { label:'VIX',   value:16.06 },
  { label:'VIX3M', value:18.40 },
  { label:'VVIX',  value:97.4  },
]

const SENT_ROWS = [
  { label:'CNN Qorxu & Açgözlülük', value:'54',   level:'amber' as const, note:'Neytral zona',           verified:true  },
  { label:'AAII Öküz %',           value:null,    level:'amber' as const, note:'Cümə yenilənir',          verified:false },
  { label:'AAII Ayı %',            value:null,    level:'amber' as const, note:'Cümə yenilənir',          verified:false },
  { label:'NAAIM Mövqeyi',         value:'98.39', level:'red'   as const, note:'⚠ Kontrarian — >90',      verified:true  },
  { label:'Ümumi Put/Call',         value:'0.83',  level:'green' as const, note:'Normal (~1.0)',           verified:true  },
  { label:'Equity Put/Call',        value:'0.49',  level:'red'   as const, note:'⚠ <0.5 — call dominant',  verified:true  },
  { label:'VVIX',                   value:'97.4',  level:'green' as const, note:'100 altı normal',         verified:true  },
]

// ── Data fetch ────────────────────────────────────────────────
async function getBazarData() {
  try {
    const base = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res  = await fetch(`${base}/api/bazar`, { next: { revalidate: 3600 } })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

const PILLAR_LABELS = ['TREND','MOMENT','GENİŞLİK','QAZANC','SEKTOR','SENTMENT','OPEX']
const PILLAR_NOTES  = [
  'İndeks SMA analizi','QQQ RSI momentumu','S&P genişlik',
  'Qazanc mövsümü','Sektor Stage','Sentiment','OPEX effekti',
]

// Siqnal helper
function sectorSignal(stage: number, sma50pct: number): string {
  if (stage === 4) return 'QADAĞAN'
  if (stage === 2 && sma50pct > 20) return 'AL'
  if (stage === 2) return 'TUT'
  if (stage === 1) return 'GÖZLƏ'
  return 'KƏS'
}

export default async function BazarPage() {
  const api = await getBazarData()

  // Tiker-by-tiker merge: real data varsa istifadə et, yoxdursa mock götür
  type ApiIdx = { ticker:string; price:number; change:number; changePct:number; sma50:number|null; sma200:number|null; rsi:number|null; macdHist:number|null; yearHigh:number; stage:1|2|3|4; stageQual:string }
  const apiIdxMap: Record<string, ApiIdx> = {}
  ;(api?.indices ?? []).filter(Boolean).forEach((d: ApiIdx) => { apiIdxMap[d.ticker] = d })

  const indices = MOCK_INDICES.map(mock => {
    const live = apiIdxMap[mock.ticker]
    if (!live) return { ...mock, _live: false }
    return {
      ticker:    live.ticker,
      name:      mock.name,
      price:     live.price,
      change:    live.change,
      changePct: live.changePct,
      sma50:     live.sma50  ?? mock.sma50,
      sma200:    live.sma200 ?? mock.sma200,
      rsi:       live.rsi    ?? mock.rsi,
      macdHist:  live.macdHist ?? mock.macdHist,
      yearHigh:  live.yearHigh,
      stage:     live.stage,
      stageQual: live.stageQual,
      action:    mock.action,
      _live:     true,
    }
  })

  type ApiSector = { ticker:string; price:number; changePct:number; sma50pct:number|null; sma200pct:number; stage:1|2|3|4 }
  const apiSecMap: Record<string, ApiSector> = {}
  ;(api?.sectors ?? []).filter(Boolean).forEach((d: ApiSector) => { apiSecMap[d.ticker] = d })

  const sectors = MOCK_SECTORS.map(mock => {
    const live = apiSecMap[mock.ticker]
    if (!live) return mock
    return {
      ticker:    live.ticker,
      name:      mock.name,
      price:     live.price,
      changePct: live.changePct,
      sma50pct:  live.sma50pct ?? mock.sma50pct,
      sma200pct: live.sma200pct,
      stage:     live.stage,
      signal:    sectorSignal(live.stage, live.sma50pct ?? mock.sma50pct),
    }
  })

  // Sektor RS
  const sectorRS = (api?.sectorRS ?? []).filter(Boolean).length > 0
    ? (api.sectorRS as Array<{ticker:string;mansfield:number;dailyPct:number}>)
        .map(d => ({ ...d, name: SECTOR_NAMES[d.ticker] ?? d.ticker }))
    : MOCK_SECTOR_RS

  // Pillars + health score
  const apiPillars  = api?.pillars
  const healthScore: number = api?.healthScore ?? 67

  const pillars = apiPillars
    ? Object.entries(apiPillars).map(([key, score], i) => ({
        label: PILLAR_LABELS[i] ?? key.toUpperCase(),
        score: Math.round(score as number),
        note:  PILLAR_NOTES[i] ?? '',
      }))
    : MOCK_PILLARS

  // RS ratios — enrich with real data if available
  const ratios = RATIOS.map(r => {
    if (r.label.startsWith('XLK/XLP') && api?.ratioData?.xlkXlp != null) {
      return { ...r, value: (api.ratioData.xlkXlp as number).toFixed(3) }
    }
    if (r.label.startsWith('XLY/XLP') && api?.ratioData?.xlySpl != null) {
      return { ...r, value: (api.ratioData.xlySpl as number).toFixed(3) }
    }
    return r
  })

  const isLive = !!api
  const today  = new Date().toLocaleDateString('az-AZ', {
    day:'numeric', month:'long', year:'numeric', timeZone:'Asia/Baku',
  })

  return (
    <div className="space-y-10 pb-12">

      {/* Başlıq */}
      <div className="space-y-1 pt-2">
        <p className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-ui">
          BAZAR ANALİZİ · ABD İNDEKS VƏ ETF TEXNİKİ ANALİZİ
        </p>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-ui">
          Səhər brifinqi — {today}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-ui">
          Əvvəlki bağlanış əsasında · Data: FMP API · Bakı vaxtı (UTC+4)
          {isLive && <span className="ml-2 text-[var(--green)]">● canlı data</span>}
        </p>
      </div>
      {!isLive && <ErrorBanner />}

      {/* Panel 01 */}
      <section>
        <SectionHeader number="01" title="BAZAR SAĞLAMLIĞ SKORU — 7 PILLƏR" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-1">
            <HealthGauge score={healthScore} />
          </div>
          <div className="lg:col-span-2">
            <PillarRow pillars={pillars} />
          </div>
        </div>
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: Skor {healthScore} — {healthScore >= 71 ? 'Buluşçu zona.' : healthScore >= 51 ? 'Ehtiyatlı zona.' : 'Müdafiəçi zona.'} NAAIM yüksək, kontrarian diqqət.
          </p>
        </div>
      </section>

      {/* Panel 02 */}
      <section>
        <SectionHeader number="02" title="BU GÜNÜN MÖVZUSU — FƏALİYYƏT KARTLARI" />
        <ThemeCards cards={MANUAL_DATA.themeCards} />
      </section>

      {/* Panel 03 */}
      <section>
        <SectionHeader number="03" title="ƏSAS İNDEKS KARTLARI" />
        <IndexCards indices={indices} />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: QQQ/QQQE RSI həddindən artıqdır. SPY/DIA güclüdür. IWM hala Stage 1.
          </p>
        </div>
      </section>

      {/* Panel 04 */}
      <section>
        <SectionHeader number="04" title="SEKTOR ETF CƏDVƏLİ" />
        <SectorTable rows={sectors} />
      </section>

      {/* Panel 05 */}
      <section>
        <SectionHeader number="05" title="BAZAR DAXİLİ SAĞLAMLIĞ — GENİŞLİK" />
        <BreadthPanel
          pctAbove50dma={MANUAL_DATA.breadthPctAbove50dma}
          naaim={MANUAL_DATA.naaim}
          rspSpyRs={null}
          qqqeQqqRs={null}
        />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: 52% genişlik — orta zona. NAAIM 98.39 kontrarian siqnaldır.
          </p>
        </div>
      </section>

      {/* Panel 06 */}
      <section>
        <SectionHeader number="06" title="QAZANC MÖVSÜMİ" />
        <EarningsPanel data={MANUAL_DATA.earnings} />
      </section>

      {/* Panel 07 */}
      <section>
        <SectionHeader number="07" title="RISK-ON/OFF TERMOMETRİ + SEKTOR LİDERLİYİ" />
        <RiskOnOff ratios={ratios} sectorRS={sectorRS} />
      </section>

      {/* Panel 08 */}
      <section>
        <SectionHeader number="08" title="VOLATİLLİK VƏ SENTIMENT" />
        <SentimentPanel vixTerms={VIX_TERMS} sentRows={SENT_ROWS} />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: VIX kontangodadır — sakit. Equity P/C 0.49 — kontrarian risk var.
          </p>
        </div>
      </section>

    </div>
  )
}
