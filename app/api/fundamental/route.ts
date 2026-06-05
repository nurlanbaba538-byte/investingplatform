import { NextRequest } from 'next/server'
import Papa from 'papaparse'
import * as XLSX from 'xlsx'
import { parseScoredStocks, type ScoredStock } from '@/lib/fundamental'

function xlsxToRows(buffer: ArrayBuffer): string[][] {
  const wb = XLSX.read(buffer, { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  return XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as string[][]
}

function csvToRows(text: string): string[][] {
  const result = Papa.parse<string[]>(text, { header: false, skipEmptyLines: false })
  return result.data as string[][]
}

async function callClaude(stocks: ScoredStock[]): Promise<string> {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return ''

  const top20 = stocks.slice(0, 20).map(s => ({
    ticker: s.ticker, name: s.name, total: s.total,
    risk: s.riskLabel, roic: s.ROIC, fcfY: s.FCF_Y,
    revGr: s.RevGr, eps5: s.EPS5, intCov: s.IntCov, peg: s.PEG,
    flags: s.redFlags,
  }))

  const prompt = `Aşağıdakı 150 ballıq fundamental scoring nəticələrinə əsasən Azərbaycanca portfel tövsiyəsi yaz.

Nəticələr: ${JSON.stringify(top20)}

Strukturu belə qur:
1. Ümumi mənzərə (2-3 cümlə)
2. TOP 5 namizəd (hər biri üçün: niyə güclüdür, risk nədir, giriş ağlabatandırmı)
3. Risk qruplarına görə portfel bölgüsü (KONSERVATİV / BALANCED / HIGH_RISK faizləri)
4. Xüsusi diqqət: ən çox red flag olan şirkətlər

Qaydalar:
- "Mütləq al" demə — "güclü namizəd", "diqqətə dəyər" de
- Rəqəmləri izah et (məsələn ROIC 28% nə deməkdir)
- Azərbaycan investoru üçün yazıl (BIST/Nasdaq/NYSE konteksti)
- Maksimum 600 söz`

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': key,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })
    if (!res.ok) return ''
    const data = await res.json()
    return data.content?.[0]?.text ?? ''
  } catch {
    return ''
  }
}

export async function POST(req: NextRequest) {
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    if (!file) return Response.json({ error: 'Fayl tapılmadı' }, { status: 400 })

    const buffer = await file.arrayBuffer()
    let rows: string[][]

    const name = file.name.toLowerCase()
    if (name.endsWith('.xlsx') || name.endsWith('.ods')) {
      rows = xlsxToRows(buffer)
    } else {
      const text = new TextDecoder('utf-8').decode(buffer)
      rows = csvToRows(text)
    }

    const stocks = parseScoredStocks(rows)
    if (stocks.length === 0) {
      return Response.json({ error: 'Heç bir şirkət tapılmadı. investing.com Pro format yoxlayın.' }, { status: 422 })
    }

    const narrative = await callClaude(stocks)

    const groups = {
      konservativ: stocks.filter(s => s.riskLabel === 'KONSERVATİV'),
      balanced:    stocks.filter(s => s.riskLabel === 'BALANCED'),
      highRisk:    stocks.filter(s => s.riskLabel === 'HIGH_RISK'),
      cixart:      stocks.filter(s => s.riskLabel === 'ÇIXART'),
    }

    return Response.json({ stocks, groups, narrative, count: stocks.length })
  } catch (err) {
    console.error('[fundamental/route]', err)
    return Response.json({ error: 'Fayl parse xətası' }, { status: 500 })
  }
}
