/**
 * ConnectPrompt
 * Shown when no wallet is connected. Provides a clear CTA.
 */
import React from 'react'
import { useWallet } from '../../context/WalletContext'

export default function ConnectPrompt() {
  const { connect, connecting, error } = useWallet()

  // Detect if user is on mobile
  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

  // On mobile, deep link into MetaMask app
  const handleConnect = () => {
    if (isMobile && !window.ethereum) {
      window.open(
        `https://metamask.app.link/dapp/crypto-dashboard-pi-wheat.vercel.app`,
        '_blank'
      )
      return
    }
    connect()
  }

  return (
    <div className="flex flex-col items-center justify-center flex-1 
                    px-6 py-20 text-center animate-fade-in">
      {/* Icon */}
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
        {isMobile
          ? 'Open this app inside the MetaMask mobile browser to connect your wallet.'
          : 'Connect your MetaMask wallet to view your portfolio, balances, and transaction history.'
        }
      </p>

      {/* Show error only on desktop */}
      {error && !isMobile && (
        <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20
                      rounded-xl px-4 py-2 mb-6 max-w-sm">
          {error}
        </p>
      )}

      {isMobile && !window.ethereum ? (
        <div className="flex flex-col gap-3 w-full max-w-xs">
          {/* Option 1 — Open in MetaMask app */}
          <button
            onClick={handleConnect}
            className="btn-primary text-base px-8 py-3 w-full"
          >
            Open in MetaMask App
          </button>

          {/* Option 2 — Instructions */}
          <div className="bg-surface-700 border border-white/[0.06] 
                          rounded-xl px-4 py-4 text-left mt-2">
            <p className="text-white font-display font-semibold text-sm mb-3">
              Or follow these steps:
            </p>
            <ol className="text-slate-400 text-xs space-y-2 list-none">
              <li className="flex gap-2">
                <span className="text-brand-400 font-bold">1.</span>
                Install the MetaMask app from the App Store or Play Store
              </li>
              <li className="flex gap-2">
                <span className="text-brand-400 font-bold">2.</span>
                Open MetaMask → tap the browser icon at the bottom
              </li>
              <li className="flex gap-2">
                <span className="text-brand-400 font-bold">3.</span>
                Type: crypto-dashboard-pi-wheat.vercel.app
              </li>
              <li className="flex gap-2">
                <span className="text-brand-400 font-bold">4.</span>
                Tap Connect Wallet — done!
              </li>
            </ol>
          </div>
        </div>
      ) : (
        <button
          onClick={connect}
          disabled={connecting}
          className="btn-primary text-base px-8 py-3"
        >
          {connecting ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 
                               border-t-white rounded-full animate-spin" />
              Connecting…
            </span>
          ) : (
            'Connect MetaMask'
          )}
        </button>
      )}

      <p className="text-slate-600 text-xs mt-6">
        {isMobile
          ? 'MetaMask mobile app required for wallet connection'
          : 'Make sure MetaMask is installed in your browser.'
        }
      </p>
    </div>
  )
}