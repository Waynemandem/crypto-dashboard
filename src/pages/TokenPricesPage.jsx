/**
 * TokenPricesPage
 * Live token price table with 24h change, auto-refreshes every 60s.
 */
import React from 'react'   
import TokenRow from '../components/dashboard/TokenRow'
import { usePrices } from '../hooks/usePrices'

// All coins we display (even without a connected wallet)
const ALL_COINS = [
  { id: 'ethereum',          symbol: 'ETH' },
  { id: 'usd-coin',          symbol: 'USDC' },
  { id: 'tether',            symbol: 'USDT' },
  { id: 'dai',               symbol: 'DAI' },
  { id: 'uniswap',           symbol: 'UNI' },
  { id: 'wrapped-bitcoin',   symbol: 'WBTC' },
  { id: 'matic-network',     symbol: 'MATIC' },
]

export default function TokenPricesPage() {
  const { prices, loading, error, refetch } = usePrices()

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 md:pb-6 animate-fade-in">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="stat-label mb-1">Live Prices</p>
          <p className="text-white font-display font-semibold">
            {ALL_COINS.length} assets tracked
          </p>
        </div>
        <button onClick={refetch} className="btn-ghost flex items-center gap-2 text-xs">
          <span className={loading ? 'animate-spin inline-block' : ''}>⟳</span>
          Refresh
        </button>
      </div>

      {/* Table header */}
      <div className="card">
        <div className="grid grid-cols-3 px-5 py-3 border-b border-white/[0.06]">
          <span className="stat-label text-[10px]">Asset</span>
          <span className="stat-label text-[10px] text-right">Price (USD)</span>
          <span className="stat-label text-[10px] text-right">24h Change</span>
        </div>

        {error ? (
          <div className="p-10 text-center text-slate-500 text-sm">
            {error}
          </div>
        ) : loading && Object.keys(prices).length === 0 ? (
          <div className="p-4 space-y-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="p-2">
            {ALL_COINS.map(coin => (
              <div key={coin.id} className="grid grid-cols-3 items-center
                                            hover:bg-white/[0.03] rounded-xl transition-colors px-2">
                <div className="col-span-1">
                  <TokenRow
                    coinId={coin.id}
                    priceData={prices[coin.id]}
                  />
                </div>
                {/* Extended columns for price + change separately */}
                <div className="text-right font-mono text-sm text-white pr-4">
                  {prices[coin.id]?.usd != null
                    ? `$${prices[coin.id].usd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 })}`
                    : '—'}
                </div>
                <div className={`text-right font-mono text-sm pr-2
                                 ${(prices[coin.id]?.usd_24h_change ?? 0) >= 0
                                   ? 'text-emerald-400' : 'text-red-400'}`}>
                  {prices[coin.id]?.usd_24h_change != null
                    ? `${prices[coin.id].usd_24h_change >= 0 ? '+' : ''}${prices[coin.id].usd_24h_change.toFixed(2)}%`
                    : '—'}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <p className="text-slate-600 text-xs text-center">
        Prices sourced from CoinGecko · Auto-refreshes every 60s
      </p>
    </div>
  )
}