/**
 * AllocationChart
 * Donut / pie chart showing the % breakdown of each token in the portfolio.
 * Rendered with Recharts PieChart.
 */
import React from 'react'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'

// Distinct palette for slices
const SLICE_COLORS = [
  '#1faba1', '#38c5ba', '#71ddd3',
  '#a9ede4', '#6366f1', '#818cf8',
  '#f59e0b', '#fb923c',
]

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface-700 border border-white/10 rounded-xl px-3 py-2 shadow-xl">
      <p className="font-mono text-sm text-white font-medium">
        {payload[0].name}: {payload[0].value.toFixed(1)}%
      </p>
    </div>
  )
}

export default function AllocationChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="card p-5 flex items-center justify-center h-52 text-slate-500 text-sm">
        Connect wallet to see allocation
      </div>
    )
  }

  return (
    <div className="card p-5 animate-slide-up">
      <p className="stat-label mb-4">Allocation</p>
      <ResponsiveContainer width="100%" height={200}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={80}
            paddingAngle={3}
            dataKey="value"
            nameKey="name"
            stroke="none"
          >
            {data.map((_, i) => (
              <Cell key={i} fill={SLICE_COLORS[i % SLICE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend
            iconType="circle"
            iconSize={8}
            formatter={(value) => (
              <span style={{ color: '#94a3b8', fontSize: 11, fontFamily: 'JetBrains Mono' }}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}