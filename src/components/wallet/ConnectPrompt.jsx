/**
 * ConnectPrompt
 * Shown when no wallet is connected. Provides a clear CTA.
 */
import React from 'react'
import { useWallet } from '../../context/WalletContext'

export default function ConnectPrompt() {
  const { connect, connecting, error } = useWallet()

  return (
    <div className="flex flex-col items-center justify-center flex-1 px-6 py-20 text-center animate-fade-in">
      {/* Decorative hex */}
      <div className="relative mb-8">
        <div className="w-24 h-24 rounded-3xl bg-brand-500/10 border border-brand-500/20
                        flex items-center justify-center mx-auto
                        shadow-[0_0_60px_-10px] shadow-brand-500/30">
          <span className="text-4xl">⬡</span>
        </div>
        <div className="absolute inset-0 rounded-3xl bg-brand-500/5 blur-xl -z-10" />
      </div>

      <h2 className="font-display font-bold text-2xl text-white mb-2">
        Connect Your Wallet
      </h2>
      <p className="text-slate-400 text-sm max-w-xs mb-8 leading-relaxed">
        Connect your MetaMask wallet to view your portfolio, balances, and transaction history.
      </p>

      {error && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                      rounded-xl px-4 py-2 mb-6 max-w-sm">
          {error}
        </p>
      )}

      <button onClick={connect} disabled={connecting} className="btn-primary text-base px-8 py-3">
        {connecting ? (
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Connecting…
          </span>
        ) : (
          'Connect MetaMask'
        )}
      </button>

      <p className="text-slate-600 text-xs mt-6">
        Make sure MetaMask is installed in your browser.
      </p>
    </div>
  )
}