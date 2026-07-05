
import { getOnlineMembers } from '../france/Presence.js';
import { MESSAGES } from '../france/config.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
  {
    name: 'online',
    aliases: ['listonline', 'active', 'activeusers'],
    description: 'List currently online group members.',
    category: 'Group',
    groupOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      
      const checkingMsg = await t(from, 'online', 'checking');
      const processingMsg = await sock.sendMessage(from, { text: checkingMsg }, { quoted: msg });
      
      try {
        const online = await getOnlineMembers(sock, from);
        
        await sock.sendMessage(from, { delete: processingMsg.key });
        
        if (!online.length) {
          const noMembersMsg = await t(from, 'online', 'noMembers');
          const poweredMsg = await t(from, 'online', 'powered');
          return sock.sendMessage(from, {
            text: `${noMembersMsg}\n\n${poweredMsg}`
          }, { quoted: msg });
        }
        
        const onlineList = online.map((jid, index) => {
          const name = jid.split('@')[0];
          return `${index + 1}. 🟢 ${name}`;
        }).join('\n');
        
        const total = online.length;
        const metadata = await sock.groupMetadata(from);
        const totalMembers = metadata.participants.length;
        const percent = ((total / totalMembers) * 100).toFixed(1);
        
        const headerMsg = await t(from, 'online', 'header');
        const onlineLabel = await t(from, 'online', 'onlineLabel');
        const poweredMsg = await t(from, 'online', 'powered');
        
        await sock.sendMessage(from, {
          text: `${headerMsg}\n\n${onlineLabel} ${total}/${totalMembers} (${percent}%)\n\n${onlineList}\n\n${poweredMsg}`,
          mentions: online
        }, { quoted: msg });
        
      } catch (err) {
        await sock.sendMessage(from, { delete: processingMsg.key });
        const errorMsg = await t(from, 'online', 'error');
        const poweredMsg = await t(from, 'online', 'powered');
        await sock.sendMessage(from, {
          text: `${errorMsg} ${err.message}\n\n${poweredMsg}`
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'info',
    aliases: ['ginfo', 'ginf'],
    category: 'Group',
    groupOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        const metadata = await sock.groupMetadata(from);
        const groupName = metadata.subject;
        const groupId = metadata.id;
        const participants = metadata.participants;
        const totalMembers = participants.length;
        const admins = participants.filter(p => p.admin);
        const ownerJid = metadata.owner || (admins.find(p => p.admin === 'superadmin')?.id);
        const ownerNumber = ownerJid ? ownerJid.split('@')[0] : 'Unknown';
        const adminList = admins.map((a, i) => `${i + 1}. @${a.id.split('@')[0]}`).join('\n');
        
        const groupInfoMsg = await t(from, 'info', 'result');
        const response = groupInfoMsg
          .replace('{groupName}', groupName)
          .replace('{groupId}', groupId)
          .replace('{ownerNumber}', ownerNumber)
          .replace('{totalMembers}', totalMembers)
          .replace('{adminCount}', admins.length)
          .replace('{adminList}', adminList);
          
        await sock.sendMessage(from, {
          text: response,
          mentions: [...(ownerJid ? [ownerJid] : []), ...admins.map(a => a.id)]
        }, { quoted: msg });
      } catch (err) {
        const errorMsg = await t(from, 'info', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'antilink',
    description: 'Enable/disable antilink and set action (warn/kick/delete)',
    category: 'Group',
    adminOnly: true,
    botAdminOnly: true,
    ownerOnly: true,
    groupOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const args = text.trim().split(/\s+/);
      const [option, action = 'warn'] = args;
      if (!['on', 'off'].includes(option) || !['warn', 'kick', 'delete'].includes(action)) {
        const usageMsg = await t(from, 'antilink', 'usage');
        return sock.sendMessage(from, {
          text: usageMsg
        }, { quoted: msg });
      }
      const successMsg = await t(from, 'antilink', 'success');
      return sock.sendMessage(from, {
        text: successMsg.replace('{option}', option.toUpperCase()).replace('{action}', action.toUpperCase())
      }, { quoted: msg });
    }
  },
  {
    name: 'hidetag',
    aliases: ['tag'],
    description: 'Mentions all members in the group using a message or media.',
    category: 'Group',
    groupOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const metadata = await sock.groupMetadata(from);
      const tagList = metadata.participants.map(p => p.id);
      const quoted = msg.message?.extendedTextMessage?.contextInfo;
      let outMsg;
      
      const defaultMsg = await t(from, 'hidetag', 'default');
      const noMessageMsg = await t(from, 'hidetag', 'noMessage');
      
      if (quoted?.quotedMessage) {
        const quotedMsg = quoted.quotedMessage;
        const type = Object.keys(quotedMsg)[0];
        switch (type) {
          case 'imageMessage':
          case 'videoMessage':
          case 'audioMessage':
            outMsg = { text: defaultMsg, mentions: tagList };
            break;
          case 'conversation':
          case 'extendedTextMessage':
            const textContent = quotedMsg?.conversation || quotedMsg.extendedTextMessage?.text || defaultMsg;
            outMsg = { text: textContent, mentions: tagList };
            break;
          default:
            outMsg = { text: defaultMsg, mentions: tagList };
        }
      } else {
        if (!text) {
          return sock.sendMessage(from, {
            text: noMessageMsg
          }, { quoted: msg });
        }
        outMsg = { text: text, mentions: tagList };
      }
      await sock.sendMessage(from, outMsg);
    }
  },
  {
    name: 'tagall',
    aliases: ['mentionall'],
    description: 'Mentions all members of the current group.',
    category: 'Group',
    groupOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        const groupInfo = await sock.groupMetadata(from);
        const participants = groupInfo.participants;
        if (!participants.length) {
          const noParticipantsMsg = await t(from, 'tagall', 'noParticipants');
          return await sock.sendMessage(from, { text: noParticipantsMsg }, { quoted: msg });
        }
        const defaultTextMsg = await t(from, 'tagall', 'defaultText');
        const customText = text || defaultTextMsg;
        const headerMsg = await t(from, 'tagall', 'header');
        let mentionText = headerMsg.replace('{text}', customText);
        participants.forEach((p, i) => {
          mentionText += `${i + 1}. @${p.id.split('@')[0]}\n`;
        });
        await sock.sendMessage(from, {
          text: mentionText,
          mentions: participants.map(p => p.id)
        }, { quoted: msg });
      } catch (error) {
        const errorMsg = await t(from, 'tagall', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'rename',
    aliases: ['gname'],
    description: 'Change the group subject (name).',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    ownerOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const newSubject = text;
      if (!newSubject) {
        const noNameMsg = await t(from, 'rename', 'noName');
        return sock.sendMessage(from, { text: noNameMsg }, { quoted: msg });
      }
      try {
        await sock.groupUpdateSubject(from, newSubject);
        const successMsg = await t(from, 'rename', 'success');
        await sock.sendMessage(from, { text: successMsg.replace('{name}', newSubject) }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'rename', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'kick',
    aliases: ['remove'],
    description: 'Remove a user from the group.',
    category: 'Group',
    ownerOnly: true,
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const tagged = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const target = quoted || tagged;
      if (!target) {
        const noTargetMsg = await t(from, 'kick', 'noTarget');
        return sock.sendMessage(from, { text: noTargetMsg }, { quoted: msg });
      }
      try {
        await sock.groupParticipantsUpdate(from, [target], 'remove');
        const successMsg = await t(from, 'kick', 'success');
        await sock.sendMessage(from, {
          text: successMsg.replace('{user}', target.split('@')[0]),
          mentions: [target]
        }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'kick', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'add',
    aliases: [],
    description: 'Add a user to the group.',
    category: 'Group',
    ownerOnly: true,
    groupOnly: true,
    adminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const args = text.trim().split(/\s+/);
      if (!args[0]) {
        const noNumberMsg = await t(from, 'add', 'noNumber');
        return sock.sendMessage(from, { text: noNumberMsg }, { quoted: msg });
      }
      const num = args[0].replace(/\D/g, '');
      const userJid = `${num}@s.whatsapp.net`;
      try {
        await sock.groupParticipantsUpdate(from, [userJid], 'add');
        const successMsg = await t(from, 'add', 'success');
        await sock.sendMessage(from, { text: successMsg.replace('{number}', num) }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'add', 'error');
        await sock.sendMessage(from, {
          text: errorMsg
        }, { quoted: msg });
      }
    }
  },
  {
    name: 'kickall',
    aliases: [],
    description: 'Remove all non-admin members.',
    category: 'Group',
    ownerOnly: true,
    groupOnly: true,
    adminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const metadata = await sock.groupMetadata(from);
      const toKick = metadata.participants.filter(p => !p.admin).map(p => p.id);
      const warningMsg = await t(from, 'kickall', 'warning');
      await sock.sendMessage(from, { text: warningMsg }, { quoted: msg });
      await new Promise(res => setTimeout(res, 5000));
      for (const id of toKick) {
        await sock.groupParticipantsUpdate(from, [id], 'remove');
        await new Promise(res => setTimeout(res, 500));
      }
    }
  },
  {
    name: 'promote',
    aliases: [],
    description: 'Promote a member to admin.',
    category: 'Group',
    ownerOnly: true,
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const tagged = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const target = quoted || tagged;
      if (!target) {
        const noTargetMsg = await t(from, 'promote', 'noTarget');
        return sock.sendMessage(from, { text: noTargetMsg }, { quoted: msg });
      }
      try {
        await sock.groupParticipantsUpdate(from, [target], 'promote');
        const successMsg = await t(from, 'promote', 'success');
        await sock.sendMessage(from, {
          text: successMsg.replace('{user}', target.split('@')[0]),
          mentions: [target]
        }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'promote', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'demote',
    aliases: [],
    description: 'Demote a group admin.',
    category: 'Group',
    ownerOnly: true,
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const tagged = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
      const target = quoted || tagged;
      if (!target) {
        const noTargetMsg = await t(from, 'demote', 'noTarget');
        return sock.sendMessage(from, { text: noTargetMsg }, { quoted: msg });
      }
      try {
        await sock.groupParticipantsUpdate(from, [target], 'demote');
        const successMsg = await t(from, 'demote', 'success');
        await sock.sendMessage(from, {
          text: successMsg.replace('{user}', target.split('@')[0]),
          mentions: [target]
        }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'demote', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'approve',
    aliases: ['approve-all', 'accept'],
    description: 'Approve all pending join requests.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    ownerOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        const requests = await sock.groupRequestParticipantsList(from);
        if (requests.length === 0) {
          const noRequestsMsg = await t(from, 'approve', 'noRequests');
          return sock.sendMessage(from, { text: noRequestsMsg }, { quoted: msg });
        }
        for (const p of requests) {
          await sock.groupRequestParticipantsUpdate(from, [p.jid], 'approve');
        }
        const successMsg = await t(from, 'approve', 'success');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'approve', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'reject',
    aliases: ['rejectall', 'rej', 'reject-all'],
    description: 'Reject all pending join requests.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        const requests = await sock.groupRequestParticipantsList(from);
        if (requests.length === 0) {
          const noRequestsMsg = await t(from, 'reject', 'noRequests');
          return sock.sendMessage(from, { text: noRequestsMsg }, { quoted: msg });
        }
        for (const p of requests) {
          await sock.groupRequestParticipantsUpdate(from, [p.jid], 'reject');
        }
        const successMsg = await t(from, 'reject', 'success');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'reject', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'req',
    description: 'List pending join requests.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        const requests = await sock.groupRequestParticipantsList(from);
        if (!requests.length) {
          const noRequestsMsg = await t(from, 'req', 'noRequests');
          return sock.sendMessage(from, { text: noRequestsMsg }, { quoted: msg });
        }
        const list = requests.map(p => '+' + p.jid.split('@')[0]).join('\n');
        const listMsg = await t(from, 'req', 'list');
        await sock.sendMessage(from, {
          text: listMsg.replace('{list}', list),
        }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'req', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'disap1',
    description: 'Set disappearing messages to 24 hours.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        await sock.groupToggleEphemeral(from, 86400);
        const successMsg = await t(from, 'disap', 'success24');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'disap', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'disap7',
    description: 'Set disappearing messages to 7 days.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        await sock.groupToggleEphemeral(from, 7 * 24 * 3600);
        const successMsg = await t(from, 'disap', 'success7');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'disap', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'disap90',
    description: 'Set disappearing messages to 90 days.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        await sock.groupToggleEphemeral(from, 90 * 24 * 3600);
        const successMsg = await t(from, 'disap', 'success90');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'disap', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'disap-off',
    description: 'Turn off disappearing messages.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        await sock.groupToggleEphemeral(from, 0);
        const offMsg = await t(from, 'disap', 'off');
        await sock.sendMessage(from, { text: offMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'disap', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'disap',
    description: 'Instructions for disappearing messages.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const helpMsg = await t(from, 'disap', 'help');
      await sock.sendMessage(from, {
        text: helpMsg
      }, { quoted: msg });
    }
  },
  {
    name: 'desc',
    aliases: ['gdesc'],
    description: 'Change the group description.',
    category: 'Group',
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      const newDesc = text;
      if (!newDesc) {
        const noDescMsg = await t(from, 'desc', 'noDesc');
        return sock.sendMessage(from, { text: noDescMsg }, { quoted: msg });
      }
      try {
        await sock.groupUpdateDescription(from, newDesc);
        const successMsg = await t(from, 'desc', 'success');
        await sock.sendMessage(from, {
          text: successMsg.replace('{desc}', newDesc)
        }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'desc', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'lock',
    aliases: ['close'],
    description: 'Only admins can send messages.',
    category: 'Group',
    ownerOnly: true,
    groupOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        await sock.groupSettingUpdate(from, 'announcement');
        const successMsg = await t(from, 'lock', 'success');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'lock', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'unlock',
    aliases: ['open'],
    description: 'Allow all members to send messages.',
    category: 'Group',
    groupOnly: true,
    ownerOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        await sock.groupSettingUpdate(from, 'not_announcement');
        const successMsg = await t(from, 'unlock', 'success');
        await sock.sendMessage(from, { text: successMsg }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'unlock', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'invite',
    aliases: ['link'],
    description: 'Get the group invite link.',
    category: 'Group',
    groupOnly: true,
    ownerOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        const code = await sock.groupInviteCode(from);
        const successMsg = await t(from, 'invite', 'success');
        await sock.sendMessage(from, {
          text: successMsg.replace('{code}', code)
        }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'invite', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'revoke',
    aliases: ['reset'],
    description: 'Revoke current invite link and generate new one.',
    category: 'Group',
    groupOnly: true,
    ownerOnly: true,
    adminOnly: true,
    botAdminOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        const newCode = await sock.groupRevokeInvite(from);
        const successMsg = await t(from, 'revoke', 'success');
        await sock.sendMessage(from, {
          text: successMsg.replace('{code}', newCode)
        }, { quoted: msg });
      } catch {
        const errorMsg = await t(from, 'revoke', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'broadcast',
    aliases: ['bc', 'cast'],
    description: 'Send a broadcast message to all groups.',
    category: 'General',
    execute: async ({ sock, from, text, msg }) => {
      const message = text;
      if (!message) {
        const noMessageMsg = await t(from, 'broadcast', 'noMessage');
        return sock.sendMessage(from, { text: noMessageMsg }, { quoted: msg });
      }
      try {
        const groups = await sock.groupFetchAllParticipating();
        const groupIds = Object.keys(groups);
        const startMsg = await t(from, 'broadcast', 'start');
        await sock.sendMessage(from, { text: startMsg }, { quoted: msg });
        const broadcastMsg = await t(from, 'broadcast', 'message');
        for (const groupId of groupIds) {
          await sock.sendMessage(groupId, { text: broadcastMsg.replace('{message}', message) });
        }
      } catch {
        const errorMsg = await t(from, 'broadcast', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'left',
    aliases: ['leave'],
    description: 'Force the bot to leave the group.',
    category: 'Group',
    groupOnly: true,
    ownerOnly: true,
    execute: async ({ sock, from, text, msg }) => {
      if (!from.endsWith('@g.us')) {
        const groupOnlyMsg = await t(from, 'group', 'groupOnly');
        return sock.sendMessage(from, { text: groupOnlyMsg }, { quoted: msg });
      }
      try {
        await sock.groupLeave(from);
      } catch {
        const errorMsg = await t(from, 'leave', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  },
  {
    name: 'create',
    aliases: ['newgroup', 'newgc'],
    description: 'Create a new group with users.',
    category: 'General',
    execute: async ({ sock, from, text, msg }) => {
      const args = text.trim().split(/\s+/);
      if (!args.length) {
        const usageMsg = await t(from, 'create', 'usage');
        return sock.sendMessage(from, {
          text: usageMsg
        }, { quoted: msg });
      }
      const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
      const quotedJid = msg.message?.extendedTextMessage?.contextInfo?.participant;
      const [groupName, ...rest] = args;
      const phoneNumbers = rest.filter(n => /^\d+$/.test(n)).map(num => `${num}@s.whatsapp.net`);
      const participants = [...new Set([...mentions, ...(quotedJid ? [quotedJid] : []), ...phoneNumbers])];
      
      if (!groupName || participants.length === 0) {
        const usageMsg = await t(from, 'create', 'usage');
        return sock.sendMessage(from, {
          text: usageMsg
        }, { quoted: msg });
      }
      
      try {
        const group = await sock.groupCreate(groupName, participants);
        const welcomeMsg = await t(from, 'create', 'welcome');
        await sock.sendMessage(group.id, { text: welcomeMsg });
      } catch {
        const errorMsg = await t(from, 'create', 'error');
        await sock.sendMessage(from, { text: errorMsg }, { quoted: msg });
      }
    }
  }
]; 
