import SectionHeader  from '@/components/ui/SectionHeader'
import ErrorBanner    from '@/components/ui/ErrorBanner'
import QuickSnapshot  from '@/components/makro/QuickSnapshot'
import DayStory       from '@/components/makro/DayStory'
import GeoRadar       from '@/components/makro/GeoRadar'
import EconCalendar   from '@/components/makro/EconCalendar'
import Scenarios      from '@/components/makro/Scenarios'
import RatePanel      from '@/components/makro/RatePanel'
import InflationPanel from '@/components/makro/InflationPanel'
import LaborPanel     from '@/components/makro/LaborPanel'
import SectorHealth   from '@/components/makro/SectorHealth'
import RiskPanel      from '@/components/makro/RiskPanel'
import { MANUAL_DATA } from '@/lib/manualData'
import { getFredLatest, calcFredYoY } from '@/lib/fred'
import { getEconCalendar } from '@/lib/fmp'
import { tavilySearch, type TavilyResult } from '@/lib/tavily'

function toNewsItems(results: TavilyResult[] | null | undefined) {
  return (results ?? []).slice(0, 4).map(r => ({
    title: r.title, url: r.url, snippet: r.content.slice(0, 220),
  }))
}

async function getMakroData() {
  try {
    const todayStr = new Date().toISOString().split('T')[0]
    const in3Days  = new Date(Date.now() + 3*86400000).toISOString().split('T')[0]

    const [
      dgs10, dgs2, dfii10, dff, sofr, t10y2y, t10y3m, dgs30,
      cpiYoY, coreCpiYoY, pceYoY, ppiYoY, gdpnow, t5yifr, t10yie, walcl,
      unrate, icsa, jtsjol, hourlyYoY, umcsent, retailYoY,
      mortgage, housingYoY, hyoas, nfci, altsales, sahm,
      calendar, newsMarket, newsFed, newsEcon,
    ] = await Promise.allSettled([
      getFredLatest('DGS10'), getFredLatest('DGS2'), getFredLatest('DFII10'),
      getFredLatest('DFF'),   getFredLatest('SOFR'),  getFredLatest('T10Y2Y'),
      getFredLatest('T10Y3M'),getFredLatest('DGS30'),
      calcFredYoY('CPIAUCSL'), calcFredYoY('CPILFESL'), calcFredYoY('PCEPILFE'),
      calcFredYoY('PPIACO'),   getFredLatest('GDPNOW'), getFredLatest('T5YIFR'),
      getFredLatest('T10YIE'), getFredLatest('WALCL'),
      getFredLatest('UNRATE'), getFredLatest('ICSA'),   getFredLatest('JTSJOL'),
      calcFredYoY('CES0500000003'), getFredLatest('UMCSENT'), calcFredYoY('RSAFS'),
      getFredLatest('MORTGAGE30US'), calcFredYoY('CSUSHPINSA'),
      getFredLatest('BAMLH0A0HYM2'), getFredLatest('NFCI'),
      getFredLatest('ALTSALES'), getFredLatest('SAHMREALTIME'),
      getEconCalendar(todayStr, in3Days),
      tavilySearch('US stock market news today 2026', 4),
      tavilySearch('Federal Reserve interest rate news today 2026', 4),
      tavilySearch('S&P 500 economic data inflation today 2026', 4),
    ])

    function s<T>(r: PromiseSettledResult<T>): T | null {
      return r.status === 'fulfilled' ? r.value : null
    }

    const marketNews = toNewsItems(s(newsMarket)?.results)
    const fedNews    = toNewsItems(s(newsFed)?.results)
    const econNews   = toNewsItems(s(newsEcon)?.results)
    const allNews    = [...marketNews, ...fedNews, ...econNews]
      .filter((x, i, a) => a.findIndex(y => y.url === x.url) === i)

    return {
      news: {
        market: marketNews, fed: fedNews, econ: econNews, all: allNews,
        answers: {
          market: s(newsMarket)?.answer ?? null,
          fed:    s(newsFed)?.answer    ?? null,
          econ:   s(newsEcon)?.answer   ?? null,
        },
      },
      rates: {
        dff: s(dff), sofr: s(sofr), dfii10: s(dfii10),
        dgs10: s(dgs10), dgs2: s(dgs2), dgs30: s(dgs30),
        t10y2y: s(t10y2y), t10y3m: s(t10y3m),
      },
      inflation: {
        cpiYoY: s(cpiYoY), coreCpiYoY: s(coreCpiYoY),
        pceYoY: s(pceYoY), ppiYoY: s(ppiYoY),
        gdpnow: s(gdpnow), t5yifr: s(t5yifr),
        t10yie: s(t10yie), walcl: s(walcl),
      },
      labor: {
        unrate: s(unrate), icsa: s(icsa), jtsjol: s(jtsjol),
        hourlyYoY: s(hourlyYoY), umcsent: s(umcsent), retailYoY: s(retailYoY),
      },
      sector: {
        mortgage: s(mortgage), housingYoY: s(housingYoY),
        hyoas: s(hyoas), nfci: s(nfci), altsales: s(altsales),
      },
      risk: {
        t10y2y: s(t10y2y), t10y3m: s(t10y3m),
        hyoas: s(hyoas), sahm: s(sahm), vix: null,
      },
      calendar: s(calendar),
    }
  } catch {
    return null
  }
}

export default async function MakroPage() {
  const api = await getMakroData()

  const today = new Date().toLocaleDateString('az-AZ', {
    day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Baku',
  })

  return (
    <div className="space-y-10 pb-12">

      {/* Başlıq */}
      <div className="space-y-1 pt-2">
        <p className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-ui">
          GÜNDƏLİK MAKRO PANO · ABD İQTİSADİYYATI
        </p>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-ui leading-snug">
          {MANUAL_DATA.macroHeadline}
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-ui">
          {today} · Bakı vaxtı (UTC+4) · Data: FMP + FRED
        </p>
      </div>

      {!api && <ErrorBanner />}

      {/* 3 cümlə xülasə + Tavily xəbərləri */}
      <DayStory news={api?.news ?? null} />

      {/* Panel 01 */}
      <section>
        <SectionHeader number="01" title="SÜRƏTLİ BAXIŞ" />
        <QuickSnapshot apiData={null} ratesData={api?.rates ?? null} />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: Risk iştahı zəifdir — VIX sakit, amma indekslər düşüşdədir. Hürmüz + tarif qorxusu dominantdır.
          </p>
        </div>
      </section>

      {/* Panel 02 */}
      <section>
        <SectionHeader number="02" title="RİSK VƏ FÜRSƏT · GEOPOLİTİK RADAR" />
        <GeoRadar />
      </section>

      {/* Panel 03 */}
      <section>
        <SectionHeader number="03" title="BUGÜNKİ TƏQVİM" />
        <EconCalendar />
      </section>

      {/* Panel 04 */}
      <section>
        <SectionHeader number="04" title="ƏGƏR BU OLARSA... SSENARİLƏR" />
        <Scenarios />
      </section>

      {/* Panel 05 */}
      <section>
        <SectionHeader number="05" title="FAİZ VƏ DOLLAR PANELİ" />
        <RatePanel apiData={api?.rates ?? null} />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: Əyri hala tərsinədir. Fed hərəkətsiz qalır.
          </p>
        </div>
      </section>

      {/* Panel 06 */}
      <section>
        <SectionHeader number="06" title="İNFLYASİYA VƏ BÖYÜMƏ" />
        <InflationPanel apiData={api?.inflation ?? null} />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: CPI hala 3%-dən yuxarıdır. Fed-in 2% hədəfindən uzaqdır.
          </p>
        </div>
      </section>

      {/* Panel 07 */}
      <section>
        <SectionHeader number="07" title="İŞGÜCÜ VƏ İSTEHLAKÇI" />
        <LaborPanel apiData={api?.labor ?? null} />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: NFP açıqlanır — bu rəqəm hər şeyi dəyişə bilər.
          </p>
        </div>
      </section>

      {/* Panel 08 */}
      <section>
        <SectionHeader number="08" title="SEKTORAL SAĞLAMLIĞ" />
        <SectorHealth apiData={api?.sector ?? null} />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: İpoteka yüksəkdir, daşınmaz əmlak sıxışır. HY spreadi hala sağlam zonada.
          </p>
        </div>
      </section>

      {/* Panel 09 */}
      <section>
        <SectionHeader number="09" title="RİSK VƏ RESESSIYA ALARMI" />
        <RiskPanel apiData={api?.risk ?? null} />
        <div className="mt-3 border-l-2 border-[var(--text-accent)] pl-3">
          <p className="text-xs italic text-[var(--text-secondary)] font-ui">
            Yəni: Əyri tərsinədir — diqqət zonasında. Amma VIX sakit, kredit spreadi sağlam.
          </p>
        </div>
      </section>

    </div>
  )
}
