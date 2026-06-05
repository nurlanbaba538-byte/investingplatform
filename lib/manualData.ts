export const MANUAL_DATA = {
  updatedAt: '2026-06-05T08:00:00+04:00',

  // === MAKRO ===
  macroHeadline: 'Broadcom 15% çöktü, Dow rekord qırdı — bu gün NFP açıqlanır',

  macroSummary3: [
    'Dünən S&P 500 +0.41% ilə 7,584-ə çatdı, Dow Jones 874 nöqtə artaraq 51,561 ilə rekord qırdı. Broadcom gözləntinin altında qalan gəlir açıqlaması ilə 15% düşdü, çip sektoru investorları texnologiyadan istehlak sektoruna köçdü.',
    'İsrail-Livan atəşkəs razılaşmasından sonra neft qiymətləri geri çəkildi, bu da istehlak sektoruna alış axını gətirdi. Fed hazırda 3.5-3.75% faiz bandında saxlayır — 16-17 İyun FOMC iclasına qədər dəyişiklik gözlənilmir.',
    'Bu gün ən vacib hadisə NFP (Tarım Dışı İstihdam) açıqlamasıdır. Güclü NFP Fed-in faiz endirməsini daha da uzadır; zəif NFP isə bazar üçün ikili siqnal göndərər.',
  ],

  // === 12 KPI ===
  kpi: {
    sp500:       { value: 7556.82,  change: -0.70 },
    nasdaq:      { value: 26853.98, change: -0.89 },
    dowjones:    { value: 50687.07, change: -1.21 },
    treasury10y: { value: 4.46,     change: null  },
    treasury2y:  { value: 4.05,     change: null  },
    dxy:         { value: 99.44,    change: +0.22 },
    vix:         { value: 16.06,    change: +1.84 },
    wti:         { value: 95.03,    change: +1.35 },
    brent:       { value: 96.70,    change: -1.13 },
    gold:        { value: 4494.20,  change: +0.61 },
    bitcoin:     { value: 62737,    change: -5.75 },
    realRate10y: { value: 2.07,     change: null  },
  },

  // === RİSK / FÜRSƏT KARTLARI ===
  risks: [
    {
      type: 'risk' as const,
      title: 'Stagflyasiya qorxusu yenidən səhnədə',
      body: 'Neft yapışqan yüksək qalır, Fed-in əli bağlıdır. Beige Book "inflyasiya artır" dedi — bu, faiz endirməni daha da uzadır.',
      impact: 'İnflyasiya uzun qalsa, hissə bazarı üçün sıxıcı mühit davam edir.',
    },
    {
      type: 'risk' as const,
      title: 'Hürmüz Boğazı — neft şoku riski',
      body: 'Boğaz hala bağlıdır. Hər yeni eskalasiya WTI-ni $100+ aparıb istehlakçı inamını sındıra bilər.',
      impact: 'Neft $100 keçsə, stagflyasiya ssenarisi güclənir, S&P 500 korreksiya ehtimalı artar.',
    },
  ],

  opportunities: [
    {
      type: 'opportunity' as const,
      title: 'Enerji sektoru klassik müdafiə rolundadır',
      body: 'WTI $95 üzərindədir. XLE Stage 2-də, 200GHO-dan +18% yuxarıdadır. Enerji şirkətlərinin FCF gücü güclüdür.',
      impact: 'WTI $95+ saxlandığı müddətcə enerji tərəfi güclü qalır.',
    },
    {
      type: 'opportunity' as const,
      title: 'Qızıl $4,500 həddinə yaxınlaşır',
      body: 'Geopolitik qeyri-müəyyənlik və dollar zəifliyi qızılı dəstəkləyir. GLD Stage 2-də, momentum pozitivdir.',
      impact: 'Risk-off mühit davam edərsə, qızıl portfeli qoruyur.',
    },
  ],

  // === GEOPOLİTİK RADAR ===
  geopolitics: [
    {
      priority: 'YÜKSƏK' as const,
      title: 'Hürmüz Boğazı hala bağlı',
      body: 'İran-ABD gərginliyi çərçivəsində Hürmüz Boğazı kommersiya gəmiçiliyinə bağlıdır. Dünya neft ixracının 20%-i bu yoldan keçir.',
      impact: 'Neft qiyməti yüksək qalır, inflyasiya təzyiqi artır.',
    },
    {
      priority: 'ORTA' as const,
      title: 'Trump yeni tarif mexanizması',
      body: 'Avropadan idxala 15% əlavə tarif açıqlandı. AB cavab tədbirləri hazırlayır. Ticarət müharibəsi riski yenidən gündəmdədir.',
      impact: 'İstehsal xərcləri artar, korporativ margin-lər sıxışar.',
    },
    {
      priority: 'AŞAĞI' as const,
      title: '16–17 İyun FOMC iclası',
      body: 'Fed faizi sabit saxlayacaq. Bazar diqqəti Powellin press konfransındakı tonda olacaq — şahin mi, güvərçin mi?',
      impact: 'Tone dəyişsə, 2Y xəzinə sürətlə hərəkət edə bilər.',
    },
  ],

  // === SSENARİLƏR ===
  scenarios: {
    up: {
      trigger: 'İlk işsizlik müraciəti 230K+, NFP zəif, Fed endirim gözləntiləri canlanır',
      reaction: 'Nasdaq+, Xəzinə gətirilər düşər, dollar zəifləyər',
      watch: '2Y xəzinə, QQQ fyuçersleri',
    },
    neutral: {
      trigger: 'Müraciət 210–220K arası, NFP 150–180K, Fed neytral qalır',
      reaction: 'S&P 500 dar bandda, VIX 14–17 arasında qalır',
      watch: 'VIX 16 ətrafında, DXY sabit',
    },
    down: {
      trigger: 'Müraciət 200K altı + qazanc artımı yüksək + Fed şahin siqnal',
      reaction: '10Y faiz 4.60+, S&P 500 -1.5%+, dollar güclənər',
      watch: 'DXY, 10Y xəzinə, GLD',
    },
  },

  nextFomc: '2026-06-17',
  nextNfp:  '2026-06-05',

  // === BAZAR ANALİZİ ===
  breadthPctAbove50dma: 52,
  naaim:       98.39,
  cnnFearGreed: 54,

  aaii: {
    bull:    null as number | null,
    bear:    null as number | null,
    neutral: null as number | null,
  },

  cboe: {
    totalPC:  0.83,
    equityPC: 0.49,
  },

  earnings: {
    reportedPct:        89,
    beatRate:           84,
    surpriseMagnitude:  18.2,
    blendedGrowth:      28.6,
    forwardPE:          21.2,
    q2Forecast:         19.9,
    q3Forecast:         23.2,
    q4Forecast:         20.7,
    cyForecast:         22.6,
    factsetBeatRate:    84.0,
    lsegBeatRate:       83.1,
    factsetGrowth:      28.6,
    lsegGrowth:         27.8,
  },

  themeCards: [
    {
      signal: 'KƏS',
      title: 'QQQ / QQQE — HƏDDINDƏN ARTIQ ALINMIŞ',
      body: 'QQQ RSI 77.3, QQQE RSI 79.8. QQQ uzun mövqeyinin 20–30%-ni qapat (mənfəət götür), qalanı saxla.',
    },
    {
      signal: 'TUT',
      title: 'XLE / Enerji — MÜDAFİƏ TUTUMU',
      body: 'WTI $95 üzərindədir. XLE Stage 2-də güclüdür. Yeni giriş üçün gözlə, mövcud mövqeyi saxla.',
    },
    {
      signal: 'GÖZLƏ',
      title: 'IWM — BAZA FORMASİYASI',
      body: 'Kiçik kap hissələri hala Stage 1-2 keçid zonasındadır. 200GHO üzərində sabitləşməni gözlə.',
    },
  ],

  opexDates:      ['2026-06-19', '2026-07-17', '2026-08-21', '2026-09-18'],
  tripleWitching: ['2026-06-19', '2026-09-18', '2026-12-18'],
}
