const state = require("../utils/state")
const discord = require("./discord")
const db = require("./db")
const { createBackup } = require("./backup")

const ccuChart = require("./charts/ccuChart")
const sessionChart = require("./charts/sessionChart")
const revenueChart = require("./charts/revenueChart")

setInterval(() => {
  discord.send(process.env.DISCORD_CHANNEL_LIVE_CCU, `Current CCU: ${state.ccu}`)
}, 5 * 60 * 1000)

setInterval(() => {
  const avgSession = state.daily.sessionCount
    ? Math.round(state.daily.totalSessionTime / state.daily.sessionCount / 60)
    : 0

  const avgCCU = state.daily.ccuSamples.length
    ? Math.round(state.daily.ccuSamples.reduce((a, b) => a + b) / state.daily.ccuSamples.length)
    : 0

  const peakCCU = Math.max(...state.daily.ccuSamples, 0)
  const date = new Date().toISOString().slice(0, 10)

  db.run(
    `INSERT OR REPLACE INTO daily_kpis VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [date, avgCCU, peakCCU, state.daily.revenue, avgSession, state.daily.joins]
  )

  discord.send(
    process.env.DISCORD_CHANNEL_DAILY,
    `Daily KPIs
Joins: ${state.daily.joins}
Revenue: ${state.daily.revenue}
Avg Session Length: ${avgSession} min`
  )

  createBackup()

  state.daily = { joins: 0, revenue: 0, totalSessionTime: 0, sessionCount: 0, ccuSamples: [] }
}, 24 * 60 * 60 * 1000)

setInterval(async () => {
  db.all(`SELECT * FROM daily_kpis ORDER BY date DESC LIMIT 7`, async (_, rows) => {
    if (!rows.length) return

    const c1 = await ccuChart(rows)
    const c2 = await sessionChart(rows)
    const c3 = await revenueChart(rows)

    discord.send(
      process.env.DISCORD_CHANNEL_WEEKLY,
      `Weekly Summary\nPeak CCU: ${Math.max(...rows.map(r => r.peak_ccu))}`,
      [c1, c2, c3]
    )
  })
}, 7 * 24 * 60 * 60 * 1000)