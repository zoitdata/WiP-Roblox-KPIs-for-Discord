require("dotenv").config()
const express = require("express")
const api = require("./api")
require("./discord")
require("./scheduler")

const app = express()
app.set("trust proxy", 1)
app.use(express.json())
app.use("/roblox", api)

app.listen(process.env.SERVER_PORT)