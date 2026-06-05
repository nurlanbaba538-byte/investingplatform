'use client'

import { useState } from 'react'
import SectionHeader  from '@/components/ui/SectionHeader'
import FileUpload     from '@/components/ui/FileUpload'
import ScoreTable     from '@/components/fundamental/ScoreTable'
import RiskGroups     from '@/components/fundamental/RiskGroups'
import RedFlagList    from '@/components/fundamental/RedFlagList'
import { type ScoredStock } from '@/lib/fundamental'
import { SectionSkeleton } from '@/components/ui/Skeleton'

type Groups = {
  konservativ: ScoredStock[]
  balanced:    ScoredStock[]
  highRisk:    ScoredStock[]
  cixart:      ScoredStock[]
}

type Result = {
  stocks:    ScoredStock[]
  groups:    Groups
  narrative: string
  count:     number
}

export default function FundamentalPage() {
  const [file,      setFile]      = useState<File | null>(null)
  const [loading,   setLoading]   = useState(false)
  const [result,    setResult]    = useState<Result | null>(null)
  const [error,     setError]     = useState<string | null>(null)

  async function handleAnalyze() {
    if (!file) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const form = new FormData()
      form.append('file', file)

      const res = await fetch('/api/fundamental', { method: 'POST', body: form })
      const data = await res.json()

      if (!res.ok || data.error) {
        setError(data.error ?? 'Xəta baş verdi')
        return
      }
      setResult(data)
    } catch {
      setError('Şəbəkə xətası — yenidən cəhd edin')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-10 pb-12">

      {/* Başlıq */}
      <div className="space-y-1 pt-2">
        <p className="text-[11px] uppercase tracking-widest text-[var(--text-secondary)] font-ui">
          FUNDAMENTAL ANALİZ · 150 BALLIQ SKORİNG
        </p>
        <h1 className="text-xl font-bold text-[var(--text-primary)] font-ui">
          investing.com Pro → CSV/XLSX yüklə
        </h1>
        <p className="text-xs text-[var(--text-secondary)] font-ui">
          20 metrik · BLOK A-E · Risk profili · Claude narrativi
        </p>
      </div>

      {/* Upload bölməsi */}
      <section>
        <SectionHeader number="01" title="FAYL YÜKLƏ" />
        <FileUpload
          selectedFile={file}
          onFileSelect={setFile}
          onAnalyze={handleAnalyze}
          loading={loading}
        />
        {error && (
          <div className="mt-3 bg-[var(--bg-card)] border border-[var(--red)] border-l-4 border-l-[var(--red)] rounded-lg p-3">
            <p className="text-xs text-[var(--red)] font-ui">⚠ {error}</p>
          </div>
        )}
      </section>

      {/* Loading */}
      {loading && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 text-sm text-[var(--text-secondary)] font-ui">
            <span className="animate-spin inline-block">⟳</span>
            <span>Fayl parse edilir, scoring hesablanır, Claude analizi hazırlanır...</span>
          </div>
          <SectionSkeleton rows={4} />
        </div>
      )}

      {/* Nəticələr */}
      {result && (
        <>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[var(--green)] font-ui">
              ✓ {result.count} şirkət analiz edildi
            </span>
          </div>

          {/* Skor cədvəli */}
          <section>
            <SectionHeader number="02" title="İCAL CƏDVƏLİ" />
            <ScoreTable stocks={result.stocks} />
          </section>

          {/* Risk qrupları */}
          <section>
            <SectionHeader number="03" title="RİSK QRUPLARI" />
            <RiskGroups groups={result.groups} />
          </section>

          {/* Red flags */}
          {result.stocks.some(s => s.redFlags.length > 0) && (
            <section>
              <SectionHeader number="04" title="XƏBƏRDARLIQLar" />
              <RedFlagList stocks={result.stocks} />
            </section>
          )}

          {/* Claude narrativi */}
          {result.narrative && (
            <section>
              <SectionHeader number="05" title="CLAUDE PORTFELİ TÖVSİYƏSİ" />
              <div className="bg-[var(--bg-card)] border border-[var(--border)] border-l-4 border-l-[var(--text-accent)] rounded-lg p-5">
                <div className="prose prose-sm max-w-none text-[var(--text-secondary)] font-ui leading-relaxed whitespace-pre-wrap text-xs">
                  {result.narrative}
                </div>
              </div>
            </section>
          )}
        </>
      )}

    </div>
  )
}
