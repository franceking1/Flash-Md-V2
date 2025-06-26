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

    NUMBER: process.env.YOUR_NUMBER || '233550123784','233530205411'
    MODE: (process.env.MODE || 'public').toLowerCase().trim(),
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
    sessionBase64: process.env.SESSION || 'eyJub2lzZUtleSI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoieUVNMkFYWmx3dnR3TWcxcHl2ZC82Rml5bUNRU3BaSnpKYmY0WjNCemZXVT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoid0RXSFB5MTJXelk3YXJyOUJOa0Zyc20wMklORmdFQzlIRXUxTzNlbHMyOD0ifX0sInBhaXJpbmdFcGhlbWVyYWxLZXlQYWlyIjp7InByaXZhdGUiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiIrQll5ZThHcURDVVVmUGUyN3UrMUZMNFVkcjlUaFNQbXNaTjZiMlJNcEdzPSJ9LCJwdWJsaWMiOnsidHlwZSI6IkJ1ZmZlciIsImRhdGEiOiJSUzNIdm9oeGU3VlFvUW95STlqdWVtR1RUaXduVFZSU2plRTNybUhUYlRJPSJ9fSwic2lnbmVkSWRlbnRpdHlLZXkiOnsicHJpdmF0ZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ik1OTU5sMXFoVDFnbi9qa093OVc5Q1RlZmZEL1Y1c3BNdjR4d1ovWVlYbTQ9In0sInB1YmxpYyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IktmL1ZsUWhGdlBoUzVkTkZ5a3UvL3k0K0pwcHh2cVZMLzh0ZEFaeE53Rzg9In19LCJzaWduZWRQcmVLZXkiOnsia2V5UGFpciI6eyJwcml2YXRlIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQUZwaTZPQWFqdmtOQzlFUkFqVThRYW9hemovTFJnZ0UwQkxiR29CWmhVUT0ifSwicHVibGljIjp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiMmtUR2ZlUzdHVzA5T2l4ZjVDYW1OczZJOE5GMDNjT1ovUklFTzhMYUJsaz0ifX0sInNpZ25hdHVyZSI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6Ikp5SUJiNEhsUEt0dGl5NFRCTjZDamMyZFJNQlpiMVFFeDZoQjVUZjJGN1pOUkRZSTFCUXpRdDhseXREODhFL2loc2NXSG1PN1A1UnhkeWZHbHQzeWdRPT0ifSwia2V5SWQiOjF9LCJyZWdpc3RyYXRpb25JZCI6MzYsImFkdlNlY3JldEtleSI6IjRFbCtVUS8rcDVKZFpGbXFIREliaGNLOGlEamM2V0RUWHEvL25WeEFUUW89IiwicHJvY2Vzc2VkSGlzdG9yeU1lc3NhZ2VzIjpbeyJrZXkiOnsicmVtb3RlSmlkIjoiMjMzNTUwMTIzNzg0QHMud2hhdHNhcHAubmV0IiwiZnJvbU1lIjp0cnVlLCJpZCI6IkExRDQ0MEI1M0U5ODU2RjI2QUI0Qjc4Njg4QzAyQTUzIn0sIm1lc3NhZ2VUaW1lc3RhbXAiOjE3NTA5MzYxNzl9XSwibmV4dFByZUtleUlkIjozMSwiZmlyc3RVbnVwbG9hZGVkUHJlS2V5SWQiOjMxLCJhY2NvdW50U3luY0NvdW50ZXIiOjEsImFjY291bnRTZXR0aW5ncyI6eyJ1bmFyY2hpdmVDaGF0cyI6ZmFsc2V9LCJyZWdpc3RlcmVkIjp0cnVlLCJwYWlyaW5nQ29kZSI6IlFRRzJRUEtXIiwibWUiOnsiaWQiOiIyMzM1NTAxMjM3ODQ6NEBzLndoYXRzYXBwLm5ldCIsImxpZCI6IjIyOTQ4NDk4NDg0ODQzNjo0QGxpZCIsIm5hbWUiOiJCbMOlesOr8J+TsfCfjq4ifSwiYWNjb3VudCI6eyJkZXRhaWxzIjoiQ09xeTRha0NFTWpVOU1JR0dBRWdBQ2dBIiwiYWNjb3VudFNpZ25hdHVyZUtleSI6IlBrL2VaYzc5NlJoVkYrMUxUUGFrcWJzQnFLRFlOelVFMnNSOSt4eGtFeGs9IiwiYWNjb3VudFNpZ25hdHVyZSI6ImZSWlZacm1waGlUME9odUsrK3pjd1lSWjlUZzlEdkJ4YkJNSFUxREs5VFhyWjRZRFlLYUFOcGJZRlBncjlvSDZTWVVBa09DYVBWWG1wajlqWTNZUkFnPT0iLCJkZXZpY2VTaWduYXR1cmUiOiJaWmpPZ1lpa1JwNjRuOCs3NGxEUFgva1dQSTBnM01oWWJBY3Fndm12YzhERUZGbm5GUWhkNXYxWG80SS85RTlVQ0l6ZUZ4OVFVVVdBcFZpeUdjUHJpZz09In0sInNpZ25hbElkZW50aXRpZXMiOlt7ImlkZW50aWZpZXIiOnsibmFtZSI6IjIzMzU1MDEyMzc4NDo0QHMud2hhdHNhcHAubmV0IiwiZGV2aWNlSWQiOjB9LCJpZGVudGlmaWVyS2V5Ijp7InR5cGUiOiJCdWZmZXIiLCJkYXRhIjoiQlQ1UDNtWE8vZWtZVlJmdFMwejJwS203QWFpZzJEYzFCTnJFZmZzY1pCTVoifX1dLCJwbGF0Zm9ybSI6ImFuZHJvaWQiLCJyb3V0aW5nSW5mbyI6eyJ0eXBlIjoiQnVmZmVyIiwiZGF0YSI6IkNBSUlCUT09In0sImxhc3RBY2NvdW50U3luY1RpbWVzdGFtcCI6MTc1MDkzNjE0OCwibGFzdFByb3BIYXNoIjoibm0zQmIiLCJteUFwcFN0YXRlS2V5SWQiOiJBQUFBQUNESyJ9',
    timezone: 'Africa/Ghana',
    USER_LID: process.env.YOUR_LID || '2294849848484364',
    PRESENCE_DM: mapPresence(process.env.PRESENCE_DM || 'typing'),
    PRESENCE_GROUP: mapPresence(process.env.PRESENCE_GROUP || ''),

    mapPresence
};
