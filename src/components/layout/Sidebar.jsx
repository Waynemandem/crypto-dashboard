/**
 * Sidebar
 * Left navigation panel with logo, nav links, and wallet info.
 * Collapses to a bottom bar on mobile.
 */
import React from 'react'
import { useWallet } from '../../context/WalletContext'
import { shortAddress } from '../../utils/format'

const NAV_ITEMS = [
  { id: 'overview',     label: 'Overview',     icon: '◈' },
  { id: 'portfolio',    label: 'Portfolio',     icon: '◎' },
  { id: 'transactions', label: 'Transactions',  icon: '⟳' },
  { id: 'tokens',       label: 'Token Prices',  icon: '◐' },
]

export default function Sidebar({ activePage, setActivePage }) {
  const { address, darkMode, toggleDarkMode, disconnect } = useWallet()

  return (
    <>
      {/* ── Desktop sidebar ── */}
      <aside className="hidden md:flex flex-col w-60 shrink-0 h-screen sticky top-0
                   bg-surface-800 dark:bg-surface-800 border-r border-white/[0.06]
                   dark:border-white/[0.06] px-3 py-5
                   [html:not(.dark)_&]:bg-white [html:not(.dark)_&]:border-slate-200">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-3 mb-8">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center
                          shadow-[0_0_20px_-2px] shadow-brand-500/60">
            <span className="text-white font-display font-bold text-sm">C</span>
          </div>
          <span className="font-display font-bold text-white text-lg tracking-tight">
            CryptoLens
          </span>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 flex-1">
          <p className="stat-label px-3 mb-2">Navigation</p>
          {NAV_ITEMS.map(item => (
            <button
              key={item.id}
              onClick={() => setActivePage(item.id)}
              className={activePage === item.id ? 'nav-item-active' : 'nav-item'}
            >
              <span className="text-base w-5 text-center">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="flex flex-col gap-2 border-t border-white/[0.06] pt-4 mt-4">
          {/* Dark mode toggle */}
          <button onClick={toggleDarkMode} className="nav-item w-full">
            <span className="text-base w-5 text-center">{darkMode ? '☀' : '☾'}</span>
            {darkMode ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Connected wallet address */}
          {address && (
            <div className="flex items-center justify-between bg-surface-900/60 dark:bg-surface-900/60 rounded-xl px-3 py-2 mt-1">
              <div>
                <p className="stat-label text-[10px]">Connected</p>
                <p className="font-mono text-xs text-slate-300">{shortAddress(address)}</p>
              </div>
              <button
                onClick={disconnect}
                className="text-slate-500 hover:text-red-400 transition-colors text-xs"
                title="Disconnect"
              >
                ✕
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* ── Mobile bottom nav ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50
                       bg-surface-800/95 backdrop-blur border-t border-white/[0.06]
                       flex items-center justify-around px-2 py-2">
        {NAV_ITEMS.map(item => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-xl
                        text-xs font-display font-medium transition-colors
                        ${activePage === item.id
                          ? 'text-brand-400'
                          : 'text-slate-500 hover:text-slate-300'}`}
          >
            <span className="text-lg leading-none">{item.icon}</span>
            <span>{item.label.split(' ')[0]}</span>
          </button>
        ))}
      </nav>
    </>
  )
}