import { MANUAL_DATA } from '@/lib/manualData'

type NewsItem = { title: string; url: string; snippet: string }

type Props = {
  news?: {
    all?: NewsItem[]
    answers?: {
      market?: string | null
      fed?:    string | null
      econ?:   string | null
    }
  } | null
  generatedSummary?: string[] | null
}

export default function DayStory({ news, generatedSummary }: Props) {
  const { macroHeadline, macroSummary3 } = MANUAL_DATA
  const summary = generatedSummary ?? macroSummary3
  const hasNews = news?.all && news.all.length > 0
  const answers = news?.answers

  return (
    <div className="space-y-4">
      {/* Manual: 3 cümlə xülasə */}
      <div className="bg-[var(--bg-card)] border border-[var(--border)] border-l-4 border-l-[var(--text-accent)] rounded-lg p-5 space-y-3">
        <h2 className="text-base font-bold text-[var(--text-primary)] font-ui leading-snug">
          {macroHeadline}
        </h2>
        <div className="space-y-2">
          {summary.map((sentence, i) => (
            <p key={i} className="text-sm text-[var(--text-secondary)] font-ui leading-relaxed">
              {sentence}
            </p>
          ))}
        </div>
      </div>

      {/* Tavily AI cavabları */}
      {(answers?.market || answers?.fed || answers?.econ) && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { label: 'Bazar',  text: answers.market, color: 'border-l-[var(--green)]' },
            { label: 'Fed',    text: answers.fed,    color: 'border-l-[var(--amber)]' },
            { label: 'İqtisad', text: answers.econ,  color: 'border-l-[var(--blue)]'  },
          ].filter(x => x.text).map(({ label, text, color }) => (
            <div key={label} className={`bg-[var(--bg-card)] border border-[var(--border)] border-l-4 ${color} rounded-lg p-3`}>
              <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui mb-1">{label}</p>
              <p className="text-xs text-[var(--text-primary)] font-ui leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      )}

      {/* Xəbər siyahısı */}
      {hasNews && (
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
          <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
            <p className="text-[10px] uppercase tracking-widest text-[var(--text-secondary)] font-ui font-semibold">
              Bugünkü Xəbərlər
            </p>
            <span className="text-[10px] text-[var(--green)] font-ui">● Tavily canlı</span>
          </div>
          <div className="divide-y divide-[var(--border)]">
            {news!.all!.slice(0, 8).map((item, i) => (
              <a
                key={i}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2.5 hover:bg-[var(--bg-hover)] transition-colors group"
              >
                <p className="text-xs font-semibold text-[var(--text-primary)] font-ui group-hover:text-[var(--text-accent)] leading-snug">
                  {item.title}
                </p>
                <p className="text-[11px] text-[var(--text-secondary)] font-ui mt-0.5 line-clamp-2 leading-relaxed">
                  {item.snippet}
                </p>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
