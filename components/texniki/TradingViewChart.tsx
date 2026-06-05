'use client'

import { useEffect, useRef } from 'react'

type Props = {
  ticker:   string
  height?:  number
  interval?: '1' | '5' | '15' | '30' | '60' | '240' | 'D' | 'W'
}

// TradingView locale "az" dəstəklənmir — "en" istifadə olunur
const LOCALE    = 'en'
const TIMEZONE  = 'Asia/Baku'

declare global {
  interface Window {
    TradingView?: {
      widget: new (config: Record<string, unknown>) => void
    }
  }
}

export default function TradingViewChart({ ticker, height = 480, interval = 'D' }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const widgetRef    = useRef<string>('')

  useEffect(() => {
    if (!containerRef.current) return

    const containerId = `tv_${ticker.replace(/[^a-zA-Z0-9]/g, '_')}_${Date.now()}`
    widgetRef.current = containerId
    containerRef.current.id = containerId

    const script = document.createElement('script')
    script.src   = 'https://s3.tradingview.com/tv.js'
    script.async = true
    script.onload = () => {
      if (!window.TradingView) return
      new window.TradingView.widget({
        container_id:      containerId,
        width:             '100%',
        height,
        symbol:            ticker,
        interval,
        timezone:          TIMEZONE,
        theme:             'dark',
        style:             '1',         // şam çırağı
        locale:            LOCALE,
        toolbar_bg:        '#0C1018',   // --bg-card
        gridColor:         'rgba(30, 45, 61, 0.6)',
        enable_publishing: false,
        hide_top_toolbar:  false,
        hide_legend:       false,
        save_image:        false,
        studies: [
          'MASimple@tv-basicstudies',   // SMA 50
          'MASimple@tv-basicstudies',   // SMA 200
          'Volume@tv-basicstudies',
        ],
        overrides: {
          'mainSeriesProperties.candleStyle.upColor':          '#22D3EE',
          'mainSeriesProperties.candleStyle.downColor':        '#F43F5E',
          'mainSeriesProperties.candleStyle.borderUpColor':    '#22D3EE',
          'mainSeriesProperties.candleStyle.borderDownColor':  '#F43F5E',
          'mainSeriesProperties.candleStyle.wickUpColor':      '#22D3EE',
          'mainSeriesProperties.candleStyle.wickDownColor':    '#F43F5E',
          'paneProperties.background':                         '#06080F',
          'paneProperties.backgroundType':                     'solid',
          'paneProperties.vertGridProperties.color':           '#1E2D3D',
          'paneProperties.horzGridProperties.color':           '#1E2D3D',
          'scalesProperties.textColor':                        '#64748B',
          'scalesProperties.backgroundColor':                  '#0C1018',
        },
      })
    }
    document.head.appendChild(script)

    return () => {
      // Cleanup: script + container məzmununu sil
      if (script.parentNode) script.parentNode.removeChild(script)
      if (containerRef.current) containerRef.current.innerHTML = ''
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ticker, interval])

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border)] rounded-lg overflow-hidden">
      <div className="px-4 py-2.5 border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-xs font-semibold font-data text-[var(--text-accent)] uppercase tracking-wider">
          {ticker}
        </span>
        <span className="text-[10px] text-[var(--text-secondary)] font-ui">
          TradingView · {TIMEZONE}
        </span>
      </div>
      <div ref={containerRef} style={{ height }} />
    </div>
  )
}
