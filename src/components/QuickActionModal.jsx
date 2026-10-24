import { useEffect, useState } from 'react'
import { CalendarDays, HandCoins, X } from 'lucide-react'

export default function QuickActionModal({
  isOpen,
  onClose,
  currentTheme,
}) {
  const [actionType, setActionType] = useState('event')

  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(event) {
      if (event.key === 'Escape') onClose()
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center p-0 sm:items-center sm:p-4">
      <button
        type="button"
        aria-label="Close quick entry"
        onClick={onClose}
        className="absolute inset-0 bg-black/65 backdrop-blur-md"
      />
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-action-title"
        className="relative z-10 w-full max-w-md rounded-t-[28px] border bg-[#16100c]/95 p-5 shadow-2xl backdrop-blur-2xl sm:rounded-[28px]"
        style={{ borderColor: currentTheme?.glassBorder }}
      >
        <header className="mb-5 flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-orange-400">
              Quick Entry
            </p>
            <h2
              id="quick-action-title"
              className="mt-1 text-lg font-bold text-white"
            >
              Add an event or donation
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close quick entry"
            onClick={onClose}
            className="rounded-full border border-white/10 bg-white/5 p-2 text-stone-300 transition hover:text-white"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </header>

        <div className="mb-4 grid grid-cols-2 gap-2">
          <button
            type="button"
            aria-pressed={actionType === 'event'}
            onClick={() => setActionType('event')}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
              actionType === 'event'
                ? 'border-orange-500/40 bg-orange-500/15 text-orange-300'
                : 'border-white/10 bg-white/5 text-stone-400'
            }`}
          >
            <CalendarDays size={16} aria-hidden="true" />
            Event
          </button>
          <button
            type="button"
            aria-pressed={actionType === 'donation'}
            onClick={() => setActionType('donation')}
            className={`flex items-center justify-center gap-2 rounded-xl border p-3 text-sm font-medium transition ${
              actionType === 'donation'
                ? 'border-orange-500/40 bg-orange-500/15 text-orange-300'
                : 'border-white/10 bg-white/5 text-stone-400'
            }`}
          >
            <HandCoins size={16} aria-hidden="true" />
            Donation
          </button>
        </div>

        <form className="space-y-3" onSubmit={(event) => event.preventDefault()}>
          {actionType === 'event' ? (
            <>
              <label className="block space-y-1.5 text-xs text-stone-300">
                Event name
                <input
                  type="text"
                  placeholder="e.g. Sunday Service"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-stone-500"
                />
              </label>
              <label className="block space-y-1.5 text-xs text-stone-300">
                Event date
                <input
                  type="date"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white"
                />
              </label>
            </>
          ) : (
            <>
              <label className="block space-y-1.5 text-xs text-stone-300">
                Donor name
                <input
                  type="text"
                  placeholder="Donor name"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-stone-500"
                />
              </label>
              <label className="block space-y-1.5 text-xs text-stone-300">
                Amount
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  placeholder="0.00"
                  className="w-full rounded-xl border border-white/10 bg-black/20 px-3 py-2.5 text-sm text-white placeholder:text-stone-500"
                />
              </label>
            </>
          )}

          <p className="rounded-xl border border-amber-500/20 bg-amber-500/10 p-3 text-xs leading-relaxed text-amber-200/90">
            Saving is unavailable until the Supabase event and donation table
            schemas are configured.
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-stone-300 transition hover:bg-white/5"
            >
              Close
            </button>
            <button
              type="submit"
              disabled
              className="cursor-not-allowed rounded-xl bg-orange-500/40 px-4 py-3 text-sm font-semibold text-white/60"
            >
              Save unavailable
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
