export const API_CONFIG = {
  acrcloud: {
    host: 'identify-us-west-2.acrcloud.com',
    access_key: '4ee38e62e85515a47158aeb3d26fb741',
    access_secret: 'KZd3cUQoOYSmZQn1n5ACW5XSbqGlKLhg6G8S8EvJ'
  },
  advice: 'https://api.adviceslip.com/advice',
  bible: {
    url: 'https://bible-api.com'
  },
  bk9Api: 'https://bk9.fun/download',
  emojimixApi: 'https://levanter.onrender.com/emix',
  exchangeApi: 'https://api.exchangerate-api.com/v4/latest',
  facts: {
    url: 'https://nekos.life/api/v2/fact'
  },
  gemini: {
    url: 'https://api.gptgod.online/v1/chat/completions',
    model: 'gemini-1.5-flash',
    timeout: 10000
  },
  google: {
    apiKey: 'AIzaSyDMbI3nvmQUrfjoCJYLS69Lej1hSXQjnWI',
    cx: 'baf9bdb0c631236e5'
  },
  jokes: 'https://api.popcat.xyz/joke',
  llama: {
    url: 'https://api.gurusensei.workers.dev/llama'
  },
  nayanApi: {
    twitter: 'https://nayan-video-downloader.vercel.app/twitterdown',
    youtube: 'https://nayan-video-downloader.vercel.app/ytdown',
    playlist: 'https://nayan-video-downloader.vercel.app/ytsearch/playlist',
    timeout: 30000
  },
  noobsApi: 'https://noobs-api.top',
  npmApi: 'https://weeb-api.vercel.app',
  omdbApi: 'http://www.omdbapi.com/?apikey=742b2d09',
  pairing: {
    url: 'https://fixed-sessions.onrender.com/pair',
    timeout: 30000
  },
  quotes: 'https://type.fit/api/quotes',
  quotesApi: {
    url: 'https://favqs.com/api/qotd'
  },
  spotifyApi: 'https://okatsu-rolezapiiz.vercel.app/search/spotify',
  translate: {
    url: 'https://api.diioffc.web.id/api/tools/translate'
  },
  trivia: 'https://opentdb.com/api.php?amount=1&type=multiple',
  unsplash: {
    url: 'https://api.unsplash.com/photos/random',
    clientId: '72utkjatCBC-PDcx7-Kcvgod7-QOFAm2fXwEeW8b8cc'
  },
  urbanDict: {
    url: 'http://api.urbandictionary.com/v0/define'
  },
  country: {
    url: 'https://api.siputzx.my.id/api/tools/countryInfo',
    timeout: 15000
  }
}

export const MESSAGES = {
  GROUP_ONLY_MSG: '❌ This command works only in groups!',
  ADMIN_ONLY_MSG: '❌ This command is for group admins only!',
  BOT_ADMIN_ONLY_MSG: '❌ The bot needs to be an admin to use this command!',
  OWNER_ONLY_MSG: '❌ This command is for the group owner only!',
  
  groupOnly: '❌ This command works only in groups!',
  adminOnly: '❌ This command is for group admins only!',
  botAdminOnly: '❌ The bot needs to be an admin to use this command!',
  ownerOnly: '❌ This command is for the group owner only!',
  
  alive: {
    checking: '🔄 Checking bot status...',
    online: '🟢 *FLASH-MD-V3 IS ONLINE*',
    uptime: '*⏱️ Uptime:* {uptime}',
    ping: '*🏓 Ping:* {latency} ms',
    platform: '*🖥️ Platform:* {platform}',
    ram: '*💾 RAM Usage:* {ram} MB'
  },
    help: {
  noCommands: '❌ Command list not available.',
  greeting: 'Good Morning',
  owner: 'Owner',
  prefix: 'Prefix',
  time: 'Time',
  date: 'Date',
  timezone: 'Timezone',
  noDescription: 'No description',
  aliases: 'Aliases',
  usage: 'Use',
  powered: '_⚡ Powered by',
  error: '❌ Error loading help.'
    }, 
  
  playlist: {
    noQuery: '🔗 *Please provide a YouTube URL or search keywords.*\n\nExamples:\n`.playlist https://youtu.be/3RExDX07-0A`\n`.playlist sprinter`',
    noResults: '❌ *No results found.*\nPlease try different keywords or provide a YouTube URL.',
    fetching: '⏳ *FLASH-MD V3* is fetching playlist information... Please wait.',
    error: '❌ An error occurred while fetching the playlist. Please try again later.',
    timeout: '⏱️ *Request timed out.* The server took too long to respond. Please try again.',
    notFound: '🔍 *Playlist not found.* Please check the URL or try different keywords.',
    header: '🎵 *FLASH-MD V3 PLAYLIST*\n\n📋 *{title}*\n📊 *Total Videos:* {total}\n\n',
    videoItem: '{number}. *{title}*\n   ⏱️ Duration: {duration}\n   🔗 {url}\n\n',
    footer: '\n_✨ Use .play <video title> to download any song from this playlist_'
  },
  
  alldl: {
    noUrl: '🔗 *Please provide a URL to download from.*',
    caption: '*FLASH-MD*\n🔗 Downloaded from: {url}',
    complete: '✅ *Download complete!*',
    noMedia: '❌ No media found or invalid URL.',
    error: '⚠️ An error occurred while processing your request.'
  },
  
  apk: {
    noQuery: '❗ Please provide an app name to search for.',
    searching: '🔍 Searching for the APK, please wait...',
    notFound: '❌ No APKs found for "{query}".',
    error: '❌ Failed to retrieve the download link.',
    caption: '*📥 APK DOWNLOADER*\n\n*📌 App:* {name}\n*📎 Type:* APK File\n*⚙️ Powered by:* FLASH-MD-V3',
    complete: '✅ Successfully fetched and sent APK for *{name}*.\n\n_Enjoy using the app. Powered by FLASH-MD-V3_'
  },
  
  attp: {
    noText: 'Please provide the text to convert into a sticker!',
    error: 'Error while creating that sticker. Please try again.'
  },
  
  bible: {
    usage: 'Usage: .bible john 3:16\n\n⚡ Powered by {botName} {botVersion}',
    error: 'Error fetching verse.\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  currency: {
    usage: "Please provide the amount, from currency, and to currency. Example: .currency 100 usd kes",
    invalid: "Invalid amount. Please provide a number. Example: .currency 50 eur usd",
    invalidTarget: "Invalid target currency *{currency}*. Use .currencyinfo to view supported currencies.",
    error: "❌ An error occurred while converting currency.\nMake sure your currency codes are valid.\nUse .currencyinfo to see all supported currencies.",
    result: "*💱 Currency Conversion 💱*\n\n🌍 Base: {base}\n🔄 Updated: {date}\n\n💵 {amount} {from} = {converted} {to}\n💸 Rate: 1 {from} = {rate} {to}"
  },
  
  deepseek: {
    noQuery: '🕵️ *You need to specify what to investigate.*\nTry: deepseek Bitcoin trends',
    gathering: '⏳ *Gathering intelligence... please hold on.*',
    error: '*🚫 Could not complete the investigation.*'
  },
  
  define: {
    usage: 'Provide a term to define.\n\n⚡ Powered by {botName} {botVersion}',
    notFound: 'No definition found for "{word}".\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  element: {
    noQuery: 'Please specify an element name or symbol.',
    notFound: 'Not found or error fetching data.',
    info: 'Element Name: {name}\nElement Symbol: {symbol}\nAtomic Number: {atomic_number}\nAtomic Mass: {atomic_mass}\nPeriod: {period}\nPhase: {phase}\nDiscovered By: {discovered_by}',
    error: 'Error fetching element data.'
  },
  
  emomix: {
    usage: "Incorrect use. Example: .emomix 😀;🥰",
    invalid: "Please specify two emojis using a `;` separator.",
    error: 'Unable to create emoji mix.',
    apiError: 'An error occurred while creating the emoji mix: {error}'
  },
  
  eval: {
    noCode: '❌ Provide code to evaluate.',
    error: '❌ Eval Error:\n{error}'
  },
    "url": {
  "noReply": "📌 Please quote an image to upload.",
  "unsupported": "❌ Only images are supported.",
  "uploading": "⏳ Uploading image to ImgBB...",
  "success": "✅ Image uploaded successfully!",
  "error": "❌ Failed to upload image."
    }, 
  
  evalSimple: {
    usage: 'Provide code to evaluate. Example: .eval 2+2\n\n⚡ Powered by {botName} {botVersion}',
    error: 'Error: {error}\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  exchange: {
    usage: 'Please provide the amount, from currency, and to currency.\n\nExample: .exchange 100 usd kes',
    invalid: 'Invalid amount. Please enter a valid number.',
    error: '❌ An error occurred while converting currency. Please try again later.'
  },
  
  exec: {
    noCommand: '❌ Please provide a command to execute.\n\nExample: .exec cat package.json',
    noOutput: '✅ Command executed successfully (no output).',
    output: '```\n{output}\n```',
    error: '❌ Error executing command:\n```\n{error}\n```'
  },
  
  fact: {
    error: 'Failed to fetch fact.\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  fb: {
    noUrl: 'Insert a public facebook video link!',
    error: 'try fb2 on this link',
    caption: '*Title:* {title}\n\n*Direct Link:* {url}',
    videoCaption: '_╰►FB VIDEO DOWNLOADED BY_ *FLASH-MD-V3*'
  },
  
  fetch: {
    noUrl: '❗ Please start the URL with *http://* or *https://*',
    tooLarge: '⚠️ The content is too large to process (over 100MB).',
    error: '❌ Failed to fetch the URL. Status: {status}'
  },
  
  gemini: {
    noQuestion: '❓ Please provide a question.',
    noResponse: 'No response from AI.',
    error: 'Error: AI service is currently unavailable.'
  },
  
  github: {
    noUsername: '📦 *Please provide a GitHub username.*',
    notFound: '❌ *GitHub user not found.*',
    info: '🌐 *GitHub User Info*\n\n👤 *Name:* {name}\n🔖 *Username:* {login}\n📝 *Bio:* {bio}\n🏢 *Company:* {company}\n📍 *Location:* {location}\n📧 *Email:* {email}\n🔗 *Blog:* {blog}\n📂 *Public Repos:* {repos}\n👥 *Followers:* {followers}\n🤝 *Following:* {following}',
    error: '⚠️ Error fetching GitHub user. Please try again.'
  },
  
  gitclone: {
    noUrl: 'Please provide a valid GitHub repo link.',
    invalid: 'Is that a GitHub repo link?!',
    error: 'An error occurred while fetching the GitHub repo.'
  },
  
  google: {
    noQuery: '🔍 *Please provide a search term!*\n\nExample:\n.google what is treason',
    noResults: '❌ *No results found.*',
    header: '🌐 *Google Search*\n🔍 *Query:* {query}\n\n',
    item: '📌 *Title:* {title}\n📝 *Description:* {snippet}\n🔗 *Link:* {link}\n\n',
    error: '⚠️ *Error searching Google.*\nMake sure your API key and CX ID are valid.'
  },
  
  gpp: {
    noImage: '📸 Please *reply to an image* to set it as the full group profile picture.',
    success: '✅ Group profile picture updated!',
    error: '❌ Failed to set full group profile picture.'
  },
  
  gpt: {
    noPrompt: '💬 *Please provide a prompt to send to GPT.*\n\nExample:\ngpt What is the capital of France?',
    error: '❌ AI service is currently unavailable. Please try again later.'
  },
  
  group: {
    groupOnly: '❌ This command works only in groups!',
    adminOnly: '❌ This command is for group admins only!',
    botAdminOnly: '❌ The bot needs to be an admin to use this command!',
    ownerOnly: '❌ This command is for the group owner only!',
    add: {
      noNumber: '⚠️ Provide a number to add.',
      success: '✅ {number} added to the group.',
      error: '❌ Failed to add user. They may have privacy restrictions.'
    },
    antilink: {
      usage: '❌ Usage: .antilink on|off warn|kick|delete',
      success: '✅ Antilink is now *{option}* with action: *{action}*'
    },
    approve: {
      noRequests: '📭 No join requests to approve.',
      success: '✅ All join requests approved.',
      error: '❌ Failed to approve requests.'
    },
    broadcast: {
      noMessage: '❗ Provide a message to broadcast.',
      start: '📢 Broadcasting message...',
      message: '*📢 Broadcast Message*\n\n{message}',
      error: '❌ Broadcast failed.'
    },
    create: {
      usage: 'Usage: .create MyGroup @user or reply or number (e.g. 2547xxxxxxx)',
      welcome: '👋 Welcome to the new group!',
      error: '❌ Failed to create group.'
    },
    demote: {
      noTarget: '⚠️ Tag or reply to the admin you want to demote.',
      success: '🛑 @{user} has been demoted.',
      error: '❌ Failed to demote user.'
    },
    desc: {
      noDesc: '❗ Please provide a new description.',
      success: '✅ Group description updated:\n{desc}',
      error: '❌ Failed to update group description.'
    },
    disap: {
      success24: '⏳ Disappearing messages set to 24 hours.',
      success7: '⏳ Disappearing messages set to 7 days.',
      success90: '⏳ Disappearing messages set to 90 days.',
      off: '🗑️ Disappearing messages turned off.',
      error: '❌ Failed to set disappearing messages.',
      help: '*Disappearing Message Options*\n\n• *disap1* — 24 hours\n• *disap7* — 7 days\n• *disap90* — 90 days\n• *disap-off* — Disable'
    },
    hidetag: {
      default: '👥',
      noMessage: '❗ Please provide a message or reply to one to mention everyone.'
    },
    info: {
      result: '*📄 Group Information:*\n\n📌 *Name:* {groupName}\n🆔 *ID:* {groupId}\n👑 *Owner:* @{ownerNumber}\n👥 *Members:* {totalMembers}\n🛡️ *Admins ({adminCount}):*\n{adminList}',
      error: '⚠️ Could not fetch group info.'
    },
    invite: {
      success: '🔗 Group link:\nhttps://chat.whatsapp.com/{code}',
      error: '❌ Failed to get invite link.'
    },
    kick: {
      noTarget: '⚠️ Tag or reply to the user you want to remove.',
      success: '✅ @{user} has been removed.',
      error: '❌ Failed to remove user.'
    },
    kickall: {
      warning: '⚠️ Removing all non-admins in 5 seconds...'
    },
    leave: {
      error: '❌ Failed to leave group.'
    },
    lock: {
      success: '🔒 Group locked. Only admins can message now.',
      error: '❌ Failed to lock group.'
    },
    online: {
      checking: '🔍 Checking online members...',
      noMembers: '👥 No online members detected (or they have privacy enabled).',
      header: '👥 *ONLINE MEMBERS*',
      onlineLabel: '📊 Online:',
      error: '❌ Error fetching online users:',
      powered: '⚡ Powered by'
    },
    promote: {
      noTarget: '⚠️ Tag or reply to the user you want to promote.',
      success: '✅ @{user} is now an admin.',
      error: '❌ Failed to promote user.'
    },
    reject: {
      noRequests: '📭 No join requests to reject.',
      success: '🚫 All join requests rejected.',
      error: '❌ Failed to reject requests.'
    },
    rename: {
      noName: '❗ Provide a new group name.',
      success: '✅ Group name changed to: *{name}*',
      error: '❌ Failed to change group name.'
    },
    req: {
      noRequests: '📭 No pending join requests.',
      list: '📥 Pending Requests:\n{list}\n\nUse *approve* or *reject* to respond.',
      error: '❌ Failed to get requests.'
    },
    revoke: {
      success: '♻️ New group link:\nhttps://chat.whatsapp.com/{code}',
      error: '❌ Failed to generate new link.'
    },
    tagall: {
      noParticipants: '⚠️ No participants found in this group.',
      defaultText: 'Hello everyone!',
      header: '*📣 {text}*\n\n',
      error: '❌ Something went wrong while tagging everyone.'
    },
    unlock: {
      success: '🔓 Group unlocked. All members can message.',
      error: '❌ Failed to unlock group.'
    }
  },
  
  hack: {
    creator: '🛑 No way, I can\'t hack my creator 🤝🐐'
  },
  
  host: {
    info: '*◇ HOSTING STATUS ◇*\n\n*Hosted On:* {platform}\n*Time:* {time}\n*Bot Uptime:* {uptime}\n*RAM Used:* {usedMem} GB\n*Total RAM:* {totalMem} GB',
    error: '❌ Failed to get host info. Error: {error}'
  },
  
  imageDl: {
    noUrl: 'Please provide a valid image URL.',
    caption: '📸 *FLASH-MD-V3* Image Downloader (High Quality)',
    success: '✅ Image downloaded successfully!',
    noImage: '❌ No valid high-quality image found.',
    error: 'An error occurred while processing the image request. Please try again.'
  },
  
  imagine: {
    noPrompt: '🧠 *What do you want to imagine?*\n\n_Example:_ `.imagine a futuristic city at night`',
    generating: '🎨 *Generating image... Please wait.*',
    noImage: '⚠️ Sorry, I could not generate the image. Try again later.',
    caption: '_✨ Created by Flash-Md-V3_'
  },
  
  imdb: {
    noQuery: '🎬 Provide the name of a movie or series. Example: .imdb Inception',
    notFound: '❌ Could not find results for "{query}".',
    error: "❌ An error occurred while searching IMDb."
  },
  
  insta: {
    noUrl: '🔗 *Please provide a valid Instagram URL.*\n\nExample: `!insta https://www.instagram.com/reel/xyz123/`',
    error: '❌ *Failed to get media:*\n{error}',
    caption: '_*✨ Downloaded by Flash-Md-V3*_'
  },
  
  llama: {
    noQuestion: 'Please provide a question to ask LLaMA.',
    noResponse: 'No response received from LLaMA.',
    error: 'An error occurred while getting a response from LLaMA.'
  },
  
  logo: {
    noText: '*Example:* .{type} YourText',
    generating: '*Generating your logo... Please wait.*',
    caption: '*FLASH-MD V3 - Logo Generator*',
    error: 'An error occurred while generating your logo. Please try again later.'
  },
  
  love: {
    usage: 'Please mention someone or reply to their message. Example: .love @Marie',
    result: '--- Compatibility Test ---\n\n❤️ Person 1: *{user1}*\n❤️ Person 2: *{user2}*\n\nTheir compatibility is: *{percentage}%* {emoji}'
  },
  
  lyrics: {
    noQuery: '❗ Please provide a song name and artist.\n\n⚡ Powered by {botName} {botVersion}',
    notFound: '❌ Lyrics not found for that song.',
    result: '*🎵 {title}*\n👤 Artist: {artist}\n\n{lyrics}\n\n🔗 {url}',
    error: '❌ Failed to fetch lyrics.\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  math: {
    invalidFormat: 'Invalid input. Please use a valid format like \'1+1\' or \'2*3+5/2\'.',
    invalidOperation: 'Error: Division by zero or other invalid operation.',
    result: 'The result is: {result}',
    error: 'Invalid expression. Please ensure you are using valid mathematical operators.'
  },
  
  mediafire: {
    noUrl: 'Please insert a MediaFire file link.',
    fetching: 'Fetching your file from MediaFire, please wait...',
    error: 'Failed to retrieve file. Please check the link and try again.',
    caption: '╰► *MediaFire Download Completed!*\nDownloaded by: *FLASH-MD-V3*\n\n📂 *Name:* {name}\n📦 *Size:* {size}\n📄 *Type:* {type}\n📅 *Uploaded:* {uploaded}'
  },
  
  npm: {
    noQuery: '❗ Please provide an NPM package name to search for.',
    notFound: '❌ No results found for "{query}".',
    result: '*📦 NPM PACKAGE RESULT*\n\n*📁 Name:* {name}\n*📌 Version:* {version}\n*📝 Description:* {description}\n*👤 Publisher:* {publisher}\n*⚖️ License:* {license}\n*📅 Last Updated:* {date}\n\n🔗 *NPM:* {npmLink}\n🔗 *Repository:* {repoLink}\n🔗 *Homepage:* {homepage}\n\n_Use this info to explore or install the package via terminal_\n\n⚡ Powered by {botName} {botVersion}',
    error: '❌ An error occurred while fetching the package info.'
  },
  
  play: {
    noQuery: '🎵 *Please provide a song name or YouTube link.*\n\nExample: `.play alone` or `.play https://youtu.be/xyz`',
    noResults: '❌ *No results found for your query.*\nPlease try a different song name.',
    fetching: '⏳ *Fetching your song...* Please wait.',
    noAudio: '❌ *No audio found.*\nThe video might not have audio or is unavailable.',
    info: '*🎵 FLASH-MD V3 MUSIC PLAYER*\n\n╭─❏ *Title:* {title}\n│ *Channel:* {channel}\n│ *Quality:* {quality}p\n╰─────────────\n\n_✨ Downloaded successfully!_',
    timeout: '⏱️ *Request timed out.* The server took too long to respond. Please try again.',
    error: '❌ An error occurred while processing your request.\nPlease try again later.'
  },
  
  poll: {
    usage: 'Usage: .poll What is 2+2?/2,3,4\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  posts: {
    noUsername: '📸 *Please provide an Instagram username.*\n\nExample: `!posts france.king1`',
    noPosts: '❌ *No posts found for @{username}.*\nMaybe the account is private or invalid.',
    caption: '📸 _✨ Downloaded by Flash-Md-V3_',
    videoCaption: '🎥 _✨ Downloaded by Flash-Md-V3_'
  },
  
  quote: {
    error: 'Failed to fetch quote.\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  save: {
    noReply: 'Reply to the message you want to save.',
    unsupported: 'Unsupported message type.',
    success: '✅ Message saved and forwarded to owner.',
    error: 'An error occurred while saving the message.',
    defaultText: 'Saved message'
  },
  
  screenshot: {
    noUrl: 'Provide a link to screenshot.\n\n⚡ Powered by {botName} {botVersion}',
    error: 'Failed to take website screenshot.\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  shazam: {
    noReply: '🎵 *Reply to a short audio or video message (10–20 seconds) to identify the song.*',
    notRecognized: '❌ *Song could not be recognized.* Please try again with a clearer or more melodic part of the track.',
    header: '🎶 *Song Identified!*\n\n',
    title: '🎧 *Title:* {title}\n',
    artists: '👤 *Artist(s):* {artists}\n',
    album: '💿 *Album:* {album}\n',
    genres: '🎼 *Genre:* {genres}\n',
    release: '📅 *Released:* {day}/{month}/{year}\n',
    youtube: '🔗 *YouTube:* {url}\n',
    footer: '\n*POWERED BY {botName} V3*',
    error: '⚠️ *Error:* Unable to recognize the song. Please try again with a clear, short clip (10–20s).'
  },
  
  spotify: {
    noQuery: '❌ Please provide a song name.\n\nExample: *!spotify not afraid*',
    notFound: '❌ Song not found or audio unavailable.',
    caption: '🎵 *{title}*\n👤 *Artist:* {artist}\n⏱️ *Duration:* {duration}\n📈 *Popularity:* {popularity}\n🔗 *Link:* {url}\n\n_Sending the audio..._',
    error: '❌ Failed to fetch or send the Spotify song.'
  },
  
  sticker: {
    noMedia: 'Reply to an image or video to make a sticker.',
    error: 'Sticker error: {error}'
  },
  
  stickersearch: {
    noText: 'Insert the type of stickers you want!',
    error: 'Error searching for stickers.'
  },
  
  story: {
    noUsername: '📖 *Provide a username to fetch stories.*\n\nExample: `story france.king1`',
    noStories: '⚠️ No stories found for *{username}*.',
    caption: '📖 *{username}* - Story {current} of {total}\n\n_*✨Downloaded by Flash-Md-V3*_',
    unknown: '⚠️ Unknown media type:\n{url}',
    error: '❌ Failed to fetch stories for *{username}*. Try again later.'
  },
  
  sudo: {
    listEmpty: '📭 No sudo users have been added yet.',
    listHeader: '👑 *Sudo Users List:*\n\n',
    noReply: '❌ Reply to a user to add/remove them.\n\nUsage:\n- sudo add\n- sudo del\n- sudo list',
    added: '✅ Added +{number} to sudo users.',
    removed: '❌ Removed +{number} from sudo users.',
    invalid: 'Invalid usage.\n\nUsage:\n- sudo add\n- sudo del\n- sudo list'
  },
  
  take: {
    noMedia: 'Reply to an image, video or sticker.',
    error: 'Error: {error}'
  },
  
  tgs: {
    noUrl: 'Please provide a Telegram sticker pack URL.',
    noStickers: '❌ No stickers found in the provided pack.',
    complete: '✅ All Telegram stickers sent successfully!',
    error: 'An error occurred while fetching the sticker pack. Please try again later.'
  },
  
  tiktok: {
    noUrl: '📌 *Please provide a valid TikTok video link.*',
    error: '❌ *Failed to fetch TikTok media.*\nReason: {reason}',
    noVideo: '⚠️ Video link not found.',
    caption: '🎵 *{title}*'
  },
  
  toimg: {
    noSticker: '❌ *Reply to a static sticker to convert it to image.*',
    unsupported: '❌ *Only static stickers are supported.*',
    success: '✅ *Sticker converted to image.*',
    error: '❌ *Failed to convert sticker.*'
  },
  
  tomp3: {
    noVideo: 'Reply to a video message to convert to MP3.',
    error: 'Error while converting video to MP3: {error}'
  },
  
  translate: {
    noReply: 'Please reply to the message you want to translate.\nExample: .trt fr\n\n⚡ Powered by {botName} {botVersion}',
    usage: 'Please provide only the language code.\nExample: .trt fr\n\n⚡ Powered by {botName} {botVersion}',
    noText: 'The replied message does not contain text.\n\n⚡ Powered by {botName} {botVersion}',
    error: 'Translation failed. Please check the language code.\n\n⚡ Powered by {botName} {botVersion}'
  },
  
  trim: {
    error: '❌ *Reply to a video or audio with the command.*\n\nExample:\n`trim 1 4`',
    invalid: '❌ *Invalid time range.*\n\nUse: `trim <start> <end>`\nExample: `trim 1 4`',
    failed: '❌ *Failed to trim the media.*',
    downloadError: '❌ *Failed to download media.*'
  },
  
  twitter: {
    noUrl: '🔗 *Please provide a Twitter/X video URL.*\n\nExample: `.twitter https://twitter.com/username/status/123456789`',
    invalidUrl: '❌ *Invalid Twitter/X URL.*\nPlease provide a valid tweet link.',
    fetching: '⏳ *Fetching Twitter/X video...* Please wait.',
    noVideo: '❌ *No downloadable video found.*\nThe tweet might not contain a video or is private.',
    caption: '🎥 *FLASH-MD V3 X DOWNLOADER*\n\n📦 *Quality:* {quality}\n\n_✨ Downloaded successfully!_',
    timeout: '⏱️ *Request timed out.* The server took too long to respond. Please try again.',
    notFound: '🔍 *Video not found.* The tweet might have been deleted or is private.',
    apiError: '⚠️ *API service unavailable.* Please try again later.',
    error: '❌ An error occurred while processing your request.'
  },
  
  user: {
    blockNoTarget: 'Mention or provide a number to block',
    blockProtected: 'I cannot block this number',
    blockSuccess: 'Blocked {jid}',
    blockError: 'Failed to block user',
    unblockNoTarget: 'Mention or provide a number to unblock',
    unblockProtected: 'I cannot unblock this number',
    unblockSuccess: 'Unblocked {jid}',
    unblockError: 'Failed to unblock user',
    setbioNoText: 'Provide bio text',
    setbioSuccess: 'Bio updated',
    setbioError: 'Failed to update bio',
    autobioUsage: 'Use autobio on or off',
    autobioAlreadyOn: 'Auto bio already enabled',
    autobioAlreadyOff: 'Auto bio already disabled',
    autobioEnabled: 'Auto bio enabled',
    autobioDisabled: 'Auto bio disabled',
    getppDefaultImage: 'https://static.animecorner.me/2023/08/op2.jpg',
    getppCaption: 'Here is The Profile picture',
    whoisDefaultImage: 'https://static.animecorner.me/2023/08/op2.jpg',
    whoisAbout: 'ABOUT',
    whoisName: 'Name',
    whoisSetOn: 'Set on',
    whoisSetAt: 'Set at',
    whoisFooter: 'FLASH-MD V-3.0.0',
    mygroupsHeader: 'GROUPS\n\n',
    mygroupsItem: '{subject}\n{count} members\n{id}\n\n',
    mygroupsError: 'Failed to fetch groups',
    restartMessage: 'Restarting...'
  },
  
  videoDl: {
    noUrl: 'Please provide a valid video URL.',
    noVideo: '❌ No valid video found.',
    caption: '🎥 *FLASH-MD-V3* Video Downloader (High Quality)',
    complete: '✅ Video downloaded successfully!',
    error: 'An error occurred while processing the video request. Please try again.'
  },
  
  vision: {
    noImage: '📌 Reply to an image and type your question or prompt after the command.',
    noQuery: '❌ Provide a question or description prompt after the command.\nExample:\nvision explain this meme',
    success: '🧠 *Image Analysis:*\n\n{result}',
    error: '⚠️ Error analyzing image: {error}'
  },
  
  wallpaper: {
    error: "Couldn't fetch wallpaper. Try again later.",
    caption: "*POWERED BY FLASH-MD-V3*"
  },
  
  weather: {
    noText: 'Give me a location to check the weather.',
    result: '❄️ *Weather in {name}, {country}*\n\n🌡️ Temperature: {temp}°C (Feels like {feels}°C)\n📉 Min: {min}°C  📈 Max: {max}°C\n📝 Condition: {desc}\n💧 Humidity: {humidity}%\n🌬️ Wind: {wind} m/s\n☁️ Cloudiness: {clouds}%\n🌧️ Rain (last hour): {rain} mm\n🌄 Sunrise: {sunrise}\n🌅 Sunset: {sunset}\n🧭 Coordinates: {lat}, {lon}\n\n°Powered by {botName}',
    error: 'Failed to fetch weather data.'
  },
  
  whatsapp: {
    fullpp: {
      noImage: '📸 Please *reply to an image* to set it as your profile picture.',
      success: '✅ Profile picture updated successfully!',
      error: '❌ Failed to update profile picture.'
    },
    privacy: {
      info: '*Privacy Settings*\n\n*Name:* {name}\n*Online:* {online}\n*Profile:* {profile}\n*Last Seen:* {last}\n*Read Receipts:* {readreceipts}\n*Status:* {status}\n*Group Add:* {groupadd}\n*Call Add:* {calladd}',
      error: 'Failed to fetch privacy settings.'
    },
    pin: {
      success: 'Chat has been pinned.',
      error: 'Failed to pin the chat.'
    },
    unpin: {
      success: 'Chat has been unpinned.',
      error: 'Failed to unpin the chat.'
    },
    star: {
      noReply: 'Please reply to the message you want to star.',
      success: 'Message has been starred.',
      error: 'Failed to star the message.'
    },
    unstar: {
      noReply: 'Please reply to the message you want to unstar.',
      success: 'Message has been unstarred.',
      error: 'Failed to unstar the message.'
    },
    mydp: {
      options: {
        all: 'Everyone can see your profile photo',
        contacts: 'Only your contacts can see your profile photo',
        contact_blacklist: 'Contacts except some can see your profile photo',
        none: 'No one can see your profile photo'
      },
      help: '*Choose a profile picture privacy setting:*\n\n{options}\n\n_Example:_ .mydp contacts',
      success: 'Profile picture privacy updated to *{choice}*.',
      error: 'Failed to update profile picture privacy.'
    },
    mystatus: {
      options: {
        all: 'Everyone can see your status updates',
        contacts: 'Only your contacts can see your status',
        contact_blacklist: 'Contacts except some can see your status',
        none: 'No one can see your status'
      },
      help: '*Choose a status privacy setting:*\n\n{options}\n\n_Example:_ .mystatus contact_blacklist',
      success: 'Status privacy updated to *{choice}*.',
      error: 'Failed to update status privacy.'
    },
    groupadd: {
      options: {
        all: 'Everyone can add you to groups',
        contacts: 'Only contacts can add you to groups',
        contact_blacklist: 'Contacts except some can add you',
        none: 'No one can add you to groups'
      },
      help: '*Choose a group add privacy setting:*\n\n{options}\n\n_Example:_ .groupadd contacts',
      success: 'Group add privacy updated to *{choice}*.',
      error: 'Failed to update group add privacy.'
    },
    lastseen: {
      options: {
        all: 'Everyone can see your last seen',
        contacts: 'Only contacts can see your last seen',
        contact_blacklist: 'Contacts except blocked ones can see your last seen',
        none: 'No one can see your last seen'
      },
      help: '*Choose a valid privacy setting:*\n\n',
      example: '\n_Example:_ .lastseen contacts',
      success: 'Last seen privacy updated to *{priv}*.\n{desc}',
      error: 'An error occurred while updating last seen settings.'
    },
    myonline: {
      options: {
        all: 'Everyone can see when you\'re online',
        match_last_seen: 'Matches your Last Seen setting'
      },
      help: '*Choose an online privacy setting:*\n\n{options}\n\n_Example:_ .myonline match_last_seen',
      success: 'Online privacy updated to *{choice}*.',
      error: 'Failed to update online privacy.'
    },
    onwa: {
      noNumber: 'Please provide a valid number.',
      invalid: 'Please provide a valid phone number with country code.',
      exists: '{number} exists on WhatsApp!',
      notExists: '{number} does not exist on WhatsApp.',
      error: 'An error occurred while checking the number.'
    },
    bizprofile: {
      result: 'Business Description: {description}\nCategory: {category}',
      error: 'Failed to fetch business profile.'
    },
    removedp: {
      success: 'Profile picture removed.',
      error: 'Failed to remove profile picture.'
    },
    archive: {
      success: 'Chat has been archived successfully.',
      error: 'There was an error while archiving the chat. Please try again.'
    },
    vv: {
      caption: '*REVEALED BY FLASH-MD*'
    },
    details: {
      noReply: 'Please reply to a message to view its raw details.',
      result: '*FLASH-MD Message Details:*\n```\n{part}\n```',
      error: 'Failed to read quoted message.'
    },
    blocklist: {
      empty: 'Your block list is empty.',
      result: '*Blocked Contacts:*\n\n{list}',
      error: 'An error occurred while retrieving the block list.'
    },
    vcard: {
      noReply: 'Reply to a user\'s message to save their number.',
      noName: 'Please provide a name for the contact.'
    },
    location: {
      noReply: 'Reply to a location message to get the map link.',
      result: 'Live Location: {url}'
    }
  },
  
  ytmp3: {
    noText: 'Please provide a song name or YouTube Link.',
    noResults: 'No results found for your query.',
    noLink: 'Failed to retrieve the MP3 download link.',
    caption: 'FLASH-MD V3',
    error: 'An error occurred while processing your request.'
  },
  
  ytmp4: {
    noText: 'Please provide a video name or YouTube URL.',
    noResults: 'No results found.',
    noLink: 'Failed to retrieve the MP4 download link.',
    caption: '*FLASH-MD V3 - MP4*',
    error: 'An error occurred while downloading MP4.'
  },
  
  yts: {
    noText: 'What do you want to search for?',
    header: '*YouTube Search Results for:* _{query}_\n\n',
    item: '*{num}. {title}*\n📺 Channel: {channel}\n⏱ Duration: {duration}\n🔗 Link: {url}\n\n',
    footer: '*Powered by {botName}*',
    error: 'Error occurred while searching YouTube.'
  },
  
  language: {
    available: '🌐 Available Languages',
    current: '📌 Current:',
    usage: 'Usage: .language es\n.language fr\n.language sw',
    notSupported: 'Language',
    supported: 'Supported:',
    example: 'Example:',
    success: '✅ Language set to',
    response: 'All responses will now be in'
  },
  
  online: {
    checking: '🔍 Checking online members...',
    noMembers: '👥 *Online Members*\n\nNo members are currently online.\n\n⚡ Powered by {botName}',
    header: '👥 *ONLINE MEMBERS*',
    onlineLabel: '📊 Online:',
    error: '❌ Failed to get online members:',
    powered: '⚡ Powered by'
  },
  
  info: {
    result: '*📄 Group Information:*\n\n📌 *Name:* {groupName}\n🆔 *ID:* {groupId}\n👑 *Owner:* @{ownerNumber}\n👥 *Members:* {totalMembers}\n🛡️ *Admins ({adminCount}):*\n{adminList}',
    error: '⚠️ Could not fetch group info.'
  },
  
  antilink: {
    usage: '❌ Usage: .antilink on|off warn|kick|delete',
    success: '✅ Antilink is now *{option}* with action: *{action}*'
  },
  
  hidetag: {
    default: '👥',
    noMessage: '❗ Please provide a message or reply to one to mention everyone.'
  },
  
  tagall: {
    noParticipants: '⚠️ No participants found in this group.',
    defaultText: 'Hello everyone!',
    header: '*📣 {text}*\n\n',
    error: '❌ Something went wrong while tagging everyone.'
  },
  
  rename: {
    noName: '❗ Provide a new group name.',
    success: '✅ Group name changed to: *{name}*',
    error: '❌ Failed to change group name.'
  },
  
  kick: {
    noTarget: '⚠️ Tag or reply to the user you want to remove.',
    success: '✅ @{user} has been removed.',
    error: '❌ Failed to remove user.'
  },
  
  add: {
    noNumber: '⚠️ Provide a number to add.',
    success: '✅ {number} added to the group.',
    error: '❌ Failed to add user. They may have privacy restrictions.'
  },
  
  promote: {
    noTarget: '⚠️ Tag or reply to the user you want to promote.',
    success: '✅ @{user} is now an admin.',
    error: '❌ Failed to promote user.'
  },
  
  demote: {
    noTarget: '⚠️ Tag or reply to the admin you want to demote.',
    success: '🛑 @{user} has been demoted.',
    error: '❌ Failed to demote user.'
  },
  
  approve: {
    noRequests: '📭 No join requests to approve.',
    success: '✅ All join requests approved.',
    error: '❌ Failed to approve requests.'
  },
  
  reject: {
    noRequests: '📭 No join requests to reject.',
    success: '🚫 All join requests rejected.',
    error: '❌ Failed to reject requests.'
  },
  
  req: {
    noRequests: '📭 No pending join requests.',
    list: '📥 Pending Requests:\n{list}\n\nUse *approve* or *reject* to respond.',
    error: '❌ Failed to get requests.'
  },
  
  disap: {
    success24: '⏳ Disappearing messages set to 24 hours.',
    success7: '⏳ Disappearing messages set to 7 days.',
    success90: '⏳ Disappearing messages set to 90 days.',
    off: '🗑️ Disappearing messages turned off.',
    error: '❌ Failed to set disappearing messages.',
    help: '*Disappearing Message Options*\n\n• *disap1* — 24 hours\n• *disap7* — 7 days\n• *disap90* — 90 days\n• *disap-off* — Disable'
  },
  
  desc: {
    noDesc: '❗ Please provide a new description.',
    success: '✅ Group description updated:\n{desc}',
    error: '❌ Failed to update group description.'
  },
  
  lock: {
    success: '🔒 Group locked. Only admins can message now.',
    error: '❌ Failed to lock group.'
  },
  
  unlock: {
    success: '🔓 Group unlocked. All members can message.',
    error: '❌ Failed to unlock group.'
  },
  
  invite: {
    success: '🔗 Group link:\nhttps://chat.whatsapp.com/{code}',
    error: '❌ Failed to get invite link.'
  },
  
  revoke: {
    success: '♻️ New group link:\nhttps://chat.whatsapp.com/{code}',
    error: '❌ Failed to generate new link.'
  },
  
  broadcast: {
    noMessage: '❗ Provide a message to broadcast.',
    start: '📢 Broadcasting message...',
    message: '*📢 Broadcast Message*\n\n{message}',
    error: '❌ Broadcast failed.'
  },
  
  leave: {
    error: '❌ Failed to leave group.'
  },
  
  create: {
    usage: 'Usage: .create MyGroup @user or reply or number (e.g. 2547xxxxxxx)',
    welcome: '👋 Welcome to the new group!',
    error: '❌ Failed to create group.'
  },
  
  kickall: {
    warning: '⚠️ Removing all non-admins in 5 seconds...'
  },
  
  findcmd: {
    noCommand: '❌ Please provide a command name to search for.\n\nExample: .findcmd menu',
    header: '📋 *Command Information*',
    name: '*Name:*',
    aliases: '*Aliases:*',
    description: '*Description:*',
    category: '*Category:*',
    access: '*Access:*',
    fileLocation: '*File Location:*',
    ownerOnly: 'Owner Only',
    notFound: '❌ Command',
    example: 'Try using: .findcmd menu'
  },
  
  categories: {
    header: '*FLASH-MD-V3 CATEGORIES*',
    use: 'Use:',
    general: 'general',
    whatsapp: 'whatsapp',
    user: 'user',
    error: 'Error loading categories'
  },
  
  category: {
    provideName: 'Provide a category name',
    notFound: 'Category not found',
    aliases: 'aliases',
    error: 'Error loading category commands'
  },
  
  country: {
    noCountry: '❌ Please provide a country name.\nExample: .country Kenya',
    fetching: '🔍 Fetching information about',
    notFound: '❌ Country',
    header: '🌍 *COUNTRY INFORMATION*',
    name: '📌 *Name:*',
    capital: '🏛️ *Capital:*',
    phoneCode: '📞 *Phone Code:*',
    continent: '🌐 *Continent:*',
    languages: '🗣️ *Languages:*',
    currency: '💰 *Currency:*',
    area: '📏 *Area:*',
    drivingSide: '🚗 *Driving Side:*',
    landlocked: '🏝️ *Landlocked:*',
    government: '🏛️ *Government:*',
    coordinates: '📍 *Coordinates:*',
    isoCode: '🪪 *ISO Code:*',
    googleMaps: '🔗 *Google Maps:*',
    famousFor: '⭐ *Famous For:*',
    neighbors: '🔄 *Neighbors:*',
    yes: 'Yes',
    no: 'No',
    powered: '⚡ Powered by',
    error: '❌ Failed to fetch country information. Please try again later.'
  },
  
  structure: {
    helpTitle: '📋 *Structure/Tree Command Help*',
    cmdDefault: '.structure - Show full bot structure summary',
    cmdTree: '.structure tree - Show directory tree',
    cmdDetails: '.structure details - Show detailed file analysis',
    cmdSize: '.structure size - Show size breakdown by folder',
    cmdFiles: '.structure files - List all files with extensions',
    cmdTreeAlias: '.tree - Same as .structure tree',
    analyzing: '🔍 Analyzing bot structure... This may take a moment.',
    treeHeader: '🌳 *BOT DIRECTORY TREE*',
    detailsHeader: '🔍 *DETAILED FILE ANALYSIS*',
    sizeHeader: '📊 *SIZE BREAKDOWN BY FOLDER*',
    filesHeader: '📋 *ALL FILES BY EXTENSION*',
    analysisHeader: '📊 *BOT STRUCTURE ANALYSIS*',
    totalFiles: '📄 *Total Files:*',
    totalFolders: '📁 *Total Folders:*',
    totalSize: '💾 *Total Size:*',
    platform: '🖥️ *Platform:*',
    node: '🐍 *Node Version:*',
    topExtensions: '📂 *Top Extensions:*',
    largestFiles: '💎 *Largest Files:*',
    largestFolders: '📂 *Largest Folders:*',
    tips: '💡 *Tips:*',
    continued: '_Continued..._',
    powered: '⚡ Powered by',
    error: '❌ Failed to analyze structure.'
  },
  
  zip: {
    creating: '📦 Creating backup ZIP of the bot... This may take a moment.',
    tooLarge: '⚠️ Backup file is {size}MB which exceeds WhatsApp limit (50MB).\n\nPlease upload manually from server.',
    success: '✅ *Bot Backup Created*',
    caption: '📦 *{botName} Backup*',
    error: '❌ Failed to create backup: {error}',
    powered: '⚡ Powered by'
  },
  
  song: {
    noQuery: '❗ Please provide a song name.',
    searching: '🔍 Searching your song...',
    notFound: '❌ No results found.',
    downloading: '⬇️ Downloading audio...',
    failed: '❌ Failed to get audio link.',
    title: '*Title:*',
    duration: '*Duration:*',
    channel: '*Channel:*',
    powered: '*Powered by:*',
    error: '❌ Error:'
  },
  
  url: {
    noMedia: '❌ Send or reply to media.',
    tooLarge: '❌ File too large.',
    success: '✅ *URL Created Successfully*',
    powered: '⚡ Powered by',
    error: '❌ Failed to upload media.'
  },
  
  ping: {
    pong: '🏓 Pong!\n⏱️ *_Flash-MD-V3 Speed: {latency} ms_*'
  },
  
  uptime: {
    uptime: '*_FLASH-MD-V3 UPTIME: {uptime}_*'
  },
  
  repo: {
    header: '*🤖',
    stars: 'Stars:',
    forks: 'Forks:',
    watchers: 'Watchers:',
    created: 'Created:',
    updated: 'Last Updated:',
    powered: '*⚡ Powered by',
    star: '_Star ⭐ the repository if you like the bot and want to support future development!_',
    fork: '_Don\'t forget to fork 🍴 and watch 👀 for updates!_',
    error: '❌ Failed to fetch repository information. Please try again later.'
  }
}

export const LIMITS = {
  maxMessageLength: 4000,
  defaultTimeout: 10000,
  pairingTimeout: 30000,
  maxMediaSize: 100 * 1024 * 1024,
  maxFetchSize: 100 * 1024 * 1024,
  truncateLimit: 65536,
  hackDelay: 1000,
  coinDelay: 1500
}
