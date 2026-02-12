const state = require("./state")
const discord = require("./discord")
const db = require("./db")
const { createBackup } = require("./backup")

const ccuChart = require("./charts/ccuChart")
const sessionChart = require("./charts/sessionChart")
const revenueChart = require("./charts/revenueChart")


// live CCU (every 5 minutes)

setInterval(() => {
  discord.send(
    process.env.DISCORD_THREAD_LIVE_CCU,
    `Current CCU: ${state.ccu}`
  )
}, 5 * 60 * 1000)


//daily aggregation

setInterval(() => {
  const avgSession = state.daily.sessionCount
    ? Math.round(state.daily.totalSessionTime / state.daily.sessionCount / 60)
    : 0

  const avgCCU = state.daily.ccuSamples.length
    ? Math.round(
        state.daily.ccuSamples.reduce((a, b) => a + b) /
        state.daily.ccuSamples.length
      )
    : 0

  const peakCCU = Math.max(...state.daily.ccuSamples, 0)
  const date = new Date().toISOString().slice(0, 10)

  db.run(
    `INSERT OR REPLACE INTO daily_kpis VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)`,
    [date, avgCCU, peakCCU, state.daily.revenue, avgSession, state.daily.joins]
  )

  discord.send(
    process.env.DISCORD_THREAD_DAILY,
    `Daily KPIs
    Date: ${date}
    Joins: ${state.daily.joins}
    Revenue: ${state.daily.revenue}
    Avg Session Length: ${avgSession} min`
  )

  createBackup()

  state.daily = {
    joins: 0,
    revenue: 0,
    totalSessionTime: 0,
    sessionCount: 0,
    ccuSamples: []
  }
}, 24 * 60 * 60 * 1000)



//weekly report

setInterval(() => {
  db.all(
    `SELECT * FROM daily_kpis ORDER BY date DESC LIMIT 7`,
    async (_, rows) => {
      if (!rows.length) return

      const c1 = await ccuChart(rows)
      const c2 = await sessionChart(rows)
      const c3 = await revenueChart(rows)

      const peak = Math.max(...rows.map(r => r.peak_ccu))
      const totalRevenue = rows.reduce((s, r) => s + r.total_revenue, 0)

      await discord.send(
        process.env.DISCORD_THREAD_WEEKLY,
        `Weekly Summary
Peak CCU: ${peak}
Total Revenue: ${totalRevenue}`,
        [c1, c2, c3]
      )
    }
  )
}, 7 * 24 * 60 * 60 * 1000)


//hourly revenue spike detection

const MULTIPLIER = 2.0
const MIN_ABSOLUTE_THRESHOLD = 2000 // change accordingly to your game
const COOLDOWN_HOURS = 3

let lastAlertTime = 0

function getCurrentHourKey() {
  const d = new Date()
  return d.toISOString().slice(0, 13)
}

setInterval(() => {
  const hourKey = getCurrentHourKey()

  if (!state.hourly.currentHour) {
    state.hourly.currentHour = hourKey
    return
  }

  if (hourKey !== state.hourly.currentHour) {
    const revenue = state.hourly.revenue

    db.run(
      `INSERT OR REPLACE INTO hourly_revenue (hour, revenue) VALUES (?, ?)`,
      [state.hourly.currentHour, revenue]
    )

    db.all(
      `SELECT revenue FROM hourly_revenue
       ORDER BY hour DESC
       LIMIT 24`,
      [],
      (err, rows) => {
        if (!rows || rows.length < 5) return

        const avg =
          rows.reduce((sum, r) => sum + r.revenue, 0) /
          rows.length

        const now = Date.now()
        const cooldownPassed =
          now - lastAlertTime > COOLDOWN_HOURS * 60 * 60 * 1000

        if (
          revenue > avg * MULTIPLIER &&
          revenue >= MIN_ABSOLUTE_THRESHOLD &&
          cooldownPassed
        ) {
          discord.send(
            process.env.DISCORD_THREAD_ALERTS,
            `Revenue Spike Detected
Hour: ${state.hourly.currentHour}
Revenue: ${revenue}
24h Avg: ${Math.round(avg)}
Multiplier: ${(revenue / avg).toFixed(2)}x`
          )

          lastAlertTime = now
        }
      }
    )

    state.hourly.revenue = 0
    state.hourly.currentHour = hourKey
  }
}, 60 * 1000)
