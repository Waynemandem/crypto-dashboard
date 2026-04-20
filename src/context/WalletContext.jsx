/**
 * WalletContext
 * Provides global wallet state (address, provider, chainId, darkMode)
 * to the entire app via React Context.
 */
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'
import { BrowserProvider } from 'ethers'

const WalletContext = createContext(null)

export function WalletProvider({ children }) {

  // ── Wallet state ──────────────────────────────────────────
  const [address,    setAddress]    = useState(null)
  const [provider,   setProvider]   = useState(null)
  const [chainId,    setChainId]    = useState(null)
  const [connecting, setConnecting] = useState(false)
  const [error,      setError]      = useState(null)

  // ── Theme state ───────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(true)

  // Apply dark class to <html> whenever darkMode changes
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
      document.documentElement.style.colorScheme = 'dark'
      document.body.style.backgroundColor = ''
      document.body.style.color = ''
    } else {
      document.documentElement.classList.remove('dark')
      document.documentElement.style.colorScheme = 'light'
      document.body.style.backgroundColor = '#f1f5f9'
      document.body.style.color = '#0f172a'
    }
  }, [darkMode])

  // Set dark class on very first load
  useEffect(() => {
    document.documentElement.classList.add('dark')
  }, [])

  // Toggle between dark and light
  const toggleDarkMode = useCallback(() => {
    setDarkMode(prev => !prev)
  }, [])

  // ── Wallet connect ────────────────────────────────────────
  const connect = useCallback(async () => {
    // Check MetaMask is installed
    if (!window.ethereum) {
      setError('MetaMask is not installed. Please install it from metamask.io')
      return
    }

    try {
      setConnecting(true)
      setError(null)

      // Request wallet access
      const browserProvider = new BrowserProvider(window.ethereum)
      const accounts        = await browserProvider.send('eth_requestAccounts', [])
      const network         = await browserProvider.getNetwork()

      // Save to state
      setProvider(browserProvider)
      setAddress(accounts[0])
      setChainId(Number(network.chainId))

      // React to MetaMask account / network switches
      window.ethereum.on('accountsChanged', (accs) => {
        setAddress(accs[0] ?? null)
      })
      window.ethereum.on('chainChanged', (id) => {
        setChainId(Number(id))
      })

    } catch (err) {
      setError(err.message)
    } finally {
      setConnecting(false)
    }
  }, [])

  // ── Wallet disconnect ─────────────────────────────────────
  const disconnect = useCallback(() => {
    setAddress(null)
    setProvider(null)
    setChainId(null)
  }, [])

  // ── Expose to app ─────────────────────────────────────────
  const value = {
    address,
    provider,
    chainId,
    connecting,
    error,
    darkMode,
    toggleDarkMode,
    connect,
    disconnect,
  }

  return (
    <WalletContext.Provider value={value}>
      {children}
    </WalletContext.Provider>
  )
}

// Use this hook in any component to access wallet state
export function useWallet() {
  const ctx = useContext(WalletContext)
  if (!ctx) throw new Error('useWallet must be used inside <WalletProvider>')
  return ctx
}