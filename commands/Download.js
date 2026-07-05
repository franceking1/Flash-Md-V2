import { 
  spotifySearch,
  getTikTokMedia,
  getInstaMedia,
  fetchAllPosts,
  fetchStories,
  npmSearch,
  videoDownload,
  telegramStickerPack,
  facebookDownload,
  githubRepoInfo,
  mediafireDownload,
  apkSearch,
  exchangeRates,
  imdbSearch,
  emojimix,
  fetchUrlContent,
  formatDate,
  formatBytes,
  truncateMessage,
  formatError,
  delay,
  MESSAGES,
  LIMITS
} from '../france/index.js';

import axios from 'axios';
import getFBInfo from '@xaviabot/fb-downloader';

export const commands = [
  {
    name: 'spotify',
    aliases: ['spot', 'sp'],
    description: 'Download a Spotify song by search query',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        return sock.sendMessage(from, { 
          text: MESSAGES.spotify.noQuery
        });
      }

      try {
        const data = await spotifySearch(text);

        if (!data.status || !data.result || !data.result.audio) {
          return sock.sendMessage(from, { 
            text: MESSAGES.spotify.notFound
          });
        }

        const {
          title,
          artist,
          duration,
          popularity,
          thumbnail,
          url,
          audio
        } = data.result;

        const infoText = MESSAGES.spotify.caption
          .replace('{title}', title)
          .replace('{artist}', artist)
          .replace('{duration}', duration)
          .replace('{popularity}', popularity)
          .replace('{url}', url);

        await sock.sendMessage(from, {
          image: { url: thumbnail },
          caption: infoText
        });

        await sock.sendMessage(from, {
          audio: { url: audio },
          mimetype: 'audio/mp4',
          fileName: `${title}.mp3`,
          ptt: false
        });

      } catch (error) {
        console.error('Spotify command error:', error.message);
        await sock.sendMessage(from, { 
          text: MESSAGES.spotify.error
        });
      }
    }
  },
  {
    name: 'tiktok',
    aliases: ['tk', 'tiktokdl'],
    description: 'Download TikTok media by link.',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text || !text.startsWith('http')) {
        return sock.sendMessage(from, {
          text: MESSAGES.tiktok.noUrl
        });
      }

      const response = await getTikTokMedia(text);

      if (!response.status) {
        return sock.sendMessage(from, {
          text: MESSAGES.tiktok.error.replace('{reason}', response.message)
        });
      }

      const caption = MESSAGES.tiktok.caption.replace('{title}', response.title || 'FLASH-MD V3');

      if (response.video) {
        await sock.sendMessage(from, {
          video: { url: response.video },
          caption
        });
      } else {
        await sock.sendMessage(from, {
          text: MESSAGES.tiktok.noVideo
        });
      }
    }
  },
  {
    name: 'insta',
    aliases: ['igdl', 'ig', 'instagram'],
    description: 'Download media from an Instagram link.',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text || !text.startsWith('http') || !text.includes('instagram.com')) {
        return sock.sendMessage(from, {
          text: MESSAGES.insta.noUrl
        }, { quoted: msg });
      }

      const isReel = text.includes('/reel/');
      const isPost = text.includes('/p/');

      try {
        const { error, data } = await getInstaMedia(text);

        if (error || !data || data.length === 0) {
          return sock.sendMessage(from, {
            text: MESSAGES.insta.error.replace('{error}', error || 'Invalid or unsupported link.')
          }, { quoted: msg });
        }

        for (const media of data) {
          await delay(2000);

          const isVideo = isReel || media.url.includes('.mp4');

          if (isVideo) {
            await sock.sendMessage(from, {
              video: { url: media.url },
              caption: MESSAGES.insta.caption
            }, { quoted: msg });
          } else {
            await sock.sendMessage(from, {
              image: { url: media.url },
              caption: MESSAGES.insta.caption
            }, { quoted: msg });
          }
        }

      } catch (err) {
        await sock.sendMessage(from, {
          text: '❌ *Unexpected error occurred. Please try again later.*'
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'posts',
    aliases: ['igposts', 'instafeed'],
    description: 'Download recent Instagram posts of a given username.',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        return sock.sendMessage(from, {
          text: MESSAGES.posts.noUsername
        });
      }

      try {
        const { total, items } = await fetchAllPosts(text);

        if (total === 0 || !items.length) {
          return sock.sendMessage(from, {
            text: MESSAGES.posts.noPosts.replace('{username}', text)
          });
        }

        const maxPosts = items.slice(0, 5);

        for (const item of maxPosts) {
          if (item.type === 'image') {
            await sock.sendMessage(from, {
              image: { url: item.url },
              caption: MESSAGES.posts.caption
            });
          } else if (item.type === 'video') {
            await sock.sendMessage(from, {
              video: { url: item.url },
              caption: MESSAGES.posts.videoCaption
            });
          }
        }

      } catch (err) {
        console.error('[IG POSTS ERROR]', err);
        await sock.sendMessage(from, {
          text: '❌ *Something went wrong fetching posts.* Please try again later.'
        });
      }
    }
  },
  {
    name: 'npm',
    description: 'Search for an NPM package and view its details.',
    category: 'General',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        return sock.sendMessage(from, {
          text: MESSAGES.npm.noQuery
        });
      }

      try {
        const data = await npmSearch(text);

        if (!data.results?.length) {
          return sock.sendMessage(from, {
            text: MESSAGES.npm.notFound.replace('{query}', text)
          });
        }

        const pkg = data.results[0];
        const formattedDate = formatDate(pkg.date);

        const result = MESSAGES.npm.result
          .replace('{name}', pkg.name)
          .replace('{version}', pkg.version)
          .replace('{description}', pkg.description || 'N/A')
          .replace('{publisher}', pkg.publisher.username)
          .replace('{license}', pkg.license || 'N/A')
          .replace('{date}', formattedDate)
          .replace('{npmLink}', pkg.links.npm)
          .replace('{repoLink}', pkg.links.repository || 'N/A')
          .replace('{homepage}', pkg.links.homepage || 'N/A');

        await sock.sendMessage(from, {
          text: result
        });
      } catch (error) {
        await sock.sendMessage(from, {
          text: MESSAGES.npm.error
        });
      }
    }
  },
  {
    name: 'video-dl',
    aliases: ['vddownload'],
    description: 'Download high-quality videos from social media URLs',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        return sock.sendMessage(from, {
          text: MESSAGES.videoDl.noUrl
        });
      }

      try {
        const data = await videoDownload(text);

        if (data.status && data.BK9 && data.BK9.high) {
          await sock.sendMessage(from, {
            video: { url: data.BK9.high },
            caption: MESSAGES.videoDl.caption
          });

          await sock.sendMessage(from, {
            text: MESSAGES.videoDl.complete
          });
        } else {
          await sock.sendMessage(from, {
            text: MESSAGES.videoDl.noVideo
          });
        }
      } catch (error) {
        console.error('Video-DL Error:', error);
        await sock.sendMessage(from, {
          text: MESSAGES.videoDl.error
        });
      }
    }
  },
  {
  name: 'tgs',
  aliases: ['tg'],
  description: 'Download and send all stickers from a Telegram pack',
  category: 'Download',
  execute: async ({ sock, from, text, msg }) => {
    if (!text) {
      return sock.sendMessage(from, {
        text: MESSAGES.tgs.noUrl
      });
    }

    try {
      await sock.sendMessage(from, {
        text: '⏳ *Fetching Telegram sticker pack...* Please wait.'
      });

      const data = await telegramStickerPack(text);

      if (!data.stickers || data.stickers.length === 0) {
        return sock.sendMessage(from, {
          text: MESSAGES.tgs.noStickers
        });
      }

      const packInfo = `📦 *Telegram Sticker Pack*\n\n📛 *Name:* ${data.name || 'N/A'}\n📝 *Title:* ${data.title || 'N/A'}\n🎬 *Type:* ${data.is_video ? 'Video Stickers' : data.is_animated ? 'Animated Stickers' : 'Static Stickers'}\n📊 *Total Stickers:* ${data.stickers.length}\n\n_Converting to animated stickers..._`;
      
      await sock.sendMessage(from, {
        text: packInfo
      });

      const ffmpeg = (await import('fluent-ffmpeg')).default;
      const ffmpegPath = (await import('ffmpeg-static')).default;
      const { writeFile, unlink } = await import('fs/promises');
      const { createReadStream } = await import('fs');
      const { Sticker } = await import('wa-sticker-formatter');
      
      ffmpeg.setFfmpegPath(ffmpegPath);

      for (let i = 0; i < Math.min(data.stickers.length, 20); i++) {
        const stickerUrl = data.stickers[i];
        try {
          const response = await axios.get(stickerUrl, { responseType: 'arraybuffer' });
          const tempWebm = `/tmp/sticker_${Date.now()}_${i}.webm`;
          const tempWebp = `/tmp/sticker_${Date.now()}_${i}.webp`;
          
          await writeFile(tempWebm, Buffer.from(response.data));
          
          await new Promise((resolve, reject) => {
            ffmpeg(tempWebm)
              .output(tempWebp)
              .outputOptions([
                '-vcodec', 'libwebp',
                '-lossless', '0',
                '-compression_level', '6',
                '-q:v', '70',
                '-loop', '0',
                '-an',
                '-vsync', '0',
                '-vf', 'scale=512:512:force_original_aspect_ratio=increase,crop=512:512'
              ])
              .on('end', resolve)
              .on('error', reject)
              .run();
          });
          
          const stickerBuffer = await require('fs').promises.readFile(tempWebp);
          
          await sock.sendMessage(from, {
            sticker: stickerBuffer
          });
          
          await unlink(tempWebm).catch(() => {});
          await unlink(tempWebp).catch(() => {});
          
        } catch (err) {
          console.error('Failed to convert sticker:', err.message);
        }
      }

      await sock.sendMessage(from, {
        text: `✅ Sent ${Math.min(data.stickers.length, 20)} animated stickers from pack!`
      });
    } catch (err) {
      console.error('TGS Error:', err);
      await sock.sendMessage(from, {
        text: MESSAGES.tgs.error
      });
    }
  }
}, 
  {
    name: 'fb',
    aliases: ['fbdl', 'facebook', 'fb1'],
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        return sock.sendMessage(from, {
          text: MESSAGES.fb.noUrl
        });
      }

      try {
        const result = await facebookDownload(text);
        const caption = MESSAGES.fb.caption
          .replace('{title}', result.title)
          .replace('{url}', result.url);
        
        await sock.sendMessage(from, {
          image: { url: result.thumbnail },
          caption
        });

        await sock.sendMessage(from, {
          video: { url: result.hd },
          caption: MESSAGES.fb.videoCaption
        });
      } catch (error) {
        await sock.sendMessage(from, {
          text: MESSAGES.fb.error
        });
      }
    }
  },
  {
    name: 'fb2',
    aliases: ['fbdl2', 'fb2', 'facebook2'],
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        return sock.sendMessage(from, {
          text: MESSAGES.fb.noUrl
        });
      }

      try {
        const result = await facebookDownload(text);
        const caption = MESSAGES.fb.caption
          .replace('{title}', result.title)
          .replace('{url}', result.url);
        
        await sock.sendMessage(from, {
          image: { url: result.thumbnail },
          caption
        });

        await sock.sendMessage(from, {
          video: { url: result.sd },
          caption: '_╰►FACEBOOK VIDEO DOWNLOADED BY_ *FLASH-MD-V3*'
        });
      } catch (error) {
        await sock.sendMessage(from, {
          text: error.toString()
        });
      }
    }
  },
  {
    name: 'gitclone',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        return sock.sendMessage(from, { 
          text: MESSAGES.gitclone.noUrl
        });
      }

      if (!text.includes('github.com')) {
        return sock.sendMessage(from, { 
          text: MESSAGES.gitclone.invalid
        });
      }

      try {
        let regex1 = /(?:https|git)(?::\/\/|@)github\.com[\/:]([^\/:]+)\/(.+)/i;
        let [, user3, repo] = text.match(regex1) || [];
        if (!user3 || !repo) {
          return sock.sendMessage(from, { 
            text: 'Invalid GitHub repo link.' 
          });
        }

        repo = repo.replace(/\.git$/, '');
        let url = `https://api.github.com/repos/${user3}/${repo}/zipball`;

        const headResponse = await fetch(url, { method: 'HEAD' });
        const contentDisposition = headResponse.headers.get('content-disposition');
        if (!contentDisposition) {
          return sock.sendMessage(from, { 
            text: 'Failed to get repo archive.' 
          });
        }

        const filenameMatch = contentDisposition.match(/attachment; filename=(.*)/);
        if (!filenameMatch) {
          return sock.sendMessage(from, { 
            text: 'Failed to parse filename.' 
          });
        }

        const filename = filenameMatch[1];
        await sock.sendMessage(from, {
          document: { url },
          fileName: filename.endsWith('.zip') ? filename : filename + '.zip',
          mimetype: 'application/zip'
        });
      } catch (error) {
        console.error('GitClone Error:', error);
        await sock.sendMessage(from, { 
          text: MESSAGES.gitclone.error
        });
      }
    }
  },
{
  name: 'mediafire',
  aliases: ['mf', 'mfdl'],
  description: 'Download files from MediaFire',
  category: 'Download',
  execute: async ({ sock, from, text, msg }) => {
    if (!text) {
      return sock.sendMessage(from, {
        text: MESSAGES.mediafire.noUrl
      });
    }

    try {
      await sock.sendMessage(from, {
        text: MESSAGES.mediafire.fetching
      });

      const data = await mediafireDownload(text);

      if (!data.download) {
        return sock.sendMessage(from, {
          text: MESSAGES.mediafire.error
        });
      }

      const caption = MESSAGES.mediafire.caption
        .replace('{name}', data.filename)
        .replace('{size}', data.size)
        .replace('{type}', data.mimetype || 'APK')
        .replace('{uploaded}', 'N/A');

      await sock.sendMessage(from, {
        document: { url: data.download },
        fileName: data.filename,
        mimetype: data.mimetype || 'application/octet-stream',
        caption
      });
    } catch (err) {
      console.error('MediaFire Error:', err);
      await sock.sendMessage(from, {
        text: 'An error occurred while processing the request. Please try again later.'
      });
    }
  }
}, 
  {
    name: 'apk',
    aliases: ['app', 'application'],
    description: 'Search and download Android APK files.',
    category: 'Download',
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        return sock.sendMessage(from, {
          text: MESSAGES.apk.noQuery
        });
      }

      try {
        await sock.sendMessage(from, {
          text: MESSAGES.apk.searching
        });

        const result = await apkSearch(text);
        
        if (!result || !result.dlInfo || !result.dlInfo.dllink) {
          return sock.sendMessage(from, {
            text: MESSAGES.apk.notFound.replace('{query}', text)
          });
        }

        const { apk, dlInfo } = result;
        const caption = MESSAGES.apk.caption.replace('{name}', apk.name);

        await sock.sendMessage(from, {
          document: { url: dlInfo.dllink },
          mimetype: 'application/vnd.android.package-archive',
          fileName: `${apk.name}.apk`,
          caption
        });

        await sock.sendMessage(from, {
          text: MESSAGES.apk.complete.replace('{name}', apk.name)
        });

      } catch (error) {
        console.error('APK Error:', error);
        await sock.sendMessage(from, {
          text: '❌ An error occurred while processing your APK request.'
        });
      }
    }
  },
  {
    name: 'fetch',
    description: 'Fetches content from a URL and responds with the appropriate media or text.',
    category: 'Search',
    execute: async ({ sock, from, text, msg }) => {
      const url = text;

      if (!/^https?:\/\//.test(url)) {
        return sock.sendMessage(from, {
          text: MESSAGES.fetch.noUrl
        });
      }

      try {
        const response = await fetchUrlContent(url);

        const contentType = response.headers['content-type'] || '';
        const contentLength = parseInt(response.headers['content-length'] || '0');

        if (response.status >= 400) {
          return sock.sendMessage(from, {
            text: MESSAGES.fetch.error.replace('{status}', response.status)
          });
        }

        if (contentLength > LIMITS.maxFetchSize) {
          return sock.sendMessage(from, {
            text: MESSAGES.fetch.tooLarge
          });
        }

        const buffer = Buffer.from(response.data);

        if (/image\//.test(contentType)) {
          return sock.sendMessage(from, {
            image: buffer,
            caption: '> > *POWERED BY FLASH-MD-V3*'
          });
        }

        if (/video\//.test(contentType)) {
          return sock.sendMessage(from, {
            video: buffer,
            caption: '> > *POWERED BY FLASH-MD-V3*'
          });
        }

        if (/audio\//.test(contentType)) {
          return sock.sendMessage(from, {
            audio: buffer,
            caption: '> > *POWERED BY FLASH-MD-V3*'
          });
        }

        if (/json|text\//.test(contentType)) {
          let textContent = buffer.toString();
          try {
            const parsed = JSON.parse(textContent);
            textContent = JSON.stringify(parsed, null, 2);
          } catch {}
          return sock.sendMessage(from, {
            text: `*FETCHED CONTENT*\n\n${textContent.slice(0, LIMITS.truncateLimit)}`
          });
        }

        return sock.sendMessage(from, {
          document: buffer,
          mimetype: contentType,
          fileName: 'fetched_content',
          caption: '> > *POWERED BY FLASH-MD-V3*'
        });
      } catch (err) {
        return sock.sendMessage(from, {
          text: `❌ Error fetching content: ${err.message}`
        });
      }
    }
  }
];
