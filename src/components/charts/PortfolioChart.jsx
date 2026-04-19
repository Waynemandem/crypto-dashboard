/**
 * PortfolioChart
 * Area chart showing ETH price history over 7 or 30 days.
 * Uses Recharts with a custom dark theme.
 */
import React, { useState } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'
import { usePriceHistory } from '../../hooks/usePriceHistory'
import { formatUSD } from '../../utils/format'

const RANGES = [
  { label: '7D',  days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
]

// Custom tooltip bubble
function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="stat-label text-[10px] mb-1">{label}</p>
      <p className="font-mono text-sm text-white font-medium">
        {formatUSD(payload[0].value)}
      </p>
    </div>
  )
}

export default function PortfolioChart() {
  const [days, setDays] = useState(7)
  const { history, loading, error } = usePriceHistory('ethereum', days)

  return (
    <div className="card p-5 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="stat-label mb-1">ETH Price Chart</p>
          <p className="text-white font-display font-semibold text-base">
            {history.length > 0
              ? formatUSD(history[history.length - 1]?.price)
              : '—'}
          </p>
        </div>
        {/* Range selector */}
        <div className="flex gap-1 bg-surface-700 rounded-xl p-1">
          {RANGES.map(r => (
            <button
              key={r.label}
              onClick={() => setDays(r.days)}
              className={`px-3 py-1 rounded-lg text-xs font-display font-semibold transition-all
                ${days === r.days
                  ? 'bg-brand-500 text-white shadow-[0_0_12px_-2px] shadow-brand-500/60'
                  : 'text-slate-400 hover:text-white'}`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart body */}
      {loading ? (
        <div className="h-48 flex items-center justify-center">
          <span className="w-6 h-6 border-2 border-brand-500/30 border-t-brand-500
                           rounded-full animate-spin" />
        </div>
      ) : error ? (
        <div className="h-48 flex items-center justify-center text-slate-500 text-sm">
          {error}
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={200}>
          <AreaChart data={history} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="ethGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor="#1faba1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#1faba1" stopOpacity={0}   />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="rgba(255,255,255,0.04)"
              vertical={false}
            />
            <XAxis
              dataKey="date"
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
            />
            <YAxis
              domain={['auto', 'auto']}
              tick={{ fill: '#64748b', fontSize: 11, fontFamily: 'JetBrains Mono' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={v => `$${(v / 1000).toFixed(1)}k`}
              width={52}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke="#1faba1"
              strokeWidth={2}
              fill="url(#ethGradient)"
              dot={false}
              activeDot={{ r: 4, fill: '#38c5ba', strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}