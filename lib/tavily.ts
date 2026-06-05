const TAVILY_BASE = 'https://api.tavily.com/search'

function apiKey() {
  return process.env.TAVILY_API_KEY ?? ''
}

export type TavilyResult = {
  title:   string
  url:     string
  content: string
  score:   number
}

export type TavilyResponse = {
  query:   string
  results: TavilyResult[]
  answer?: string
}

export async function tavilySearch(
  query:      string,
  maxResults: number = 5,
  searchDepth: 'basic' | 'advanced' = 'basic'
): Promise<TavilyResponse | null> {
  const key = apiKey()
  if (!key) return null

  try {
    const res = await fetch(TAVILY_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key:      key,
        query,
        search_depth: searchDepth,
        max_results:  maxResults,
        include_answer: true,
      }),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Nəticəni xülasə mətnə çevir
export function summarizeResults(results: TavilyResult[], maxItems = 3): string {
  return results
    .slice(0, maxItems)
    .map(r => `• ${r.title}: ${r.content.slice(0, 200)}`)
    .join('\n')
}
