/**
 * PortfolioPage
 * Detailed portfolio: allocation donut chart, asset table with USD values.
 */
import React, { useMemo } from 'react'
import AllocationChart from '../components/charts/AllocationChart'
import PortfolioChart from '../components/charts/PortfolioChart'
import TokenRow from '../components/dashboard/TokenRow'
import ConnectPrompt from '../components/wallet/ConnectPrompt'
import { useWallet } from '../context/WalletContext'
import { useBalance } from '../hooks/useBalance'
import { usePrices } from '../hooks/usePrices'
import { formatUSD } from '../utils/format'

export default function PortfolioPage() {
  const { address } = useWallet()
  const { ethBalance, tokenBalances, loading: balLoading } = useBalance()
  const { prices, loading: priceLoading }                  = usePrices()

  // Build allocation data for the donut chart
  const allocationData = useMemo(() => {
    if (ethBalance == null) return []
    const items = []
    const ethUSD = (prices['ethereum']?.usd ?? 0) * ethBalance
    if (ethUSD > 0) items.push({ name: 'ETH', value: ethUSD })

    tokenBalances.forEach(t => {
      const usd = (prices[t.coingeckoId]?.usd ?? 0) * t.balance
      if (usd > 0) items.push({ name: t.symbol, value: usd })
    })

    // Convert to percentages
    const total = items.reduce((s, i) => s + i.value, 0)
    return items.map(i => ({ name: i.name, value: total > 0 ? (i.value / total) * 100 : 0 }))
  }, [ethBalance, tokenBalances, prices])

  // Total portfolio value
  const totalUSD = useMemo(() => {
    if (ethBalance == null) return null
    let total = (prices['ethereum']?.usd ?? 0) * ethBalance
    tokenBalances.forEach(t => { total += (prices[t.coingeckoId]?.usd ?? 0) * t.balance })
    return total
  }, [ethBalance, tokenBalances, prices])

  if (!address) return <ConnectPrompt />

  const isLoading = balLoading || priceLoading

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 md:pb-6 animate-fade-in">

      {/* Portfolio total */}
      <div className="card-glow p-6 flex items-center justify-between">
        <div>
          <p className="stat-label mb-2">Total Portfolio Value</p>
          {isLoading ? (
            <div className="h-10 w-40 bg-surface-600 rounded-lg animate-pulse" />
          ) : (
            <p className="text-4xl font-display font-bold text-white">
              {totalUSD != null ? formatUSD(totalUSD) : '—'}
            </p>
          )}
        </div>
        <div className="hidden sm:block w-16 h-16 rounded-2xl bg-brand-500/10
                        border border-brand-500/20 flex items-center justify-center">
          <span className="text-2xl">◈</span>
        </div>
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <PortfolioChart />
        </div>
        <AllocationChart data={allocationData} />
      </div>

      {/* Asset table */}
      <div className="card p-4">
        <div className="flex items-center justify-between px-1 mb-4">
          <p className="stat-label">Assets</p>
          <p className="stat-label">{tokenBalances.length + 1} assets</p>
        </div>

        {/* Table header */}
        <div className="grid grid-cols-3 px-4 mb-2">
          <span className="stat-label text-[10px]">Asset</span>
          <span className="stat-label text-[10px] text-right">Price</span>
          <span className="stat-label text-[10px] text-right hidden sm:block">Value</span>
        </div>

        {isLoading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div>
            <TokenRow
              coinId="ethereum"
              priceData={prices['ethereum']}
              balance={ethBalance}
            />
            {tokenBalances.map(token => (
              <TokenRow
                key={token.address}
                coinId={token.coingeckoId}
                priceData={prices[token.coingeckoId]}
                balance={token.balance}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}