# CryptoLens — Crypto Portfolio Dashboard

A modern, full-stack crypto portfolio dashboard built with **React**, **Vite**, **Tailwind CSS**, **ethers.js**, and **Recharts**.

🔗 **Live Demo:** https://crypto-dashboard-pi-wheat.vercel.app/

---

## Features

- 🔌 **MetaMask Wallet Connection** — connect with one click on desktop, deep-link support on mobile
- 💰 **Live ETH + ERC-20 Balances** — USDC, USDT, DAI, UNI, WBTC, MATIC
- 📈 **Real-Time Price Charts** — 7D / 30D / 90D powered by CoinGecko
- 🥧 **Portfolio Allocation Chart** — donut chart showing asset breakdown
- 💵 **Total Portfolio Value in USD** — live calculation across all assets
- 📜 **Transaction History** — full on-chain history via Etherscan API
- 🌙 **Dark / Light Mode** — smooth toggle, defaults to dark
- 📱 **Fully Responsive** — sidebar on desktop, bottom nav on mobile

---

## Project Structure

```
crypto-dashboard/
├── src/
│   ├── components/
│   │   ├── charts/
│   │   │   ├── AllocationChart.jsx     # Donut chart (Recharts)
│   │   │   └── PortfolioChart.jsx      # Area chart (Recharts)
│   │   ├── dashboard/
│   │   │   ├── StatCard.jsx            # Metric card component
│   │   │   ├── TokenRow.jsx            # Token table row
│   │   │   └── TransactionRow.jsx      # Transaction list row
│   │   ├── layout/
│   │   │   ├── Sidebar.jsx             # Desktop sidebar + mobile bottom nav
│   │   │   └── Topbar.jsx              # Page header + connect button
│   │   └── wallet/
│   │       └── ConnectPrompt.jsx       # Wallet connection screen
│   ├── context/
│   │   └── WalletContext.jsx           # Global wallet state
│   ├── hooks/
│   │   ├── useBalance.js               # ETH + ERC-20 balances
│   │   ├── usePrices.js                # Live CoinGecko prices
│   │   ├── usePriceHistory.js          # Chart price history
│   │   └── useTransactions.js          # Etherscan transaction history
│   ├── pages/
│   │   ├── OverviewPage.jsx            # Dashboard home
│   │   ├── PortfolioPage.jsx           # Portfolio breakdown
│   │   ├── TransactionPage.jsx         # Transaction history
│   │   └── TokenPricesPage.jsx         # Live market prices
│   ├── utils/
│   │   └── format.js                   # Formatting helpers
│   ├── styles/
│   │   └── index.css                   # Tailwind + custom styles
│   ├── App.jsx                         # Root component
│   └── main.jsx                        # Entry point
├── .env.example                        # Environment variable template
├── index.html
├── package.json
├── tailwind.config.js
└── vite.config.js
```

---

## Quick Start

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

```bash
cp .env.example .env
```

Open `.env` and add your API keys:

```env
VITE_ETHERSCAN_API_KEY=your_etherscan_api_key
VITE_COINGECKO_API_KEY=your_coingecko_api_key
```

### 3. Run the development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Connect MetaMask

- Install [MetaMask](https://metamask.io) browser extension
- Click **Connect Wallet** in the top right
- Approve the connection in MetaMask

---

## Getting API Keys

### Etherscan (Free)
1. Sign up at [etherscan.io](https://etherscan.io/register)
2. Go to [etherscan.io/myapikey](https://etherscan.io/myapikey)
3. Click **Add** → create a key → copy it

Free tier: **5 requests/second, 100k requests/day**

### CoinGecko (Free)
1. Go to [coingecko.com/en/api](https://www.coingecko.com/en/api)
2. Sign up for the free **Demo plan**
3. Copy your API key from the dashboard

Free tier: **~30 requests/minute** — the app refreshes every 60s so you'll never hit the limit.

---

## Build for Production

```bash
npm run build
```

The `dist` folder is ready to deploy anywhere.

### Deploy to Vercel (Recommended)

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repo at [vercel.com/new](https://vercel.com/new) for automatic deployments.

> ⚠️ Add your environment variables in the Vercel dashboard under **Project Settings → Environment Variables**

---

## Tech Stack

| Technology | Purpose |
|---|---|
| React 18 | UI framework |
| Vite | Build tool + dev server |
| Tailwind CSS | Utility-first styling |
| ethers.js v6 | Ethereum provider + ERC-20 reads |
| Recharts | Area chart + Pie chart |
| axios | API requests |
| CoinGecko API | Live token prices + price history |
| Etherscan API v2 | Transaction history |

---

## Mobile Usage

MetaMask browser extension is not available on mobile. To use the dashboard on mobile:

1. Install the **MetaMask mobile app** from the App Store or Play Store
2. Open MetaMask → tap the **browser icon** at the bottom
3. Navigate to the live URL
4. Tap **Connect Wallet**

Or tap **"Open in MetaMask App"** directly from the dashboard on mobile.

---

## Customisation

### Add more tokens
Edit the `TRACKED_TOKENS` array in `src/hooks/useBalance.js`:

```js
const TRACKED_TOKENS = [
  { address: '0x...', symbol: 'TOKEN', decimals: 18, coingeckoId: 'token-id' },
  // add more here
]
```

### Change the price refresh interval
In `src/hooks/usePrices.js`, change `60_000` to any value in milliseconds:

```js
const interval = setInterval(fetchPrices, 60_000) // 60 seconds
```

### Add more chains
Replace the Etherscan endpoint in `src/hooks/useTransactions.js`:
- Polygon: `https://api.polygonscan.com/v2/api`
- BSC: `https://api.bscscan.com/v2/api`
- Arbitrum: `https://api.arbiscan.io/v2/api`

---

## License

MIT — free to use, modify, and sell.

---

## Support

Built by [@Waynemandem](https://github.com/Waynemandem)

If you found this useful, consider leaving a ⭐ on GitHub!