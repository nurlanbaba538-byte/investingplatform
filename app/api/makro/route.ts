import { getEconCalendar } from '@/lib/fmp'
import { getFredLatest, calcFredYoY } from '@/lib/fred'
import { tavilySearch, type TavilyResult } from '@/lib/tavily'

function today() {
  return new Date().toISOString().split('T')[0]
}
function inDays(n: number) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().split('T')[0]
}

function settled<T>(result: PromiseSettledResult<T>): T | null {
  return result.status === 'fulfilled' ? result.value : null
}

type NewsItem = { title: string; url: string; snippet: string }

function toNewsItems(results: TavilyResult[] | null | undefined): NewsItem[] {
  if (!results?.length) return []
  return results.slice(0, 4).map(r => ({
    title:   r.title,
    url:     r.url,
    snippet: r.content.slice(0, 220),
  }))
}

export async function GET() {
  // FRED + FMP + Tavily hamsını paralel çək
  const [
    dgs10, dgs2, dfii10, dff, sofr,
    t10y2y, t10y3m, dgs30,
    cpiYoY, coreCpiYoY, pceYoY, ppiYoY,
    gdpnow, t5yifr, t10yie, walcl,
    unrate, icsa, jtsjol, hourlyYoY, umcsent, retailYoY,
    mortgage, housingYoY, hyoas, nfci, altsales, sahm,
    calendar,
    newsMarket, newsFed, newsEcon,
  ] = await Promise.allSettled([
    getFredLatest('DGS10'),
    getFredLatest('DGS2'),
    getFredLatest('DFII10'),
    getFredLatest('DFF'),
    getFredLatest('SOFR'),
    getFredLatest('T10Y2Y'),
    getFredLatest('T10Y3M'),
    getFredLatest('DGS30'),
    calcFredYoY('CPIAUCSL'),
    calcFredYoY('CPILFESL'),
    calcFredYoY('PCEPILFE'),
    calcFredYoY('PPIACO'),
    getFredLatest('GDPNOW'),
    getFredLatest('T5YIFR'),
    getFredLatest('T10YIE'),
    getFredLatest('WALCL'),
    getFredLatest('UNRATE'),
    getFredLatest('ICSA'),
    getFredLatest('JTSJOL'),
    calcFredYoY('CES0500000003'),
    getFredLatest('UMCSENT'),
    calcFredYoY('RSAFS'),
    getFredLatest('MORTGAGE30US'),
    calcFredYoY('CSUSHPINSA'),
    getFredLatest('BAMLH0A0HYM2'),
    getFredLatest('NFCI'),
    getFredLatest('ALTSALES'),
    getFredLatest('SAHMREALTIME'),
    getEconCalendar(today(), inDays(3)),
    // Tavily xəbər axtarışları
    tavilySearch('US stock market news today 2026', 4),
    tavilySearch('Federal Reserve interest rate news today 2026', 4),
    tavilySearch('S&P 500 economic data inflation today 2026', 4),
  ])

  const marketNews = toNewsItems(settled(newsMarket)?.results)
  const fedNews    = toNewsItems(settled(newsFed)?.results)
  const econNews   = toNewsItems(settled(newsEcon)?.results)

  // Bütün xəbərləri birləşdir, dublikatları sil
  const allNews = [...marketNews, ...fedNews, ...econNews]
    .filter((item, idx, arr) => arr.findIndex(x => x.url === item.url) === idx)

  return Response.json({
    timestamp: new Date().toISOString(),
    news: {
      market:  marketNews,
      fed:     fedNews,
      econ:    econNews,
      all:     allNews,
      answers: {
        market: settled(newsMarket)?.answer ?? null,
        fed:    settled(newsFed)?.answer    ?? null,
        econ:   settled(newsEcon)?.answer   ?? null,
      },
    },
    rates: {
      dff:    settled(dff),
      sofr:   settled(sofr),
      dfii10: settled(dfii10),
      dgs10:  settled(dgs10),
      dgs2:   settled(dgs2),
      dgs30:  settled(dgs30),
      t10y2y: settled(t10y2y),
      t10y3m: settled(t10y3m),
    },
    inflation: {
      cpiYoY:     settled(cpiYoY),
      coreCpiYoY: settled(coreCpiYoY),
      pceYoY:     settled(pceYoY),
      ppiYoY:     settled(ppiYoY),
      gdpnow:     settled(gdpnow),
      t5yifr:     settled(t5yifr),
      t10yie:     settled(t10yie),
      walcl:      settled(walcl),
    },
    labor: {
      unrate:    settled(unrate),
      icsa:      settled(icsa),
      jtsjol:    settled(jtsjol),
      hourlyYoY: settled(hourlyYoY),
      umcsent:   settled(umcsent),
      retailYoY: settled(retailYoY),
    },
    sector: {
      mortgage:   settled(mortgage),
      housingYoY: settled(housingYoY),
      hyoas:      settled(hyoas),
      nfci:       settled(nfci),
      altsales:   settled(altsales),
    },
    risk: {
      t10y2y: settled(t10y2y),
      t10y3m: settled(t10y3m),
      hyoas:  settled(hyoas),
      sahm:   settled(sahm),
      vix:    null,
    },
    calendar: settled(calendar),
  })
}
