export function normalizeJid(jid) {
  return jid.replace(/@lid$/, '@s.whatsapp.net')
}

export function getUserNumber(jid) {
  const cleanJid = normalizeJid(jid)
  return cleanJid.split('@')[0]
}

export function isGroupJid(jid) {
  return jid.endsWith('@g.us') || jid.endsWith('@lid')
}
