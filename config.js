require('dotenv').config();

function mapPresence(val) {
    const mapping = {
        typing: 'composing',
        online: 'available',
        recording: 'recording',
        paused: 'paused',
        offline: 'unavailable'
    };
    return mapping[val?.toLowerCase()?.trim()] || 'paused';
}

module.exports = {
    prefixes: process.env.PREFIX
        ? process.env.PREFIX.split('.').map(p => p.trim())
        : [''],

    NUMBER: process.env.YOUR_NUMBER || '233550123784',
    MODE: (process.env.MODE || 'private').toLowerCase().trim(),
    WARN_LIMIT: process.env.WARNINGS || '3',
    ON: process.env.YOUR_NAME || 'Blaze',
    ANTICALL: process.env.ANTICALL || 'off',
    ADM: process.env.ANTIDELETE || 'off',
    AUTO_VIEW_STATUS: process.env.AUTO_READ_STATUS === 'on',
    AUTO_LIKE: process.env.AUTO_LIKE === 'on',
    AUTO_READ_MESSAGES: process.env.AUTO_READ_DM === 'on',
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
   ALIVE_URL: process.env.ALIVE_URL,
    sessionBase64: process.env.SESSION || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiOFBtMHdlU1BIUG81cWFtVkZmQUdodHlFblBvcFdhblVzWEVxaXZvWTEydz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiRm1kbm16ZG9WRTZMbXFrRGUzVkFVcEkyQzg0RFlQSWF1cEVNRXhwWUZDYz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJtT0ZWLzdpcHNiRkk1dnVRaGVyT000V3ViZm1EVHlMZEdvL0pIZGdtM0ZvPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJud1BPYTRNMnJ4RVpqZk1WZEFlUjNhSStPKzE5TVlJWkdwdXdvWWx1bTFzPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IndQbHRyZktKR2NsNUlscUlJYkh4SjRmSVR2dEdrTU9lS3VPT1VFWTVJV0U9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImJzSm1mMER1VmtUOFJYY3U0cktndmNkU0xiYzdLSnYwRlYySktzTXNQaGc9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiNklMSnViUWp4R2tiZ3RQcnRDWHAxaURsWWorMGZyUzY2V0VVN1N5TWoyQT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYWFma0Nzd09wWExyMDVrUkpqRDRSVDF0bTU1K1M0YXZ2amRtNU0yUGVCMD0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6InpXbVFMRDhWTnc0a3J1RENHYnV3RGlqaVQ3R3RqcWd4MnBJWGZuLzRIM205NEtuYmd5YlZtV3NiajFZOTJtVnBHZW8rbDZwSTBaS1VGa3RKK3hLcUR3PT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MTUxLCJhZHZTZWNyZXRLZXkiOiJtY1hvcWp5L2s1aS9wMUF0SHFXUE0zUHBvTjlEQ1N3bnhyVVlHaVlpUUFRPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjIzMzU1MDEyMzc4NEBzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiJCQjQxOEIzQzZGMTZENUU1NEQ1Q0I3NTRCODQ2NjI1NSJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUwNjc5NDkyfV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJQMzRZWE1ZQSIsIm1lIjp7ImlkIjoiMjMzNTUwMTIzNzg0OjNAcy53aGF0c2FwcC5uZXQiLCJsaWQiOiIyMjk0ODQ5ODQ4NDg0MzY6M0BsaWQiLCJuYW1lIjoiQmzDpXrDq/Cfk7Hwn46uIn0sImFjY291bnQiOnsiZGV0YWlscyI6IkNPbXk0YWtDRUpiLzVNSUdHQUVnQUNnQSIsImFjY291bnRTaWduYXR1cmVLZXkiOiJQay9lWmM3OTZSaFZGKzFMVFBha3Fic0JxS0RZTnpVRTJzUjkreHhrRXhrPSIsImFjY291bnRTaWduYXR1cmUiOiJXTng0bFFUeTIycHA2MkpCQWR2VjhublhoNXF5VVB2eEVGeDhDWjhiay9Ib0p2VmdOa3JOTzJMK1J3UkxDUXNVOFNIaHlWSlpmblpGcHY3TFppT01DQT09IiwiZGV2aWNlU2lnbmF0dXJlIjoiNVBFeEFlNzBQUzRSZTl0SUI4em84U3RsamVXSzVVMHZIaFMwbnZub1g5dkQ5ekFuK21RTmk0bDFyMldnWDJUUDFjcjkwWmh0YW1LdTlxTEVTcTNnQkE9PSJ9LCJzaWduYWxJZGVudGl0aWVzIjpbeyJpZGVudGlmaWVyIjp7Im5hbWUiOiIyMzM1NTAxMjM3ODQ6M0BzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJUNVAzbVhPL2VrWVZSZnRTMHoycEttN0FhaWcyRGMxQk5yRWZmc2NaQk1aIn19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQUlJQlE9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTA2Nzk0NTksImxhc3RQcm9wSGFzaCI6Im5tM0JiIiwibXlBcHBTdGF0ZUtleUlkIjoiQUFBQUFKWWYifQ==',
    timezone: 'Africa/Ghana',
    USER_LID: process.env.YOUR_LID || '2294849848484363',
    PRESENCE_DM: mapPresence(process.env.PRESENCE_DM || 'typing'),
    PRESENCE_GROUP: mapPresence(process.env.PRESENCE_GROUP || 'recording'),

    mapPresence
};
