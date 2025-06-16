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
        ? process.env.PREFIX.split(',').map(p => p.trim())
        : [''],

    NUMBER: process.env.YOUR_NUMBER || '233538733413,',
    MODE: (process.env.MODE || 'private').toLowerCase().trim(),
    WARN_LIMIT: process.env.WARNINGS || '3',
    ON: process.env.YOUR_NAME || 'FLASH-MD',
    ANTICALL: process.env.ANTICALL || 'on',
    ADM: process.env.ANTIDELETE || 'on',
    AUTO_VIEW_STATUS: process.env.AUTO_READ_STATUS === 'on',
    AUTO_LIKE: process.env.AUTO_LIKE === 'on',
    AUTO_READ_MESSAGES: process.env.AUTO_READ_DM === 'on',
    HEROKU_API_KEY: process.env.HEROKU_API_KEY,
    HEROKU_APP_NAME: process.env.HEROKU_APP_NAME,
   ALIVE_URL: process.env.ALIVE_URL,
    sessionBase64: process.env.SESSION |,|'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVUZyRDA3VC9hNTNLeW51a2F1aXo2M0dJRHZQdVFKM2tOb0IxUUVZV0puZz0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiVVBKaHViaDBZYVBmT0d2SWpzNHpQK3hBa21TWnEvSU0wd3NVWUdJd1ZWdz0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ3TUF4TC9PZlVUNEMyaFFkUHpXQ2o2b3lhWXFKWnlpNm94ano1YkZVYUZNPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJ0YXhtVTBpUW8wbnlZeVUyRUwyRUtEZkpOSXdzdWVCeVgrWXBtMzZFcGc4PSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Im9KRUZ5TWlHc0FpbzZ2RlZ5ZHFMMWlCQ3BCY1lEUGMrSzA1ZHVsVzJuME09In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkY4SWs4V0k2elZYekVYY1N2U1hCOVA5TVJXbUtvUUNiNUpxQklnSFovQUE9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0VVc0lqRGhDSzFKOW5jWXgzRVlyMlh1elIyTmhlTGdxVDh3QS95OHBITT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiYmpXNWRmYkVZZlFlZys5OTltVHNZU3JvZEJXUzRweTFJb1d4aGg0amlTWT0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6ImRQWm50ZUgydHZxWFJsNEVQc0hjaUdpdW1ZYTRDSlBaMHRFSjNMYjY4QTUxdkIwekVKSStpYUI0clBlQ09aZ2dkekJldVZ4bWRXck9UeitkMVYvdmpnPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MjM5LCJhZHZTZWNyZXRLZXkiOiJndFhnazczRUdycWhQbDBGRnVMODNiM1d1UCsvWEUxV1gxREM0ZjhueFFVPSIsInByb2Nlc3NlZEhpc3RvcnlNZXNzYWdlcyI6W3sia2V5Ijp7InJlbW90ZUppZCI6IjIzMzU1MDg2NzE2N0BzLndoYXRzYXBwLm5ldCIsImZyb21NZSI6dHJ1ZSwiaWQiOiI2OTQyRjc0QUI5NjkwQUUwNTg2QjVEMUJEMjY1RDE1NiJ9LCJtZXNzYWdlVGltZXN0YW1wIjoxNzUwMDM0NzgzfV0sIm5leHRQcmVLZXlJZCI6MzEsImZpcnN0VW51cGxvYWRlZFByZUtleUlkIjozMSwiYWNjb3VudFN5bmNDb3VudGVyIjoxLCJhY2NvdW50U2V0dGluZ3MiOnsidW5hcmNoaXZlQ2hhdHMiOmZhbHNlfSwicmVnaXN0ZXJlZCI6dHJ1ZSwicGFpcmluZ0NvZGUiOiJBUUU3NUtQUCIsIm1lIjp7ImlkIjoiMjMzNTUwODY3MTY3OjIwQHMud2hhdHNhcHAubmV0IiwibGlkIjoiOTc4NDQyNzA3NjgzNjE6MjBAbGlkIiwibmFtZSI6IvCdlo4g8J2WhvCdlpIg8J2WkPCdlo3wnZaG8J2WlPCdlpgifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ1B1YmxhVURFTWJTdmNJR0dBa2dBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6InM3QjU1dkoxREE1Nk5kdXJRa2hDNVRIZHFBdW5hWjlaMEFVaHFTT1FNWDA9IiwiYWNjb3VudFNpZ25hdHVyZSI6InczZlczS2g3SSt1VWFMZ1FmTy9nN0NiVXZ3SGUrTWNJZFBWcEt5M3FMcWoxMWFMT2ZzczlGUzFQSmpwMW1zQmF0QzgyemJNbWVOQzljZmpXQVlqUkFnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJkS0k1TkhoOGx0YUhDSjBKZWlhcHdGdlhrSlpXekdEUjBDVGgrVFBuZDFlTThYMW55UzhBTzM1KzZLQkEvTDZhY2UrZGdRdko5RUxyV1hINkpMK0JoUT09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIzMzU1MDg2NzE2NzoyMEBzLndoYXRzYXBwLm5ldCIsImRldmljZUlkIjowfSwiaWRlbnRpZmllcktleSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkJiT3dlZWJ5ZFF3T2VqWGJxMEpJUXVVeDNhZ0xwMm1mV2RBRklha2prREY5In19XSwicGxhdGZvcm0iOiJhbmRyb2lkIiwicm91dGluZ0luZm8iOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJDQUlJQ0E9PSJ9LCJsYXN0QWNjb3VudFN5bmNUaW1lc3RhbXAiOjE3NTAwMzQ3NzMsImxhc3RQcm9wSGFzaCI6IjJQMVloZiIsIm15QXBwU3RhdGVLZXlJZCI6IkFBQUFBT055In0=',
    timezone: 'Africa/Nairobi',
    USER_LID: process.env.YOUR_LID || null,
    PRESENCE_DM: mapPresence(process.env.PRESENCE_DM || 'typing'),
    PRESENCE_GROUP: mapPresence(process.env.PRESENCE_GROUP || 'recording'),

    mapPresence
};
