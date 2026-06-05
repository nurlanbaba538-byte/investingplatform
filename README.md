# İnvestisiya Tədqiqat Platforması

Şəxsi investisiya tədqiqat dashboardu. Next.js 14 App Router, TypeScript, Tailwind CSS.

## Railway Deploy

### 1. Environment Variables

Railway dashboard → Settings → Variables bölməsinə əlavə et:

```
FMP_API_KEY=<financialmodelingprep.com açarı>
FRED_API_KEY=<fred.stlouisfed.org açarı>
ANTHROPIC_API_KEY=<console.anthropic.com açarı>
NEXT_PUBLIC_BASE_URL=<railway app URL, məs: https://app.up.railway.app>
```

### 2. Deploy

Railway Next.js-i avtomatik aşkar edir. `package.json` skriptlər:
- `build`: `next build`
- `start`: `next start`

`next.config.ts`-də `output: 'standalone'` — Railway üçün optimallaşdırılmışdır.

### 3. API açarları haradan alınır

| Dəyişən | URL | Qeyd |
|---------|-----|------|
| FMP_API_KEY | https://financialmodelingprep.com/developer | Pulsuz: 250 sorğu/gün |
| FRED_API_KEY | https://fred.stlouisfed.org/docs/api/fred/ | Pulsuz, qeydiyyat lazımdır |
| ANTHROPIC_API_KEY | https://console.anthropic.com | Fundamental + Texniki analiz üçün |
| TAVILY_API_KEY | https://tavily.com | Canlı xəbər axtarışı (Makro + Texniki) |

### 4. FMP pulsuz plan

Pulsuz planda işləyənlər: fərdi səhmlər (AAPL, NVDA...), SPY, iqtisadi təqvim.

Premium tələb edənlər: QQQ, RSP, DIA, IWM, XLE, XLK və digər ETF-lər.

## Lokal işlətmək

```bash
npm install
# .env.local faylında API açarlarını daxil et
npm run dev
```

Brauzer: http://localhost:3000
