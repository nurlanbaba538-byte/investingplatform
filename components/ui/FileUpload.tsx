'use client'

import { useRef, useState, DragEvent, ChangeEvent } from 'react'

type Props = {
  onFileSelect: (file: File) => void
  onAnalyze:   () => void
  loading?:    boolean
  selectedFile?: File | null
}

function fmtSize(bytes: number): string {
  if (bytes < 1024)       return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const ACCEPT = '.csv,.xlsx,.ods'
const ACCEPT_TYPES = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.oasis.opendocument.spreadsheet', 'application/octet-stream']

export default function FileUpload({ onFileSelect, onAnalyze, loading, selectedFile }: Props) {
  const inputRef           = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  function handleFile(file: File) {
    onFileSelect(file)
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    setDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }

  function onChange(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div className="space-y-4 max-w-xl">
      {/* Drag-drop zona */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`
          border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${dragging
            ? 'border-[var(--text-accent)] bg-[var(--bg-hover)]'
            : 'border-[var(--border)] bg-[var(--bg-card)] hover:border-[var(--border-active)] hover:bg-[var(--bg-hover)]'
          }
        `}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPT}
          onChange={onChange}
          className="hidden"
        />

        {selectedFile ? (
          <div className="space-y-1">
            <p className="text-2xl">📄</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] font-ui">{selectedFile.name}</p>
            <p className="text-xs text-[var(--text-secondary)] font-ui">{fmtSize(selectedFile.size)}</p>
            <p className="text-[10px] text-[var(--text-accent)] font-ui mt-1">Fərqli fayl seçmək üçün klikləyin</p>
          </div>
        ) : (
          <div className="space-y-2">
            <p className="text-3xl">📂</p>
            <p className="text-sm font-semibold text-[var(--text-primary)] font-ui">
              Fayl seç və ya bura sürüklə
            </p>
            <p className="text-xs text-[var(--text-secondary)] font-ui">
              CSV, XLSX, ODS — investing.com Pro format
            </p>
          </div>
        )}
      </div>

      {/* Analiz et düyməsi */}
      <button
        onClick={onAnalyze}
        disabled={!selectedFile || loading}
        className={`
          w-full py-2.5 px-6 rounded-lg text-sm font-semibold font-ui uppercase tracking-wider transition-colors
          ${selectedFile && !loading
            ? 'bg-[var(--text-accent)] text-[#06080F] hover:opacity-90 cursor-pointer'
            : 'bg-[var(--bg-card-2)] text-[var(--text-secondary)] cursor-not-allowed'
          }
        `}
      >
        {loading ? 'Analiz edilir...' : 'Analiz et'}
      </button>
    </div>
  )
}
