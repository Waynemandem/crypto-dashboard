import { useState, useEffect } from 'react'
import axios from 'axios'
import { useWallet } from '../context/WalletContext'

const ETHERSCAN_BASE = 'https://api.etherscan.io/v2/api'

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
        const apiKey = import.meta.env.VITE_ETHERSCAN_API_KEY

        const { data } = await axios.get(ETHERSCAN_BASE, {
          params: {
            chainid:    1,
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