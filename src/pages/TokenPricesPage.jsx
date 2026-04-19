import React from 'react'
import { usePrices } from '../hooks/usePrices'
import { formatUSD, changeColor, changeArrow } from '../utils/format'

const ALL_COINS = [
  { id: 'ethereum',          symbol: 'ETH',  name: 'Ethereum'       },
  { id: 'usd-coin',          symbol: 'USDC', name: 'USD Coin'       },
  { id: 'tether',            symbol: 'USDT', name: 'Tether'         },
  { id: 'dai',               symbol: 'DAI',  name: 'Dai'            },
  { id: 'uniswap',           symbol: 'UNI',  name: 'Uniswap'        },
  { id: 'wrapped-bitcoin',   symbol: 'WBTC', name: 'Wrapped Bitcoin' },
  { id: 'matic-network',     symbol: 'MATIC',name: 'Polygon'        },
]

const TOKEN_COLORS = {
  ETH:  '#627eea', USDC: '#2775ca', USDT: '#26a17b',
  DAI:  '#f5ac37', UNI:  '#ff007a', WBTC: '#f7931a', MATIC: '#8247e5',
}

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

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-3 px-5 py-3 border-b border-white/[0.06]">
          <span className="stat-label text-[10px]">Asset</span>
          <span className="stat-label text-[10px] text-right">Price (USD)</span>
          <span className="stat-label text-[10px] text-right">24h Change</span>
        </div>

        {error ? (
          <div className="p-10 text-center text-slate-500 text-sm">{error}</div>
        ) : loading && Object.keys(prices).length === 0 ? (
          <div className="p-4 space-y-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {ALL_COINS.map(coin => {
              const price  = prices[coin.id]?.usd
              const change = prices[coin.id]?.usd_24h_change
              const color  = TOKEN_COLORS[coin.symbol] || '#64748b'

              return (
                <div key={coin.id}
                  className="grid grid-cols-3 items-center px-5 py-4
                             hover:bg-white/[0.03] transition-colors">

                  {/* Asset name */}
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center
                                    text-xs font-bold shrink-0"
                      style={{ backgroundColor: color + '22', border: `1px solid ${color}44` }}>
                      <span style={{ color }}>{coin.symbol.slice(0,2)}</span>
                    </div>
                    <div>
                      <p className="font-display font-semibold text-sm text-white">
                        {coin.symbol}
                      </p>
                      <p className="text-slate-500 text-xs">{coin.name}</p>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right font-mono text-sm text-white">
                    {price != null ? formatUSD(price) : '—'}
                  </div>

                  {/* 24h change */}
                  <div className={`text-right font-mono text-sm font-medium ${changeColor(change)}`}>
                    {change != null
                      ? `${changeArrow(change)} ${Math.abs(change).toFixed(2)}%`
                      : '—'}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <p className="text-slate-600 text-xs text-center">
        Prices sourced from CoinGecko · Auto-refreshes every 60s
      </p>
    </div>
  )
}