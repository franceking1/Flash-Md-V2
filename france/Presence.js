
export async function getOnlineMembers(sock, groupJid) {
    try {
        const metadata = await sock.groupMetadata(groupJid);
        const participants = metadata.participants;
        const onlineUsers = [];
        
        for (const participant of participants) {
            try {
                await sock.presenceSubscribe(participant.id);
                await new Promise(res => setTimeout(res, 500));
                
                const presenceData = sock.userPresence?.[participant.id];
                if (presenceData && presenceData.lastKnownPresence === 'available') {
                    onlineUsers.push(participant.id);
                }
            } catch (err) {
                continue;
            }
        }
        
        await new Promise(res => setTimeout(res, 2000));
        
        return onlineUsers;
    } catch (error) {
        console.error('Error getting online members:', error);
        return [];
    }
}
