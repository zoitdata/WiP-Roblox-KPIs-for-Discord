const sqlite3 = require("sqlite3").verbose()
const path = require("path")

const db = new sqlite3.Database(path.join(__dirname, "analytics.db"))

db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS daily_kpis (
      date TEXT PRIMARY KEY,
      avg_ccu INTEGER,
      peak_ccu INTEGER,
      total_revenue INTEGER,
      avg_session_length INTEGER,
      total_joins INTEGER,
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `)
})

module.exports = db
