import { type ScoredStock } from '@/lib/fundamental'

type Groups = {
  konservativ: ScoredStock[]
  balanced:    ScoredStock[]
  highRisk:    ScoredStock[]
  cixart:      ScoredStock[]
}

type Props = { groups: Groups }

type GroupDef = {
  key:   keyof Groups
  label: string
  desc:  string
  border: string
  badge:  string
  dot:    string
}

const DEFS: GroupDef[] = [
  { key:'konservativ', label:'KONSERVATİV', desc:'Beta<1.5, Bal>90, AltZ>2.6', border:'border-[var(--green)]',  badge:'bg-[var(--green)] text-[#06080F]',      dot:'bg-[var(--green)]'  },
  { key:'balanced',    label:'BALANCED',    desc:'Beta≤2.0, Bal>85, RevGr>15%', border:'border-[var(--amber)]', badge:'bg-[var(--amber)] text-[#06080F]',      dot:'bg-[var(--amber)]'  },
  { key:'highRisk',    label:'HIGH RISK',   desc:'Bal>70, yüksək volatillik',    border:'border-[var(--red)]',   badge:'bg-[var(--red)] text-white',           dot:'bg-[var(--red)]'    },
  { key:'cixart',      label:'ÇIXART',      desc:'Fundamental xəta var',         border:'border-[var(--border)]',badge:'bg-[var(--bg-card-2)] text-[var(--text-secondary)]', dot:'bg-[var(--text-secondary)]' },
]

export default function RiskGroups({ groups }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
      {DEFS.map(({ key, label, desc, border, badge, dot }) => {
        const list = groups[key]
        return (
          <div key={key} className={`bg-[var(--bg-card)] border ${border} border-t-2 rounded-lg p-4`}>
            <div className="flex items-center gap-2 mb-3">
              <span className={`w-2 h-2 rounded-full shrink-0 ${dot}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded font-ui ${badge}`}>{label}</span>
            </div>
            <p className="text-[10px] text-[var(--text-secondary)] font-ui mb-3">{desc}</p>
            {list.length === 0 ? (
              <p className="text-xs text-[var(--text-secondary)] font-ui italic">Yoxdur</p>
            ) : (
              <div className="space-y-1.5">
                {list.map(s => (
                  <div key={s.ticker} className="flex items-center justify-between">
                    <span className="text-xs font-data text-[var(--text-accent)]">{s.ticker || s.name}</span>
                    <span className="text-xs font-data text-[var(--text-secondary)]">{s.total}/150</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
