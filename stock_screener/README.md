# 📈 Real-Time Stock Screener & Portfolio Tracker

A responsive stock dashboard built using React, Vite, Tailwind CSS, Recharts, and Finnhub API. Users can track real-time stock prices, manage watchlists, build portfolios, view historical charts, set alerts, and monitor profit/loss.

## 🚀 Features

### 📊 Stock Dashboard
- Real-time stock quotes using Finnhub API
- Dynamic stock search
- Search autocomplete / suggestions
- Sort stocks by price
- Auto-refresh stock data
- Last updated timestamp
- Price change highlighting

### ⭐ Watchlist
- Add/remove favorite stocks
- Persist watchlist using localStorage
- Dedicated watchlist section

### 💼 Portfolio Tracker
- Add portfolio holdings
- Edit holdings (shares & buy price)
- Remove holdings
- Portfolio profit/loss calculation
- Portfolio allocation visualization (Pie Chart)
- Persist portfolio using localStorage

### 📈 Charts
- Historical stock charts
- Multiple timeframes:
  - 1D
  - 1W
  - 1M
  - 1Y
- Responsive charts using Recharts

### 📰 News
- Latest company news
- External article links

### 🔔 Alerts
- Set price alerts
- Trigger notifications when target price is crossed

### 🎨 UI / UX
- Responsive design
- Loading skeletons
- Error handling
- Empty states
- Modal-based stock details
- Mobile-friendly layout

---

## 🛠 Tech Stack

Frontend:
- React
- Vite
- Tailwind CSS
- Recharts
- Axios

API:
- Finnhub API

Storage:
- localStorage

---

## 📂 Project Structure

```txt
src/
│
├── components/
│   ├── Navbar.jsx
│   ├── SearchBar.jsx
│   ├── StockTable.jsx
│   ├── StockModal.jsx
│   ├── StockChart.jsx
│   ├── Watchlist.jsx
│   ├── Portfolio.jsx
│   └── LoadingSkeleton.jsx
│
├── pages/
│   └── Dashboard.jsx
│
├── services/
│   └── stockApi.js
│
├── App.jsx
└── main.jsx
```

---

## ⚙️ Installation

Clone repository:

```bash
git clone <repo-url>
cd stock-screener
```

Install dependencies:

```bash
npm install
```

Run project:

```bash
npm run dev
```

---

## 🔑 Environment Variables

Create:

```txt
.env
```

Add:

```env
VITE_FINNHUB_API_KEY=YOUR_API_KEY
```

Get API key from:

https://finnhub.io/

Restart dev server after updating:

```bash
npm run dev
```

---

## 📸 Screenshots

Add screenshots here:

### Dashboard

![Dashboard Screenshot](./screenshots/dashboard.png)

### Portfolio

![Portfolio Screenshot](./screenshots/portfolio.png)

### Charts & News

![Charts Screenshot](./screenshots/chart.png)

---

## 📌 Future Improvements

Planned:

- Authentication (Google Login)
- Backend Integration (Express + MongoDB)
- Persist watchlists in database
- Real-time updates using WebSockets
- Notifications system
- AI sentiment analysis
- Testing
- Deployment
- SEO optimization

---

## 🌐 Deployment

Frontend deployment:

Recommended:

- Vercel
- Netlify

---

## 🧠 Learnings

This project helped in learning:

- React state management
- API integration
- localStorage persistence
- Component architecture
- Responsive UI design
- Charts and data visualization
- Error handling patterns
- Portfolio calculations
- Building scalable frontend applications

---

## 👤 Author

Built by **Your Name**

GitHub:

LinkedIn:

Portfolio:
