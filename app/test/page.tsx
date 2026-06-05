import KpiCard from '@/components/ui/KpiCard'
import SectionHeader from '@/components/ui/SectionHeader'
import StatusPill from '@/components/ui/StatusPill'
import DataRow from '@/components/ui/DataRow'
import AlertCard from '@/components/ui/AlertCard'
import VerifiedTag from '@/components/ui/VerifiedTag'

export default function TestPage() {
  return (
    <main className="min-h-screen bg-[var(--bg-base)] p-8 space-y-12">

      {/* KpiCard */}
      <section>
        <SectionHeader number="01" title="KPI KARTLARI" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <KpiCard
            label="S&P 500"
            value="5,607.94"
            change={-0.70}
            source="FMP"
            date="4 İyun"
            verified={true}
          />
          <KpiCard
            label="NASDAQ"
            value="17,920.01"
            change={0.89}
            source="FMP"
            date="4 İyun"
          />
          <KpiCard
            label="10Y XƏZİNƏ"
            value="4.43%"
            change={0.12}
            source="FRED"
            date="4 İyun"
            colorOverride="amber"
          />
          <KpiCard
            label="BALTIC DRY"
            value={null}
            verified={false}
            source="Manual"
          />
        </div>
      </section>

      {/* StatusPill */}
      <section>
        <SectionHeader number="02" title="STATUS PILL-LƏR" />
        <div className="flex flex-wrap gap-3">
          <StatusPill label="YEŞİL" variant="green" />
          <StatusPill label="SARI" variant="amber" />
          <StatusPill label="QIRMIZI" variant="red" />
          <StatusPill label="STAGE 1" variant="stage1" />
          <StatusPill label="STAGE 2" variant="stage2" />
          <StatusPill label="STAGE 3" variant="stage3" />
          <StatusPill label="STAGE 4" variant="stage4" />
          <StatusPill label="MÜDAFİƏÇİ" variant="red" />
          <StatusPill label="BULUŞÇU" variant="green" />
        </div>
      </section>

      {/* DataRow */}
      <section>
        <SectionHeader number="03" title="DATA SƏTIRLƏRI" />
        <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 max-w-sm">
          <DataRow label="Fed Funds Rate" value="5.33%" />
          <DataRow label="10Y-2Y Spread" value="-0.42%" accent />
          <DataRow label="VIX" value="13.87" />
          <DataRow label="Növbəti FOMC" value="17 İyun" mono={false} />
          <DataRow label="HY Spread" value="311 bp" accent />
        </div>
      </section>

      {/* AlertCard */}
      <section>
        <SectionHeader number="04" title="ALERT KARTLARI" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
          <AlertCard
            type="risk"
            title="Stagflyasiya qorxusu yenidən səhnədə"
            body="Neft yapışqan yüksək qalır. Fed-in əli bağlı, faiz endirmə gözləntiləri azalır."
            impact="İnflyasiya uzun qalsa, hissə bazarı üçün sıxıcı mühit davam edir."
          />
          <AlertCard
            type="opportunity"
            title="Enerji sektoru klassik müdafiə rolundadır"
            body="WTI $95 üzərindədir. XLE Stage 2-də, 200GHO-dan +18% yuxarıdadır."
            impact="WTI $95+ saxlandığı müddətcə enerji tərəfi güclü qalır."
          />
        </div>
      </section>

      {/* VerifiedTag */}
      <section>
        <SectionHeader number="05" title="VERIFIED TAG" />
        <div className="flex flex-col gap-3 bg-[var(--bg-card)] border border-[var(--border)] rounded-lg p-4 max-w-xs">
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-secondary)]">Doğrulanmış mənbə:</span>
            <VerifiedTag source="FMP" date="4 İyun" rawValue="5607.94" verified={true} />
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-xs text-[var(--text-secondary)]">Yoxlanılmamış:</span>
            <VerifiedTag verified={false} />
          </div>
        </div>
      </section>

    </main>
  )
}
