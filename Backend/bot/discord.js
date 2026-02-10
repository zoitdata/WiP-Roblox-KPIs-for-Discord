const { Client, GatewayIntentBits } = require("discord.js")

const client = new Client({ intents: [GatewayIntentBits.Guilds] })
client.login(process.env.DISCORD_BOT_TOKEN)

client.once("ready", () => {
  console.log("Discord bot connected")
})

function send(channelId, content, files = []) {
  const channel = client.channels.cache.get(channelId)
  if (!channel) return
  channel.send({ content, files })
}

module.exports = { send }