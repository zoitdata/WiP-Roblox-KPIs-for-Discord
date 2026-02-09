# Roblox Analytics Backend

A production-ready analytics backend that connects Roblox game servers with Discord.
It collects live and aggregated KPIs, stores them persistently, and generates daily and weekly reports including dark-mode charts.

---

## Features

- Live CCU tracking
- Session length measurement
- In-game purchase tracking (Gamepasses & Developer Products)
- Daily KPI aggregation
- Weekly reports with multiple dark-mode charts
- Discord integration (Live / Daily / Weekly / Alerts)
- Secure request authentication (shared secret + replay protection)
- Persistent storage using SQLite
- Automatic rolling backups
- 24/7 operation with pm2
- HTTPS-ready (behind reverse proxy)

---

## Architecture Overview

```text
Roblox Server
  └─ HTTP requests (signed)
       ↓
Node.js Backend (24/7)
  ├─ Live state (RAM)
  ├─ Daily aggregation
  ├─ SQLite persistence
  ├─ Weekly chart generation
  └─ Discord reporting


