// @02zoit | 17.02.2026

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require("discord.js")

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
})

let isReady = false


client.once("ready", () => {
  isReady = true
  console.log(`Discord bot connected as ${client.user.tag}`)
})

client.on("error", err => {
  console.error("Discord client error:", err)
})

client.login(process.env.DISCORD_BOT_TOKEN)


async function resolveChannel(channelId) {
  try {
    const channel = await client.channels.fetch(channelId)

    // If thread is archived, try to unarchive
    if (channel?.isThread() && channel.archived) {
      await channel.setArchived(false)
    }

    return channel
  } catch (err) {
    console.error(`Failed to fetch channel ${channelId}:`, err)
    return null
  }
}


function ensureReady() {
  if (!isReady) {
    console.warn("Discord not ready yet.")
    return false
  }
  return true
}


async function send(channelId, content, files = []) {
  if (!ensureReady()) return

  const channel = await resolveChannel(channelId)
  if (!channel) return

  try {
    await channel.send({ content, files })
  } catch (err) {
    console.error("Send error:", err)
  }
}


async function sendEmbed(channelId, options) {
  if (!ensureReady()) return

  const channel = await resolveChannel(channelId)
  if (!channel) return

  const embed = new EmbedBuilder()
    .setColor(options.color || 0x2f3136)
    .setTitle(options.title || "")
    .setDescription(options.description || "")
    .setTimestamp()

  if (options.fields) {
    embed.addFields(options.fields)
  }

  if (options.footer) {
    embed.setFooter({ text: options.footer })
  }

  try {
    await channel.send({ embeds: [embed] })
  } catch (err) {
    console.error("Embed send error:", err)
  }
}


async function sendRevenueSpike(channelId, data) {
  return sendEmbed(channelId, {
    color: 0xff3b3b,
    title: "Revenue Spike Detected",
    fields: [
      { name: "Hour", value: data.hour, inline: true },
      { name: "Revenue", value: String(data.revenue), inline: true },
      { name: "24h Average", value: String(data.average), inline: true },
      { name: "Multiplier", value: `${data.multiplier}x`, inline: true }
    ]
  })
}


async function sendDailySummary(channelId, data) {
  return sendEmbed(channelId, {
    color: 0x3b82f6,
    title: "Daily KPI Summary",
    fields: [
      { name: "Date", value: data.date, inline: true },
      { name: "Joins", value: String(data.joins), inline: true },
      { name: "Revenue", value: String(data.revenue), inline: true },
      { name: "Avg Session Length", value: `${data.session} min`, inline: true }
    ]
  })
}


async function sendWeeklySummary(channelId, data, files) {
  return send(channelId,
`Weekly Summary

Peak CCU: ${data.peak}
Total Revenue: ${data.totalRevenue}`,
  files)
}

module.exports = {
  send,
  sendEmbed,
  sendRevenueSpike,
  sendDailySummary,
  sendWeeklySummary
}
