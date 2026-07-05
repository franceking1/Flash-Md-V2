import moment from 'moment-timezone'
import CONFIG from './config.js'

const antiDeleteCache = new Set()
const antiEditCache = new Set()
export const messageStore = new Map()

export function cleanMessageStore() {
  const now = Date.now()
  const tenMinutes = 10 * 60 * 1000
  for (const [key, value] of messageStore.entries()) {
    if (now - value.timestamp > tenMinutes) messageStore.delete(key)
  }
}

function getPhoneFromJid(jid) {
  if (!jid) return null
  if (jid.includes('@s.whatsapp.net')) {
    const match = jid.match(/^(\d+)@/)
    return match ? match[1] : null
  }
  if (jid.includes('@lid')) {
    const match = jid.match(/^(\d+)@lid/)
    return match ? match[1] : null
  }
  const match = jid.match(/^(\d+):/)
  if (match) return match[1]
  const simpleMatch = jid.match(/^(\d+)@/)
  return simpleMatch ? simpleMatch[1] : null
}

function getCleanJid(jid) {
  if (!jid) return null
  if (jid.includes(':')) {
    const parts = jid.split(':')
    return parts[0] + '@' + parts[1].split('@')[1]
  }
  return jid
}

function getUserNumber(jid, lidToPhoneMap) {
  if (!jid) return 'Unknown'
  const cleanJid = getCleanJid(jid)
  const phone = getPhoneFromJid(cleanJid)
  if (phone) return phone
  if (lidToPhoneMap.has(cleanJid)) return lidToPhoneMap.get(cleanJid)
  return cleanJid.split('@')[0]
}

function formatPhoneNumber(phone) {
  if (!phone || phone === 'Unknown') return 'Unknown'
  const cleaned = phone.replace(/[^\d+]/g, '')
  return cleaned.startsWith('+') ? cleaned : `+${cleaned}`
}

function logAntiDelete(chatName, deletedBy, phone, time, originalMsg, senderName, senderNumber) {
  const timestamp = moment().tz(CONFIG.TZ).format('DD/MM/YYYY HH:mm:ss')
  console.log(`\n[📅 ${timestamp}] [🗑️ ANTI-DELETE]`)
  console.log(`├─ 💬 Chat: ${chatName}`)
  console.log(`├─ 👤 Deleted By: ${deletedBy} (${formatPhoneNumber(senderNumber)})`)
  if (senderName && senderName !== deletedBy) console.log(`├─ 📛 Original Sender: ${senderName} (${formatPhoneNumber(phone)})`)
  console.log(`├─ 🗓️ Time: ${time}`)
  console.log(`└─ 📱 Original: "${originalMsg.substring(0, 50)}${originalMsg.length > 50 ? '...' : ''}"\n`)
}

function logAntiEdit(chatName, editedBy, phone, time, originalMsg, editedMsg, senderName, senderNumber) {
  const timestamp = moment().tz(CONFIG.TZ).format('DD/MM/YYYY HH:mm:ss')
  console.log(`\n[📅 ${timestamp}] [✏️ ANTI-EDIT]`)
  console.log(`├─ 💬 Chat: ${chatName}`)
  console.log(`├─ 👤 Edited By: ${editedBy} (${formatPhoneNumber(senderNumber)})`)
  if (senderName && senderName !== editedBy) console.log(`├─ 📛 Original Sender: ${senderName} (${formatPhoneNumber(phone)})`)
  console.log(`├─ 🗓️ Time: ${time}`)
  console.log(`├─ 📱 Original: "${originalMsg.substring(0, 50)}${originalMsg.length > 50 ? '...' : ''}"`)
  console.log(`└─ 📝 Edited to: "${editedMsg.substring(0, 50)}${editedMsg.length > 50 ? '...' : ''}"\n`)
}

export async function handleDeletedMessage(msg, sock, getRealSenderJid, getOwnerJid, lidToPhoneMap) {
  const protocolMsg = msg.message.protocolMessage
  if (!protocolMsg || protocolMsg.type !== 0) return
  const deletedMsgKey = protocolMsg.key
  const deletedMsgId = deletedMsgKey.id
  const deleterJid = getRealSenderJid(msg)
  const from = msg.key.remoteJid
  if (deleterJid === sock.user.id) return
  
  const cacheKey = `${deletedMsgId}_${deleterJid}_delete`
  if (antiDeleteCache.has(cacheKey)) return
  antiDeleteCache.add(cacheKey)
  setTimeout(() => antiDeleteCache.delete(cacheKey), 5000)
  
  const deletedMsg = messageStore.get(deletedMsgId)
  if (!deletedMsg) return
  
  const deleterNumber = getUserNumber(deleterJid, lidToPhoneMap)
  const formattedDeleterPhone = formatPhoneNumber(deleterNumber)
  let deleterName = deleterNumber
  let deleterMention = deleterJid
  
  try {
    const deleterContact = await sock.onWhatsApp(deleterJid)
    if (deleterContact?.length > 0) {
      deleterName = deleterContact[0].name || deleterContact[0].pushname || deleterNumber
      deleterMention = deleterContact[0].jid || deleterJid
    }
  } catch { deleterName = deleterNumber }
  
  let chatName = ''
  let chatType = 'Personal'
  let chatMention = null
  const date = moment().tz(CONFIG.TZ).format('DD/MM/YYYY')
  const time = moment().tz(CONFIG.TZ).format('HH:mm:ss')
  
  if (from.endsWith('@g.us')) {
    try {
      const metadata = await sock.groupMetadata(from)
      const deleterParticipant = metadata.participants.find(p => p.id === deleterJid)
      deleterName = deleterParticipant?.name || deleterParticipant?.notify || deleterName
      chatName = metadata.subject
      chatType = 'Group'
      chatMention = from
    } catch { chatName = 'Unknown Group' }
  } else if (from.endsWith('status@broadcast')) {
    chatName = 'Status Update'
    chatType = 'Status'
    deleterName = msg.pushName || deleterName
  } else {
    try {
      const chatContact = await sock.onWhatsApp(from)
      if (chatContact?.length > 0) {
        chatName = chatContact[0].name || chatContact[0].pushname || deleterName
      } else {
        chatName = deleterName
      }
    } catch {
      chatName = deleterName
    }
  }
  
  const originalMsgBody =
    deletedMsg.message?.conversation ||
    deletedMsg.message?.extendedTextMessage?.text ||
    deletedMsg.message?.imageMessage?.caption ||
    deletedMsg.message?.videoMessage?.caption ||
    deletedMsg.message?.stickerMessage?.caption ||
    deletedMsg.message?.documentMessage?.caption ||
    '[Media Message]'
  
  const ownerJid = getOwnerJid()
  if (ownerJid) {
    const mentions = [deleterMention]
    if (chatMention) mentions.push(chatMention)
    
    await sock.sendMessage(ownerJid, {
      text: `*⚡ FLASH-MD ANTI-DELETE ⚡*\n\n*💬 Chat:* @${deleterName.replace(/\s/g, '')} ${chatType === 'Group' ? `(${chatName})` : ''}\n*📌 Type:* ${chatType}\n*👤 Deleted By:* @${deleterName.replace(/\s/g, '')}\n*📞 Number:* ${formattedDeleterPhone}\n*📅 Date:* ${date}\n*⏰ Time:* ${time}\n\n*🗑️ The following message was deleted:*`,
      mentions: mentions
    })
    await sock.sendMessage(ownerJid, { forward: deletedMsg })
  }
  logAntiDelete(chatName, deleterName, '', time, originalMsgBody, '', deleterNumber)
  messageStore.delete(deletedMsgId)
}

export async function handleEditedMessage(msg, sock, getRealSenderJid, getOwnerJid, lidToPhoneMap) {
  const protocolMsg = msg.message.protocolMessage
  if (!protocolMsg || protocolMsg.type !== 14) return
  if (!CONFIG.ANTIEDIT) return
  
  const editedMsgKey = protocolMsg.key
  const editedMsgId = editedMsgKey.id
  const editorJid = getRealSenderJid(msg)
  const from = msg.key.remoteJid
  if (editorJid === sock.user.id) return
  
  const cacheKey = `${editedMsgId}_${editorJid}_edit`
  if (antiEditCache.has(cacheKey)) return
  antiEditCache.add(cacheKey)
  setTimeout(() => antiEditCache.delete(cacheKey), 5000)
  
  const originalMsg = messageStore.get(editedMsgId)
  if (!originalMsg) return
  
  const editorNumber = getUserNumber(editorJid, lidToPhoneMap)
  const formattedEditorPhone = formatPhoneNumber(editorNumber)
  let editorName = editorNumber
  let editorMention = editorJid
  
  try {
    const editorContact = await sock.onWhatsApp(editorJid)
    if (editorContact?.length > 0) {
      editorName = editorContact[0].name || editorContact[0].pushname || editorNumber
      editorMention = editorContact[0].jid || editorJid
    }
  } catch { editorName = editorNumber }
  
  let chatName = ''
  let chatType = 'Personal'
  let chatMention = null
  const date = moment().tz(CONFIG.TZ).format('DD/MM/YYYY')
  const time = moment().tz(CONFIG.TZ).format('HH:mm:ss')
  
  if (from.endsWith('@g.us')) {
    try {
      const metadata = await sock.groupMetadata(from)
      const editorParticipant = metadata.participants.find(p => p.id === editorJid)
      editorName = editorParticipant?.name || editorParticipant?.notify || editorName
      chatName = metadata.subject
      chatType = 'Group'
      chatMention = from
    } catch { chatName = 'Unknown Group' }
  } else if (from.endsWith('status@broadcast')) {
    chatName = 'Status Update'
    chatType = 'Status'
    editorName = msg.pushName || editorName
  } else {
    try {
      const chatContact = await sock.onWhatsApp(from)
      if (chatContact?.length > 0) {
        chatName = chatContact[0].name || chatContact[0].pushname || editorName
      } else {
        chatName = editorName
      }
    } catch {
      chatName = editorName
    }
  }
  
  const originalMsgBody =
    originalMsg.message?.conversation ||
    originalMsg.message?.extendedTextMessage?.text ||
    originalMsg.message?.imageMessage?.caption ||
    originalMsg.message?.videoMessage?.caption ||
    originalMsg.message?.stickerMessage?.caption ||
    originalMsg.message?.documentMessage?.caption ||
    '[Media Message]'
  const editedMsgBody =
    protocolMsg.editedMessage?.conversation ||
    protocolMsg.editedMessage?.extendedTextMessage?.text ||
    '[Edited Message]'
  
  const ownerJid = getOwnerJid()
  if (ownerJid) {
    const mentions = [editorMention]
    if (chatMention) mentions.push(chatMention)
    
    await sock.sendMessage(ownerJid, {
      text: `*⚡ FLASH-MD ANTI-EDIT ⚡*\n\n*💬 Chat:* ${chatName} ${chatType === 'Group' ? `(${chatName})` : ''}\n*📌 Type:* ${chatType}\n*👤 Edited By:* @${editorName.replace(/\s/g, '')}\n*📞 Number:* ${formattedEditorPhone}\n*📅 Date:* ${date}\n*⏰ Time:* ${time}\n\n*📱 Original Message:*\n"${originalMsgBody}"\n\n*✏️ Edited to:*\n"${editedMsgBody}"`,
      mentions: mentions
    })
  }
  logAntiEdit(chatName, editorName, '', time, originalMsgBody, editedMsgBody, '', editorNumber)
  messageStore.set(editedMsgId, { ...msg, timestamp: Date.now() })
}
