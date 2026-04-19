# CryptoLens — Crypto Portfolio Dashboard

A modern, dark-mode crypto dashboard built with **React (Vite)**, **Tailwind CSS**, **ethers.js**, and **Recharts**.

---

## Features

- 🔌 **MetaMask wallet connection** via ethers.js v6
- 💰 **ETH + ERC-20 balances** (USDC, USDT, DAI, UNI, WBTC, MATIC)
- 📊 **Interactive price chart** (7d / 30d / 90d) with Recharts AreaChart
- 🥧 **Allocation donut chart** showing portfolio breakdown
- 💵 **Portfolio total in USD** with live prices from CoinGecko
- 🔄 **Transaction history** from Etherscan API (with filter tabs)
- 🌙 **Dark / light mode** toggle
- 📱 **Fully responsive** — sidebar on desktop, bottom nav on mobile

---

## Project Structure

```
crypto-dashboard/
├── public/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── AllocationChart.jsx   # Donut chart (Recharts)
│   │   │   └── PortfolioChart.jsx    # Area chart (Recharts)
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx          # Metric card
│   │   │   ├── TokenRow.jsx          # Token table row
│   │   │   └── TransactionRow.jsx    # Transaction list row
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx           # Nav sidebar / mobile bottom bar
│   │   │   └── Topbar.jsx            # Page header + connect button
│   │   └── wallet/
│   │       └── ConnectPrompt.jsx     # Wallet connection CTA
│   ├── context/
│   │   └── WalletContext.jsx         # Global wallet state (Context + Provider)
│   ├── hooks/
│   │   ├── useBalance.js             # ETH + ERC-20 balances
│   │   ├── usePrices.js              # CoinGecko live prices
│   │   ├── usePriceHistory.js        # CoinGecko price history (chart data)
│   │   └── useTransactions.js        # Etherscan transaction history
│   ├── pages/
│   │   ├── OverviewPage.jsx          # Dashboard home
│   │   ├── PortfolioPage.jsx         # Full portfolio breakdown
│   │   ├── TransactionsPage.jsx      # Transaction history
│   │   └── TokenPricesPage.jsx       # Live market prices
│   ├── utils/
│   │   └── format.js                 # Currency / address / date formatters
│   ├── styles/
│   │   └── index.css                 # Tailwind base + custom component classes
│   ├── App.jsx                       # Root component + page routing
│   └── main.jsx                      # React entry point
├── .env.example                      # Environment variable template
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Quick Start

### 1. Clone and install

```bash
git clone <your-repo>
cd crypto-dashboard
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Required for transaction history (free at https://etherscan.io/myapikey)
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key

# Optional — CoinGecko public API works without a key (rate-limited)
VITE_COINGECKO_API_KEY=your_coingecko_key

# Optional — custom RPC (Alchemy/Infura). Falls back to MetaMask's provider.
VITE_RPC_URL=https://eth-mainnet.g.alchemy.com/v2/your_key
```

### 3. Run the dev server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

### 4. Connect MetaMask

- Make sure the [MetaMask](https://metamask.io) browser extension is installed.
- Click **Connect Wallet** in the top-right.
- Approve the connection in MetaMask.

---

## Build for production

```bash
npm run build
npm run preview
```

---

## Tech Stack

| Library       | Purpose                            |
|---------------|------------------------------------|
| React 18      | UI framework                       |
| Vite          | Build tool + dev server            |
| Tailwind CSS  | Utility-first styling              |
| ethers.js v6  | Ethereum provider + ERC-20 reads   |
| Recharts      | AreaChart + PieChart               |
| axios         | API requests (CoinGecko, Etherscan)|

---

## API Keys

| Service    | Free Tier | URL |
|------------|-----------|-----|
| Etherscan  | 5 req/s   | https://etherscan.io/myapikey |
| CoinGecko  | 10–30 req/min (no key needed for demo) | https://www.coingecko.com/en/api |

---

## Extending the Dashboard

- **Add more tokens**: Edit the `TRACKED_TOKENS` array in `src/hooks/useBalance.js`.
- **Add more chains**: Swap the Etherscan endpoint in `useTransactions.js` for Polygonscan, BSCscan, etc.
- **Add wagmi**: Replace the custom `WalletContext` with `wagmi` + `viem` for multi-wallet support.
- **Add React Router**: Replace the `useState` page router in `App.jsx` with `react-router-dom`.