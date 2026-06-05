'use client'

import { useState, useRef } from 'react'
import SectionHeader   from '@/components/ui/SectionHeader'
import ModeSelector, { type AnalysisMode } from '@/components/texniki/ModeSelector'
import ScoreCard       from '@/components/texniki/ScoreCard'
import PriceStrip      from '@/components/texniki/PriceStrip'
import AnalysisReport  from '@/components/texniki/AnalysisReport'
import { type EightLayerScore, type SwingScore } from '@/lib/calculations'
import { KpiGridSkeleton } from '@/components/ui/Skeleton'
import TradingViewChart   from '@/components/texniki/TradingViewChart'

type QuoteSnap = { price:number; changePercentage:number; yearHigh:number; priceAvg50:number; priceAvg200:number }

type TickerResult = {
  ticker:      string
  swingScore:  SwingScore
  eightLayer:  EightLayerScore
  quote:       QuoteSnap
}

type BatchResult = Array<{ ticker:string; swingScore:SwingScore; eightLayer:EightLayerScore; price:number }>

function parsePriceFromReport(text: string, current: number): { stop:number; entry:number; target1:number; target2?:number } {
  const stopMatch    = text.match(/Stop\s*Loss[^$]*\$?([\d.]+)/i)
  const entryMatch   = text.match(/Giriş[^$]*\$?([\d.]+)/i)
  const target1Match = text.match(/Hədəf\s*1[^$]*\$?([\d.]+)/i)
  const target2Match = text.match(/Hədəf\s*2[^$]*\$?([\d.]+)/i)
  return {
    stop:    parseFloat(stopMatch?.[1]  ?? String(current * 0.93)),
    entry:   parseFloat(entryMatch?.[1] ?? String(current * 1.005)),
    target1: parseFloat(target1Match?.[1] ?? String(current * 1.12)),
    target2: target2Match ? parseFloat(target2Match[1]) : undefined,
  }
}

export default function TexnikiPage() {
  const [mode,        setMode]        = useState<AnalysisMode>('ticker')
  const [tickerInput, setTickerInput] = useState('')
  const [chartFile,   setChartFile]   = useState<File | null>(null)
  const [csvFile,     setCsvFile]     = useState<File | null>(null)
  const [loading,     setLoading]     = useState(false)
  const [reportText,  setReportText]  = useState('')
  const [tickerResult,setTickerResult]= useState<TickerResult | null>(null)
  const [batchResult, setBatchResult] = useState<BatchResult | null>(null)
  const [error,       setError]       = useState<string | null>(null)
  const chartRef = useRef<HTMLInputElement>(null)
  const csvRef   = useRef<HTMLInputElement>(null)

  async function handleAnalyze() {
    setLoading(true); setError(null); setReportText(''); setTickerResult(null); setBatchResult(null)

    try {
      const form = new FormData()
      form.append('mode', mode)

      if (mode === 'chart') {
        if (!chartFile) { setError('Şəkil seçin'); setLoading(false); return }
        form.append('file', chartFile)
      } else if (mode === 'ticker') {
        if (!tickerInput.trim()) { setError('Ticker daxil edin'); setLoading(false); return }
        form.append('tickers', tickerInput.trim())
      } else {
        if (!csvFile) { setError('CSV seçin'); setLoading(false); return }
        form.append('file', csvFile)
      }

      const res = await fetch('/api/texniki', { method:'POST', body:form })
      if (!res.ok) {
        try {
          const errData = await res.json()
          setError(errData.error ?? `Server xətası (${res.status})`)
        } catch {
          setError(`Server xətası (${res.status})`)
        }
        setLoading(false)
        return
      }
      if (!res.body) { setError('Boş cavab'); setLoading(false); return }

      const reader  = res.body.getReader()
      const decoder = new TextDecoder()
      let   buffer  = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        buffer += decoder.decode(value, { stream:true })
        const lines = buffer.split('\n')
        buffer = lines.pop() ?? ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const raw = line.slice(6).trim()
          try {
            const ev = JSON.parse(raw)
            if (ev.type === 'score')      setTickerResult(ev as TickerResult)
            if (ev.type === 'batch')      setBatchResult(ev.scored)
            if (ev.type === 'csv_batch')  setBatchResult(ev.scored)
            if (ev.text)                  setReportText(prev => prev + ev.text)
            if (ev.error)                 setError(ev.error)
          } catch { /* skip */ }
        }
      }
    } catch {
      setError('Şəbəkə xətası')
    } finally {
      setLoading(false)
    }
  }

  const prices = tickerResult && reportText
    ? parsePriceFromReport(reportText, tickerResult.quote.price)
    : null

  const canSubmit = (mode === 'ticker' && tickerInput.trim()) ||
                    (mode === 'chart'  && chartFile) ||
                    (mode === 'csv'    && csvFile)

  return (
    <div className="space-y-8 pb-12">

      {/* Başlıq */}
      <div className="space-y-1 pt-2">
        <p className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-ui">
          TEXNİKİ ANALİZ · SWING TRADE
        </p>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-ui">
          8 Qatlı Analiz · 0-24 Skor
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-ui">
          Weinstein Stage · VCP · İnstitusional İz · Momentum
        </p>
      </div>

      {/* Mod seçimi */}
      <section>
        <SectionHeader number="01" title="ANALİZ MODU" />
        <ModeSelector selected={mode} onChange={(m) => { setMode(m); setError(null) }} />
      </section>

      {/* Input */}
      <section>
        <SectionHeader number="02" title="INPUT" />

        {mode === 'ticker' && (
          <div className="space-y-3 max-w-md">
            <input
              type="text"
              placeholder="NVDA, AAPL, MSFT — vergüllə ayırın"
              value={tickerInput}
              onChange={e => setTickerInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && canSubmit && !loading && handleAnalyze()}
              className="w-full bg-[var(--bg-card)] border border-[var(--border)] focus:border-[var(--text-accent)] rounded-lg px-4 py-2.5 text-sm font-data text-[var(--text-primary)] outline-none transition-colors placeholder:text-[var(--text-secondary)]"
            />
            <p className="text-[10px] text-[var(--text-secondary)] font-ui">
              Tək ticker → tam analiz · Çoxlu → skor cədvəli
            </p>
          </div>
        )}

        {mode === 'chart' && (
          <div className="space-y-3">
            <div
              onClick={() => chartRef.current?.click()}
              className={`max-w-md border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${chartFile ? 'border-[var(--text-accent)] bg-[var(--bg-hover)]' : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-active)]'}`}
            >
              <input ref={chartRef} type="file" accept=".jpg,.jpeg,.png,.webp" onChange={e => setChartFile(e.target.files?.[0] ?? null)} className="hidden" />
              {chartFile ? (
                <div><p className="text-sm font-semibold text-[var(--text-accent)] font-ui">{chartFile.name}</p><p className="text-xs text-[var(--text-secondary)] mt-1">Fərqli seçmək üçün klikləyin</p></div>
              ) : (
                <div><p className="text-2xl mb-2">📊</p><p className="text-sm text-[var(--text-primary)] font-ui">Chart şəkli yüklə (JPG/PNG)</p><p className="text-xs text-[var(--text-secondary)] mt-1">Claude şəkli görüb analiz edəcək</p></div>
              )}
            </div>
          </div>
        )}

        {mode === 'csv' && (
          <div className="space-y-3">
            <div
              onClick={() => csvRef.current?.click()}
              className={`max-w-md border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${csvFile ? 'border-[var(--text-accent)] bg-[var(--bg-hover)]' : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-active)]'}`}
            >
              <input ref={csvRef} type="file" accept=".csv" onChange={e => setCsvFile(e.target.files?.[0] ?? null)} className="hidden" />
              {csvFile ? (
                <div><p className="text-sm font-semibold text-[var(--text-accent)] font-ui">{csvFile.name}</p><p className="text-xs text-[var(--text-secondary)] mt-1">Fərqli seçmək üçün klikləyin</p></div>
              ) : (
                <div><p className="text-2xl mb-2">📋</p><p className="text-sm text-[var(--text-primary)] font-ui">investing.com texniki CSV yüklə</p><p className="text-xs text-[var(--text-secondary)] mt-1">Sütunlar: Ticker, Price, SMA50, SMA200, RSI</p></div>
              )}
            </div>
          </div>
        )}

        {/* Analiz et düyməsi */}
        <button
          onClick={handleAnalyze}
          disabled={!canSubmit || loading}
          className={`mt-4 px-6 py-2.5 rounded-lg text-sm font-semibold font-ui uppercase tracking-wider transition-colors ${canSubmit && !loading ? 'bg-[var(--text-accent)] text-[#06080F] hover:opacity-90 cursor-pointer' : 'bg-[var(--bg-card-2)] text-[var(--text-secondary)] cursor-not-allowed'}`}
        >
          {loading ? 'Analiz aparılır...' : 'Analiz et'}
        </button>

        {error && (
          <div className="mt-3 bg-[var(--bg-card)] border-l-4 border-l-[var(--red)] border border-[var(--border)] rounded-lg p-3">
            <p className="text-xs text-[var(--red)] font-ui">⚠ {error}</p>
          </div>
        )}
      </section>

      {/* Nəticələr */}
      {(tickerResult || batchResult || reportText || loading) && (
        <section>
          <SectionHeader number="03" title="NƏTİCƏ" />
          {loading && !tickerResult && !reportText && <KpiGridSkeleton count={6} />}

          {/* Tək ticker: TradingView chart */}
          {tickerResult && (
            <div className="mb-4">
              <TradingViewChart ticker={tickerResult.ticker} height={460} />
            </div>
          )}

          {/* Tək ticker: ScoreCard + PriceStrip yan-yana */}
          {tickerResult && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <ScoreCard
                data={tickerResult.eightLayer}
                ticker={tickerResult.ticker}
                swingTotal={tickerResult.swingScore.total}
              />
              {prices && (
                <PriceStrip
                  current={tickerResult.quote.price}
                  stop={prices.stop}
                  entry={prices.entry}
                  target1={prices.target1}
                  target2={prices.target2}
                />
              )}
            </div>
          )}

          {/* Batch: TOP 1 ticker üçün chart */}
          {batchResult && !tickerResult && batchResult.length > 0 && (
            <div className="mb-4">
              <TradingViewChart ticker={batchResult[0].ticker} height={400} />
            </div>
          )}

          {/* Batch: mini cədvəl */}
          {batchResult && !tickerResult && (
            <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-x-auto mb-4">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-[var(--border)]">
                    {['Ticker','Qiymət','Swing /100','8-Qat /24','Status'].map(h=>(
                      <th key={h} className="px-3 py-2 text-left text-[10px] uppercase tracking-wider text-[var(--text-secondary)] font-ui">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {batchResult.map(d=>(
                    <tr key={d.ticker} className="border-b border-[var(--border)] last:border-0 hover:bg-[var(--bg-hover)]">
                      <td className="px-3 py-2 font-data text-[var(--text-accent)] font-semibold">{d.ticker}</td>
                      <td className="px-3 py-2 font-data">${typeof d.price === 'number' ? d.price.toFixed(2) : d.price}</td>
                      <td className="px-3 py-2 font-data">{d.swingScore.total}</td>
                      <td className="px-3 py-2 font-data">{d.eightLayer.total}</td>
                      <td className="px-3 py-2">
                        <span className={`text-[10px] font-bold font-ui px-2 py-0.5 rounded uppercase ${
                          d.eightLayer.label === 'GÜCLÜ' ? 'bg-[var(--green)] text-[#06080F]' :
                          d.eightLayer.label === 'İZLƏ'  ? 'bg-[var(--amber)] text-[#06080F]' :
                          d.eightLayer.label === 'GÖZLƏ' ? 'bg-[#f97316] text-white' :
                          'bg-[var(--red)] text-white'
                        }`}>{d.eightLayer.label}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Analiz mətni */}
          <AnalysisReport text={reportText} loading={loading} />
        </section>
      )}

    </div>
  )
}
