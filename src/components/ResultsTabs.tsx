import type { ReactNode } from 'react'

export type TabId = 'numerologia' | 'astrologia' | 'sinastria'

interface ResultsTabsProps {
  activeTab: TabId
  onTabChange: (tab: TabId) => void
  children: ReactNode
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'numerologia', label: 'Numerología' },
  { id: 'astrologia', label: 'Astrología' },
  { id: 'sinastria', label: 'Sinastria' },
]

export function ResultsTabs({ activeTab, onTabChange, children }: ResultsTabsProps) {
  return (
    <section className="resultados">
      <div className="tabs">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            className={`tab ${activeTab === id ? 'active' : ''}`}
            onClick={() => onTabChange(id)}
          >
            {label}
          </button>
        ))}
      </div>
      {children}
    </section>
  )
}
