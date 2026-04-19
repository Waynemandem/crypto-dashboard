/**
 * OverviewPage
 * Top-level summary: total portfolio value, ETH balance, top tokens, recent txs.
 */
import React, { useMemo } from 'react'
import StatCard from '../components/dashboard/StatCard'
import TokenRow from '../components/dashboard/TokenRow'
import TransactionRow from '../components/dashboard/TransactionRow'
import PortfolioChart from '../components/charts/PortfolioChart'
import ConnectPrompt from '../components/wallet/ConnectPrompt'
import { useWallet } from '../context/WalletContext'
import { useBalance } from '../hooks/useBalance'
import { usePrices } from '../hooks/usePrices'
import { useTransactions } from '../hooks/useTransaction'
import { formatUSD, formatETH } from '../utils/format'

export default function OverviewPage() {
  const { address } = useWallet()
  const { ethBalance, tokenBalances, loading: balLoading } = useBalance()
  const { prices, loading: priceLoading } = usePrices()
  const { transactions, loading: txLoading } = useTransactions()

  // Compute total portfolio value in USD
  const totalUSD = useMemo(() => {
    if (ethBalance == null || !prices['ethereum']) return null
    let total = ethBalance * (prices['ethereum']?.usd ?? 0)
    tokenBalances.forEach(token => {
      const price = prices[token.coingeckoId]?.usd ?? 0
      total += token.balance * price
    })
    return total
  }, [ethBalance, tokenBalances, prices])

  const ethPrice  = prices['ethereum']
  const ethChange = ethPrice?.usd_24h_change

  if (!address) return <ConnectPrompt />

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 md:pb-6 animate-fade-in">

      {/* ── Stat cards row ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Portfolio Value"
          value={totalUSD != null ? formatUSD(totalUSD, true) : '—'}
          change={ethChange}
          icon="◈"
          highlight
          loading={balLoading || priceLoading}
        />
        <StatCard
          label="ETH Balance"
          value={ethBalance != null ? formatETH(ethBalance) : '—'}
          icon="⬡"
          loading={balLoading}
        />
        <StatCard
          label="ETH Price"
          value={ethPrice ? formatUSD(ethPrice.usd) : '—'}
          change={ethChange}
          icon="$"
          loading={priceLoading}
        />
        <StatCard
          label="Tokens Held"
          value={tokenBalances.length.toString()}
          icon="◐"
          loading={balLoading}
        />
      </div>

      {/* ── Chart ── */}
      <PortfolioChart />

      {/* ── Bottom row: tokens + recent transactions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top tokens */}
        <div className="card p-4">
          <p className="stat-label px-1 mb-3">Your Tokens</p>
          {balLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-surface-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : tokenBalances.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No ERC-20 tokens found</p>
          ) : (
            <div>
              {/* ETH row */}
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

        {/* Recent transactions */}
        <div className="card p-4">
          <p className="stat-label px-1 mb-3">Recent Transactions</p>
          {txLoading ? (
            <div className="space-y-2">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-surface-700 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-8">No transactions found</p>
          ) : (
            <div>
              {transactions.slice(0, 6).map(tx => (
                <TransactionRow key={tx.hash} tx={tx} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}