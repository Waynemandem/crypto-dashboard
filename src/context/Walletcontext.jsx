/**
 * WalletContext
 * Provides global wallet state (address, provider, chainId, darkMode)
 * to the entire app via React Context.
 */
import React, { createContext, useContext, useState, useCallback } from 'react'
import { BrowserProvider } from 'ethers'

const WalletContext = createContext(null)

export function WalletProvider({ children }) {
  const [address, setAddress]     = useState(null)
  const [provider, setProvider]   = useState(null)
  const [chainId, setChainId]     = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error, setError]         = useState(null)
  const [darkMode, setDarkMode]   = useState(true)

  // Toggle dark mode on <html> element
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => {
      const next = !prev
      document.documentElement.classList.toggle('dark', next)
      return next
    })
  }, [])

  // Connect to MetaMask
  const connect = useCallback(async () => {
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install it from metamask.io')
      return
    }
    try {
      setConnecting(true)
      setError(null)

      const browserProvider = new BrowserProvider(window.ethereum)
      const accounts        = await browserProvider.send('eth_requestAccounts', [])
      const network         = await browserProvider.getNetwork()

      setProvider(browserProvider)
      setAddress(accounts[0])
      setChainId(Number(network.chainId))

      // Listen for account / chain changes
      window.ethereum.on('accountsChanged', (accs) => setAddress(accs[0] ?? null))
      window.ethereum.on('chainChanged', (id)   => setChainId(Number(id)))
    } catch (err) {
      setError(err.message)
    } finally {
      setConnecting(false)
    }
  }, [])

  // Disconnect (clear local state — MetaMask doesn't expose a disconnect RPC)
  const disconnect = useCallback(() => {
    setAddress(null)
    setProvider(null)
    setChainId(null)
  }, [])

  const value = {
    address, provider, chainId,
    connecting, error,
    darkMode, toggleDarkMode,
    connect, disconnect,
  }

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>
}

// Convenience hook
export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
  return ctx
}