/**
 * TransactionRow
 * Displays a single Etherscan transaction with type, value, and status.
 */
import React from 'react'
import { formatETH, formatTimestamp, shortAddress } from '../../utils/format'
import { useWallet } from '../../context/WalletContext'

export default function TransactionRow({ tx }) {
  const { address } = useWallet()

  const isOutgoing  = tx.from?.toLowerCase() === address?.toLowerCase()
  const isFailed    = tx.isError === '1'
  const valueEth    = parseFloat(tx.value) / 1e18
  const gasEth      = (parseInt(tx.gasUsed) * parseInt(tx.gasPrice)) / 1e18

  return (
    <div className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] rounded-xl transition-colors">
      {/* Direction icon */}
      <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs
                       ${isFailed
                         ? 'bg-red-500/10 text-red-400'
                         : isOutgoing
                           ? 'bg-orange-500/10 text-orange-400'
                           : 'bg-emerald-500/10 text-emerald-400'}`}>
        {isFailed ? '✕' : isOutgoing ? '↑' : '↓'}
      </div>

      {/* Details */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-display font-medium text-sm text-white truncate">
            {isFailed ? 'Failed' : isOutgoing ? 'Sent' : 'Received'}
          </p>
          {isFailed && (
            <span className="text-[10px] font-mono bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded">
              FAILED
            </span>
          )}
        </div>
        <p className="text-slate-500 text-xs font-mono truncate">
          {isOutgoing
            ? `To: ${shortAddress(tx.to)}`
            : `From: ${shortAddress(tx.from)}`}
        </p>
      </div>

      {/* Value + timestamp */}
      <div className="text-right shrink-0">
        <p className={`font-mono text-sm font-medium
                       ${isFailed ? 'text-slate-500 line-through' : isOutgoing ? 'text-orange-400' : 'text-emerald-400'}`}>
          {isOutgoing ? '-' : '+'}{valueEth.toFixed(4)} ETH
        </p>
        <p className="text-slate-500 text-xs">{formatTimestamp(tx.timeStamp)}</p>
      </div>
    </div>
  )
}