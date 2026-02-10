const fs = require("fs")
const path = require("path")

const DB = path.join(__dirname, "analytics.db")
const DIR = path.join(__dirname, "backups")
const KEEP = 14

if (!fs.existsSync(DIR)) fs.mkdirSync(DIR)

function createBackup() {
  const date = new Date().toISOString().slice(0, 10)
  fs.copyFileSync(DB, path.join(DIR, `analytics-${date}.db`))

  const files = fs.readdirSync(DIR).sort()
  if (files.length > KEEP) {
    files.slice(0, files.length - KEEP).forEach(f =>
      fs.unlinkSync(path.join(DIR, f))
    )
  }
}

module.exports = { createBackup }
