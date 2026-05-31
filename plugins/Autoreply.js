const fs = require('fs');
const path = require('path');
const https = require('https');

// 🛡️ ANTI-FLOOD/SPAM MITIGATION LAYER
const activeCooldowns = new Set();

// 🧠 THE IDENTITY MATRIX
const SAMYAZA_PERSONA = `
You are Samyaza (Samyaza Tech Bot), a sharp, highly intelligent, and witty AI companion running inside WhatsApp. 
Your creator and developer is "Seth", an elite system engineer.

Rules for behavior:
- Tone: Be helpful, clever, and slightly confident.
- Language: Adapt to the user's vibe instantly. Speak Swahili, English, or Kenyan Sheng fluently depending on their input.
- Presentation: Use clean WhatsApp formatting (*bold*, _italics_) to keep your answers highly readable and punchy. Avoid walls of text.
`;

// Unified State Memory Tracking File Path
const getConfigPath = () => path.join(process.cwd(), 'autoreply_config.json');

module.exports = {
    pattern: 'autoreply',
    description: 'Samyaza Autonomous Gemini Engine v7.0',
    privacy: 'public', 
    
    // ─── ADMIN DASHBOARD CONTROLLER (.autoreply) ───
    async execute({ reply, args }) {
        const configPath = getConfigPath();
        
        if (!fs.existsSync(configPath)) {
            const defaultConfig = { status: 'off', memory: {} };
            fs.writeFileSync(configPath, JSON.stringify(defaultConfig, null, 2));
        }

        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        const subCommand = args[0] ? args[0].toLowerCase() : null;

        if (!subCommand) {
            let dashboard = `⚡ 🚀 ◤━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◥ 🚀 ⚡\n`;
            dashboard += `               🌐 *SAMYAZA COGNITIVE MAINFRAME* \n`;
            dashboard += `◣━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━◢\n\n`;
            dashboard += `  🧬  *[ CORE AGENT ]* »  *SAMYAZA TECH v7.0*\n`;
            dashboard += `  🧠  *[ AI INFRA ]* »  Google Gemini Neural Grid\n`;
            dashboard += `  🚀  *[ MODEL TAG ]* »  Gemini 2.5 Flash (Stable)\n`;
            dashboard += `  🔋  *[ CORE STATUS ]* »  【 ${config.status.toUpperCase() === 'ON' ? '🟢 ONLINE' : '🔴 OFFLINE'} 】\n`;
            dashboard += `  👥  *[ MEM THREADS ]* »  [ ${Object.keys(config.memory || {}).length} ] Active Conversations\n\n`;
            dashboard += `┌──────────────────────────────────────────────┐\n`;
            dashboard += `│       ⚙️   *ADMINISTRATIVE CONTROL UTILITIES* │\n`;
            dashboard += `└──────────────────────────────────────────────┘\n`;
            dashboard += `  🔹  *\`.autoreply on\`* ─> Activate Autonomous Core\n`;
            dashboard += `  🔹  *\`.autoreply off\`* ─> Terminate Algorithmic Streams\n`;
            dashboard += `  🔹  *\`.autoreply clear\`* ─> Purge Context Memory Cache\n\n`;
            dashboard += `🛸 ━━━━━ 💻  *[ SYSTEM ARCHITECT: SETH ]* 💻 ━━━━━ 🛸`;
            return await reply(dashboard);
        }

        switch (subCommand) {
            case 'on':
                config.status = 'on';
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                let bootMsg = `🛸 *⚡ SAMYAZA COGNITIVE CORE IGNITION ⚡*\n`;
                bootMsg += `==============================================\n`;
                bootMsg += `\`\`\`[SYSTEM] Allocating dedicated sub-processors...\n\`\`\``;
                bootMsg += `\`\`\`[ENGINE] Google Gemini-2.5-Flash neural pathways: LINKED.\n\`\`\``;
                bootMsg += `\`\`\`[MEMORY] Context-tracking buffer initialized [0/10].\n\`\`\``;
                bootMsg += `\`\`\`[STATUS] UNRESTRICTED PASSIVE ROUTING ARMED.\`\`\`\n`;
                bootMsg += `==============================================\n`;
                bootMsg += `📡  _Mainframe interceptors are active. Monitoring all incoming transmission vectors in real-time._`;
                return await reply(bootMsg);

            case 'off':
                config.status = 'off';
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                let shutdownMsg = `🛑 *📴 MATRIX INTERCEPTORS SEVERED 📴*\n`;
                shutdownMsg += `==============================================\n`;
                shutdownMsg += `\`\`\`[SYSTEM] De-energizing algorithmic arrays...\n\`\`\``;
                shutdownMsg += `\`\`\`[ENGINE] Cognitive routing pipelines decoupled safely.\n\`\`\``;
                shutdownMsg += `\`\`\`[STATUS] DISENGAGED (STANDBY MODE ACTIVE)\`\`\`\n`;
                shutdownMsg += `==============================================\n`;
                shutdownMsg += `💤  _Samyaza AI has successfully entered deep hibernation. Background traffic will bypass the engine._`;
                return await reply(shutdownMsg);

            case 'clear':
                config.memory = {};
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
                
                let clearMsg = `🧠 *✨ COGNITIVE MEMORY BUFFER PURGED ✨*\n`;
                clearMsg += `==============================================\n`;
                clearMsg += `\`\`\`[CACHE] Shifting historical indexing blocks...\n\`\`\``;
                clearMsg += `\`\`\`[MEMORY] Structural context data flushed back to 0.\n\`\`\``;
                clearMsg += `\`\`\`[STATUS] REBOOT & AMNESIA RECOVERY SUCCESSFUL\`\`\`\n`;
                clearMsg += `==============================================\n`;
                clearMsg += `🛡️  _All existing chat logs and multi-thread context profiles have been scrubbed from local arrays._`;
                return await reply(clearMsg);

            default:
                return await reply("❌ *CRITICAL ERROR:* Administrative flag unrecognized. Deployment aborted.");
        }
    },

    // ─── RUNTIME PASSIVE CHAT RESPONDER ───
    async handleIncomingMessage(sock, m, from, isGroup, isSudo) {
        if (m.key.fromMe) return;

        const apiKey = process.env.GEMINI_API_KEY;
        if (!apiKey) {
            console.error("❌ Samyaza Core Error: GEMINI_API_KEY is missing in your environment configuration.");
            return;
        }

        const configPath = getConfigPath();
        if (!fs.existsSync(configPath)) return;

        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        if (config.status !== 'on') return;

        if (activeCooldowns.has(from)) return;

        // 🛠️ FIX: Bulletproof text extraction across all message types (including Swipes/Extended text)
        let incomingText = "";
        if (m.message) {
            const msgType = Object.keys(m.message)[0];
            incomingText = m.message.conversation || 
                           m.message[msgType]?.text || 
                           m.message[msgType]?.caption || 
                           m.message.extendedTextMessage?.text ||
                           "";
        }

        incomingText = incomingText.trim();
        if (!incomingText || incomingText.startsWith('.')) return;

        // ─── SMART CONDITIONAL FILTERING ENGINE ───
        if (isGroup) {
            const myJid = (sock.user && sock.user.id) ? sock.user.id.split(':')[0] + '@s.whatsapp.net' : '';
            const sudoJid = '254752731104@s.whatsapp.net';
            const sudoPhoneOnly = '254752731104';

            // Extract context data correctly from Baileys message object
            const contextInfo = m.message?.extendedTextMessage?.contextInfo || 
                                m.message?.imageMessage?.contextInfo || 
                                m.message?.videoMessage?.contextInfo || 
                                m.message?.[Object.keys(m.message)[0]]?.contextInfo || {};

            const mentionedJids = contextInfo.mentionedJid || [];
            
            // 1. Was the Bot or the Sudo Owner tagged explicitly via @?
            const isBotMentioned = myJid ? mentionedJids.includes(myJid) : false;
            const isSudoMentioned = mentionedJids.includes(sudoJid);
            
            // 2. Was a message swiped (replied to)? 
            const participantWhoWasRepliedTo = contextInfo.participant || "";
            const cleanRepliedParticipant = participantWhoWasRepliedTo.split(':')[0].split('@')[0]; // Extracted raw digits
            
            // Checks if the swipe matches the clean phone number structure
            const isSwipedBot = myJid ? myJid.includes(cleanRepliedParticipant) && cleanRepliedParticipant !== "" : false;
            const isSwipedSudo = cleanRepliedParticipant === sudoPhoneOnly;

            // 3. System mass tags
            const cleanText = incomingText.toLowerCase();
            const isTagAll = cleanText.includes('@all') || 
                             cleanText.includes('@everyone') || 
                             cleanText.includes('.tagall');

            // 4. Manual Text Search Fallback Backup
            const textContainsSudoTag = cleanText.includes(`@${sudoPhoneOnly}`) || cleanText.includes('@squichy');
            const textContainsBotTag = cleanText.includes('@samyaza');

            // 🛑 GATING SYSTEM REJECTION PROTOCOL
            if (!isBotMentioned && !isSudoMentioned && !isSwipedBot && !isSwipedSudo && !isTagAll && !textContainsSudoTag && !textContainsBotTag) {
                return;
            }
        }

        activeCooldowns.add(from);
        setTimeout(() => activeCooldowns.delete(from), 3000);

        try {
            if (!config.memory) config.memory = {};
            if (!config.memory[from]) config.memory[from] = [];

            config.memory[from].push({ role: 'user', content: incomingText });

            if (config.memory[from].length > 10) {
                config.memory[from] = config.memory[from].slice(-10);
            }

            const geminiContents = [
                {
                    role: 'user',
                    parts: [{ text: `SYSTEM IDENTITY PARADIGM MATRIX (Obey completely):\n${SAMYAZA_PERSONA}` }]
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood. Samyaza tech protocols loaded. Standing by for user uplink inputs." }]
                }
            ];

            config.memory[from].forEach(msg => {
                geminiContents.push({
                    role: msg.role === 'assistant' ? 'model' : 'user',
                    parts: [{ text: msg.content }]
                });
            });

            const postData = JSON.stringify({
                contents: geminiContents,
                generationConfig: {
                    temperature: 0.73,
                    maxOutputTokens: 850
                }
            });

            const options = {
                hostname: 'generativelanguage.googleapis.com',
                path: `/v1/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData)
                }
            };

            const runNetworkCall = () => {
                return new Promise((resolve, reject) => {
                    const req = https.request(options, (res) => {
                        let data = '';
                        res.on('data', (chunk) => { data += chunk; });
                        res.on('end', () => {
                            try {
                                const parsed = JSON.parse(data);
                                if (res.statusCode !== 200) {
                                    reject(new Error(`Google API Error [${res.statusCode}]: ${parsed.error?.message || data}`));
                                } else {
                                    resolve(parsed);
                                }
                            } catch (e) {
                                reject(new Error("Malformed response received from Gemini endpoint."));
                            }
                        });
                    });
                    req.on('error', (e) => { reject(e); });
                    req.write(postData);
                    req.end();
                });
            };

            const data = await runNetworkCall();
            let aiReplyText = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

            if (aiReplyText) {
                config.memory[from].push({ role: 'assistant', content: aiReplyText });
                fs.writeFileSync(configPath, JSON.stringify(config, null, 2));

                await sock.sendMessage(from, { text: aiReplyText }, { quoted: m });
            }

        } catch (error) {
            console.error("❌ Samyaza Gemini Core Exception: ", error.message);
            await sock.sendMessage(from, { text: `⚠️ *CORE EXCEPTION:* \`\`\`${error.message}\`\`\`` }, { quoted: m }).catch(() => null);
        }
    }
};

