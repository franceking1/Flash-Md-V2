import moment from 'moment-timezone'
import { downloadMediaMessage } from '@whiskeysockets/baileys'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import CONFIG from './config.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export const seenStatusIds = new Set()

export function logStatus(participant, messageId, pushName, statusType = 'unknown', caption = '') {
  const timestamp = moment().tz(CONFIG.TZ).format('DD/MM/YYYY HH:mm:ss')
  const userPhone = getStatusUserPhone(participant)
  const formattedPhone = formatPhoneNumber(userPhone)

  console.log(`\n[📅 ${timestamp}] [📊 STATUS UPDATE]`)
  console.log(`├─ 👤 From: ${pushName || 'Unknown'} (${formattedPhone})`)
  console.log(`├─ 🔑 JID: ${participant}`)
  console.log(`├─ 🆔 Message ID: ${messageId}`)
  console.log(`├─ 📎 Type: ${statusType}`)
  if (caption) console.log(`├─ 📝 Content: ${caption.substring(0, 100)}`)
  console.log(`├─ 👁️ Auto View: ${CONFIG.AUTO_VIEW === true ? '✅ ON' : '❌ OFF'}`)
  console.log(`├─ ❤️ Auto Like: ${CONFIG.AUTO_LIKE === true ? '✅ ON' : '❌ OFF'}`)
  console.log(`└─ 📖 Auto Read: ${CONFIG.AUTO_READ === true ? '✅ ON' : '❌ OFF'}\n`)
}

export function getStatusUserPhone(statusJid) {
  if (!statusJid) return 'Unknown'
  return statusJid.split('@')[0]
}

function formatPhoneNumber(phone) {
  if (!phone || phone === 'Unknown') return 'Unknown'
  const cleaned = phone.replace(/[^\d+]/g, '')
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

export async function processStatusMessage(msg, sock) {
  if (!msg.message || msg.key.remoteJid !== 'status@broadcast') return
  
  if (msg.key.fromMe === true) return

  const id = msg.key.id
  if (seenStatusIds.has(id)) return

  const isLid = msg.key.addressingMode === 'lid'
  const resolvedKey = isLid
    ? { ...msg.key, participant: msg.key.remoteJidAlt || msg.key.participant }
    : msg.key

  let statusPosterJid = msg.key.participant || msg.key.remoteJidAlt || 'Unknown'
  let statusType = 'unknown'
  let statusCaption = ''

  try {
    if (msg.message?.imageMessage) {
      statusType = 'image'
      statusCaption = msg.message.imageMessage.caption || ''
    } else if (msg.message?.videoMessage) {
      statusType = 'video'
      statusCaption = msg.message.videoMessage.caption || ''
    } else if (msg.message?.conversation) {
      statusType = 'text'
      statusCaption = msg.message.conversation
    } else if (msg.message?.extendedTextMessage) {
      statusType = 'text'
      statusCaption = msg.message.extendedTextMessage.text || ''
    } else if (msg.message?.audioMessage) {
      statusType = 'audio'
    } else if (msg.message?.documentMessage) {
      statusType = 'document'
    }

    if (CONFIG.AUTO_VIEW === true) {
      await sock.readMessages([resolvedKey])
      console.log(`✅ Viewed status: ${statusPosterJid.split('@')[0]} [${id}]`)
    }

    if (CONFIG.AUTO_LIKE === true) {
      setTimeout(async () => {
        try {
          await sock.sendMessage('status@broadcast', {
            react: { text: '🤍', key: msg.key }
          })
          console.log(`🤍 Liked status from: ${statusPosterJid}`)
        } catch (reactErr) {
          console.error(`❌ Failed to like status: ${reactErr.message}`)
        }
      }, 2000)
    }

    seenStatusIds.add(id)
    if (seenStatusIds.size > 1000) {
      const firstKey = seenStatusIds.values().next().value
      seenStatusIds.delete(firstKey)
    }

    let senderName = msg.pushName || 'Unknown'
    if (statusPosterJid !== 'Unknown') {
      try {
        const contact = await sock.onWhatsApp(statusPosterJid)
        if (contact && contact[0]) {
          senderName = contact[0].notify || senderName
        }
      } catch {}
    }

    logStatus(statusPosterJid, id, senderName, statusType, statusCaption)

  } catch (err) {
    console.error('[AUTO-VIEW] Error viewing status:', err)
  }
}

export async function handleStatusReply(msg, sock, senderJid) {
  const tempDir = '/tmp/flash-md-temp'
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true })
  }

  try {
    const contextInfo = msg.message?.extendedTextMessage?.contextInfo
    const quotedMsg = contextInfo?.quotedMessage
    const commandText = msg.message?.conversation || msg.message?.extendedTextMessage?.text || ''
    const normalizedCommand = commandText.toLowerCase().trim()
    const statusCommands = ['share', 'send', 'tuma', 'nitumie']
    const isStatusReply = contextInfo?.participant && quotedMsg

    if (statusCommands.includes(normalizedCommand) && isStatusReply) {
      const recipientJid = senderJid
      let sendMsg
      const quotedMsgWrapper = { message: quotedMsg }

      if (quotedMsg.imageMessage) {
        const buffer = await downloadMediaMessage(quotedMsgWrapper, 'buffer', {}, { logger: console })
        const filePath = path.join(tempDir, `${Date.now()}-status-image.jpg`)
        fs.writeFileSync(filePath, buffer)
        sendMsg = { image: { url: filePath }, caption: '📸 Sent by *Flash-Md-V3* !' }
      } else if (quotedMsg.videoMessage) {
        const buffer = await downloadMediaMessage(quotedMsgWrapper, 'buffer', {}, { logger: console })
        const filePath = path.join(tempDir, `${Date.now()}-status-video.mp4`)
        fs.writeFileSync(filePath, buffer)
        sendMsg = { video: { url: filePath }, caption: '🎥 Sent by *Flash-Md-V3* !' }
      } else if (quotedMsg.stickerMessage) {
        const buffer = await downloadMediaMessage(quotedMsgWrapper, 'buffer', {}, { logger: console })
        const filePath = path.join(tempDir, `${Date.now()}-status-sticker.webp`)
        fs.writeFileSync(filePath, buffer)
        sendMsg = { sticker: { url: filePath } }
      } else {
        return false
      }

      await sock.sendMessage(recipientJid, sendMsg, { quoted: msg })

      const fileUrl = sendMsg.image?.url || sendMsg.video?.url || sendMsg.sticker?.url
      if (fileUrl) {
        try { await fs.promises.unlink(fileUrl) } catch {}
      }
      return true
    }
  } catch (err) {
    console.error(`Error in status reply: ${err.message}`)
  }
  return false
}
