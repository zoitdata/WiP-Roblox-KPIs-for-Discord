const crypto = require("crypto")
const MAX_AGE = 60

module.exports = function auth(req, res, next) {
  const sig = req.header("X-Signature")
  const ts = req.header("X-Timestamp")

  if (!sig || !ts) return res.sendStatus(401)
  if (Math.abs(Date.now() / 1000 - Number(ts)) > MAX_AGE) return res.sendStatus(401)

  const raw = `${JSON.stringify(req.body)}|${ts}|${process.env.API_SHARED_SECRET}`
  const expected = crypto.createHash("sha256").update(raw).digest("hex")

  if (!sig.endsWith(expected)) return res.sendStatus(401)
  next()
}