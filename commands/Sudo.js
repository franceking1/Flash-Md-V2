import { normalizeJid, saveSudoList, MESSAGES } from '../france/index.js';
import { t, translate, translateAIResponse, getUserLang } from '../france/translator.js';

export const commands = [
  {
    name: 'sudo',
    description: 'Add, remove, or list users with sudo access.',
    category: 'Owner',
    ownerOnly: true,
    execute: async ({ sock, from, text, msg, args }) => {
      const commandType = args[0]?.toLowerCase();

      if (commandType === 'list') {
        const list = [...global.ALLOWED_USERS];
        if (list.length === 0) {
          const listEmptyMsg = await t(from, 'sudo', 'listEmpty');
          return sock.sendMessage(from, {
            text: listEmptyMsg
          }, { quoted: msg });
        }

        const listHeaderMsg = await t(from, 'sudo', 'listHeader');
        const responseText = listHeaderMsg + list.map((n, i) => `${i + 1}. +${n}`).join('\n');
        return sock.sendMessage(from, { text: responseText }, { quoted: msg });
      }

      const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant ||
                     msg.message?.extendedTextMessage?.contextInfo?.remoteJidAlt;

      if (!quoted) {
        const noReplyMsg = await t(from, 'sudo', 'noReply');
        return sock.sendMessage(from, {
          text: noReplyMsg
        }, { quoted: msg });
      }

      const jid = normalizeJid(quoted);
      const number = jid.split('@')[0];

      if (commandType === 'add') {
        global.ALLOWED_USERS.add(number);
        saveSudoList(global.ALLOWED_USERS);
        const addedMsg = await t(from, 'sudo', 'added');
        return sock.sendMessage(from, {
          text: addedMsg.replace('{number}', number)
        }, { quoted: msg });
      } else if (commandType === 'del') {
        global.ALLOWED_USERS.delete(number);
        saveSudoList(global.ALLOWED_USERS);
        const removedMsg = await t(from, 'sudo', 'removed');
        return sock.sendMessage(from, {
          text: removedMsg.replace('{number}', number)
        }, { quoted: msg });
      } else {
        const invalidMsg = await t(from, 'sudo', 'invalid');
        return sock.sendMessage(from, {
          text: invalidMsg
        }, { quoted: msg });
      }
    }
  }
];
