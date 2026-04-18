/**
 * usePrices
 * Fetches current USD prices and 24h changes for ETH + tracked ERC-20 tokens
 * from the CoinGecko public API. Refreshes every 60 seconds.
 */
import { useState, useEffect, useCallback } from 'react'
import axios from 'axios'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

// All coin IDs we want to track (ETH + ERC-20s from useBalance)
const COIN_IDS = [
  'ethereum',
  'usd-coin',
  'tether',
  'dai',
  'uniswap',
  'wrapped-bitcoin',
  'matic-network',
]

export function usePrices() {
  const [prices, setPrices]   = useState({})   // { coingeckoId: { usd, usd_24h_change } }
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  const fetchPrices = useCallback(async () => {
    setLoading(true)
    setError(null)

    try {
      const apiKey = import.meta.env.VITE_COINGECKO_API_KEY
      const params = {
        ids:              COIN_IDS.join(','),
        vs_currencies:   'usd',
        include_24hr_change: true,
      }
      const headers = apiKey ? { 'x-cg-demo-api-key': apiKey } : {}

      const { data } = await axios.get(`${COINGECKO_BASE}/simple/price`, { params, headers })
      setPrices(data)
    } catch (err) {
      setError('Failed to fetch prices. CoinGecko may be rate-limiting.')
    } finally {
      setLoading(false)
    }
  }, [])

  // Fetch on mount and then every 60 seconds
  useEffect(() => {
    fetchPrices()
    const interval = setInterval(fetchPrices, 60_000)
    return () => clearInterval(interval)
  }, [fetchPrices])

  return { prices, loading, error, refetch: fetchPrices }
}