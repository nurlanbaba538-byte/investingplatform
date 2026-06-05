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

async function getMakroData() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? 'http://localhost:3000'
    const res = await fetch(`${baseUrl}/api/makro`, {
      next: { revalidate: 3600 },
    })
    if (!res.ok) return null
    return res.json()
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
        <QuickSnapshot apiData={api?.kpi ?? null} ratesData={api?.rates ?? null} />
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
