/**
 * StatCard
 * Reusable metric card with label, value, optional change badge, and icon.
 */
import React from 'react'

export default function StatCard({ label, value, change, icon, highlight = false, loading = false }) {
  const isPositive = change >= 0

  return (
    <div className={`card p-5 flex flex-col gap-3 animate-slide-up
                     ${highlight ? 'card-glow' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="stat-label">{label}</span>
        {icon && (
          <span className="w-8 h-8 rounded-lg bg-surface-600 flex items-center justify-center
                           text-brand-400 text-sm border border-white/[0.04]">
            {icon}
          </span>
        )}
      </div>

      {loading ? (
        <div className="h-8 w-32 bg-surface-600 rounded-lg animate-pulse" />
      ) : (
        <p className="stat-value">{value}</p>
      )}

      {change != null && !loading && (
        <span className={isPositive ? 'badge-up' : 'badge-down'}>
          {isPositive ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%
        </span>
      )}
    </div>
  )
}