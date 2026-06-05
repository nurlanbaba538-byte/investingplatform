@AGENTS.md

# Platform Arxitekturası

## lib/ — Yardımçı kitabxanalar

| Fayl | Məqsəd |
|------|--------|
| `fmp.ts` | Financial Modeling Prep API — səhm kotirovkaları, tarixçə |
| `fred.ts` | FRED API — makroiqtisadi göstəricilər |
| `tavily.ts` | Tavily axtarış — canlı xəbər və analitika |
| `yahoo.ts` | Yahoo Finance canlı — kotirovka, QuickSnapshot data |
| `fundamental.ts` | CSV/XLSX parsing, 150-ballıq scoring, risk profili |
| `calculations.ts` | Texniki göstəricilər — RSI, MACD, Weinstein, VCP, Swing skor |
| `manualData.ts` | Manual daxil edilən KPI, makro başlıqlar, ssenarilər |

## Komponentlər — Data mənbələri

### QuickSnapshot
- Data mənbəyi: **Yahoo Finance canlı** (`lib/yahoo.ts`)
- Real-time kotirovka, gün dəyişimi, həcm

### Manual Data (`lib/manualData.ts`)

| Sahə | Açıqlama | Doldurma |
|------|----------|----------|
| `kpi` | Portfolio KPI-lar (gəlir, drawdown, Sharpe) | Claude API / Yahoo Finance avtomatik |
| `macroHeadline` | Aktual makro başlıq mətni | Claude API / Yahoo Finance avtomatik |
| `scenarios` | Bull / Base / Bear ssenarilər | Claude API / Yahoo Finance avtomatik |
