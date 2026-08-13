import {
  Client,
  GatewayIntentBits,
  Partials,
  PermissionFlagsBits,
} from 'discord.js'
import { answerQuestion, knowledge } from './knowledge.js'

const token = process.env.DISCORD_TOKEN
if (!token) {
  console.error('Set DISCORD_TOKEN in the environment.')
  process.exit(1)
}

const MOD_LOG = process.env.ODIN_MOD_LOG_CHANNEL_ID || ''
const BANNED = (process.env.ODIN_BANNED_PHRASES || 'free nitro,steam gift,crypto giveaway')
  .split(',')
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean)

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildModeration,
  ],
  partials: [Partials.Channel],
})

client.once('ready', () => {
  console.log(`Odin online as ${client.user.tag}`)
  console.log(`Knowledge org: ${knowledge.identity.org}`)
})

client.on('messageCreate', async (message) => {
  if (!message.guild || message.author.bot) return

  const content = message.content || ''
  const lower = content.toLowerCase()

  // Light moderation — delete obvious scam bait
  if (BANNED.some((phrase) => lower.includes(phrase))) {
    try {
      await message.delete()
      await message.channel.send({
        content: `${message.author}, that message looked like scam spam and was removed by Odin.`,
      })
      if (MOD_LOG) {
        const ch = await client.channels.fetch(MOD_LOG).catch(() => null)
        if (ch?.isTextBased()) {
          await ch.send(`Removed scam-like message from ${message.author.tag} in #${message.channel.name}`)
        }
      }
    } catch (err) {
      console.warn('Moderation action failed', err.message)
    }
    return
  }

  const mentioned = message.mentions.has(client.user)
  const addressed = /^(odin[,:]?\s+|!odin\s+)/i.test(content)
  if (!mentioned && !addressed) return

  const question = content
    .replace(new RegExp(`<@!?${client.user.id}>`, 'g'), '')
    .replace(/^(odin[,:]?\s+|!odin\s+)/i, '')
    .trim()

  const reply = answerQuestion(question || 'what is valhalla')
  await message.reply({ content: reply.slice(0, 1800) })
})

client.on('interactionCreate', async (interaction) => {
  if (!interaction.isChatInputCommand()) return
  if (interaction.commandName !== 'ask') return
  const q = interaction.options.getString('question', true)
  await interaction.reply({ content: answerQuestion(q).slice(0, 1800) })
})

client.login(token)

/** Optional: register /ask — run once with DISCORD_REGISTER_COMMANDS=1 */
if (process.env.DISCORD_REGISTER_COMMANDS === '1') {
  // Lazy register via REST when operators opt in — see README.
  console.log('Set commands via Discord Developer Portal or a one-shot register script.')
}

export function canModerate(member) {
  return member?.permissions?.has(PermissionFlagsBits.ModerateMembers)
}
