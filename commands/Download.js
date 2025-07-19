const { franceking } = require('../main');
const axios = require('axios');
const getFBInfo = require('@xaviabot/fb-downloader');

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const day = ("0" + date.getDate()).slice(-2);
    const month = ("0" + (date.getMonth() + 1)).slice(-2);
    const year = date.getFullYear();
    const hours = ("0" + (date.getHours() % 12 || 12)).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);
    const ampm = date.getHours() >= 12 ? 'pm' : 'am';
    return `${day}/${month}/${year} at ${hours}:${minutes} ${ampm}`;
}


module.exports = [
    {
        name: 'npm',
        get flashOnly() {
  return franceking();
},
        aliases: [],
        description: 'Search for an NPM package and view its details.',
        category: 'General',
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;

            if (!args || args.length === 0) {
                return await sock.sendMessage(chatId, {
                    text: '❗ Please provide an NPM package name to search for.'
                }, { quoted: msg });
            }

            const query = args.join(' ');
            const apiUrl = `https://weeb-api.vercel.app/npm?query=${encodeURIComponent(query)}`;

            try {
                const res = await axios.get(apiUrl);
                const data = res.data;

                if (!data.results?.length) {
                    return await sock.sendMessage(chatId, {
                        text: `❌ No results found for "${query}".`
                    }, { quoted: msg });
                }

                const pkg = data.results[0];
                const formattedDate = formatDate(pkg.date);

                const result = `*📦 NPM PACKAGE RESULT*

*📁 Name:* ${pkg.name}
*📌 Version:* ${pkg.version}
*📝 Description:* ${pkg.description}
*👤 Publisher:* ${pkg.publisher.username}
*⚖️ License:* ${pkg.license}
*📅 Last Updated:* ${formattedDate}

🔗 *NPM:* ${pkg.links.npm}
🔗 *Repository:* ${pkg.links.repository || 'N/A'}
🔗 *Homepage:* ${pkg.links.homepage || 'N/A'}

_Use this info to explore or install the package via terminal_`;

                await sock.sendMessage(chatId, {
                    text: result,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363347365643318@newsletter',
                            newsletterName: 'FLASH-MD',
                            serverMessageId: -1
                        }
                    }
                });
            } catch (error) {
                await sock.sendMessage(chatId, {
                    text: '❌ An error occurred while fetching the package info.'
                }, { quoted: msg });
            }
        }
    },
{
  name: "video-dl",
    get flashOnly() {
  return franceking();
},
  aliases: ["vddownload"],
  description: "Download high-quality videos from social media URLs",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    if (!args || args.length === 0) {
      return await sock.sendMessage(chatId, {
        text: "Please provide a valid video URL."
      }, { quoted: msg });
    }

    try {
      const url = args.join(' ');
      const res = await fetch(`https://bk9.fun/download/alldownload?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.status && data.BK9 && data.BK9.high) {
        await sock.sendMessage(chatId, {
          video: { url: data.BK9.high },
          caption: "🎥 *Joshuamambo1-MD* Video Downloader (High Quality)",
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363347365643318@newsletter',
              newsletterName: 'Joshuamambo1-MD',
              serverMessageId: -1
            }
          }
        }, { quoted: msg });

        await sock.sendMessage(chatId, {
          text: "✅ Video downloaded successfully!"
        }, { quoted: msg });

      } else {
        await sock.sendMessage(chatId, {
          text: "❌ No valid video found."
        }, { quoted: msg });
      }

    } catch (error) {
      console.error("Video-DL Error:", error);
      await sock.sendMessage(chatId, {
        text: "An error occurred while processing the video request. Please try again."
      }, { quoted: msg });
    }
  }
}, 
    {
  name: "tgs",
        get flashOnly() {
  return franceking();
},
  aliases: ["tg"],
  description: "Download and send all stickers from a Telegram pack",
  category: "Sticker",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    if (!args || args.length === 0) {
      return await sock.sendMessage(chatId, {
        text: "Please provide a Telegram sticker pack URL."
      }, { quoted: msg });
    }

    try {
      const stickerPackUrl = args.join(" ");
      const res = await fetch(`https://weeb-api.vercel.app/telesticker?url=${encodeURIComponent(stickerPackUrl)}`);
      const data = await res.json();

      if (data.stickers && data.stickers.length > 0) {
        for (const stickerUrl of data.stickers) {
          await sock.sendMessage(chatId, {
            sticker: { url: stickerUrl },
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedNewsletterMessageInfo: {
                newsletterJid: '120363347365643318@newsletter',
                newsletterName: 'Joshuamambo1-MD',
                serverMessageId: -1
              }
            }
          }, { quoted: msg });
        }

        await sock.sendMessage(chatId, {
          text: "✅ All Telegram stickers sent successfully!"
        }, { quoted: msg });

      } else {
        await sock.sendMessage(chatId, {
          text: "❌ No stickers found in the provided pack."
        }, { quoted: msg });
      }

    } catch (err) {
      console.error("TGS Error:", err);
      await sock.sendMessage(chatId, {
        text: "An error occurred while fetching the sticker pack. Please try again later."
      }, { quoted: msg });
    }
  }
}, 
{
  name: "xdl",
    get flashOnly() {
  return franceking();
},
  aliases: ["xvideodl"],
  description: "Download adult video from xnxx in high quality",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    if (!args || args.length === 0) {
      return await sock.sendMessage(chatId, {
        text: "Please provide the video URL to download."
      }, { quoted: msg });
    }

    try {
      const videoUrl = args.join(" ");
      const response = await fetch(`https://api.agatz.xyz/api/xnxxdown?url=${encodeURIComponent(videoUrl)}`);
      const data = await response.json();

      if (!data.status || !data.data || !data.data.status) {
        return await sock.sendMessage(chatId, {
          text: "❌ Failed to retrieve video info. Please check the link."
        }, { quoted: msg });
      }

      const videoData = data.data;
      const highQualityUrl = videoData.files?.high;

      if (!highQualityUrl) {
        return await sock.sendMessage(chatId, {
          text: "❌ High quality video not available."
        }, { quoted: msg });
      }

      const caption = `*🔞 THE Joshuamambo1-MD X-Video Downloader 🥵*\n\n` +
                      `• *Title:* ${videoData.title}\n` +
                      `• *Duration:* ${videoData.duration}s\n` +
                      `• *Info:* ${videoData.info}\n` +
                      `• *Quality:* High`;

      await sock.sendMessage(chatId, {
        video: { url: highQualityUrl },
        caption,
        contextInfo: {
          forwardingScore: 1,
          isForwarded: true,
          forwardedNewsletterMessageInfo: {
            newsletterJid: '120363347365643318@newsletter',
            newsletterName: 'Joshuamambo1-MD',
            serverMessageId: -1
          }
        }
      }, { quoted: msg });

    } catch (error) {
      console.error("XDL Error:", error);
      await sock.sendMessage(chatId, {
        text: "⚠️ An error occurred while processing the request. Try again later."
      }, { quoted: msg });
    }
  }
}, 
    
 {
  name: "xsearch",
     get flashOnly() {
  return franceking();
},
  aliases: [],
  description: "Search for videos on XNXX",
  category: "General",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    if (!args || args.length === 0) {
      return await sock.sendMessage(chatId, {
        text: "Please provide a search query."
      }, { quoted: msg });
    }

    const query = args.join(" ");
    const apiUrl = `https://api.agatz.xyz/api/xnxx?message=${encodeURIComponent(query)}`;

    try {
      const res = await fetch(apiUrl);
      const jsonData = await res.json();

      if (jsonData.status !== 200 || !jsonData.data?.result || jsonData.data.result.length === 0) {
        return await sock.sendMessage(chatId, {
          text: "No results found for your query."
        }, { quoted: msg });
      }

      const results = jsonData.data.result;

      let resultsText = `*YOUR XSEARCH RESULTS*\n\n`;
      for (const video of results) {
        resultsText += 
          `Title: ${video.title}\n` +
          `Info: ${video.info}\n` +
          `Link: ${video.link}\n\n` +
          `Use the xdl command to download your video\n\n`;
      }

      await sock.sendMessage(chatId, { text: resultsText }, { quoted: msg });

    } catch (error) {
      console.error("XSEARCH Error:", error);
      await sock.sendMessage(chatId, {
        text: "An error occurred while fetching the search results. Please try again later."
      }, { quoted: msg });
    }
  }
},   
  {
  name: "insta",
      get flashOnly() {
  return franceking();
},
  aliases: ["ig", "Instagram", "igdl"],
  reaction: "📸",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;
    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363347365643318@newsletter',
        newsletterName: 'Joshuamambo1-MD',
        serverMessageId: -1
      }
    };

    if (!args || args.length === 0) {
      return await sock.sendMessage(chatId, { text: "Please provide an Instagram URL to download from." }, { quoted: msg });
    }

    const url = args.join(' ');

    try {
      const response = await fetch(`https://api.diioffc.web.id/api/download/instagram?url=${encodeURIComponent(url)}`);
      const data = await response.json();

      if (data.status && data.result && data.result.length > 0) {
        const media = data.result[0];

        if (url.startsWith('https://www.instagram.com/reel/')) {
          if (media.url) {
            await sock.sendMessage(chatId, {
              video: { url: media.url },
              caption: "Joshuamambo1-MD INSTA DOWNLOADER - Video",
              contextInfo
            }, { quoted: msg });
            await sock.sendMessage(chatId, { text: "Done Downloading your Video!" }, { quoted: msg });
          } else {
            await sock.sendMessage(chatId, { text: "No valid video found." }, { quoted: msg });
          }
        } else if (url.startsWith('https://www.instagram.com/p/')) {
          if (media.thumbnail) {
            await sock.sendMessage(chatId, {
              image: { url: media.thumbnail },
              caption: "Joshuamambo1-MD INSTA DOWNLOADER - Image",
              contextInfo
            }, { quoted: msg });
            await sock.sendMessage(chatId, { text: "Done Downloading Your Image!" }, { quoted: msg });
          } else {
            await sock.sendMessage(chatId, { text: "No valid image found." }, { quoted: msg });
          }
        } else {
          await sock.sendMessage(chatId, { text: "Unsupported Instagram URL type." }, { quoted: msg });
        }
      } else {
        await sock.sendMessage(chatId, { text: "No media found or invalid URL provided." }, { quoted: msg });
      }
    } catch (error) {
      console.error("INSTA Error:", error);
      await sock.sendMessage(chatId, { text: "An error occurred while processing the request. Please try again." }, { quoted: msg });
    }
  }
},  
  {
  name: "gitclone",
      get flashOnly() {
  return franceking();
},
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    if (!args || args.length === 0) {
      return await sock.sendMessage(chatId, { text: "Please provide a valid GitHub repo link." }, { quoted: msg });
    }

    const gitlink = args.join(" ");
    if (!gitlink.includes("github.com")) {
      return await sock.sendMessage(chatId, { text: "Is that a GitHub repo link?!" }, { quoted: msg });
    }

    try {
      let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
      let [, user3, repo] = gitlink.match(regex1) || [];
      if (!user3 || !repo) {
        return await sock.sendMessage(chatId, { text: "Invalid GitHub repo link." }, { quoted: msg });
      }

      repo = repo.replace(/\.git$/, "");
      let url = `https://api.github.com/repos/${user3}/${repo}/zipball`;

      const headResponse = await fetch(url, { method: "HEAD" });
      const contentDisposition = headResponse.headers.get("content-disposition");
      if (!contentDisposition) {
        return await sock.sendMessage(chatId, { text: "Failed to get repo archive." }, { quoted: msg });
      }

      const filenameMatch = contentDisposition.match(/attachment; filename=(.*)/);
      if (!filenameMatch) {
        return await sock.sendMessage(chatId, { text: "Failed to parse filename." }, { quoted: msg });
      }

      const filename = filenameMatch[1];
      await sock.sendMessage(
        chatId,
        {
          document: { url },
          fileName: filename.endsWith(".zip") ? filename : filename + ".zip",
          mimetype: "application/zip",
        },
        { quoted: msg }
      );
    } catch (error) {
      console.error("GitClone Error:", error);
      await sock.sendMessage(chatId, { text: "An error occurred while fetching the GitHub repo." }, { quoted: msg });
    }
  },
}, 
    
  {
  name: "math",
      get flashOnly() {
  return franceking();
},
  category: "General",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;
    const input = args.join("").replace(/\s+/g, "");

    if (!/^[0-9+\-*/().]+$/.test(input)) {
      return await sock.sendMessage(chatId, { text: "Invalid input. Please use a valid format like '1+1' or '2*3+5/2'." }, { quoted: msg });
    }

    try {
      const result = eval(input);
      if (!isFinite(result)) {
        return await sock.sendMessage(chatId, { text: "Error: Division by zero or other invalid operation." }, { quoted: msg });
      }

      await sock.sendMessage(chatId, { text: `The result is: ${result}` }, { quoted: msg });
    } catch {
      await sock.sendMessage(chatId, { text: "Invalid expression. Please ensure you are using valid mathematical operators." }, { quoted: msg });
    }
  },
},  
{
  name: "fb",
    get flashOnly() {
  return franceking();
},
  aliases: ["fbdl", "facebook", "fb1"],
  reaction: "📽️",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363347365643318@newsletter',
        newsletterName: 'Joshuamambo1-MD',
        serverMessageId: -1
      }
    };

    if (!args[0]) {
      return await sock.sendMessage(chatId, {
        text: "Insert a public facebook video link!"
      }, { quoted: msg });
    }

    const queryURL = args.join(" ");

    try {
      getFBInfo(queryURL)
        .then(async (result) => {
          const caption = `*Title:* ${result.title}\n\n*Direct Link:* ${result.url}`;
          await sock.sendMessage(chatId, {
            image: { url: result.thumbnail },
            caption
          }, { quoted: msg });

          await sock.sendMessage(chatId, {
            video: { url: result.hd },
            caption: "_╰►FB VIDEO DOWNLOADED BY_ *Joshuamambo1-MD*",
            contextInfo
          }, { quoted: msg });
        })
        .catch(async () => {
          await sock.sendMessage(chatId, {
            text: "try fb2 on this link"
          }, { quoted: msg });
        });
    } catch (error) {
      await sock.sendMessage(chatId, {
        text: "An error occurred while downloading your media."
      }, { quoted: msg });
    }
  }
}, 
   {
  name: "fb2",
       get flashOnly() {
  return franceking();
},
  aliases: ["fbdl2", "fb2", "facebook2"],
  reaction: "📽️",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363347365643318@newsletter',
        newsletterName: 'Joshuamambo1-MD',
        serverMessageId: -1
      }
    };

    if (!args[0]) {
      return await sock.sendMessage(chatId, {
        text: "Insert a public facebook video link!"
      }, { quoted: msg });
    }

    const queryURL = args.join(" ");

    try {
      getFBInfo(queryURL)
        .then(async (result) => {
          const caption = `*Title:* ${result.title}\n\n*Direct Link:* ${result.url}`;
          await sock.sendMessage(chatId, {
            image: { url: result.thumbnail },
            caption
          }, { quoted: msg });

          await sock.sendMessage(chatId, {
            video: { url: result.sd },
            caption: "_╰►FACEBOOK VIDEO DOWNLOADED BY_ *Joshuamambo1-MD*",
            contextInfo
          }, { quoted: msg });
        })
        .catch(async (error) => {
          await sock.sendMessage(chatId, {
            text: error.toString()
          }, { quoted: msg });
        });
    } catch (error) {
      await sock.sendMessage(chatId, {
        text: "An error occurred while Flash-MD was downloading your media."
      }, { quoted: msg });
    }
  }
}, 
    
  {
  name: "element",
      get flashOnly() {
  return franceking();
},
  aliases: ["chem", "study"],
  category: "User",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363347365643318@newsletter',
        newsletterName: 'Joshuamambo1-MD',
        serverMessageId: -1
      }
    };

    const element = args.join(" ");
    if (!element) {
      return await sock.sendMessage(chatId, {
        text: "Please specify an element name or symbol."
      }, { quoted: msg });
    }

    try {
      const apiUrl = `https://api.popcat.xyz/periodic-table?element=${encodeURIComponent(element)}`;
      const response = await fetch(apiUrl);
      const result = await response.json();

      if (result && !result.error) {
        const info = 
          `Element Name: ${result.name}\n` +
          `Element Symbol: ${result.symbol}\n` +
          `Atomic Number: ${result.atomic_number}\n` +
          `Atomic Mass: ${result.atomic_mass}\n` +
          `Period: ${result.period}\n` +
          `Phase: ${result.phase}\n` +
          `Discovered By: ${result.discovered_by}`;

        await sock.sendMessage(chatId, {
          text: "A moment, Joshuamambo1-MD is sending your results"
        }, { quoted: msg });

        if (result.image) {
          await sock.sendMessage(chatId, {
            image: { url: result.image },
            caption: info,
            contextInfo
          }, { quoted: msg });
        } else {
          await sock.sendMessage(chatId, {
            text: info,
            contextInfo
          }, { quoted: msg });
        }
      } else {
        await sock.sendMessage(chatId, {
          text: "Element not found or error fetching data."
        }, { quoted: msg });
      }
    } catch (error) {
      await sock.sendMessage(chatId, {
        text: "Error fetching element data."
      }, { quoted: msg });
    }
  }
}, 
{
  name: "blackpink",
    get flashOnly() {
  return franceking();
},
  aliases: ["bpink"],
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363347365643318@newsletter',
        newsletterName: 'Joshuamambo1-MD',
        serverMessageId: -1
      }
    };

    if (args[0]) {
      return await sock.sendMessage(chatId, {
        text: "This command doesn't require any arguments. Just type the command to get 5 random Blackpink images!"
      }, { quoted: msg });
    }

    try {
      const response = await fetch('https://raw.githubusercontent.com/arivpn/dbase/master/kpop/blekping.txt');
      const textData = await response.text();
      const imageUrls = textData.split('\n').filter(url => url.trim() !== '');

      if (imageUrls.length < 5) {
        return await sock.sendMessage(chatId, {
          text: "There aren't enough images available at the moment. Please try again later."
        }, { quoted: msg });
      }

      const selectedImages = [];
      while (selectedImages.length < 5) {
        const randomImage = imageUrls[Math.floor(Math.random() * imageUrls.length)];
        if (!selectedImages.includes(randomImage)) {
          selectedImages.push(randomImage);
        }
      }

      await sock.sendMessage(chatId, {
        text: "IRON-MAN-MD is sending you 5 BLACKPINK IMAGES"
      }, { quoted: msg });

      for (const imageUrl of selectedImages) {
        await sock.sendMessage(chatId, {
          image: { url: imageUrl },
          caption: "_╰►DOWNLOADED BY_ *Joshuamambo1-MD*",
          contextInfo
        }, { quoted: msg });
      }

      await sock.sendMessage(chatId, {
        text: "SUCCESSFULLY SENT THE 5 IMAGES ✅"
      }, { quoted: msg });

    } catch (e) {
      await sock.sendMessage(chatId, {
        text: "A fatal error has occurred... \n " + e.message
      }, { quoted: msg });
    }
  }
}, 
    {
  name: "story",
        get flashOnly() {
  return franceking();
},
  aliases: ["instastory", "igstory"],
  description: "Download all Instagram stories from a username",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;
    const senderName = msg.pushName || "User";
    const contextInfo = {
      forwardingScore: 1,
      isForwarded: true,
      forwardedNewsletterMessageInfo: {
        newsletterJid: '120363347365643318@newsletter',
        newsletterName: 'IRON-MAN-MD',
        serverMessageId: -1
      }
    };

    if (!args[0]) {
      return await sock.sendMessage(chatId, { text: "Please provide a valid Instagram username.", contextInfo }, { quoted: msg });
    }

    const username = args[0];
    const apiUrl = `https://bk9.fun/download/igs?username=${encodeURIComponent(username)}`;

    try {
      const apiResponse = await axios.get(apiUrl);

      if (!apiResponse.data.status || !apiResponse.data.BK9 || apiResponse.data.BK9.length === 0) {
        return await sock.sendMessage(chatId, { text: "No stories found or failed to fetch stories.", contextInfo }, { quoted: msg });
      }

      const stories = apiResponse.data.BK9;

      await sock.sendMessage(chatId, {
        text: `*IRON-MAN Instagram Story Downloader*\n\n` +
              `╭───────────────◆\n` +
              `│⿻ *Instagram User:* ${username}\n` +
              `│⿻ *Total Stories:* ${stories.length}\n` +
              `╰────────────────◆\n\n` +
              `_Downloading all stories now..._`,
        contextInfo
      }, { quoted: msg });

      let mediaSent = 0;

      for (const story of stories) {
        if (story.url) {
          if (story.type.includes("image")) {
            await sock.sendMessage(chatId, {
              image: { url: story.url },
              caption: `📷 Instagram Story - @${username}`
            }, { quoted: msg });
            mediaSent++;
          } else if (story.type.includes("video")) {
            await sock.sendMessage(chatId, {
              video: { url: story.url },
              caption: `🎥 Instagram Story - @${username}`
            }, { quoted: msg });
            mediaSent++;
          }
        }
      }

      if (mediaSent > 0) {
        await sock.sendMessage(chatId, { text: `✅ All ${mediaSent} stories have been sent.`, contextInfo }, { quoted: msg });
      } else {
        await sock.sendMessage(chatId, { text: "⚠️ The stories could not be sent. They might be expired or private.", contextInfo }, { quoted: msg });
      }

    } catch (error) {
      console.error("IG Story Error:", error);
      await sock.sendMessage(chatId, { text: "An error occurred while fetching stories. Try again later.", contextInfo }, { quoted: msg });
    }
  }
    },  
            
   {
  name: "mediafire",
       get flashOnly() {
  return franceking();
},
  aliases: ["mf", "mfdl"],
  description: "Download files from MediaFire",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;
const contextInfo = {
  forwardingScore: 1,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363347365643318@newsletter',
    newsletterName: 'IRON-MAN-MD',
    serverMessageId: -1
  }
};
    const input = args.join(' ');
    if (!input) {
      return await sock.sendMessage(chatId, {
        text: "Please insert a MediaFire file link.",
        contextInfo
      }, { quoted: msg });
    }

    try {
      await sock.sendMessage(chatId, {
        text: "Fetching your file from MediaFire, please wait...",
        contextInfo
      }, { quoted: msg });

      const res = await axios.get(`https://bk9.fun/download/mediafire?url=${encodeURIComponent(input)}`);
      const data = res.data;

      if (!data.status || !data.BK9 || !data.BK9.link) {
        return await sock.sendMessage(chatId, {
          text: "Failed to retrieve file. Please check the link and try again.",
          contextInfo
        }, { quoted: msg });
      }

      const file = data.BK9;

      await sock.sendMessage(chatId, {
        document: { url: file.link },
        fileName: file.name,
        mimetype: `application/${file.mime.toLowerCase()}`,
        caption:
          `╰► *MediaFire Download Completed!*\n` +
          `Downloaded by: *IRON-MAN-MD*\n\n` +
          `📂 *Name:* ${file.name}\n` +
          `📦 *Size:* ${file.size}\n` +
          `📄 *Type:* ${file.filetype}\n` +
          `📅 *Uploaded:* ${file.uploaded}`
      }, { quoted: msg });

    } catch (err) {
      console.error("MediaFire Error:", err);
      await sock.sendMessage(chatId, {
        text: "An error occurred while processing the request. Please try again later.",
        contextInfo
      }, { quoted: msg });
    }
  }
}, 
    {
  name: "tiktok",
        get flashOnly() {
  return franceking();
},
  aliases: ["tik", "tok", "tikdl"],
  description: "Download TikTok video",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;
const contextInfo = {
  forwardingScore: 1,
  isForwarded: true,
  forwardedNewsletterMessageInfo: {
    newsletterJid: '120363347365643318@newsletter',
    newsletterName: 'IRON-MAN-MD',
    serverMessageId: -1
  }
};
    const input = args.join(' ');
    if (!input) {
      return await sock.sendMessage(chatId, {
        text: "Please insert a TikTok video link.",
        contextInfo
      }, { quoted: msg });
    }

    try {
      await sock.sendMessage(chatId, {
        text: "⏳ Downloading TikTok video, please wait...",
        contextInfo
      }, { quoted: msg });

      const res = await axios.get(`https://bk9.fun/download/tiktok?url=${encodeURIComponent(input)}`);
      const data = res.data;

      if (!data.status || !data.BK9) {
        return await sock.sendMessage(chatId, {
          text: "Failed to retrieve video. Please check the link and try again.",
          contextInfo
        }, { quoted: msg });
      }

      const videoUrl = data.BK9.BK9;
      const caption = data.BK9.desc || "No caption available.";

      await sock.sendMessage(chatId, {
        video: { url: videoUrl },
        caption: `*📹 TikTok Video Downloaded!*\n\n*Caption:* ${caption}\n\n_Provided by FLASH-MD_`,
        gifPlayback: false
      }, { quoted: msg });

    } catch (err) {
      console.error("TikTok Download Error:", err);
      await sock.sendMessage(chatId, {
        text: "An error occurred while processing the TikTok link. Please try again later.",
        contextInfo
      }, { quoted: msg });
    }
  }
}, 
{
  name: "image-dl",
    get flashOnly() {
  return franceking();
},
  aliases: ["imgdl"],
  description: "Download high-quality images from social media URLs",
  category: "Download",
  execute: async (sock, msg, args) => {
    const chatId = msg.key.remoteJid;

    if (!args || args.length === 0) {
      return await sock.sendMessage(chatId, {
        text: "Please provide a valid image URL."
      }, { quoted: msg });
    }

    try {
      const url = args.join(' ');
      const res = await fetch(`https://bk9.fun/download/alldownload?url=${encodeURIComponent(url)}`);
      const data = await res.json();

      if (data.status && data.BK9 && data.BK9.high) {
        await sock.sendMessage(chatId, {
          image: { url: data.BK9.high },
          caption: "📸 *FLASH-MD* Image Downloader (High Quality)",
          contextInfo: {
            forwardingScore: 1,
            isForwarded: true,
            forwardedNewsletterMessageInfo: {
              newsletterJid: '120363347365643318@newsletter',
              newsletterName: 'IRON-MAN-MD',
              serverMessageId: -1
            }
          }
        }, { quoted: msg });

        await sock.sendMessage(chatId, {
          text: "✅ Image downloaded successfully!"
        }, { quoted: msg });

      } else {
        await sock.sendMessage(chatId, {
          text: "❌ No valid high-quality image found."
        }, { quoted: msg });
      }

    } catch (error) {
      console.error("Image-DL Error:", error);
      await sock.sendMessage(chatId, {
        text: "An error occurred while processing the image request. Please try again."
      }, { quoted: msg });
    }
  }
}, 
    
    {
        name: 'apk',
        get flashOnly() {
  return franceking();
},
        aliases: ['app', 'application'],
        description: 'Search and download Android APK files.',
        category: 'Download',
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;

            if (!args || !args.length) {
                return await sock.sendMessage(chatId, {
                    text: '❗ Please provide an app name to search for.'
                }, { quoted: msg });
            }

            const query = args.join(' ');

            try {
                await sock.sendMessage(chatId, {
                    text: '🔍 Searching for the APK, please wait...'
                }, { quoted: msg });

                const searchRes = await axios.get(`https://bk9.fun/search/apk?q=${encodeURIComponent(query)}`);
                const results = searchRes.data?.BK9;

                if (!results || results.length === 0) {
                    return await sock.sendMessage(chatId, {
                        text: `❌ No APKs found for "${query}".`
                    }, { quoted: msg });
                }

                const apk = results[0];
                const downloadRes = await axios.get(`https://bk9.fun/download/apk?id=${apk.id}`);
                const downloadLink = downloadRes.data?.BK9?.dllink;

                if (!downloadLink) {
                    return await sock.sendMessage(chatId, {
                        text: '❌ Failed to retrieve the download link.'
                    }, { quoted: msg });
                }

                await sock.sendMessage(chatId, {
                    document: { url: downloadLink },
                    mimetype: 'application/vnd.android.package-archive',
                    fileName: `${apk.name}.apk`,
                    caption: `*📥 IRON-MAN-APK DOWNLOADER*

*📌 App:* ${apk.name}
*📎 Type:* APK File
*⚙️ Powered by:* FLASH-MD`
                }, { quoted: msg });

                await sock.sendMessage(chatId, {
                    text: `✅ Successfully fetched and sent APK for *${apk.name}*.

_Enjoy using the app. Powered by Joshuamambo1-MD_`,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363347365643318@newsletter',
                            newsletterName: 'Joshuamambo1-MD',
                            serverMessageId: -1
                        }
                    }
                });
            } catch (error) {
                await sock.sendMessage(chatId, {
                    text: '❌ An error occurred while processing your APK request.'
                }, { quoted: msg });
            }
        }
    },

    {
        name: 'fetch',
        get flashOnly() {
  return franceking();
},
        aliases: [],
        description: 'Fetches content from a URL and responds with the appropriate media or text.',
        category: 'Search',
        execute: async (sock, msg, args) => {
            const chatId = msg.key.remoteJid;
            const url = args.join(' ');

            if (!/^https?:\/\//.test(url)) {
                return await sock.sendMessage(chatId, {
                    text: '❗ Please start the URL with *http://* or *https://*'
                }, { quoted: msg });
            }

            try {
                const response = await axios.get(url, {
                    responseType: 'arraybuffer',
                    maxContentLength: 100 * 1024 * 1024,
                    validateStatus: () => true
                });

                const contentType = response.headers['content-type'] || '';
                const contentLength = parseInt(response.headers['content-length'] || '0');

                if (response.status >= 400) {
                    return await sock.sendMessage(chatId, {
                        text: `❌ Failed to fetch the URL. Status: ${response.status}`
                    }, { quoted: msg });
                }

                if (contentLength > 100 * 1024 * 1024) {
                    return await sock.sendMessage(chatId, {
                        text: '⚠️ The content is too large to process (over 100MB).'
                    }, { quoted: msg });
                }

                const meta = {
                    quoted: msg,
                    contextInfo: {
                        forwardingScore: 1,
                        isForwarded: true,
                        forwardedNewsletterMessageInfo: {
                            newsletterJid: '120363347365643318@newsletter',
                            newsletterName: 'IRON-MAN-MD',
                            serverMessageId: -1
                        }
                    }
                };

                const buffer = Buffer.from(response.data);

                if (/image\//.test(contentType)) {
                    return await sock.sendMessage(chatId, {
                        image: buffer,
                        caption: '> > *POWERED BY IRON-MAN-MD*'
                    }, meta);
                }

                if (/video\//.test(contentType)) {
                    return await sock.sendMessage(chatId, {
                        video: buffer,
                        caption: '> > *POWERED BY IRON-MAN-MD*'
                    }, meta);
                }

                if (/audio\//.test(contentType)) {
                    return await sock.sendMessage(chatId, {
                        audio: buffer,
                        caption: '> > *POWERED BY IRON-MAN-MD*'
                    }, meta);
                }

                if (/json|text\//.test(contentType)) {
                    let textContent = buffer.toString();
                    try {
                        const parsed = JSON.parse(textContent);
                        textContent = JSON.stringify(parsed, null, 2);
                    } catch {}
                    return await sock.sendMessage(chatId, {
                        text: `*FETCHED CONTENT*\n\n${textContent.slice(0, 65536)}`
                    }, meta);
                }

                return await sock.sendMessage(chatId, {
                    document: buffer,
                    mimetype: contentType,
                    fileName: 'fetched_content',
                    caption: '> > *POWERED BY MIDKING-MD*'
                }, meta);
            } catch (err) {
                return await sock.sendMessage(chatId, {
                    text: `❌ Error fetching content: ${err.message}`
                }, { quoted: msg });
            }
        }
    }
];
