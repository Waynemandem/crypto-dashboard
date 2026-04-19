/**
 * App.jsx
 * Root application component. Wires together the WalletProvider,
 * Sidebar, Topbar, and page-level routing via simple state.
 */
import React, { useState } from 'react'
import { WalletProvider } from './context/WalletContext'
import Sidebar from './components/layout/Sidebar'
import Topbar from './components/layout/Topbar'
import OverviewPage from './pages/OverviewPage'
import PortfolioPage from './pages/PortfolioPage'
import TransactionsPage from './pages/TransactionPage'
import TokenPricesPage from './pages/TokenPricesPage'

// Map page IDs to their components
const PAGES = {
  overview:     OverviewPage,
  portfolio:    PortfolioPage,
  transactions: TransactionsPage,
  tokens:       TokenPricesPage,
}

function Dashboard() {
  const [activePage, setActivePage] = useState('overview')
  const PageComponent = PAGES[activePage] ?? OverviewPage

  return (
    <div className="flex min-h-screen bg-surface-900">
      {/* ── Sidebar navigation ── */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* ── Main content area ── */}
      <div className="flex flex-col flex-1 min-w-0">
        <Topbar activePage={activePage} />

        <main className="flex-1 overflow-y-auto">
          <PageComponent />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <WalletProvider>
      <Dashboard />
    </WalletProvider>
  )
}