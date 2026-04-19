/**
 * TransactionsPage
 * Full transaction history fetched from Etherscan, with filter tabs.
 */
import React, { useState, useMemo } from 'react'
import TransactionRow from '../components/dashboard/TransactionRow'
import ConnectPrompt from '../components/wallet/ConnectPrompt'
import { useWallet } from '../context/WalletContext'
import { useTransactions } from '../hooks/useTransaction'

const FILTERS = ['All', 'Sent', 'Received', 'Failed']

export default function TransactionsPage() {
  const { address } = useWallet()
  const { transactions, loading, error } = useTransactions()
  const [filter, setFilter] = useState('All')

  const filtered = useMemo(() => {
    if (filter === 'All')      return transactions
    if (filter === 'Failed')   return transactions.filter(tx => tx.isError === '1')
    if (filter === 'Sent')     return transactions.filter(tx =>
      tx.from?.toLowerCase() === address?.toLowerCase() && tx.isError !== '1'
    )
    if (filter === 'Received') return transactions.filter(tx =>
      tx.to?.toLowerCase() === address?.toLowerCase() && tx.isError !== '1'
    )
    return transactions
  }, [transactions, filter, address])

  if (!address) return <ConnectPrompt />

  return (
    <div className="flex flex-col gap-6 p-6 pb-24 md:pb-6 animate-fade-in">

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {FILTERS.map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-xl text-sm font-display font-medium transition-all
              ${filter === f
                ? 'bg-brand-500 text-white shadow-[0_0_16px_-4px] shadow-brand-500/50'
                : 'btn-ghost'}`}
          >
            {f}
          </button>
        ))}
        <span className="ml-auto text-slate-500 text-xs font-mono self-center">
          {filtered.length} transactions
        </span>
      </div>

      {/* Transaction list */}
      <div className="card divide-y divide-white/[0.04]">
        {loading ? (
          <div className="p-4 space-y-2">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-14 bg-surface-700 rounded-xl animate-pulse" />
            ))}
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 text-sm">{error}</p>
            <p className="text-slate-600 text-xs mt-2">
              Add an Etherscan API key in your <code className="font-mono">.env</code> file.
            </p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-sm">
            No transactions found
          </div>
        ) : (
          <div className="p-2">
            {filtered.map(tx => (
              <TransactionRow key={tx.hash} tx={tx} />
            ))}
          </div>
        )}
      </div>

      {/* Etherscan link */}
      {address && (
        <p className="text-center text-slate-600 text-xs">
          View full history on{' '}
          <a
            href={`https://etherscan.io/address/${address}`}
            target="_blank"
            rel="noreferrer"
            className="text-brand-400 hover:text-brand-300 underline underline-offset-2"
          >
            Etherscan ↗
          </a>
        </p>
      )}
    </div>
  )
}