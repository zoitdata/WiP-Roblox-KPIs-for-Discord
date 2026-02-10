# 🎮 Roblox Experience KPIs for Discord

A self-hosted **Roblox analytics backend** that collects in-game KPIs and posts reports, charts, and statistics directly to **Discord**.

This project allows Roblox developers to track player activity, session behavior, and monetization metrics without relying on third-party analytics platforms.

---

## ✨ Features

- 📊 Live **Concurrent Users (CCU)** tracking  
- ⏱ **Session length** analytics  
- 💰 **Gamepass & Developer Product** sales tracking  
- 📈 **Daily & weekly KPI aggregation**  
- 🖼 Automatic **chart generation**  
- 🤖 **Discord bot** for reporting and alerts  
- 🗄 Uses **SQLite** (no external database required)  
- 🔐 Secure **signed HTTP requests** from game servers  

---

## 🧱 How It Works


Roblox Game Servers
↓
Signed HTTP Requests
↓
Node.js Backend
↓
SQLite Database
↓
Charts & Aggregated Data
↓
Discord Channel Reports


---

## 🛠 Tech Stack

- Node.js
- SQLite
- Discord Bot API
- Roblox Server Scripts

---

## 📁 Project Structure

```text
├── Backend/
│   └── 🚀 Scripts for the Cloud Server
├── Backups/
│   └── 💾 Automated Backups
├── Charts/
│   └── 📊 Chart logic
├── Roblox/
│   └── 🎮 Roblox-side code
├── .env
└── README.md
```


---

## 🚀 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/zoitdata/Game-KPI-s-for-Discord.git
cd Game-KPI-s-for-Discord
```

---

### 2. Install Dependencies

Make sure Node.js v16 or newer is installed:
````
npm install
````

---

### 3. Environment Configuration

Create a .env file:
cp .env.example .env


Edit the .env file and configure your values:
````
DISCORD_TOKEN=your_discord_bot_token
DISCORD_CHANNEL_ID=your_channel_id
PORT=3000
SECRET_KEY=shared_secret_key
DATABASE_PATH=./database/data.sqlite

````

Variable names may vary depending on the implementation.
Check where environment variables are used in the code.

---

### 4. Discord Bot Setup

- Go to the Discord Developer Portal
- Create a new application
- Add a bot
- Copy the bot token
- Invite the bot to your server with:
- Send Messages
- Embed Links
- Attach Files

---

### 5. Run the Backend
````
node index.js
````

For production use:
````
npm install -g pm2
pm2 start index.js --name game-kpi-backend
````

---

## 🎮 Roblox Integration

The robloxscripts/ folder contains scripts meant to run on Roblox servers.

These scripts:

Track player joins and leaves

Measure session durations

Track purchases

Send signed HTTP requests to the backend

Before using them:

Update the backend URL

Match the SECRET_KEY

Enable HttpService in Roblox Studio

---

## 📊 Reporting

The backend automatically:

Aggregates metrics daily and weekly

Generates charts

Sends reports directly to Discord channels

This enables passive monitoring and long-term trend tracking directly from Discord.

---

## ⚠️ Notes

This project is not plug-and-play

Requires basic knowledge of:

Node.js

Discord bots

Roblox server scripting

No web dashboard is included

Intended for self-hosting
