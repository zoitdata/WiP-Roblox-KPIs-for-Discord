const express = require("express")
const state = require("../utils/state")
const discord = require("../bot/discord")
const auth = require("./auth")

const router = express.Router()

router.post("/ccu", auth, (req, res) => {
  const ccu = req.body.ccu
  state.ccu = ccu
  state.daily.ccuSamples.push(ccu)

  if (ccu > state.weekly.peakCCU) state.weekly.peakCCU = ccu

  if (ccu >= 500 && state.alerts.lastCCU < 500) {
    discord.send(process.env.DISCORD_CHANNEL_ALERTS, `CCU alert\nCurrent CCU: ${ccu}`)
  }

  state.alerts.lastCCU = ccu
  res.sendStatus(200)
})

router.post("/join", auth, (req, res) => {
  state.daily.joins++
  res.sendStatus(200)
})

router.post("/purchase", auth, (req, res) => {
  const { receiptId, amount } = req.body
  if (state.processedReceipts.has(receiptId)) return res.sendStatus(200)

  state.processedReceipts.add(receiptId)
  state.daily.revenue += amount

  if (amount >= 20000) {
    discord.send(process.env.DISCORD_CHANNEL_ALERTS, `Revenue alert\nAmount: ${amount}`)
  }

  res.sendStatus(200)
})

router.post("/session/start", auth, (req, res) => {
  state.sessions.set(req.body.playerId, req.body.timestamp)
  res.sendStatus(200)
})

router.post("/session/end", auth, (req, res) => {
  const start = state.sessions.get(req.body.playerId)
  if (start) {
    state.daily.totalSessionTime += req.body.timestamp - start
    state.daily.sessionCount++
    state.sessions.delete(req.body.playerId)
  }
  res.sendStatus(200)
})

module.exports = router