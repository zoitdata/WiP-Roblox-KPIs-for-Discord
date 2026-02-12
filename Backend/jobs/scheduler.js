const MULTIPLIER = 2.0
const MIN_ABSOLUTE_THRESHOLD = 2000
const COOLDOWN_HOURS = 3

let lastAlertTime = 0

function getCurrentHourKey() {
  const d = new Date()
  return d.toISOString().slice(0, 13) // YYYY-MM-DDTHH
}

// Hourly Revenue Spike Detection
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
          rows.reduce((sum, r) => sum + r.revenue, 0) / rows.length

        const now = Date.now()
        const cooldownPassed =
          now - lastAlertTime > COOLDOWN_HOURS * 60 * 60 * 1000

        if (
          revenue > avg * MULTIPLIER &&
          revenue >= MIN_ABSOLUTE_THRESHOLD &&
          cooldownPassed
        ) {
          discord.send(
            process.env.DISCORD_CHANNEL_ALERTS,
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
