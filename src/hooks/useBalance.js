/**
 * useBalance
 * Fetches the native ETH balance and a set of common ERC-20 token balances
 * for the connected wallet address.
 */
import { useState, useEffect } from 'react'
import { formatEther, formatUnits, Contract } from 'ethers'
import { useWallet } from '../context/WalletContext'

// Minimal ERC-20 ABI — only what we need
const ERC20_ABI = [
  'function balanceOf(address owner) view returns (uint256)',
  'function decimals() view returns (uint8)',
  'function symbol() view returns (string)',
  'function name() view returns (string)',
]

// Well-known ERC-20 tokens on Ethereum mainnet
const TRACKED_TOKENS = [
  { address: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48', symbol: 'USDC',  decimals: 6,  coingeckoId: 'usd-coin' },
  { address: '0xdAC17F958D2ee523a2206206994597C13D831ec7', symbol: 'USDT',  decimals: 6,  coingeckoId: 'tether' },
  { address: '0x6B175474E89094C44Da98b954EedeAC495271d0F', symbol: 'DAI',   decimals: 18, coingeckoId: 'dai' },
  { address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', symbol: 'UNI',   decimals: 18, coingeckoId: 'uniswap' },
  { address: '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599', symbol: 'WBTC',  decimals: 8,  coingeckoId: 'wrapped-bitcoin' },
  { address: '0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0', symbol: 'MATIC', decimals: 18, coingeckoId: 'matic-network' },
]

export function useBalance() {
  const { address, provider } = useWallet()

  const [ethBalance, setEthBalance]       = useState(null)
  const [tokenBalances, setTokenBalances] = useState([])
  const [loading, setLoading]             = useState(false)
  const [error, setError]                 = useState(null)

  useEffect(() => {
    if (!address || !provider) {
      setEthBalance(null)
      setTokenBalances([])
      return
    }

    let cancelled = false

    async function fetchBalances() {
      setLoading(true)
      setError(null)

      try {
        // --- Native ETH balance ---
        const rawEth = await provider.getBalance(address)
        if (!cancelled) setEthBalance(parseFloat(formatEther(rawEth)))

        // --- ERC-20 token balances (parallel) ---
        const tokenResults = await Promise.allSettled(
          TRACKED_TOKENS.map(async (token) => {
            const contract = new Contract(token.address, ERC20_ABI, provider)
            const raw      = await contract.balanceOf(address)
            const balance  = parseFloat(formatUnits(raw, token.decimals))
            return { ...token, balance }
          })
        )

        if (!cancelled) {
          const tokens = tokenResults
            .filter(r => r.status === 'fulfilled' && r.value.balance > 0)
            .map(r => r.value)
          setTokenBalances(tokens)
        }
      } catch (err) {
        if (!cancelled) setError(err.message)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchBalances()
    return () => { cancelled = true }
  }, [address, provider])

  return { ethBalance, tokenBalances, loading, error }
}