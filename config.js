import dotenv from 'dotenv'

dotenv.config({ path: '.env' })

function parsePrefixes(prefixStr) {
  if (!prefixStr || prefixStr.trim() === '' || prefixStr.toLowerCase() === 'none') return []
  return prefixStr.split(',').map(p => p.trim()).filter(Boolean)
}

function parseBoolean(value) {
  if (typeof value === 'string') {
    return value.toLowerCase() === 'on' || value.toLowerCase() === 'true' || value === '1'
  }
  return Boolean(value)
}

function parseLids(lidStr) {
  if (!lidStr || lidStr.trim() === '') return []
  return lidStr.split(',').map(l => l.trim()).filter(Boolean)
}

function parseMenuImages(menuImagesStr) {
  if (!menuImagesStr || menuImagesStr.trim() === '') return []
  return menuImagesStr.split(',').map(img => img.trim()).filter(Boolean)
}

const CONFIG = {
  MODE: process.env.MODE || 'private',
  PREFIXES: parsePrefixes(process.env.PREFIXES),
  PORT: parseInt(process.env.PORT) || 3000,
  SESSION: process.env.SESSION || "eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUVUY1N0R0RLUEJleC9PeEl0UTMxWUN3UUNMTittc3BpMVduVTRaMFZGUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiN3hPUzlWaU1pSEFTbVZHRjllMmNYQjdmOUxRNm90ZEJjY2RSbU1sT3czcz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJxT1FOM0UyWFVLclFURVlhOWpTVHNJa0llaDg3eGREbG5QZW1pZlE5VkhJPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIxdEtwZUJzL1krcTZScUNxMUhlcVVCUktTejMrYWtIQVZUaE5zSWRiV2kwPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InNJVnY4TUtza2dNcjNTL25kM21WVi9zNlY5S2l0MHNsTTE1TWp5Y0EzMmc9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkVRMlFBdnhJWmZ2b0dVQmczWFZnQitkOGxOTFVvenJ4bEZDT2Y2YXpBaWs9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUpDd0xWOXVvTUF4VkNHNDJPWS93KzZ0R2lkeFRFZVdSTm5zelpJQ0hVUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiWStDelFyVFdiMW0xamFrcy9KSVhFcmZ2OGFDMHNXd3VMLzNOd05TVW5Caz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ims4bmRBUlc0aEFjM1R1MzNwUGxGRXBTZDNINEU0eTFFcUk4NWVPVFlsc1RtY2R3a3FUUWdwN3Z4Qzlzbm1JZmZsRzdzWkNkeTRYMFhVS05OaWNrekJRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjUwLCJhZHZTZWNyZXRLZXkiOiJFdm50WDdrRzhMSWt5NVVlc1RIaFlXRTYzc01uTlFhNWpidlpsbmlSbHVnPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W10sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjowLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiI5SEFNUE5KVCIsIm1lIjp7ImlkIjoiMjU0NzE1MTgyMTUzOjIyQHMud2hhdHNhcHAubmV0IiwibmFtZSI6IlNhbXlhemEiLCJsaWQiOiI2MTU3NzAxMzI4OTA1MzoyMkBsaWQifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ09QSzFiRUVFSUs4dzlBR0dBWWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlhuMTU0bmNOVGNtdTVDUk05MFlueXh5YTdVNXpDL0tZalNBaHVEbCtGd2M9IiwiYWNjb3VudFNpZ25hdHVyZSI6IjdJVE1Xd3c4RWMwSmJFYkNBeTFaeW9QczkrMGJLNnd1dnkvKy8xcTdvN0I0RWVsSE0wS2RlcnR3a0J4S0pRYTFsR2tEZEJ4ekl6Z0hlbTdGWmFFbUFnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiI4Z01LMjJTUW9zaUpJRW90M0pobzczVUpNKzUvc1JSNytQeVhvNFJudVIraGdLYjhFZHBWZDd0eVFsK05kd2JqdnV0UmhZbWNtdm0yVVBZd0J2QWRDdz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjI1NDcxNTE4MjE1MzoyMkBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJWNTllZUozRFUzSnJ1UWtUUGRHSjhzY211MU9jd3Z5bUkwZ0liZzVmaGNIIn19XSwicGxhdGZvcm0iOiJzbWJhIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQVVJQWdnTiJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3Nzk0OTAzMTMsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBSTYrIn0=",
  TZ: process.env.TZ || 'Africa/Nairobi',
  ANTICALL: parseBoolean(process.env.ANTICALL || 'off'),
  ANTIDELETE: parseBoolean(process.env.ANTIDELETE || 'on'),
  ANTIEDIT: parseBoolean(process.env.ANTIEDIT || 'on'),
  AUTO_READ: parseBoolean(process.env.AUTO_READ || 'off'),
  AUTO_VIEW: parseBoolean(process.env.AUTO_VIEW || 'on'),
  AUTO_LIKE: parseBoolean(process.env.AUTO_LIKE || 'on'),
  DM_PRESENCE: process.env.DM_PRESENCE || '',
  GRP_PRESENCE: process.env.GRP_PRESENCE || '',
  USER_LID: parseLids(process.env.USER_LID || ''),
  OWNER_NUMBER: process.env.OWNER_NUMBER || '',
  OWNER_NAME: process.env.OWNER_NAME || 'Flash MD user',
  BOT_NAME: process.env.BOT_NAME || 'Flash-Md-V3',
  BOT_VERSION: process.env.BOT_VERSION || '3.0.0',
  MENU_IMAGES: parseMenuImages(process.env.MENU_IMAGES || '')
}

export default CONFIG
