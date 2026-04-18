/**
 * Topbar
 * Page header with title, subtitle, and wallet connect button.
 */
import React from 'react';
import { useWallet } from '../../context/WalletContext'
import { shortAddress } from '../../utils/format'

const PAGE_META = {
  overview:     { title: 'Overview',         sub: 'Portfolio summary & key metrics' },
  portfolio:    { title: 'Portfolio',         sub: 'Asset breakdown & price chart' },
  transactions: { title: 'Transactions',      sub: 'Recent on-chain activity' },
  tokens:       { title: 'Token Prices',      sub: 'Live market data' },
}

export default function Topbar({ activePage }) {
  const { address, connecting, connect, error } = useWallet()
  const { title, sub } = PAGE_META[activePage] || PAGE_META.overview

  return (
    <header className="flex items-center justify-between px-6 py-4
                        border-b border-white/[0.06] bg-surface-900/60 backdrop-blur
                        sticky top-0 z-30">
      {/* Page title */}
      <div>
        <h1 className="font-display font-bold text-white text-lg leading-tight">{title}</h1>
        <p className="text-slate-500 text-xs font-body mt-0.5">{sub}</p>
      </div>

      {/* Wallet connection */}
      <div className="flex items-center gap-3">
        {error && (
          <p className="text-red-400 text-xs hidden sm:block max-w-48 truncate">{error}</p>
        )}
        {address ? (
          <div className="flex items-center gap-2 bg-surface-700 border border-white/[0.06]
                          rounded-xl px-3 py-1.5">
            {/* Online indicator */}
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse-slow" />
            <span className="font-mono text-xs text-slate-300">{shortAddress(address)}</span>
          </div>
        ) : (
          <button
            onClick={connect}
            disabled={connecting}
            className="btn-primary flex items-center gap-2"
          >
            {connecting ? (
              <>
                <span className="w-3 h-3 border border-white/30 border-t-white rounded-full animate-spin" />
                Connecting…
              </>
            ) : (
              <>
                <span>⬡</span> Connect Wallet
              </>
            )}
          </button>
        )}
      </div>
    </header>
  )
}