/**
 * Shared formatting utilities used across the dashboard.
 */

/** Format a number as USD currency */
export function formatUSD(value, compact = false) {
  if (value == null || isNaN(value)) return '—'
  if (compact && value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(2)}M`
  }
  if (compact && value >= 1_000) {
    return `$${(value / 1_000).toFixed(2)}K`
  }
  return new Intl.NumberFormat('en-US', {
    style:                 'currency',
    currency:              'USD',
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value)
}

/** Shorten a 0x address to 0x1234…abcd format */
export function shortAddress(addr) {
  if (!addr) return ''
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`
}

/** Format a unix timestamp (seconds) into a readable date string */
export function formatTimestamp(ts) {
  const date = new Date(Number(ts) * 1000)
  return date.toLocaleDateString('en-US', {
    month: 'short', day: 'numeric', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  })
}

/** Format ETH value to a fixed number of decimals, removing trailing zeros */
export function formatETH(value, decimals = 4) {
  if (value == null || isNaN(value)) return '—'
  const fixed = parseFloat(value.toFixed(decimals))
  return `${fixed} ETH`
}

/** Return a colour class based on positive/negative change */
export function changeColor(change) {
  if (change == null) return 'text-slate-400'
  return change >= 0 ? 'text-emerald-400' : 'text-red-400'
}

/** Return ▲ or ▼ symbol for a price change */
export function changeArrow(change) {
  return change >= 0 ? '▲' : '▼'
}