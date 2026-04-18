/**
 * usePriceHistory
 * Fetches 7-day hourly OHLC data for a coin from CoinGecko,
 * used to render the portfolio chart.
 */
import { useState, useEffect } from 'react'
import axios from 'axios'

const COINGECKO_BASE = 'https://api.coingecko.com/api/v3'

export function usePriceHistory(coinId = 'ethereum', days = 7) {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    async function fetch() {
      try {
        const apiKey = import.meta.env.VITE_COINGECKO_API_KEY
        const headers = apiKey ? { 'x-cg-demo-api-key': apiKey } : {}

        const { data } = await axios.get(
          `${COINGECKO_BASE}/coins/${coinId}/market_chart`,
          { params: { vs_currency: 'usd', days, interval: 'daily' }, headers }
        )

        if (!cancelled && data?.prices) {
          // Convert [timestamp, price] tuples to { date, price } objects
          const formatted = data.prices.map(([ts, price]) => ({
            date:  new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
            price: parseFloat(price.toFixed(2)),
          }))
          setHistory(formatted)
        }
      } catch (err) {
        if (!cancelled) setError('Price history unavailable.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetch()
    return () => { cancelled = true }
  }, [coinId, days])

  return { history, loading, error }
}