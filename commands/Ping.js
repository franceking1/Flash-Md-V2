
import now from 'performance-now'

if (!global.botStartTime) global.botStartTime = Date.now()

export const commands = [
  {
    name: 'ping',
    aliases: ['latency', 'speed'],
    description: "Checks the bot's response time",
    category: 'General',

    execute: async ({ sock, from, msg }) => {
      const start = now()
      const jid = from
      const senderId = (msg.key.participant || msg.key.remoteJid).split('@')[0]

      const pingMsg = await sock.sendMessage(
        jid,
        { text: 'Pinging...' },
        {
          quoted: {
            key: {
              fromMe: false,
              participant: '0@s.whatsapp.net',
              remoteJid: 'status@broadcast'
            },
            message: {
              contactMessage: {
                displayName: 'FLASH-MD-V3',
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Flash-MD;;;\nFN:FLASH-MD-V3\nitem1.TEL;waid=${senderId}:${senderId}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
              }
            }
          }
        }
      )

      const latency = Math.round(now() - start)

      await sock.relayMessage(
        jid,
        {
          protocolMessage: {
            key: pingMsg.key,
            type: 14,
            editedMessage: {
              conversation: `🏓 Pong!\n⏱️ *_Flash-MD-V3 Speed: ${latency} ms_*`
            }
          }
        },
        {}
      )
    }
  },
  {
    name: 'uptime',
    aliases: ['runtime'],
    description: 'Displays the bot uptime',
    category: 'General',

    execute: async ({ sock, from, msg }) => {
      const uptime = Date.now() - global.botStartTime
      const formatted = formatUptime(uptime)
      const senderId = (msg.key.participant || msg.key.remoteJid).split('@')[0]

      await sock.sendMessage(
        from,
        { text: `*_FLASH-MD-V3 UPTIME: ${formatted}_*` },
        {
          quoted: {
            key: {
              fromMe: false,
              participant: '0@s.whatsapp.net',
              remoteJid: 'status@broadcast'
            },
            message: {
              contactMessage: {
                displayName: 'FLASH-MD-V3',
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;Flash-MD;;;\nFN:FLASH-MD-V3\nitem1.TEL;waid=${senderId}:${senderId}\nitem1.X-ABLabel:Mobile\nEND:VCARD`
              }
            }
          }
        }
      )
    }
  }
]

function formatUptime(ms) {
  const sec = Math.floor(ms / 1000) % 60
  const min = Math.floor(ms / (1000 * 60)) % 60
  const hr = Math.floor(ms / (1000 * 60 * 60)) % 24
  const day = Math.floor(ms / (1000 * 60 * 60 * 24))

  const parts = []

  if (day) parts.push(`${day} day${day > 1 ? 's' : ''}`)
  if (hr) parts.push(`${hr} h`)
  if (min) parts.push(`${min} m`)
  parts.push(`${sec} s`)

  return parts.join(', ')
} 
