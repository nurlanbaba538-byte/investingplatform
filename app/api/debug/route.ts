export async function GET() {
  // Açarların mövcudluğunu yoxla (dəyərləri göstərmə)
  const checks = {
    FRED_API_KEY:      !!process.env.FRED_API_KEY,
    FMP_API_KEY:       !!process.env.FMP_API_KEY,
    ANTHROPIC_API_KEY: !!process.env.ANTHROPIC_API_KEY,
    TAVILY_API_KEY:    !!process.env.TAVILY_API_KEY,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL ?? 'NOT SET',
    NODE_ENV: process.env.NODE_ENV,
  }

  // FRED-ə birbaşa test sorğusu
  let fredTest: string
  try {
    const key = process.env.FRED_API_KEY ?? ''
    const res = await fetch(
      `https://api.stlouisfed.org/fred/series/observations?series_id=DFF&api_key=${key}&file_type=json&sort_order=desc&limit=1`,
      { cache: 'no-store' }
    )
    fredTest = res.ok ? `OK (${res.status})` : `FAIL (${res.status})`
  } catch (e) {
    fredTest = `ERROR: ${String(e)}`
  }

  // Tavily test
  let tavilyTest: string
  try {
    const key = process.env.TAVILY_API_KEY ?? ''
    const res = await fetch('https://api.tavily.com/search', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: key, query: 'test', max_results: 1 }),
      cache: 'no-store',
    })
    tavilyTest = res.ok ? `OK (${res.status})` : `FAIL (${res.status})`
  } catch (e) {
    tavilyTest = `ERROR: ${String(e)}`
  }

  return Response.json({ checks, fredTest, tavilyTest })
}
