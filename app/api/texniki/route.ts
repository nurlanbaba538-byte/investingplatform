import { NextRequest } from 'next/server'
import Papa from 'papaparse'
import { getQuote, getHistoricalPrices } from '@/lib/fmp'
import { calcRSI, calcMACDHist, calcVCP, calc8LayerScore, calcSwingScore } from '@/lib/calculations'
import { tavilySearch, summarizeResults } from '@/lib/tavily'

const SYSTEM_PROMPT = `Sən Stan Weinstein Stage analizi, VCP pattern, institusional iz izləmə, opsion axını, momentum analizi aparan swing trade ekspertisən.

QAYDALAR:
- 8 qatlı analiz apar, hər qat 0-3 xal (cəmi 0-24)
- Azərbaycanca yaz, bütün terminləri sadə dildə izah et
- Stop loss HƏMİŞƏ göstər (texniki səviyyə əsaslı)
- R/R < 1:2 olarsa swing kimi tövsiyə etmə
- Qazanc açıqlaması 7 gündən az qalıbsa — "QAZANC RİSKİ" xəbərdarlığı ver
- Mövqe ölçüsü: portfelin 3-5%-i (standart swing)
- "Mütləq al" demə — "güclü namizəd", "diqqətə dəyər" de

FORMAT:
## [Ticker] — Swing Trade Analizi

**Ümumi Qiymətləndirmə:** X/24 — [GÜCLÜ/İZLƏ/GÖZLƏ/DEYİL]

### 8 Qat Analizi
| Qat | Xal | Qeyd |
|-----|-----|------|
| Weinstein Stage | X/3 | ... |
| VCP Pattern | X/3 | ... |
| İnstitusional İz | X/3 | ... |
| Bazar/Sektor | X/3 | ... |
| Opsion Axını | X/3 | ... |
| Momentum | X/3 | ... |
| Dəstək/Müqavimət | X/3 | ... |
| Katalizator | X/3 | ... |

### Ticarət Parametrləri
- **Giriş:** $XX.XX
- **Stop Loss:** $XX.XX (−X%)
- **Hədəf 1:** $XX.XX (+X%)
- **Hədəf 2:** $XX.XX (+X%)
- **R/R nisbəti:** 1:X.X
- **Mövqe ölçüsü:** portfelin 3-5%-i

### Niyə?
[2-3 cümlə əsas səbəb]

### Risklər
[Əsas risklər]`

async function streamClaude(prompt: string, imageBase64?: string): Promise<ReadableStream> {
  const key = process.env.ANTHROPIC_API_KEY ?? ''

  const content: unknown[] = imageBase64
    ? [
        { type: 'image', source: { type: 'base64', media_type: 'image/jpeg', data: imageBase64 } },
        { type: 'text', text: prompt },
      ]
    : [{ type: 'text', text: prompt }]

  const encoder = new TextEncoder()
  return new ReadableStream({
    async start(controller) {
      try {
        const res = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': key,
            'anthropic-version': '2023-06-01',
            'anthropic-beta': 'messages-2023-12-15',
          },
          body: JSON.stringify({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 2000,
            system: SYSTEM_PROMPT,
            stream: true,
            messages: [{ role: 'user', content }],
          }),
        })

        if (!res.ok || !res.body) {
          controller.enqueue(encoder.encode('data: {"error":"Claude API xətası"}\n\n'))
          controller.close()
          return
        }

        const reader = res.body.getReader()
        const dec    = new TextDecoder()

        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          const chunk = dec.decode(value)
          for (const line of chunk.split('\n')) {
            if (!line.startsWith('data: ')) continue
            const raw = line.slice(6).trim()
            if (raw === '[DONE]') continue
            try {
              const ev = JSON.parse(raw)
              if (ev.type === 'content_block_delta' && ev.delta?.text) {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify({ text: ev.delta.text })}\n\n`))
              }
            } catch { /* skip malformed */ }
          }
        }
      } catch (e) {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ error: String(e) })}\n\n`))
      } finally {
        controller.close()
      }
    },
  })
}

// ── MOD 2: ticker data çəkmə ──────────────────────────────────
async function fetchTickerForSwing(ticker: string) {
  const [quoteRes, histRes] = await Promise.allSettled([
    getQuote(ticker),
    getHistoricalPrices(ticker, 260),
  ])

  const q    = quoteRes.status  === 'fulfilled' ? quoteRes.value  : null
  const hist = histRes.status   === 'fulfilled' ? histRes.value   : null

  if (!q) return null

  const sorted  = hist ? [...hist].sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime()) : []
  const closes  = sorted.map(d => d.close)

  const sma50   = q.priceAvg50  ?? closes.slice(0,50).reduce((s,v)=>s+v,0)/Math.min(50,closes.length)
  const sma200  = q.priceAvg200 ?? closes.slice(0,200).reduce((s,v)=>s+v,0)/Math.min(200,closes.length)
  const sma20   = closes.length >= 20 ? closes.slice(0,20).reduce((s,v)=>s+v,0)/20 : q.price

  const prevSma200 = sorted.length >= 201
    ? sorted.slice(1,201).map(d=>d.close).reduce((s,v)=>s+v,0)/200
    : sma200 * 0.999

  const rsi         = calcRSI(closes, 14) ?? 50
  const macdResult  = calcMACDHist(closes)
  const macdHist    = macdResult?.macdHist     ?? 0
  const prevMacdHist= macdResult?.prevMacdHist ?? 0

  const ohlcv90 = sorted.slice(0,90).map(d => ({
    open:d.open, high:d.high, low:d.low, close:d.close, volume:d.volume
  }))
  const vcpScore = calcVCP(ohlcv90)

  const avgVol20 = sorted.length >= 20
    ? sorted.slice(0,20).reduce((s,d)=>s+d.volume,0)/20
    : q.volume ?? sorted[0]?.volume ?? 1

  const swingScore = calcSwingScore({
    price:q.price, sma20, sma50, sma200, rsi, macdHistogram:macdHist,
    macdHistogramPrev:prevMacdHist, volume:sorted[0]?.volume??0, avgVolume20:avgVol20,
    yearHigh:q.yearHigh, ohlcv90,
  })

  const eightLayer = calc8LayerScore({
    price:q.price, sma50, sma200, prevSma200,
    rsi, macdHist, prevMacdHist,
    vcpScore, volume:sorted[0]?.volume??0, avgVolume20:avgVol20,
    yearHigh:q.yearHigh,
  })

  return { ticker, quote:q, sma20, sma50, sma200, rsi, macdHist, vcpScore, swingScore, eightLayer, ohlcv90 }
}

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const mode = form.get('mode') as string

  // ── MOD 1: Chart ──────────────────────────────────────────
  if (mode === 'chart') {
    const file = form.get('file') as File | null
    if (!file) return Response.json({ error: 'Şəkil tapılmadı' }, { status: 400 })
    const buf   = await file.arrayBuffer()
    const b64   = Buffer.from(buf).toString('base64')
    const prompt = 'Bu chart şəklini swing trade perspektivindən analiz et. 8 qatlı analiz apar.'
    const stream = await streamClaude(prompt, b64)
    return new Response(stream, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
  }

  // ── MOD 2: Ticker ─────────────────────────────────────────
  if (mode === 'ticker') {
    const tickers = (form.get('tickers') as string ?? '').split(',').map(t=>t.trim().toUpperCase()).filter(Boolean)
    if (!tickers.length) return Response.json({ error: 'Ticker daxil edin' }, { status: 400 })

    const isSingle = tickers.length === 1

    if (isSingle) {
      const ticker0 = tickers[0]
      const [data, newsRes] = await Promise.all([
        fetchTickerForSwing(ticker0),
        tavilySearch(`${ticker0} stock news recent 2026`, 4),
      ])
      if (!data) return Response.json({ error: `${ticker0} üçün data tapılmadı` }, { status: 404 })

      const { quote: q, sma20, sma50, sma200, rsi, macdHist, vcpScore, swingScore, eightLayer } = data
      const newsSummary = newsRes?.results?.length
        ? `\nSON XƏBƏRLƏR:\n${summarizeResults(newsRes.results, 4)}`
        : ''

      const prompt = `Ticker: ${ticker0}
Qiymət: $${q.price} (${q.changePercentage >= 0 ? '+' : ''}${q.changePercentage.toFixed(2)}%)
SMA20: ${sma20.toFixed(2)}, SMA50: ${sma50.toFixed(2)}, SMA200: ${sma200.toFixed(2)}
RSI(14): ${rsi.toFixed(1)}
MACD Histogram: ${macdHist.toFixed(3)}
VCP Score: ${vcpScore}/20
52H Zirvə: $${q.yearHigh}
Swing Skor (0-100): ${swingScore.total}
8-Qat Skor (0-24): ${eightLayer.total} — ${eightLayer.label}
Qat detalları: ${eightLayer.layers.map(l=>`${l.name}:${l.score}/3`).join(', ')}${newsSummary}

Yuxarıdakı texniki data VƏ son xəbərləri nəzərə alaraq swing trade analizi apar.`

      const stream = await streamClaude(prompt)
      // Əvvəl skor datanı göndər, sonra stream
      const encoder = new TextEncoder()
      const scoreJson = JSON.stringify({ type:'score', swingScore, eightLayer, quote:q })
      const scoreChunk = `data: ${scoreJson}\n\n`

      const combined = new ReadableStream({
        async start(controller) {
          controller.enqueue(encoder.encode(scoreChunk))
          const reader = stream.getReader()
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            controller.enqueue(value)
          }
          controller.close()
        }
      })
      return new Response(combined, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
    }

    // Batch: çoxlu ticker
    const [results, batchNews] = await Promise.all([
      Promise.allSettled(tickers.map(t => fetchTickerForSwing(t))),
      tavilySearch(`${tickers.slice(0,3).join(' ')} stock market news 2026`, 3),
    ])
    const scored = results
      .map((r) => r.status === 'fulfilled' ? r.value : null)
      .filter(Boolean)

    const batchNewsSummary = batchNews?.results?.length
      ? `\nBAZAR XƏBƏRLƏRİ:\n${summarizeResults(batchNews.results, 3)}`
      : ''

    const prompt = `${tickers.length} ticker üçün swing analizi:
${scored.map(d => `${d!.ticker}: Qiymət $${d!.quote.price}, Swing ${d!.swingScore.total}/100, 8-Qat ${d!.eightLayer.total}/24 (${d!.eightLayer.label}), RSI ${d!.rsi.toFixed(0)}, SMA200-dən ${(((d!.quote.price - d!.sma200) / d!.sma200)*100).toFixed(1)}%`).join('\n')}${batchNewsSummary}

Ümumi bazar konteksti 2 cümlə. TOP 3 üçün mini analiz. Ən pis 2 üçün "niyə yox" qeydi.`

    const encoder2 = new TextEncoder()
    const batchJson = JSON.stringify({ type:'batch', scored: scored.map(d => ({ ticker:d!.ticker, swingScore:d!.swingScore, eightLayer:d!.eightLayer, price:d!.quote.price })) })
    const stream2 = await streamClaude(prompt)

    const combined2 = new ReadableStream({
      async start(controller) {
        controller.enqueue(encoder2.encode(`data: ${batchJson}\n\n`))
        const reader = stream2.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }
        controller.close()
      }
    })
    return new Response(combined2, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
  }

  // ── MOD 3: CSV ────────────────────────────────────────────
  if (mode === 'csv') {
    const file = form.get('file') as File | null
    if (!file) return Response.json({ error: 'CSV tapılmadı' }, { status: 400 })
    const text   = new TextDecoder().decode(await file.arrayBuffer())
    const parsed = Papa.parse<Record<string,string>>(text, { header:true, skipEmptyLines:true })
    const rows   = parsed.data

    if (!rows.length) {
      return Response.json({ error: 'CSV boşdur və ya oxunmadı' }, { status: 422 })
    }

    const headers = Object.keys(rows[0] ?? {})

    // Hər sütun üçün çoxlu ad variantları
    function findCol(candidates: string[]): string | undefined {
      return candidates.find(c => headers.some(h => h.trim().toLowerCase() === c.toLowerCase()))
        ?? candidates.find(c => headers.some(h => h.trim().toLowerCase().includes(c.toLowerCase())))
    }
    function getVal(row: Record<string,string>, col: string | undefined): string {
      if (!col) return ''
      const key = headers.find(h => h.trim().toLowerCase() === col.toLowerCase())
             ?? headers.find(h => h.trim().toLowerCase().includes(col.toLowerCase()))
      return key ? (row[key] ?? '') : ''
    }

    const tickerCol = findCol(['Ticker','Symbol','ticker','symbol','Name','Semvol','Stock'])
    const priceCol  = findCol(['Price','price','Close','close','Last','Last Price','Son Qiymət'])
    const rsiCol    = findCol(['RSI','RSI (14)','rsi','Relative Strength Index (14d)'])
    const sma50Col  = findCol(['SMA50','SMA 50','SMA(50)','sma50','50 SMA','MA50'])
    const sma200Col = findCol(['SMA200','SMA 200','SMA(200)','sma200','200 SMA','MA200'])
    const volumeCol = findCol(['Volume','volume','Vol'])

    if (!tickerCol) {
      return Response.json({
        error: `Ticker sütunu tapılmadı. CSV başlıqları: ${headers.slice(0,8).join(', ')}`,
      }, { status: 422 })
    }

    const scored = rows.map(row => {
      const ticker = getVal(row, tickerCol).trim().replace(/"/g,'')
      const rawPrice = getVal(row, priceCol).replace(/[,$\s]/g,'')
      const price  = priceCol ? parseFloat(rawPrice) : 0
      const rsi    = rsiCol   ? parseFloat(getVal(row, rsiCol))    : 50
      const sma50  = sma50Col ? parseFloat(getVal(row, sma50Col))  : price
      const sma200 = sma200Col? parseFloat(getVal(row, sma200Col)) : price
      const vol    = volumeCol? parseFloat(getVal(row, volumeCol)) : 1
      if (!ticker || isNaN(price) || price === 0) return null

      const swingScore = calcSwingScore({
        price, sma20:sma50, sma50, sma200, rsi, macdHistogram:0, macdHistogramPrev:0,
        volume: isNaN(vol) ? 1 : vol,
        avgVolume20: isNaN(vol) ? 1 : vol,
        yearHigh: price * 1.1,
        ohlcv90: [],
      })
      return { ticker, price, rsi, sma50, sma200, swingScore }
    }).filter(Boolean)

    if (!scored.length) return Response.json({ error: 'CSV-dən heç bir ticker oxunmadı' }, { status: 422 })

    const isSingle = scored.length === 1
    const prompt = isSingle
      ? `Ticker: ${scored[0]!.ticker}, Qiymət: $${scored[0]!.price}, RSI: ${scored[0]!.rsi}, Skor: ${scored[0]!.swingScore.total}/100. CSV datası əsasında swing analizi apar.`
      : `${scored.length} ticker CSV analizi:
${scored.map(d => `${d!.ticker}: $${d!.price}, RSI ${d!.rsi?.toFixed(0)}, Skor ${d!.swingScore.total}/100`).join('\n')}
TOP 3 xülasə + ən pis 2 "niyə yox".`

    const enc3 = new TextEncoder()
    const batchData3 = JSON.stringify({ type:'csv_batch', scored })
    const stream3 = await streamClaude(prompt)

    const combined3 = new ReadableStream({
      async start(controller) {
        controller.enqueue(enc3.encode(`data: ${batchData3}\n\n`))
        const reader = stream3.getReader()
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          controller.enqueue(value)
        }
        controller.close()
      }
    })
    return new Response(combined3, { headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache' } })
  }

  return Response.json({ error: 'Naməlum mod' }, { status: 400 })
}
