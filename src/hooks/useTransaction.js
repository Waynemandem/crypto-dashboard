/**
 * useTransactions
 * Fetches the last 20 normal Ethereum transactions for the connected wallet
 * using the Etherscan API. Falls back gracefully if the API key is missing.
 */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { useWallet } from '../context/WalletContext'

const ETHERSCAN_BASE = 'https://api.etherscan.io/api'

export function useTransactions() {
  const { address } = useWallet()

  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(false)
  const [error, setError]               = useState(null)

  useEffect(() => {
    if (!address) {
      setTransactions([])
      return
    }

    let cancelled = false

    async function fetchTx() {
      setLoading(true)
      setError(null)

      try {
        const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY || 'YourApiKeyToken'

        const { data } = await axios.get(ETHERSCAN_BASE, {
          params: {
            module:     'account',
            action:     'txlist',
            address,
            startblock: 0,
            endblock:   99999999,
            page:       1,
            offset:     20,
            sort:       'desc',
            apikey:     apiKey,
          },
        })

        if (!cancelled) {
          if (data.status === '1') {
            setTransactions(data.result)
          } else {
            // API returned an error message (e.g., rate limit)
            setError(data.message || 'Etherscan API error')
          }
        }
      } catch (err) {
        if (!cancelled) setError('Could not fetch transactions.')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchTx()
    return () => { cancelled = true }
  }, [address])

  return { transactions, loading, error }
}