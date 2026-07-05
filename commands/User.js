import { S_WHATSAPP_NET } from '@whiskeysockets/baileys';
import * as Jimp from 'jimp';
import { Sticker, StickerTypes } from 'wa-sticker-formatter';
import { formatJid, getSenderJid, MESSAGES, protectOwner } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

let isStatusFetching = false;
let fetchInterval = null;

export const commands = [
  {
    name: 'block',
    description: 'Block a WhatsApp user',
    category: 'USER',
    ownerOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      let targetJid;
      if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
        targetJid = msg.message.extendedTextMessage.contextInfo.participant;
      } else if (text) {
        targetJid = text.includes('@s.whatsapp.net') ? text : formatJid(text);
      } else {
        const noTargetMsg = await t(from, 'user', 'blockNoTarget');
        return sock.sendMessage(from, { text: noTargetMsg }, { quoted: msg });
      }
      
      if (protectOwner(targetJid)) {
        const protectedMsg = await t(from, 'user', 'blockProtected');
        return sock.sendMessage(from, { text: protectedMsg }, { quoted: msg });
      }
      
      try {
        await sock.updateBlockStatus(targetJid, 'block');
        const successMsg = await t(from, 'user', 'blockSuccess');
        await sock.sendMessage(from, { text: successMsg.replace('{jid}', targetJid) }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'user', 'blockError');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'unblock',
    description: 'Unblock a WhatsApp user',
    category: 'USER',
    ownerOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      let targetJid;
      if (msg.message?.extendedTextMessage?.contextInfo?.participant) {
        targetJid = msg.message.extendedTextMessage.contextInfo.participant;
      } else if (text) {
        targetJid = text.includes('@s.whatsapp.net') ? text : formatJid(text);
      } else {
        const noTargetMsg = await t(from, 'user', 'unblockNoTarget');
        return sock.sendMessage(from, { text: noTargetMsg }, { quoted: msg });
      }
      
      if (protectOwner(targetJid)) {
        const protectedMsg = await t(from, 'user', 'unblockProtected');
        return sock.sendMessage(from, { text: protectedMsg }, { quoted: msg });
      }
      
      try {
        await sock.updateBlockStatus(targetJid, 'unblock');
        const successMsg = await t(from, 'user', 'unblockSuccess');
        await sock.sendMessage(from, { text: successMsg.replace('{jid}', targetJid) }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'user', 'unblockError');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'setbio',
    description: 'Set WhatsApp bio',
    category: 'USER',
    ownerOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        const noTextMsg = await t(from, 'user', 'setbioNoText');
        return sock.sendMessage(from, { text: noTextMsg }, { quoted: msg });
      }
      
      try {
        await sock.query({
          tag: 'iq',
          attrs: { to: S_WHATSAPP_NET, type: 'set', xmlns: 'status' },
          content: [{ tag: 'status', attrs: {}, content: Buffer.from(text, 'utf-8') }]
        });
        const successMsg = await t(from, 'user', 'setbioSuccess');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'user', 'setbioError');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'autobio',
    description: 'Toggle automatic bio',
    category: 'USER',
    ownerOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!text) {
        const usageMsg = await t(from, 'user', 'autobioUsage');
        return sock.sendMessage(from, { text: usageMsg }, { quoted: msg });
      }
      
      if (text === 'on') {
        if (isStatusFetching) {
          const alreadyOnMsg = await t(from, 'user', 'autobioAlreadyOn');
          return sock.sendMessage(from, { text: alreadyOnMsg }, { quoted: msg });
        }
        
        isStatusFetching = true;
        fetchInterval = setInterval(async () => {
          try {
            const res = await fetch('https://nekos.life/api/v2/fact');
            const data = await res.json();
            const bio = `FLASH-MD: ${data.fact}`;
            await sock.query({
              tag: 'iq',
              attrs: { to: S_WHATSAPP_NET, type: 'set', xmlns: 'status' },
              content: [{ tag: 'status', attrs: {}, content: Buffer.from(bio, 'utf-8') }]
            });
          } catch {}
        }, 60000);
        const enabledMsg = await t(from, 'user', 'autobioEnabled');
        return sock.sendMessage(from, { text: enabledMsg }, { quoted: msg });
      }
      
      if (text === 'off') {
        if (!isStatusFetching) {
          const alreadyOffMsg = await t(from, 'user', 'autobioAlreadyOff');
          return sock.sendMessage(from, { text: alreadyOffMsg }, { quoted: msg });
        }
        
        clearInterval(fetchInterval);
        isStatusFetching = false;
        const disabledMsg = await t(from, 'user', 'autobioDisabled');
        return sock.sendMessage(from, { text: disabledMsg }, { quoted: msg });
      }
      
      const usageMsg = await t(from, 'user', 'autobioUsage');
      await sock.sendMessage(from, { text: usageMsg }, { quoted: msg });
    }
  },
  {
    name: 'getpp',
    description: 'Get profile picture',
    category: 'USER',
    execute: async ({ sock, from, msg }) => {
      const targetJid = msg.message?.extendedTextMessage?.contextInfo?.participant || getSenderJid(msg);
      let pp;
      try {
        pp = await sock.profilePictureUrl(targetJid, 'image');
      } catch {
        const defaultImageMsg = await t(from, 'user', 'getppDefaultImage');
        pp = defaultImageMsg;
      }
      const captionMsg = await t(from, 'user', 'getppCaption');
      await sock.sendMessage(from, { image: { url: pp }, caption: captionMsg }, { quoted: msg });
    }
  },
{
  name: 'whois',
  description: 'User information',
  category: 'USER',
  execute: async ({ sock, from, msg }) => {
    const targetJid = msg.message?.extendedTextMessage?.contextInfo?.participant || getSenderJid(msg);
    const number = targetJid.split('@')[0];
    
    let pp;
    try {
      pp = await sock.profilePictureUrl(targetJid, 'image');
    } catch {
      const defaultImageMsg = await t(from, 'user', 'whoisDefaultImage');
      pp = defaultImageMsg;
    }
    
    let about = 'No status';
    let setOn = 'Unknown';
    let setAt = 'Unknown';
    
    try {
      const statusArray = await sock.fetchStatus(targetJid);
      console.log('[WHOIS] Status array:', statusArray);
      
      if (statusArray && statusArray[0] && statusArray[0].status) {
        const statusObj = statusArray[0].status;
        about = statusObj.status || 'No status';
        
        if (statusObj.setAt) {
          const d = new Date(statusObj.setAt);
          if (!isNaN(d.getTime())) {
            setOn = d.toLocaleDateString('en-GB');
            setAt = d.toLocaleTimeString('en-GB');
          }
        }
      }
    } catch (err) {
      console.log('[WHOIS] fetchStatus error:', err.message);
    }
    
    let name = msg.pushName || number;
    try {
      const contact = await sock.onWhatsApp(targetJid);
      if (contact && contact[0] && contact[0].notify) {
        name = contact[0].notify;
      }
    } catch {}
    
    const aboutLabel = await t(from, 'user', 'whoisAbout');
    const nameLabel = await t(from, 'user', 'whoisName');
    const setOnLabel = await t(from, 'user', 'whoisSetOn');
    const setAtLabel = await t(from, 'user', 'whoisSetAt');
    const footerMsg = await t(from, 'user', 'whoisFooter');
    
    const caption = `👤 *${aboutLabel}*\n\n*${about}*\n\n*${nameLabel}:* @${number}\n\n📅 *${setOnLabel}:* ${setOn}\n🕒 *${setAtLabel}:* ${setAt}\n\n${footerMsg}`;
    
    await sock.sendMessage(
      from,
      {
        image: { url: pp },
        caption,
        mentions: [targetJid]
      },
      { quoted: msg }
    );
  }
}, 
  {
    name: 'mygroups',
    description: 'List all groups',
    category: 'USER',
    ownerOnly: true,
    execute: async ({ sock, from, msg }) => {
      try {
        const groups = Object.values(await sock.groupFetchAllParticipating());
        const headerMsg = await t(from, 'user', 'mygroupsHeader');
        const itemTemplate = await t(from, 'user', 'mygroupsItem');
        let text = headerMsg;
        for (const g of groups) {
          text += itemTemplate
            .replace('{subject}', g.subject)
            .replace('{count}', g.participants.length)
            .replace('{id}', g.id);
        }
        await sock.sendMessage(from, { text }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'user', 'mygroupsError');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'del',
    description: 'Delete a replied message',
    category: 'USER',
    ownerOnly: true,
    execute: async ({ sock, from, msg }) => {
      const ctx = msg.message?.extendedTextMessage?.contextInfo;
      if (!ctx) return;
      await sock.sendMessage(from, {
        delete: {
          remoteJid: from,
          fromMe: false,
          id: ctx.stanzaId,
          participant: ctx.participant
        }
      });
    }
  },
  {
    name: 'restart',
    description: 'Restart bot',
    category: 'USER',
    ownerOnly: true,
    execute: async ({ sock, from, msg }) => {
      const restartMsg = await t(from, 'user', 'restartMessage');
      await sock.sendMessage(from, { text: restartMsg }, { quoted: msg });
      process.exit(0);
    }
  }
];
